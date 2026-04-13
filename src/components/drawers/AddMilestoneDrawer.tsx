'use client';

import { useState } from 'react';
import { Flag, CheckCircle2, Info, User } from 'lucide-react';
import { Drawer } from '@/components/ui/Drawer';
import { Button } from '@/components/ui/Button';
import { useAppStore } from '@/store/appStore';
import type { MilestoneStatus } from '@/types';

const CATEGORIES: {
  value: string; label: string; short: string;
  color: string; bg: string; border: string; dot: string;
}[] = [
  { value: 'Documentation',          label: 'Documentation',          short: 'Doc review, cert receipt, sign-off',        color: 'text-blue-700',   bg: 'bg-blue-50',   border: 'border-blue-200',   dot: 'bg-blue-500'   },
  { value: 'Customs',                label: 'Customs',                short: 'Clearance, duties, broker coordination',    color: 'text-amber-700',  bg: 'bg-amber-50',  border: 'border-amber-200',  dot: 'bg-amber-500'  },
  { value: 'Warehouse',              label: 'Warehouse',              short: 'In/out, cross-dock, palletization',         color: 'text-orange-700', bg: 'bg-orange-50', border: 'border-orange-200', dot: 'bg-orange-500' },
  { value: 'Carrier Coordination',   label: 'Carrier Coordination',   short: 'Pickup confirm, space booking, handoff',    color: 'text-teal-700',   bg: 'bg-teal-50',   border: 'border-teal-200',   dot: 'bg-teal-500'   },
  { value: 'Customer Communication', label: 'Customer Comm.',         short: 'Approval, update, escalation',              color: 'text-violet-700', bg: 'bg-violet-50', border: 'border-violet-200', dot: 'bg-violet-500' },
  { value: 'Internal Review',        label: 'Internal Review',        short: 'Team check, compliance, pricing review',    color: 'text-slate-600',  bg: 'bg-slate-100', border: 'border-slate-200',  dot: 'bg-slate-400'  },
  { value: 'Exception Handling',     label: 'Exception Handling',     short: 'Damage, delay escalation, route change',    color: 'text-red-700',    bg: 'bg-red-50',    border: 'border-red-200',    dot: 'bg-red-500'    },
];

const STATUSES: { value: MilestoneStatus; label: string; cls: string }[] = [
  { value: 'planned',     label: 'Planned',     cls: 'border-slate-300  bg-slate-50   text-slate-600'  },
  { value: 'in-progress', label: 'In Progress', cls: 'border-blue-400   bg-blue-50    text-blue-700'   },
  { value: 'completed',   label: 'Completed',   cls: 'border-emerald-400 bg-emerald-50 text-emerald-700'},
  { value: 'blocked',     label: 'Blocked',     cls: 'border-red-400    bg-red-50     text-red-700'    },
];

