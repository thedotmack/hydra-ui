// Removed legacy Header usage in favor of ModernHeader inside layout
import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useEnvironmentCtx } from 'providers/EnvironmentProvider'
import { useState } from 'react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { TextureButton } from '@/components/ui/texture-button'
import { Expandable, ExpandableCard, ExpandableContent, ExpandableCardHeader, ExpandableCardContent } from '@/components/ui/expandable'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

const Home: NextPage = () => {
  const [walletName, setWalletName] = useState<string>('')
  const router = useRouter()
  const ctx = useEnvironmentCtx()

  return (
    <DashboardLayout>
      {/* Section Heading (Dashboard-aligned) */}
      <div className="space-y-3 mb-8 max-w-4xl">
        <h1 className="hero-title text-[2.5rem] leading-tight font-semibold tracking-tight">
          Treasury Management
        </h1>
        <p className="text-gray-300 text-base md:text-lg leading-relaxed pr-4">
          Manage multi-party revenue sharing wallets on Solana. Load an existing wallet or create a new one to get started.
        </p>
      </div>

      {/* Primary + Secondary Actions Layout (12-col implicit grid) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-10 items-start mb-14">
        {/* Load Wallet (Primary) */}
        <div className="lg:col-span-7 xl:col-span-6 order-2 lg:order-1 flex">
          <div className="glass-panel flex flex-col rounded-[var(--radius-xl)] w-full p-8 md:p-10" data-elev="2">
            <div className="space-y-5 mb-6">
              <h2 className="text-2xl font-semibold text-white">Load Existing Wallet</h2>
              <p className="text-gray-300 text-sm md:text-base leading-relaxed">
                Access your existing Hydra wallet to view balances, manage distributions, and track member activity.
              </p>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault()
                router.push(
                  `/${walletName}${
                    ctx.environment.label !== 'mainnet-beta'
                      ? `?cluster=${ctx.environment.label}`
                      : ''
                  }`
                )
              }}
              className="space-y-6 flex-1 flex flex-col"
            >
              <div className="space-y-3">
                <label className="block text-sm font-medium text-white" htmlFor="walletName">Wallet Name</label>
                <Input
                  type="text"
                  placeholder="hydra-wallet"
                  onChange={(e) => setWalletName(e.target.value)}
                  value={walletName}
                  className="h-12 text-base"
                  id="walletName"
                  aria-describedby="walletNameHelp"
                  autoFocus
                />
                <p className="text-xs text-gray-500" id="walletNameHelp">
                  Use 3–32 lowercase letters, numbers, or hyphens. Example: <span className="text-gray-300 font-medium">hydra-treasury</span>
                </p>
              </div>
              <div className="mt-auto ">
                <TextureButton
                  type="submit"
                  variant={walletName.trim() ? "luminous" : "glass"}
                  className={cn(
                    "w-full h-12 text-base font-semibold transition-colors",
                    !walletName.trim() && "cursor-not-allowed text-gray-400"
                  )}
                  disabled={!walletName.trim()}
                >
                  Load Wallet
                </TextureButton>
              </div>
            </form>
          </div>
        </div>

        {/* Create Wallet (Secondary) */}
        <div className="lg:col-span-5 xl:col-span-4 order-1 lg:order-2 flex">
          <div className="glass-panel flex flex-col rounded-[var(--radius-xl)] w-full p-8 md:p-10" data-elev="1">
            <div className="space-y-5 mb-6">
              <h2 className="text-2xl font-semibold text-white">Create New Wallet</h2>
              <p className="text-gray-300 text-sm md:text-base leading-relaxed">
                Set up a new treasury with custom member shares and distribution rules.
              </p>
            </div>
            <div className="mt-auto space-y-4">
              <TextureButton
                variant="luminous"
                className="w-full h-12 text-base font-semibold"
                onClick={() => {
                  router.push(
                    `/create${
                      ctx.environment.label !== 'mainnet-beta'
                        ? `?cluster=${ctx.environment.label}`
                        : ''
                    }`
                  )
                }}
              >
                Create Wallet
              </TextureButton>
              <p className="text-xs text-gray-500 text-center">Configure members & shares</p>
            </div>
          </div>
        </div>
      </div>
      {/* Bottom network pill removed for dashboard style; environment visible in header */}
    </DashboardLayout>
  )
}

export default Home