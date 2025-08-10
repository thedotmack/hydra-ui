import * as React from "react";
import { cn } from "@/lib/utils";

interface KPICardProps {
  label: React.ReactNode;
  value: React.ReactNode;
  subLabel?: string;
  emphasis?: boolean; // legacy emphasis boolean
  action?: React.ReactNode;
  loading?: boolean;
  size?: 'primary' | 'secondary';
  className?: string;
}

export const KPICard: React.FC<KPICardProps> = ({
  label,
  value,
  subLabel,
  emphasis,
  action,
  loading,
  size = 'secondary',
  className,
}) => {
  const isPrimary = size === 'primary' || emphasis;
  return (
    <div
      className={cn(
        "glass-panel bg-white/[0.015] flex flex-col gap-1 relative transition-colors",
        isPrimary ? "p-5 sm:p-6" : "p-4",
        isPrimary &&
          "outline outline-[var(--color-accent-ring)] shadow-[0_0_0_1px_var(--color-accent-ring),0_4px_18px_-6px_var(--glow-accent-soft)]",
        className
      )}
      data-elev={isPrimary ? 2 : 1}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="text-[11px] uppercase tracking-[1.3px] font-semibold text-[var(--text-color-muted)]/80">
          {label}
        </div>
        {action}
      </div>
      <div className={cn(
        "font-semibold tabular-nums font-heading text-white drop-shadow-sm",
        isPrimary ? "text-[1.9rem] leading-none" : "text-2xl"
      )}>
        {value}
      </div>
      {subLabel && (
        <div className="text-[11px] text-[var(--text-color-muted)]">{subLabel}</div>
      )}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center text-xs text-[var(--text-color-muted)] bg-black/30 backdrop-blur-sm">
          Loading…
        </div>
      )}
    </div>
  );
};
