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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

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
      <div className="space-y-6">
        {fanoutData.error && (
          <Card className="border-destructive/50 bg-destructive/10">
            <CardHeader>
              <CardTitle className="text-destructive">Hydra Wallet Not Found</CardTitle>
              <CardDescription>
                The requested wallet could not be found or accessed.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                variant="outline"
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
              >
                Return to Dashboard
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Wallet Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {fanoutData.data?.fanout.name || (
              <div className="h-8 w-48 animate-pulse bg-muted rounded-md"></div>
            )}
          </h1>
          <p className="text-muted-foreground">
            Treasury wallet management and distribution
          </p>
        </div>

        {/* Balance and Token Selection */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Total Inflow</CardTitle>
              <CardDescription>Total funds received by this wallet</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {selectedFanoutMint ? (
                  `${Number(
                    getMintNaturalAmountFromDecimal(
                      Number(selectedFanoutMint.data.totalInflow),
                      selectedFanoutMint.info.decimals
                    )
                  )} ${selectedFanoutMint.config.symbol}`
                ) : fanoutData.data?.fanout ? (
                  `${
                    parseInt(
                      fanoutData.data?.fanout?.totalInflow.toString() ?? '0'
                    ) / 1e9
                  } ◎`
                ) : (
                  <div className="h-8 w-20 animate-pulse bg-muted rounded-md"></div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Current Balance</CardTitle>
              <CardDescription>Available for distribution</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {selectedFanoutMint
                  ? `${selectedFanoutMint.balance} ${selectedFanoutMint.config.symbol}`
                  : `${fanoutData.data?.balance} ◎`}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Token Selection</CardTitle>
              <CardDescription>Choose token to view and distribute</CardDescription>
            </CardHeader>
            <CardContent>
              <select
                className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs transition-colors focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring"
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
            </CardContent>
          </Card>
        </div>

        {/* Wallet Information */}
        <Card>
          <CardHeader>
            <CardTitle>Wallet Information</CardTitle>
            <CardDescription>Important addresses and member details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="text-sm font-medium">Fanout Address</label>
                <div className="text-sm text-muted-foreground">
                  <a
                    className="hover:text-primary transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                    href={pubKeyUrl(fanoutData.data?.fanoutId, environment.label)}
                  >
                    {shortPubKey(fanoutData.data?.fanoutId.toString())}
                  </a>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">
                  {selectedFanoutMint ? `${selectedFanoutMint.config.symbol} Token Account` : 'SOL Wallet Address'}
                </label>
                <div className="text-sm text-muted-foreground">
                  <a
                    className="hover:text-primary transition-colors"
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

            <Separator />

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="text-sm font-medium">Total Members</label>
                <div className="text-2xl font-bold">
                  {fanoutData.data?.fanout?.totalMembers.toString()}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Total Shares</label>
                <div className="text-2xl font-bold">
                  {fanoutData.data?.fanout?.totalShares.toString()}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Members List */}
        <Card>
          <CardHeader>
            <CardTitle>Members & Distribution</CardTitle>
            <CardDescription>
              Wallet members, their shares, and claim status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {!fanoutMembershipVouchers.data ? (
                <>
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-12 w-full animate-pulse bg-muted rounded-md"></div>
                  ))}
                </>
              ) : (
                fanoutMembershipVouchers.data?.map((voucher) => (
                  <div
                    key={voucher.pubkey.toString()}
                    className="flex items-center justify-between p-3 rounded-lg border bg-card"
                  >
                    <div className="flex-1">
                      <DisplayAddress
                        connection={connection}
                        address={voucher.parsed.membershipKey}
                      />
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">
                        {voucher.parsed.shares.toString()} shares
                      </div>
                      <div className="text-xs text-muted-foreground">
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
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <Card>
          <CardHeader>
            <CardTitle>Actions</CardTitle>
            <CardDescription>Distribute funds or manage wallet settings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <Button
                onClick={() => fanoutData.data && distributeShare(fanoutData.data, true)}
                disabled={!fanoutData.data}
              >
                Distribute To All
              </Button>
              {fanoutData.data &&
                fanoutData.data.fanout.authority.toString() ===
                  wallet.publicKey?.toString() && (
                  <Button
                    variant="outline"
                    onClick={() => addSplToken()}
                  >
                    Add SPL Token
                  </Button>
                )}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}

export default Home
