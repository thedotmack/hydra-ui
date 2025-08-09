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
      <div className="max-w-6xl mx-auto px-6 py-8 gradient-primary pattern-dots min-h-screen space-rhythm-large">
        
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-5xl font-bold mb-4 text-gradient">
            Treasury Management
          </h1>
          <p className="text-slate-300 text-xl leading-relaxed max-w-3xl mx-auto text-enhanced">
            Manage multi-party revenue sharing wallets on Solana. Load an existing wallet or create a new one to get started.
          </p>
        </div>

        {/* Cards */}
        <div className="grid gap-8 lg:grid-cols-3">
          
          {/* Load Wallet - Primary */}
          <div className="lg:col-span-2">
            <Card className="glass-morphism hover:glow-accent hover-lift shadow-enhanced">
              <CardHeader className="pb-6">
                <CardTitle className="text-3xl text-gradient font-bold mb-3 text-glow">
                  Load Existing Wallet
                </CardTitle>
                <CardDescription className="text-slate-300 text-lg leading-relaxed text-enhanced">
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
                  <div className="space-rhythm-small">
                    <label className="text-lg font-semibold text-neon-cyan block mb-4 text-glow">
                      Wallet Name
                    </label>
                    <Input
                      type="text"
                      placeholder="hydra-wallet"
                      onChange={(e) => {
                        setWalletName(e.target.value)
                      }}
                      value={walletName}
                      className="input-enhanced h-14 text-white text-lg"
                      autoFocus
                    />
                    <p className="text-sm text-slate-400 mt-3 text-enhanced">
                      Currently supports Hydra wallets with membership model &quot;Wallet&quot;
                    </p>
                  </div>
                  <Button 
                    type="submit" 
                    className="gradient-accent button-enhanced hover-glow-intense hover-lift text-white h-14 text-lg"
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
            <Card className="glass hover:glow-gold hover-lift shadow-glow h-full">
              <CardHeader className="text-center pb-8">
                <CardTitle className="text-2xl text-neon-gold font-bold mb-4 text-glow">
                  Create New Wallet
                </CardTitle>
                <CardDescription className="text-slate-300 text-base leading-relaxed text-enhanced">
                  Set up a new treasury with custom member shares and distribution rules.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col justify-center items-center space-rhythm-small">
                <Button 
                  variant="outline"
                  className="border-gradient-hover glass-morphism text-neon-gold hover:text-white button-enhanced interactive-element h-12 px-8 text-lg"
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
                <p className="text-sm text-slate-400 mt-4 text-center text-enhanced">
                  Configure members & shares
                </p>
              </CardContent>
            </Card>
          </div>

        </div>

        {/* Status */}
        <div className="mt-16 flex items-center justify-center gap-3 text-sm">
          <div className="w-3 h-3 bg-neon-green rounded-full animate-glow shadow-neon"></div>
          <span className="text-neon-green text-enhanced">Network: {ctx.environment.label}</span>
        </div>

      </div>
    </DashboardLayout>
  )
}

export default Home
