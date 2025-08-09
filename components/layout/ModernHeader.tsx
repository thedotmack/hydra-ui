import * as React from "react"
import { useWallet } from '@solana/wallet-adapter-react'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { useTheme } from "next-themes"
import { Moon, Sun, Network, ChevronDown } from "lucide-react"
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

  const [announce, setAnnounce] = React.useState("")

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
  setAnnounce(`Network changed to ${newCluster}`)
  }

  return (
    <header className={cn(
      "h-14 border-b border-[var(--border-subtle)] bg-[var(--glass-bg)]/40 backdrop-blur-md px-4 sm:px-5 md:px-6",
      className
    )}>
      <div className="max-w-7xl mx-auto w-full h-full flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          {/* Network Switcher */}
          <TextureButton
            variant="glass"
            onClick={updateNetwork}
            aria-label="Change network"
            data-focus-ring="true"
            className="h-9 px-3 gap-1.5 text-sm font-medium hover:shadow-[0_0_0_1px_var(--color-accent-ring),0_0_0_3px_rgba(174,104,255,0.15)]"
          >
            <Network className="h-4 w-4 text-purple-300" />
            <span className="capitalize font-medium tracking-tight">{ctx.environment.label}</span>
            <ChevronDown className="h-3.5 w-3.5 opacity-70" />
          </TextureButton>
        </div>

        <div className="flex items-center gap-1.5 md:gap-2">
          {/* Theme Toggle */}
          {mounted && (
            <TextureButton
              variant="glass"
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
              aria-label="Toggle theme"
              data-focus-ring="true"
              className="h-9 w-9 p-0 flex items-center justify-center hover:shadow-[0_0_0_1px_var(--color-accent-ring),0_0_0_3px_rgba(174,104,255,0.15)]"
            >
              <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-gray-300" />
              <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-gray-300" />
            </TextureButton>
          )}

          {/* Wallet Connection */}
          {mounted && (
            <div className="btn-luminous h-9 flex items-center !px-0">
              <WalletMultiButton className="focus-ring !h-9 !px-4 !text-sm !font-medium !tracking-tight !bg-transparent !shadow-none !border-0" />
            </div>
          )}
        </div>
      </div>
  {/* Live region for network change announcements */}
  <span aria-live="polite" className="sr-only">{announce}</span>
    </header>
  )
}