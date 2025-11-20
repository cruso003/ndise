import { ArrowUpRight, ArrowDownRight, type LucideIcon } from 'lucide-react';
import clsx from 'clsx';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: LucideIcon;
  trend?: {
    value: string | number;
    direction: 'up' | 'down';
    label?: string;
  };
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  className?: string;
}

export default function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  variant = 'default',
  className,
}: StatCardProps) {
  const variantStyles = {
    default: 'bg-[var(--color-surface)] border-[var(--color-border)]',
    success: 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800',
    warning: 'bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:border-amber-800',
    error: 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800',
    info: 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800',
  };

  const iconVariantStyles = {
    default: 'bg-slate-100 text-[var(--color-primary)]',
    success: 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300',
    warning: 'bg-amber-100 text-amber-600 dark:bg-amber-900 dark:text-amber-300',
    error: 'bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300',
    info: 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300',
  };

  return (
    <div
      className={clsx(
        'p-6 border rounded-xl shadow-sm',
        variantStyles[variant],
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-[var(--color-text-secondary)]">{title}</p>
          <h3 className="text-2xl font-bold text-[var(--color-text)] mt-2">{value}</h3>
          {subtitle && (
            <p className="text-sm text-[var(--color-text-secondary)] mt-1">{subtitle}</p>
          )}
        </div>
        {Icon && (
          <div className={clsx('p-3 rounded-lg', iconVariantStyles[variant])}>
            <Icon size={24} />
          </div>
        )}
      </div>

      {trend && (
        <div className="mt-4 flex items-center gap-2">
          {trend.direction === 'up' ? (
            <ArrowUpRight className="text-green-500" size={16} />
          ) : (
            <ArrowDownRight className="text-red-500" size={16} />
          )}
          <span
            className={clsx(
              'text-sm font-medium',
              trend.direction === 'up' ? 'text-green-600' : 'text-red-600'
            )}
          >
            {trend.value}
          </span>
          {trend.label && (
            <span className="text-sm text-[var(--color-text-secondary)]">{trend.label}</span>
          )}
        </div>
      )}
    </div>
  );
}
