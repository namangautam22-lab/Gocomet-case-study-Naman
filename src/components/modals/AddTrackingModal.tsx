'use client';

import { useState } from 'react';
import { format, addDays } from 'date-fns';
import { Search, CheckCircle2, Loader2, ExternalLink, Ship, Plane, Truck, Train } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { useAppStore } from '@/store/appStore';
import type { Journey, Mode } from '@/types';

const CARRIERS = [
  'Maersk Line', 'MSC', 'CMA CGM', 'Hapag-Lloyd', 'COSCO Shipping',
  'Evergreen Line', 'ONE (Ocean Network)', 'Yang Ming', 'Air India Cargo',
  'DHL Express', 'FedEx International', 'UPS Supply Chain', 'Blue Dart Express',
];

const CARRIER_CODES: Record<string, string> = {
  'Maersk Line': 'MAEU', 'MSC': 'MSCU', 'CMA CGM': 'CMDU',
  'Hapag-Lloyd': 'HLCU', 'COSCO Shipping': 'COSU', 'Evergreen Line': 'EGLV',
  'ONE (Ocean Network)': 'ONEY', 'Yang Ming': 'YMLU',
  'Air India Cargo': 'AIC', 'DHL Express': 'DHLE',
  'FedEx International': 'FDXE', 'UPS Supply Chain': 'UPSS',
  'Blue Dart Express': 'BDEX',
};

const MODE_ETA_DAYS: Record<Mode, number> = {
  ocean: 18, air: 3, road: 5, rail: 10,
};

const MODE_MILESTONE: Record<Mode, string> = {
  ocean: 'In Transit — High Seas', air: 'In Flight', road: 'In Transit', rail: 'Rail Transit',
};

const MODE_ICONS: Record<Mode, React.ElementType> = {
  ocean: Ship, air: Plane, road: Truck, rail: Train,
};

type Step = 'form' | 'searching' | 'found' | 'adding' | 'added';

function buildJourney(
  trackingRef: string,
  carrier: string,
  mode: Mode,
  reference: string,
  journeyCount: number,
): Journey {
  const now = new Date().toISOString();
  const etaDays = MODE_ETA_DAYS[mode];
  const eta = format(addDays(new Date(), etaDays), 'yyyy-MM-dd');
  const newId = `GTJ-${String(journeyCount + 1).padStart(3, '0')}`;
  const shipmentRef = reference.trim() || `TRK-${trackingRef.trim().slice(-6).toUpperCase()}`;
  const carrierCode = CARRIER_CODES[carrier] ?? carrier.slice(0, 4).toUpperCase();

  return {
    id: newId,
    shipmentRef,
    customer: 'New Shipment',
    customerCode: 'NEW',
    origin: 'Origin (Tracking in Progress)',
    destination: 'Destination (Tracking in Progress)',
    modeChain: [mode],
    activeLeg: 0,
    currentMilestone: MODE_MILESTONE[mode],
    overallETA: eta,
    originalETA: eta,
    delayDays: 0,
    risk: 'low',
    status: 'on-track',
    owner: 'Priya Sharma',
    updatedAt: now,
    createdAt: now,
    incoterm: 'FOB',
    commodity: 'General Cargo',
    weight: '—',
    legs: [{
      id: `${newId}-LEG-1`,
      mode,
      carrier,
      carrierCode,
      origin: 'Origin Port (TBD)',
      destination: 'Destination Port (TBD)',
      status: 'in-transit',
      eta,
      delayDays: 0,
      currentMilestone: MODE_MILESTONE[mode],
      trackingRef: trackingRef.trim(),
    }],
    milestones: [{
      id: `${newId}-MS-1`,
      journeyId: newId,
      name: 'Tracking Initiated',
      type: 'system',
      status: 'completed',
      date: format(new Date(), 'yyyy-MM-dd'),
      completedAt: now,
    }],
    remarks: [],
    exceptions: [],
  };
}

