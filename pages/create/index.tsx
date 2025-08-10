import { Fanout, FanoutClient, MembershipModel } from '@metaplex-foundation/mpl-hydra/dist/src'
import { Wallet } from '@saberhq/solana-contrib'
import { useWallet } from '@solana/wallet-adapter-react'
import { Transaction } from '@solana/web3.js'
// Legacy Header removed; ModernHeader used via DashboardLayout
import { notify } from 'common/Notification'
import { executeTransaction } from 'common/Transactions'
import { getPriorityFeeIx, tryPublicKey } from 'common/utils'
import { asWallet } from 'common/Wallets'
import type { NextPage } from 'next'
import { useEnvironmentCtx } from 'providers/EnvironmentProvider'
import { useEffect, useMemo, useRef, useState } from 'react'
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
  const [lastActionMsg, setLastActionMsg] = useState<string>('')
  const liveRegionRef = useRef<HTMLDivElement | null>(null)

  // Derived totals
  const sharesAllocated = useMemo(
    () => hydraWalletMembers.reduce((sum, m) => sum + (m.shares || 0), 0),
    [hydraWalletMembers]
  )
  const remainingShares = (totalShares || 0) - sharesAllocated

  useEffect(() => {
    if (lastActionMsg && liveRegionRef.current) {
      // Force reflow for screen readers by clearing then setting
      const el = liveRegionRef.current
      el.textContent = ''
      setTimeout(() => {
        el.textContent = lastActionMsg
      }, 10)
    }
  }, [lastActionMsg])

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
  <div className="text-center mb-14 space-y-6 page-offset-top">
        <p className="eyebrow tracking-wide text-[var(--color-accent)]">Hydra Treasury</p>
        <h1 className="hero-title heading-hero">Create Hydra Wallet</h1>
        <p className="text-gray-300 text-lg max-w-3xl mx-auto leading-relaxed">
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
          <div className="glass-panel rounded-[var(--radius-xl)] p-8 md:p-10 panel-gradient-top" data-elev="2">
            <div className="space-y-4 mb-6">
              <p className="eyebrow text-[var(--color-accent)]">Configuration</p>
              <h2 className="heading-section">Wallet Configuration</h2>
              <p className="text-gray-300 text-sm md:text-base leading-relaxed">
                Configure your wallet name and total shares for distribution.
              </p>
            </div>
            <div className="space-y-10">
              <div className="space-y-3">
                <label className="form-label block" htmlFor="wallet-name">Hydra Wallet Name</label>
                <Input
                  id="wallet-name"
                  type="text"
                  placeholder="my-treasury-wallet"
                  onChange={(e) => {
                    setWalletName(e.target.value)
                    setSuccess(false)
                  }}
                  value={walletName}
                  className="h-12 input-glass text-base font-mono"
                  aria-describedby="wallet-name-hint"
                  data-focus-ring="true"
                />
                <p id="wallet-name-hint" className="form-hint">Used as the wallet&apos;s unique identifier (no spaces).</p>
              </div>
              <div className="space-y-3">
                <label className="form-label block" htmlFor="total-shares">Total Shares</label>
                <Input
                  id="total-shares"
                  type="number"
                  onChange={(e) => setTotalShares(parseInt(e.target.value))}
                  value={totalShares}
                  className="h-12 input-glass text-xl font-semibold text-center"
                  aria-describedby="total-shares-hint"
                  data-focus-ring="true"
                />
                <p id="total-shares-hint" className="form-hint">Distribution units (must match allocation sum)</p>
                <div className="micro-progress mt-3" role="progressbar" aria-label="Allocation progress" aria-valuemin={0} aria-valuemax={totalShares || 0} aria-valuenow={sharesAllocated}>
                  <div style={{ width: `${Math.min(100, (sharesAllocated / (totalShares || 1)) * 100)}%` }} />
                </div>
                <p className="text-[10px] uppercase tracking-wide mt-1 text-gray-500">Allocated {sharesAllocated}/{totalShares} shares ({remainingShares >= 0 ? remainingShares : 0} remaining)</p>
              </div>
              <div className="rounded-lg glass-panel p-4" data-elev="1">
                <p className="text-gray-200 text-sm mb-2">⚙️ Tips</p>
                <ul className="space-y-1 text-xs text-gray-400">
                  <li>• Use descriptive names</li>
                  <li>• Plan for future members</li>
                  <li>• Test with a devnet wallet first</li>
                </ul>
              </div>
            </div>
          </div>
          <div className="glass-panel rounded-[var(--radius-xl)] p-6" data-elev="1">
            <p className="text-sm font-medium text-[var(--color-accent)] mb-3">💡 Allocation Summary</p>
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <p className="text-gray-400">Members</p>
                <p className="text-gray-200 font-semibold">{hydraWalletMembers.length}</p>
              </div>
              <div className="space-y-1">
                <p className="text-gray-400">Target Shares</p>
                <p className="text-gray-200 font-semibold">{totalShares}</p>
              </div>
              <div className="space-y-1">
                <p className="text-gray-400">Allocated</p>
                <p className="text-gray-200 font-semibold">{sharesAllocated}</p>
              </div>
              <div className="space-y-1">
                <p className={remainingShares === 0 ? 'text-emerald-400' : 'text-gray-400'}>Remaining</p>
                <p className={`font-semibold ${remainingShares === 0 ? 'text-emerald-400' : 'text-gray-200'}`}>{remainingShares}</p>
              </div>
            </div>
            <div className="micro-progress mt-4" aria-hidden="true">
              <div style={{ width: `${Math.min(100, (sharesAllocated / (totalShares || 1)) * 100)}%` }} />
            </div>
          </div>
        </div>

        {/* Members Panel */}
        <div className="xl:col-span-7 space-y-8">
          <div className="glass-panel rounded-[var(--radius-xl)] p-8 md:p-10 panel-gradient-top" data-elev="2">
            <div className="space-y-4 mb-8">
              <p className="eyebrow text-[var(--color-accent)]">Members</p>
              <h2 className="heading-section">Wallet Members</h2>
              <p className="text-gray-300 text-sm md:text-base leading-relaxed">
                Add members and their corresponding shares. Total shares must equal <span className="text-[var(--color-accent)] font-semibold">{totalShares || 100}</span>.
              </p>
            </div>
            <div className="space-y-7">
              {hydraWalletMembers.map((member, i) => {
                const pct = member.shares && totalShares ? (member.shares / totalShares) * 100 : 0
                const pctLabel = pct.toFixed(pct < 10 && pct > 0 ? 1 : 0)
                return (
                  <div key={i} className="relative group">
                    <div className="grid gap-6 md:grid-cols-7 p-5 rounded-xl glass-panel" data-elev="1">
                      <div className="flex items-center justify-center">
                        <div className="w-11 h-11 rounded-lg bg-[var(--color-accent)]/90 text-gray-900 flex items-center justify-center text-sm font-bold shadow-inner shadow-black/30">
                          {String.fromCharCode(65 + (i % 26))}
                        </div>
                      </div>
                      <div className="md:col-span-3 space-y-2">
                        <label className="form-label block" htmlFor={`member-${i}`}>Member Wallet Address</label>
                        <Input
                          id={`member-${i}`}
                          type="text"
                          placeholder="Enter Solana wallet address..."
                          onChange={(e) => {
                            const walletMembers = [...hydraWalletMembers]
                            walletMembers[i]!.memberKey = e.target.value
                            setHydraWalletMembers(walletMembers)
                          }}
                          value={member.memberKey}
                          className="h-11 input-glass font-mono text-xs"
                          data-focus-ring="true"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="form-label block" htmlFor={`shares-${i}`}>Shares</label>
                        <Input
                          id={`shares-${i}`}
                          type="number"
                          placeholder="0"
                          onChange={(e) => {
                            const walletMembers = [...hydraWalletMembers]
                            walletMembers[i]!.shares = parseInt(e.target.value)
                            setHydraWalletMembers(walletMembers)
                          }}
                          value={member.shares}
                          className="h-11 input-glass text-sm font-semibold text-center"
                          aria-describedby={`shares-${i}-pct`}
                          data-focus-ring="true"
                        />
                      </div>
                      <div className="flex flex-col justify-center items-center space-y-1">
                        <div className="text-lg font-bold text-[var(--color-accent)]">{pctLabel}%</div>
                        <div className="w-12 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[var(--color-accent)]/90 rounded-full transition-all"
                            style={{ width: `${Math.min(100, pct)}%` }}
                          />
                        </div>
                        <div id={`shares-${i}-pct`} className="text-[10px] text-gray-400 font-medium text-center">of total</div>
                      </div>
                      <div className="flex items-center justify-end">
                        {hydraWalletMembers.length > 1 && (
                          <TextureButton
                            type="button"
                            size="sm"
                            variant="secondaryOutline"
                            className="w-auto px-3 h-8 text-[11px] font-medium"
                            onClick={() => {
                              const walletMembers = hydraWalletMembers.filter((_, idx) => idx !== i)
                              setHydraWalletMembers(walletMembers)
                              setLastActionMsg(`Removed member ${i + 1}`)
                            }}
                            aria-label={`Remove member ${i + 1}`}
                            data-focus-ring="true"
                          >
                            Remove
                          </TextureButton>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
              <div className="flex flex-wrap gap-4 pt-2">
                <TextureButton
                  type="button"
                  onClick={() => {
                    setHydraWalletMembers([
                      ...hydraWalletMembers,
                      { memberKey: undefined, shares: undefined },
                    ])
                    setLastActionMsg('Added member row')
                  }}
                  variant="primarySolid"
                  className="h-10 px-5 font-medium w-auto"
                  data-focus-ring="true"
                >
                  + Add Member
                </TextureButton>
                {hydraWalletMembers.length > 1 && (
                  <TextureButton
                    type="button"
                    onClick={() => {
                      setHydraWalletMembers(
                        hydraWalletMembers.filter((_, index) => index !== hydraWalletMembers.length - 1)
                      )
                      setLastActionMsg('Removed last member row')
                    }}
                    variant="secondaryOutline"
                    className="h-10 px-5 font-medium w-auto"
                    data-focus-ring="true"
                  >
                    - Remove Last
                  </TextureButton>
                )}
              </div>
              <div className="pt-6 divider-fade">
                <TextureButton
                  type="button"
                  variant="primarySolid"
                  className="h-12 px-8 font-semibold text-base w-full md:w-auto"
                  onClick={() => validateAndCreateWallet()}
                  disabled={!wallet.publicKey || remainingShares !== 0}
                  aria-disabled={!wallet.publicKey || remainingShares !== 0}
                  data-focus-ring="true"
                >
                  {remainingShares === 0 ? 'Create Hydra Wallet' : `Allocate All Shares (${remainingShares} left)`}
                </TextureButton>
                {remainingShares !== 0 && (
                  <p className="form-hint mt-3">All shares must be allocated before creation.</p>
                )}
              </div>
              <div className="rounded-lg glass-panel p-4 mt-2" data-elev="1">
                <p className="text-[var(--color-accent)] text-sm mb-2">💫 Member Management</p>
                <ul className="space-y-1 text-xs text-gray-400">
                  <li>• Valid Solana address required</li>
                  <li>• Share percentages auto-calculated</li>
                  <li>• Max 9 members</li>
                  <li>• Shares must sum exactly</li>
                </ul>
              </div>
            </div>
          </div>
          <div ref={liveRegionRef} className="sr-only" aria-live="polite" aria-atomic="true" />
        </div>
      </div>
    </DashboardLayout>
  )
}

export default Home
