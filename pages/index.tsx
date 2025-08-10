// Removed legacy Header usage in favor of ModernHeader inside layout
import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useEnvironmentCtx } from 'providers/EnvironmentProvider'
import { useEffect, useState } from 'react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { TextureButton } from '@/components/ui/texture-button'
import { Expandable, ExpandableCard, ExpandableContent, ExpandableCardHeader, ExpandableCardContent } from '@/components/ui/expandable'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { LoadWalletPanel } from '@/components/wallet/LoadWalletPanel'
import { CreateWalletPanel } from '@/components/wallet/CreateWalletPanel'

interface RecentWallet { id: string; name: string }
const Home: NextPage = () => {
  const router = useRouter()
  const ctx = useEnvironmentCtx()
  const [recent, setRecent] = useState<RecentWallet[]>([])
  useEffect(()=>{ try { const raw = localStorage.getItem('hydra_recent_wallets'); if(raw){ setRecent(JSON.parse(raw)) } } catch {} },[])

  return (
    <DashboardLayout>
      {/* Section Heading (Dashboard-aligned) */}
      <div className="space-y-4 mb-12 max-w-4xl page-offset-top">
        <p className="eyebrow text-[var(--color-accent)]">Dashboard</p>
        <h1 className="hero-title font-heading text-[2.85rem] md:text-[3.1rem] leading-tight font-semibold tracking-tight">
          Shared Split Wallets on Solana
        </h1>
        <p className="text-gray-300 text-base md:text-lg leading-relaxed pr-4 max-w-2xl">
          Create a shared wallet, add members with share units, receive SOL or tokens, and distribute funds proportionally when ready.
        </p>
      </div>

      {/* Primary + Secondary Actions Layout (12-col implicit grid) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-10 items-start mb-14">
        <div className="lg:col-span-7 xl:col-span-6 order-2 lg:order-1 flex">
          <LoadWalletPanel autoFocus onLoaded={()=>{}} />
        </div>
        <div className="lg:col-span-5 xl:col-span-4 order-1 lg:order-2 flex">
          <CreateWalletPanel />
        </div>
      </div>
      {/* Bottom network pill removed for dashboard style; environment visible in header */}
      {recent.length > 0 && (
        <div className="mb-16 space-y-4">
          <h2 className="eyebrow">Recently Accessed</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {recent.slice(0,8).map(r=> (
              <button key={r.id} onClick={()=>router.push(`/${r.name}`)} className="glass-panel p-4 flex flex-col gap-1 text-left hover:bg-white/5 transition-colors rounded-xl" data-elev={1}>
                <span className="text-sm font-medium text-white">{r.name}</span>
                <span className="text-[11px] text-[var(--text-color-muted)] font-mono">{r.id.slice(0,4)}…{r.id.slice(-4)}</span>
              </button>
            ))}
          </div>
        </div>
      )}
      <div className="mb-24 space-y-8 max-w-5xl">
        <h2 className="text-2xl font-semibold tracking-tight">How It Works</h2>
        <ol className="grid gap-6 md:grid-cols-3 list-none">
          {[
            { title: 'Create a Wallet', desc: 'Define a name and deploy the shared treasury on Solana.' },
            { title: 'Add Members & Shares', desc: 'Assign proportional share units or NFT / token based membership.' },
            { title: 'Receive & Distribute', desc: 'Funds accumulate. Trigger distribution when you\'re ready.' },
          ].map((s,i)=>(
            <li key={s.title} className="glass-panel p-5 rounded-xl space-y-3 relative" data-elev={1}>
              <div className="h-7 w-7 rounded-full bg-[var(--glass-bg-alt)] border border-[var(--glass-border)] flex items-center justify-center text-[11px] text-[var(--color-accent)] font-semibold">{i+1}</div>
              <h3 className="font-medium text-white text-base tracking-wide">{s.title}</h3>
              <p className="text-sm text-[var(--text-color-muted)] leading-relaxed">{s.desc}</p>
            </li>
          ))}
        </ol>
      </div>
    </DashboardLayout>
  )
}

export default Home