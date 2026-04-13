'use client';

import { format, startOfWeek, endOfWeek } from 'date-fns';
import { Package, Clock, AlertTriangle, CalendarDays, MinusCircle, Ban } from 'lucide-react';
import { useAppStore } from '@/store/appStore';

export function KPICards() {
  const journeys = useAppStore((s) => s.journeys);

  const today       = new Date();
  const weekStart   = startOfWeek(today, { weekStartsOn: 1 }); // Mon
  const weekEnd     = endOfWeek(today, { weekStartsOn: 1 });   // Sun
  const weekLabel   = `${format(weekStart, 'MMM d')} – ${format(weekEnd, 'd')}`;

  const active      = journeys.filter((j) => j.status !== 'completed').length;
  const delayed     = journeys.filter((j) => j.status === 'delayed').length;
  const atRisk      = journeys.filter((j) => j.risk === 'high' || j.risk === 'critical').length;
  const etaThisWeek = journeys.filter((j) => {
    const eta = new Date(j.overallETA);
    return eta >= weekStart && eta <= weekEnd;
  }).length;
  const noUpdate    = journeys.filter((j) => j.status === 'no-update').length;
  const blocked     = journeys.filter((j) => j.status === 'blocked').length;

  const cards = [
    { label: 'Active Journeys', value: active,      Icon: Package,      accent: 'border-l-blue-500',    num: 'text-slate-800',   sub: `${journeys.length} total`,  subCls: 'text-slate-400'  },
    { label: 'Delayed',         value: delayed,     Icon: Clock,        accent: 'border-l-amber-500',   num: 'text-amber-700',   sub: '↑ 1 from yesterday',        subCls: 'text-amber-500'  },
    { label: 'At Risk',         value: atRisk,      Icon: AlertTriangle,accent: 'border-l-red-500',     num: 'text-red-700',     sub: 'Requires attention',        subCls: 'text-red-400'    },
    { label: 'ETA This Week',   value: etaThisWeek, Icon: CalendarDays, accent: 'border-l-emerald-500', num: 'text-emerald-700', sub: weekLabel,                   subCls: 'text-emerald-500'},
    { label: 'No Update >48h',  value: noUpdate,    Icon: MinusCircle,  accent: 'border-l-slate-400',   num: 'text-slate-600',   sub: 'Follow up needed',          subCls: 'text-slate-400'  },
    { label: 'Blocked',         value: blocked,     Icon: Ban,          accent: 'border-l-red-700',     num: 'text-red-800',     sub: 'Immediate action',          subCls: 'text-red-500'    },
  ];

  return (
    <div className="grid grid-cols-3 lg:grid-cols-6 gap-3" data-tour="kpi-cards">
      {cards.map(({ label, value, Icon, accent, num, sub, subCls }) => (
        <div
          key={label}
          className={`bg-white rounded-xl border border-slate-200 border-l-4 ${accent} px-4 py-3.5 flex flex-col gap-2 shadow-card hover:shadow-panel transition-shadow`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-slate-500 leading-snug">{label}</span>
            <Icon size={13} className="text-slate-300" />
          </div>
          <div className={`text-3xl font-bold tracking-tight ${num}`}>{value}</div>
          <div className={`text-[10px] font-medium ${subCls}`}>{sub}</div>
        </div>
      ))}
    </div>
  );
}
