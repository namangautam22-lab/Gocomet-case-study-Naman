'use client';

import { useState } from 'react';
import { Search, Bell, Map, ChevronDown, HelpCircle, StickyNote } from 'lucide-react';
import { useAppStore } from '@/store/appStore';
import { Button } from '@/components/ui/Button';
import { Avatar } from '@/components/ui/Badge';

export function Header() {
  const { setFilter, activeFilters, setShowTour, setShowDesignRationale, currentView, goToControlTower } = useAppStore();
  const [searchFocused, setSearchFocused] = useState(false);

  return (
    <header className="h-14 bg-white border-b border-slate-200 flex items-center px-5 gap-4 flex-shrink-0 z-40 sticky top-0" data-tour="header">
      {/* Logo */}
      <button
        onClick={goToControlTower}
        className="flex items-center gap-2 flex-shrink-0 hover:opacity-80 transition-opacity"
      >
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
          <Map size={16} className="text-white" />
        </div>
        <span className="font-bold text-slate-900 text-base tracking-tight">
          Go<span className="text-blue-600">Track</span>
        </span>
        <span className="hidden sm:inline-block text-[10px] font-medium text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-100">
          BETA
        </span>
      </button>

      {/* Divider */}
      <div className="h-5 w-px bg-slate-200 hidden md:block" />

      {/* Nav breadcrumb */}
      <nav className="hidden md:flex items-center gap-1 text-sm text-slate-500 flex-shrink-0">
        <button onClick={goToControlTower} className="hover:text-slate-800 transition-colors">
          Control Tower
        </button>
        {currentView === 'journey-detail' && (
          <>
            <span className="text-slate-300">›</span>
            <span className="text-slate-800 font-medium">Journey Detail</span>
          </>
        )}
      </nav>

      {/* Search */}
      <div className={`flex-1 max-w-md relative ${searchFocused ? 'ring-2 ring-blue-400 ring-offset-1 rounded-lg' : ''}`}>
        <Search
          size={14}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
        />
        <input
          type="text"
          placeholder="Search journey, shipment ref, customer…"
          value={activeFilters.search}
          onChange={(e) => setFilter('search', e.target.value)}
          onFocus={() => setSearchFocused(true)}
          onBlur={() => setSearchFocused(false)}
          className="w-full h-8 pl-8 pr-3 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder:text-slate-400 focus:outline-none focus:bg-white transition-colors"
        />
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-2 flex-shrink-0 ml-auto">
        <Button
          variant="ghost"
          size="sm"
          icon={<HelpCircle size={14} />}
          onClick={() => setShowTour(true)}
          className="hidden sm:inline-flex text-slate-500"
          data-tour="take-tour"
        >
          Take Tour
        </Button>
        <Button
          variant="ghost"
          size="sm"
          icon={<StickyNote size={14} />}
          onClick={() => setShowDesignRationale(true)}
          className="hidden sm:inline-flex text-slate-500"
        >
          Design Notes
        </Button>
        <button className="relative w-8 h-8 flex items-center justify-center text-slate-500 hover:bg-slate-100 rounded-lg transition-colors">
          <Bell size={16} />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full" />
        </button>

        {/* User menu */}
        <button className="flex items-center gap-1.5 hover:bg-slate-50 rounded-lg px-2 py-1 transition-colors">
          <Avatar name="Priya Sharma" size="sm" />
          <span className="text-sm text-slate-700 font-medium hidden lg:block">Priya S.</span>
          <ChevronDown size={12} className="text-slate-400 hidden lg:block" />
        </button>
      </div>
    </header>
  );
}
