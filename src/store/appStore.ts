'use client';

import { create } from 'zustand';
import type {
  Journey,
  SavedView,
  WhatChangedItem,
  ActiveFilters,
  Remark,
  Milestone,
} from '@/types';
import {
  MOCK_JOURNEYS,
  MOCK_SAVED_VIEWS,
  MOCK_WHAT_CHANGED,
} from '@/data/mockData';

interface AppState {
  // Data
  journeys: Journey[];
  savedViews: SavedView[];
  whatChanged: WhatChangedItem[];

  // Navigation
  currentView: 'control-tower' | 'journey-detail';
  selectedJourneyId: string | null;

  // Filters
  activeFilters: ActiveFilters;
  activeViewId: string | null;

  // UI – modals & drawers
  showSaveViewModal: boolean;
  showMergeLinkModal: boolean;
  showAddRemarkDrawer: boolean;
  showAddMilestoneDrawer: boolean;
  showDesignRationale: boolean;
  showTour: boolean;
  tourStep: number;
  tourAutoOpen: boolean;

  // Computed helpers
  getSelectedJourney: () => Journey | null;
  getFilteredJourneys: () => Journey[];

  // Navigation actions
  selectJourney: (id: string) => void;
  goToControlTower: () => void;

  // Data mutations
  addRemark: (journeyId: string, remark: Omit<Remark, 'id' | 'createdAt' | 'journeyId'>) => void;
  addMilestone: (journeyId: string, milestone: Omit<Milestone, 'id' | 'createdAt' | 'journeyId'>) => void;
  saveView: (view: Omit<SavedView, 'id' | 'createdAt'>) => void;
  mergeJourneyLegs: (journeyId: string, candidateIds: string[]) => void;

  // Filter actions
  setFilter: <K extends keyof ActiveFilters>(key: K, value: ActiveFilters[K]) => void;
  clearFilters: () => void;
  setActiveView: (viewId: string | null) => void;

  // UI toggle actions
  setShowSaveViewModal: (v: boolean) => void;
  setShowMergeLinkModal: (v: boolean) => void;
  setShowAddRemarkDrawer: (v: boolean) => void;
  setShowAddMilestoneDrawer: (v: boolean) => void;
  setShowDesignRationale: (v: boolean) => void;
  setShowTour: (v: boolean) => void;
  setTourStep: (step: number) => void;
}

const DEFAULT_FILTERS: ActiveFilters = {
  mode: null,
  carrier: null,
  destination: null,
  etaRange: null,
  delayThreshold: null,
  owner: null,
  risk: null,
  hasRemarks: false,
  search: '',
};

