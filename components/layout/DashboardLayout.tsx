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
    <div className="flex h-screen bg-gray-950">
      {/* Sidebar */}
      <Sidebar 
        collapsed={sidebarCollapsed} 
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <ModernHeader />
        
        {/* Page Content */}
        <main className={cn(
          "flex-1 overflow-y-auto p-0",
          className
        )}>
          {children}
        </main>
      </div>
    </div>
  )
}