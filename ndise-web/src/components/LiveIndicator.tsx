import { Activity, Wifi, WifiOff, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface LiveIndicatorProps {
  isLive: boolean;
  lastUpdate?: Date;
  isOnline?: boolean;
  className?: string;
  showTimestamp?: boolean;
  showConnection?: boolean;
}

export default function LiveIndicator({
  isLive,
  lastUpdate,
  isOnline = true,
  className = '',
  showTimestamp = true,
  showConnection = true,
}: LiveIndicatorProps) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Live Badge */}
      {isLive && (
        <div className="flex items-center gap-2 px-3 py-1.5 bg-red-50 border border-red-200 rounded-full">
          <div className="relative">
            <Activity className="w-4 h-4 text-red-600" />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </span>
          </div>
          <span className="text-xs font-bold text-red-700 uppercase tracking-wide">Live</span>
        </div>
      )}

      {/* Connection Status */}
      {showConnection && (
        <div
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
            isOnline
              ? 'bg-green-50 text-green-700 border border-green-200'
              : 'bg-red-50 text-red-700 border border-red-200'
          }`}
        >
          {isOnline ? (
            <>
              <Wifi className="w-3.5 h-3.5" />
              <span>Connected</span>
            </>
          ) : (
            <>
              <WifiOff className="w-3.5 h-3.5" />
              <span>Disconnected</span>
            </>
          )}
        </div>
      )}

      {/* Last Update Timestamp */}
      {showTimestamp && lastUpdate && (
        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-50 rounded-full text-xs text-slate-600 border border-slate-200">
          <Clock className="w-3.5 h-3.5" />
          <span>Updated {formatDistanceToNow(lastUpdate, { addSuffix: true })}</span>
        </div>
      )}

      {/* Pause Indicator */}
      {!isLive && (
        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 rounded-full text-xs font-medium text-slate-600 border border-slate-300">
          <div className="w-2 h-2 bg-slate-400 rounded-full"></div>
          <span>Paused</span>
        </div>
      )}
    </div>
  );
}
