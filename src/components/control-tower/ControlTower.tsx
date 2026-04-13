'use client';

import { useState } from 'react';
import { Plus, PanelRightOpen, PanelRightClose, RefreshCw } from 'lucide-react';
import { useAppStore } from '@/store/appStore';
import { Header } from '@/components/layout/Header';
import { KPICards } from './KPICards';
import { SavedViewsStrip } from './SavedViewsStrip';
import { FiltersBar } from './FiltersBar';
import { JourneyTable } from './JourneyTable';
import { WhatChangedPanel } from './WhatChangedPanel';
import { Button } from '@/components/ui/Button';

export function ControlTower() {
  const { setShowAddTrackingModal, journeys } = useAppStore();
  const [showPanel, setShowPanel] = useState(false);

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Header />

      {/* Main layout */}
      <div className="flex flex-1 overflow-hidden">

        {/* Left: Main content */}
        <div className="flex-1 flex flex-col overflow-hidden min-w-0">

          {/* Page header */}
          <div className="flex items-center justify-between px-6 pt-4 pb-3 flex-shrink-0 border-b border-slate-100 bg-white">
            <div>
              <h1 className="text-sm font-bold text-slate-900">Shipment Journeys</h1>
              <p className="text-[11px] text-slate-400 mt-0.5">
                {journeys.length} journeys tracked · Apr 2026
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                icon={<RefreshCw size={12} />}
                className="text-slate-500 text-xs"
              >
                Refresh
              </Button>
              <Button
                variant="primary"
                size="sm"
                icon={<Plus size={13} />}
                onClick={() => setShowAddTrackingModal(true)}
              >
                Add Tracking
              </Button>
              <button
                onClick={() => setShowPanel((p) => !p)}
                className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-md transition-colors"
                title={showPanel ? 'Hide activity' : 'Show activity'}
              >
                {showPanel ? <PanelRightClose size={14} /> : <PanelRightOpen size={14} />}
              </button>
            </div>
          </div>

          {/* KPI strip */}
          <div className="px-6 pt-3 pb-2 flex-shrink-0 bg-white border-b border-slate-100">
            <KPICards />
          </div>

          {/* Views + filters */}
          <div className="px-6 pt-3 pb-2 flex-shrink-0 bg-white border-b border-slate-100 space-y-2.5">
            <SavedViewsStrip />
            <FiltersBar />
          </div>

          {/* Journey Table — scrollable hero */}
          <div className="flex-1 overflow-auto">
            <JourneyTable />
          </div>
        </div>

        {/* Right: What Changed panel */}
        {showPanel && (
          <aside className="w-64 border-l border-slate-200 bg-white flex-shrink-0 flex flex-col overflow-hidden">
            <WhatChangedPanel onClose={() => setShowPanel(false)} />
          </aside>
        )}
      </div>
    </div>
  );
}
