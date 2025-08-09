import * as React from "react"
import { useState } from "react"
import { Sidebar } from "./Sidebar"
import { ModernHeader } from "./ModernHeader"
import { cn } from "@/lib/utils"

interface DashboardLayoutProps {
  children: React.ReactNode
  className?: string
}

export function DashboardLayout({ children, className }: DashboardLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  return (
    <div className="flex min-h-screen w-full bg-gray-950 text-gray-100 overflow-hidden">
      {/* Sidebar */}
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      {/* Main Content Wrapper */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header (sticky) */}
        <div className="sticky top-0 z-30">
          <ModernHeader />
        </div>

        {/* Page Content */}
        <main
          className={cn(
            "flex-1 min-h-[calc(100vh-4rem)] w-full px-0 pb-12 overflow-x-hidden",
            // Allow natural page scroll instead of nested scroll areas when content is taller
            // Parent uses min-h-screen so body scroll is fine
            className
          )}
        >
          {children}
        </main>
      </div>
    </div>
  )
}