'use client';

import { useState } from 'react';
import { Truck, Ship, Plane, Train, CheckCircle2, GitMerge, Sparkles, AlertCircle } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { useAppStore } from '@/store/appStore';
import { MERGE_CANDIDATES } from '@/data/mockData';
import type { Mode } from '@/types';

const MODE_ICONS: Record<Mode, React.ElementType> = {
  road: Truck, ocean: Ship, air: Plane, rail: Train,
};
const MODE_COLORS: Record<Mode, string> = {
  road: 'text-emerald-600 bg-emerald-50',
  ocean: 'text-blue-600 bg-blue-50',
  air: 'text-violet-600 bg-violet-50',
  rail: 'text-amber-600 bg-amber-50',
};

export function MergeLinkModal() {
  const { setShowMergeLinkModal, getSelectedJourney, mergeJourneyLegs } = useAppStore();
  const journey = getSelectedJourney();
  const [selected, setSelected] = useState<string[]>([]);
  const [merged, setMerged] = useState(false);

  function toggle(id: string) {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }

  function handleMerge() {
    if (!journey || selected.length === 0) return;
    mergeJourneyLegs(journey.id, selected);
    setMerged(true);
  }

  return (
    <Modal
      title="Merge / Link Journey Legs"
      subtitle={`System found potential related legs for ${journey?.id ?? 'this journey'}`}
      onClose={() => setShowMergeLinkModal(false)}
      width="lg"
      footer={
        merged ? (
          <Button variant="primary" onClick={() => setShowMergeLinkModal(false)}>
            Done
          </Button>
        ) : (
          <>
            <Button variant="ghost" onClick={() => setShowMergeLinkModal(false)}>Cancel</Button>
            <Button
              variant="primary"
              onClick={handleMerge}
              disabled={selected.length === 0}
              icon={<GitMerge size={13} />}
            >
              Confirm Merge ({selected.length} selected)
            </Button>
          </>
        )
      }
    >
      {merged ? (
        <div className="flex flex-col items-center py-8 text-center">
          <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle2 size={28} className="text-emerald-600" />
          </div>
          <h3 className="text-base font-semibold text-slate-800 mb-1">Merge Complete</h3>
          <p className="text-sm text-slate-500 max-w-xs">
            {selected.length} leg{selected.length > 1 ? 's' : ''} merged into <span className="font-semibold text-blue-600">{journey?.id}</span>.
            The unified mode chain is now visible on the journey.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Problem statement */}
          <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-xl border border-blue-100">
            <Sparkles size={16} className="text-blue-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-blue-800 mb-1">
                System Suggestion
              </p>
              <p className="text-sm text-blue-700">
                We found <strong>{MERGE_CANDIDATES.length} related legs</strong> that may belong to this shipment journey. Merging them will unify the multimodal tracking into a single end-to-end view — solving fragmented tracking.
              </p>
            </div>
          </div>

          {/* Current journey */}
          <div>
            <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
              Current Journey — {journey?.id}
            </h4>
            <div className="space-y-2">
              {journey?.legs.map((leg, i) => {
                const Icon = MODE_ICONS[leg.mode];
                const colors = MODE_COLORS[leg.mode];
                return (
                  <div key={leg.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <span className={`w-7 h-7 rounded-lg flex items-center justify-center ${colors}`}>
                      <Icon size={14} />
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-medium text-slate-800">Leg {i + 1}: {leg.mode.charAt(0).toUpperCase() + leg.mode.slice(1)}</div>
                      <div className="text-[11px] text-slate-500">{leg.carrier} · {leg.origin} → {leg.destination}</div>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400">{leg.trackingRef}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Candidates */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                Candidate Legs to Merge
              </h4>
              <span className="text-[10px] text-slate-400">Select which to include</span>
            </div>
            <div className="space-y-2">
              {MERGE_CANDIDATES.map((cand) => {
                const Icon = MODE_ICONS[cand.mode];
                const colors = MODE_COLORS[cand.mode];
                const isSelected = selected.includes(cand.id);
                const confidenceColor = cand.confidence >= 85 ? 'text-emerald-600 bg-emerald-50' : 'text-amber-600 bg-amber-50';

                return (
                  <button
                    key={cand.id}
                    onClick={() => toggle(cand.id)}
                    className={`w-full flex items-center gap-3 p-3.5 rounded-xl border-2 transition-all text-left ${
                      isSelected
                        ? 'border-blue-400 bg-blue-50'
                        : 'border-slate-200 bg-white hover:border-blue-200 hover:bg-slate-50'
                    }`}
                  >
                    {/* Checkbox */}
                    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 ${
                      isSelected ? 'border-blue-500 bg-blue-500' : 'border-slate-300'
                    }`}>
                      {isSelected && <CheckCircle2 size={13} className="text-white" />}
                    </div>

                    {/* Mode icon */}
                    <span className={`w-8 h-8 rounded-lg flex items-center justify-center ${colors} flex-shrink-0`}>
                      <Icon size={16} />
                    </span>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-slate-800">
                          {cand.mode.charAt(0).toUpperCase() + cand.mode.slice(1)} · {cand.carrier}
                        </span>
                        <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${confidenceColor}`}>
                          {cand.confidence}% match
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5">
                        {cand.origin} → {cand.destination} · ETA {cand.eta}
                      </div>
                      <div className="text-[10px] font-mono text-slate-400 mt-0.5">{cand.trackingRef}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Warning */}
          <div className="flex items-start gap-2 p-3 bg-amber-50 rounded-lg border border-amber-100 text-xs text-amber-700">
            <AlertCircle size={13} className="flex-shrink-0 mt-0.5" />
            <span>Merging will link these legs under this journey and update the mode chain. This action can be undone from the journey detail page.</span>
          </div>
        </div>
      )}
    </Modal>
  );
}
