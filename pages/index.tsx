// TopNav layout active; legacy ModernHeader removed
import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useEnvironmentCtx } from 'providers/EnvironmentProvider'
import { useEffect, useState } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { TextureButton } from '@/components/ui/texture-button'
import { WalletHubPanels } from '@/components/wallet/WalletHubPanels'
import { LoadWalletPanel } from '@/components/wallet/LoadWalletPanel'
import { useMyWallets, useAnalytics } from '@/hooks'

interface RecentWallet { id: string; name: string }
const Home: NextPage = () => {
  const router = useRouter()
  const ctx = useEnvironmentCtx()
  const wallet = useWallet()
  const { wallets: myWallets } = useMyWallets()
  const { track } = useAnalytics()
  const [recent, setRecent] = useState<RecentWallet[]>([])
  useEffect(()=>{ try { const raw = localStorage.getItem('hydra_recent_wallets'); if(raw){ setRecent(JSON.parse(raw)) } } catch {} },[])
  // Analytics: home state + list view
  useEffect(()=>{
  track({ name: 'home_state', state: wallet.publicKey ? 'connected' : 'anon' })
  }, [wallet.publicKey, track])
  useEffect(()=>{
  if(wallet.publicKey) track({ name: 'my_wallets_list_view', count: myWallets.length })
  }, [wallet.publicKey, myWallets.length, track])

  return (
    <DashboardLayout>
      <div className="space-y-3 mb-8 max-w-4xl page-offset-top">
        <h1 className="hero-title font-heading text-[2.35rem] md:text-[2.7rem] leading-tight font-semibold tracking-tight">Shared Revenue Split Wallets</h1>
        <p className="text-gray-300 text-sm md:text-[15px] leading-relaxed max-w-2xl">Create a treasury, assign shares, accumulate SOL or tokens, distribute when you choose.</p>
      </div>

      {/* Connected View */}
      {wallet.publicKey ? (
        <div className="mb-24">
          {/** Logged-in panels: My Wallets + Recent side by side */}
          {(() => {
            const myIds = new Set(myWallets.map(w=>w.id))
            const recentFiltered = recent.filter(r=> !myIds.has(r.id))
            return (
              <section className="max-w-7xl" aria-labelledby="my-wallets-heading">
                <div className="grid gap-8 md:grid-cols-12 items-start">
                  {/* My Wallets Panel */}
                  <div className="glass-panel md:col-span-8 p-6 flex flex-col gap-5" data-elev={2} data-surface="subtle">
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-1">
                        <h2 id="my-wallets-heading" className="text-lg font-semibold tracking-tight">My Shared Wallets</h2>
                        <p className="text-[12px] text-[var(--text-color-muted)] leading-relaxed">Your wallets (authority detection coming soon).</p>
                      </div>
                      <TextureButton variant="luminous" size="sm" className="w-auto px-4 font-semibold" onClick={()=>router.push('/create')}>New</TextureButton>
                    </div>
                    {myWallets.length === 0 && (
                      <div className="text-[13px] text-[var(--text-color-muted)] space-y-4 py-6">
                        <div>
                          <p className="font-medium text-white mb-1">No wallets yet</p>
                          <p>Create your first shared wallet to start tracking balances & distributions.</p>
                        </div>
                        <TextureButton variant="luminous" className="w-auto px-5 h-9" onClick={()=>router.push('/create')}>Create Wallet</TextureButton>
                      </div>
                    )}
                    {myWallets.length > 0 && (
                      <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                        {myWallets.slice(0,12).map(w => (
                          <li key={w.id}>
                            <button onClick={()=>router.push(`/${w.name}`)} className="glass-panel p-3 flex flex-col gap-1 text-left hover:bg-white/5 transition-colors rounded-lg" data-elev={1}>
                              <span className="text-[13px] font-medium text-white truncate" title={w.name}>{w.name}</span>
                              <span className="text-[10px] text-[var(--text-color-muted)] font-mono">{w.id.slice(0,4)}…{w.id.slice(-4)}</span>
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  {/* Recent Panel */}
                  <div className="md:col-span-4 flex flex-col gap-5">
                    {recentFiltered.length > 0 && (
                      <div className="glass-panel p-6 flex flex-col gap-4 h-full" data-elev={2} data-surface="subtle" aria-labelledby="recent-heading">
                        <div className="space-y-1">
                          <h2 id="recent-heading" className="text-lg font-semibold tracking-tight">Recently Accessed</h2>
                          <p className="text-[12px] text-[var(--text-color-muted)]">Not already listed above.</p>
                        </div>
                        <ul className="flex flex-col gap-2 max-h-80 overflow-y-auto pr-1">
                          {recentFiltered.slice(0,10).map(r => (
                            <li key={r.id}>
                              <button onClick={()=>router.push(`/${r.name}`)} className="w-full flex items-center justify-between gap-3 px-3 py-2 rounded-md bg-white/5 hover:bg-white/7 transition-colors text-left">
                                <span className="truncate text-[13px] font-medium text-white" title={r.name}>{r.name}</span>
                                <span className="font-mono text-[10px] text-[var(--text-color-muted)]">{r.id.slice(0,3)}…{r.id.slice(-3)}</span>
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </section>
            )
          })()}
        </div>
      ) : (
        <div className="space-y-14 mb-20">
          <section id="view-any" aria-labelledby="view-any-heading" className="max-w-7xl">
            <div className="grid gap-6 md:grid-cols-12 items-start">
              {/* Create Column */}
              <div className={`glass-panel p-6 flex flex-col ${recent.length>0 ? 'md:col-span-4' : 'md:col-span-6'} gap-4`} data-elev={2} data-surface="subtle">
                <div className="space-y-2">
                  <p className="eyebrow">Create</p>
                  <h2 className="text-lg font-semibold tracking-tight">New Wallet</h2>
                  <p className="text-[12px] text-[var(--text-color-muted)] leading-relaxed">Name it now. Add members anytime.</p>
                </div>
                <TextureButton variant="luminous" className="h-10 w-full text-sm font-semibold" onClick={()=>router.push('/create')} data-focus-ring="true">Create Wallet</TextureButton>
              </div>
              {/* Load Column (equal width to Create) */}
              <div className={`${recent.length>0 ? 'md:col-span-4' : 'md:col-span-6'} flex flex-col`}>
                <LoadWalletPanel variant="compact" autoFocus className="h-full" />
              </div>
              {/* Recent Column */}
              {recent.length > 0 && (
                <div className="glass-panel p-6 flex flex-col gap-4 md:col-span-4" data-elev={2} data-surface="subtle" aria-labelledby="recent-inline-heading">
                  <div className="space-y-2">
                    <p className="eyebrow">Recent</p>
                    <h2 id="recent-inline-heading" className="text-lg font-semibold tracking-tight">Visited</h2>
                    <p className="text-[11px] text-[var(--text-color-muted)] leading-relaxed">Quick access</p>
                  </div>
                  <ul className="flex flex-col gap-2 max-h-72 overflow-y-auto pr-1">
                    {recent.slice(0,8).map(r => (
                      <li key={r.id}>
                        <button onClick={()=>router.push(`/${r.name}`)} className="w-full flex items-center justify-between gap-3 px-3 py-2 rounded-md bg-white/5 hover:bg-white/7 transition-colors text-left">
                          <span className="truncate text-[13px] font-medium text-white" title={r.name}>{r.name}</span>
                          <span className="font-mono text-[10px] text-[var(--text-color-muted)]">{r.id.slice(0,3)}…{r.id.slice(-3)}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </section>
        </div>
      )}
      {/* Bottom network pill removed for dashboard style; environment visible in header */}
      
    </DashboardLayout>
  )
}

export default Home