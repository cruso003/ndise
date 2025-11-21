import { Database, Shield, CheckCircle, Activity } from 'lucide-react';

interface NDISEBadgeProps {
  variant?: 'full' | 'compact' | 'minimal';
  showStatus?: boolean;
  className?: string;
}

export default function NDISEBadge({ variant = 'full', showStatus = true, className = '' }: NDISEBadgeProps) {
  if (variant === 'minimal') {
    return (
      <div className={`inline-flex items-center gap-1.5 px-2 py-1 bg-blue-50 border border-blue-200 rounded text-xs text-blue-700 ${className}`}>
        <Database className="w-3 h-3" />
        <span className="font-medium">NDISE</span>
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div className={`inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-300 rounded-lg ${className}`}>
        <Shield className="w-4 h-4 text-blue-600" />
        <div className="flex flex-col">
          <span className="text-xs font-bold text-blue-900">Powered by NDISE</span>
        </div>
        {showStatus && (
          <div className="flex items-center gap-1 ml-2 pl-2 border-l border-blue-300">
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs text-green-700 font-medium">Online</span>
          </div>
        )}
      </div>
    );
  }

  // Full variant
  return (
    <div className={`inline-flex items-center gap-3 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg shadow-lg ${className}`}>
      <div className="flex items-center gap-2">
        <div className="p-1.5 bg-white/20 rounded-lg">
          <Database className="w-5 h-5 text-white" />
        </div>
        <div className="flex flex-col">
          <span className="text-xs text-blue-100 uppercase tracking-wide">Powered by</span>
          <span className="text-sm font-bold text-white">NDISE</span>
        </div>
      </div>
      {showStatus && (
        <div className="flex items-center gap-2 pl-3 border-l border-white/30">
          <Activity className="w-4 h-4 text-green-300 animate-pulse" />
          <div className="flex flex-col">
            <span className="text-xs text-green-200">Live Connection</span>
            <span className="text-xs text-white/80">National Registry</span>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Tooltip variant for showing NDISE info on hover
 */
export function NDISETooltip({ children }: { children: React.ReactNode }) {
  return (
    <div className="group relative inline-block">
      {children}
      <div className="invisible group-hover:visible absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-slate-900 text-white text-xs rounded-lg shadow-xl z-50">
        <div className="flex items-start gap-2 mb-2">
          <Shield className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
          <div>
            <div className="font-bold mb-1">National Digital Identity System</div>
            <div className="text-slate-300">
              This data is sourced from NDISE, Liberia's centralized identity registry serving all government agencies.
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 pt-2 border-t border-slate-700">
          <CheckCircle className="w-3 h-3 text-green-400" />
          <span className="text-slate-400">Single source of truth • Real-time sync</span>
        </div>
        {/* Arrow */}
        <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-px">
          <div className="border-8 border-transparent border-t-slate-900"></div>
        </div>
      </div>
    </div>
  );
}

/**
 * Page header variant with NDISE branding
 */
export function NDISEPageHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">{title}</h1>
        {subtitle && <p className="text-slate-600 mt-1">{subtitle}</p>}
      </div>
      <NDISETooltip>
        <NDISEBadge variant="compact" />
      </NDISETooltip>
    </div>
  );
}
