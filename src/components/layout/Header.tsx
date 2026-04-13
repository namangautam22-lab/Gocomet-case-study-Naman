'use client';

import { useState } from 'react';
import { Search, Map, ChevronDown, HelpCircle, StickyNote } from 'lucide-react';
import { useAppStore } from '@/store/appStore';
import { Avatar } from '@/components/ui/Badge';

export function Header() {
  const {
    setFilter, activeFilters,
    setShowWhatsNew, setShowDesignRationale, setShowTour,
    currentView, goToControlTower,
  } = useAppStore();
  const [searchFocused, setSearchFocused] = useState(false);

  return (
    <header className="h-12 bg-white border-b border-slate-200 flex items-center px-5 gap-3 flex-shrink-0 z-40 sticky top-0">
      {/* Logo */}
      <button
        onClick={goToControlTower}
        className="flex items-center gap-2 flex-shrink-0 hover:opacity-80 transition-opacity"
      >
        <div className="w-7 h-7 bg-blue-600 rounded-md flex items-center justify-center">
          <Map size={14} className="text-white" />
        </div>
        <span className="font-bold text-slate-900 text-[15px] tracking-tight leading-none">
          Go<span className="text-blue-600">Track</span>
        </span>
      </button>

      {/* Divider */}
      <div className="h-4 w-px bg-slate-200 hidden md:block mx-1" />

      {/* Breadcrumb */}
      <nav className="hidden md:flex items-center gap-1 text-xs text-slate-500 flex-shrink-0">
        <button
          onClick={goToControlTower}
          className={`transition-colors ${currentView === 'control-tower' ? 'text-slate-700 font-medium' : 'hover:text-slate-700'}`}
        >
          Control Tower
        </button>
        {currentView === 'journey-detail' && (
          <>
            <span className="text-slate-300 mx-0.5">›</span>
            <span className="text-slate-800 font-semibold">Journey Detail</span>
          </>
        )}
      </nav>

      {/* Search — flex-1 center */}
      <div className={`flex-1 max-w-sm relative hidden sm:block ${searchFocused ? 'ring-2 ring-blue-400 ring-offset-1 rounded-lg' : ''}`}>
        <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
        <input
          type="text"
          placeholder="Search journey, customer, reference…"
          value={activeFilters.search}
          onChange={(e) => setFilter('search', e.target.value)}
          onFocus={() => setSearchFocused(true)}
          onBlur={() => setSearchFocused(false)}
          className="w-full h-7 pl-8 pr-3 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder:text-slate-400 focus:outline-none focus:bg-white transition-colors"
        />
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-1 flex-shrink-0 ml-auto">
        <button
          onClick={() => setShowTour(true)}
          title="Feature tour"
          className="hidden sm:flex items-center gap-1 text-[11px] font-medium text-slate-500 px-2.5 py-1 rounded-full border border-slate-200 hover:border-blue-300 hover:text-blue-600 transition-colors"
        >
          Tour
        </button>
        <button
          onClick={() => setShowWhatsNew(true)}
          title="What's New"
          className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors"
        >
          <HelpCircle size={15} />
        </button>
        <button
          onClick={() => setShowDesignRationale(true)}
          title="Design Notes"
          className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors"
        >
          <StickyNote size={15} />
        </button>
        {/* User */}
        <button className="flex items-center gap-1.5 hover:bg-slate-50 rounded-md px-2 py-1 ml-1 transition-colors">
          <Avatar name="Priya Sharma" size="xs" />
          <span className="text-xs text-slate-700 font-medium hidden lg:block">Priya S.</span>
          <ChevronDown size={11} className="text-slate-400 hidden lg:block" />
        </button>
      </div>
    </header>
  );
}
