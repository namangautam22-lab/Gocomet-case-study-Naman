'use client';

import { format } from 'date-fns';
import {
  ArrowLeft, MessageSquarePlus, Flag, UserCheck, Share2, GitMerge,
  CalendarDays, Clock, AlertTriangle, Package, Weight,
} from 'lucide-react';
import { useAppStore } from '@/store/appStore';
import { StatusBadge, RiskBadge, Avatar, ModeChain } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import type { Journey, JourneyStatus } from '@/types';

function fmtDate(iso: string) {
  try { return format(new Date(iso), 'dd MMM yyyy'); } catch { return iso; }
}
function fmtTime(iso: string) {
  try { return format(new Date(iso), 'dd MMM, HH:mm'); } catch { return iso; }
}

// Status → accent strip color at top of header
const STATUS_ACCENT: Record<JourneyStatus, string> = {
  'on-track':  'bg-emerald-500',
  delayed:     'bg-amber-500',
  blocked:     'bg-red-600',
  'at-risk':   'bg-orange-500',
  'no-update': 'bg-slate-400',
  completed:   'bg-emerald-600',
};

function StatBlock({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">{label}</span>
      <div className="text-sm font-semibold text-slate-800">{children}</div>
    </div>
  );
}

export function JourneyHeader({ journey }: { journey: Journey }) {
  const {
    goToControlTower,
    setShowAddRemarkDrawer,
    setShowAddMilestoneDrawer,
    setShowMergeLinkModal,
  } = useAppStore();

  const openExceptions = journey.exceptions.filter((e) => e.status === 'open').length;

  return (
    <div className="bg-white border-b border-slate-200 flex-shrink-0">
      {/* Thin status accent strip */}
      <div className={`h-0.5 ${STATUS_ACCENT[journey.status]}`} />

      {/* Breadcrumb */}
      <div className="flex items-center gap-3 px-6 py-2.5 border-b border-slate-100">
        <button
          onClick={goToControlTower}
          className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-900 transition-colors group"
        >
          <ArrowLeft size={13} className="group-hover:-translate-x-0.5 transition-transform" />
          Control Tower
        </button>
        <span className="text-slate-300">›</span>
        <span className="text-xs font-semibold text-slate-800">{journey.id}</span>
        <span className="text-slate-300">·</span>
        <span className="text-xs text-slate-400 font-mono">{journey.shipmentRef}</span>
        <div className="ml-auto flex items-center gap-2">
          <Button variant="ghost" size="xs" icon={<Share2 size={11} />} className="text-slate-400">Share</Button>
          <Button variant="ghost" size="xs" icon={<GitMerge size={11} />} onClick={() => setShowMergeLinkModal(true)} className="text-slate-400">Merge / Link</Button>
        </div>
      </div>

      {/* Main hero area */}
      <div className="px-6 py-4">
        <div className="flex items-start justify-between gap-8">

          {/* LEFT: identity + stats */}
          <div className="flex-1 min-w-0">
            {/* Title row */}
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">{journey.customer}</h1>
              <StatusBadge status={journey.status} size="md" />
              <RiskBadge risk={journey.risk} />
            </div>

            {/* Route + mode chain */}
            <div className="flex items-center gap-2 mt-1.5 flex-wrap">
              <span className="text-sm font-medium text-slate-700">{journey.origin}</span>
              <span className="text-slate-300 text-lg font-light">→</span>
              <span className="text-sm font-medium text-slate-700">{journey.destination}</span>
              <span className="text-slate-200">·</span>
              <ModeChain modes={journey.modeChain} activeIndex={journey.activeLeg} size="sm" />
            </div>

            {/* Divider */}
            <div className="h-px bg-slate-100 my-3.5" />

            {/* Stat grid */}
            <div className="flex items-start gap-8 flex-wrap">
              <StatBlock label="Overall ETA">
                <span className={journey.delayDays > 0 ? 'text-amber-700' : 'text-slate-800'}>
                  {fmtDate(journey.overallETA)}
                </span>
                {journey.delayDays > 0 && (
                  <span className="ml-1.5 text-xs font-bold text-amber-600">+{journey.delayDays}d delay</span>
                )}
              </StatBlock>

              {journey.delayDays > 0 && (
                <StatBlock label="Original ETA">
                  <span className="line-through text-slate-400">{fmtDate(journey.originalETA)}</span>
                </StatBlock>
              )}

              {openExceptions > 0 && (
                <StatBlock label="Open Exceptions">
                  <span className="text-red-600 flex items-center gap-1">
                    <AlertTriangle size={13} />
                    {openExceptions} open
                  </span>
                </StatBlock>
              )}

              <StatBlock label="Owner">
                <div className="flex items-center gap-1.5">
                  <Avatar name={journey.owner} size="xs" />
                  {journey.owner}
                </div>
              </StatBlock>

              <StatBlock label="Shipment">
                <span className="font-mono text-slate-600 text-xs">{journey.shipmentRef}</span>
              </StatBlock>

              <StatBlock label="Commodity">
                <span className="text-slate-600 text-xs font-normal">{journey.commodity}</span>
              </StatBlock>

              <StatBlock label="Weight">
                <span className="text-slate-600 text-xs font-normal">{journey.weight}</span>
              </StatBlock>

              <StatBlock label="Incoterm">
                <span className="font-semibold text-slate-700">{journey.incoterm}</span>
              </StatBlock>

              <StatBlock label="Last Updated">
                <span className="text-slate-500 text-xs font-normal">{fmtTime(journey.updatedAt)}</span>
              </StatBlock>
            </div>
          </div>

          {/* RIGHT: action buttons — horizontal row */}
          <div className="flex-shrink-0 flex flex-col gap-2 pt-1">
            <Button
              variant="primary"
              size="sm"
              icon={<MessageSquarePlus size={13} />}
              onClick={() => setShowAddRemarkDrawer(true)}
              data-tour="add-remark-btn"
            >
              Add Remark
            </Button>
            <Button
              variant="secondary"
              size="sm"
              icon={<Flag size={13} />}
              onClick={() => setShowAddMilestoneDrawer(true)}
              data-tour="add-milestone-btn"
            >
              Add Milestone
            </Button>
            <Button
              variant="ghost"
              size="sm"
              icon={<UserCheck size={13} />}
              className="text-slate-500"
            >
              Assign Owner
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
