import { Fanout, FanoutClient, MembershipModel } from '@metaplex-foundation/mpl-hydra/dist/src'
import { Wallet } from '@saberhq/solana-contrib'
import { useWallet } from '@solana/wallet-adapter-react'
import { Transaction } from '@solana/web3.js'
import { AsyncButton } from 'common/Button'
import { Header } from 'common/Header'
import { notify } from 'common/Notification'
import { executeTransaction } from 'common/Transactions'
import { getPriorityFeeIx, tryPublicKey } from 'common/utils'
import { asWallet } from 'common/Wallets'
import type { NextPage } from 'next'
import { useEnvironmentCtx } from 'providers/EnvironmentProvider'
import { useState } from 'react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

const Home: NextPage = () => {
  const { connection } = useEnvironmentCtx()
  const wallet = useWallet()
  const [walletName, setWalletName] = useState<undefined | string>(undefined)
  const [totalShares, setTotalShares] = useState<undefined | number>(100)
  const [success, setSuccess] = useState(false)
  const [hydraWalletMembers, setHydraWalletMembers] = useState<
    { memberKey?: string; shares?: number }[]
  >([{ memberKey: undefined, shares: undefined }])

  const validateAndCreateWallet = async () => {
    try {
      if (!wallet.publicKey) {
        throw 'Please connect your wallet'
      }
      if (!walletName) {
        throw 'Specify a wallet name'
      }
      if (walletName.includes(' ')) {
        throw 'Wallet name cannot contain spaces'
      }
      if (!totalShares) {
        throw 'Please specify the total number of shares for distribution'
      }
      if (totalShares <= 0) {
        throw 'Please specify a positive number of shares'
      }
      let shareSum = 0
      for (const member of hydraWalletMembers) {
        if (!member.memberKey) {
          throw 'Please specify all member public keys'
        }
        if (!member.shares) {
          throw 'Please specify all member shares'
        }
        const memberPubkey = tryPublicKey(member.memberKey)
        if (!memberPubkey) {
          throw 'Invalid member public key, unable to cast to PublicKey'
        }
        if (member.shares <= 0) {
          throw 'Member shares cannot be negative or zero'
        }
        shareSum += member.shares
      }
      if (shareSum !== totalShares) {
        throw `Sum of all shares must equal ${totalShares}`
      }
      if (!hydraWalletMembers || hydraWalletMembers.length == 0) {
        throw 'Please specify at least one member'
      }
      if (!hydraWalletMembers || hydraWalletMembers.length > 9) {
        throw 'Too many members - submit a PR to https://github.com/metaplex-foundation/hydra-ui/ to increase this maximum'
      }

      const fanoutId = (await FanoutClient.fanoutKey(walletName))[0]
      const [nativeAccountId] = await FanoutClient.nativeAccount(fanoutId)
      const fanoutSdk = new FanoutClient(connection, asWallet(wallet!))
      try {
        let fanoutData = await fanoutSdk.fetch<Fanout>(fanoutId, Fanout)
        if (fanoutData) {
          throw `Wallet '${walletName}' already exists`
        }
      } catch (e) {}
      const transaction = new Transaction()
      transaction.add(
        ...(
          await fanoutSdk.initializeFanoutInstructions({
            totalShares,
            name: walletName,
            membershipModel: MembershipModel.Wallet,
          })
        ).instructions
      )
      for (const member of hydraWalletMembers) {
        transaction.add(
          ...(
            await fanoutSdk.addMemberWalletInstructions({
              fanout: fanoutId,
              fanoutNativeAccount: nativeAccountId,
              membershipKey: tryPublicKey(member.memberKey)!,
              shares: member.shares!,
            })
          ).instructions
        )
      }
      transaction.feePayer = wallet.publicKey!
      const priorityFeeIx = await getPriorityFeeIx(connection, transaction)
      transaction.add(priorityFeeIx)
      await executeTransaction(connection, wallet as Wallet, transaction, {})
      setSuccess(true)
    } catch (e) {
      notify({
        message: `Error creating hydra wallet`,
        description: `${e}`,
        type: 'error',
      })
    }
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-12">
        <div className="space-y-4">
          <h1 className="text-3xl font-bold text-white">
            Create Hydra Wallet
          </h1>
          <p className="text-gray-400 text-lg leading-relaxed max-w-2xl">
            Set up a new treasury wallet with member shares and distribution rules.
          </p>
        </div>

        {success && (
          <Card className="bg-green-950/50 border-green-500/30 border-2">
            <CardHeader className="space-y-3">
              <CardTitle className="text-green-400 text-xl font-semibold">
                ✅ Wallet Created Successfully
              </CardTitle>
              <CardDescription className="text-green-300/80 text-base">
                Your wallet is ready to use. Access it at{' '}
                <a
                  href={`/${walletName}${window.location.search ?? ''}`}
                  className="font-medium underline hover:no-underline text-green-400"
                >
                  /{walletName}
                </a>
              </CardDescription>
            </CardHeader>
          </Card>
        )}

        <Card className="bg-gray-900/60 border-gray-700/50 border">
          <CardHeader className="space-y-3 pb-6">
            <CardTitle className="text-white text-xl font-semibold">Wallet Configuration</CardTitle>
            <CardDescription className="text-gray-400 text-base">
              Configure your wallet name and total shares for distribution
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="grid gap-8 md:grid-cols-2">
              <div className="space-y-3">
                <label className="text-sm font-semibold text-white block">
                  Hydra Wallet Name
                </label>
                <Input
                  type="text"
                  placeholder="hydra-wallet"
                  onChange={(e) => {
                    setWalletName(e.target.value)
                    setSuccess(false)
                  }}
                  value={walletName}
                  className="h-12 bg-gray-800/80 border-gray-600 text-white placeholder:text-gray-500 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
                />
              </div>
              <div className="space-y-3">
                <label className="text-sm font-semibold text-white block">
                  Total Shares
                </label>
                <Input
                  type="number"
                  onChange={(e) => {
                    setTotalShares(parseInt(e.target.value))
                  }}
                  value={totalShares}
                  className="h-12 bg-gray-800/80 border-gray-600 text-white placeholder:text-gray-500 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/60 border-gray-700/50 border">
          <CardHeader className="space-y-3 pb-6">
            <CardTitle className="text-white text-xl font-semibold">Wallet Members</CardTitle>
            <CardDescription className="text-gray-400 text-base">
              Add members and their corresponding shares. Total shares must equal {totalShares || 100}.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {hydraWalletMembers.map((member, i) => (
              <div key={i} className="grid gap-6 md:grid-cols-5 p-4 bg-gray-800/40 border border-gray-700/30 rounded-lg">
                <div className="md:col-span-4 space-y-3">
                  <label className="text-sm font-semibold text-white block">
                    Wallet Address
                  </label>
                  <Input
                    type="text"
                    placeholder="Cmw...4xW"
                    onChange={(e) => {
                      const walletMembers = hydraWalletMembers
                      walletMembers[i]!.memberKey = e.target.value
                      setHydraWalletMembers([...walletMembers])
                    }}
                    value={member.memberKey}
                    className="h-12 bg-gray-800/80 border-gray-600 text-white placeholder:text-gray-500 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-sm font-semibold text-white block">
                    Shares
                  </label>
                  <Input
                    type="number"
                    placeholder="50"
                    onChange={(e) => {
                      const walletMembers = hydraWalletMembers
                      walletMembers[i]!.shares = parseInt(e.target.value)
                      setHydraWalletMembers([...walletMembers])
                    }}
                    value={member.shares}
                    className="h-12 bg-gray-800/80 border-gray-600 text-white placeholder:text-gray-500 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
                  />
                </div>
              </div>
            ))}

            <div className="flex gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  setHydraWalletMembers([
                    ...hydraWalletMembers,
                    {
                      memberKey: undefined,
                      shares: undefined,
                    },
                  ])
                }
                className="h-11 px-6 bg-gray-800/60 border-gray-600 text-gray-300 hover:bg-gray-700/80 hover:text-white hover:border-gray-500"
              >
                Add Member
              </Button>
              {hydraWalletMembers.length > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    setHydraWalletMembers(
                      hydraWalletMembers.filter(
                        (item, index) => index !== hydraWalletMembers.length - 1
                      )
                    )
                  }
                  className="h-11 px-6 bg-gray-800/60 border-gray-600 text-gray-300 hover:bg-gray-700/80 hover:text-white hover:border-gray-500"
                >
                  Remove Member
                </Button>
              )}
            </div>

            <div className="pt-8 border-t border-gray-700/50">
              <Button
                type="button"
                className="h-12 px-8 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-base border-0 shadow-lg transition-all duration-200 hover:shadow-cyan-500/25"
                onClick={() => validateAndCreateWallet()}
                disabled={!wallet.publicKey}
              >
                Create Hydra Wallet
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}

export default Home
