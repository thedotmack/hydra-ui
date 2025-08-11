import * as React from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { tryPublicKey } from 'common/utils'
import { formatPercent } from '@/common/format'
import { ProgressBar } from '@/components/ui/progress-bar'

export interface StepMember { memberKey?: string; shares?: number }
interface CreateWalletStepperProps { onComplete: (data: { name: string; totalShares: number; members: StepMember[] }) => Promise<void> | void }

export const CreateWalletStepper: React.FC<CreateWalletStepperProps> = ({ onComplete }) => {
  const [step, setStep] = React.useState(0)
  const [name, setName] = React.useState('')
  const [totalShares, setTotalShares] = React.useState(100)
  const [members, setMembers] = React.useState<StepMember[]>([{ memberKey: '', shares: undefined }])
  const [submitting, setSubmitting] = React.useState(false)
  const sharesAllocated = members.reduce((s,m)=> s + (m.shares || 0), 0)
  const remaining = totalShares - sharesAllocated
  const canContinueName = name.trim().length >= 3 && !/\s/.test(name)
  const canContinueMembers = remaining === 0 && members.every(m=> m.memberKey && tryPublicKey(m.memberKey) && m.shares && m.shares > 0)

  function addMember(){ setMembers(m => [...m, { memberKey: '', shares: undefined }]) }
  function removeMember(i:number){ setMembers(m => m.filter((_,idx)=>idx!==i)) }
  async function finish(){ if(!canContinueMembers) return; setSubmitting(true); await onComplete({ name, totalShares, members }); setSubmitting(false) }

  return (
    <div className="flex flex-col gap-8 max-w-5xl mx-auto">
      <div className="flex flex-col gap-3">
        <ol className="flex items-center gap-4 text-[11px] uppercase tracking-wide font-medium">
        {['Wallet','Members','Review'].map((label,i)=>(<li key={label} className={"flex items-center gap-2 " + (i===step? 'text-[var(--color-accent)]':'text-[var(--text-color-muted)]')}><span className={"w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold " + (i<=step? 'bg-[var(--color-accent)] text-gray-950':'bg-[var(--glass-bg-alt)] text-gray-400')}>{i+1}</span>{label}</li>))}
        </ol>
        <ProgressBar value={step+1} max={3} label="Step progress" />
      </div>

      {step===0 && (
        <section className="glass-panel p-6 space-y-6" data-elev={2} aria-labelledby="step-wallet" data-surface="subtle">
          <h2 id="step-wallet" className="text-h3">Wallet Basics</h2>
          <div className="space-y-4 max-w-lg">
            <div className="space-y-2">
              <label htmlFor="wallet-name" className="form-label block">Wallet Name</label>
              <Input id="wallet-name" value={name} onChange={e=>setName(e.target.value)} placeholder="my-treasury" className="input-glass h-11 font-mono" data-focus-ring="true" />
              <p className="form-hint">3–32 chars, lowercase letters, numbers, hyphens.</p>
            </div>
            <div className="space-y-2">
              <label htmlFor="total-shares" className="form-label block">Total Shares</label>
              <Input id="total-shares" type="number" value={totalShares} onChange={e=>setTotalShares(parseInt(e.target.value)||0)} className="input-glass h-11 text-center text-lg font-semibold" data-focus-ring="true" />
              <p className="form-hint">Distribution units for allocations.</p>
            </div>
          </div>
          <div className="pt-1 flex justify-end">
            <Button disabled={!canContinueName} onClick={()=> setStep(1)} className="w-auto px-7 h-11 font-semibold">Continue</Button>
          </div>
        </section>
      )}

      {step===1 && (
        <section className="glass-panel p-6 space-y-6" data-elev={2} aria-labelledby="step-members" data-surface="subtle">
          <h2 id="step-members" className="text-h3">Members & Shares</h2>
          <div className="space-y-5">
            {members.map((m,i)=>{ const pct = m.shares && totalShares? (m.shares/totalShares)*100 : 0; return (
              <div key={i} className="grid gap-4 md:grid-cols-7 items-end glass-panel p-4" data-elev={1}>
                <div className="md:col-span-4 space-y-2">
                  <label htmlFor={`member-${i}`} className="form-label block">Member Wallet</label>
                  <Input id={`member-${i}`} value={m.memberKey} onChange={e=>{ const v=e.target.value; setMembers(list=> list.map((x,idx)=> idx===i? {...x, memberKey: v}: x)) }} placeholder="Wallet address" className="input-glass h-10 font-mono text-xs" data-focus-ring="true" />
                </div>
                <div className="space-y-2">
                  <label htmlFor={`shares-${i}`} className="form-label block">Shares</label>
                  <Input id={`shares-${i}`} type="number" value={m.shares ?? ''} onChange={e=>{ const v=parseInt(e.target.value)||0; setMembers(list=> list.map((x,idx)=> idx===i? {...x, shares: v}: x)) }} placeholder="0" className="input-glass h-10 text-center font-semibold" data-focus-ring="true" />
                </div>
                <div className="flex flex-col items-center gap-1">
                  <div className="text-sm font-semibold text-[var(--color-accent)]">{pct? formatPercent(pct,{ digits: pct<10?1:0 }).replace('%',''): '0'}%</div>
                  <div className="w-12 h-1.5 bg-white/10 rounded-full overflow-hidden"><div className="h-full bg-[var(--color-accent)]" style={{ width: `${Math.min(100,pct)}%` }} /></div>
                </div>
                <div className="flex items-center justify-end">
                  {members.length>1 && <Button variant="outline" size="sm" className="w-auto px-3" onClick={()=>removeMember(i)}>Remove</Button>}
                </div>
              </div>
            )})}
            <div className="flex gap-3 flex-wrap">
              <Button size="sm" className="px-4 h-9" onClick={addMember}>+ Add Member</Button>
              {members.length>1 && <Button variant="outline" size="sm" className="px-4 h-9" onClick={()=> setMembers(m=> m.slice(0,-1))}>- Remove Last</Button>}
            </div>
            <ProgressBar value={sharesAllocated} max={totalShares} label="Allocation progress" />
            <p className="text-[11px] text-[var(--text-color-muted)]">Allocated {sharesAllocated}/{totalShares} shares ({remaining} remaining)</p>
          </div>
          <div className="flex justify-between pt-1">
            <Button variant="outline" onClick={()=> setStep(0)} className="w-auto px-6 h-11">Back</Button>
            <Button disabled={!canContinueMembers} onClick={()=> setStep(2)} className="w-auto px-7 h-11 font-semibold">Review</Button>
          </div>
        </section>
      )}

      {step===2 && (
        <section className="glass-panel p-6 space-y-6" data-elev={2} aria-labelledby="step-review" data-surface="subtle">
          <h2 id="step-review" className="text-h3">Review & Create</h2>
          <div className="space-y-4 text-sm">
            <p><span className="text-[var(--text-color-muted)]">Wallet Name:</span> <span className="font-mono font-medium">{name}</span></p>
            <p><span className="text-[var(--text-color-muted)]">Total Shares:</span> {totalShares}</p>
            <div className="border-t border-white/10 pt-4 space-y-2">
              {members.map((m,i)=> (
                <div key={i} className="flex items-center justify-between text-xs">
                  <span className="font-mono truncate max-w-[160px]" title={m.memberKey}>{m.memberKey?.slice(0,4)}…{m.memberKey?.slice(-4)}</span>
                  <span className="tabular-nums">{m.shares} ({formatPercent((m.shares||0)/totalShares*100,{ digits: (m.shares||0)/totalShares*100 < 10?1:0 })})</span>
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-between pt-1">
            <Button variant="outline" onClick={()=> setStep(1)} className="w-auto px-6 h-11">Back</Button>
            <Button disabled={submitting || !canContinueMembers} onClick={finish} className="w-auto px-8 h-11 font-semibold">{submitting? 'Creating…':'Create Wallet'}</Button>
          </div>
        </section>
      )}
    </div>
  )
}
