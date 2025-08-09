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
import { TextureButton } from "@/components/ui/texture-button"
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
  },
  {
    title: "Create",
    href: "/create",
    icon: Plus,
  },
  {
    title: "Wallets",
    href: "/wallets",
    icon: Wallet,
  },
  {
    title: "Members",
    href: "/memberships",
    icon: Users,
  },
  {
    title: "Analytics",
    href: "/analytics",
    icon: TrendingUp,
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
        "flex flex-col h-full bg-gray-900/50 backdrop-blur-sm border-r border-gray-700/50 transition-all duration-300",
        collapsed ? "w-16" : "w-72",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-700/50">
        {!collapsed && (
          <div className="font-bold text-xl text-white flex items-center gap-3">
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
            HYDRA
          </div>
        )}
        <TextureButton
          variant="minimal"
          onClick={onToggle}
          className="h-8 w-8 hover:bg-gray-800/50 hover:text-purple-400 transition-colors"
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </TextureButton>
      </div>

      {/* Navigation */}
      <div className="flex-1 py-6">
        <nav className="space-y-2 px-4">
          {sidebarItems.map((item) => {
            const isActive = router.pathname === item.href
            const Icon = item.icon

            return (
              <Link key={item.href} href={getHref(item.href)}>
                <TextureButton
                  variant="minimal"
                  className={cn(
                    "w-full justify-start gap-4 h-12 font-medium transition-all duration-200 rounded-lg group",
                    collapsed && "px-3 justify-center",
                    isActive 
                      ? "bg-purple-900/30 text-purple-400 border border-purple-400/30 shadow-lg" 
                      : "hover:bg-gray-800/50 hover:border-r-2 hover:border-purple-400 text-gray-300 hover:text-white"
                  )}
                >
                  <Icon className={cn(
                    "h-5 w-5 shrink-0 transition-colors duration-200",
                    isActive ? "text-purple-400" : "text-gray-400 group-hover:text-purple-400"
                  )} />
                  {!collapsed && (
                    <span className={isActive ? "text-purple-400" : "group-hover:text-white"}>
                      {item.title}
                    </span>
                  )}
                </TextureButton>
              </Link>
            )
          })}
        </nav>
      </div>

      {/* Footer Status */}
      {!collapsed && (
        <div className="p-4 border-t border-gray-700/50">
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
            <span>{environment.label}</span>
          </div>
        </div>
      )}
    </div>
  )
}