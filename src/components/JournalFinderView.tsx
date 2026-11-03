/**
 * JOURNALGUARD AI - Find Journals For My Research
 * Academic Concept & Direction: Dr. Rubaid Ashfaq
 * 
 * Strict academic integrity: Never invents fake quartiles or metrics.
 */

import React, { useState } from 'react';
import { 
  Compass, 
  Search, 
  Filter, 
  Sparkles, 
  ExternalLink, 
  CheckCircle2, 
  RotateCw, 
  ShieldCheck, 
  Layers,
  ArrowRight
} from 'lucide-react';
import { RecommendedJournalItem, ResearcherProfile } from '../types';
import { findJournalsForResearch, JournalSearchFilter } from '../services/recommenderEngine';

interface JournalFinderViewProps {
  profile: ResearcherProfile;
  onVerifyJournal: (query: string) => void;
}

export const JournalFinderView: React.FC<JournalFinderViewProps> = ({
  profile,
  onVerifyJournal,
}) => {
  const [topic, setTopic] = useState('Artificial Intelligence and Data Science');
  const [keywords, setKeywords] = useState(
    profile.keywords && profile.keywords.length > 0 
      ? profile.keywords.slice(0, 4).join(', ') 
      : 'Machine Learning, Information Systems, Research Ethics'
  );
  const [researchMethod, setResearchMethod] = useState('Mixed Methods / Empirical Quantitative');
  const [desiredIndex, setDesiredIndex] = useState<JournalSearchFilter['desiredIndex']>('all');
  const [preferredQuartile, setPreferredQuartile] = useState<JournalSearchFilter['preferredQuartile']>('all');
  const [budgetTier, setBudgetTier] = useState<JournalSearchFilter['budgetTier']>('all');
  
  const [results, setResults] = useState<RecommendedJournalItem[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSearching(true);
    
    // Simulate brief asynchronous search query
    setTimeout(async () => {
      const matched = await findJournalsForResearch({
        topic,
        keywords,
        researchMethod,
        desiredIndex,
        preferredQuartile,
        budgetTier,
      }, profile);
      setResults(matched);
      setHasSearched(true);
      setIsSearching(false);
    }, 400);
  };

  // Pre-run search on mount with default research topics
  React.useEffect(() => {
    handleSearch();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-20">
      
      {/* Title */}
      <div className="space-y-1">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Curated Indexing Intelligence</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Find Journals for My Research
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-3xl">
          Match your manuscript scope, preferred indexing (Scopus, WoS, DOAJ), quartile targets, and publication budget.
        </p>
      </div>

      {/* Filter and Criteria Card */}
      <form onSubmit={handleSearch} className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Field 1: Topic */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Research Topic
            </label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. AI in Media, Algorithmic Newsrooms..."
              className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-slate-50/50"
            />
          </div>

          {/* Field 2: Keywords */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Keywords (Comma-separated)
            </label>
            <input
              type="text"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              placeholder="e.g. Generative AI, Advertising, Digital Media..."
              className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-slate-50/50"
            />
          </div>

          {/* Field 3: Research Method */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Research Method
            </label>
            <input
              type="text"
              value={researchMethod}
              onChange={(e) => setResearchMethod(e.target.value)}
              placeholder="e.g. Empirical Survey, Content Analysis..."
              className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-slate-50/50"
            />
          </div>

        </div>

        {/* 3 Dropdown constraints */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-slate-100">
          
          {/* Desired Index */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-600">
              Desired Indexing Database
            </label>
            <select
              value={desiredIndex}
              onChange={(e) => setDesiredIndex(e.target.value as any)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-purple-500 font-medium"
            >
              <option value="all">All Available Indices</option>
              <option value="scopus">Scopus Indexed Only</option>
              <option value="wos">Web of Science (WoS) Indexed Only</option>
              <option value="doaj">DOAJ Certified Open Access</option>
              <option value="open_access">Open Access (Any)</option>
            </select>
          </div>

          {/* Preferred Quartile */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-600">
              Preferred Quartile Target
            </label>
            <select
              value={preferredQuartile}
              onChange={(e) => setPreferredQuartile(e.target.value as any)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-purple-500 font-medium"
            >
              <option value="all">No Preference / All Quartiles</option>
              <option value="Q1">Q1 (Top 25% Quartile)</option>
              <option value="Q2">Q2 (Upper Middle Quartile)</option>
              <option value="Q3">Q3 (Lower Middle Quartile)</option>
              <option value="Q4">Q4 (Bottom Quartile)</option>
            </select>
          </div>

          {/* Budget Tier */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-600">
              APC Publication Budget
            </label>
            <select
              value={budgetTier}
              onChange={(e) => setBudgetTier(e.target.value as any)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-purple-500 font-medium"
            >
              <option value="all">No Limit / Any Budget</option>
              <option value="no_apc">No APC (Diamond Open Access / Toll Free)</option>
              <option value="under_25k">Under ₹25,000</option>
              <option value="25k_75k">₹25,000 – ₹75,000</option>
              <option value="above_75k">₹75,000+</option>
            </select>
          </div>

        </div>

        {/* Submit */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={isSearching}
            className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs sm:text-sm flex items-center gap-2 shadow-xs transition-all cursor-pointer"
          >
            {isSearching ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                <span>Searching Curated Registries...</span>
              </>
            ) : (
              <>
                <span>MATCH TARGET JOURNALS</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </form>

      {/* Results Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900">
            Best Matches ({results.length} Candidate Venues)
          </h2>
          <span className="text-xs text-slate-500 font-medium">
            Ranked by Researcher Fit Score
          </span>
        </div>

        {results.length === 0 && hasSearched ? (
          <div className="p-12 text-center text-slate-500 bg-white rounded-3xl border border-slate-200">
            <p className="text-sm font-semibold">No verified journals match the exact filter criteria.</p>
            <p className="text-xs text-slate-400 mt-1">Try broadening your quartile or budget filter to see candidate venues.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {results.map((j, idx) => (
              <div
                key={idx}
                className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-200/90 shadow-2xs hover:shadow-xs transition-all flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6"
              >
                {/* Journal Details */}
                <div className="space-y-2 flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-md bg-purple-50 text-purple-800 text-xs font-bold border border-purple-200">
                      {j.researchFit}% RESEARCH FIT
                    </span>
                    <span className="text-slate-300">·</span>
                    <span className="text-xs font-semibold text-slate-700">
                      {j.quartile}
                    </span>
                    <span className="text-slate-300">·</span>
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                      j.riskTier === 'LOW' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-amber-50 text-amber-800'
                    }`}>
                      Risk: {j.riskTier}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                    {j.name}
                  </h3>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600">
                    <span className="font-medium text-slate-700">{j.publisher}</span>
                    <span>·</span>
                    <span className="font-mono">ISSN: {j.issn}</span>
                    <span>·</span>
                    <span>APC: <strong>{j.apc}</strong></span>
                    <span>·</span>
                    <span>Scopus: <strong>{j.scopusStatus}</strong></span>
                    <span>·</span>
                    <span>WoS: <strong>{j.wosStatus}</strong></span>
                  </div>

                  {/* Subject Match Pills */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {j.subjectMatch.map((sm, smIdx) => (
                      <span key={smIdx} className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px]">
                        {sm}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex sm:flex-col items-center gap-2 shrink-0 self-stretch sm:self-auto justify-end">
                  <button
                    onClick={() => onVerifyJournal(j.issn || j.name)}
                    className="w-full px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Run Full Audit</span>
                  </button>

                  <a
                    href={j.officialWebsite}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <span>Official Site</span>
                    <ExternalLink className="w-3 h-3 text-slate-400" />
                  </a>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
