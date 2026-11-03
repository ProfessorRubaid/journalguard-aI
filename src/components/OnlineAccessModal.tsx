/**
 * JOURNALGUARD AI - Online Web App & Share Portal Modal
 * Academic Concept & Direction: Dr. Rubaid Ashfaq
 * 
 * Explains and facilitates 100% online browser access with zero installation.
 * Allows instant link copying and sharing for researchers, students, and faculties.
 */

import React, { useState } from 'react';
import { 
  X, 
  Globe, 
  Copy, 
  Check, 
  Share2, 
  ShieldCheck, 
  Sparkles, 
  Smartphone, 
  Laptop, 
  QrCode, 
  Mail, 
  MessageSquare, 
  ExternalLink,
  BookOpen
} from 'lucide-react';

interface OnlineAccessModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OnlineAccessModal: React.FC<OnlineAccessModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);
  const [showQr, setShowQr] = useState(false);

  if (!isOpen) return null;

  // Use current window location or fallback to shared app URL
  const currentUrl = typeof window !== 'undefined' && window.location.origin
    ? window.location.origin
    : 'https://ais-pre-idoknbj6wy4hmjlj7llvbd-401921131266.asia-east1.run.app';

  const shareText = `Verify journals before submitting your research. JournalGuard AI is a free online academic tool to detect predatory publishers, cloned domains, and verify Scopus/DOAJ indexing — no install required: ${currentUrl}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleMailShare = () => {
    const subject = encodeURIComponent('JournalGuard AI - Free Online Journal Verification Tool (No Install Required)');
    const body = encodeURIComponent(`Dear Colleague,\n\nI recommend using JournalGuard AI to verify academic journals before manuscript submission:\n\n${currentUrl}\n\nKey capabilities:\n- Detect cloned & hijacked journal websites\n- Cross-check ISSN and canonical publisher domains\n- Query Crossref, OpenAlex, DOAJ and Scopus\n- 100% online in your browser — zero installation or account required.\n\nAcademic Concept & Direction: Dr. Rubaid Ashfaq`);
    window.open(`mailto:?subject=${subject}&body=${body}`, '_blank');
  };

  const handleWhatsAppShare = () => {
    const text = encodeURIComponent(`Verify academic journals before submitting! Check indexing, DOAJ, and detect cloned websites directly in your browser (no app install needed): ${currentUrl}`);
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-slate-200 shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-md px-6 py-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
              <Globe className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-slate-900">
                Online Web Application Access
              </h2>
              <p className="text-xs text-slate-500">
                Use instantly via web link · Zero installation or setup required
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6">
          
          {/* Hero Banner inside Modal */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-blue-50 via-indigo-50/60 to-purple-50 border border-blue-100/80 space-y-3">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-600 text-white text-[11px] font-bold">
              <Sparkles className="w-3 h-3" />
              <span>100% Browser-Native Web App</span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
              Anyone with this link can use JournalGuard AI immediately
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              No need to download files, install software from app stores, or configure extensions. Simply open the URL in Chrome, Safari, Firefox, or Edge on any computer, phone, or tablet.
            </p>
          </div>

          {/* Shareable Link Box */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              Shareable Online Web Link
            </label>
            <div className="flex items-center gap-2 p-2 bg-slate-50 border border-slate-200 rounded-2xl">
              <input
                type="text"
                readOnly
                value={currentUrl}
                className="flex-1 bg-transparent px-2.5 text-xs sm:text-sm font-mono text-slate-800 focus:outline-hidden select-all"
              />
              <button
                onClick={handleCopyLink}
                className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs ${
                  copied
                    ? 'bg-emerald-600 text-white'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Link</span>
                  </>
                )}
              </button>
            </div>
            <span className="text-[11px] text-slate-500 block">
              💡 Tip: Bookmark this URL (<kbd className="font-mono bg-slate-100 px-1 py-0.5 rounded text-slate-700">Ctrl+D</kbd> or <kbd className="font-mono bg-slate-100 px-1 py-0.5 rounded text-slate-700">⌘+D</kbd>) for instant access during research writing.
            </span>
          </div>

          {/* 4 Key Zero-Install Features */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                <Laptop className="w-4 h-4" />
              </div>
              <div className="space-y-0.5">
                <h4 className="text-xs font-bold text-slate-900">
                  Runs in Any Web Browser
                </h4>
                <p className="text-[11px] text-slate-500 leading-normal">
                  Works seamlessly on Windows, macOS, Linux, ChromeOS, Android, and iOS.
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 mt-0.5">
                <Smartphone className="w-4 h-4" />
              </div>
              <div className="space-y-0.5">
                <h4 className="text-xs font-bold text-slate-900">
                  Mobile Responsive
                </h4>
                <p className="text-[11px] text-slate-500 leading-normal">
                  Clean interface optimized for smartphones, tablets, and wide monitors.
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0 mt-0.5">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div className="space-y-0.5">
                <h4 className="text-xs font-bold text-slate-900">
                  No Sign-Up or App Install
                </h4>
                <p className="text-[11px] text-slate-500 leading-normal">
                  Start verifying immediately without mandatory account registration or passwords.
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 mt-0.5">
                <Share2 className="w-4 h-4" />
              </div>
              <div className="space-y-0.5">
                <h4 className="text-xs font-bold text-slate-900">
                  Easy Collaboration
                </h4>
                <p className="text-[11px] text-slate-500 leading-normal">
                  Send to co-authors, PhD students, library staff, and journal evaluation committees.
                </p>
              </div>
            </div>

          </div>

          {/* Quick Sharing Channels */}
          <div className="space-y-2 pt-2">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              Share With Your Research Group
            </span>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={handleMailShare}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center gap-2 transition-colors cursor-pointer"
              >
                <Mail className="w-3.5 h-3.5 text-slate-500" />
                <span>Email Colleagues</span>
              </button>

              <button
                onClick={handleWhatsAppShare}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-2 transition-colors cursor-pointer"
              >
                <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                <span>Share via WhatsApp</span>
              </button>

              <button
                onClick={() => setShowQr(prev => !prev)}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-indigo-50 hover:bg-indigo-100 text-indigo-800 border border-indigo-200 flex items-center gap-2 transition-colors cursor-pointer"
              >
                <QrCode className="w-3.5 h-3.5 text-indigo-600" />
                <span>{showQr ? 'Hide QR Code' : 'Scan on Mobile Phone'}</span>
              </button>
            </div>

            {/* QR Code Container */}
            {showQr && (
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col items-center justify-center text-center space-y-2 animate-in fade-in duration-150">
                <div className="p-3 bg-white rounded-xl shadow-xs border border-slate-200">
                  {/* Clean SVG visual QR placeholder pointing to web app */}
                  <div className="w-36 h-36 bg-slate-900 rounded-lg p-2 flex flex-col items-center justify-center text-white text-center">
                    <QrCode className="w-20 h-20 text-white mx-auto stroke-[1.8]" />
                    <span className="text-[9px] font-mono tracking-wider text-slate-300 mt-1">SCAN VIA PHONE CAMERA</span>
                  </div>
                </div>
                <p className="text-xs text-slate-600 max-w-xs">
                  Scan with your phone camera to open JournalGuard AI immediately in your mobile browser.
                </p>
              </div>
            )}
          </div>

          {/* Academic Attribution Footer */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Academic Concept &amp; Direction: <strong className="text-slate-700">Dr. Rubaid Ashfaq</strong></span>
            <button
              onClick={onClose}
              className="text-blue-600 hover:text-blue-800 font-semibold cursor-pointer"
            >
              Continue to Application →
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
