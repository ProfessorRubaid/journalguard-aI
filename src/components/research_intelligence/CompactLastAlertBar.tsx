/**
 * Compact Last Alert Bar for Research Intelligence Dashboard
 * Academic Concept & Direction: Dr. Rubaid Ashfaq
 * 
 * Strict UI Requirement:
 * - Maximum height approximately 60–80px on desktop, slim on mobile.
 * - Shows only the essential information:
 *   Alert type/icon, Short alert message, Date/time, "View" action.
 * - Clicking opens full Alerts panel.
 */

import React from 'react';
import { Bell, AlertTriangle, ShieldAlert, Info, ArrowRight } from 'lucide-react';
import { IntelligenceAlert } from '../../types';
import { getStoredIntelligenceAlerts } from '../../services/researchIntelligenceService';

interface CompactLastAlertBarProps {
  alert?: IntelligenceAlert | null;
  onOpenAlerts?: () => void;
  onViewAlerts?: () => void;
  onOpenJournalDossier?: (journalName: string) => void;
}

export const CompactLastAlertBar: React.FC<CompactLastAlertBarProps> = ({
  alert: propAlert,
  onOpenAlerts,
  onViewAlerts,
  onOpenJournalDossier,
}) => {
  const alerts = getStoredIntelligenceAlerts();
  const alert = propAlert !== undefined ? propAlert : (alerts.length > 0 ? alerts[0] : null);
  const handleOpenAlerts = onViewAlerts || onOpenAlerts || (() => {});

  if (!alert) return null;

  // Level indicators
  const isCritical = alert.type === 'critical';
  const isActionRequired = alert.type === 'action_required';

  const containerStyle = isCritical
    ? 'bg-rose-50/90 dark:bg-rose-950/60 border-rose-300 dark:border-rose-800 text-rose-950 dark:text-rose-200'
    : isActionRequired
    ? 'bg-amber-50/90 dark:bg-amber-950/60 border-amber-300 dark:border-amber-800 text-amber-950 dark:text-amber-200'
    : 'bg-blue-50/90 dark:bg-blue-950/60 border-blue-200 dark:border-blue-800 text-blue-950 dark:text-blue-200';

  const badgeStyle = isCritical
    ? 'bg-rose-600 text-white'
    : isActionRequired
    ? 'bg-amber-600 text-white'
    : 'bg-blue-600 text-white';

  const icon = isCritical ? (
    <ShieldAlert className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
  ) : isActionRequired ? (
    <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
  ) : (
    <Bell className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
  );

  return (
    <aside 
      aria-label="Latest ecosystem alert"
      className={`w-full rounded-2xl border px-3.5 py-2.5 sm:px-4 sm:py-3 shadow-2xs transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-2 max-h-[80px] overflow-hidden ${containerStyle}`}
    >
      {/* Alert Content Strip */}
      <div className="flex items-center gap-2.5 min-w-0">
        <div className="p-1.5 rounded-lg bg-white/80 dark:bg-slate-900/80 shadow-2xs shrink-0">
          {icon}
        </div>

        <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 min-w-0 text-xs">
          <span className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded-md uppercase tracking-wider ${badgeStyle}`}>
            {isCritical ? 'Critical Alert' : isActionRequired ? 'Action Required' : 'Last Alert'}
          </span>

          <span className="font-bold truncate max-w-[280px] sm:max-w-[420px] lg:max-w-[550px]">
            {alert.title}:
          </span>

          <span className="text-slate-600 dark:text-slate-300 truncate max-w-[260px] sm:max-w-[380px] lg:max-w-[480px]">
            {alert.message}
          </span>

          <span className="text-[11px] text-slate-400 dark:text-slate-500 font-mono hidden md:inline">
            · {alert.timestamp}
          </span>
        </div>
      </div>

      {/* Action Links */}
      <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
        {alert.journalName && onOpenJournalDossier && (
          <button
            type="button"
            onClick={() => onOpenJournalDossier(alert.journalName!)}
            className="text-[11px] font-bold underline hover:opacity-80 transition-opacity cursor-pointer"
          >
            Inspect Journal
          </button>
        )}

        <button
          type="button"
          onClick={handleOpenAlerts}
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold border border-slate-200/80 dark:border-slate-700 transition-colors cursor-pointer shadow-2xs whitespace-nowrap"
        >
          <span>View all alerts</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>
    </aside>
  );
};
