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
import { TextureButton } from '@/components/ui/texture-button'
import { Expandable, ExpandableCard, ExpandableContent, ExpandableCardHeader, ExpandableCardContent } from '@/components/ui/expandable'
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
      <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-900 via-gray-900 to-black">
        <div className="max-w-4xl mx-auto px-8 py-12 space-y-12">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Create Hydra Wallet
            </h1>
            <p className="text-gray-400 text-lg leading-relaxed max-w-2xl mx-auto">
              Set up a new treasury wallet with member shares and distribution rules.
            </p>
          </div>

        {success && (
          <Expandable>
            <ExpandableCard className="backdrop-blur-sm bg-gradient-to-br from-green-900/30 to-green-800/30 border border-green-500/25 shadow-2xl shadow-green-900/20">
              <ExpandableCardHeader className="space-y-4 px-8 py-6">
                <div className="text-2xl font-semibold bg-gradient-to-r from-green-400 to-green-300 bg-clip-text text-transparent flex items-center gap-3">
                  <span className="text-green-400">✅</span> Wallet Created Successfully
                </div>
                <div className="text-green-200/90 text-lg leading-relaxed">
                  Your wallet is ready to use. Access it at{' '}
                  <a
                    href={`/${walletName}${window.location.search ?? ''}`}
                    className="font-semibold underline hover:no-underline text-green-300 hover:text-green-200 transition-colors duration-200"
                  >
                    /{walletName}
                  </a>
                </div>
              </ExpandableCardHeader>
            </ExpandableCard>
          </Expandable>
        )}

        <Expandable>
          <ExpandableCard className="backdrop-blur-sm bg-gradient-to-br from-gray-800/40 to-gray-900/60 border border-gray-700/20 shadow-xl shadow-gray-900/25 hover:shadow-2xl hover:border-gray-600/30 transition-all duration-300">
            <ExpandableCardHeader className="space-y-4 pb-6 px-8 pt-6">
              <div className="text-2xl font-semibold bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">Wallet Configuration</div>
              <div className="text-gray-300 text-base leading-relaxed">
                Configure your wallet name and total shares for distribution
              </div>
            </ExpandableCardHeader>
            <ExpandableCardContent className="space-y-8 px-8 pb-8">
            <div className="grid gap-8 md:grid-cols-5">
              <div className="md:col-span-3 space-y-3">
                <label className="text-xs font-medium text-gray-400 uppercase tracking-wide block">
                  Hydra Wallet Name
                </label>
                <Input
                  type="text"
                  placeholder="my-treasury-wallet"
                  onChange={(e) => {
                    setWalletName(e.target.value)
                    setSuccess(false)
                  }}
                  value={walletName}
                  className="h-14 bg-gray-800/50 border-gray-600/40 text-white text-lg placeholder:text-gray-500 focus:border-purple-400/60 focus:ring-2 focus:ring-purple-400/20 transition-all duration-200 focus:outline-none focus:border-transparent rounded-lg font-mono"
                />
                <div className="text-xs text-gray-400 flex items-center gap-2">
                  <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                  This will be your wallet's unique identifier
                </div>
              </div>
              <div className="md:col-span-2 space-y-3">
                <label className="text-xs font-medium text-gray-400 uppercase tracking-wide block">
                  Total Shares
                </label>
                <div className="relative">
                  <Input
                    type="number"
                    onChange={(e) => {
                      setTotalShares(parseInt(e.target.value))
                    }}
                    value={totalShares}
                    className="h-14 bg-gray-800/50 border-gray-600/40 text-white text-2xl font-bold placeholder:text-gray-500 focus:border-orange-400/60 focus:ring-2 focus:ring-orange-400/20 transition-all duration-200 focus:outline-none focus:border-transparent rounded-lg text-center"
                  />
                  <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-orange-400 font-medium">
                    Distribution units
                  </div>
                </div>
              </div>
            </div>
            </ExpandableCardContent>
            <ExpandableContent preset="slide-up">
              <div className="px-8 pb-6">
                <div className="bg-gray-800/40 border border-gray-600/30 rounded-lg p-4">
                  <p className="text-gray-200 text-sm mb-3">⚙️ Configuration Tips:</p>
                  <ul className="space-y-1 text-xs text-gray-300">
                    <li>• Use clear, descriptive names (no spaces)</li>
                    <li>• Share totals must match member allocations</li>
                    <li>• Consider future expansion needs</li>
                    <li>• Test with small amounts first</li>
                  </ul>
                </div>
              </div>
            </ExpandableContent>
          </ExpandableCard>
        </Expandable>

        <Expandable>
          <ExpandableCard className="backdrop-blur-sm bg-gradient-to-br from-gray-800/40 to-gray-900/60 border border-gray-700/20 shadow-xl shadow-gray-900/25 hover:shadow-2xl hover:border-gray-600/30 transition-all duration-300">
            <ExpandableCardHeader className="space-y-4 pb-6 px-8 pt-6">
              <div className="text-2xl font-semibold bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">Wallet Members</div>
              <div className="text-gray-300 text-base leading-relaxed">
                Add members and their corresponding shares. Total shares must equal <span className="text-purple-400 font-semibold">{totalShares || 100}</span>.
              </div>
            </ExpandableCardHeader>
            <ExpandableCardContent className="space-y-6 px-8 pb-8">
            {hydraWalletMembers.map((member, i) => {
              const sharePercentage = member.shares && totalShares ? ((member.shares / totalShares) * 100).toFixed(1) : '0';
              return (
              <div key={i} className="grid gap-6 md:grid-cols-6 p-6 bg-gray-800/40 border border-gray-700/20 rounded-lg hover:bg-gray-800/60 hover:border-gray-600/30 transition-all duration-200 group">
                <div className="flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white text-lg font-bold">
                    {String.fromCharCode(65 + (i % 26))}
                  </div>
                </div>
                <div className="md:col-span-3 space-y-3">
                  <label className="text-xs font-medium text-gray-400 uppercase tracking-wide block">
                    Member Wallet Address
                  </label>
                  <Input
                    type="text"
                    placeholder="Enter Solana wallet address..."
                    onChange={(e) => {
                      const walletMembers = hydraWalletMembers
                      walletMembers[i]!.memberKey = e.target.value
                      setHydraWalletMembers([...walletMembers])
                    }}
                    value={member.memberKey}
                    className="h-12 bg-gray-800/50 border-gray-600/40 text-white placeholder:text-gray-500 focus:border-blue-400/60 focus:ring-2 focus:ring-blue-400/20 transition-all duration-200 focus:outline-none focus:border-transparent font-mono rounded-lg text-sm"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-xs font-medium text-gray-400 uppercase tracking-wide block">
                    Shares
                  </label>
                  <Input
                    type="number"
                    placeholder="0"
                    onChange={(e) => {
                      const walletMembers = hydraWalletMembers
                      walletMembers[i]!.shares = parseInt(e.target.value)
                      setHydraWalletMembers([...walletMembers])
                    }}
                    value={member.shares}
                    className="h-12 bg-gray-800/50 border-gray-600/40 text-white text-lg font-bold placeholder:text-gray-500 focus:border-green-400/60 focus:ring-2 focus:ring-green-400/20 transition-all duration-200 focus:outline-none focus:border-transparent rounded-lg text-center"
                  />
                </div>
                <div className="flex flex-col justify-center items-center space-y-2">
                  <div className="text-2xl font-black bg-gradient-to-r from-purple-400 to-purple-300 bg-clip-text text-transparent">
                    {sharePercentage}%
                  </div>
                  <div className="w-8 h-1 bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-purple-500 to-purple-400 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(100, Number(sharePercentage))}%` }}
                    ></div>
                  </div>
                  <div className="text-xs text-gray-400 font-medium text-center">
                    of total
                  </div>
                </div>
              </div>
              );
            })}

            <div className="grid gap-4 md:grid-cols-2 pt-6">
              <TextureButton
                type="button"
                onClick={() =>
                  setHydraWalletMembers([
                    ...hydraWalletMembers,
                    {
                      memberKey: undefined,
                      shares: undefined,
                    },
                  ])
                }
                variant="accent"
                className="h-12 px-6 font-semibold"
              >
                + Add Member
              </TextureButton>
              {hydraWalletMembers.length > 1 && (
                <TextureButton
                  type="button"
                  onClick={() =>
                    setHydraWalletMembers(
                      hydraWalletMembers.filter(
                        (item, index) => index !== hydraWalletMembers.length - 1
                      )
                    )
                  }
                  variant="destructive"
                  className="h-12 px-6 font-semibold"
                >
                  - Remove Last
                </TextureButton>
              )}
            </div>

            <div className="pt-8 border-t border-gray-700/30">
              <TextureButton
                type="button"
                variant="primary"
                className="h-12 px-8 font-semibold text-base"
                onClick={() => validateAndCreateWallet()}
                disabled={!wallet.publicKey}
              >
                Create Hydra Wallet
              </TextureButton>
            </div>
            </ExpandableCardContent>
            <ExpandableContent preset="slide-up">
              <div className="px-8 pb-6">
                <div className="bg-purple-900/20 border border-purple-500/20 rounded-lg p-4">
                  <p className="text-purple-200 text-sm mb-3">💫 Member Management:</p>
                  <ul className="space-y-1 text-xs text-purple-300">
                    <li>• Each member needs a valid Solana address</li>
                    <li>• Share percentages calculated automatically</li>
                    <li>• Maximum 9 members per wallet</li>
                    <li>• Shares must sum to exact total</li>
                  </ul>
                </div>
              </div>
            </ExpandableContent>
          </ExpandableCard>
        </Expandable>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default Home
