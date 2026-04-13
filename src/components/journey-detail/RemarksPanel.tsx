'use client';

import { format, formatDistanceToNow } from 'date-fns';
import {
  MessageSquare, AlertOctagon, Clock, Users, Phone, Wrench, CheckCircle2,
  Eye, EyeOff, MessageSquarePlus, ArrowRight,
} from 'lucide-react';
import { useAppStore } from '@/store/appStore';
import { Avatar, PriorityBadge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import type { Journey, RemarkType } from '@/types';

const REMARK_CONFIG: Record<RemarkType, {
  label: string; Icon: React.ElementType;
  color: string; bg: string; border: string; accentClass: string;
}> = {
  general:          { label: 'General Update',       Icon: MessageSquare,  color: 'text-blue-600',    bg: 'bg-blue-50/60',    border: 'border-slate-200', accentClass: 'remark-general'          },
  'delay-reason':   { label: 'Delay Reason',         Icon: Clock,          color: 'text-amber-700',   bg: 'bg-amber-50/60',   border: 'border-amber-200', accentClass: 'remark-delay-reason'     },
  'internal-handoff':{ label: 'Internal Handoff',    Icon: Users,          color: 'text-slate-600',   bg: 'bg-slate-50',      border: 'border-slate-200', accentClass: 'remark-internal-handoff' },
  'customer-comm':  { label: 'Customer Communication',Icon: Phone,          color: 'text-violet-700',  bg: 'bg-violet-50/60',  border: 'border-violet-200',accentClass: 'remark-customer-comm'    },
  'action-required':{ label: 'Action Required',      Icon: Wrench,         color: 'text-orange-700',  bg: 'bg-orange-50/60',  border: 'border-orange-200',accentClass: 'remark-action-required'  },
  blocker:          { label: 'Blocker',               Icon: AlertOctagon,   color: 'text-red-700',     bg: 'bg-red-50',        border: 'border-red-300',   accentClass: 'remark-blocker'          },
  resolution:       { label: 'Resolution',            Icon: CheckCircle2,   color: 'text-emerald-700', bg: 'bg-emerald-50/60', border: 'border-emerald-200',accentClass:'remark-resolution'        },
};

function relTime(iso: string) {
  try { return formatDistanceToNow(new Date(iso), { addSuffix: true }); } catch { return iso; }
}

export function RemarksPanel({ journey }: { journey: Journey }) {
  const setShowAddRemarkDrawer = useAppStore((s) => s.setShowAddRemarkDrawer);
  const sorted = [...journey.remarks].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-card" data-tour="remarks">
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
        <div>
          <h3 className="text-sm font-bold text-slate-800">Remarks</h3>
          <p className="text-[11px] text-slate-400 mt-0.5">
            {journey.remarks.length} remark{journey.remarks.length !== 1 ? 's' : ''} · thread
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          icon={<MessageSquarePlus size={12} />}
          onClick={() => setShowAddRemarkDrawer(true)}
        >
          Add Remark
        </Button>
      </div>

      {journey.remarks.length === 0 ? (
        <div className="text-center py-10 text-slate-400 px-5">
          <MessageSquare size={24} className="mx-auto mb-2 text-slate-200" />
          <p className="text-sm text-slate-500 font-medium">No remarks yet</p>
          <p className="text-xs mt-1">Capture delay reasons, customer communications, and action items here.</p>
        </div>
      ) : (
        <div className="px-5 py-4 space-y-2.5">
          {sorted.map((remark, idx) => {
            const cfg = REMARK_CONFIG[remark.noteType];
            const isBlocker = remark.noteType === 'blocker';
            const isNew = idx === 0; // most recent always highlighted subtly

            return (
              <div
                key={remark.id}
                className={`rounded-lg border ${cfg.border} ${cfg.bg} ${cfg.accentClass} overflow-hidden ${isNew && isBlocker ? 'ring-1 ring-red-300' : ''}`}
              >
                <div className="px-4 py-3">
                  {/* Header row */}
                  <div className="flex items-center gap-2 flex-wrap mb-2">
                    <span className={`inline-flex items-center gap-1 text-[11px] font-bold ${cfg.color}`}>
                      <cfg.Icon size={11} strokeWidth={2.5} />
                      {cfg.label}
                    </span>
                    <PriorityBadge priority={remark.priority} />

                    {/* Visibility */}
                    <span className={`inline-flex items-center gap-0.5 text-[10px] font-medium px-1.5 py-0.5 rounded-full border ${
                      remark.visibility === 'external'
                        ? 'bg-violet-50 text-violet-700 border-violet-200'
                        : 'bg-slate-100 text-slate-500 border-slate-200'
                    }`}>
                      {remark.visibility === 'external'
                        ? <><Eye size={9} /> External</>
                        : <><EyeOff size={9} /> Internal</>
                      }
                    </span>

                    {/* Applies to leg */}
                    {remark.appliesTo && remark.appliesTo !== 'journey' && (
                      <span className="text-[10px] font-mono text-slate-400 bg-white/80 px-1.5 py-0.5 rounded border border-slate-200">
                        {remark.appliesTo}
                      </span>
                    )}

                    {/* Blocker warning tag */}
                    {isBlocker && (
                      <span className="ml-auto text-[10px] font-bold text-red-700 bg-red-100 px-2 py-0.5 rounded-full border border-red-200 flex items-center gap-1">
                        <AlertOctagon size={9} /> Risk → Critical
                      </span>
                    )}
                  </div>

                  {/* Body text */}
                  <p className="text-[13px] text-slate-800 leading-relaxed">{remark.text}</p>

                  {/* Footer */}
                  <div className="flex items-center gap-2.5 mt-2.5 pt-2 border-t border-black/5">
                    <Avatar name={remark.author} size="xs" />
                    <span className="text-[11px] font-semibold text-slate-600">{remark.author}</span>
                    <span className="text-slate-200">·</span>
                    <span className="text-[11px] text-slate-400">{relTime(remark.createdAt)}</span>

                    {remark.assignee && (
                      <>
                        <span className="text-slate-200">·</span>
                        <span className="inline-flex items-center gap-0.5 text-[11px] text-slate-500">
                          <ArrowRight size={9} /> {remark.assignee}
                        </span>
                      </>
                    )}
                    {remark.dueDate && (
                      <>
                        <span className="text-slate-200">·</span>
                        <span className="text-[11px] text-orange-600 font-semibold">
                          Due {format(new Date(remark.dueDate), 'dd MMM')}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
