import * as React from "react"
import { useState } from "react"
import { Sidebar } from "./Sidebar"
import { ModernHeader } from "./ModernHeader"
import { cn } from "@/lib/utils"
import { SiteFooter } from "./SiteFooter"

interface DashboardLayoutProps {
  children: React.ReactNode
  className?: string
}

export function DashboardLayout({ children, className }: DashboardLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  return (
  <div className="flex min-h-screen w-full bg-[radial-gradient(circle_at_top,_rgba(60,60,70,0.15),_transparent_70%)] bg-gray-950 text-gray-100 overflow-hidden font-body">
      {/* Sidebar */}
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      {/* Main Content Wrapper */}
      <div className="flex-1 flex flex-col min-w-0 relative">
        {/* Vertical divider overlay for clearer separation */}
        <div className="pointer-events-none absolute left-0 top-0 h-full w-px bg-gradient-to-b from-transparent via-gray-800 to-transparent" />
        {/* Header (sticky) */}
        <div className="sticky top-0 z-30">
          <ModernHeader />
        </div>

        {/* Page Content */}
        <main className={cn(
          "flex-1 min-h-[calc(100vh-4rem)] w-full pb-10 overflow-x-hidden flex flex-col",
          className
        )}>
          <div className="flex-1 max-w-7xl mx-auto w-full px-6 md:px-8 pt-10">
            {children}
          </div>
          <SiteFooter />
        </main>
      </div>
    </div>
  )
}