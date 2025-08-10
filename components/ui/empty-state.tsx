import * as React from 'react'
import { cn } from '@/lib/utils'

export interface EmptyStateProps {
  title: string
  description?: string
  icon?: React.ReactNode
  action?: React.ReactNode
  dense?: boolean
  className?: string
}

export const EmptyState: React.FC<EmptyStateProps> = ({ title, description, icon, action, dense, className }) => {
  return (
    <div className={cn('glass-panel rounded-xl text-sm text-[var(--text-color-muted)] flex flex-col items-start', dense ? 'p-4 gap-3' : 'p-6 gap-4', className)} data-elev={1}>
      <div className="flex items-center gap-3">
        {icon && <div className="text-xl opacity-70" aria-hidden="true">{icon}</div>}
        <p className="font-medium text-white text-base leading-none tracking-tight">{title}</p>
      </div>
      {description && <p className="leading-relaxed max-w-prose">{description}</p>}
      {action && <div className="mt-1">{action}</div>}
    </div>
  )
}

export default EmptyState
