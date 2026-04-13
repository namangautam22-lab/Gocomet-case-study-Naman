'use client';

import { format, formatDistanceToNow } from 'date-fns';
import {
  MessageSquare, Milestone, RefreshCw, Clock, AlertOctagon, UserCheck, GitMerge, ChevronRight, X,
} from 'lucide-react';
import { useAppStore } from '@/store/appStore';

const TYPE_CONFIG = {
  remark: { Icon: MessageSquare, color: 'text-blue-500', bg: 'bg-blue-50' },
  milestone: { Icon: Milestone, color: 'text-violet-500', bg: 'bg-violet-50' },
  status: { Icon: RefreshCw, color: 'text-emerald-500', bg: 'bg-emerald-50' },
  eta: { Icon: Clock, color: 'text-amber-500', bg: 'bg-amber-50' },
  exception: { Icon: AlertOctagon, color: 'text-red-500', bg: 'bg-red-50' },
  owner: { Icon: UserCheck, color: 'text-slate-500', bg: 'bg-slate-100' },
  merge: { Icon: GitMerge, color: 'text-teal-500', bg: 'bg-teal-50' },
};

function relTime(iso: string) {
  try {
    return formatDistanceToNow(new Date(iso), { addSuffix: true });
  } catch {
    return iso;
  }
}

interface WhatChangedPanelProps {
  onClose?: () => void;
}

export function WhatChangedPanel({ onClose }: WhatChangedPanelProps) {
  const { whatChanged, selectJourney } = useAppStore();

  return (
    <div className="flex flex-col h-full" data-tour="what-changed">
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 flex-shrink-0">
        <div>
          <h3 className="text-sm font-semibold text-slate-800">What Changed</h3>
          <p className="text-[11px] text-slate-400 mt-0.5">Recent activity across all journeys</p>
        </div>
        {onClose && (
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded p-1 transition-colors">
            <X size={14} />
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto divide-y divide-slate-50">
        {whatChanged.slice(0, 15).map((item) => {
          const { Icon, color, bg } = TYPE_CONFIG[item.type] ?? TYPE_CONFIG.remark;
          return (
            <button
              key={item.id}
              onClick={() => selectJourney(item.journeyId)}
              className="w-full text-left px-4 py-3 hover:bg-slate-50 transition-colors group"
            >
              <div className="flex items-start gap-2.5">
                <span className={`w-6 h-6 rounded-lg ${bg} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                  <Icon size={12} className={color} />
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span className="text-[11px] font-semibold text-blue-600">{item.journeyId}</span>
                    <span className="text-[10px] text-slate-400 font-mono">{item.journeyRef}</span>
                  </div>
                  <p className="text-xs text-slate-700 leading-snug line-clamp-2">{item.description}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] text-slate-400">{item.by}</span>
                    <span className="text-[10px] text-slate-300">·</span>
                    <span className="text-[10px] text-slate-400">{relTime(item.at)}</span>
                  </div>
                </div>
                <ChevronRight size={12} className="text-slate-300 group-hover:text-blue-400 flex-shrink-0 mt-1 transition-colors" />
              </div>
            </button>
          );
        })}
      </div>

      <div className="border-t border-slate-100 px-4 py-2 flex-shrink-0">
        <button className="text-xs text-blue-600 hover:text-blue-700 font-medium transition-colors">
          View full activity log →
        </button>
      </div>
    </div>
  );
}
