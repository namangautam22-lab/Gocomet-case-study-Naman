'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { Plus, PanelRightOpen, PanelRightClose, RefreshCw } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { KPICards } from './KPICards';
import { SavedViewsStrip } from './SavedViewsStrip';
import { FiltersBar } from './FiltersBar';
import { JourneyTable } from './JourneyTable';
import { WhatChangedPanel } from './WhatChangedPanel';
import { Button } from '@/components/ui/Button';

export function ControlTower() {
  const [showPanel, setShowPanel] = useState(true);

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Header />

      {/* Main layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left: Main content */}
        <div className="flex-1 flex flex-col overflow-hidden min-w-0">
          {/* Page title row */}
          <div className="flex items-center justify-between px-6 pt-5 pb-3 flex-shrink-0">
            <div>
              <h1 className="text-lg font-bold text-slate-900">Control Tower</h1>
              <p className="text-sm text-slate-500 mt-0.5">Shipment Journey Overview · {format(new Date(), 'MMM d, yyyy')}</p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                icon={<RefreshCw size={13} />}
                className="text-slate-500"
              >
                Refresh
              </Button>
              <Button
                variant="primary"
                size="sm"
                icon={<Plus size={14} />}
              >
                Add Tracking
              </Button>
              <Button
                variant="ghost"
                size="sm"
                icon={showPanel ? <PanelRightClose size={14} /> : <PanelRightOpen size={14} />}
                onClick={() => setShowPanel((p) => !p)}
                className="text-slate-500"
                title={showPanel ? 'Hide panel' : 'Show What Changed'}
              />
            </div>
          </div>

          {/* KPI Cards */}
          <div className="px-6 pb-4 flex-shrink-0">
            <KPICards />
          </div>

          {/* Saved Views strip */}
          <div className="px-6 pb-3 flex-shrink-0 border-b border-slate-100">
            <SavedViewsStrip />
          </div>

          {/* Filters bar */}
          <div className="px-6 py-3 flex-shrink-0 border-b border-slate-100">
            <FiltersBar />
          </div>

          {/* Journey Table — scrollable */}
          <div className="flex-1 overflow-auto px-6 py-2">
            <div className="bg-white rounded-xl border border-slate-200 shadow-card overflow-hidden">
              <JourneyTable />
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-2 flex items-center justify-between flex-shrink-0 border-t border-slate-100">
            <span className="text-xs text-slate-400">Showing live-simulated demo data · Last refresh: just now</span>
            <span className="text-xs text-slate-400">GoTrack v2.0 Beta · Journey-Centric Mode</span>
          </div>
        </div>

        {/* Right: What Changed panel */}
        {showPanel && (
          <aside className="w-72 border-l border-slate-200 bg-white flex-shrink-0 flex flex-col overflow-hidden">
            <WhatChangedPanel onClose={() => setShowPanel(false)} />
          </aside>
        )}
      </div>
    </div>
  );
}
