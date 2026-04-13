'use client';

import { useAppStore } from '@/store/appStore';
import { ControlTower } from '@/components/control-tower/ControlTower';
import { JourneyDetail } from '@/components/journey-detail/JourneyDetail';
import { SaveViewModal } from '@/components/modals/SaveViewModal';
import { MergeLinkModal } from '@/components/modals/MergeLinkModal';
import { AddTrackingModal } from '@/components/modals/AddTrackingModal';
import { AddRemarkDrawer } from '@/components/drawers/AddRemarkDrawer';
import { AddMilestoneDrawer } from '@/components/drawers/AddMilestoneDrawer';
import { DesignRationale } from '@/components/DesignRationale';
import { WhatsNew } from '@/components/onboarding/WhatsNew';

export default function Home() {
  const {
    currentView,
    showSaveViewModal,
    showMergeLinkModal,
    showAddRemarkDrawer,
    showAddMilestoneDrawer,
    showDesignRationale,
    showAddTrackingModal,
  } = useAppStore();

  return (
    <div className="min-h-screen bg-slate-50">
      {currentView === 'control-tower' && <ControlTower />}
      {currentView === 'journey-detail' && <JourneyDetail />}

      {/* Global overlays — order matters for z-index */}
      {showSaveViewModal && <SaveViewModal />}
      {showMergeLinkModal && <MergeLinkModal />}
      {showAddTrackingModal && <AddTrackingModal />}
      {showAddRemarkDrawer && <AddRemarkDrawer />}
      {showAddMilestoneDrawer && <AddMilestoneDrawer />}
      {showDesignRationale && <DesignRationale />}

      {/* Onboarding — always mounted, shows on first visit */}
      <WhatsNew />
    </div>
  );
}
