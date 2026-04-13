'use client';

import { type ReactNode, useEffect } from 'react';
import { X } from 'lucide-react';

interface DrawerProps {
  title: string;
  subtitle?: string;
  onClose: () => void;
  children: ReactNode;
  width?: 'sm' | 'md' | 'lg';
  footer?: ReactNode;
}

const WIDTH: Record<string, string> = {
  sm: 'w-96',
  md: 'w-[480px]',
  lg: 'w-[560px]',
};

export function Drawer({ title, subtitle, onClose, children, width = 'md', footer }: DrawerProps) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div
        className="flex-1 bg-slate-900/30 backdrop-blur-[1px] fade-in"
        onClick={onClose}
      />
      {/* Drawer panel */}
      <div className={`${WIDTH[width]} bg-white h-full shadow-modal flex flex-col drawer-enter`}>
        {/* Header */}
        <div className="flex items-start justify-between p-5 border-b border-slate-100 flex-shrink-0">
          <div>
            <h2 className="text-base font-semibold text-slate-900">{title}</h2>
            {subtitle && <p className="text-sm text-slate-500 mt-0.5">{subtitle}</p>}
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg p-1 transition-colors"
          >
            <X size={18} />
          </button>
        </div>
        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5">{children}</div>
        {/* Footer */}
        {footer && (
          <div className="border-t border-slate-100 p-4 flex justify-end gap-2 flex-shrink-0">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
