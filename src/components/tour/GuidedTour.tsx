'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { ChevronRight, ChevronLeft, X, CheckCircle2, Map, Compass } from 'lucide-react';
import { useAppStore } from '@/store/appStore';
import { Button } from '@/components/ui/Button';

interface TourStep {
  id: string;
  title: string;
  body: string;
  target?: string; // data-tour attribute value
  position?: 'top' | 'bottom' | 'left' | 'right';
  action?: () => void; // optional: navigate before showing step
  problem?: string; // which design problem this solves
}

const TOUR_STEPS: TourStep[] = [
  {
    id: 'welcome',
    title: 'GoTrack 2.0 — Control Tower',
    body: 'GoTrack is now a journey-centric control tower. Every shipment is one unified Journey record spanning all legs and modes — no more fragmented entries. This tour covers the three design problems it solves.',
    position: 'bottom',
  },
  {
    id: 'journey-rows',
    title: 'One row = one end-to-end journey',
    body: 'Each row is a full Shipment Journey — road pickup, ocean freight, final delivery — all in one record. Risk, delay, owner, and last remark visible at a glance without opening anything.',
    target: 'journey-table',
    position: 'bottom',
    problem: 'Problem 1: Unified multimodal record replaces fragmented entries',
  },
  {
    id: 'mode-chain',
    title: 'Mode Chain — full sequence at a glance',
    body: 'Icons show every transport mode in order. The active leg is highlighted with a ring. Completed legs are dimmed. No need to open the detail to know where the shipment is.',
    target: 'mode-chain',
    position: 'right',
    problem: 'Problem 1: Active leg always surfaced in the list view',
  },
  {
    id: 'saved-views',
    title: 'Saved Views — one-click operational filters',
    body: 'Pre-built views like "My Delays" and "ETA This Week" are pinned here. Views survive session reloads — filters, column order, and sort are all persisted.',
    target: 'saved-views',
    position: 'bottom',
    problem: 'Problem 2: Filter sets no longer lost between sessions',
  },
  {
    id: 'save-view',
    title: 'Save any filter combination as a View',
    body: 'Apply filters, then save as a named view. Set scope (Private / Team / Org), configure alert triggers, pin to the strip, or make it your default. Shareable with teammates.',
    target: 'save-view-btn',
    position: 'bottom',
    problem: 'Problem 2: Persistent, shareable operational views',
  },
  {
    id: 'what-changed',
    title: 'What Changed — activity across all journeys',
    body: 'Live feed of ETA changes, remarks added, exceptions raised, and milestones hit — across every journey you manage. Click any item to jump straight to that journey.',
    target: 'what-changed',
    position: 'left',
  },
  {
    id: 'journey-rail',
    title: 'Journey Rail — visual end-to-end map',
    body: 'The rail shows all legs in sequence: carrier, tracking ref, current milestone, and ETA. Active leg pulses; completed legs are muted. Delays surfaced inline with +Nd callouts.',
    target: 'journey-rail',
    position: 'bottom',
    problem: 'Problem 1: Full multimodal view in one screen',
  },
  {
    id: 'milestones',
    title: 'System (blue) vs Manual (purple) milestones',
    body: 'Blue dots are carrier-tracked events. Purple dots are milestones your team added — "Insurance cert received", "Customer sign-off" — with owner, category, and due date. Both live in the same timeline.',
    target: 'milestones',
    position: 'right',
    problem: 'Problem 3: Custom milestones alongside carrier data',
  },
  {
    id: 'add-remark',
    title: 'Add Remark — structured business context',
    body: 'Log delay reasons, customer comms, blockers, and handoffs — with note type, priority, visibility (internal/external), and assignee. A Blocker remark immediately escalates journey risk to Critical.',
    target: 'add-remark-btn',
    position: 'left',
    problem: 'Problem 3: Collaborative, typed annotation on any journey',
  },
  {
    id: 'add-milestone',
    title: 'Add Milestone — team-defined checkpoints',
    body: 'Create milestones your carriers don\'t track. Choose a category, assign an owner, set a status and expected date. Appears in purple on the shared timeline immediately.',
    target: 'add-milestone-btn',
    position: 'left',
    problem: 'Problem 3: Custom milestones for business process tracking',
  },
  {
    id: 'done',
    title: 'That\'s GoTrack 2.0',
    body: 'One record per shipment. Persistent views. Team annotations. All three problems addressed in a single redesign. Open "Design Notes" in the header to see the full rationale.',
    position: 'bottom',
  },
];

interface TooltipRect {
  top: number;
  left: number;
  width: number;
  height: number;
}

