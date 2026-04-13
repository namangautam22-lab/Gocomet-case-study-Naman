'use client';

import { Bookmark, BookmarkPlus, ChevronDown } from 'lucide-react';
import { useAppStore } from '@/store/appStore';

export function SavedViewsStrip() {
  const { savedViews, activeViewId, setActiveView, setShowSaveViewModal } = useAppStore();

  return (
    <div className="flex items-center gap-1 min-w-0" data-tour="saved-views">
      <span className="text-xs font-medium text-slate-400 flex-shrink-0 mr-1">Views:</span>
      <div className="flex items-center gap-1 overflow-x-auto pb-0.5 flex-1 min-w-0">
        {/* All journeys (default) */}
        <button
          onClick={() => setActiveView(null)}
          className={`flex-shrink-0 text-xs font-medium px-3 py-1.5 rounded-full transition-colors border ${
            activeViewId === null
              ? 'bg-blue-600 text-white border-blue-600'
              : 'bg-white text-slate-600 border-slate-200 hover:border-blue-300 hover:text-blue-600'
          }`}
        >
          All Journeys
        </button>

        {/* Pinned saved views */}
        {savedViews.filter((v) => v.isPinned).map((view) => (
          <button
            key={view.id}
            onClick={() => setActiveView(view.id)}
            className={`flex-shrink-0 flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full transition-colors border ${
              activeViewId === view.id
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-slate-600 border-slate-200 hover:border-blue-300 hover:text-blue-600'
            }`}
          >
            <span
              className="w-1.5 h-1.5 rounded-full flex-shrink-0"
              style={{ backgroundColor: activeViewId === view.id ? 'white' : view.color }}
            />
            {view.name}
          </button>
        ))}

        {/* Unpinned views (dropdown hint) */}
        {savedViews.filter((v) => !v.isPinned).length > 0 && (
          <button className="flex-shrink-0 flex items-center gap-1 text-xs font-medium px-2 py-1.5 rounded-full text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors border border-transparent">
            <span>+{savedViews.filter((v) => !v.isPinned).length} more</span>
            <ChevronDown size={11} />
          </button>
        )}
      </div>

      {/* Divider */}
      <div className="h-4 w-px bg-slate-200 mx-1 flex-shrink-0" />

      {/* Save current view */}
      <button
        onClick={() => setShowSaveViewModal(true)}
        className="flex-shrink-0 flex items-center gap-1.5 text-xs font-medium text-blue-600 px-3 py-1.5 rounded-full border border-blue-200 bg-blue-50 hover:bg-blue-100 transition-colors"
        data-tour="save-view-btn"
      >
        <BookmarkPlus size={12} />
        Save Current View
      </button>
    </div>
  );
}
