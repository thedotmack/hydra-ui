import * as React from "react"
import { useWallet } from '@solana/wallet-adapter-react'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { useTheme } from "next-themes"
import { Moon, Sun, Network } from "lucide-react"
import { TextureButton } from "@/components/ui/texture-button"
import { useEnvironmentCtx, ENVIRONMENTS } from 'providers/EnvironmentProvider'
import { Cluster } from '@solana/web3.js'
import { cn } from "@/lib/utils"

interface HeaderProps {
  className?: string
}

export function ModernHeader({ className }: HeaderProps) {
  const [mounted, setMounted] = React.useState(false)
  const { theme, setTheme } = useTheme()
  const ctx = useEnvironmentCtx()
  const wallet = useWallet()

  React.useEffect(() => {
    setMounted(true)
  }, [])

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
      "border-b border-gray-800/60 bg-gray-900/60 backdrop-blur-xl px-4 md:px-6",
      className
    )}>
      <div className="max-w-7xl mx-auto w-full flex items-center justify-between gap-6">
      <div className="flex items-center gap-3">
        {/* Network Switcher */}
        <TextureButton
          variant="secondary"
          onClick={updateNetwork}
          className="gap-2 bg-gray-800/50 border-gray-600 hover:bg-gray-700/50 hover:border-purple-400 transition-all duration-200"
        >
          <Network className="h-4 w-4 text-purple-400" />
          <span className="capitalize font-medium">{ctx.environment.label}</span>
        </TextureButton>
      </div>

  <div className="flex items-center gap-2 md:gap-4">
        {/* Theme Toggle */}
        {mounted && (
          <TextureButton
            variant="minimal"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            className="hover:bg-gray-800/50 hover:text-purple-400 transition-all duration-200 h-9 w-9"
          >
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-gray-300" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-gray-300" />
            <span className="sr-only">Toggle theme</span>
          </TextureButton>
        )}

        {/* Wallet Connection */}
        {mounted && (
          <div className="transition-all duration-200 rounded-lg">
            <WalletMultiButton
              style={{
                fontSize: '14px',
                height: '36px',
                borderRadius: '6px',
                background: 'linear-gradient(135deg, oklch(0.7 0.15 285), oklch(0.75 0.12 300))',
                border: 'none',
                color: 'white',
                fontWeight: '500',
              }}
            />
          </div>
        )}
  </div>
  </div>
    </header>
  )
}