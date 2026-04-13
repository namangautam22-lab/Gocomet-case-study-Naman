'use client';

import { X, SlidersHorizontal, ChevronDown } from 'lucide-react';
import { useAppStore } from '@/store/appStore';
import type { Mode, Risk } from '@/types';

interface FilterChipProps {
  label: string;
  options: { label: string; value: string | null }[];
  active: string | null;
  onSelect: (val: string | null) => void;
}

function FilterChip({ label, options, active, onSelect }: FilterChipProps) {
  const activeOption = options.find((o) => o.value === active);

  return (
    <div className="relative group">
      <button
        className={`flex items-center gap-1 text-[11px] font-medium px-2.5 py-1 rounded-full border transition-colors ${
          active !== null
            ? 'bg-blue-600 text-white border-blue-600'
            : 'bg-white text-slate-600 border-slate-200 hover:border-blue-300 hover:text-blue-600'
        }`}
      >
        {active !== null ? (activeOption?.label ?? label) : label}
        {active !== null ? (
          <span
            onClick={(e) => { e.stopPropagation(); onSelect(null); }}
            className="ml-0.5 cursor-pointer hover:opacity-70"
          >
            <X size={9} />
          </span>
        ) : (
          <ChevronDown size={9} />
        )}
      </button>
      {/* Dropdown */}
      <div className="absolute top-full left-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-panel z-30 min-w-[140px] py-1 opacity-0 pointer-events-none group-focus-within:opacity-100 group-focus-within:pointer-events-auto group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity">
        {options.map((o) => (
          <button
            key={String(o.value)}
            onClick={() => onSelect(o.value)}
            className={`w-full text-left px-3 py-1.5 text-xs transition-colors ${
              o.value === active ? 'text-blue-600 font-medium bg-blue-50' : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export function FiltersBar() {
  const { activeFilters, setFilter, clearFilters, getFilteredJourneys } = useAppStore();

  const hasActive = Object.entries(activeFilters).some(
    ([k, v]) => k !== 'search' && v !== null && v !== false && v !== ''
  );

  return (
    <div className="flex items-center gap-1.5 flex-wrap" data-tour="filters">
      <div className="flex items-center gap-1 text-[10px] text-slate-400 flex-shrink-0">
        <SlidersHorizontal size={11} />
        <span className="font-semibold">Filter:</span>
      </div>

      <FilterChip
        label="Mode"
        active={activeFilters.mode}
        onSelect={(v) => setFilter('mode', v as Mode | null)}
        options={[
          { label: 'All Modes', value: null },
          { label: 'Road', value: 'road' },
          { label: 'Ocean', value: 'ocean' },
          { label: 'Air', value: 'air' },
          { label: 'Rail', value: 'rail' },
        ]}
      />

      <FilterChip
        label="Risk"
        active={activeFilters.risk}
        onSelect={(v) => setFilter('risk', v as Risk | null)}
        options={[
          { label: 'All Risk', value: null },
          { label: 'Low', value: 'low' },
          { label: 'Medium', value: 'medium' },
          { label: 'High', value: 'high' },
          { label: 'Critical', value: 'critical' },
        ]}
      />

      <FilterChip
        label="Owner"
        active={activeFilters.owner}
        onSelect={(v) => setFilter('owner', v)}
        options={[
          { label: 'All Owners', value: null },
          { label: 'Priya Sharma', value: 'Priya Sharma' },
          { label: 'Arjun Mehta', value: 'Arjun Mehta' },
          { label: 'Sofia Martinez', value: 'Sofia Martinez' },
          { label: 'Hans Mueller', value: 'Hans Mueller' },
          { label: 'Elena Fischer', value: 'Elena Fischer' },
          { label: 'Ramesh Iyer', value: 'Ramesh Iyer' },
          { label: 'Kavya Reddy', value: 'Kavya Reddy' },
        ]}
      />

      <FilterChip
        label="Delay"
        active={activeFilters.delayThreshold !== null ? String(activeFilters.delayThreshold) : null}
        onSelect={(v) => setFilter('delayThreshold', v !== null ? Number(v) : null)}
        options={[
          { label: 'Any', value: null },
          { label: '≥ 1 day', value: '1' },
          { label: '≥ 3 days', value: '3' },
          { label: '≥ 5 days', value: '5' },
          { label: '≥ 7 days', value: '7' },
        ]}
      />

      {/* Has Remarks */}
      <button
        onClick={() => setFilter('hasRemarks', !activeFilters.hasRemarks)}
        className={`flex items-center gap-1 text-[11px] font-medium px-2.5 py-1 rounded-full border transition-colors ${
          activeFilters.hasRemarks
            ? 'bg-blue-600 text-white border-blue-600'
            : 'bg-white text-slate-600 border-slate-200 hover:border-blue-300 hover:text-blue-600'
        }`}
      >
        Has Remarks
        {activeFilters.hasRemarks && (
          <X size={9} onClick={(e) => { e.stopPropagation(); setFilter('hasRemarks', false); }} />
        )}
      </button>

      {hasActive && (
        <button
          onClick={clearFilters}
          className="text-[11px] text-slate-400 hover:text-slate-600 underline underline-offset-2 transition-colors"
        >
          Clear
        </button>
      )}

      <span className="ml-auto text-[10px] text-slate-400 flex-shrink-0">
        {getFilteredJourneys().length} result{getFilteredJourneys().length !== 1 ? 's' : ''}
      </span>
    </div>
  );
}
