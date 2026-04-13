'use client';

import { useState } from 'react';
import {
  MessageSquare, Clock, Users, Phone, Wrench, AlertOctagon, CheckCircle2, MessageSquarePlus,
} from 'lucide-react';
import { Drawer } from '@/components/ui/Drawer';
import { Button } from '@/components/ui/Button';
import { useAppStore } from '@/store/appStore';
import type { RemarkType, Visibility, Priority } from '@/types';

const NOTE_TYPES: {
  value: RemarkType; label: string; desc: string;
  Icon: React.ElementType; color: string; warn?: boolean;
}[] = [
  { value: 'general',          label: 'General Update',       desc: 'Status note or FYI',                Icon: MessageSquare, color: 'text-blue-600'    },
  { value: 'delay-reason',     label: 'Delay Reason',         desc: 'Document cause of delay',           Icon: Clock,         color: 'text-amber-600'   },
  { value: 'customer-comm',    label: 'Customer Comm',        desc: 'Log external interaction',          Icon: Phone,         color: 'text-violet-600'  },
  { value: 'internal-handoff', label: 'Internal Handoff',     desc: 'Transfer context to teammate',      Icon: Users,         color: 'text-slate-500'   },
  { value: 'action-required',  label: 'Action Required',      desc: 'Someone must act on this',          Icon: Wrench,        color: 'text-orange-600'  },
  { value: 'blocker',          label: 'Blocker',              desc: 'Escalate — marks risk Critical',    Icon: AlertOctagon,  color: 'text-red-600', warn: true },
  { value: 'resolution',       label: 'Resolution',           desc: 'Close out an issue',                Icon: CheckCircle2,  color: 'text-emerald-600' },
];

