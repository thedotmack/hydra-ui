import { Header } from 'common/Header'
import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useEnvironmentCtx } from 'providers/EnvironmentProvider'
import { useState } from 'react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

const Home: NextPage = () => {
  const [walletName, setWalletName] = useState<string>('')
  const router = useRouter()
  const ctx = useEnvironmentCtx()

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-900 via-gray-900 to-black">
        <div className="max-w-6xl mx-auto px-8 py-12">
        
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-4">
            Treasury Management
          </h1>
          <p className="text-gray-400 text-lg leading-relaxed mt-3 max-w-2xl mx-auto">
            Manage multi-party revenue sharing wallets on Solana. Load an existing wallet or create a new one to get started.
          </p>
        </div>

        {/* Cards */}
        <div className="grid gap-8 lg:grid-cols-3">
          
          {/* Load Wallet - Primary */}
          <div className="lg:col-span-2">
            <Card className="backdrop-blur-sm bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700/50 shadow-2xl shadow-gray-900/20 hover:shadow-3xl hover:border-gray-600/50 transition-all duration-300 hover:-translate-y-1">
              <CardHeader className="pb-6">
                <CardTitle className="text-2xl font-semibold mb-4 bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
                  Load Existing Wallet
                </CardTitle>
                <CardDescription className="text-gray-300 leading-relaxed mb-8">
                  Access your existing Hydra wallet to view balances, manage distributions, and track member activity.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    router.push(
                      `/${walletName}${
                        ctx.environment.label !== 'mainnet-beta'
                          ? `?cluster=${ctx.environment.label}`
                          : ''
                      }`,
                      undefined,
                      { shallow: true }
                    )
                  }}
                  className="space-y-6"
                >
                  <div className="space-y-4">
                    <label className="text-lg font-semibold text-white block mb-4">
                      Wallet Name
                    </label>
                    <Input
                      type="text"
                      placeholder="hydra-wallet"
                      onChange={(e) => {
                        setWalletName(e.target.value)
                      }}
                      value={walletName}
                      className="bg-gray-800/50 border-gray-600 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all duration-200 placeholder-gray-500 h-14 text-white text-lg focus:outline-none focus:border-transparent"
                      autoFocus
                    />
                    <p className="text-sm text-gray-400 mt-3">
                      Currently supports Hydra wallets with membership model &quot;Wallet&quot;
                    </p>
                  </div>
                  <Button 
                    type="submit" 
                    className="bg-gray-700/50 hover:bg-gray-600/50 border border-gray-600 hover:border-gray-500 transition-all duration-200 text-gray-200 hover:text-white h-14 text-lg focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-transparent"
                    disabled={!walletName.trim()}
                  >
                    Load Wallet
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Create Wallet - Secondary */}
          <div className="lg:col-span-1">
            <Card className="backdrop-blur-sm bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700/50 shadow-2xl shadow-gray-900/20 hover:shadow-3xl hover:border-gray-600/50 transition-all duration-300 hover:-translate-y-1 h-full">
              <CardHeader className="text-center pb-8">
                <CardTitle className="text-2xl font-semibold mb-4 bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
                  Create New Wallet
                </CardTitle>
                <CardDescription className="text-gray-300 leading-relaxed mb-8">
                  Set up a new treasury with custom member shares and distribution rules.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col justify-center items-center space-y-4">
                <Button 
                  variant="outline"
                  className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 focus:ring-2 focus:ring-purple-400/50 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-white h-12 px-8 text-lg focus:outline-none focus:border-transparent"
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
                </Button>
                <p className="text-sm text-gray-400 mt-4 text-center">
                  Configure members & shares
                </p>
              </CardContent>
            </Card>
          </div>

        </div>

        {/* Status */}
        <div className="mt-16 flex items-center justify-center">
          <div className="bg-gray-800/30 border border-gray-700/50 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium flex items-center gap-3">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-green-400">Network: {ctx.environment.label}</span>
          </div>
        </div>

        </div>
      </div>
    </DashboardLayout>
  )
}

export default Home
