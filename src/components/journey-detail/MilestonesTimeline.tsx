'use client';

import { format } from 'date-fns';
import { Info, User } from 'lucide-react';
import { MilestoneDot } from '@/components/ui/Badge';
import type { Journey, Milestone } from '@/types';

function fmt(iso: string) {
  try { return format(new Date(iso), 'dd MMM'); } catch { return iso; }
}

const STATUS_LABELS: Record<string, string> = {
  completed:   'Completed',
  'in-progress': 'In progress',
  planned:     'Planned',
  blocked:     'Blocked',
};

const CATEGORY_COLORS: Record<string, string> = {
  Documentation:         'bg-blue-50 text-blue-700 border-blue-100',
  Customs:               'bg-amber-50 text-amber-700 border-amber-100',
  Warehouse:             'bg-orange-50 text-orange-700 border-orange-100',
  'Carrier Coordination':'bg-teal-50 text-teal-700 border-teal-100',
  'Customer Communication':'bg-violet-50 text-violet-700 border-violet-100',
  'Internal Review':     'bg-slate-100 text-slate-600 border-slate-200',
  'Exception Handling':  'bg-red-50 text-red-700 border-red-100',
};

function MilestoneRow({ milestone, isLast }: { milestone: Milestone; isLast: boolean }) {
  const isManual     = milestone.type === 'manual';
  const isActive     = milestone.status === 'in-progress';
  const isBlocked    = milestone.status === 'blocked';
  const isCompleted  = milestone.status === 'completed';
  const isPlanned    = milestone.status === 'planned';

  // Left-accent per type
  const rowAccent = isManual ? 'border-l-2 border-l-violet-300 pl-2.5' : 'pl-3';

  return (
    <div className="flex items-start gap-3 relative">
      {/* Vertical connector */}
      {!isLast && (
        <div
          className={`absolute left-[5.5px] top-[18px] bottom-0 w-px ${
            isCompleted ? 'bg-blue-200' : 'bg-slate-100'
          }`}
        />
      )}

      {/* Dot column */}
      <div className="flex-shrink-0 pt-0.5 z-10">
        <MilestoneDot type={milestone.type} status={milestone.status} size="md" />
      </div>

      {/* Content */}
      <div
        className={`flex-1 min-w-0 pb-5 ${rowAccent} ${
          isPlanned ? 'opacity-60' : ''
        }`}
      >
        {/* Name row */}
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className={`text-[13px] font-semibold leading-snug ${
              isBlocked  ? 'text-red-700'
              : isActive ? 'text-blue-700'
              : isCompleted ? 'text-slate-700'
              : 'text-slate-500'
            }`}
          >
            {milestone.name}
          </span>

          {/* Manual pill */}
          {isManual && (
            <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold bg-violet-50 text-violet-700 px-1.5 py-0.5 rounded-full border border-violet-200">
              <User size={8} />Manual
            </span>
          )}

          {/* Category */}
          {milestone.category && (
            <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full border ${CATEGORY_COLORS[milestone.category] ?? 'bg-slate-100 text-slate-600 border-slate-200'}`}>
              {milestone.category}
            </span>
          )}

          {/* In-progress pulse dot */}
          {isActive && (
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
          )}
        </div>

        {/* Meta line */}
        <div className="flex items-center gap-2.5 mt-1 flex-wrap">
          <span className="text-[11px] text-slate-400">
            {isCompleted && milestone.completedAt
              ? `Completed ${fmt(milestone.completedAt)}`
              : `${STATUS_LABELS[milestone.status]} · ${fmt(milestone.date)}`}
          </span>
          {milestone.owner && (
            <span className="text-[11px] text-slate-400">
              Owner: <span className="text-slate-600">{milestone.owner}</span>
            </span>
          )}
          {isManual && milestone.createdBy && (
            <span className="text-[10px] text-slate-300">by {milestone.createdBy}</span>
          )}
        </div>

        {/* Note */}
        {milestone.note && (
          <div className="flex items-start gap-1 mt-1.5 p-2 bg-slate-50 rounded-lg border border-slate-100">
            <Info size={10} className="text-slate-400 mt-0.5 flex-shrink-0" />
            <p className="text-[11px] text-slate-500 leading-relaxed">{milestone.note}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export function MilestonesTimeline({ journey }: { journey: Journey }) {
  const sorted = [...journey.milestones].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const systemCount   = journey.milestones.filter((m) => m.type === 'system').length;
  const manualCount   = journey.milestones.filter((m) => m.type === 'manual').length;
  const completedCount = sorted.filter((m) => m.status === 'completed').length;
  const total         = sorted.length;

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-card" data-tour="milestones">
      {/* Header */}
      <div className="px-5 py-4 border-b border-slate-100">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-800">Milestones</h3>
            <p className="text-[11px] text-slate-400 mt-0.5">{completedCount}/{total} completed</p>
          </div>
          {/* Legend */}
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 text-[10px] font-semibold text-slate-500">
              <span className="w-2 h-2 rounded-full bg-blue-500" />{systemCount} System
            </span>
            <span className="flex items-center gap-1 text-[10px] font-semibold text-violet-600">
              <span className="w-2 h-2 rounded-full bg-violet-500" />{manualCount} Manual
            </span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-3 h-1.5 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all"
            style={{
              width: `${(completedCount / total) * 100}%`,
              background: 'linear-gradient(90deg, #3b82f6 0%, #10b981 100%)',
            }}
          />
        </div>
      </div>

      {/* Timeline */}
      <div className="px-5 pt-4 pb-2">
        {sorted.map((milestone, i) => (
          <MilestoneRow
            key={milestone.id}
            milestone={milestone}
            isLast={i === sorted.length - 1}
          />
        ))}
      </div>
    </div>
  );
}
