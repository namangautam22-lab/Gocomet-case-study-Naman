'use client';

import { format } from 'date-fns';
import {
  ArrowUpDown, ExternalLink, MessageSquarePlus, UserCheck, Eye, ArrowRight, Info,
} from 'lucide-react';
import { useAppStore } from '@/store/appStore';
import {
  ModeChain, StatusBadge, RiskBadge, DelayPill, Avatar,
} from '@/components/ui/Badge';

function fmtDate(iso: string) {
  try { return format(new Date(iso), 'dd MMM'); } catch { return iso; }
}
function fmtDateTime(iso: string) {
  try { return format(new Date(iso), 'dd MMM, HH:mm'); } catch { return iso; }
}

const COLS = [
  { label: 'Journey',          sortable: false },
  { label: 'Customer',         sortable: false },
  { label: 'Route',            sortable: false },
  { label: 'Mode Chain',       sortable: false },
  { label: 'Active Leg',       sortable: false },
  { label: 'Milestone',        sortable: false },
  { label: 'ETA',              sortable: true  },
  { label: 'Delay',            sortable: true  },
  { label: 'Risk',             sortable: false },
  { label: 'Owner',            sortable: false },
  { label: 'Last Remark',      sortable: false },
  { label: 'Updated',          sortable: true  },
];

export function JourneyTable() {
  const { getFilteredJourneys, selectJourney, setShowAddRemarkDrawer } = useAppStore();
  const journeys = getFilteredJourneys();

  if (journeys.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-slate-400">
        <Info size={28} className="mb-2 text-slate-200" />
        <p className="text-sm font-medium text-slate-500">No journeys match your filters.</p>
        <p className="text-xs mt-1 text-slate-400">Try clearing filters or switching to a different view.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto" data-tour="journey-table">
      <table className="w-full border-collapse min-w-[1280px]">
        {/* ── Header ── */}
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50/70">
            {COLS.map(({ label, sortable }) => (
              <th
                key={label}
                className="px-3 py-2.5 text-left text-[10px] font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap"
              >
                {sortable ? (
                  <button className="flex items-center gap-1 hover:text-slate-700 transition-colors">
                    {label}<ArrowUpDown size={9} className="text-slate-300" />
                  </button>
                ) : label}
              </th>
            ))}
            <th className="w-28 px-3 py-2.5 text-[10px] font-semibold text-slate-400 uppercase tracking-wider text-right">
              Actions
            </th>
          </tr>
        </thead>

        {/* ── Body ── */}
        <tbody>
          {journeys.map((journey) => {
            const activeLeg = journey.legs[journey.activeLeg];
            return (
              <tr
                key={journey.id}
                className="journey-row cursor-pointer"
                onClick={() => selectJourney(journey.id)}
              >
                {/* Journey (ID + ref) */}
                <td className="px-3 py-3 whitespace-nowrap">
                  <div className="text-xs font-bold text-blue-600">{journey.id}</div>
                  <div className="text-[10px] text-slate-400 font-mono mt-0.5">{journey.shipmentRef}</div>
                </td>

                {/* Customer */}
                <td className="px-3 py-3 whitespace-nowrap max-w-[130px]">
                  <div className="text-xs font-semibold text-slate-800 truncate">{journey.customer}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">{journey.incoterm} · {journey.commodity.slice(0, 18)}{journey.commodity.length > 18 ? '…' : ''}</div>
                </td>

                {/* Route */}
                <td className="px-3 py-3 whitespace-nowrap">
                  <div className="flex items-center gap-1 text-[11px] text-slate-700">
                    <span className="font-medium max-w-[68px] truncate">{journey.origin.split(',')[0]}</span>
                    <ArrowRight size={9} className="text-slate-300 flex-shrink-0" />
                    <span className="font-medium max-w-[68px] truncate">{journey.destination.split(',')[0]}</span>
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    {journey.origin.split(', ').pop()} → {journey.destination.split(', ').pop()}
                  </div>
                </td>

                {/* Mode chain */}
                <td className="px-3 py-3 whitespace-nowrap" data-tour="mode-chain">
                  <ModeChain modes={journey.modeChain} activeIndex={journey.activeLeg} size="xs" />
                </td>

                {/* Active leg */}
                <td className="px-3 py-3 whitespace-nowrap">
                  {activeLeg && (
                    <div>
                      <div className="text-[11px] font-semibold text-slate-700 truncate max-w-[110px]">{activeLeg.carrier}</div>
                      <div className="mt-0.5">
                        <StatusBadge status={journey.status} size="sm" />
                      </div>
                    </div>
                  )}
                </td>

                {/* Current milestone */}
                <td className="px-3 py-3 max-w-[150px]">
                  <span className="text-[11px] text-slate-600 leading-snug line-clamp-2">{journey.currentMilestone}</span>
                </td>

                {/* ETA */}
                <td className="px-3 py-3 whitespace-nowrap">
                  <div className={`text-xs font-semibold ${journey.delayDays > 0 ? 'text-amber-700' : 'text-slate-800'}`}>
                    {fmtDate(journey.overallETA)}
                  </div>
                  {journey.delayDays > 0 && (
                    <div className="text-[10px] text-slate-400 line-through mt-0.5">{fmtDate(journey.originalETA)}</div>
                  )}
                </td>

                {/* Delay */}
                <td className="px-3 py-3 whitespace-nowrap">
                  <DelayPill days={journey.delayDays} />
                </td>

                {/* Risk */}
                <td className="px-3 py-3 whitespace-nowrap">
                  <RiskBadge risk={journey.risk} />
                </td>

                {/* Owner */}
                <td className="px-3 py-3 whitespace-nowrap">
                  <div className="flex items-center gap-1.5">
                    <Avatar name={journey.owner} size="xs" />
                    <span className="text-[11px] text-slate-600 font-medium max-w-[70px] truncate">
                      {journey.owner.split(' ')[0]}
                    </span>
                  </div>
                </td>

                {/* Last remark */}
                <td className="px-3 py-3 max-w-[180px]">
                  {journey.lastRemark ? (
                    <div>
                      <p className="text-[11px] text-slate-600 truncate leading-snug">{journey.lastRemark}</p>
                      <span className="text-[10px] text-slate-400 mt-0.5 block">
                        {journey.lastRemarkAt ? fmtDateTime(journey.lastRemarkAt) : ''}
                      </span>
                    </div>
                  ) : (
                    <span className="text-[10px] text-slate-300 italic">—</span>
                  )}
                </td>

                {/* Updated */}
                <td className="px-3 py-3 whitespace-nowrap">
                  <span className="text-[11px] text-slate-400">{fmtDateTime(journey.updatedAt)}</span>
                </td>

                {/* Row actions */}
                <td className="px-3 py-3">
                  <div className="row-actions flex items-center gap-0.5 justify-end">
                    <button
                      onClick={(e) => { e.stopPropagation(); selectJourney(journey.id); }}
                      className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                      title="Open journey"
                    >
                      <ExternalLink size={12} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        selectJourney(journey.id);
                        setShowAddRemarkDrawer(true);
                      }}
                      className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                      title="Add remark"
                    >
                      <MessageSquarePlus size={12} />
                    </button>
                    <button
                      onClick={(e) => e.stopPropagation()}
                      className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                      title="Assign owner"
                    >
                      <UserCheck size={12} />
                    </button>
                    <button
                      onClick={(e) => e.stopPropagation()}
                      className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                      title="Watch"
                    >
                      <Eye size={12} />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
