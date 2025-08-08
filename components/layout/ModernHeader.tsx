import * as React from "react"
import { useWallet } from '@solana/wallet-adapter-react'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { useTheme } from "next-themes"
import { Moon, Sun, Network } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useEnvironmentCtx, ENVIRONMENTS } from 'providers/EnvironmentProvider'
import { Cluster } from '@solana/web3.js'
import { cn } from "@/lib/utils"

interface HeaderProps {
  className?: string
}

export function ModernHeader({ className }: HeaderProps) {
  const { theme, setTheme } = useTheme()
  const ctx = useEnvironmentCtx()
  const wallet = useWallet()

  const updateNetwork = () => {
    const url = new URL(window.location.href)
    const currentCluster = ctx.environment.label

    let newCluster: Cluster;
    if (currentCluster === null) {
      newCluster = 'devnet'
    } else if (currentCluster === 'devnet') {
      newCluster = 'mainnet-beta'
    } else if (currentCluster === 'mainnet-beta') {
      newCluster = 'devnet'
    } else {
      newCluster = currentCluster
    }

    const newEnv = ENVIRONMENTS.find((env) => env.label === newCluster)
    if (!newEnv) return
    
    ctx.setEnvironment(newEnv)
    url.searchParams.set('cluster', newCluster)
    window.history.replaceState(null, '', url.toString())
  }

  return (
    <header className={cn(
      "flex items-center justify-between px-6 py-4 border-b bg-background",
      className
    )}>
      <div className="flex items-center gap-4">
        {/* Network Switcher */}
        <Button
          variant="outline"
          size="sm"
          onClick={updateNetwork}
          className="gap-2"
        >
          <Network className="h-4 w-4" />
          <span className="capitalize">{ctx.environment.label}</span>
        </Button>
      </div>

      <div className="flex items-center gap-4">
        {/* Theme Toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
        >
          <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>

        {/* Wallet Connection */}
        <WalletMultiButton
          style={{
            fontSize: '14px',
            height: '36px',
            borderRadius: '6px',
            backgroundColor: 'hsl(var(--primary))',
            border: 'none',
          }}
        />
      </div>
    </header>
  )
}