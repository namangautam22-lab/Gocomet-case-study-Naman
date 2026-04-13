'use client';

import { useEffect } from 'react';
import { Bookmark, BookmarkPlus, ChevronDown } from 'lucide-react';
import { useAppStore } from '@/store/appStore';
import type { SavedView } from '@/types';

export function SavedViewsStrip() {
  const { savedViews, activeViewId, setActiveView, setShowSaveViewModal } = useAppStore();

  // Load persisted views from localStorage on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem('gt_views');
      if (!raw) return;
      const { views, activeId } = JSON.parse(raw) as { views: SavedView[]; activeId: string | null };
      if (Array.isArray(views) && views.length > 0) {
        useAppStore.setState({ savedViews: views });
      }
      if (activeId !== undefined) {
        useAppStore.setState({ activeViewId: activeId });
      }
    } catch {}
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const pinned   = savedViews.filter((v) => v.isPinned);
  const unpinned = savedViews.filter((v) => !v.isPinned);

  return (
    <div className="flex items-center gap-1.5 min-w-0" data-tour="saved-views">
      <span className="text-[10px] font-semibold text-slate-400 flex-shrink-0 mr-0.5">Views:</span>

      <div className="flex items-center gap-1 overflow-x-auto flex-1 min-w-0">
        {/* All journeys (default) */}
        <button
          onClick={() => setActiveView(null)}
          className={`flex-shrink-0 text-[11px] font-medium px-2.5 py-1 rounded-full transition-colors border ${
            activeViewId === null
              ? 'bg-blue-600 text-white border-blue-600'
              : 'bg-white text-slate-600 border-slate-200 hover:border-blue-300 hover:text-blue-600'
          }`}
        >
          All
        </button>

        {/* Pinned saved views */}
        {pinned.map((view) => (
          <button
            key={view.id}
            onClick={() => setActiveView(view.id)}
            className={`flex-shrink-0 flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-1 rounded-full transition-colors border ${
              activeViewId === view.id
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-slate-600 border-slate-200 hover:border-blue-300 hover:text-blue-600'
            }`}
          >
            <span
              className="w-1.5 h-1.5 rounded-full flex-shrink-0"
              style={{ backgroundColor: activeViewId === view.id ? 'rgba(255,255,255,0.8)' : view.color }}
            />
            {view.name}
          </button>
        ))}

        {/* Unpinned views count */}
        {unpinned.length > 0 && (
          <button className="flex-shrink-0 flex items-center gap-0.5 text-[11px] font-medium px-2 py-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors border border-transparent">
            +{unpinned.length}
            <ChevronDown size={10} />
          </button>
        )}
      </div>

      <div className="h-3.5 w-px bg-slate-200 mx-0.5 flex-shrink-0" />

      {/* Save current view */}
      <button
        onClick={() => setShowSaveViewModal(true)}
        className="flex-shrink-0 flex items-center gap-1 text-[11px] font-medium text-blue-600 px-2.5 py-1 rounded-full border border-blue-200 bg-blue-50 hover:bg-blue-100 transition-colors"
        data-tour="save-view-btn"
      >
        <BookmarkPlus size={11} />
        Save view
      </button>
    </div>
  );
}
