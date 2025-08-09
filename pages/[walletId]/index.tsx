import { DisplayAddress } from 'common/DisplayAddress'
import { executeTransaction } from 'common/Transactions'
import { FanoutClient } from '@metaplex-foundation/mpl-hydra/dist/src'
import { Wallet } from '@coral-xyz/anchor/dist/cjs/provider'
import { useWallet } from '@solana/wallet-adapter-react'
import { PublicKey, Transaction } from '@solana/web3.js'
import { AsyncButton } from 'common/Button'
import { Header } from 'common/Header'
import { notify } from 'common/Notification'
import {
  getMintNaturalAmountFromDecimal,
  getPriorityFeeIx,
  pubKeyUrl,
  shortPubKey,
  tryPublicKey,
} from 'common/utils'
import { asWallet } from 'common/Wallets'
import { paymentMintConfig } from 'config/paymentMintConfig'
import { FanoutData, useFanoutData } from 'hooks/useFanoutData'
import { useFanoutMembershipMintVouchers } from 'hooks/useFanoutMembershipMintVouchers'
import { useFanoutMembershipVouchers } from 'hooks/useFanoutMembershipVouchers'
import { useFanoutMints } from 'hooks/useFanoutMints'
import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useEnvironmentCtx } from 'providers/EnvironmentProvider'
import React, { useEffect, useState, useCallback } from 'react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { TextureButton } from '@/components/ui/texture-button'
import { formatValue } from 'common/format'
// Removed expandable wrappers for primary layout; using simpler panels now

