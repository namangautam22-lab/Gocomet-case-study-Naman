'use client';

import { Link2, Bookmark, MessageSquarePlus, ArrowRight, X } from 'lucide-react';
import { useAppStore } from '@/store/appStore';
import { Button } from '@/components/ui/Button';

const STEPS = [
  {
    step: 1,
    icon: Link2,
    color: 'text-blue-600',
    bg: 'bg-blue-100',
    title: 'Unified Journey View',
    description:
      'Every shipment leg — Road pickup, Ocean transit, Air freight — lives in a single row. Click any journey to see the full multi-modal chain, live milestones, and exceptions in one place.',
    highlight: 'Look for the mode chain icons (🚚 → 🚢 → ✈️) in the table.',
    cta: 'See it in the table →',
  },
  {
    step: 2,
    icon: Bookmark,
    color: 'text-emerald-600',
    bg: 'bg-emerald-100',
    title: 'Saved Views',
    description:
      'Set any combination of filters — by mode, risk level, owner, or delay threshold — and save it as a named view. Views persist between sessions so your team always lands in the right context.',
    highlight: 'Try: filter by Risk = High → click "Save view" to pin it.',
    cta: 'Saved views strip is above the table →',
  },
  {
    step: 3,
    icon: MessageSquarePlus,
    color: 'text-violet-600',
    bg: 'bg-violet-100',
    title: 'Remarks & Milestones',
    description:
      'Add business context your carriers don\'t track. Log delay reasons, customer communications, and blockers as remarks. Create custom milestones — like "Customer Notified" or "Customs Cleared" — directly on the journey.',
    highlight: 'Open any journey → use "Add Remark" or "Add Milestone" buttons.',
    cta: 'Try it on any journey row →',
  },
];

export function SimpleTour() {
  const { showTour, tourStep, setShowTour, setTourStep } = useAppStore();

  if (!showTour) return null;

  const current = STEPS[tourStep];
  const isLast = tourStep === STEPS.length - 1;
  const Icon = current.icon;

  function handleNext() {
    if (isLast) {
      setShowTour(false);
    } else {
      setTourStep(tourStep + 1);
    }
  }

  function handlePrev() {
    if (tourStep > 0) setTourStep(tourStep - 1);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 fade-in">
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-[2px]" onClick={() => setShowTour(false)} />

      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-modal overflow-hidden">
        {/* Progress bar */}
        <div className="h-1 bg-slate-100">
          <div
            className="h-full bg-blue-500 transition-all duration-300"
            style={{ width: `${((tourStep + 1) / STEPS.length) * 100}%` }}
          />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-4 pb-0">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            Feature tour · {tourStep + 1} of {STEPS.length}
          </span>
          <button
            onClick={() => setShowTour(false)}
            className="text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Content */}
        <div className="px-5 py-5 space-y-4">
          {/* Icon + title */}
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl ${current.bg} flex items-center justify-center flex-shrink-0`}>
              <Icon size={20} className={current.color} />
            </div>
            <h2 className="text-base font-bold text-slate-800">{current.title}</h2>
          </div>

          {/* Description */}
          <p className="text-sm text-slate-600 leading-relaxed">{current.description}</p>

          {/* Highlight tip */}
          <div className="flex items-start gap-2 bg-slate-50 rounded-lg px-3.5 py-3 border border-slate-100">
            <ArrowRight size={13} className="text-blue-500 flex-shrink-0 mt-0.5" />
            <p className="text-[12px] text-slate-600 font-medium leading-snug">{current.highlight}</p>
          </div>
        </div>

        {/* Step dots */}
        <div className="flex justify-center gap-1.5 pb-1">
          {STEPS.map((_, i) => (
            <button
              key={i}
              onClick={() => setTourStep(i)}
              className={`w-1.5 h-1.5 rounded-full transition-colors ${
                i === tourStep ? 'bg-blue-500' : 'bg-slate-200 hover:bg-slate-300'
              }`}
            />
          ))}
        </div>

        {/* Footer */}
        <div className="border-t border-slate-100 px-5 py-3.5 flex items-center justify-between">
          <button
            onClick={handlePrev}
            disabled={tourStep === 0}
            className="text-xs text-slate-400 hover:text-slate-600 disabled:opacity-30 transition-colors"
          >
            ← Back
          </button>
          <Button variant="primary" size="sm" onClick={handleNext}>
            {isLast ? 'Done' : 'Next →'}
          </Button>
        </div>
      </div>
    </div>
  );
}