export const useAppStore = create<AppState>()((set, get) => ({
  journeys: MOCK_JOURNEYS,
  savedViews: MOCK_SAVED_VIEWS,
  whatChanged: MOCK_WHAT_CHANGED,

  currentView: 'control-tower',
  selectedJourneyId: null,

  activeFilters: DEFAULT_FILTERS,
  activeViewId: null,

  showSaveViewModal: false,
  showMergeLinkModal: false,
  showAddRemarkDrawer: false,
  showAddMilestoneDrawer: false,
  showDesignRationale: false,
  showTour: false,
  tourStep: 0,
  tourAutoOpen: false,

  // ── Computed ──────────────────────────────────────────────────────────────
  getSelectedJourney: () => {
    const { journeys, selectedJourneyId } = get();
    return journeys.find((j) => j.id === selectedJourneyId) ?? null;
  },

  getFilteredJourneys: () => {
    const { journeys, activeFilters } = get();
    return journeys.filter((j) => {
      if (activeFilters.search) {
        const q = activeFilters.search.toLowerCase();
        if (
          !j.id.toLowerCase().includes(q) &&
          !j.shipmentRef.toLowerCase().includes(q) &&
          !j.customer.toLowerCase().includes(q) &&
          !j.origin.toLowerCase().includes(q) &&
          !j.destination.toLowerCase().includes(q)
        ) {
          return false;
        }
      }
      if (activeFilters.mode && !j.modeChain.includes(activeFilters.mode)) return false;
      if (activeFilters.risk && j.risk !== activeFilters.risk) return false;
      if (activeFilters.owner && j.owner !== activeFilters.owner) return false;
      if (activeFilters.hasRemarks && (!j.remarks || j.remarks.length === 0)) return false;
      if (activeFilters.delayThreshold !== null && j.delayDays < activeFilters.delayThreshold) return false;
      if (activeFilters.destination) {
        if (!j.destination.toLowerCase().includes(activeFilters.destination.toLowerCase())) return false;
      }
      return true;
    });
  },

  // ── Navigation ────────────────────────────────────────────────────────────
  selectJourney: (id) =>
    set({ selectedJourneyId: id, currentView: 'journey-detail' }),

  goToControlTower: () =>
    set({ currentView: 'control-tower', selectedJourneyId: null }),

  // ── Data mutations ────────────────────────────────────────────────────────
  addRemark: (journeyId, remarkData) => {
    const newRemark: Remark = {
      id: `REM-${Date.now()}`,
      journeyId,
      createdAt: new Date().toISOString(),
      ...remarkData,
    };

    const wc: WhatChangedItem = {
      id: `wc-${Date.now()}`,
      journeyId,
      journeyRef: get().journeys.find((j) => j.id === journeyId)?.shipmentRef ?? '',
      type: remarkData.noteType === 'blocker' ? 'exception' : 'remark',
      description: `${remarkData.noteType === 'blocker' ? 'Blocker' : 'Remark'} added: ${remarkData.text.slice(0, 60)}…`,
      by: remarkData.author,
      at: newRemark.createdAt,
    };

    set((state) => ({
      journeys: state.journeys.map((j) => {
        if (j.id !== journeyId) return j;
        const isBlocker = remarkData.noteType === 'blocker';
        return {
          ...j,
          remarks: [newRemark, ...j.remarks],
          lastRemark: remarkData.text.slice(0, 80),
          lastRemarkAt: newRemark.createdAt,
          updatedAt: newRemark.createdAt,
          risk: isBlocker ? 'critical' : j.risk,
          status: isBlocker ? 'blocked' : j.status,
        };
      }),
      whatChanged: [wc, ...state.whatChanged],
    }));
  },

  addMilestone: (journeyId, milestoneData) => {
    const newMilestone: Milestone = {
      ...milestoneData,
      id: `MS-${Date.now()}`,
      journeyId,
      type: 'manual',
      createdAt: new Date().toISOString(),
    };

    const wc: WhatChangedItem = {
      id: `wc-${Date.now()}`,
      journeyId,
      journeyRef: get().journeys.find((j) => j.id === journeyId)?.shipmentRef ?? '',
      type: 'milestone',
      description: `Manual milestone added: ${milestoneData.name}`,
      by: milestoneData.createdBy ?? 'You',
      at: newMilestone.createdAt!,
    };

    set((state) => ({
      journeys: state.journeys.map((j) => {
        if (j.id !== journeyId) return j;
        return {
          ...j,
          milestones: [...j.milestones, newMilestone],
          updatedAt: newMilestone.createdAt!,
        };
      }),
      whatChanged: [wc, ...state.whatChanged],
    }));
  },

  saveView: (viewData) => {
    const newView: SavedView = {
      id: `view-${Date.now()}`,
      createdAt: new Date().toISOString(),
      ...viewData,
    };
    set((state) => ({
      savedViews: [...state.savedViews, newView],
      showSaveViewModal: false,
    }));
  },

  mergeJourneyLegs: (journeyId, _candidateIds) => {
    const wc: WhatChangedItem = {
      id: `wc-${Date.now()}`,
      journeyId,
      journeyRef: get().journeys.find((j) => j.id === journeyId)?.shipmentRef ?? '',
      type: 'merge',
      description: `${_candidateIds.length} leg(s) merged into journey`,
      by: 'You',
      at: new Date().toISOString(),
    };
    set((state) => ({
      whatChanged: [wc, ...state.whatChanged],
      showMergeLinkModal: false,
    }));
  },

  // ── Filters ───────────────────────────────────────────────────────────────
  setFilter: (key, value) =>
    set((state) => ({
      activeFilters: { ...state.activeFilters, [key]: value },
    })),

  clearFilters: () => set({ activeFilters: DEFAULT_FILTERS, activeViewId: null }),

  setActiveView: (viewId) => {
    const view = viewId ? get().savedViews.find((v) => v.id === viewId) : null;
    set({
      activeViewId: viewId,
      activeFilters: view ? { ...DEFAULT_FILTERS, ...(view.filters as Partial<ActiveFilters>) } : DEFAULT_FILTERS,
    });
  },

  // ── UI toggles ────────────────────────────────────────────────────────────
  setShowSaveViewModal: (v) => set({ showSaveViewModal: v }),
  setShowMergeLinkModal: (v) => set({ showMergeLinkModal: v }),
  setShowAddRemarkDrawer: (v) => set({ showAddRemarkDrawer: v }),
  setShowAddMilestoneDrawer: (v) => set({ showAddMilestoneDrawer: v }),
  setShowDesignRationale: (v) => set({ showDesignRationale: v }),
  setShowTour: (v) => set({ showTour: v, tourStep: 0 }),
  setTourStep: (step) => set({ tourStep: step }),
}));
