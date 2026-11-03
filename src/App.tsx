/**
 * JOURNALGUARD AI
 * Journal Authenticity, Indexing & Research Integrity Intelligence
 * Concept & Academic Direction: Dr. Rubaid Ashfaq
 * Tagline: Verify Before You Submit. Publish With Confidence.
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { VerificationResultView } from './components/VerificationResultView';
import { DashboardView } from './components/DashboardView';
import { LibraryView } from './components/LibraryView';
import { JournalFinderView } from './components/JournalFinderView';
import { ChecklistView } from './components/ChecklistView';
import { AcademyView } from './components/AcademyView';
import { ResearcherProfileModal } from './components/ResearcherProfileModal';
import { JournalCompareModal } from './components/JournalCompareModal';
import { ReportModal } from './components/ReportModal';
import { ApiSettingsModal } from './components/ApiSettingsModal';
import { PrivacyModal } from './components/PrivacyModal';
import { Footer } from './components/Footer';
import { DomainMismatchAlertBanner } from './components/DomainMismatchAlertBanner';

import { 
  ResearcherProfile, 
  VerificationResult, 
  SavedJournalEntry,
  VerificationInputOptions,
  DomainMismatchAlert
} from './types';
import { 
  getStoredProfile, 
  saveStoredProfile, 
  getSavedJournals, 
  saveSavedJournals,
  addSavedJournal,
  updateSavedJournal,
  removeSavedJournal,
  getStoredHistory,
  addHistoryResult,
  clearAllUserData
} from './services/storage';
import { verifyJournal } from './services/verificationEngine';
import { triggerDomainMismatchAlert, onDomainMismatchAlert } from './services/domainComparator';
import { DEMO_RESEARCHER_DEFAULT } from './services/demoData';

export default function App() {
  const [currentTab, setCurrentTab] = useState<'home' | 'dashboard' | 'finder' | 'library' | 'checklist' | 'academy'>('home');
  const [profile, setProfile] = useState<ResearcherProfile>(getStoredProfile);
  const [savedJournals, setSavedJournals] = useState<SavedJournalEntry[]>(getSavedJournals);
  const [history, setHistory] = useState<VerificationResult[]>(getStoredHistory);
  const [currentResult, setCurrentResult] = useState<VerificationResult | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  // Modals state
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isApiSettingsOpen, setIsApiSettingsOpen] = useState(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);
  const [compareList, setCompareList] = useState<SavedJournalEntry[]>([]);

  // Real-time Domain Mismatch UI Alert state
  const [activeDomainAlert, setActiveDomainAlert] = useState<DomainMismatchAlert | null>(null);

  // Subscribe to real-time domain alert notifications
  useEffect(() => {
    const unsubscribe = onDomainMismatchAlert((alert) => {
      setActiveDomainAlert(alert);
    });
    return unsubscribe;
  }, []);

  // Verification Search Handler
  const handleVerify = async (query: string | VerificationInputOptions) => {
    setIsVerifying(true);
    setCurrentTab('home');
    setActiveDomainAlert(null); // Clear previous alert on new verification

    try {
      const res = await verifyJournal(query, profile);
      setCurrentResult(res);
      addHistoryResult(res);
      setHistory(getStoredHistory());

      // Upon verification, check and trigger UI alert if hostname of provided journal URL does not match canonical domain
      triggerDomainMismatchAlert(res, (alertData) => {
        setActiveDomainAlert(alertData);
      });
    } catch (err) {
      console.error('Verification error:', err);
    } finally {
      setIsVerifying(false);
    }
  };

  // Re-verify current journal
  const handleRecheckCurrent = () => {
    if (currentResult) {
      handleVerify(currentResult.searchQuery || currentResult.journal.issn || currentResult.journal.title);
    }
  };

  // Save journal to Watchlist
  const handleSaveToWatchlist = (res: VerificationResult) => {
    const newSaved = addSavedJournal({
      journalName: res.journal.title,
      publisher: res.journal.publisher,
      issn: res.journal.issn,
      scopusStatus: res.sources.scopus.status,
      wosStatus: res.sources.wos.status,
      doajStatus: res.sources.doaj.status,
      authenticityScore: res.authenticityScore.total,
      riskScore: res.riskAnalysis.riskScore,
      riskTier: res.riskAnalysis.riskTier,
      lastChecked: new Date().toISOString().split('T')[0],
      status: 'Saved',
      notes: `Audited on ${new Date().toLocaleDateString()}. Recommendation: ${res.recommendation.status}`,
      tags: ['Verified', 'Watchlist'],
      isWatched: true,
    });
    setSavedJournals(getSavedJournals());
  };

  // Profile Save
  const handleSaveProfile = (updated: ResearcherProfile) => {
    setProfile(updated);
    saveStoredProfile(updated);
  };

  // Library Updates
  const handleUpdateLibraryEntry = (id: string, updates: Partial<SavedJournalEntry>) => {
    updateSavedJournal(id, updates);
    setSavedJournals(getSavedJournals());
  };

  const handleRemoveLibraryEntry = (id: string) => {
    removeSavedJournal(id);
    setSavedJournals(getSavedJournals());
  };

  // Open Compare Modal
  const handleOpenCompare = (selected: SavedJournalEntry[]) => {
    setCompareList(selected);
    setIsCompareModalOpen(true);
  };

  // Privacy: Delete My Data
  const handleDeleteMyData = () => {
    clearAllUserData();
    setProfile(DEMO_RESEARCHER_DEFAULT);
    setSavedJournals(getSavedJournals());
    setHistory([]);
    setCurrentResult(null);
  };

  const isCurrentSaved = currentResult ? savedJournals.some(j => j.issn === currentResult.journal.issn || j.journalName === currentResult.journal.title) : false;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-blue-100 selection:text-blue-900">
      
      {/* Top Navbar */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={(tab) => {
          setCurrentTab(tab as any);
          if (tab !== 'home') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        }}
        profile={profile}
        onOpenProfile={() => setIsProfileModalOpen(true)}
        onOpenApiSettings={() => setIsApiSettingsOpen(true)}
        onOpenPrivacy={() => setIsPrivacyModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {/* Real-Time Domain Mismatch UI Alert Banner */}
        {activeDomainAlert && (
          <DomainMismatchAlertBanner
            alert={activeDomainAlert}
            onDismiss={() => setActiveDomainAlert(null)}
            onScrollToDetails={() => {
              setCurrentTab('home');
              setTimeout(() => {
                const el = document.getElementById('verification-result');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }, 50);
            }}
          />
        )}

        {currentTab === 'home' && (
          <div className="space-y-4">
            <HeroSection
              onVerify={handleVerify}
              onNavigateTab={(tab) => setCurrentTab(tab as any)}
              isLoading={isVerifying}
            />

            {/* Results Panel */}
            {currentResult && (
              <div id="verification-result">
                <VerificationResultView
                  result={currentResult}
                  profile={profile}
                  onSaveToWatchlist={handleSaveToWatchlist}
                  onOpenReport={() => setIsReportModalOpen(true)}
                  onOpenChecklist={() => setCurrentTab('checklist')}
                  onRecheck={handleRecheckCurrent}
                  isSaved={isCurrentSaved}
                />
              </div>
            )}
          </div>
        )}

        {currentTab === 'dashboard' && (
          <DashboardView
            profile={profile}
            savedJournals={savedJournals}
            history={history}
            onNavigateTab={(tab) => setCurrentTab(tab as any)}
            onSelectJournalToVerify={(q) => handleVerify(q)}
            onOpenProfile={() => setIsProfileModalOpen(true)}
          />
        )}

        {currentTab === 'finder' && (
          <JournalFinderView
            profile={profile}
            onVerifyJournal={(q) => handleVerify(q)}
          />
        )}

        {currentTab === 'library' && (
          <LibraryView
            entries={savedJournals}
            onUpdateEntry={handleUpdateLibraryEntry}
            onRemoveEntry={handleRemoveLibraryEntry}
            onRecheckJournal={(q) => handleVerify(q)}
            onOpenCompare={handleOpenCompare}
          />
        )}

        {currentTab === 'checklist' && (
          <ChecklistView />
        )}

        {currentTab === 'academy' && (
          <AcademyView />
        )}
      </main>

      {/* Academic Footer */}
      <Footer
        onOpenPrivacy={() => setIsPrivacyModalOpen(true)}
        onNavigateTab={(tab) => setCurrentTab(tab as any)}
      />

      {/* Researcher Profile Modal */}
      <ResearcherProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        profile={profile}
        onSaveProfile={handleSaveProfile}
      />

      {/* API / Institutional Mode Settings Modal */}
      <ApiSettingsModal
        isOpen={isApiSettingsOpen}
        onClose={() => setIsApiSettingsOpen(false)}
      />

      {/* Compare Modal */}
      <JournalCompareModal
        isOpen={isCompareModalOpen}
        onClose={() => setIsCompareModalOpen(false)}
        journals={compareList}
      />

      {/* Formal Audit Report Modal */}
      <ReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        result={currentResult}
        profile={profile}
      />

      {/* Privacy / Delete My Data Modal */}
      <PrivacyModal
        isOpen={isPrivacyModalOpen}
        onClose={() => setIsPrivacyModalOpen(false)}
        onConfirmDelete={handleDeleteMyData}
      />

    </div>
  );
}
