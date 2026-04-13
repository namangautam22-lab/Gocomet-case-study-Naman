'use client';

import { useEffect } from 'react';
import { X, CheckCircle2, Lightbulb, Target, Layers, ArrowRight } from 'lucide-react';
import { useAppStore } from '@/store/appStore';

const PROBLEMS = [
  {
    num: '01',
    icon: Target,
    color: 'text-blue-600',
    bg: 'bg-blue-50',
    border: 'border-blue-100',
    accentBar: 'bg-blue-500',
    title: 'Fragmented multimodal tracking',
    hook: 'One shipment, three separate records.',
    solution: 'Journey-Centric Model — one row per shipment, spanning all legs.',
    features: [
      'Mode Chain badge shows the full Road → Ocean → Road sequence',
      'Journey Rail maps every leg with carrier, ETA, and delay',
      'Active leg is highlighted; completed legs dimmed',
      'Merge / Link modal consolidates fragmented entries',
    ],
  },
  {
    num: '02',
    icon: Lightbulb,
    color: 'text-amber-600',
    bg: 'bg-amber-50',
    border: 'border-amber-100',
    accentBar: 'bg-amber-500',
    title: 'Filters lost between sessions',
    hook: 'Users rebuilt filter sets every morning.',
    solution: 'Saved Views — persist filters, columns, and sort with one click.',
    features: [
      'Views Strip gives one-click access to named operational views',
      'Save Current View modal: name, scope (private / team / org)',
      'Per-view alert triggers (ETA slips, blockers, daily digest)',
      'Default view and pin-to-strip options',
    ],
  },
  {
    num: '03',
    icon: Layers,
    color: 'text-violet-600',
    bg: 'bg-violet-50',
    border: 'border-violet-100',
    accentBar: 'bg-violet-500',
    title: 'No remarks or custom milestones',
    hook: 'Ops had no way to add business context to shipments.',
    solution: 'Structured Remarks + Manual Milestones on every journey.',
    features: [
      'Add Remark: 7 note types, priority, visibility, assignee',
      'Blocker remark auto-escalates journey risk to Critical',
      'Add Milestone: 7 categories, owner, status, expected date',
      'Manual milestones appear in purple — distinct from system (blue)',
    ],
  },
];

const DEMO_FLOW = [
  'Control Tower overview',
  'Save a View (Problem 2)',
  'Open GTJ-001 detail',
  'Journey Rail + legs',
  'Add a Blocker Remark',
  'Watch risk → Critical',
  'Add a Manual Milestone',
  'Guided Tour (full)',
];

export function DesignRationale() {
  const setShowDesignRationale = useAppStore((s) => s.setShowDesignRationale);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => e.key === 'Escape' && setShowDesignRationale(false);
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [setShowDesignRationale]);

  return (
    <div className="fixed inset-0 z-50 flex fade-in">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/30 backdrop-blur-[1px]"
        onClick={() => setShowDesignRationale(false)}
      />

      {/* Slide-in panel from right */}
      <div className="relative z-10 ml-auto w-full max-w-sm bg-white shadow-2xl flex flex-col h-full panel-enter-right overflow-hidden">

        {/* Header */}
        <div className="flex items-start justify-between px-5 py-4 border-b border-slate-100 flex-shrink-0">
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Presenter Notes</p>
            <h2 className="text-sm font-bold text-slate-900">GoTrack 2.0 — Design Rationale</h2>
          </div>
          <button
            onClick={() => setShowDesignRationale(false)}
            className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg p-1.5 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Thesis strip */}
        <div className="px-5 py-3 bg-gradient-to-r from-blue-600 to-blue-700 flex-shrink-0">
          <p className="text-[11px] text-blue-100 leading-relaxed">
            Transform GoTrack from a tracking dashboard into a{' '}
            <strong className="text-white">journey-centric control tower</strong> for monitoring,
            prioritising, and collaborating on multimodal shipments — in one unified view.
          </p>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          {PROBLEMS.map(({ num, icon: Icon, color, bg, border, accentBar, title, hook, solution, features }) => (
            <div key={num} className={`rounded-xl border ${border} overflow-hidden`}>
              {/* Problem header */}
              <div className={`flex items-center gap-2.5 px-4 py-2.5 ${bg}`}>
                <span className={`text-[10px] font-black ${color} opacity-40`}>{num}</span>
                <div className={`w-0.5 h-3 ${accentBar} rounded-full opacity-40`} />
                <Icon size={13} className={color} />
                <span className={`text-xs font-bold ${color}`}>{title}</span>
              </div>

              <div className="px-4 py-3 space-y-2.5">
                {/* Hook */}
                <p className="text-[11px] text-slate-500 italic">"{hook}"</p>

                {/* Solution */}
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Solution · </span>
                  <span className="text-[11px] text-slate-700 font-semibold">{solution}</span>
                </div>

                {/* Features */}
                <ul className="space-y-1">
                  {features.map((f) => (
                    <li key={f} className="flex items-start gap-1.5 text-[11px] text-slate-600">
                      <CheckCircle2 size={11} className={`${color} flex-shrink-0 mt-0.5`} />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}

          {/* Demo flow */}
          <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2.5">Suggested Demo Flow</p>
            <div className="space-y-1">
              {DEMO_FLOW.map((step, i) => (
                <div key={step} className="flex items-center gap-2">
                  <span className="text-[9px] font-bold text-slate-300 w-3 text-right flex-shrink-0">{i + 1}</span>
                  <ArrowRight size={9} className="text-slate-300 flex-shrink-0" />
                  <span className="text-[11px] text-slate-600 font-medium">{step}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-slate-100 px-5 py-3 flex-shrink-0">
          <button
            onClick={() => setShowDesignRationale(false)}
            className="text-xs text-slate-400 hover:text-slate-600 font-medium transition-colors"
          >
            Close panel
          </button>
        </div>
      </div>
    </div>
  );
}
