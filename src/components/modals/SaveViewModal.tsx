'use client';

import { useState } from 'react';
import { Bell, Bookmark, Globe, Users, Lock, ToggleLeft, ToggleRight } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { useAppStore } from '@/store/appStore';

interface ToggleProps {
  label: string;
  desc?: string;
  value: boolean;
  onChange: (v: boolean) => void;
}
function Toggle({ label, desc, value, onChange }: ToggleProps) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-slate-50">
      <div>
        <div className="text-sm font-medium text-slate-700">{label}</div>
        {desc && <div className="text-xs text-slate-400 mt-0.5">{desc}</div>}
      </div>
      <button onClick={() => onChange(!value)} className="flex-shrink-0">
        {value
          ? <ToggleRight size={22} className="text-blue-600" />
          : <ToggleLeft size={22} className="text-slate-300" />}
      </button>
    </div>
  );
}

export function SaveViewModal() {
  const { setShowSaveViewModal, saveView, activeFilters } = useAppStore();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [scope, setScope] = useState<'private' | 'team' | 'org'>('private');
  const [isDefault, setIsDefault] = useState(false);
  const [isPinned, setIsPinned] = useState(true);
  const [alerts, setAlerts] = useState({
    entersView: false,
    etaSlips: true,
    blockerAdded: true,
    dailyDigest: false,
  });

  const scopes = [
    { value: 'private', label: 'Private', desc: 'Only visible to you', Icon: Lock },
    { value: 'team', label: 'Team', desc: 'Shared with your team', Icon: Users },
    { value: 'org', label: 'Org Template', desc: 'Available to all users', Icon: Globe },
  ] as const;

  const activeFilterCount = Object.values(activeFilters).filter(
    (v) => v !== null && v !== false && v !== ''
  ).length;

  function handleSave() {
    if (!name.trim()) return;
    saveView({
      name: name.trim(),
      description: description.trim(),
      scope,
      isDefault,
      isPinned,
      color: '#2563eb',
      filters: activeFilters as unknown as Record<string, unknown>,
      columns: ['id', 'shipmentRef', 'customer', 'route', 'modeChain', 'eta', 'delayDays', 'risk', 'owner'],
      sort: { field: 'updatedAt', direction: 'desc' },
      alerts,
      createdBy: 'Priya Sharma',
    });
  }

  return (
    <Modal
      title="Save Current View"
      subtitle="Capture your current filters, columns, and sort as a reusable view."
      onClose={() => setShowSaveViewModal(false)}
      width="md"
      footer={
        <>
          <Button variant="ghost" onClick={() => setShowSaveViewModal(false)}>Cancel</Button>
          <Button variant="primary" onClick={handleSave} disabled={!name.trim()} icon={<Bookmark size={13} />}>
            Save View
          </Button>
        </>
      }
    >
      {/* Current filters preview */}
      {activeFilterCount > 0 && (
        <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-100 text-xs text-blue-700">
          <span className="font-semibold">
            {activeFilterCount} active filter{activeFilterCount !== 1 ? 's' : ''}
          </span>{' '}
          will be saved with this view.
        </div>
      )}
      {activeFilterCount === 0 && (
        <div className="mb-4 p-3 bg-amber-50 rounded-lg border border-amber-100 text-xs text-amber-700">
          No filters active. The view will capture all journeys by default.
        </div>
      )}

      <div className="space-y-4">
        {/* Name */}
        <div>
          <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">View Name *</label>
          <input
            autoFocus
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. My Delays, ETA This Week, Customs Watch…"
            className="mt-1.5 w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
          />
        </div>

        {/* Description */}
        <div>
          <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What is this view for? Who should use it?"
            rows={2}
            className="mt-1.5 w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
          />
        </div>

        {/* Scope */}
        <div>
          <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-2 block">Scope</label>
          <div className="grid grid-cols-3 gap-2">
            {scopes.map(({ value, label, desc, Icon }) => (
              <button
                key={value}
                onClick={() => setScope(value)}
                className={`flex flex-col items-center gap-1.5 p-3 rounded-lg border-2 transition-colors text-center ${
                  scope === value
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-slate-200 bg-white hover:border-blue-200'
                }`}
              >
                <Icon size={16} className={scope === value ? 'text-blue-600' : 'text-slate-400'} />
                <span className={`text-xs font-semibold ${scope === value ? 'text-blue-700' : 'text-slate-700'}`}>{label}</span>
                <span className="text-[10px] text-slate-400 leading-tight">{desc}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Options */}
        <div className="bg-slate-50 rounded-lg px-4">
          <Toggle label="Set as Default View" desc="Open this view each time you visit Control Tower" value={isDefault} onChange={setIsDefault} />
          <Toggle label="Pin to Views Strip" desc="Show in the quick-access bar" value={isPinned} onChange={setIsPinned} />
        </div>

        {/* Alert triggers */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Bell size={13} className="text-slate-400" />
            <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Alert Triggers</label>
          </div>
          <div className="bg-slate-50 rounded-lg px-4">
            <Toggle
              label="Shipment enters this view"
              desc="Alert when a new journey matches this view's filters"
              value={alerts.entersView}
              onChange={(v) => setAlerts((a) => ({ ...a, entersView: v }))}
            />
            <Toggle
              label="ETA slips"
              desc="Alert when ETA changes for any journey in this view"
              value={alerts.etaSlips}
              onChange={(v) => setAlerts((a) => ({ ...a, etaSlips: v }))}
            />
            <Toggle
              label="Blocker added"
              desc="Alert when a blocker remark is added"
              value={alerts.blockerAdded}
              onChange={(v) => setAlerts((a) => ({ ...a, blockerAdded: v }))}
            />
            <Toggle
              label="Daily digest"
              desc="Receive a daily summary of journeys in this view"
              value={alerts.dailyDigest}
              onChange={(v) => setAlerts((a) => ({ ...a, dailyDigest: v }))}
            />
          </div>
        </div>
      </div>
    </Modal>
  );
}