export function AddTrackingModal() {
  const { setShowAddTrackingModal, addJourney, selectJourney, journeys } = useAppStore();

  const [trackingRef, setTrackingRef] = useState('');
  const [carrier, setCarrier] = useState('Maersk Line');
  const [mode, setMode] = useState<Mode>('ocean');
  const [reference, setReference] = useState('');
  const [step, setStep] = useState<Step>('form');
  const [newJourneyId, setNewJourneyId] = useState('');

  const canSubmit = trackingRef.trim().length >= 3;

  function handleTrack() {
    if (!canSubmit) return;
    setStep('searching');
    setTimeout(() => setStep('found'), 800);
  }

  function handleCreateUnified() {
    if (!canSubmit) return;
    setStep('adding');
    setTimeout(() => {
      const journey = buildJourney(trackingRef, carrier, mode, reference, journeys.length);
      addJourney(journey);
      setNewJourneyId(journey.id);
      setStep('added');
    }, 600);
  }

  function handleAddToGotrack() {
    setStep('adding');
    setTimeout(() => {
      const journey = buildJourney(trackingRef, carrier, mode, reference, journeys.length);
      addJourney(journey);
      setNewJourneyId(journey.id);
      setStep('added');
    }, 500);
  }

  function handleViewJourney() {
    setShowAddTrackingModal(false);
    selectJourney(newJourneyId);
  }

  const etaDays = MODE_ETA_DAYS[mode];
  const simulatedETA = format(addDays(new Date(), etaDays), 'dd MMM yyyy');
  const ModeIcon = MODE_ICONS[mode];

  // ── Added state ──────────────────────────────────────────────────────────
  if (step === 'added') {
    return (
      <Modal title="Tracking Added" onClose={() => setShowAddTrackingModal(false)} width="sm">
        <div className="flex flex-col items-center text-center py-6 gap-4">
          <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center">
            <CheckCircle2 size={26} className="text-emerald-600" />
          </div>
          <div>
            <p className="text-base font-bold text-slate-800">Journey {newJourneyId} added</p>
            <p className="text-sm text-slate-500 mt-1">
              Tracking <span className="font-mono font-semibold text-slate-700">{trackingRef.trim()}</span> is now visible in your Control Tower.
            </p>
          </div>
          <div className="flex gap-2 mt-2">
            <Button variant="ghost" onClick={() => setShowAddTrackingModal(false)}>Close</Button>
            <Button variant="primary" icon={<ExternalLink size={13} />} onClick={handleViewJourney}>
              View Journey
            </Button>
          </div>
        </div>
      </Modal>
    );
  }

  // ── Searching / Adding spinner ────────────────────────────────────────────
  if (step === 'searching' || step === 'adding') {
    return (
      <Modal title="Track a Shipment" onClose={() => setShowAddTrackingModal(false)} width="sm">
        <div className="flex flex-col items-center text-center py-10 gap-3 text-slate-500">
          <Loader2 size={28} className="animate-spin text-blue-500" />
          <p className="text-sm font-medium">
            {step === 'searching' ? 'Searching carrier systems…' : 'Creating journey entry…'}
          </p>
        </div>
      </Modal>
    );
  }

  // ── Found state ───────────────────────────────────────────────────────────
  if (step === 'found') {
    return (
      <Modal
        title="Track a Shipment"
        subtitle="Tracking data retrieved from carrier"
        onClose={() => setShowAddTrackingModal(false)}
        width="sm"
        footer={
          <>
            <Button variant="ghost" onClick={() => setStep('form')}>Search Again</Button>
            <Button variant="primary" icon={<CheckCircle2 size={13} />} onClick={handleAddToGotrack}>
              Add to GoTrack
            </Button>
          </>
        }
      >
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-emerald-700 bg-emerald-50 border border-emerald-200 px-3.5 py-2.5 rounded-lg text-xs font-semibold">
            <CheckCircle2 size={14} />
            Shipment located in {carrier} systems
          </div>

          <div className="rounded-xl border border-slate-200 overflow-hidden divide-y divide-slate-100">
            {[
              ['Tracking Ref', trackingRef.trim()],
              ['Carrier', carrier],
              ['Mode', mode.charAt(0).toUpperCase() + mode.slice(1)],
              ['Status', 'In Transit'],
              ['ETA', simulatedETA],
              ['Current Milestone', MODE_MILESTONE[mode]],
            ].map(([label, value]) => (
              <div key={label} className="flex items-center justify-between px-4 py-2.5">
                <span className="text-[11px] text-slate-500">{label}</span>
                <span className="text-[12px] font-semibold text-slate-800">{value}</span>
              </div>
            ))}
          </div>

          <p className="text-[11px] text-slate-400 text-center">
            Adding this will create a new journey entry in your Control Tower.
          </p>
        </div>
      </Modal>
    );
  }

  // ── Form state ────────────────────────────────────────────────────────────
  return (
    <Modal
      title="Track a Shipment"
      subtitle="Enter a tracking number, BL, or container reference"
      onClose={() => setShowAddTrackingModal(false)}
      width="sm"
      footer={
        <>
          <Button variant="ghost" onClick={() => setShowAddTrackingModal(false)}>Cancel</Button>
          <Button variant="outline" disabled={!canSubmit} onClick={handleCreateUnified}>
            Create Unified Journey
          </Button>
          <Button variant="primary" icon={<Search size={13} />} disabled={!canSubmit} onClick={handleTrack}>
            Track Shipment
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        {/* Tracking ref */}
        <div>
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 block">
            Tracking / BL / Container No. *
          </label>
          <input
            autoFocus
            type="text"
            value={trackingRef}
            onChange={(e) => setTrackingRef(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && canSubmit && handleTrack()}
            placeholder="e.g. MAEU-24881009, HLCU-LGB123456, MSKU9182374"
            className="w-full text-sm border border-slate-200 rounded-lg px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Carrier */}
        <div>
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 block">
            Carrier
          </label>
          <select
            value={carrier}
            onChange={(e) => setCarrier(e.target.value)}
            className="w-full text-sm border border-slate-200 rounded-lg px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
          >
            {CARRIERS.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        {/* Mode */}
        <div>
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 block">
            Transport Mode
          </label>
          <div className="grid grid-cols-4 gap-2">
            {(['ocean', 'air', 'road', 'rail'] as Mode[]).map((m) => {
              const Icon = MODE_ICONS[m];
              const active = mode === m;
              return (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className={`flex flex-col items-center gap-1.5 py-3 rounded-lg border-2 transition-all text-xs font-semibold ${
                    active ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-slate-200 text-slate-500 hover:border-slate-300'
                  }`}
                >
                  <Icon size={16} className={active ? 'text-blue-600' : 'text-slate-400'} />
                  {m.charAt(0).toUpperCase() + m.slice(1)}
                </button>
              );
            })}
          </div>
        </div>

        {/* Reference */}
        <div>
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 block">
            Your Reference <span className="font-normal normal-case text-slate-400">(optional)</span>
          </label>
          <input
            type="text"
            value={reference}
            onChange={(e) => setReference(e.target.value)}
            placeholder="e.g. SHP-2026-9999, PO-88421"
            className="w-full text-sm border border-slate-200 rounded-lg px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
      </div>
    </Modal>
  );
}
