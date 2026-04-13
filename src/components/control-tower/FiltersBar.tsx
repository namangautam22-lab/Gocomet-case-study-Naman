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
  const isActive = active !== null;

  return (
    <div className="relative group">
      <button
        className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full border transition-colors ${
          isActive
            ? 'bg-blue-600 text-white border-blue-600'
            : 'bg-white text-slate-600 border-slate-200 hover:border-blue-300 hover:text-blue-600'
        }`}
      >
        {isActive ? activeOption?.label ?? label : label}
        {isActive ? (
          <span
            onClick={(e) => {
              e.stopPropagation();
              onSelect(null);
            }}
            className="ml-0.5 cursor-pointer hover:opacity-70"
          >
            <X size={10} />
          </span>
        ) : (
          <ChevronDown size={10} />
        )}
      </button>
      {/* Dropdown */}
      <div className="absolute top-full left-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-panel z-30 min-w-[140px] py-1 opacity-0 pointer-events-none group-focus-within:opacity-100 group-focus-within:pointer-events-auto group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity">
        {options.map((o) => (
          <button
            key={String(o.value)}
            onClick={() => onSelect(o.value)}
            className={`w-full text-left px-3 py-1.5 text-xs transition-colors ${
              o.value === active
                ? 'text-blue-600 font-medium bg-blue-50'
                : 'text-slate-700 hover:bg-slate-50'
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

  const hasActiveFilters =
    Object.entries(activeFilters).some(([k, v]) => k !== 'search' && v !== null && v !== false && v !== '');

  const filtered = getFilteredJourneys();

  return (
    <div className="flex items-center gap-2 flex-wrap" data-tour="filters">
      <div className="flex items-center gap-1 text-xs text-slate-400 flex-shrink-0">
        <SlidersHorizontal size={12} />
        <span className="font-medium">Filter:</span>
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
          { label: 'All Risk Levels', value: null },
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
          { label: 'Fatima Al-Rashid', value: 'Fatima Al-Rashid' },
          { label: 'Ramesh Iyer', value: 'Ramesh Iyer' },
          { label: 'Kavya Reddy', value: 'Kavya Reddy' },
        ]}
      />

      <FilterChip
        label="Delay"
        active={activeFilters.delayThreshold !== null ? String(activeFilters.delayThreshold) : null}
        onSelect={(v) => setFilter('delayThreshold', v !== null ? Number(v) : null)}
        options={[
          { label: 'Any Delay', value: null },
          { label: '≥ 1 day', value: '1' },
          { label: '≥ 3 days', value: '3' },
          { label: '≥ 5 days', value: '5' },
          { label: '≥ 7 days', value: '7' },
        ]}
      />

      <FilterChip
        label="Destination"
        active={activeFilters.destination}
        onSelect={(v) => setFilter('destination', v)}
        options={[
          { label: 'All Destinations', value: null },
          { label: 'Germany (DE)', value: 'DE' },
          { label: 'United States (US)', value: 'US' },
          { label: 'United Kingdom (UK)', value: 'UK' },
          { label: 'Netherlands (NL)', value: 'NL' },
          { label: 'India (IN)', value: 'IN' },
        ]}
      />

      {/* Has Remarks toggle */}
      <button
        onClick={() => setFilter('hasRemarks', !activeFilters.hasRemarks)}
        className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full border transition-colors ${
          activeFilters.hasRemarks
            ? 'bg-blue-600 text-white border-blue-600'
            : 'bg-white text-slate-600 border-slate-200 hover:border-blue-300 hover:text-blue-600'
        }`}
      >
        Has Remarks
        {activeFilters.hasRemarks && <X size={10} onClick={(e) => { e.stopPropagation(); setFilter('hasRemarks', false); }} />}
      </button>

      {/* Clear all */}
      {hasActiveFilters && (
        <button
          onClick={clearFilters}
          className="text-xs text-slate-400 hover:text-slate-600 underline underline-offset-2 transition-colors"
        >
          Clear all
        </button>
      )}

      {/* Results count */}
      <span className="ml-auto text-xs text-slate-400 flex-shrink-0">
        {filtered.length} journey{filtered.length !== 1 ? 's' : ''}
      </span>
    </div>
  );
}