export function GuidedTour() {
  const { tourStep, setTourStep, setShowTour, selectJourney, currentView } = useAppStore();
  const step = TOUR_STEPS[tourStep];
  const isFirst = tourStep === 0;
  const isLast = tourStep === TOUR_STEPS.length - 1;

  const [targetRect, setTargetRect] = useState<TooltipRect | null>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const findTarget = useCallback(() => {
    if (!step.target) {
      setTargetRect(null);
      return;
    }
    const el = document.querySelector(`[data-tour="${step.target}"]`);
    if (el) {
      const rect = el.getBoundingClientRect();
      setTargetRect({ top: rect.top, left: rect.left, width: rect.width, height: rect.height });
    } else {
      setTargetRect(null);
    }
  }, [step.target]);

  useEffect(() => {
    findTarget();
    window.addEventListener('resize', findTarget);
    return () => window.removeEventListener('resize', findTarget);
  }, [findTarget, tourStep]);

  // Navigate to journey detail for steps that need it
  useEffect(() => {
    const needsDetail = ['journey-rail', 'milestones', 'add-remark', 'add-milestone'];
    if (needsDetail.includes(step.id) && currentView !== 'journey-detail') {
      selectJourney('GTJ-001');
      setTimeout(findTarget, 300);
    }
  }, [step.id, currentView, selectJourney, findTarget]);

  function next() {
    if (isLast) { setShowTour(false); return; }
    setTourStep(tourStep + 1);
  }
  function prev() {
    if (!isFirst) setTourStep(tourStep - 1);
  }

  // Tooltip positioning
  function getTooltipStyle(): React.CSSProperties {
    if (!targetRect) {
      return { position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' };
    }

    const pad = 16;
    const tooltipW = 380;
    const tooltipH = 220;
    const pos = step.position ?? 'bottom';

    let top = 0, left = 0;

    if (pos === 'bottom') {
      top = targetRect.top + targetRect.height + pad;
      left = Math.min(
        Math.max(targetRect.left + targetRect.width / 2 - tooltipW / 2, pad),
        window.innerWidth - tooltipW - pad
      );
    } else if (pos === 'top') {
      top = targetRect.top - tooltipH - pad;
      left = Math.min(
        Math.max(targetRect.left + targetRect.width / 2 - tooltipW / 2, pad),
        window.innerWidth - tooltipW - pad
      );
    } else if (pos === 'right') {
      top = Math.max(targetRect.top, pad);
      left = targetRect.left + targetRect.width + pad;
    } else if (pos === 'left') {
      top = Math.max(targetRect.top, pad);
      left = targetRect.left - tooltipW - pad;
    }

    return { position: 'fixed', top: Math.max(pad, top), left: Math.max(pad, left), width: tooltipW };
  }

  return (
    <div className="fixed inset-0 z-[100]" onClick={(e) => e.target === e.currentTarget && undefined}>
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-[1px]" />

      {/* Highlight box around target */}
      {targetRect && (
        <div
          className="absolute rounded-lg pointer-events-none"
          style={{
            top: targetRect.top - 4,
            left: targetRect.left - 4,
            width: targetRect.width + 8,
            height: targetRect.height + 8,
            boxShadow: '0 0 0 2px #2563eb, 0 0 0 6px rgba(37, 99, 235, 0.2)',
            background: 'transparent',
            zIndex: 101,
          }}
        />
      )}

      {/* Tooltip */}
      <div
        ref={tooltipRef}
        className="absolute z-[102] bg-white rounded-2xl shadow-modal overflow-hidden fade-in"
        style={getTooltipStyle()}
      >
        {/* Header bar */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-5 py-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-white/20 rounded-lg flex items-center justify-center">
                {isLast ? <CheckCircle2 size={13} className="text-white" /> : <Compass size={13} className="text-white" />}
              </div>
              <span className="text-[11px] font-semibold text-blue-100 uppercase tracking-wide">
                Step {tourStep + 1} of {TOUR_STEPS.length}
              </span>
            </div>
            <button
              onClick={() => setShowTour(false)}
              className="text-blue-200 hover:text-white transition-colors"
            >
              <X size={15} />
            </button>
          </div>
          <h3 className="text-base font-bold text-white leading-snug">{step.title}</h3>
        </div>

        {/* Body */}
        <div className="px-5 py-4">
          <p className="text-sm text-slate-600 leading-relaxed">{step.body}</p>

          {step.problem && (
            <div className="mt-3 flex items-center gap-2 text-xs text-emerald-700 bg-emerald-50 px-3 py-2 rounded-lg border border-emerald-100">
              <CheckCircle2 size={11} className="flex-shrink-0" />
              {step.problem}
            </div>
          )}
        </div>

        {/* Footer: stepper dots + nav */}
        <div className="px-5 pb-4 flex items-center gap-3">
          {/* Dots */}
          <div className="flex items-center gap-1 flex-1">
            {TOUR_STEPS.map((_, i) => (
              <button
                key={i}
                onClick={() => setTourStep(i)}
                className={`rounded-full transition-all ${
                  i === tourStep ? 'w-4 h-1.5 bg-blue-600' : 'w-1.5 h-1.5 bg-slate-200 hover:bg-slate-300'
                }`}
              />
            ))}
          </div>

          {/* Nav buttons */}
          <div className="flex items-center gap-2">
            {!isFirst && (
              <Button variant="ghost" size="xs" icon={<ChevronLeft size={12} />} onClick={prev}>
                Back
              </Button>
            )}
            <Button
              variant="primary"
              size="xs"
              iconRight={isLast ? <CheckCircle2 size={12} /> : <ChevronRight size={12} />}
              onClick={next}
            >
              {isLast ? 'Finish Tour' : 'Next'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
