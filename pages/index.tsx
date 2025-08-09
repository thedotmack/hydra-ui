import { Header } from 'common/Header'
import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useEnvironmentCtx } from 'providers/EnvironmentProvider'
import { useState } from 'react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

const Home: NextPage = () => {
  const [walletName, setWalletName] = useState<string>('')
  const router = useRouter()
  const ctx = useEnvironmentCtx()

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome to Hydra UI</h1>
          <p className="text-muted-foreground">
            Modern treasury management for Solana. Create and manage your Hydra wallets with ease.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Quick Access Card */}
          <Card>
            <CardHeader>
              <CardTitle>Load Existing Wallet</CardTitle>
              <CardDescription>
                Enter a wallet name to view and manage your existing Hydra wallet
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
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
                className="space-y-4"
              >
                <div>
                  <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Wallet Name
                  </label>
                  <input
                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    type="text"
                    placeholder="hydra-wallet"
                    onChange={(e) => {
                      setWalletName(e.target.value)
                    }}
                    value={walletName}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    We currently only support Hydra wallets of membership model Wallet
                  </p>
                </div>
                <Button type="submit" className="w-full">
                  Load Hydra Wallet
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Create New Wallet Card */}
          <Card>
            <CardHeader>
              <CardTitle>Create New Wallet</CardTitle>
              <CardDescription>
                Set up a new Hydra wallet with members and share distribution
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={() => {
                  router.push(
                    `/create${
                      ctx.environment.label !== 'mainnet-beta'
                        ? `?cluster=${ctx.environment.label}`
                        : ''
                    }`
                  )
                }}
                className="w-full"
              >
                Create Wallet
              </Button>
            </CardContent>
          </Card>

          {/* Network Info Card */}
          <Card>
            <CardHeader>
              <CardTitle>Network Status</CardTitle>
              <CardDescription>
                Currently connected to {ctx.environment.label}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-muted-foreground capitalize">
                  {ctx.environment.label} Active
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default Home
