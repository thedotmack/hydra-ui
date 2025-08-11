import * as React from 'react'
import { cn } from '@/lib/utils'

/* Card primitive: minimal, relies on glass/elevation tokens */
export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  elev?: 0 | 1 | 2 | 3
  surface?: 'subtle' | 'soft' | 'solid'
  padding?: 'sm' | 'md' | 'lg' | 'none'
  as?: keyof JSX.IntrinsicElements
}

const padMap = { sm: 'p-4', md: 'p-6', lg: 'p-8', none: '' }

const BaseCard = React.forwardRef<HTMLDivElement, CardProps>(function Card(
  { className, elev = 1, surface = 'subtle', padding = 'md', as = 'div', ...rest }, ref
) {
  const Comp: any = as
  return (
    <Comp
      ref={ref}
      data-elev={elev}
      data-surface={surface}
      className={cn('glass-panel rounded-[var(--radius-xl)] transition-shadow', padMap[padding], className)}
      {...rest}
    />
  )
})

export interface CardHeaderProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  heading?: React.ReactNode
  subtitle?: React.ReactNode
  actions?: React.ReactNode
  tight?: boolean
}
export const CardHeader: React.FC<CardHeaderProps> = ({ heading, subtitle, actions, tight, className, children, ...rest }) => (
  <div className={cn('flex items-start justify-between gap-4', tight ? 'mb-3' : 'mb-5', className)} {...rest}>
    <div className="space-y-1 min-w-0">
      {heading && <h3 className="text-base font-semibold tracking-tight leading-tight truncate">{heading}</h3>}
      {subtitle && <p className="text-xs text-[var(--text-color-muted)] leading-relaxed max-w-prose">{subtitle}</p>}
      {children}
    </div>
    {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
  </div>
)

export const CardBody: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, ...rest }) => (
  <div className={cn('space-y-4', className)} {...rest} />
)

export const CardFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, ...rest }) => (
  <div className={cn('pt-4 mt-2 border-t border-white/5 flex items-center justify-end gap-2', className)} {...rest} />
)

export const CardGroup: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, ...rest }) => (
  <div className={cn('grid gap-6 md:grid-cols-2 xl:grid-cols-3', className)} {...rest} />
)

interface CardCompound extends React.ForwardRefExoticComponent<CardProps & React.RefAttributes<HTMLDivElement>> {
  Header: typeof CardHeader
  Body: typeof CardBody
  Footer: typeof CardFooter
  Group: typeof CardGroup
}

const _Card = BaseCard as CardCompound
_Card.Header = CardHeader
_Card.Body = CardBody
_Card.Footer = CardFooter
_Card.Group = CardGroup

export { _Card as Card }
export default _Card
