'use client';

import { format, startOfWeek, endOfWeek } from 'date-fns';
import { useAppStore } from '@/store/appStore';

interface CardProps {
  value: number;
  label: string;
  sub: string;
  topColor: string;   // Tailwind border-t color e.g. 'border-t-blue-500'
  numColor: string;   // Tailwind text color for number
  bgTint: string;     // Subtle tinted background e.g. 'bg-blue-50/40'
  dotColor: string;   // Small status dot
}

function KPICard({ value, label, sub, topColor, numColor, bgTint, dotColor }: CardProps) {
  return (
    <div className={`rounded-xl border border-slate-200 border-t-[3px] ${topColor} ${bgTint} px-5 py-4 flex flex-col gap-2`}>
      <div className="flex items-center gap-1.5">
        <span className={`w-2 h-2 rounded-full ${dotColor} flex-shrink-0`} />
        <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider leading-none">{label}</p>
      </div>
      <p className={`text-4xl font-extrabold leading-none ${numColor}`}>{value}</p>
      <p className="text-[11px] text-slate-400 leading-none">{sub}</p>
    </div>
  );
}

export function KPICards() {
  const journeys = useAppStore((s) => s.journeys);

  const today     = new Date();
  const weekStart = startOfWeek(today, { weekStartsOn: 1 });
  const weekEnd   = endOfWeek(today, { weekStartsOn: 1 });
  const weekLabel = `${format(weekStart, 'MMM d')}–${format(weekEnd, 'd')}`;

  const cards: CardProps[] = [
    {
      value: journeys.filter((j) => j.status !== 'completed').length,
      label: 'Active',
      sub: `${journeys.length} total tracked`,
      topColor: 'border-t-blue-500',
      numColor: 'text-slate-800',
      bgTint: 'bg-white',
      dotColor: 'bg-blue-500',
    },
    {
      value: journeys.filter((j) => j.status === 'delayed').length,
      label: 'Delayed',
      sub: 'Needs monitoring',
      topColor: 'border-t-amber-400',
      numColor: 'text-amber-700',
      bgTint: 'bg-amber-50/30',
      dotColor: 'bg-amber-400',
    },
    {
      value: journeys.filter((j) => j.risk === 'high' || j.risk === 'critical').length,
      label: 'At Risk',
      sub: 'High or Critical',
      topColor: 'border-t-red-500',
      numColor: 'text-red-700',
      bgTint: 'bg-red-50/30',
      dotColor: 'bg-red-500',
    },
    {
      value: journeys.filter((j) => {
        const eta = new Date(j.overallETA);
        return eta >= weekStart && eta <= weekEnd;
      }).length,
      label: 'ETA This Week',
      sub: weekLabel,
      topColor: 'border-t-emerald-500',
      numColor: 'text-emerald-700',
      bgTint: 'bg-emerald-50/30',
      dotColor: 'bg-emerald-500',
    },
    {
      value: journeys.filter((j) => j.status === 'blocked').length,
      label: 'Blocked',
      sub: 'Action required',
      topColor: 'border-t-red-700',
      numColor: 'text-red-800',
      bgTint: 'bg-red-50/20',
      dotColor: 'bg-red-700',
    },
    {
      value: journeys.filter((j) => j.status === 'no-update').length,
      label: 'No Update',
      sub: 'Over 48 hours',
      topColor: 'border-t-slate-400',
      numColor: 'text-slate-600',
      bgTint: 'bg-white',
      dotColor: 'bg-slate-400',
    },
  ];

  return (
    <div className="grid grid-cols-6 gap-3">
      {cards.map((card) => (
        <KPICard key={card.label} {...card} />
      ))}
    </div>
  );
}
