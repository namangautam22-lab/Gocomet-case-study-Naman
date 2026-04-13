'use client';

import { type Mode, type JourneyStatus, type Risk } from '@/types';
import {
  Truck, Ship, Plane, Train,
  CheckCircle2, Clock, AlertTriangle, XCircle, MinusCircle, Circle, ArrowRight,
} from 'lucide-react';

// ── Mode config ──────────────────────────────────────────────────────────────
const MODE_CONFIG: Record<Mode, { label: string; cls: string; Icon: React.ElementType }> = {
  road:  { label: 'Road',  cls: 'mode-road',  Icon: Truck },
  ocean: { label: 'Ocean', cls: 'mode-ocean', Icon: Ship  },
  air:   { label: 'Air',   cls: 'mode-air',   Icon: Plane },
  rail:  { label: 'Rail',  cls: 'mode-rail',  Icon: Train },
};

export function ModeBadge({ mode, size = 'sm' }: { mode: Mode; size?: 'xs' | 'sm' | 'md' }) {
  const { label, cls, Icon } = MODE_CONFIG[mode];
  const sz = size === 'xs'
    ? 'text-[10px] px-1.5 py-0.5 gap-0.5'
    : size === 'md'
    ? 'text-sm px-3 py-1 gap-1.5'
    : 'text-xs px-2 py-0.5 gap-1';
  const iconSz = size === 'xs' ? 10 : size === 'md' ? 14 : 11;
  return (
    <span className={`inline-flex items-center font-medium rounded-full ${cls} ${sz}`}>
      <Icon size={iconSz} />{label}
    </span>
  );
}

// ── Mode chain ──────────────────────────────────────────────────────────────
// Active leg shows label; inactive legs show icon-only and are dimmed
export function ModeChain({
  modes,
  activeIndex,
  size = 'sm',
}: {
  modes: Mode[];
  activeIndex: number;
  size?: 'xs' | 'sm' | 'md';
}) {
  return (
    <div className="flex items-center gap-0.5">
      {modes.map((mode, i) => {
        const { label, cls, Icon } = MODE_CONFIG[mode];
        const isActive = i === activeIndex;
        const isDone   = i < activeIndex;

        if (isActive) {
          // Active: full label, ring highlight
          const pad = size === 'xs' ? 'px-1.5 py-0.5 text-[10px]' : 'px-2 py-0.5 text-xs';
          return (
            <span key={i} className="flex items-center gap-0.5">
              <span
                className={`inline-flex items-center gap-1 font-semibold rounded-full ${pad} ${cls} ring-2 ring-offset-1 ring-blue-400`}
                title={`Active leg: ${label}`}
              >
                <Icon size={size === 'xs' ? 10 : 11} />
                {label}
              </span>
              {i < modes.length - 1 && (
                <ArrowRight size={9} className="text-slate-300 mx-0.5" />
              )}
            </span>
          );
        }

        // Inactive: icon-only, dimmed
        const pad = size === 'xs' ? 'p-0.5' : 'p-1';
        return (
          <span key={i} className="flex items-center gap-0.5">
            <span
              className={`inline-flex items-center justify-center rounded-full ${pad} ${cls} ${isDone ? 'opacity-50' : 'opacity-40'}`}
              title={label}
            >
              <Icon size={size === 'xs' ? 9 : 10} />
            </span>
            {i < modes.length - 1 && (
              <ArrowRight size={9} className="text-slate-200 mx-0.5" />
            )}
          </span>
        );
      })}
    </div>
  );
}

// ── Status badge ────────────────────────────────────────────────────────────
const STATUS_CONFIG: Record<JourneyStatus, { label: string; cls: string; Icon: React.ElementType }> = {
  'on-track': { label: 'On Track', cls: 'status-on-track', Icon: CheckCircle2 },
  delayed:    { label: 'Delayed',  cls: 'status-delayed',  Icon: Clock        },
  blocked:    { label: 'Blocked',  cls: 'status-blocked',  Icon: XCircle      },
  'at-risk':  { label: 'At Risk',  cls: 'status-at-risk',  Icon: AlertTriangle },
  'no-update':{ label: 'No Update',cls: 'status-no-update',Icon: MinusCircle  },
  completed:  { label: 'Delivered',cls: 'status-completed',Icon: CheckCircle2 },
};

export function StatusBadge({ status, size = 'sm' }: { status: JourneyStatus; size?: 'sm' | 'md' }) {
  const { label, cls, Icon } = STATUS_CONFIG[status];
  const sz = size === 'md' ? 'text-xs px-2.5 py-1 gap-1.5' : 'text-[11px] px-2 py-0.5 gap-1';
  const iconSz = size === 'md' ? 13 : 10;
  return (
    <span className={`inline-flex items-center font-semibold rounded-full ${cls} ${sz}`}>
      <Icon size={iconSz} strokeWidth={2.5} />{label}
    </span>
  );
}

