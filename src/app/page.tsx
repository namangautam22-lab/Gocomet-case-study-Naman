'use client';

import { useAppStore } from '@/store/appStore';
import { ControlTower } from '@/components/control-tower/ControlTower';
import { JourneyDetail } from '@/components/journey-detail/JourneyDetail';
import { SaveViewModal } from '@/components/modals/SaveViewModal';
import { MergeLinkModal } from '@/components/modals/MergeLinkModal';
import { AddRemarkDrawer } from '@/components/drawers/AddRemarkDrawer';
import { AddMilestoneDrawer } from '@/components/drawers/AddMilestoneDrawer';
import { GuidedTour } from '@/components/tour/GuidedTour';
import { DesignRationale } from '@/components/DesignRationale';

export default function Home() {
  const {
    currentView,
    showSaveViewModal,
    showMergeLinkModal,
    showAddRemarkDrawer,
    showAddMilestoneDrawer,
    showDesignRationale,
    showTour,
  } = useAppStore();

  return (
    <div className="min-h-screen bg-slate-50">
      {currentView === 'control-tower' && <ControlTower />}
      {currentView === 'journey-detail' && <JourneyDetail />}

      {/* Global overlays */}
      {showSaveViewModal && <SaveViewModal />}
      {showMergeLinkModal && <MergeLinkModal />}
      {showAddRemarkDrawer && <AddRemarkDrawer />}
      {showAddMilestoneDrawer && <AddMilestoneDrawer />}
      {showDesignRationale && <DesignRationale />}
      {showTour && <GuidedTour />}
    </div>
  );
}
