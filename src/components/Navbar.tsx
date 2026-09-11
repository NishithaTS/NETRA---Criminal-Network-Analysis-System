import React from 'react';
import {
  ShieldAlert,
  Network,
  Search,
  GitFork,
  Radio,
  FileText,
  AlertTriangle,
  FolderLock,
  UploadCloud,
  Bot,
  RefreshCw,
  Zap,
  Flame,
  Volume2,
} from 'lucide-react';
import { DatasetStats, InvestigationCase } from '../types';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  stats: DatasetStats;
  currentCase: InvestigationCase;
  onOpenIngestModal: () => void;
  onOpenAIModal: () => void;
  onOpenReportModal: () => void;
  onRunDemo: () => void;
  isAiThinking?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  stats,
  currentCase,
  onOpenIngestModal,
  onOpenAIModal,
  onOpenReportModal,
  onRunDemo,
  isAiThinking,
}) => {
  const totalEntities =
    stats.uniquePersons +
    stats.uniquePhones +
    stats.uniqueAccounts +
    stats.uniqueVehicles +
    stats.uniqueLocations +
    stats.uniqueOrganizations;

  return (
    <header className="bg-[#09090B] border-b border-white/10 sticky top-0 z-40">
      {/* Top Banner: Swindled Podcast Style Marquee / Ticker */}
      <div className="bg-[#000000] border-b border-white/10 px-4 py-1.5 flex items-center justify-between text-[10px] font-mono-code font-bold uppercase tracking-widest text-[#71717A] overflow-hidden">
        <div className="flex items-center gap-3 truncate">
          <span className="flex items-center gap-1.5 text-[#DC2626] font-black">
            <Flame className="w-3 h-3 fill-[#DC2626]" />
            SWINDLED // NETRA
          </span>
          <span className="text-white/20">•</span>
          <span className="text-white/80">A TRUE CRIME PLATFORM EXPOSING WHITE-COLLAR CONSPIRACY & HAWALA CORRUPTION</span>
          <span className="text-white/20">•</span>
          <span className="text-[#DC2626]">VALUED INVESTIGATOR™ DOSSIER</span>
        </div>
        <div className="hidden md:flex items-center gap-4 text-white/60">
          <span>CASE: <strong className="text-white font-mono">{currentCase.id}</strong></span>
          <span className="text-white/20">|</span>
          <span className="text-emerald-400">EVIDENCE VERIFIED</span>
        </div>
      </div>

      {/* Main Brand & Metric Stack */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end px-5 py-4 border-b border-white/10 gap-4 bg-[#09090B]">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#DC2626] text-white flex items-center justify-center font-anton text-2xl tracking-wider shadow-[0_0_15px_rgba(220,38,38,0.4)]">
              N
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-3xl sm:text-4xl font-anton tracking-wider leading-none text-white uppercase">
                  NETRA <span className="text-[#DC2626]">INTELLIGENCE</span>
                </h1>
                <span className="stamp-confidential text-[9px] py-0.5 px-2">
                  CONFIDENTIAL
                </span>
              </div>
              <p className="text-[10px] uppercase tracking-widest text-[#71717A] mt-1 font-mono-code font-bold">
                SIH PROBLEM 26189 • KNOWLEDGE GRAPH FORENSICS • A CONCERNED CITIZEN ARCHIVE
              </p>
            </div>
          </div>
        </div>

        {/* High-Contrast True-Crime Stats Stack */}
        <div className="flex items-center gap-6 sm:gap-8 self-end lg:self-auto flex-wrap">
          <div className="text-right">
            <div className="text-2xl font-anton text-white leading-tight tracking-wider">{stats.totalRecords}</div>
            <div className="text-[9px] uppercase font-mono-code font-bold tracking-widest text-[#71717A]">
              RAW EXHIBITS
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-anton text-white leading-tight tracking-wider">{totalEntities}</div>
            <div className="text-[9px] uppercase font-mono-code font-bold tracking-widest text-[#71717A]">
              ENTITIES TRACKED
            </div>
          </div>
          <div className="text-right border-l border-white/10 pl-6 sm:pl-8">
            <div className="text-2xl font-anton text-[#DC2626] leading-tight tracking-wider">
              {stats.anomaliesDetected || 12}
            </div>
            <div className="text-[9px] uppercase font-mono-code font-bold tracking-widest text-[#DC2626]">
              FLAGGED CONSPIRACIES
            </div>
          </div>

          <div className="flex items-center gap-2 pl-2">
            <button
              onClick={onRunDemo}
              className="bg-[#DC2626] hover:bg-[#B91C1C] text-white text-[10px] sm:text-[11px] font-oswald font-bold px-4 py-2 uppercase tracking-widest transition-all cursor-pointer flex items-center gap-1.5 shadow-[0_0_14px_rgba(220,38,38,0.4)] border border-red-500/50"
              title="Execute canonical SIH demo scenario: P007 to P038 multi-hop discovery"
            >
              <Zap className="w-3.5 h-3.5 fill-white" />
              <span>1-CLICK DEMO (P007 → P038)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation & Action Bar */}
      <div className="px-5 py-2.5 flex items-center justify-between gap-4 bg-[#000000]">
        {/* Navigation Tabs */}
        <nav className="hidden lg:flex items-center gap-1">
          {[
            { id: 'graph', label: 'Knowledge Graph', icon: Network },
            { id: 'paths', label: 'Find Connection', icon: GitFork },
            { id: 'search', label: 'Suspect Directory', icon: Search },
            { id: 'analytics', label: 'Crime Analytics', icon: Radio },
            { id: 'anomalies', label: 'Fraud Anomalies', icon: AlertTriangle },
            { id: 'timeline', label: 'Chronology', icon: RefreshCw },
            { id: 'cases', label: 'Case Dossiers', icon: FolderLock },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-oswald font-semibold uppercase tracking-wider transition-all cursor-pointer border ${
                  isActive
                    ? 'bg-[#18181B] text-[#DC2626] border-[#DC2626] shadow-[0_0_12px_rgba(220,38,38,0.2)]'
                    : 'bg-transparent text-[#71717A] hover:text-white hover:bg-white/5 border-transparent'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#DC2626]' : 'text-[#71717A]'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right Action Buttons */}
        <div className="flex items-center gap-2 w-full lg:w-auto justify-between lg:justify-end">
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenIngestModal}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#18181B] hover:bg-[#27272A] text-[#F4F4F5] border border-white/10 text-[10px] sm:text-[11px] font-mono-code font-bold uppercase tracking-wider transition-all cursor-pointer"
              title="Upload CSV dataset or inspect raw records"
            >
              <UploadCloud className="w-3.5 h-3.5 text-[#71717A]" />
              <span>Evidence Ingest</span>
            </button>

            <button
              onClick={onOpenReportModal}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#18181B] hover:bg-[#27272A] text-[#F4F4F5] border border-white/10 text-[10px] sm:text-[11px] font-mono-code font-bold uppercase tracking-wider transition-all cursor-pointer"
              title="Generate and Export Intelligence Report"
            >
              <FileText className="w-3.5 h-3.5 text-amber-500" />
              <span>Dossier Report</span>
            </button>
          </div>

          <button
            onClick={onOpenAIModal}
            className={`flex items-center gap-1.5 px-4 py-1.5 text-[10px] sm:text-[11px] font-oswald font-bold uppercase tracking-widest transition-all border cursor-pointer ${
              isAiThinking
                ? 'bg-[#DC2626]/20 text-[#DC2626] border-[#DC2626] animate-pulse'
                : 'bg-white text-black hover:bg-[#E4E4E7] border-white shadow-sm'
            }`}
          >
            <Bot className="w-3.5 h-3.5 text-black" />
            <span>AI INVESTIGATOR</span>
          </button>
        </div>
      </div>

      {/* Mobile Scrollable Nav */}
      <div className="lg:hidden flex items-center overflow-x-auto px-4 py-2 gap-1 bg-[#000000] border-t border-white/10">
        {[
          { id: 'graph', label: 'Graph', icon: Network },
          { id: 'paths', label: 'Paths', icon: GitFork },
          { id: 'search', label: 'Directory', icon: Search },
          { id: 'analytics', label: 'Analytics', icon: Radio },
          { id: 'anomalies', label: 'Anomalies', icon: AlertTriangle },
          { id: 'timeline', label: 'Chronology', icon: RefreshCw },
          { id: 'cases', label: 'Cases', icon: FolderLock },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1 px-2.5 py-1 text-[10px] font-oswald font-bold uppercase tracking-wider whitespace-nowrap border ${
                isActive
                  ? 'bg-[#18181B] text-[#DC2626] border-[#DC2626]'
                  : 'bg-transparent text-[#71717A] border-transparent'
              }`}
            >
              <Icon className="w-3 h-3" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
};


