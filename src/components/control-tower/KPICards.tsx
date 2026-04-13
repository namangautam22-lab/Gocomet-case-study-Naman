'use client';

import { format, startOfWeek, endOfWeek } from 'date-fns';
import { useAppStore } from '@/store/appStore';

export function KPICards() {
  const journeys = useAppStore((s) => s.journeys);

  const today     = new Date();
  const weekStart = startOfWeek(today, { weekStartsOn: 1 });
  const weekEnd   = endOfWeek(today, { weekStartsOn: 1 });
  const weekLabel = `${format(weekStart, 'MMM d')}–${format(weekEnd, 'd')}`;

  const stats = [
    {
      value: journeys.filter((j) => j.status !== 'completed').length,
      label: 'Active',
      sub: `${journeys.length} total`,
      accent: 'border-l-blue-500',
      num: 'text-slate-800',
    },
    {
      value: journeys.filter((j) => j.status === 'delayed').length,
      label: 'Delayed',
      sub: 'Needs monitoring',
      accent: 'border-l-amber-400',
      num: 'text-amber-700',
    },
    {
      value: journeys.filter((j) => j.risk === 'high' || j.risk === 'critical').length,
      label: 'At Risk',
      sub: 'High or Critical',
      accent: 'border-l-red-500',
      num: 'text-red-700',
    },
    {
      value: journeys.filter((j) => {
        const eta = new Date(j.overallETA);
        return eta >= weekStart && eta <= weekEnd;
      }).length,
      label: 'ETA This Week',
      sub: weekLabel,
      accent: 'border-l-emerald-500',
      num: 'text-emerald-700',
    },
    {
      value: journeys.filter((j) => j.status === 'blocked').length,
      label: 'Blocked',
      sub: 'Action required',
      accent: 'border-l-red-700',
      num: 'text-red-800',
    },
    {
      value: journeys.filter((j) => j.status === 'no-update').length,
      label: 'No Update',
      sub: 'Over 48 hours',
      accent: 'border-l-slate-400',
      num: 'text-slate-600',
    },
  ];

  return (
    <div className="grid grid-cols-6 gap-2.5">
      {stats.map(({ value, label, sub, accent, num }) => (
        <div
          key={label}
          className={`bg-white rounded-lg border border-slate-200 border-l-[3px] ${accent} px-4 py-3`}
        >
          <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">{label}</p>
          <p className={`text-2xl font-bold leading-none ${num}`}>{value}</p>
          <p className="text-[10px] text-slate-400 mt-1.5 leading-none">{sub}</p>
        </div>
      ))}
    </div>
  );
}
