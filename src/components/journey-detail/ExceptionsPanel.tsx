'use client';

import { formatDistanceToNow } from 'date-fns';
import { AlertOctagon, AlertTriangle, CheckCircle2, ChevronRight } from 'lucide-react';
import type { Journey } from '@/types';

function relTime(iso: string) {
  try { return formatDistanceToNow(new Date(iso), { addSuffix: true }); } catch { return iso; }
}

export function ExceptionsPanel({ journey }: { journey: Journey }) {
  const open     = journey.exceptions.filter((e) => e.status === 'open');
  const resolved = journey.exceptions.filter((e) => e.status === 'resolved');

  if (journey.exceptions.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 shadow-card px-5 py-4">
        <h3 className="text-sm font-bold text-slate-800 mb-3">Exceptions</h3>
        <div className="flex items-center gap-2 text-sm text-emerald-600 py-2">
          <CheckCircle2 size={15} />
          No exceptions — shipment is clear
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-card">
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
        <div>
          <h3 className="text-sm font-bold text-slate-800">Exceptions</h3>
          <p className="text-[11px] text-slate-400 mt-0.5">{open.length} open · {resolved.length} resolved</p>
        </div>
        {open.length > 0 && (
          <span className="text-xs font-bold text-red-700 bg-red-50 border border-red-200 px-2.5 py-0.5 rounded-full">
            {open.length} needs action
          </span>
        )}
      </div>

      <div className="px-5 py-4 space-y-3">
        {open.map((ex) => (
          <div
            key={ex.id}
            className={`rounded-lg border bg-white overflow-hidden ${
              ex.severity === 'critical'
                ? 'exception-critical border-red-200'
                : 'exception-warning border-amber-200'
            }`}
          >
            <div className="px-4 py-3">
              <div className="flex items-start gap-2.5">
                {ex.severity === 'critical' ? (
                  <AlertOctagon size={14} className="text-red-500 flex-shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle size={14} className="text-amber-500 flex-shrink-0 mt-0.5" />
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className={`text-xs font-bold ${ex.severity === 'critical' ? 'text-red-800' : 'text-amber-800'}`}>
                      {ex.type}
                    </span>
                    <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${
                      ex.severity === 'critical' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {ex.severity === 'critical' ? 'Critical' : 'Warning'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed">{ex.description}</p>

                  <div className="flex items-center gap-3 mt-2.5 pt-2 border-t border-slate-100">
                    <span className="text-[10px] text-slate-400">{relTime(ex.createdAt)}</span>
                    {ex.assignee && (
                      <>
                        <span className="text-slate-200">·</span>
                        <span className="text-[10px] text-slate-500">{ex.assignee}</span>
                      </>
                    )}
                    {ex.legId && (
                      <>
                        <span className="text-slate-200">·</span>
                        <span className="text-[10px] font-mono text-slate-400">{ex.legId}</span>
                      </>
                    )}
                    <button className="ml-auto text-[10px] font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-0.5 transition-colors">
                      Resolve <ChevronRight size={10} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {resolved.map((ex) => (
          <div key={ex.id} className="flex items-center gap-2 px-4 py-2.5 bg-slate-50 rounded-lg border border-slate-100 opacity-60">
            <CheckCircle2 size={12} className="text-emerald-500 flex-shrink-0" />
            <span className="text-xs text-slate-600 font-medium flex-1">{ex.type}</span>
            <span className="text-[10px] font-semibold text-emerald-600">Resolved</span>
          </div>
        ))}
      </div>
    </div>
  );
}
