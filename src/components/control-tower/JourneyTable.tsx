'use client';

import { format } from 'date-fns';
import { ArrowUpDown, ExternalLink, MessageSquarePlus, ArrowRight, Info } from 'lucide-react';
import { useAppStore } from '@/store/appStore';
import { ModeChain, StatusBadge, RiskBadge, DelayPill, Avatar } from '@/components/ui/Badge';

function fmtDate(iso: string) {
  try { return format(new Date(iso), 'dd MMM'); } catch { return iso; }
}
function fmtDateTime(iso: string) {
  try { return format(new Date(iso), 'dd MMM, HH:mm'); } catch { return iso; }
}

const COLS: { label: string; sortable?: boolean }[] = [
  { label: 'Journey' },
  { label: 'Customer' },
  { label: 'Route' },
  { label: 'Mode Chain' },
  { label: 'Active Leg' },
  { label: 'Milestone' },
  { label: 'ETA', sortable: true },
  { label: 'Delay', sortable: true },
  { label: 'Risk' },
  { label: 'Owner' },
  { label: 'Last Remark' },
  { label: 'Updated', sortable: true },
];

export function JourneyTable() {
  const { getFilteredJourneys, selectJourney, setShowAddRemarkDrawer } = useAppStore();
  const journeys = getFilteredJourneys();

  if (journeys.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-400 bg-white">
        <Info size={24} className="mb-2 text-slate-200" />
        <p className="text-sm font-medium text-slate-500">No journeys match your filters.</p>
        <p className="text-xs mt-1 text-slate-400">Try clearing filters or switching to a different view.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto bg-white" data-tour="journey-table">
      <table className="w-full border-collapse min-w-[1240px]">
        {/* Header */}
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50">
            {COLS.map(({ label, sortable }) => (
              <th
                key={label}
                className="px-3 py-2 text-left text-[10px] font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap"
              >
                {sortable ? (
                  <button className="flex items-center gap-1 hover:text-slate-700 transition-colors">
                    {label}<ArrowUpDown size={9} className="text-slate-300" />
                  </button>
                ) : label}
              </th>
            ))}
            <th className="w-16 px-3 py-2" />
          </tr>
        </thead>

        <tbody>
          {journeys.map((journey) => {
            const activeLeg = journey.legs[journey.activeLeg];
            return (
              <tr
                key={journey.id}
                className="journey-row cursor-pointer"
                onClick={() => selectJourney(journey.id)}
              >
                {/* Journey */}
                <td className="px-3 py-2.5 whitespace-nowrap">
                  <div className="text-[11px] font-bold text-blue-600">{journey.id}</div>
                  <div className="text-[10px] text-slate-400 font-mono mt-0.5">{journey.shipmentRef}</div>
                </td>

                {/* Customer */}
                <td className="px-3 py-2.5 max-w-[130px]">
                  <div className="text-[11px] font-semibold text-slate-800 truncate">{journey.customer}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">{journey.incoterm} · {journey.commodity.slice(0, 16)}{journey.commodity.length > 16 ? '…' : ''}</div>
                </td>

                {/* Route */}
                <td className="px-3 py-2.5 whitespace-nowrap">
                  <div className="flex items-center gap-1 text-[11px]">
                    <span className="font-medium text-slate-700 max-w-[60px] truncate">{journey.origin.split(',')[0]}</span>
                    <ArrowRight size={9} className="text-slate-300 flex-shrink-0" />
                    <span className="font-medium text-slate-700 max-w-[60px] truncate">{journey.destination.split(',')[0]}</span>
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    {journey.origin.split(', ').pop()} → {journey.destination.split(', ').pop()}
                  </div>
                </td>

                {/* Mode chain */}
                <td className="px-3 py-2.5 whitespace-nowrap" data-tour="mode-chain">
                  <ModeChain modes={journey.modeChain} activeIndex={journey.activeLeg} size="xs" />
                </td>

                {/* Active leg */}
                <td className="px-3 py-2.5 whitespace-nowrap">
                  {activeLeg && (
                    <div>
                      <div className="text-[11px] font-semibold text-slate-700 truncate max-w-[100px]">
                        {activeLeg.carrier}
                      </div>
                      <div className="mt-0.5">
                        <StatusBadge status={journey.status} size="sm" />
                      </div>
                    </div>
                  )}
                </td>

                {/* Milestone */}
                <td className="px-3 py-2.5 max-w-[140px]">
                  <span className="text-[11px] text-slate-600 leading-snug line-clamp-2">
                    {journey.currentMilestone}
                  </span>
                </td>

                {/* ETA */}
                <td className="px-3 py-2.5 whitespace-nowrap">
                  <div className={`text-[12px] font-bold ${journey.delayDays > 0 ? 'text-amber-700' : 'text-slate-800'}`}>
                    {fmtDate(journey.overallETA)}
                  </div>
                  {journey.delayDays > 0 && (
                    <div className="text-[10px] text-slate-400 line-through mt-0.5">{fmtDate(journey.originalETA)}</div>
                  )}
                </td>

                {/* Delay */}
                <td className="px-3 py-2.5 whitespace-nowrap">
                  <DelayPill days={journey.delayDays} />
                </td>

                {/* Risk */}
                <td className="px-3 py-2.5 whitespace-nowrap">
                  <RiskBadge risk={journey.risk} />
                </td>

                {/* Owner */}
                <td className="px-3 py-2.5 whitespace-nowrap">
                  <div className="flex items-center gap-1.5">
                    <Avatar name={journey.owner} size="xs" />
                    <span className="text-[11px] text-slate-600 font-medium max-w-[65px] truncate">
                      {journey.owner.split(' ')[0]}
                    </span>
                  </div>
                </td>

                {/* Last remark */}
                <td className="px-3 py-2.5 max-w-[160px]">
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
                <td className="px-3 py-2.5 whitespace-nowrap">
                  <span className="text-[10px] text-slate-400">{fmtDateTime(journey.updatedAt)}</span>
                </td>

                {/* Row actions */}
                <td className="px-2 py-2.5">
                  <div className="row-actions flex items-center gap-0.5 justify-end">
                    <button
                      onClick={(e) => { e.stopPropagation(); selectJourney(journey.id); }}
                      className="p-1 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
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
                      className="p-1 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                      title="Add remark"
                    >
                      <MessageSquarePlus size={12} />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Footer count */}
      <div className="border-t border-slate-100 px-4 py-2 flex items-center justify-between bg-white sticky bottom-0">
        <span className="text-[10px] text-slate-400">
          Showing {journeys.length} journey{journeys.length !== 1 ? 's' : ''}
        </span>
        <span className="text-[10px] text-slate-300">GoTrack · Demo data</span>
      </div>
    </div>
  );
}
