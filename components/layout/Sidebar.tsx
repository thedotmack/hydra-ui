import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/router"
import { 
  Home,
  Plus,
  ChevronLeft,
  ChevronRight,
  Users,
  ActivityIcon as Activity,
  Settings
} from "lucide-react"
import { cn } from "@/lib/utils"
import { TextureButton } from "@/components/ui/texture-button"
import { useEnvironmentCtx } from "providers/EnvironmentProvider"

interface SidebarProps {
  className?: string
  collapsed?: boolean
  onToggle?: () => void
}

// New streamlined IA: Dashboard, Create, (contextual wallet anchors rendered dynamically when on wallet page)
const baseNav = [
  { title: 'Dashboard', href: '/', icon: Home },
  { title: 'Create Wallet', href: '/create', icon: Plus },
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
        "flex flex-col h-full border-r border-[var(--border-subtle)] transition-all duration-300 bg-[linear-gradient(165deg,rgba(255,255,255,0.04)_0%,rgba(255,255,255,0.02)_55%,rgba(255,255,255,0)_100%)] backdrop-blur-xl",
        collapsed ? "w-16" : "w-72",
        className
      )}
    >
      {/* Header (logo moved to fixed ModernHeader) */}
      <div className="flex items-center justify-end p-6 border-b border-gray-700/40">
        <TextureButton
          variant="glass"
          onClick={onToggle}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          aria-expanded={!collapsed}
          data-focus-ring="true"
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="h-8 w-8 p-0 hover:shadow-[0_0_0_1px_var(--color-accent-ring)]"
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </TextureButton>
      </div>

      {/* Navigation */}
  <nav className="flex flex-col gap-1 px-3 py-2">
          {baseNav.map((item) => {
            const isActive = router.pathname === item.href
            const Icon = item.icon

            return (
              <Link key={item.href} href={getHref(item.href)} aria-current={isActive ? 'page' : undefined}>
                <TextureButton
                  variant="glass"
                  className={cn(
                    "relative w-full justify-start gap-3 h-11 font-medium transition-colors duration-150 rounded-[var(--radius-md)] group text-sm tracking-tight pl-4 pr-3 overflow-hidden",
                    collapsed && "px-0 justify-center pl-0",
                    isActive
                      ? "nav-item-active text-[var(--color-accent)]"
                      : "text-gray-300 hover:text-white"
                  )}
                  data-focus-ring="true"
                >
                  <Icon className={cn(
                    "h-5 w-5 shrink-0 transition-colors duration-150 relative z-10",
                    isActive ? "text-[var(--color-accent)]" : "text-gray-400 group-hover:text-[var(--color-accent)]"
                  )} />
                  {!collapsed && (
                    <span className={cn("relative z-10", isActive ? "text-[var(--color-accent)]" : "group-hover:text-white") }>
                      {item.title}
                    </span>
                  )}
                </TextureButton>
              </Link>
            )
          })}
      </nav>

      {/* Footer: network + version */}
      {!collapsed && (
        <div className="mt-auto p-4 border-t border-gray-700/40 space-y-2">
          <div className="flex items-center gap-2 text-xs text-gray-400" aria-label={`Network: ${environment.label}`}>
            <span className="status-pulse" />
            <span className="capitalize">{environment.label}</span>
          </div>
          <div className="text-[10px] text-gray-500">v0.1 IA</div>
        </div>
      )}
    </div>
  )
}