import * as React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CopyButton } from "@/components/ui/copy-button";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from '@/components/ui/empty-state';
import { useAnalytics } from "@/hooks/useAnalytics";
import { useDataFreshness } from "@/hooks/useDataFreshness";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { IconSearch, IconArrowDown, IconArrowUp, IconDownload, IconDotsVertical } from "@tabler/icons-react";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { formatAmount, formatPercent } from "@/common/format";
interface MemberEntry { id: string; address: string; shares: number; claimed: number; totalClaimable: number; lastClaim?: string }
interface MemberListProps { members?: MemberEntry[]; loading?: boolean; totalShares: number; onDistributeMember?: (member: MemberEntry) => void }
export const MemberList: React.FC<MemberListProps> = ({ members = [], loading, totalShares, onDistributeMember }) => {
	const { track } = useAnalytics();
	const [query, setQuery] = React.useState("");
	const [sort, setSort] = React.useState<{ key: keyof MemberEntry; dir: 1 | -1 }>({ key: "shares", dir: -1 });
	const freshness = useDataFreshness(Date.now());
	const filtered = React.useMemo(()=>{ const q=query.trim().toLowerCase(); let list=members; if(q) list=list.filter(m=>m.address.toLowerCase().includes(q)||m.id.toLowerCase().includes(q)); list=[...list].sort((a,b)=>{const av:any=a[sort.key]; const bv:any=b[sort.key]; if(av===bv) return 0; return av>bv?sort.dir:-sort.dir}); return list; },[members,query,sort]);
	React.useEffect(()=>{ if(query) track({ name: 'members_search', queryLength: query.length }) },[query, track]);
	function exportCsv(){ const header=["id","address","shares","claimed","totalClaimable","lastClaim"]; const rows=members.map(m=>header.map(h=>(m as any)[h]??"")); const csv=[header.join(","), ...rows.map(r=>r.join(","))].join("\n"); const blob=new Blob([csv],{type:'text/csv'}); const url=URL.createObjectURL(blob); const a=document.createElement('a'); a.href=url; a.download='members.csv'; a.click(); URL.revokeObjectURL(url) }
	return (
		<section className="flex flex-col gap-4" aria-label="Members">
			<div className="flex items-center justify-between gap-4 flex-wrap px-1">
				<h2 className="eyebrow">Members</h2>
				<div className="flex items-center gap-2 flex-wrap">
					<Button size="sm" className="w-auto px-4 font-medium" onClick={()=>track({ name:'distribution_initiated', scope:'all' })}>Distribute Funds</Button>
					<div className="relative">
						<IconSearch className="absolute left-2 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
						<Input placeholder="Search" className="pl-8 h-8 w-44" value={query} onChange={e=>setQuery(e.target.value)} />
					</div>
					<Tooltip>
							<TooltipTrigger asChild>
								<Button variant="outline" size="sm" className="w-auto px-3" onClick={()=>setSort(s=>({ key: s.key, dir: s.dir * -1 as 1 | -1 }))}>{sort.dir === -1 ? <IconArrowDown className="size-4" /> : <IconArrowUp className="size-4" />} {sort.key}</Button>
							</TooltipTrigger>
						<TooltipContent>Toggle sort direction</TooltipContent>
					</Tooltip>
					<Tooltip>
							<TooltipTrigger asChild>
								<Button variant="outline" size="sm" className="w-auto px-3" onClick={exportCsv} aria-label="Export CSV"><IconDownload className="size-4" /></Button>
							</TooltipTrigger>
						<TooltipContent>Export CSV</TooltipContent>
					</Tooltip>
				</div>
			</div>
			<div className="glass-panel overflow-hidden" data-elev={2} role="table" aria-label="Member share allocations">
				<div className="grid grid-cols-[1.5fr_1fr_1fr_1fr_auto] gap-3 px-4 py-2 text-[10px] uppercase tracking-[1.4px] text-[var(--text-color-muted)]/80 bg-white/[0.02]" role="row">
					<div>Member</div><div className="text-right">Claimed</div><div className="text-right">Shares</div><div className="text-right">Share %</div><div className="text-right">Action</div>
				</div>
				{loading && <div className="p-4 space-y-3" role="rowgroup">{Array.from({ length: 4 }).map((_,i)=>(<div key={i} className="grid grid-cols-[1.5fr_1fr_1fr_1fr_auto] gap-3 px-4 items-center" role="row"><Skeleton className="h-5 w-40" /><Skeleton className="h-5 w-16 justify-self-end" /><Skeleton className="h-5 w-10 justify-self-end" /><Skeleton className="h-5 w-10 justify-self-end" /><Skeleton className="h-7 w-20 justify-self-end" /></div>))}</div>}
				{!loading && filtered.length===0 && <div className="p-4" role="row"><EmptyState dense title="No members found" description="Adjust your search or distribute funds once members are added." /></div>}
				{!loading && filtered.map(m=>{ const pct= totalShares ? (m.shares/totalShares)*100 : 0; return (
					<div key={m.id} className="grid grid-cols-[1.5fr_1fr_1fr_1fr_auto] gap-3 px-4 py-2.5 text-sm items-center hover:bg-white/4 transition-colors" role="row">
						<div className="flex items-center gap-2 min-w-0">
							<div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--glass-bg-alt)] border border-[var(--glass-border)] text-[var(--color-accent)] text-xs font-semibold">{m.id.slice(0,1).toUpperCase()}</div>
							<div className="flex flex-col truncate">
								<span className="font-medium truncate text-white" title={m.address}>{m.address.slice(0,4)}…{m.address.slice(-4)}</span>
								<span className="text-[11px] text-muted-foreground">Last claim {m.lastClaim || '—'}</span>
							</div>
							<CopyButton value={m.address} label="Copy Address" className="ml-auto" onCopy={()=>track({ name: 'copied_value', valueType: 'member_address' })} />
						</div>
						<div className="text-right align-decimals tabular-nums"><span className="int">{formatAmount(m.claimed, { maxSig: 6, minSig: 2 })}</span></div>
						<div className="text-right align-decimals tabular-nums"><span className="int">{m.shares}</span></div>
						<div className="text-right align-decimals tabular-nums" aria-label={`Share percent ${formatPercent(pct,{ digits: 2 })}`}><span className="int">{formatPercent(pct,{ digits: 2 })}</span></div>
						<div className="flex justify-end">
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
										<Button variant="ghost" size="icon" className="w-8 h-8 rounded-full" aria-label={`Member ${m.id} actions`}>
											<IconDotsVertical className="size-4" />
										</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent align="end" className="min-w-[160px]">
									<DropdownMenuItem onClick={() => { track({ name:'page_view', page: 'member_details' }) }}>View Details</DropdownMenuItem>
									<DropdownMenuItem onClick={() => { track({ name:'distribution_initiated', scope:'member', memberId:m.id }); onDistributeMember?.(m); }}>Distribute Portion</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						</div>
					</div>
				) })}
			</div>
			<p className="text-[11px] text-[var(--text-color-muted)] mt-1 px-1">{members.length} members • Updated {freshness.ageSeconds}s ago</p>
		</section>
	)
}
