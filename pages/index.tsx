import { Header } from 'common/Header'
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
      <div className="p-8 max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-4">
            Treasury Management
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Manage multi-party revenue sharing wallets on Solana. Load an existing wallet or create a new one to get started.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          
          {/* Load Wallet */}
          <div className="lg:col-span-2">
            <ExpandableCard className="h-full bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700/50 shadow-xl hover:shadow-2xl hover:border-gray-600/50 transition-all duration-300">
              <ExpandableCardHeader className="p-8">
                <h2 className="text-2xl font-semibold mb-4 text-white">
                  Load Existing Wallet
                </h2>
                <p className="text-gray-300 mb-8">
                  Access your existing Hydra wallet to view balances, manage distributions, and track member activity.
                </p>
              </ExpandableCardHeader>
              <ExpandableCardContent className="px-8 pb-8">
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
                  className="space-y-6"
                >
                  <div>
                    <label className="block text-sm font-medium text-white mb-3">
                      Wallet Name
                    </label>
                    <Input
                      type="text"
                      placeholder="hydra-wallet"
                      onChange={(e) => setWalletName(e.target.value)}
                      value={walletName}
                      className="h-12 text-base"
                      autoFocus
                    />
                    <p className="text-sm text-gray-400 mt-2">
                      Currently supports Hydra wallets with membership model "Wallet"
                    </p>
                  </div>
                  <TextureButton 
                    type="submit" 
                    variant="primary"
                    className="w-full h-12 text-base font-semibold"
                    disabled={!walletName.trim()}
                  >
                    Load Wallet
                  </TextureButton>
                </form>
              </ExpandableCardContent>
            </ExpandableCard>
          </div>

          {/* Create Wallet */}
          <div className="lg:col-span-1">
            <ExpandableCard className="h-full bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700/50 shadow-xl hover:shadow-2xl hover:border-gray-600/50 transition-all duration-300">
              <ExpandableCardHeader className="p-8 text-center">
                <h2 className="text-2xl font-semibold mb-4 text-white">
                  Create New Wallet
                </h2>
                <p className="text-gray-300 mb-8">
                  Set up a new treasury with custom member shares and distribution rules.
                </p>
              </ExpandableCardHeader>
              <ExpandableCardContent className="px-8 pb-8 flex flex-col items-center">
                <TextureButton 
                  variant="accent"
                  className="w-full h-12 text-base font-semibold mb-4"
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
                <p className="text-sm text-gray-400 text-center">
                  Configure members & shares
                </p>
              </ExpandableCardContent>
            </ExpandableCard>
          </div>

        </div>

        {/* Network Status */}
        <div className="flex justify-center">
          <div className="bg-gray-800/30 border border-gray-700/50 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium flex items-center gap-3">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-green-400">Network: {ctx.environment.label}</span>
          </div>
        </div>

      </div>
    </DashboardLayout>
  )
}

export default Home