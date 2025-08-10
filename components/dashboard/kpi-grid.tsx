import * as React from "react";
import { KPICard } from "./kpi-card";
import { formatAmount } from "@/common/format";
// Path adjusted to match actual file name (case-sensitive environments)
import { useDataFreshness } from "@/hooks";
import { Skeleton } from "@/components/ui/skeleton";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
interface KPIData { totalInflow: number; currentBalance: number; members: number; totalShares: number; lastUpdated: number; topHolderPct?: number; unclaimed?: number }

// Internal config for glossary style tooltips
const KPI_META: Record<string, { help?: string }> = {
  Available: { help: 'Current SOL/token balance held by the treasury and ready for distribution.' },
  'Total Received': { help: 'All-time cumulative inbound SOL/tokens this treasury has received.' },
  Members: { help: 'Number of member wallets (or NFTs / token holders depending on model).' },
  'Share Units': { help: 'Aggregate share units that define each member\'s proportional claim.' },
  'Top Holder': { help: 'Percentage owned by the largest single member (max share concentration).' },
  Undistributed: { help: 'Amount accrued but not yet distributed to members (still held in treasury).' },
};

export const KPIGrid: React.FC<{ data?: KPIData | null; loading?: boolean; tokenSymbol?: string }> = ({ data, loading, tokenSymbol = 'SOL' }) => {
  const freshness = useDataFreshness(data?.lastUpdated ?? null);
  // Empty state (no data yet but not loading)
  if (!loading && !data) {
    return (
      <section className="flex flex-col gap-4" aria-label="Overview">
        <div className="flex items-center justify-between px-1">
          <h2 className="eyebrow">Overview</h2>
        </div>
        <div className="glass-panel rounded-xl p-6 text-sm text-[var(--text-color-muted)]" data-elev={1}>
          <p className="font-medium text-white mb-1">No treasury metrics yet</p>
          <p>Load or create a wallet to see balances, inflow, members, and distribution stats.</p>
        </div>
      </section>
    )
  }
  const cards: Array<{ key: string; value: React.ReactNode; sub: string; emphasis?: boolean }> = [
  { key: 'Available', value: loading || !data ? <Skeleton className="h-7 w-20" /> : `${formatAmount(data.currentBalance)} ${tokenSymbol}`, sub: 'Ready to distribute', emphasis: true },
  { key: 'Total Received', value: loading || !data ? <Skeleton className="h-7 w-24" /> : `${formatAmount(data.totalInflow)} ${tokenSymbol}`, sub: 'All-time' },
    { key: 'Members', value: loading || !data ? <Skeleton className="h-7 w-10" /> : data.members, sub: 'Active wallets' },
    { key: 'Share Units', value: loading || !data ? <Skeleton className="h-7 w-10" /> : data.totalShares, sub: 'Total defined' },
  { key: 'Top Holder', value: loading || !data ? <Skeleton className="h-7 w-14" /> : `${formatAmount(data.topHolderPct ?? 0, { maxSig: 2, minSig: 2 })}%`, sub: 'Largest single share' },
  { key: 'Undistributed', value: loading || !data ? <Skeleton className="h-7 w-16" /> : <span>{formatAmount(data.unclaimed ?? 0)} {tokenSymbol} <Tooltip><TooltipTrigger asChild><span className="ml-1 inline-block align-middle text-[10px] px-1 py-0.5 rounded bg-white/10 text-[var(--text-color-muted)] cursor-help" aria-describedby="undistributed-desc">Approx</span></TooltipTrigger><TooltipContent className="max-w-xs">Approximate until precise per-member accrual tracking is implemented.</TooltipContent></Tooltip><span id="undistributed-desc" className="sr-only">Approximate value</span></span>, sub: 'Awaiting send' },
  ];
  return (
    <section className="flex flex-col gap-4" aria-label="Overview">
      <div className="flex items-center justify-between px-1">
        <h2 className="eyebrow">Overview</h2>
        <div className="text-[11px] text-[var(--text-color-muted)]" role="status">{data ? <span className={freshness.isStale ? "text-amber-500" : undefined}>Updated {freshness.ageSeconds}s ago</span> : <Skeleton className="h-3 w-24" />}</div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-6">
        {cards.map(c => {
          const meta = KPI_META[c.key];
          const labelNode = meta?.help ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <button type="button" className="cursor-help focus:outline-none focus-visible:ring-1 focus-visible:ring-[var(--color-accent-ring)] rounded-sm" aria-label={c.key + ' info'}>{c.key}</button>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs leading-relaxed">{meta.help}</TooltipContent>
            </Tooltip>
          ) : c.key;
          return <KPICard key={c.key} label={labelNode as any} value={c.value} subLabel={c.sub} emphasis={c.emphasis} loading={loading} />
        })}
      </div>
    </section>
  );
};

// Alias export for planned rename without breaking old imports
export const WalletOverviewStats = KPIGrid;
