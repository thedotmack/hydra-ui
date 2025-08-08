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
  ChevronRight
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
    title: "Dashboard",
    href: "/",
    icon: Home,
  },
  {
    title: "My Wallets",
    href: "/wallets",
    icon: Wallet,
  },
  {
    title: "Memberships",
    href: "/memberships",
    icon: Users,
  },
  {
    title: "Create Wallet",
    href: "/create",
    icon: Plus,
  },
  {
    title: "Analytics",
    href: "/analytics",
    icon: BarChart3,
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
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
        "flex flex-col h-full bg-card border-r transition-all duration-300",
        collapsed ? "w-16" : "w-64",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        {!collapsed && (
          <div className="font-bold text-lg">Hydra UI</div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggle}
          className="h-8 w-8"
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      {/* Navigation */}
      <div className="flex-1 py-4">
        <nav className="space-y-2 px-3">
          {sidebarItems.map((item) => {
            const isActive = router.pathname === item.href
            const Icon = item.icon

            return (
              <Link key={item.href} href={getHref(item.href)}>
                <Button
                  variant={isActive ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start gap-3",
                    collapsed && "px-2"
                  )}
                >
                  <Icon className="h-4 w-4 flex-shrink-0" />
                  {!collapsed && <span>{item.title}</span>}
                </Button>
              </Link>
            )
          })}
        </nav>
      </div>
    </div>
  )
}