export function AddRemarkDrawer() {
  const { setShowAddRemarkDrawer, addRemark, getSelectedJourney } = useAppStore();
  const journey = getSelectedJourney();

  const [noteType, setNoteType]   = useState<RemarkType>('general');
  const [visibility, setVisibility] = useState<Visibility>('internal');
  const [appliesTo, setAppliesTo] = useState('journey');
  const [assignee, setAssignee]   = useState('');
  const [dueDate, setDueDate]     = useState('');
  const [priority, setPriority]   = useState<Priority>('medium');
  const [text, setText]           = useState('');
  const [saving, setSaving]       = useState(false);
  const [saved, setSaved]         = useState(false);

  if (!journey) return null;

  const isBlocker = noteType === 'blocker';

  const appliesToOptions = [
    { value: 'journey', label: 'Entire Journey' },
    ...journey.legs.map((l) => ({
      value: l.id,
      label: `${l.mode.charAt(0).toUpperCase() + l.mode.slice(1)} Leg — ${l.carrier}`,
    })),
  ];

  function handleSubmit() {
    if (!text.trim()) return;
    setSaving(true);
    setTimeout(() => {
      addRemark(journey!.id, {
        noteType, visibility, appliesTo,
        assignee: assignee || undefined,
        dueDate:  dueDate  || undefined,
        priority, text: text.trim(),
        author: 'Priya Sharma',
      });
      setSaving(false);
      setSaved(true);
      setTimeout(() => setShowAddRemarkDrawer(false), 900);
    }, 420);
  }

  if (saved) {
    return (
      <Drawer title="Remark Added" onClose={() => setShowAddRemarkDrawer(false)}>
        <div className="flex flex-col items-center justify-center h-full gap-4 text-center px-4">
          <div className={`w-14 h-14 rounded-full flex items-center justify-center ${isBlocker ? 'bg-red-100' : 'bg-emerald-100'}`}>
            {isBlocker
              ? <AlertOctagon size={24} className="text-red-600" />
              : <CheckCircle2 size={24} className="text-emerald-600" />}
          </div>
          <div>
            <p className="text-base font-bold text-slate-800 mb-1">Remark recorded</p>
            <p className="text-sm text-slate-500">Added to <span className="font-semibold text-blue-600">{journey.id}</span> and the activity feed.</p>
          </div>
          {isBlocker && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold px-4 py-2.5 rounded-lg">
              <AlertOctagon size={13} />
              Journey risk updated to <span className="font-black">Critical</span>
            </div>
          )}
        </div>
      </Drawer>
    );
  }

  return (
    <Drawer
      title="Add Remark"
      subtitle={`${journey.id} · ${journey.customer}`}
      onClose={() => setShowAddRemarkDrawer(false)}
      width="md"
      footer={
        <>
          <Button variant="ghost" onClick={() => setShowAddRemarkDrawer(false)}>Cancel</Button>
          <Button
            variant={isBlocker ? 'danger' : 'primary'}
            onClick={handleSubmit}
            loading={saving}
            disabled={!text.trim()}
            icon={<MessageSquarePlus size={13} />}
          >
            {isBlocker ? 'Mark as Blocked' : 'Add Remark'}
          </Button>
        </>
      }
    >
      <div className="space-y-5">

        {/* ── Note type (list-style, not grid) ─────────────────────── */}
        <div>
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 block">
            Note Type *
          </label>
          <div className="divide-y divide-slate-100 rounded-xl border border-slate-200 overflow-hidden">
            {NOTE_TYPES.map(({ value, label, desc, Icon, color, warn }) => {
              const selected = noteType === value;
              return (
                <button
                  key={value}
                  onClick={() => setNoteType(value)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 text-left transition-colors ${
                    selected
                      ? warn ? 'bg-red-50' : 'bg-blue-50'
                      : 'bg-white hover:bg-slate-50'
                  }`}
                >
                  <Icon size={14} className={selected ? color : 'text-slate-300'} strokeWidth={2} />
                  <div className="flex-1 min-w-0">
                    <div className={`text-xs font-semibold ${selected ? (warn ? 'text-red-800' : 'text-blue-800') : 'text-slate-700'}`}>
                      {label}
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">{desc}</div>
                  </div>
                  {selected && (
                    <CheckCircle2 size={14} className={warn ? 'text-red-500' : 'text-blue-500'} />
                  )}
                </button>
              );
            })}
          </div>

          {/* Blocker alert */}
          {isBlocker && (
            <div className="mt-2 flex items-start gap-2 text-xs text-red-700 bg-red-50 border border-red-200 p-3 rounded-lg">
              <AlertOctagon size={13} className="flex-shrink-0 mt-0.5" />
              <span>
                Marking this as a <strong>Blocker</strong> will set the journey risk to{' '}
                <strong>Critical</strong> and surface it in the At-Risk KPI. Only use for genuine blockers.
              </span>
            </div>
          )}
        </div>

        {/* ── Visibility ─────────────────────────────────────────────── */}
        <div>
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 block">Visibility</label>
          <div className="flex rounded-lg border border-slate-200 overflow-hidden">
            {(['internal', 'external'] as Visibility[]).map((v) => (
              <button
                key={v}
                onClick={() => setVisibility(v)}
                className={`flex-1 py-2 text-sm font-medium transition-colors text-center ${
                  visibility === v
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-slate-500 hover:bg-slate-50'
                }`}
              >
                {v === 'internal' ? 'Internal Only' : 'External Shareable'}
              </button>
            ))}
          </div>
          <p className="text-[10px] text-slate-400 mt-1.5">
            {visibility === 'external'
              ? 'Can be included in reports shared with the customer.'
              : 'Only visible to GoTrack users on your team.'}
          </p>
        </div>

        {/* ── Apply To ───────────────────────────────────────────────── */}
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

        {/* ── Priority + Assignee + Due date ─────────────────────────── */}
        <div className="grid grid-cols-3 gap-3">
          {/* Priority */}
          <div>
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 block">Priority</label>
            <div className="flex flex-col gap-1">
              {(['low','medium','high'] as Priority[]).map((p) => {
                const active = priority === p;
                const cls = {
                  low:    active ? 'border-slate-400 bg-slate-100 text-slate-700' : '',
                  medium: active ? 'border-amber-400 bg-amber-50 text-amber-700'  : '',
                  high:   active ? 'border-red-400   bg-red-50   text-red-700'    : '',
                }[p];
                return (
                  <button
                    key={p}
                    onClick={() => setPriority(p)}
                    className={`py-1.5 rounded-lg border text-xs font-semibold transition-colors ${active ? cls : 'border-slate-200 text-slate-400 hover:border-slate-300'}`}
                  >
                    {p.charAt(0).toUpperCase() + p.slice(1)}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Assignee */}
          <div>
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 block">Assignee</label>
            <select
              value={assignee}
              onChange={(e) => setAssignee(e.target.value)}
              className="w-full text-xs border border-slate-200 rounded-lg px-2.5 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white h-full max-h-28"
            >
              <option value="">None</option>
              {['Priya Sharma','Arjun Mehta','Sofia Martinez','Hans Mueller','Elena Fischer','Ramesh Iyer'].map((n) => (
                <option key={n} value={n}>{n.split(' ')[0]}</option>
              ))}
            </select>
          </div>

          {/* Due date */}
          <div>
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 block">Due Date</label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full text-xs border border-slate-200 rounded-lg px-2.5 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
        </div>

        {/* ── Note text ─────────────────────────────────────────────── */}
        <div>
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 block">Note *</label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="What happened? What's the impact? What's the next step?…"
            rows={5}
            className={`w-full text-sm border rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 resize-none transition-colors ${
              isBlocker
                ? 'border-red-300 focus:ring-red-400 bg-red-50/30'
                : 'border-slate-200 focus:ring-blue-400'
            }`}
          />
          <div className="flex justify-between mt-1">
            <span className="text-[10px] text-slate-400">Be specific — your team relies on this context.</span>
            <span className={`text-[10px] ${text.length > 420 ? 'text-amber-600 font-medium' : 'text-slate-300'}`}>
              {text.length}/500
            </span>
          </div>
        </div>
      </div>
    </Drawer>
  );
}
