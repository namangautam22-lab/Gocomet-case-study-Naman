'use client';

import { type ButtonHTMLAttributes, type ReactNode } from 'react';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline';
type Size = 'xs' | 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  icon?: ReactNode;
  iconRight?: ReactNode;
  loading?: boolean;
  children?: ReactNode;
}

const VARIANT_CLASSES: Record<Variant, string> = {
  primary:
    'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 border border-blue-600 shadow-sm',
  secondary:
    'bg-white text-slate-700 hover:bg-slate-50 active:bg-slate-100 border border-slate-300 shadow-sm',
  ghost:
    'bg-transparent text-slate-600 hover:bg-slate-100 active:bg-slate-200 border border-transparent',
  danger:
    'bg-red-600 text-white hover:bg-red-700 active:bg-red-800 border border-red-600 shadow-sm',
  outline:
    'bg-transparent text-blue-600 hover:bg-blue-50 active:bg-blue-100 border border-blue-300',
};

const SIZE_CLASSES: Record<Size, string> = {
  xs: 'text-xs px-2 py-1 rounded gap-1',
  sm: 'text-xs px-3 py-1.5 rounded gap-1.5',
  md: 'text-sm px-4 py-2 rounded-md gap-2',
  lg: 'text-sm px-5 py-2.5 rounded-md gap-2',
};

export function Button({
  variant = 'secondary',
  size = 'sm',
  icon,
  iconRight,
  loading,
  children,
  className = '',
  disabled,
  ...rest
}: ButtonProps) {
  return (
    <button
      {...rest}
      disabled={disabled || loading}
      className={`
        inline-flex items-center justify-center font-medium
        transition-colors duration-100 focus-visible:outline-none
        focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1
        disabled:opacity-50 disabled:cursor-not-allowed
        ${VARIANT_CLASSES[variant]} ${SIZE_CLASSES[size]} ${className}
      `}
    >
      {loading ? (
        <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        icon
      )}
      {children}
      {iconRight && !loading && iconRight}
    </button>
  );
}
