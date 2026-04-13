'use client';

import React from 'react';
import { format } from 'date-fns';
import {
  Truck, Ship, Plane, Train,
  CheckCircle2, Clock, XCircle, Circle, Hourglass,
} from 'lucide-react';
import type { Journey, Leg, Mode, LegStatus } from '@/types';

const MODE_ICONS: Record<Mode, React.ElementType> = {
  road: Truck, ocean: Ship, air: Plane, rail: Train,
};

const MODE_LABEL: Record<Mode, string> = {
  road: 'Road Freight', ocean: 'Ocean Freight', air: 'Air Freight', rail: 'Rail Freight',
};

// Per-mode: default, active, completed, pending
const MODE_THEME: Record<Mode, {
  icon: string; activeBg: string; activeBorder: string;
  defaultBg: string; defaultBorder: string;
  iconBg: string; activeIconBg: string;
}> = {
  road: {
    icon: 'text-emerald-600', activeIconBg: 'bg-emerald-100', iconBg: 'bg-emerald-50',
    activeBg: 'bg-emerald-50', activeBorder: 'border-emerald-400',
    defaultBg: 'bg-white', defaultBorder: 'border-slate-200',
  },
  ocean: {
    icon: 'text-blue-600', activeIconBg: 'bg-blue-100', iconBg: 'bg-blue-50',
    activeBg: 'bg-blue-50', activeBorder: 'border-blue-400',
    defaultBg: 'bg-white', defaultBorder: 'border-slate-200',
  },
  air: {
    icon: 'text-violet-600', activeIconBg: 'bg-violet-100', iconBg: 'bg-violet-50',
    activeBg: 'bg-violet-50', activeBorder: 'border-violet-400',
    defaultBg: 'bg-white', defaultBorder: 'border-slate-200',
  },
  rail: {
    icon: 'text-amber-600', activeIconBg: 'bg-amber-100', iconBg: 'bg-amber-50',
    activeBg: 'bg-amber-50', activeBorder: 'border-amber-400',
    defaultBg: 'bg-white', defaultBorder: 'border-slate-200',
  },
};

const STATUS_META: Record<LegStatus, { label: string; color: string; Icon: React.ElementType }> = {
  pending:    { label: 'Pending',    color: 'text-slate-400',   Icon: Hourglass    },
  'in-transit':{ label: 'In Transit',color: 'text-blue-600',    Icon: Clock        },
  completed:  { label: 'Completed',  color: 'text-emerald-600', Icon: CheckCircle2 },
  delayed:    { label: 'Delayed',    color: 'text-amber-600',   Icon: Clock        },
  blocked:    { label: 'Blocked',    color: 'text-red-600',     Icon: XCircle      },
};

function fmt(iso: string) {
  try { return format(new Date(iso), 'dd MMM'); } catch { return iso; }
}

function DataRow({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-2 py-1 border-b border-slate-100 last:border-0">
      <span className="text-[10px] text-slate-400 flex-shrink-0">{label}</span>
      <span className={`text-[11px] text-slate-700 font-medium text-right truncate ${mono ? 'font-mono text-[10px]' : ''}`}>
        {value}
      </span>
    </div>
  );
}

