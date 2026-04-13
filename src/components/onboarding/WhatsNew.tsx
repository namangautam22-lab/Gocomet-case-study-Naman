'use client';

import { useEffect } from 'react';
import { X, Link2, Bookmark, MessageSquarePlus } from 'lucide-react';
import { useAppStore } from '@/store/appStore';
import { Button } from '@/components/ui/Button';

const FEATURES = [
  {
    icon: Link2,
    color: 'text-blue-600',
    bg: 'bg-blue-50',
    border: 'border-blue-100',
    title: 'Unified Journey View',
    body: 'One row covers every leg — Road, Ocean, Air — in a single end-to-end record. No more hunting across fragmented entries.',
  },
  {
    icon: Bookmark,
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
    border: 'border-emerald-100',
    title: 'Saved Views',
    body: 'Save any filter combination as a named view. Views persist between sessions and can be shared with your team.',
  },
  {
    icon: MessageSquarePlus,
    color: 'text-violet-600',
    bg: 'bg-violet-50',
    border: 'border-violet-100',
    title: 'Remarks & Milestones',
    body: 'Add business context — delay reasons, customer comms, blockers — and create custom checkpoints your carriers don\'t track.',
  },
];

export function WhatsNew() {
  const { showWhatsNew, setShowWhatsNew } = useAppStore();

  // Auto-show on first visit
  useEffect(() => {
    try {
      if (!localStorage.getItem('gt_onboarded')) {
        setShowWhatsNew(true);
      }
    } catch {}
  }, [setShowWhatsNew]);

  if (!showWhatsNew) return null;

  function handleDismiss() {
    try { localStorage.setItem('gt_onboarded', '1'); } catch {}
    setShowWhatsNew(false);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 fade-in">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]" onClick={handleDismiss} />

      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-modal overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[11px] font-semibold text-blue-200 uppercase tracking-widest mb-1">
                GoTrack 2.0
              </p>
              <h2 className="text-lg font-bold text-white">What's new</h2>
              <p className="text-sm text-blue-100 mt-1 leading-relaxed">
                End-to-end shipment visibility, finally in one place.
              </p>
            </div>
            <button
              onClick={handleDismiss}
              className="text-blue-200 hover:text-white transition-colors mt-0.5"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Feature grid */}
        <div className="p-6 grid grid-cols-3 gap-3">
          {FEATURES.map(({ icon: Icon, color, bg, border, title, body }) => (
            <div key={title} className={`rounded-xl border ${border} ${bg} p-4`}>
              <div className={`w-8 h-8 rounded-lg bg-white flex items-center justify-center mb-3 shadow-sm`}>
                <Icon size={16} className={color} />
              </div>
              <h3 className={`text-xs font-bold ${color} mb-1.5`}>{title}</h3>
              <p className="text-[11px] text-slate-600 leading-relaxed">{body}</p>
            </div>
          ))}
        </div>

        {/* Demo flow hint */}
        <div className="px-6 pb-4">
          <div className="bg-slate-50 rounded-lg px-4 py-3 flex items-center gap-3 text-[11px] text-slate-500">
            <span className="font-semibold text-slate-600">Demo flow:</span>
            {['Add Tracking', 'Save View', 'Open Journey', 'Add Remark', 'Add Milestone'].map((s, i, arr) => (
              <span key={s} className="flex items-center gap-2">
                <span className="text-slate-700 font-medium">{s}</span>
                {i < arr.length - 1 && <span className="text-slate-300">→</span>}
              </span>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-slate-100 px-6 py-4 flex items-center justify-end">
          <Button variant="primary" size="sm" onClick={handleDismiss}>
            Start using GoTrack
          </Button>
        </div>
      </div>
    </div>
  );
}
