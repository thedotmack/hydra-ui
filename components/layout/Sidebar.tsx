import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/router"
import { 
  Home, 
  Wallet, 
  Users, 
  Plus, 
  BarChart3, 
  Settings,
  ChevronLeft,
  ChevronRight,
  Coins,
  TrendingUp,
  Shield
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useEnvironmentCtx } from "providers/EnvironmentProvider"

interface SidebarProps {
  className?: string
  collapsed?: boolean
  onToggle?: () => void
}

const sidebarItems = [
  {
    title: "Treasury",
    href: "/",
    icon: Home,
    color: "text-neon-cyan",
  },
  {
    title: "Create",
    href: "/create",
    icon: Plus,
    color: "text-neon-green",
  },
  {
    title: "Wallets",
    href: "/wallets",
    icon: Wallet,
    color: "text-neon-purple",
  },
  {
    title: "Members",
    href: "/memberships",
    icon: Users,
    color: "text-neon-cyan",
  },
  {
    title: "Analytics",
    href: "/analytics",
    icon: TrendingUp,
    color: "text-neon-green",
  },
]

export function Sidebar({ className, collapsed = false, onToggle }: SidebarProps) {
  const router = useRouter()
  const { environment } = useEnvironmentCtx()

  const getHref = (href: string) => {
    if (href === "/" || environment.label === "mainnet-beta") {
      return href
    }
    return `${href}?cluster=${environment.label}`
  }

  return (
    <div
      className={cn(
        "flex flex-col h-full glass border-r border-neon-cyan/20 transition-all duration-300",
        collapsed ? "w-16" : "w-72",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-neon-cyan/20">
        {!collapsed && (
          <div className="font-bold text-xl text-neon-cyan flex items-center gap-3">
            <div className="w-2 h-2 bg-neon-cyan rounded-full animate-glow"></div>
            HYDRA
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggle}
          className="h-8 w-8 hover:bg-muted/50 hover:text-neon-cyan transition-colors"
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      {/* Navigation */}
      <div className="flex-1 py-6">
        <nav className="space-y-2 px-4">
          {sidebarItems.map((item) => {
            const isActive = router.pathname === item.href
            const Icon = item.icon

            return (
              <Link key={item.href} href={getHref(item.href)}>
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start gap-4 h-12 font-medium transition-all duration-300 rounded-lg",
                    collapsed && "px-3 justify-center",
                    isActive 
                      ? "bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/30 glow-cyan" 
                      : "hover:bg-muted/30 hover:text-foreground text-muted-foreground"
                  )}
                >
                  <Icon className={cn(
                    "h-5 w-5 shrink-0 transition-colors",
                    isActive ? "text-neon-cyan" : item.color
                  )} />
                  {!collapsed && (
                    <span className={isActive ? "text-neon-cyan" : ""}>
                      {item.title}
                    </span>
                  )}
                </Button>
              </Link>
            )
          })}
        </nav>
      </div>

      {/* Footer Status */}
      {!collapsed && (
        <div className="p-4 border-t border-neon-cyan/20">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <div className="w-1.5 h-1.5 bg-neon-green rounded-full animate-glow"></div>
            <span>{environment.label}</span>
          </div>
        </div>
      )}
    </div>
  )
}