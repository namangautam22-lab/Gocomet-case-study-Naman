'use client';

import { useAppStore } from '@/store/appStore';
import { Header } from '@/components/layout/Header';
import { JourneyHeader } from './JourneyHeader';
import { JourneyRail } from './JourneyRail';
import { MilestonesTimeline } from './MilestonesTimeline';
import { ExceptionsPanel } from './ExceptionsPanel';
import { RemarksPanel } from './RemarksPanel';

export function JourneyDetail() {
  const journey = useAppStore((s) => s.getSelectedJourney());

  if (!journey) {
    return (
      <div className="flex flex-col h-screen">
        <Header />
        <div className="flex-1 flex items-center justify-center text-slate-400">
          Journey not found.
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Header />
      {/* Journey-level header */}
      <JourneyHeader journey={journey} />

      {/* Main scrollable body */}
      <div className="flex-1 overflow-y-auto bg-slate-50">
        <div className="max-w-[1400px] mx-auto px-6 py-5 space-y-4">
          {/* Journey Rail — full width */}
          <JourneyRail journey={journey} />

          {/* 2-column layout: Milestones | Exceptions + Remarks */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
            {/* Left: Milestones timeline (wider) */}
            <div className="lg:col-span-2">
              <MilestonesTimeline journey={journey} />
            </div>

            {/* Right: Exceptions + Remarks */}
            <div className="lg:col-span-3 space-y-4">
              <ExceptionsPanel journey={journey} />
              <RemarksPanel journey={journey} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