const Home: NextPage = () => {
  const router = useRouter()
  const [mintId, setMintId] = useState<string | undefined>()
  const [mounted, setMounted] = useState(false)
  const fanoutMembershipVouchers = useFanoutMembershipVouchers()
  const fanoutMints = useFanoutMints()
  const wallet = useWallet()
  const fanoutData = useFanoutData()
  const { connection, environment } = useEnvironmentCtx()
  let selectedFanoutMint =
    mintId && fanoutMints.data
      ? fanoutMints.data.find((mint) => mint.data.mint.toString() === mintId)
      : undefined
  const fanoutMembershipMintVouchers = useFanoutMembershipMintVouchers(mintId)
  const [voucherMapping, setVoucherMapping] = useState<{
    [key: string]: string
  }>({})

  const fanoutMintIds = fanoutMints.data?.map((m) => m.id.toString()).join(',')
  const selectSplToken = useCallback((mintId: string) => {
    setMintId(mintId === 'default' ? undefined : mintId)
    const fanoutMint = fanoutMints.data?.find(
      (fanoutMint) => fanoutMint.data.mint.toString() === mintId
    )
    if (environment.label === 'mainnet-beta' && fanoutMint) {
      router.push(`${location.pathname}#${fanoutMint.config.symbol ?? ''}`)
    }
  }, [environment.label, fanoutMints.data, router])

  useEffect(() => {
    const anchor = router.asPath.split('#')[1]
    const foundMint = fanoutMints.data?.find(
      (m) => m.config.symbol === anchor || m.id.toString() === anchor
    )
    if (foundMint?.data.mint && foundMint?.data.mint.toString() !== mintId) {
      selectSplToken(foundMint.data.mint.toString())
    }
  }, [router.asPath, fanoutMintIds, mintId, fanoutMints.data, selectSplToken])

  useEffect(() => {
    const setMapping = async () => {
      if (fanoutMembershipVouchers.data && selectedFanoutMint) {
        let mapping: { [key: string]: string } = {}
        for (const voucher of fanoutMembershipVouchers.data!) {
          const [mintMembershipVoucher] =
            await FanoutClient.mintMembershipVoucher(
              selectedFanoutMint.id,
              voucher.parsed.membershipKey,
              new PublicKey(mintId!)
            )
          mapping[voucher.pubkey.toString()] = mintMembershipVoucher.toString()
        }
        setVoucherMapping(mapping)
      } else {
        setVoucherMapping({})
      }
    }
    setMapping()
  }, [fanoutMembershipVouchers.data, selectedFanoutMint, mintId])

  useEffect(() => {
    setMounted(true)
  }, [])

  async function addSplToken() {
    if (fanoutData.data?.fanoutId) {
      try {
        const tokenAddress = prompt('Please enter an SPL token address:')
        const tokenPK = tryPublicKey(tokenAddress)
        if (!tokenPK) {
          throw 'Invalid SPL token address, please enter a valid address based on your network'
        }
        const fanoutSdk = new FanoutClient(connection, asWallet(wallet!))
        const transaction = new Transaction()
        transaction.add(
          ...(
            await fanoutSdk.initializeFanoutForMintInstructions({
              fanout: fanoutData.data?.fanoutId,
              mint: tokenPK,
            })
          ).instructions
        )
        await executeTransaction(connection, wallet as Wallet, transaction, {})
        notify({
          message: 'SPL Token added!',
          description: `Select the new token in the dropdown menu.`,
          type: 'success',
        })
      } catch (e) {
        notify({
          message: 'Error adding SPL Token',
          description: `${e}`,
          type: 'error',
        })
      }
    }
  }

  // selectSplToken now defined with useCallback above

  const distributeShare = async (
    fanoutData: FanoutData,
    addAllMembers: boolean
  ) => {
    try {
      if (wallet && wallet.publicKey && fanoutData.fanoutId) {
        const fanoutSdk = new FanoutClient(connection, asWallet(wallet!))
        if (addAllMembers) {
          if (fanoutMembershipVouchers.data) {
            const distributionMemberSize = 5
            const vouchers = fanoutMembershipVouchers.data
            for (let i = 0; i < vouchers.length; i += distributionMemberSize) {
              let transaction = new Transaction()
              const chunk = vouchers.slice(i, i + distributionMemberSize)
              for (const voucher of chunk) {
                let distMember =
                  await fanoutSdk.distributeWalletMemberInstructions({
                    fanoutMint: selectedFanoutMint
                      ? selectedFanoutMint?.data.mint
                      : undefined,
                    distributeForMint: selectedFanoutMint ? true : false,
                    member: voucher.parsed.membershipKey,
                    fanout: fanoutData.fanoutId,
                    payer: wallet.publicKey,
                  })
                transaction.instructions = [
                  ...transaction.instructions,
                  ...distMember.instructions,
                ]
              }

              transaction.feePayer = wallet.publicKey
              const priorityFeeIx = await getPriorityFeeIx(
                connection,
                transaction
              )
              transaction.add(priorityFeeIx)
              const { blockhash } = await connection.getLatestBlockhash()
              transaction.recentBlockhash = blockhash
              transaction = await wallet.signTransaction!(transaction)

              const signature = await connection.sendRawTransaction(
                transaction.serialize(),
                { maxRetries: 3 }
              )

              console.info('Tx sig:', signature)

              await connection.confirmTransaction(signature, 'confirmed')

              const numTransactions = Math.ceil(vouchers.length / 5)
              notify({
                message: `(${
                  i / 5 + 1
                } / ${numTransactions}) Claim tx successful`,
                description: `Claimed shares for ${
                  i + distributionMemberSize > vouchers.length
                    ? vouchers.length
                    : i + distributionMemberSize
                } / ${vouchers.length} from ${fanoutData.fanout.name}`,
                type: 'success',
              })
            }
          } else {
            throw 'No membership data found'
          }
        } else {
          let transaction = new Transaction()
          let distMember = await fanoutSdk.distributeWalletMemberInstructions({
            distributeForMint: false,
            member: wallet.publicKey,
            fanout: fanoutData.fanoutId,
            payer: wallet.publicKey,
          })
          transaction.instructions = [...distMember.instructions]
          await executeTransaction(connection, asWallet(wallet), transaction, {
            confirmOptions: { commitment: 'confirmed', maxRetries: 3 },
            signers: [],
          })
          notify({
            message: `Claim successful`,
            description: `Successfully claimed ${
              addAllMembers ? "everyone's" : 'your'
            } share from ${fanoutData.fanout.name}`,
            type: 'success',
          })
        }
      }
    } catch (e) {
      notify({
        message: `Error claiming your share: ${e}`,
        type: 'error',
      })
    }
  }

  // Reusable small stat card component
  const StatCard = ({
    title,
    subtitle,
    value,
    unit,
    color,
  }: {
    title: string
    subtitle: string
    value: any
    unit?: string
    color: 'green' | 'blue' | 'orange'
  }) => {
    const colorMap: Record<string, string> = {
      green: 'from-emerald-900/25 to-emerald-800/10 border-emerald-500/25',
      blue: 'from-blue-900/25 to-blue-800/10 border-blue-500/25',
      orange: 'from-orange-900/25 to-orange-800/10 border-orange-500/25',
    }

    const displayValue = formatValue(value)

    return (
      <div className={`rounded-2xl border ${colorMap[color]} bg-gradient-to-br backdrop-blur-md p-6 shadow-sm hover:shadow-md transition-shadow`}>        
        <div className="mb-4 space-y-1">
          <div className="text-sm font-medium text-white/90 tracking-wide">{title}</div>
          <div className="text-xs text-gray-400">{subtitle}</div>
        </div>
        <div className="flex items-end gap-2">
          <div className="text-3xl font-semibold leading-none bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            {mounted ? displayValue : <span className="h-6 w-20 bg-gray-700/40 animate-pulse rounded" />}
          </div>
          {unit && <span className="text-sm text-gray-400 pb-1 font-medium">{unit}</span>}
        </div>
      </div>
    )
  }

  if (fanoutData.error) {
    return (
      <DashboardLayout>
        <div className="max-w-lg mx-auto mt-10 rounded-xl border border-red-500/30 bg-red-900/20 backdrop-blur p-8 space-y-5 text-center shadow-lg">
          <h1 className="text-2xl font-semibold bg-gradient-to-r from-red-300 to-red-200 bg-clip-text text-transparent">Hydra Wallet Not Found</h1>
          <p className="text-sm text-red-200/80 leading-relaxed">The requested wallet could not be found or accessed.</p>
          <TextureButton
            onClick={() =>
              router.push(
                `/${
                  environment.label !== 'mainnet-beta'
                    ? `?cluster=${environment.label}`
                    : ''
                }`,
                undefined,
                { shallow: true }
              )
            }
            variant="secondary"
            className="h-11 w-full font-medium"
          >
            Return to Dashboard
          </TextureButton>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-14">
        {/* Heading */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-semibold tracking-tight bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
            {mounted && fanoutData.data?.fanout.name ? 
              fanoutData.data.fanout.name : 
              <span className="inline-block h-10 w-64 animate-pulse rounded-md bg-gray-700/30" />
            }
          </h1>
          <p className="text-gray-400 text-sm md:text-base max-w-2xl mx-auto">
            Treasury wallet management and distribution
          </p>
        </div>

        {/* Metrics */}
        <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Total Inflow"
            subtitle="All-time received"
            color="green"
            value={selectedFanoutMint ? (
              formatValue(
                getMintNaturalAmountFromDecimal(
                  Number(selectedFanoutMint.data.totalInflow),
                  selectedFanoutMint.info.decimals
                )
              )
            ) : fanoutData.data?.fanout ? (
              formatValue(
                parseInt(
                  fanoutData.data?.fanout?.totalInflow.toString() ?? '0'
                ) / 1e9
              )
            ) : (
              <span className="h-6 w-20 bg-gray-700/40 animate-pulse rounded" />
            )}
            unit={selectedFanoutMint ? selectedFanoutMint.config.symbol : 'SOL'}
          />
          <StatCard
            title="Current Balance"
            subtitle="Available now"
            color="blue"
            value={selectedFanoutMint ? (
              formatValue(selectedFanoutMint.balance)
            ) : (
              formatValue(fanoutData.data?.balance)
            )}
            unit={selectedFanoutMint ? selectedFanoutMint.config.symbol : 'SOL'}
          />
          <StatCard
            title="Members"
            subtitle="Active wallets"
            color="orange"
            value={formatValue(fanoutData.data?.fanout?.totalMembers)}
          />
          <StatCard
            title="Total Shares"
            subtitle="Distribution units"
            color="orange"
            value={formatValue(fanoutData.data?.fanout?.totalShares)}
          />
        </div>

        {/* Token Selection & Addresses */}
        <div className="grid gap-10 lg:grid-cols-5">
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-2xl border border-gray-800/60 bg-gray-900/60 backdrop-blur p-6 shadow-sm space-y-4">
              <h2 className="text-lg font-medium text-white">Token Selection</h2>
              <select
                className="flex h-11 w-full rounded-lg border border-gray-700/50 bg-gray-800/60 px-4 text-sm text-white focus:border-purple-400/60 focus:ring-2 focus:ring-purple-400/20 hover:bg-gray-700/60 transition"
                value={mintId || 'default'}
                onChange={(e) => selectSplToken(e.target.value)}
              >
                <option value="default">SOL</option>
                {fanoutMints.data?.map((fanoutMint) => (
                  <option
                    key={fanoutMint.id.toString()}
                    value={fanoutMint.data.mint.toString()}
                  >
                    {paymentMintConfig[fanoutMint.data.mint.toString()]
                      ? paymentMintConfig[fanoutMint.data.mint.toString()]?.name
                      : shortPubKey(fanoutMint.data.mint.toString())}
                  </option>
                ))}
              </select>
            </div>
            <div className="rounded-2xl border border-gray-800/60 bg-gray-900/50 backdrop-blur p-6 shadow-sm space-y-6">
              <h2 className="text-lg font-medium text-white">Addresses</h2>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[11px] font-medium uppercase tracking-wide text-gray-400">Fanout Address</label>
                  <a
                    className="text-purple-400 hover:text-purple-300 transition-colors font-mono bg-gray-800/40 px-3 py-2 rounded border border-gray-700/40 block text-xs"
                    target="_blank"
                    rel="noopener noreferrer"
                    href={pubKeyUrl(fanoutData.data?.fanoutId, environment.label)}
                  >
                    {shortPubKey(fanoutData.data?.fanoutId.toString())}
                  </a>
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-medium uppercase tracking-wide text-gray-400">
                    {selectedFanoutMint ? `${selectedFanoutMint.config.symbol} Token Account` : 'SOL Wallet Address'}
                  </label>
                  <a
                    className="text-purple-400 hover:text-purple-300 transition-colors font-mono bg-gray-800/40 px-3 py-2 rounded border border-gray-700/40 block text-xs"
                    target="_blank"
                    rel="noopener noreferrer"
                    href={pubKeyUrl(
                      selectedFanoutMint
                        ? selectedFanoutMint.data.tokenAccount
                        : fanoutData.data?.nativeAccount,
                      environment.label
                    )}
                  >
                    {shortPubKey(
                      selectedFanoutMint
                        ? selectedFanoutMint.data.tokenAccount
                        : fanoutData.data?.nativeAccount
                    )}
                  </a>
                </div>
              </div>
            </div>
          </div>
          {/* Members List */}
          <div className="lg:col-span-3">
            <div className="rounded-2xl border border-gray-800/60 bg-gray-900/50 backdrop-blur p-6 shadow-sm space-y-6">
              <div>
                <h2 className="text-lg font-medium text-white mb-1">Members & Distribution</h2>
                <p className="text-xs text-gray-400">Wallet members, their shares, and claim status.</p>
              </div>
              <div className="space-y-3">
                {!fanoutMembershipVouchers.data ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="h-14 w-full animate-pulse bg-gray-700/30 rounded-md" />
                  ))
                ) : (
                  fanoutMembershipVouchers.data?.map((voucher, index) => {
                    const sharePercentage = ((Number(voucher.parsed.shares.toString()) / Number((fanoutData.data?.fanout?.totalShares || 1).toString())) * 100).toFixed(1)
                    return (
                      <div
                        key={voucher.pubkey.toString()}
                        className="flex items-center justify-between gap-4 p-4 rounded-lg border border-gray-800/70 bg-gray-800/40 hover:bg-gray-800/60 transition group"
                      >
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <div className="w-9 h-9 rounded-md bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white text-xs font-semibold">
                            {String.fromCharCode(65 + (index % 26))}
                          </div>
                          <div className="flex-1 min-w-0">
                            <DisplayAddress connection={connection} address={voucher.parsed.membershipKey} />
                            <div className="text-[10px] text-gray-500 mt-0.5">Member #{index + 1}</div>
                          </div>
                        </div>
                        <div className="text-right space-y-1">
                          <div className="text-lg font-semibold text-white">{sharePercentage}%</div>
                          <div className="text-[11px] text-gray-400 font-medium">{formatValue(voucher.parsed.shares)} shares</div>
                          <div className="text-[10px] text-gray-500">
                            {selectedFanoutMint
                              ? fanoutMembershipMintVouchers.data && fanoutMembershipMintVouchers.data.length > 0
                                ? `${
                                    Number(
                                      getMintNaturalAmountFromDecimal(
                                        Number(
                                          fanoutMembershipMintVouchers.data.filter(
                                            (v) => v.pubkey.toString() === voucherMapping[voucher.pubkey.toString()]
                                          )[0]?.parsed.lastInflow
                                        ),
                                        selectedFanoutMint.info.decimals
                                      )
                                    ) * (Number(voucher.parsed.shares.toString()) / 100)
                                  } ${selectedFanoutMint.config.symbol} claimed`
                                : `0 ${selectedFanoutMint.config.symbol} claimed`
                              : `${parseInt(voucher.parsed.totalInflow?.toString?.() || String(voucher.parsed.totalInflow || '0')) / 1e9} ◎ claimed`}
                          </div>
                          <div className="w-14 h-1 bg-gray-700 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-purple-500 to-purple-400 rounded-full transition-all"
                              style={{ width: `${Math.min(100, Number(sharePercentage))}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    )
                  })
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="rounded-2xl border border-gray-800/60 bg-gray-900/60 backdrop-blur p-6 shadow-sm max-w-4xl mx-auto">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium uppercase tracking-wide text-gray-400">Primary Actions</span>
                <span className="flex items-center gap-2 text-[10px] text-green-400 font-medium"><span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />Ready</span>
              </div>
              <TextureButton
                onClick={() => fanoutData.data && distributeShare(fanoutData.data, true)}
                disabled={!fanoutData.data}
                variant="accent"
                className="w-full h-12 text-sm font-semibold"
              >
                Distribute To All Members
                <span className="text-[10px] opacity-70 ml-2">({fanoutData.data?.fanout?.totalMembers || 0})</span>
              </TextureButton>
            </div>
            {fanoutData.data && fanoutData.data.fanout.authority.toString() === wallet.publicKey?.toString() && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium uppercase tracking-wide text-gray-400">Management</span>
                  <span className="flex items-center gap-2 text-[10px] text-orange-400 font-medium"><span className="w-2 h-2 bg-orange-400 rounded-full" />Admin</span>
                </div>
                <TextureButton
                  onClick={() => addSplToken()}
                  variant="secondary"
                  className="w-full h-12 text-sm font-semibold"
                >
                  Add SPL Token
                </TextureButton>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default Home
