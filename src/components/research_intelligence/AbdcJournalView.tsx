/**
 * ShodhSetu - Dedicated ABDC Journal Quality List View
 * Academic Concept & Direction: Dr. Rubaid Ashfaq
 * 
 * Authoritative ABDC (Australian Business Deans Council) ratings:
 * - Tiers: A*, A, B, C
 * - FoR Codes (Fields of Research): 1503, 1501, 1402, 0806, etc.
 * - Expert disciplinary panels review notes
 */

import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Award, 
  CheckCircle2, 
  Building, 
  BookOpen, 
  Layers
} from 'lucide-react';
import { IntelligenceJournal, AbdcRating } from '../../types';
import { getStoredIntelligenceJournals } from '../../services/researchIntelligenceService';

interface AbdcJournalViewProps {
  onOpenDossier: (journal: IntelligenceJournal) => void;
  onVerifyJournal: (query: string) => void;
}

export const AbdcJournalView: React.FC<AbdcJournalViewProps> = ({
  onOpenDossier,
  onVerifyJournal,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedRating, setSelectedRating] = useState<string>('all');
  const [selectedPanel, setSelectedPanel] = useState<string>('all');

  const allJournals = useMemo(() => getStoredIntelligenceJournals(), []);

  const abdcJournals = useMemo(() => {
    return allJournals.filter(j => {
      if (!j.abdcRating || j.abdcRating === 'None') return false;

      if (selectedRating !== 'all' && j.abdcRating !== selectedRating) {
        return false;
      }

      if (selectedPanel !== 'all' && j.abdcPanel && !j.abdcPanel.toLowerCase().includes(selectedPanel.toLowerCase())) {
        return false;
      }

      if (searchQuery.trim()) {
        const text = [j.title, j.publisher, j.issn, j.abdcPanel || '', ...j.subjectAreas].join(' ').toLowerCase();
        if (!text.includes(searchQuery.toLowerCase().trim())) return false;
      }

      return true;
    });
  }, [allJournals, selectedRating, selectedPanel, searchQuery]);

  return (
    <div className="space-y-6">
      {/* ABDC Header */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-amber-700 via-yellow-800 to-slate-900 text-white relative overflow-hidden shadow-sm">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-semibold mb-2 backdrop-blur-xs">
            <Award className="w-3.5 h-3.5" />
            <span>Australian Business Deans Council (ABDC)</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight">
            ABDC Journal Quality List
          </h2>
          <p className="text-xs sm:text-sm text-amber-100/90 mt-1 leading-relaxed">
            Examine verified ABDC quality tiers (A*, A, B, C) across Business, Management, Economics, Marketing, and Interdisciplinary Information Systems.
          </p>
        </div>
      </div>

      {/* ABDC Tier Legend Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-amber-300 dark:border-amber-800 shadow-2xs">
          <div className="text-base font-extrabold text-amber-600 dark:text-amber-400">Tier A*</div>
          <div className="text-xs font-medium text-slate-700 dark:text-slate-300 mt-0.5">Premier Journals</div>
          <div className="text-[11px] text-slate-400 mt-1">Top ~5-7% of journals worldwide</div>
        </div>

        <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
          <div className="text-base font-extrabold text-blue-600 dark:text-blue-400">Tier A</div>
          <div className="text-xs font-medium text-slate-700 dark:text-slate-300 mt-0.5">High Quality</div>
          <div className="text-[11px] text-slate-400 mt-1">Next 15-25% leading field outlets</div>
        </div>

        <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
          <div className="text-base font-extrabold text-indigo-600 dark:text-indigo-400">Tier B</div>
          <div className="text-xs font-medium text-slate-700 dark:text-slate-300 mt-0.5">Solid Standard</div>
          <div className="text-[11px] text-slate-400 mt-1">Next 35-40% credible outlets</div>
        </div>

        <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
          <div className="text-base font-extrabold text-slate-600 dark:text-slate-400">Tier C</div>
          <div className="text-xs font-medium text-slate-700 dark:text-slate-300 mt-0.5">Recognized Baseline</div>
          <div className="text-[11px] text-slate-400 mt-1">Peer-reviewed regional/specialist</div>
        </div>
      </div>

      {/* Filters */}
      <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-[11px] font-medium text-slate-500 dark:text-slate-400 mb-1">Search ABDC Titles</label>
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Title, ISSN, panel..."
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-500 dark:text-slate-400 mb-1">ABDC Rating</label>
            <select
              value={selectedRating}
              onChange={(e) => setSelectedRating(e.target.value)}
              className="w-full text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 py-1.5 px-2"
            >
              <option value="all">All ABDC Tiers (A*, A, B, C)</option>
              <option value="A*">Tier A* Only</option>
              <option value="A">Tier A Only</option>
              <option value="B">Tier B Only</option>
              <option value="C">Tier C Only</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-500 dark:text-slate-400 mb-1">Panel &amp; FoR Discipline</label>
            <select
              value={selectedPanel}
              onChange={(e) => setSelectedPanel(e.target.value)}
              className="w-full text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 py-1.5 px-2"
            >
              <option value="all">All Disciplinary Panels</option>
              <option value="Marketing">Marketing (1505)</option>
              <option value="Management">Management (1503)</option>
              <option value="Economics">Applied Economics (1402)</option>
              <option value="Information">Information Systems (0806)</option>
            </select>
          </div>
        </div>
      </div>

      {/* ABDC Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {abdcJournals.map((j) => (
          <div 
            key={j.id}
            className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-amber-300 dark:hover:border-amber-700 transition-all shadow-2xs flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
                  ABDC Tier {j.abdcRating}
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  Panel: <span className="font-semibold text-slate-700 dark:text-slate-300">{j.abdcPanel}</span>
                </span>
              </div>

              <h3 
                onClick={() => onOpenDossier(j)}
                className="text-base font-bold text-slate-900 dark:text-white hover:text-amber-600 dark:hover:text-amber-400 cursor-pointer transition-colors"
              >
                {j.title}
              </h3>

              <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-2">
                <span className="flex items-center gap-1">
                  <Building className="w-3 h-3" />
                  {j.publisher}
                </span>
                <span>·</span>
                <span className="font-mono">ISSN: {j.issn}</span>
              </div>

              {/* ABDC Detail Box */}
              <div className="mt-3 p-3 rounded-xl bg-amber-50/40 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/30 text-xs space-y-1">
                <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                  <span>Field of Research (FoR):</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white">{j.abdcForCode || '1503 / 1505'}</span>
                </div>
                <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                  <span>Review Panel:</span>
                  <span className="font-medium text-amber-700 dark:text-amber-300">{j.abdcPanel}</span>
                </div>
                <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                  <span>Cross-Indexed:</span>
                  <span className="text-slate-700 dark:text-slate-300 font-medium">
                    {j.scopusIndexed ? `Scopus ${j.scopusQuartile}` : ''} {j.wosIndexed ? `· WoS ${j.wosCoreCollection}` : ''}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between gap-2 mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
              <button
                onClick={() => onOpenDossier(j)}
                className="font-semibold text-amber-600 dark:text-amber-400 hover:underline"
              >
                View ABDC Dossier &rarr;
              </button>
              <button
                onClick={() => onVerifyJournal(j.issn || j.title)}
                className="px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-medium transition-colors"
              >
                Forensic Check
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
