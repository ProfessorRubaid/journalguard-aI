/**
 * JOURNALGUARD AI - Top Navigation Bar (Material 3 inspired)
 * Academic Concept & Direction: Dr. Rubaid Ashfaq
 */

import React from 'react';
import { ShieldCheck, User, Key, Trash2, Library, BookOpen, CheckSquare, Search, Compass, Globe, Share2 } from 'lucide-react';
import { ResearcherProfile } from '../types';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  profile: ResearcherProfile;
  onOpenProfile: () => void;
  onOpenApiSettings: () => void;
  onOpenPrivacy: () => void;
  onOpenOnlineAccess?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  profile,
  onOpenProfile,
  onOpenApiSettings,
  onOpenPrivacy,
  onOpenOnlineAccess,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Zone 1: Brand Wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setCurrentTab('home')}
              className="flex items-center gap-2.5 text-left group focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 rounded-lg p-1"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-sm shadow-blue-500/20 group-hover:scale-105 transition-transform">
                <ShieldCheck className="w-5 h-5 stroke-[2.2]" />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 bg-clip-text text-transparent whitespace-nowrap">
                  JOURNALGUARD AI
                </span>
                <span className="text-[10px] text-slate-500 font-medium tracking-wide uppercase whitespace-nowrap -mt-0.5">
                  Research Integrity Intelligence
                </span>
              </div>
            </button>
            <span className="hidden xl:inline-flex items-center px-2.5 py-0.5 rounded-full bg-slate-100 border border-slate-200/80 text-[10px] font-semibold text-slate-600 whitespace-nowrap">
              Created by Dr. Rubaid Ashfaq
            </span>
          </div>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden md:flex items-center gap-1.5 lg:gap-2 text-sm font-medium text-slate-600">
            <button
              onClick={() => setCurrentTab('home')}
              className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
                currentTab === 'home'
                  ? 'bg-blue-50 text-blue-700 font-semibold'
                  : 'hover:text-slate-900 hover:bg-slate-100/70'
              }`}
            >
              Verify Journal
            </button>
            <button
              onClick={() => setCurrentTab('dashboard')}
              className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
                currentTab === 'dashboard'
                  ? 'bg-blue-50 text-blue-700 font-semibold'
                  : 'hover:text-slate-900 hover:bg-slate-100/70'
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setCurrentTab('finder')}
              className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                currentTab === 'finder'
                  ? 'bg-blue-50 text-blue-700 font-semibold'
                  : 'hover:text-slate-900 hover:bg-slate-100/70'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              Find Journals
            </button>
            <button
              onClick={() => setCurrentTab('library')}
              className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                currentTab === 'library'
                  ? 'bg-blue-50 text-blue-700 font-semibold'
                  : 'hover:text-slate-900 hover:bg-slate-100/70'
              }`}
            >
              <Library className="w-3.5 h-3.5" />
              Watchlist
            </button>
            <button
              onClick={() => setCurrentTab('checklist')}
              className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                currentTab === 'checklist'
                  ? 'bg-blue-50 text-blue-700 font-semibold'
                  : 'hover:text-slate-900 hover:bg-slate-100/70'
              }`}
            >
              <CheckSquare className="w-3.5 h-3.5" />
              Smart Checklist
            </button>
            <button
              onClick={() => setCurrentTab('academy')}
              className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                currentTab === 'academy'
                  ? 'bg-blue-50 text-blue-700 font-semibold'
                  : 'hover:text-slate-900 hover:bg-slate-100/70'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              Academy
            </button>
          </nav>

          {/* Zone 3: Mode Status & Profile Quick Action */}
          <div className="flex items-center gap-2.5 shrink-0">
            {/* Online Web App Button (Zero Installation Needed) */}
            <button
              onClick={onOpenOnlineAccess}
              title="Online Web App · Share link without installation"
              className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 transition-colors cursor-pointer shadow-2xs"
            >
              <Globe className="w-3.5 h-3.5 text-blue-600" />
              <span className="hidden sm:inline">Online Web App</span>
              <span className="sm:hidden">Share</span>
            </button>

            {/* Free vs Institutional API Mode Pill Button */}
            <button
              onClick={onOpenApiSettings}
              title="Click to configure Scopus / Web of Science API credentials"
              className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 transition-colors"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Free Mode</span>
              <Key className="w-3 h-3 text-emerald-600 ml-0.5" />
            </button>

            {/* Researcher Profile Button */}
            <button
              onClick={onOpenProfile}
              className="flex items-center gap-2 pl-2 pr-3 py-1 rounded-full bg-slate-100 hover:bg-slate-200/80 border border-slate-200 transition-all text-xs text-slate-800 font-medium group cursor-pointer"
              title="View & Edit Researcher Profile"
            >
              <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs uppercase shadow-sm group-hover:scale-105 transition-transform">
                {profile.fullName && profile.fullName.trim() ? profile.fullName.trim().charAt(0) : <User className="w-3.5 h-3.5" />}
              </div>
              <span className="max-w-[120px] lg:max-w-[160px] truncate">
                {(profile.fullName && profile.fullName.trim()) || 'My Profile'}
              </span>
            </button>

            {/* Delete / Reset Data Trigger */}
            <button
              onClick={onOpenPrivacy}
              title="Privacy & Delete My Data"
              className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
              aria-label="Privacy settings and data deletion"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