export function AddMilestoneDrawer() {
  const { setShowAddMilestoneDrawer, addMilestone, getSelectedJourney } = useAppStore();
  const journey = getSelectedJourney();

  const [name, setName]             = useState('');
  const [category, setCategory]     = useState('Documentation');
  const [appliesTo, setAppliesTo]   = useState('journey');
  const [expectedDate, setExpectedDate] = useState('');
  const [owner, setOwner]           = useState('Priya Sharma');
  const [status, setStatus]         = useState<MilestoneStatus>('planned');
  const [note, setNote]             = useState('');
  const [saving, setSaving]         = useState(false);
  const [saved, setSaved]           = useState(false);

  if (!journey) return null;

  const appliesToOptions = [
    { value: 'journey', label: 'Entire Journey' },
    ...journey.legs.map((leg) => ({
      value: leg.id,
      label: `${leg.mode.charAt(0).toUpperCase() + leg.mode.slice(1)} Leg — ${leg.carrier}`,
    })),
  ];

  function handleSubmit() {
    if (!name.trim() || !expectedDate) return;
    setSaving(true);
    setTimeout(() => {
      addMilestone(journey!.id, {
        legId: appliesTo !== 'journey' ? appliesTo : undefined,
        name: name.trim(),
        type: 'manual',
        status,
        date: expectedDate,
        category,
        owner,
        note: note.trim() || undefined,
        createdBy: 'Priya Sharma',
      });
      setSaving(false);
      setSaved(true);
      setTimeout(() => setShowAddMilestoneDrawer(false), 900);
    }, 420);
  }

  if (saved) {
    return (
      <Drawer title="Milestone Added" onClose={() => setShowAddMilestoneDrawer(false)}>
        <div className="flex flex-col items-center justify-center h-full gap-4 text-center px-4">
          <div className="w-14 h-14 bg-violet-100 rounded-full flex items-center justify-center">
            <CheckCircle2 size={24} className="text-violet-600" />
          </div>
          <div>
            <p className="text-base font-bold text-slate-800 mb-1">Milestone recorded</p>
            <p className="text-sm text-slate-500">
              <span className="font-semibold text-violet-700">{name}</span> added to{' '}
              <span className="font-semibold text-blue-600">{journey.id}</span> as a manual milestone.
            </p>
          </div>
          <div className="flex items-center gap-2 bg-violet-50 border border-violet-200 text-violet-700 text-xs font-semibold px-4 py-2.5 rounded-lg">
            <User size={12} />
            Appears in purple on the milestones timeline
          </div>
        </div>
      </Drawer>
    );
  }

  const selectedCat = CATEGORIES.find((c) => c.value === category)!;

  return (
    <Drawer
      title="Add Milestone"
      subtitle={`${journey.id} · ${journey.customer}`}
      onClose={() => setShowAddMilestoneDrawer(false)}
      width="md"
      footer={
        <>
          <Button variant="ghost" onClick={() => setShowAddMilestoneDrawer(false)}>Cancel</Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            loading={saving}
            disabled={!name.trim() || !expectedDate}
            icon={<Flag size={13} />}
          >
            Add Milestone
          </Button>
        </>
      }
    >
      <div className="space-y-5">

        {/* ── Manual distinction note ─────────────────────────────── */}
        <div className="flex items-start gap-2 p-3 bg-violet-50 rounded-lg border border-violet-100 text-xs text-violet-700">
          <Info size={13} className="flex-shrink-0 mt-0.5" />
          <span>Manual milestones appear in <strong>purple</strong> in the timeline, clearly distinct from system-tracked milestones (blue).</span>
        </div>

        {/* ── Category (list-style) ───────────────────────────────── */}
        <div>
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 block">
            Category *
          </label>
          <div className="divide-y divide-slate-100 rounded-xl border border-slate-200 overflow-hidden">
            {CATEGORIES.map(({ value, label, short, color, bg, dot }) => {
              const selected = category === value;
              return (
                <button
                  key={value}
                  onClick={() => setCategory(value)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 text-left transition-colors ${
                    selected ? bg : 'bg-white hover:bg-slate-50'
                  }`}
                >
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 ${selected ? dot : 'bg-slate-300'}`} />
                  <div className="flex-1 min-w-0">
                    <div className={`text-xs font-semibold ${selected ? color : 'text-slate-700'}`}>{label}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">{short}</div>
                  </div>
                  {selected && (
                    <CheckCircle2 size={14} className={color} />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Milestone name ─────────────────────────────────────── */}
        <div>
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 block">Milestone Name *</label>
          <input
            autoFocus
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Customer sign-off, Insurance cert received, Final customs check…"
            className="w-full text-sm border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* ── Apply To ───────────────────────────────────────────── */}
        <div>
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 block">Applies To</label>
          <select
            value={appliesTo}
            onChange={(e) => setAppliesTo(e.target.value)}
            className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
          >
            {appliesToOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        {/* ── Initial Status ─────────────────────────────────────── */}
        <div>
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 block">Initial Status</label>
          <div className="flex gap-2">
            {STATUSES.map(({ value, label, cls }) => (
              <button
                key={value}
                onClick={() => setStatus(value)}
                className={`flex-1 py-2 rounded-lg border-2 text-xs font-semibold transition-colors ${
                  status === value ? cls : 'border-slate-200 text-slate-400 hover:border-slate-300'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* ── Expected Date + Owner ──────────────────────────────── */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 block">Expected Date *</label>
            <input
              type="date"
              value={expectedDate}
              onChange={(e) => setExpectedDate(e.target.value)}
              className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div>
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 block">Owner</label>
            <select
              value={owner}
              onChange={(e) => setOwner(e.target.value)}
              className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
            >
              {['Priya Sharma','Arjun Mehta','Sofia Martinez','Hans Mueller','Elena Fischer','Ramesh Iyer'].map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </div>
        </div>

        {/* ── Optional Note ─────────────────────────────────────── */}
        <div>
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 block">Note <span className="font-normal normal-case text-slate-400">(optional)</span></label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Add context, criteria, or instructions for this milestone…"
            rows={3}
            className="w-full text-sm border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
          />
        </div>
      </div>
    </Drawer>
  );
}
