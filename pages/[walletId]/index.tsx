// DisplayAddress requires WalletIdentity provider, using shortPubKey instead
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
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { useEnvironmentCtx } from 'providers/EnvironmentProvider'
import { useEffect, useState } from 'react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { TextureButton } from '@/components/ui/texture-button'

// Reusable StatCard component
const StatCard = ({
  title,
  subtitle,
  value,
  unit,
  color,
  mounted = true
}: {
  title: string
  subtitle: string
  value: any
  unit?: string
  color: 'green' | 'blue' | 'orange'
  mounted?: boolean
}) => {
  const colorMap: Record<string, string> = {
    green: 'from-emerald-900/25 to-emerald-800/10 border-emerald-500/25',
    blue: 'from-blue-900/25 to-blue-800/10 border-blue-500/25',
    orange: 'from-orange-900/25 to-orange-800/10 border-orange-500/25',
  }

  const displayValue = typeof value === 'string' ? value : String(value)

  return (
    <div className={`rounded-2xl border ${colorMap[color]} bg-gradient-to-br backdrop-blur-md p-6 shadow-sm hover:shadow-md transition-shadow`}>        
      <div className="mb-4 space-y-1">
        <div className="text-sm font-medium text-white/90 tracking-wide">{String(title)}</div>
        <div className="text-xs text-gray-400">{String(subtitle)}</div>
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

  useEffect(() => {
    const anchor = router.asPath.split('#')[1]
    const fanoutMint = fanoutMints.data?.find(
      (fanoutMint) =>
        fanoutMint.config.symbol === anchor ||
        fanoutMint.id.toString() === anchor
    )
    if (fanoutMint?.data.mint && fanoutMint?.data.mint.toString() !== mintId) {
      selectSplToken(fanoutMint?.data.mint.toString())
    }
  }, [
    router,
    fanoutMints.data?.map((fanoutMint) => fanoutMint.id.toString()).join(','),
  ])

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

  const selectSplToken = (mintId: string) => {
    setMintId(mintId === 'default' ? undefined : mintId)
    const fanoutMint = fanoutMints.data?.find(
      (fanoutMint) => fanoutMint.data.mint.toString() === mintId
    )
    if (environment.label === 'mainnet-beta') {
      router.push(`${location.pathname}#${fanoutMint?.config.symbol ?? ''}`)
    }
  }

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

  return (
    <DashboardLayout>
      <div className="space-y-10">
        {/* Error State */}
        {fanoutData.error && (
          <div className="rounded-xl border border-red-500/30 bg-red-900/20 backdrop-blur p-6 text-center">
            <h3 className="text-xl font-semibold text-red-300 mb-2">Hydra Wallet Not Found</h3>
            <TextureButton 
              onClick={() => router.push(`/${environment.label !== 'mainnet-beta' ? `?cluster=${environment.label}` : ''}`)}
              variant="secondary"
              className="mt-4"
            >
              Return to Dashboard
            </TextureButton>
          </div>
        )}

        {/* Heading */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-semibold tracking-tight bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
            {mounted && fanoutData.data?.fanout?.name ? 
              String(fanoutData.data.fanout.name) : 
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
            mounted={mounted}
            value={selectedFanoutMint ? (
              `${Number(
                getMintNaturalAmountFromDecimal(
                  Number(selectedFanoutMint.data.totalInflow),
                  selectedFanoutMint.info.decimals
                )
              )}`
            ) : fanoutData.data?.fanout ? (
              `${parseInt(
                fanoutData.data?.fanout?.totalInflow.toString() ?? '0'
              ) / 1e9}`
            ) : (
              '--'
            )}
            unit={selectedFanoutMint ? selectedFanoutMint.config.symbol : 'SOL'}
          />
          <StatCard
            title="Current Balance"
            subtitle="Available now"
            color="blue"
            mounted={mounted}
            value={selectedFanoutMint ? (
              `${selectedFanoutMint.balance}`
            ) : (
              `${fanoutData.data?.balance || '--'}`
            )}
            unit={selectedFanoutMint ? selectedFanoutMint.config.symbol : 'SOL'}
          />
          <StatCard
            title="Members"
            subtitle="Active wallets"
            color="orange"
            mounted={mounted}
            value={`${fanoutData.data?.fanout?.totalMembers || '--'}`}
          />
          <StatCard
            title="Total Shares"
            subtitle="Distribution units"
            color="orange"
            mounted={mounted}
            value={`${fanoutData.data?.fanout?.totalShares || '--'}`}
          />
        </div>

        {/* Token Selection & Wallet Details */}
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Token Selection */}
          <div className="rounded-2xl border border-gray-800/60 bg-gray-900/60 backdrop-blur-md p-6">
            <div className="mb-4">
              <h3 className="text-xl font-semibold text-white mb-2">Token Selection</h3>
              <p className="text-gray-400 text-sm">Choose which token to view and manage</p>
            </div>
            <select
              value={mintId || 'default'}
              onChange={(e) => selectSplToken(e.target.value)}
              className="w-full h-12 bg-gray-800/50 border border-gray-700/50 text-white rounded-lg px-4 focus:border-purple-400/60 focus:ring-2 focus:ring-purple-400/20"
            >
              <option value="default">SOL</option>
              {fanoutMints.data?.map((fanoutMint) => (
                <option key={fanoutMint.id.toString()} value={fanoutMint.data.mint.toString()}>
                  {paymentMintConfig[fanoutMint.data.mint.toString()]?.name || shortPubKey(fanoutMint.data.mint.toString())}
                </option>
              ))}
            </select>
          </div>

          {/* Wallet Addresses */}
          <div className="rounded-2xl border border-gray-800/60 bg-gray-900/60 backdrop-blur-md p-6">
            <div className="mb-4">
              <h3 className="text-xl font-semibold text-white mb-2">Wallet Addresses</h3>
              <p className="text-gray-400 text-sm">Key addresses for this treasury</p>
            </div>
            <div className="space-y-3 text-sm">
              <div>
                <span className="text-gray-400">Fanout Address:</span>
                <a
                  href={pubKeyUrl(fanoutData.data?.fanoutId, environment.label)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-2 text-blue-400 hover:text-blue-300 font-mono"
                >
                  {shortPubKey(fanoutData.data?.fanoutId?.toString())}
                </a>
              </div>
              {selectedFanoutMint ? (
                <div>
                  <span className="text-gray-400">{selectedFanoutMint.config.symbol} Token Account:</span>
                  <a
                    href={pubKeyUrl(selectedFanoutMint.data.tokenAccount, environment.label)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-2 text-blue-400 hover:text-blue-300 font-mono"
                  >
                    {shortPubKey(selectedFanoutMint.data.tokenAccount)}
                  </a>
                </div>
              ) : (
                <div>
                  <span className="text-gray-400">SOL Wallet:</span>
                  <a
                    href={pubKeyUrl(fanoutData.data?.nativeAccount, environment.label)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-2 text-blue-400 hover:text-blue-300 font-mono"
                  >
                    {shortPubKey(fanoutData.data?.nativeAccount)}
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Members List */}
        <div className="rounded-2xl border border-gray-800/60 bg-gray-900/60 backdrop-blur-md p-6">
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-white mb-2">Members</h3>
            <p className="text-gray-400 text-sm">Wallet members and their share allocations</p>
          </div>
          {!fanoutMembershipVouchers.data ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-16 bg-gray-800/40 animate-pulse rounded-lg" />
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {fanoutMembershipVouchers.data.map((voucher, i) => (
                <div key={voucher.pubkey.toString()} className="flex items-center justify-between p-4 rounded-lg border border-gray-800/50 bg-gray-800/30 hover:bg-gray-800/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white text-sm font-semibold">
                      {String.fromCharCode(65 + (i % 26))}
                    </div>
                    <div>
                      <div className="text-white font-mono text-sm">
                        {mounted ? shortPubKey(voucher.parsed.membershipKey) : '...'}
                      </div>
                      <div className="text-gray-400 text-xs">
                        {selectedFanoutMint ?
                          fanoutMembershipMintVouchers.data && fanoutMembershipMintVouchers.data.length > 0 ?
                            `${Number(getMintNaturalAmountFromDecimal(
                              Number(fanoutMembershipMintVouchers.data.filter(
                                (v) => v.pubkey.toString() === voucherMapping[voucher.pubkey.toString()]
                              )[0]?.parsed.lastInflow),
                              selectedFanoutMint.info.decimals
                            )) * (Number(voucher.parsed.shares) / 100)} ${selectedFanoutMint.config.symbol} claimed` :
                            `0 ${selectedFanoutMint.config.symbol} claimed` :
                          `${parseInt(voucher.parsed.totalInflow.toString()) / 1e9}◎ claimed`
                        }
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="inline-block px-3 py-1 bg-purple-900/30 text-purple-300 border border-purple-500/30 rounded-lg text-sm font-medium">
                      {voucher.parsed.shares.toString()} shares
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-4">
          <AsyncButton
            type="button"
            variant="primary"
            bgColor="rgb(37 99 235)"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium"
            handleClick={async () => fanoutData.data && distributeShare(fanoutData.data, true)}
            disabled={!wallet.publicKey}
          >
            Distribute To All Members
          </AsyncButton>
          {fanoutData.data &&
            fanoutData.data.fanout.authority.toString() === wallet.publicKey?.toString() && (
            <AsyncButton
              type="button"
              variant="primary"
              bgColor="rgb(75 85 99)"
              className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-medium border border-gray-500"
              handleClick={addSplToken}
            >
              Add SPL Token
            </AsyncButton>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}

export default dynamic(() => Promise.resolve(Home), {
  ssr: false
})
