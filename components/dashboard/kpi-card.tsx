import * as React from "react";
import { cn } from "@/lib/utils";

interface KPICardProps {
  label: string;
  value: React.ReactNode;
  subLabel?: string;
  emphasis?: boolean;
  action?: React.ReactNode;
  loading?: boolean;
}

export const KPICard: React.FC<KPICardProps> = ({
  label,
  value,
  subLabel,
  emphasis,
  action,
  loading,
}) => (
  <div
    className={cn(
      "glass-panel p-4 flex flex-col gap-1 relative transition-colors",
      emphasis &&
        "outline outline-[var(--color-accent-ring)] shadow-[0_0_0_1px_var(--color-accent-ring),0_4px_18px_-6px_var(--glow-accent-soft)]"
    )}
    data-elev={emphasis ? 2 : 1}
  >
    <div className="flex items-start justify-between gap-2">
      <div className="text-[11px] uppercase tracking-[1.2px] font-medium text-[var(--text-color-muted)]">
        {label}
      </div>
      {action}
    </div>
    <div className="text-2xl font-semibold tabular-nums font-heading text-white drop-shadow-sm">
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
