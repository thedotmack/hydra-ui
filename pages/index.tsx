// Removed legacy Header usage in favor of ModernHeader inside layout
import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useEnvironmentCtx } from 'providers/EnvironmentProvider'
import { useState } from 'react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { TextureButton } from '@/components/ui/texture-button'
import { Expandable, ExpandableCard, ExpandableContent, ExpandableCardHeader, ExpandableCardContent } from '@/components/ui/expandable'
import { Input } from '@/components/ui/input'

const Home: NextPage = () => {
  const [walletName, setWalletName] = useState<string>('')
  const router = useRouter()
  const ctx = useEnvironmentCtx()

  return (
    <DashboardLayout>
      {/* Section Heading */}
      <div className="space-y-4 text-center mb-10">
        <h1 className="text-4xl font-semibold tracking-tight bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
          Treasury Management
        </h1>
        <p className="text-gray-400 text-lg max-w-3xl mx-auto leading-relaxed">
          Manage multi-party revenue sharing wallets on Solana. Load an existing wallet or create a new one to get started.
        </p>
      </div>

      {/* Primary + Secondary Actions Layout */}
      <div className="grid gap-8 md:gap-10 grid-cols-1 lg:grid-cols-5 items-start mb-12">
        {/* Load Wallet (Primary) */}
        <div className="lg:col-span-3 order-2 lg:order-1 flex">
          <div className="flex flex-col rounded-2xl border border-gray-800/60 bg-gray-900/60 backdrop-blur-md shadow-xl w-full p-8 md:p-10">
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
                <label className="block text-sm font-medium text-white">Wallet Name</label>
                <Input
                  type="text"
                  placeholder="hydra-wallet"
                  onChange={(e) => setWalletName(e.target.value)}
                  value={walletName}
                  className="h-12 text-base"
                  autoFocus
                />
                <p className="text-xs text-gray-500">
                  Supports membership model <span className="text-gray-300 font-medium">Wallet</span>
                </p>
              </div>
              <div className="mt-auto ">
                <TextureButton
                  type="submit"
                  variant="accent"
                  className="w-full h-12 text-base font-semibold"
                  disabled={!walletName.trim()}
                >
                  Load Wallet
                </TextureButton>
              </div>
            </form>
          </div>
        </div>

        {/* Create Wallet (Secondary) */}
        <div className="lg:col-span-2 order-1 lg:order-2 flex">
          <div className="flex flex-col rounded-2xl border border-gray-800/60 bg-gray-900/50 backdrop-blur md shadow-lg w-full p-8 md:p-10">
            <div className="space-y-5 mb-6">
              <h2 className="text-2xl font-semibold text-white">Create New Wallet</h2>
              <p className="text-gray-300 text-sm md:text-base leading-relaxed">
                Set up a new treasury with custom member shares and distribution rules.
              </p>
            </div>
            <div className="mt-auto space-y-4">
              <TextureButton
                variant="secondary"
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

      {/* Inline Meta Status Row */}
      <div className="flex flex-wrap items-center justify-center gap-4">
        <div className="flex items-center gap-2 bg-gray-800/40 border border-gray-700/50 px-4 py-2 rounded-full text-xs font-medium">
          <span className="relative flex h-2.5 w-2.5"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-40" /><span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-400" /></span>
          <span className="text-green-400">{ctx.environment.label}</span>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default Home