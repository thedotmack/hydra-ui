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
import { useEffect, useState } from 'react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { TextureButton } from '@/components/ui/texture-button'
import { Expandable, ExpandableCard, ExpandableContent, ExpandableCardHeader, ExpandableCardContent } from '@/components/ui/expandable'

const Home: NextPage = () => {
  const router = useRouter()
  const [mintId, setMintId] = useState<string | undefined>()
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
      <div className="space-y-8 p-8">
        {fanoutData.error && (
          <div className="max-w-4xl mx-auto">
            <Expandable>
              <ExpandableCard className="backdrop-blur-sm bg-gradient-to-br from-red-900/20 to-red-800/20 border border-red-500/20 shadow-2xl shadow-red-900/20">
                <ExpandableCardHeader className="space-y-4 px-8 py-6">
                  <div className="text-2xl font-semibold bg-gradient-to-r from-red-400 to-red-300 bg-clip-text text-transparent">Hydra Wallet Not Found</div>
                  <div className="text-red-200/80 text-lg leading-relaxed">
                    The requested wallet could not be found or accessed.
                  </div>
                </ExpandableCardHeader>
                <ExpandableCardContent className="px-8 pb-6">
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
                  variant="primary"
                  className="h-12"
                >
                  Return to Dashboard
                </TextureButton>
                </ExpandableCardContent>
              </ExpandableCard>
            </Expandable>
          </div>
        )}

        {/* Wallet Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-4">
            {fanoutData.data?.fanout.name || (
              <div className="h-10 w-64 animate-pulse bg-gray-700/30 rounded-md mx-auto"></div>
            )}
          </h1>
          <p className="text-gray-400 text-lg leading-relaxed max-w-2xl mx-auto">
            Treasury wallet management and distribution
          </p>
        </div>

        {/* Balance and Token Selection */}
        <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
          <Expandable>
            <ExpandableCard className="backdrop-blur-sm bg-gradient-to-br from-green-900/20 to-green-800/30 border border-green-500/20 shadow-xl shadow-green-900/25 hover:shadow-2xl hover:border-green-400/30 transition-all duration-300 hover:-translate-y-1">
              <ExpandableCardHeader className="pb-4 px-6 pt-6">
                <div className="text-lg font-semibold text-green-200">Total Inflow</div>
                <div className="text-green-300/70 leading-relaxed text-sm">Total funds received</div>
              </ExpandableCardHeader>
              <ExpandableCardContent className="px-6 pb-6">
                <div className="space-y-2">
                  <div className="text-5xl font-black tracking-tight">
                    {selectedFanoutMint ? (
                      <>
                        <span className="bg-gradient-to-r from-green-400 to-green-300 bg-clip-text text-transparent">
                          {Number(
                            getMintNaturalAmountFromDecimal(
                              Number(selectedFanoutMint.data.totalInflow),
                              selectedFanoutMint.info.decimals
                            )
                          )}
                        </span>
                        <span className="text-2xl text-gray-400 ml-2 font-semibold">
                          {selectedFanoutMint.config.symbol}
                        </span>
                      </>
                    ) : fanoutData.data?.fanout ? (
                      <>
                        <span className="bg-gradient-to-r from-green-400 to-green-300 bg-clip-text text-transparent">
                          {(parseInt(
                            fanoutData.data?.fanout?.totalInflow.toString() ?? '0'
                          ) / 1e9).toFixed(2)}
                        </span>
                        <span className="text-2xl text-gray-400 ml-2 font-semibold">
                          SOL
                        </span>
                      </>
                    ) : (
                      <div className="h-12 w-32 animate-pulse bg-gray-700/30 rounded-md"></div>
                    )}
                  </div>
                  <div className="text-xs text-green-400 font-medium flex items-center gap-1">
                    <div className="w-1 h-1 bg-green-400 rounded-full"></div>
                    All-time inflow
                  </div>
                </div>
              </ExpandableCardContent>
              <ExpandableContent preset="slide-up">
                <div className="px-6 pb-6">
                  <div className="bg-green-900/30 border border-green-500/30 rounded-lg p-4">
                    <p className="text-green-200 text-xs mb-2">💰 Revenue Insights:</p>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="text-green-300">• Peak inflow tracking</div>
                      <div className="text-green-300">• Historical trends</div>
                      <div className="text-green-300">• Member contributions</div>
                      <div className="text-green-300">• Token analytics</div>
                    </div>
                  </div>
                </div>
              </ExpandableContent>
            </ExpandableCard>
          </Expandable>

          <Expandable>
            <ExpandableCard className="backdrop-blur-sm bg-gradient-to-br from-blue-900/20 to-blue-800/30 border border-blue-500/20 shadow-xl shadow-blue-900/25 hover:shadow-2xl hover:border-blue-400/30 transition-all duration-300 hover:-translate-y-1">
              <ExpandableCardHeader className="pb-4 px-6 pt-6">
                <div className="text-lg font-semibold text-blue-200">Current Balance</div>
                <div className="text-blue-300/70 leading-relaxed text-sm">Available now</div>
              </ExpandableCardHeader>
              <ExpandableCardContent className="px-6 pb-6">
                <div className="space-y-2">
                  <div className="text-5xl font-black tracking-tight">
                    {selectedFanoutMint ? (
                      <>
                        <span className="bg-gradient-to-r from-blue-400 to-blue-300 bg-clip-text text-transparent">
                          {selectedFanoutMint.balance}
                        </span>
                        <span className="text-2xl text-gray-400 ml-2 font-semibold">
                          {selectedFanoutMint.config.symbol}
                        </span>
                      </>
                    ) : (
                      <>
                        <span className="bg-gradient-to-r from-blue-400 to-blue-300 bg-clip-text text-transparent">
                          {fanoutData.data?.balance || '0'}
                        </span>
                        <span className="text-2xl text-gray-400 ml-2 font-semibold">
                          SOL
                        </span>
                      </>
                    )}
                  </div>
                  <div className="text-xs text-blue-400 font-medium flex items-center gap-1">
                    <div className="w-1 h-1 bg-blue-400 rounded-full"></div>
                    Available now
                  </div>
                </div>
              </ExpandableCardContent>
              <ExpandableContent preset="slide-up">
                <div className="px-6 pb-6">
                  <div className="bg-blue-900/30 border border-blue-500/30 rounded-lg p-4">
                    <p className="text-blue-200 text-xs mb-2">⚡ Balance Details:</p>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="text-blue-300">• Ready for distribution</div>
                      <div className="text-blue-300">• Real-time updates</div>
                      <div className="text-blue-300">• Multi-token tracking</div>
                      <div className="text-blue-300">• Instant access</div>
                    </div>
                  </div>
                </div>
              </ExpandableContent>
            </ExpandableCard>
          </Expandable>

          <Expandable>
            <ExpandableCard className="backdrop-blur-sm bg-gradient-to-br from-orange-900/20 to-orange-800/30 border border-orange-500/20 shadow-xl shadow-orange-900/25 hover:shadow-2xl hover:border-orange-400/30 transition-all duration-300 hover:-translate-y-1">
              <ExpandableCardHeader className="pb-4 px-6 pt-6">
                <div className="text-lg font-semibold text-orange-200">Token Selection</div>
                <div className="text-orange-300/70 leading-relaxed text-sm">Choose token type</div>
              </ExpandableCardHeader>
              <ExpandableCardContent className="px-6 pb-6">
              <select
                className="flex h-12 w-full rounded-lg border border-gray-600/40 bg-gray-800/50 px-4 py-3 text-white focus:border-purple-400/60 focus:ring-2 focus:ring-purple-400/20 transition-all duration-200 focus:outline-none hover:bg-gray-700/50 hover:border-gray-500/50"
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
              </ExpandableCardContent>
            </ExpandableCard>
          </Expandable>
        </div>

        {/* Wallet Information */}
        <div className="max-w-6xl mx-auto">
        <Expandable>
          <ExpandableCard className="backdrop-blur-sm bg-gradient-to-br from-gray-800/40 to-gray-900/60 border border-gray-700/20 shadow-xl shadow-gray-900/25 hover:shadow-2xl hover:border-gray-600/30 transition-all duration-300">
            <ExpandableCardHeader className="pb-6 px-8 pt-6">
              <div className="text-2xl font-semibold bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">Wallet Information</div>
              <div className="text-gray-300 text-base leading-relaxed">Important addresses and member details</div>
            </ExpandableCardHeader>
            <ExpandableCardContent className="space-y-8 px-8 pb-8">
            <div className="grid gap-8 md:grid-cols-2">
              <div className="space-y-3">
                <label className="text-sm font-semibold text-white block">Fanout Address</label>
                <div className="text-sm">
                  <a
                    className="text-purple-400 hover:text-purple-300 transition-colors duration-200 font-mono bg-gray-800/40 px-4 py-3 rounded-lg border border-gray-700/20 block hover:border-purple-400/40 hover:bg-gray-800/60"
                    target="_blank"
                    rel="noopener noreferrer"
                    href={pubKeyUrl(fanoutData.data?.fanoutId, environment.label)}
                  >
                    {shortPubKey(fanoutData.data?.fanoutId.toString())}
                  </a>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-semibold text-white block">
                  {selectedFanoutMint ? `${selectedFanoutMint.config.symbol} Token Account` : 'SOL Wallet Address'}
                </label>
                <div className="text-sm">
                  <a
                    className="text-purple-400 hover:text-purple-300 transition-colors duration-200 font-mono bg-gray-800/40 px-4 py-3 rounded-lg border border-gray-700/20 block hover:border-purple-400/40 hover:bg-gray-800/60"
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

            <div className="border-t border-gray-700/30 my-4"></div>

            <div className="grid gap-8 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-xs font-medium text-gray-400 uppercase tracking-wide">Total Members</label>
                <div className="text-4xl font-black bg-gradient-to-r from-purple-400 to-purple-300 bg-clip-text text-transparent">
                  {fanoutData.data?.fanout?.totalMembers.toString()}
                </div>
                <div className="text-xs text-purple-400 font-medium flex items-center gap-1">
                  <div className="w-1 h-1 bg-purple-400 rounded-full"></div>
                  Active wallets
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-gray-400 uppercase tracking-wide">Total Shares</label>
                <div className="text-4xl font-black bg-gradient-to-r from-purple-400 to-purple-300 bg-clip-text text-transparent">
                  {fanoutData.data?.fanout?.totalShares.toString()}
                </div>
                <div className="text-xs text-purple-400 font-medium flex items-center gap-1">
                  <div className="w-1 h-1 bg-purple-400 rounded-full"></div>
                  Distribution units
                </div>
              </div>
            </div>
            </ExpandableCardContent>
          </ExpandableCard>
        </Expandable>
        </div>

        {/* Members List */}
        <div className="max-w-6xl mx-auto">
        <Expandable>
          <ExpandableCard className="backdrop-blur-sm bg-gradient-to-br from-gray-800/40 to-gray-900/60 border border-gray-700/20 shadow-xl shadow-gray-900/25 hover:shadow-2xl hover:border-gray-600/30 transition-all duration-300">
            <ExpandableCardHeader className="pb-6 px-8 pt-6">
              <div className="text-2xl font-semibold bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">Members & Distribution</div>
              <div className="text-gray-300 text-base leading-relaxed">
                Wallet members, their shares, and claim status
              </div>
            </ExpandableCardHeader>
            <ExpandableCardContent className="px-8 pb-8">
            <div className="space-y-4">
              {!fanoutMembershipVouchers.data ? (
                <>
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-16 w-full animate-pulse bg-gray-700/30 rounded-lg"></div>
                  ))}
                </>
              ) : (
                fanoutMembershipVouchers.data?.map((voucher, index) => {
                  const sharePercentage = ((Number(voucher.parsed.shares) / (fanoutData.data?.fanout?.totalShares || 1)) * 100).toFixed(1);
                  return (
                  <div
                    key={voucher.pubkey.toString()}
                    className="flex items-center justify-between p-5 rounded-lg border border-gray-700/20 bg-gray-800/30 hover:bg-gray-800/50 hover:border-gray-600/30 transition-all duration-200 group"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold">
                        {String.fromCharCode(65 + (index % 26))}
                      </div>
                      <div className="flex-1">
                        <DisplayAddress
                          connection={connection}
                          address={voucher.parsed.membershipKey}
                        />
                        <div className="text-xs text-gray-400 mt-1">
                          Member #{index + 1}
                        </div>
                      </div>
                    </div>
                    <div className="text-right space-y-2">
                      <div className="text-2xl font-bold text-white">
                        {sharePercentage}%
                      </div>
                      <div className="text-xs text-gray-400 font-medium">
                        {voucher.parsed.shares.toString()} shares
                      </div>
                      <div className="text-xs text-gray-500">
                        {selectedFanoutMint
                          ? fanoutMembershipMintVouchers.data &&
                            fanoutMembershipMintVouchers.data.length > 0
                            ? `${
                                Number(
                                  getMintNaturalAmountFromDecimal(
                                    Number(
                                      fanoutMembershipMintVouchers.data.filter(
                                        (v) =>
                                          v.pubkey.toString() ===
                                          voucherMapping[voucher.pubkey.toString()]
                                      )[0]?.parsed.lastInflow
                                    ),
                                    selectedFanoutMint.info.decimals
                                  )
                                ) * (Number(voucher.parsed.shares) / 100)
                              } ${selectedFanoutMint.config.symbol} claimed`
                            : `0 ${selectedFanoutMint.config.symbol} claimed`
                          : `${
                              parseInt(voucher.parsed.totalInflow.toString()) / 1e9
                            } ◎ claimed`}
                      </div>
                      <div className="w-16 h-1 bg-gray-700 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-purple-500 to-purple-400 rounded-full transition-all duration-300"
                          style={{ width: `${Math.min(100, Number(sharePercentage))}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                  );
                })
              )}
            </div>
            </ExpandableCardContent>
          </ExpandableCard>
        </Expandable>
        </div>

        {/* Action Buttons */}
        <div className="max-w-4xl mx-auto">
        <Expandable>
          <ExpandableCard className="backdrop-blur-sm bg-gradient-to-br from-gray-800/40 to-gray-900/60 border border-gray-700/20 shadow-xl shadow-gray-900/25 hover:shadow-2xl hover:border-gray-600/30 transition-all duration-300">
            <ExpandableCardHeader className="pb-6 px-8 pt-6">
              <div className="text-2xl font-semibold bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">Actions</div>
              <div className="text-gray-300 text-base leading-relaxed">Distribute funds or manage wallet settings</div>
            </ExpandableCardHeader>
            <ExpandableCardContent className="px-8 pb-8">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-400">Primary Actions</span>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-xs text-green-400 font-medium">Ready</span>
                  </div>
                </div>
                <TextureButton
                  onClick={() => fanoutData.data && distributeShare(fanoutData.data, true)}
                  disabled={!fanoutData.data}
                  variant="accent"
                  className="w-full h-14 text-base font-semibold"
                >
                  <span>Distribute To All Members</span>
                  <span className="text-xs opacity-70 ml-2">({fanoutData.data?.fanout?.totalMembers || 0})</span>
                </TextureButton>
              </div>
              {fanoutData.data &&
                fanoutData.data.fanout.authority.toString() ===
                  wallet.publicKey?.toString() && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-400">Management</span>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                        <span className="text-xs text-orange-400 font-medium">Admin</span>
                      </div>
                    </div>
                    <TextureButton
                      onClick={() => addSplToken()}
                      variant="secondary"
                      className="w-full h-14 text-base font-semibold"
                    >
                      Add SPL Token
                    </TextureButton>
                  </div>
                )}
            </div>
            </ExpandableCardContent>
          </ExpandableCard>
        </Expandable>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default Home
