import { Fanout, FanoutClient, MembershipModel } from '@metaplex-foundation/mpl-hydra/dist/src'
import { Wallet } from '@saberhq/solana-contrib'
import { useWallet } from '@solana/wallet-adapter-react'
import { Transaction } from '@solana/web3.js'
import { AsyncButton } from 'common/Button'
// Legacy Header removed; ModernHeader used via DashboardLayout
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
      {/* Heading */}
      <div className="text-center mb-12 space-y-4">
        <h1 className="text-4xl font-semibold bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
          Create Hydra Wallet
        </h1>
        <p className="text-gray-400 text-lg max-w-3xl mx-auto leading-relaxed">
          Set up a new treasury wallet with member shares and distribution rules.
        </p>
      </div>

      {success && (
        <div className="mb-10 rounded-xl border border-green-500/30 bg-green-900/20 backdrop-blur p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center gap-4 shadow-lg shadow-green-900/20">
          <div className="text-green-300 text-xl font-semibold flex items-center gap-2">
            <span>✅</span>
            Wallet Created Successfully
          </div>
          <div className="text-green-200/90 text-sm md:text-base leading-relaxed">
            Access it at{' '}
            <a
              href={`/${walletName}${window.location.search ?? ''}`}
              className="font-semibold underline hover:no-underline text-green-300 hover:text-green-200 transition-colors"
            >
              /{walletName}
            </a>
          </div>
        </div>
      )}

      {/* Configuration + Members layout */}
      <div className="grid gap-10 lg:gap-12 grid-cols-1 xl:grid-cols-12 mb-20">
        {/* Configuration Panel */}
        <div className="xl:col-span-5 space-y-8">
          <div className="rounded-2xl border border-gray-800/60 bg-gray-900/60 backdrop-blur-md p-8 md:p-10 shadow-xl">
            <div className="space-y-5 mb-6">
              <h2 className="text-2xl font-semibold text-white">Wallet Configuration</h2>
              <p className="text-gray-300 text-sm md:text-base leading-relaxed">
                Configure your wallet name and total shares for distribution.
              </p>
            </div>
            <div className="space-y-8">
              <div className="space-y-3">
                <label className="text-xs font-medium text-gray-400 uppercase tracking-wide block">Hydra Wallet Name</label>
                <Input
                  type="text"
                  placeholder="my-treasury-wallet"
                  onChange={(e) => {
                    setWalletName(e.target.value)
                    setSuccess(false)
                  }}
                  value={walletName}
                  className="h-12 bg-gray-800/50 border-gray-700/50 text-white text-base placeholder:text-gray-500 focus:border-purple-400/60 focus:ring-2 focus:ring-purple-400/20 rounded-lg font-mono"
                />
                <p className="text-xs text-gray-500">Used as the wallet&apos;s unique identifier (no spaces).</p>
              </div>
              <div className="space-y-3">
                <label className="text-xs font-medium text-gray-400 uppercase tracking-wide block">Total Shares</label>
                <Input
                  type="number"
                  onChange={(e) => setTotalShares(parseInt(e.target.value))}
                  value={totalShares}
                  className="h-12 bg-gray-800/50 border-gray-700/50 text-white text-xl font-semibold placeholder:text-gray-500 focus:border-orange-400/60 focus:ring-2 focus:ring-orange-400/20 rounded-lg text-center"
                />
                <p className="text-xs text-orange-400 font-medium">Distribution units (must match allocation sum)</p>
              </div>
              <div className="rounded-lg bg-gray-800/40 border border-gray-700/40 p-4">
                <p className="text-gray-200 text-sm mb-2">⚙️ Tips</p>
                <ul className="space-y-1 text-xs text-gray-400">
                  <li>• Use descriptive names</li>
                  <li>• Plan for future members</li>
                  <li>• Test with a devnet wallet first</li>
                </ul>
              </div>
            </div>
          </div>
          <div className="rounded-2xl border border-purple-500/30 bg-purple-900/20 backdrop-blur p-6 shadow-md">
            <p className="text-sm font-medium text-purple-200 mb-2">💡 Allocation Summary</p>
            <p className="text-xs text-purple-200/80">Members defined: <span className="font-semibold">{hydraWalletMembers.length}</span></p>
            <p className="text-xs text-purple-200/80">Total shares target: <span className="font-semibold">{totalShares}</span></p>
          </div>
        </div>

        {/* Members Panel */}
        <div className="xl:col-span-7 space-y-8">
          <div className="rounded-2xl border border-gray-800/60 bg-gray-900/50 backdrop-blur p-8 md:p-10 shadow-lg">
            <div className="space-y-5 mb-6">
              <h2 className="text-2xl font-semibold text-white">Wallet Members</h2>
              <p className="text-gray-300 text-sm md:text-base leading-relaxed">
                Add members and their corresponding shares. Total shares must equal <span className="text-purple-400 font-semibold">{totalShares || 100}</span>.
              </p>
            </div>
            <div className="space-y-6">
              {hydraWalletMembers.map((member, i) => {
                const sharePercentage = member.shares && totalShares ? ((member.shares / totalShares) * 100).toFixed(1) : '0'
                return (
                  <div key={i} className="grid gap-6 md:grid-cols-6 p-5 rounded-xl border border-gray-800/70 bg-gray-800/40 hover:bg-gray-800/60 transition-colors group">
                    <div className="flex items-center justify-center">
                      <div className="w-11 h-11 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white text-sm font-semibold shadow-inner shadow-black/30">
                        {String.fromCharCode(65 + (i % 26))}
                      </div>
                    </div>
                    <div className="md:col-span-3 space-y-2">
                      <label className="text-[10px] font-medium text-gray-400 uppercase tracking-wide block">Member Wallet Address</label>
                      <Input
                        type="text"
                        placeholder="Enter Solana wallet address..."
                        onChange={(e) => {
                          const walletMembers = hydraWalletMembers
                          walletMembers[i]!.memberKey = e.target.value
                          setHydraWalletMembers([...walletMembers])
                        }}
                        value={member.memberKey}
                        className="h-11 bg-gray-900/50 border-gray-700/50 text-white placeholder:text-gray-500 focus:border-blue-400/60 focus:ring-2 focus:ring-blue-400/20 font-mono rounded-md text-xs"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-medium text-gray-400 uppercase tracking-wide block">Shares</label>
                      <Input
                        type="number"
                        placeholder="0"
                        onChange={(e) => {
                          const walletMembers = hydraWalletMembers
                          walletMembers[i]!.shares = parseInt(e.target.value)
                          setHydraWalletMembers([...walletMembers])
                        }}
                        value={member.shares}
                        className="h-11 bg-gray-900/50 border-gray-700/50 text-white text-sm font-semibold placeholder:text-gray-500 focus:border-green-400/60 focus:ring-2 focus:ring-green-400/20 rounded-md text-center"
                      />
                    </div>
                    <div className="flex flex-col justify-center items-center space-y-1">
                      <div className="text-lg font-bold bg-gradient-to-r from-purple-400 to-purple-300 bg-clip-text text-transparent">{sharePercentage}%</div>
                      <div className="w-10 h-1 bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-purple-500 to-purple-400 rounded-full transition-all"
                          style={{ width: `${Math.min(100, Number(sharePercentage))}%` }}
                        />
                      </div>
                      <div className="text-[10px] text-gray-400 font-medium text-center">of total</div>
                    </div>
                  </div>
                )
              })}
              <div className="flex flex-wrap gap-4 pt-2">
                <TextureButton
                  type="button"
                  onClick={() =>
                    setHydraWalletMembers([
                      ...hydraWalletMembers,
                      { memberKey: undefined, shares: undefined },
                    ])
                  }
                  variant="accent"
                  className="h-10 px-5 font-medium"
                >
                  + Add Member
                </TextureButton>
                {hydraWalletMembers.length > 1 && (
                  <TextureButton
                    type="button"
                    onClick={() =>
                      setHydraWalletMembers(
                        hydraWalletMembers.filter((_, index) => index !== hydraWalletMembers.length - 1)
                      )
                    }
                    variant="destructive"
                    className="h-10 px-5 font-medium"
                  >
                    - Remove Last
                  </TextureButton>
                )}
              </div>
              <div className="pt-6 border-t border-gray-800/60">
                <TextureButton
                  type="button"
                  variant="accent"
                  className="h-12 px-8 font-semibold text-base w-full md:w-auto"
                  onClick={() => validateAndCreateWallet()}
                  disabled={!wallet.publicKey}
                >
                  Create Hydra Wallet
                </TextureButton>
              </div>
              <div className="rounded-lg bg-purple-900/15 border border-purple-500/20 p-4 mt-2">
                <p className="text-purple-200 text-sm mb-2">💫 Member Management</p>
                <ul className="space-y-1 text-xs text-purple-300">
                  <li>• Valid Solana address required</li>
                  <li>• Share percentages auto-calculated</li>
                  <li>• Max 9 members</li>
                  <li>• Shares must sum exactly</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default Home