// ── Risk badge ──────────────────────────────────────────────────────────────
// Critical and High shown as filled badge; medium and low as dot+text
const RISK_CONFIG: Record<Risk, { label: string; dot: string; badgeCls?: string }> = {
  low:      { label: 'Low',      dot: 'bg-emerald-400' },
  medium:   { label: 'Medium',   dot: 'bg-amber-400'   },
  high:     { label: 'High',     dot: 'bg-red-500',    badgeCls: 'bg-red-50 text-red-700 border border-red-200'     },
  critical: { label: 'Critical', dot: 'bg-red-700',    badgeCls: 'bg-red-100 text-red-800 border border-red-300 font-semibold' },
};

export function RiskBadge({ risk }: { risk: Risk }) {
  const { label, dot, badgeCls } = RISK_CONFIG[risk];

  if (badgeCls) {
    return (
      <span className={`inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full ${badgeCls}`}>
        <span className={`w-1.5 h-1.5 rounded-full ${dot} flex-shrink-0`} />
        {label}
      </span>
    );
  }
  return (
    <span className={`inline-flex items-center gap-1.5 text-[11px] font-medium risk-${risk}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
      {label}
    </span>
  );
}

// ── Priority badge ──────────────────────────────────────────────────────────
const PRIORITY_MAP = {
  low:    'bg-slate-100 text-slate-500 border border-slate-200',
  medium: 'bg-amber-50 text-amber-700 border border-amber-200',
  high:   'bg-red-50 text-red-700 border border-red-200',
};

export function PriorityBadge({ priority }: { priority: 'low' | 'medium' | 'high' }) {
  return (
    <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${PRIORITY_MAP[priority]}`}>
      {priority.toUpperCase()}
    </span>
  );
}

// ── Delay pill ──────────────────────────────────────────────────────────────
export function DelayPill({ days }: { days: number }) {
  if (days === 0)
    return <span className="text-[11px] text-emerald-600 font-medium">On time</span>;
  const cls = days >= 7 ? 'text-red-700 font-bold'
    : days >= 3 ? 'text-red-600 font-semibold'
    : 'text-amber-600 font-semibold';
  return (
    <span className={`text-[11px] ${cls}`}>+{days}d</span>
  );
}

// ── Avatar ──────────────────────────────────────────────────────────────────
const AVATAR_COLORS: Record<string, string> = {
  'Priya Sharma':    'bg-violet-100 text-violet-700',
  'Arjun Mehta':     'bg-blue-100 text-blue-700',
  'Sofia Martinez':  'bg-rose-100 text-rose-700',
  'Hans Mueller':    'bg-amber-100 text-amber-700',
  'Elena Fischer':   'bg-teal-100 text-teal-700',
  'Fatima Al-Rashid':'bg-emerald-100 text-emerald-700',
  'Ramesh Iyer':     'bg-orange-100 text-orange-700',
  'Kavya Reddy':     'bg-pink-100 text-pink-700',
};

export function Avatar({ name, size = 'sm' }: { name: string; size?: 'xs' | 'sm' | 'md' | 'lg' }) {
  const initials = name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase();
  const cls = AVATAR_COLORS[name] ?? 'bg-slate-100 text-slate-600';
  const sz = size === 'xs' ? 'w-5 h-5 text-[9px]'
    : size === 'md' ? 'w-7 h-7 text-xs'
    : size === 'lg' ? 'w-9 h-9 text-sm'
    : 'w-6 h-6 text-[10px]';
  return (
    <span className={`inline-flex items-center justify-center rounded-full font-bold ${cls} ${sz} flex-shrink-0`}>
      {initials}
    </span>
  );
}

// ── Milestone dot ───────────────────────────────────────────────────────────
export function MilestoneDot({
  type, status, size = 'sm',
}: {
  type: 'system' | 'manual';
  status: string;
  size?: 'sm' | 'md';
}) {
  const iconSz = size === 'md' ? 15 : 12;

  if (status === 'completed') {
    return <CheckCircle2 size={iconSz} className={type === 'manual' ? 'text-violet-500' : 'text-blue-500'} />;
  }
  if (status === 'in-progress') {
    return (
      <span className={`flex items-center justify-center rounded-full ${size === 'md' ? 'w-3.5 h-3.5' : 'w-3 h-3'} ${type === 'manual' ? 'bg-violet-500' : 'bg-blue-500'}`}>
        <span className={`rounded-full bg-white ${size === 'md' ? 'w-1.5 h-1.5' : 'w-1 h-1'}`} />
      </span>
    );
  }
  if (status === 'blocked') {
    return <XCircle size={iconSz} className="text-red-500" />;
  }
  // planned
  return (
    <span className={`flex items-center justify-center rounded-full border-2 ${size === 'md' ? 'w-3.5 h-3.5' : 'w-3 h-3'} ${type === 'manual' ? 'border-violet-300' : 'border-slate-300'} bg-white`} />
  );
}