function LegCard({ leg, isActive, isDone, index }: { leg: Leg; isActive: boolean; isDone: boolean; index: number }) {
  const theme = MODE_THEME[leg.mode];
  const Icon  = MODE_ICONS[leg.mode];
  const { label: statusLabel, color: statusColor, Icon: StatusIcon } = STATUS_META[leg.status];

  return (
    <div
      className={`
        flex-1 rounded-xl border-2 overflow-hidden transition-all
        ${isActive
          ? `${theme.activeBg} ${theme.activeBorder} shadow-panel leg-active-pulse`
          : isDone
          ? 'bg-slate-50 border-slate-200 opacity-75'
          : 'bg-white border-slate-200 opacity-55'
        }
      `}
    >
      {/* Card header */}
      <div className={`px-4 py-3 flex items-start justify-between border-b ${isActive ? `border-${theme.activeBorder.replace('border-','')}` : 'border-slate-100'}`}>
        <div className="flex items-center gap-2.5">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isActive ? theme.activeIconBg : theme.iconBg}`}>
            <Icon size={16} className={theme.icon} />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-800">{MODE_LABEL[leg.mode]}</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Leg {index + 1}</div>
          </div>
        </div>

        {/* Status */}
        <div className={`flex items-center gap-1 text-[11px] font-semibold ${statusColor}`}>
          <StatusIcon size={11} strokeWidth={2.5} />
          {statusLabel}
        </div>
      </div>

      {/* Card body */}
      <div className="px-4 py-3 space-y-0">
        {/* Route */}
        <div className="flex items-center gap-1.5 mb-2.5">
          <span className="text-xs font-semibold text-slate-700 truncate max-w-[85px]">{leg.origin.split(',')[0]}</span>
          <span className="text-slate-300 flex-shrink-0">→</span>
          <span className="text-xs font-semibold text-slate-700 truncate max-w-[85px]">{leg.destination.split(',')[0]}</span>
        </div>

        <DataRow label="Carrier"   value={leg.carrier} />
        {leg.vessel && <DataRow label="Vessel" value={leg.vessel} />}
        {leg.flight && <DataRow label="Flight" value={leg.flight} />}
        {leg.truck  && <DataRow label="Truck"  value={leg.truck} />}
        <DataRow label="Ref"      value={leg.trackingRef} mono />

        {/* ETA row with delay */}
        <div className="flex items-center justify-between pt-1.5 mt-1 border-t border-slate-100">
          <span className="text-[10px] text-slate-400">ETA</span>
          <div className="flex items-center gap-1.5">
            <span className={`text-xs font-bold ${leg.delayDays > 0 ? 'text-amber-700' : 'text-slate-800'}`}>
              {fmt(leg.eta)}
            </span>
            {leg.delayDays > 0 && (
              <span className="text-[10px] font-bold text-amber-600">+{leg.delayDays}d</span>
            )}
          </div>
        </div>
      </div>

      {/* Active leg: current milestone footer */}
      {isActive && leg.status !== 'pending' && (
        <div className={`px-4 py-2 border-t ${theme.activeBorder} bg-white/60`}>
          <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Now: </span>
          <span className="text-[11px] font-semibold text-slate-700">{leg.currentMilestone}</span>
        </div>
      )}

      {/* Pending leg indicator */}
      {leg.status === 'pending' && (
        <div className="px-4 py-2 border-t border-slate-100 bg-slate-50/50">
          <span className="text-[10px] text-slate-400 italic">Not yet started</span>
        </div>
      )}
    </div>
  );
}

// Connector between leg cards
function Connector({ fromDone, toActive }: { fromDone: boolean; toActive: boolean }) {
  return (
    <div className="flex-shrink-0 flex flex-col items-center justify-center gap-1 px-1 pt-8">
      <div className={`w-12 h-0.5 ${fromDone && toActive ? 'bg-blue-300' : fromDone ? 'bg-slate-300' : 'bg-slate-200'}`} />
      <div className={`w-2 h-2 rounded-full ${toActive ? 'bg-blue-400' : fromDone ? 'bg-slate-300' : 'bg-slate-200'}`} />
    </div>
  );
}

export function JourneyRail({ journey }: { journey: Journey }) {
  const completed = journey.legs.filter((l) => l.status === 'completed').length;
  const total     = journey.legs.length;
  const pct       = Math.round(((journey.activeLeg + 0.5) / total) * 100);

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-card" data-tour="journey-rail">
      {/* Panel header */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100">
        <div>
          <h3 className="text-sm font-bold text-slate-800">Journey Rail</h3>
          <p className="text-[11px] text-slate-400 mt-0.5">
            {total}-leg journey · {journey.origin.split(',')[0]} → {journey.destination.split(',')[0]}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-[10px] text-slate-400 font-medium uppercase tracking-wide">Progress</div>
            <div className="text-sm font-bold text-blue-600">{pct}%</div>
          </div>
        </div>
      </div>

      {/* Leg cards */}
      <div className="p-5">
        {/* Active leg label */}
        <div className="flex items-center gap-2 mb-4">
          {journey.legs.map((leg, i) => {
            const isActive = i === journey.activeLeg;
            const isDone   = i < journey.activeLeg;
            return (
              <div
                key={leg.id}
                className={`flex-1 text-center text-[10px] font-semibold pb-1 border-b-2 transition-all ${
                  isActive ? 'text-blue-600 border-blue-500'
                  : isDone  ? 'text-emerald-600 border-emerald-400 opacity-70'
                  :           'text-slate-300 border-slate-200'
                }`}
              >
                {isActive ? '● Active' : isDone ? '✓ Done' : '○ Pending'}
              </div>
            );
          })}
        </div>

        <div className="flex items-stretch gap-0">
          {journey.legs.map((leg, i) => (
            <React.Fragment key={leg.id}>
              <LegCard
                leg={leg}
                isActive={i === journey.activeLeg}
                isDone={i < journey.activeLeg}
                index={i}
              />
              {i < journey.legs.length - 1 && (
                <Connector
                  fromDone={i < journey.activeLeg}
                  toActive={i + 1 === journey.activeLeg}
                />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Overall progress bar */}
        <div className="mt-5 pt-4 border-t border-slate-50">
          <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1.5">
            <span className="font-medium text-slate-600">{journey.origin}</span>
            <span className="font-semibold text-blue-600">Leg {journey.activeLeg + 1} of {total} active</span>
            <span className="font-medium text-slate-600">{journey.destination}</span>
          </div>
          <div className="relative h-2 bg-slate-100 rounded-full overflow-hidden">
            {/* Completed segment */}
            <div
              className="absolute left-0 top-0 h-full bg-emerald-400 transition-all"
              style={{ width: `${(journey.activeLeg / total) * 100}%` }}
            />
            {/* Active segment */}
            <div
              className="absolute top-0 h-full bg-blue-400 transition-all"
              style={{ left: `${(journey.activeLeg / total) * 100}%`, width: `${(0.5 / total) * 100}%` }}
            />
          </div>
          <div className="flex mt-1.5">
            {journey.legs.map((leg, i) => (
              <div key={leg.id} className="flex-1 text-center">
                <span className={`text-[9px] font-semibold uppercase tracking-wide ${
                  i === journey.activeLeg ? 'text-blue-500'
                  : i < journey.activeLeg ? 'text-emerald-500'
                  : 'text-slate-300'
                }`}>
                  {leg.mode}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
