import React, { useState } from 'react';
import {
  EntityNode,
  GraphPath,
  InvestigationCase,
  KnowledgeGraphData,
} from '../types';
import {
  FolderLock,
  Plus,
  Pin,
  FileText,
  Trash2,
  CheckCircle2,
  Calendar,
  UserCheck,
  Send,
  Eye,
  GitFork,
  AlertTriangle,
} from 'lucide-react';

interface CaseManagerViewProps {
  cases: InvestigationCase[];
  currentCase: InvestigationCase;
  graph: KnowledgeGraphData;
  onSelectCase: (caseObj: InvestigationCase) => void;
  onCreateCase: (title: string, description: string, leadOfficer: string) => void;
  onAddNote: (note: string) => void;
  onUnpinEntity: (entityId: string) => void;
  onSelectNodeById: (entityId: string) => void;
  onHighlightPath: (path: GraphPath) => void;
  onSwitchToGraphTab: () => void;
}

export const CaseManagerView: React.FC<CaseManagerViewProps> = ({
  cases,
  currentCase,
  graph,
  onSelectCase,
  onCreateCase,
  onAddNote,
  onUnpinEntity,
  onSelectNodeById,
  onHighlightPath,
  onSwitchToGraphTab,
}) => {
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newOfficer, setNewOfficer] = useState('Officer Sharma (Lead Analyst)');
  const [isCreating, setIsCreating] = useState(false);
  const [noteInput, setNoteInput] = useState('');

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    onCreateCase(newTitle.trim(), newDesc.trim(), newOfficer.trim());
    setNewTitle('');
    setNewDesc('');
    setIsCreating(false);
  };

  const handleNoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteInput.trim()) return;
    onAddNote(noteInput.trim());
    setNoteInput('');
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-[#16191E] border border-white/10 p-6 shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 bg-white/10 text-white border border-white/10 text-[10px] font-mono-code font-bold uppercase tracking-widest">
                DOSSIER VAULT
              </span>
              <span className="text-[10px] font-mono-code text-[#64748B] font-bold uppercase">
                SECTION 12 // CASE REPOSITORY
              </span>
            </div>
            <h1 className="text-3xl font-black text-white font-display-grotesk tracking-tighter italic uppercase leading-none">
              INVESTIGATION CASES & NOTES
            </h1>
            <p className="text-xs text-[#94A3B8] mt-2 font-medium">
              Organize multi-agency evidence, pin critical graph articulation paths, log analytical hypotheses, and track findings.
            </p>
          </div>

          <button
            onClick={() => setIsCreating(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#A3E635] hover:bg-[#b8f547] text-black font-mono-code text-xs font-black uppercase tracking-wider shadow-lg transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Case Dossier</span>
          </button>
        </div>
      </div>

      {/* New Case Modal Form */}
      {isCreating && (
        <form
          onSubmit={handleCreateSubmit}
          className="bg-[#16191E] border border-[#A3E635] p-5 space-y-4 shadow-2xl animate-in fade-in"
        >
          <h3 className="text-sm font-black text-white font-mono-code uppercase tracking-tight">
            Initialize New Investigation File
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono-code">
            <div>
              <label className="text-[#94A3B8] block mb-1 font-bold uppercase text-[10px]">Case Title</label>
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="e.g., Operation SilverStream Hawala Probe"
                className="w-full bg-[#0A0C0F] border border-white/15 px-3 py-2 text-white focus:outline-none focus:border-[#A3E635]"
                required
              />
            </div>
            <div>
              <label className="text-[#94A3B8] block mb-1 font-bold uppercase text-[10px]">Lead Analyst / Officer</label>
              <input
                type="text"
                value={newOfficer}
                onChange={(e) => setNewOfficer(e.target.value)}
                className="w-full bg-[#0A0C0F] border border-white/15 px-3 py-2 text-white focus:outline-none focus:border-[#A3E635]"
              />
            </div>
          </div>
          <div>
            <label className="text-[#94A3B8] block mb-1 text-[10px] font-mono-code font-bold uppercase">
              Scope & Background Objective
            </label>
            <textarea
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
              placeholder="Outline target persons of interest, suspect bank accounts, or CDR call trunks..."
              className="w-full bg-[#0A0C0F] border border-white/15 px-3 py-2 text-xs text-white focus:outline-none focus:border-[#A3E635] h-20 font-mono-code"
            />
          </div>
          <div className="flex justify-end gap-2 text-xs font-mono-code">
            <button
              type="button"
              onClick={() => setIsCreating(false)}
              className="px-4 py-2 bg-white/5 text-[#94A3B8] hover:text-white border border-white/10 uppercase font-bold text-[10px]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#A3E635] hover:bg-[#b8f547] text-black font-black uppercase text-[10px]"
            >
              Create File
            </button>
          </div>
        </form>
      )}

      {/* Case Switcher Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {cases.map((c) => {
          const isActive = c.id === currentCase.id;
          return (
            <div
              key={c.id}
              onClick={() => onSelectCase(c)}
              className={`p-4 border transition-all cursor-pointer shadow-lg flex flex-col justify-between space-y-3 ${
                isActive
                  ? 'bg-[#16191E] border-[#A3E635] text-white shadow-[#A3E635]/10'
                  : 'bg-[#16191E] border-white/10 text-[#94A3B8] hover:border-white/25'
              }`}
            >
              <div>
                <div className="flex items-center justify-between text-[10px] font-mono-code mb-1.5">
                  <span
                    className={`px-2 py-0.5 font-bold uppercase tracking-wider ${
                      isActive
                        ? 'bg-[#A3E635] text-black'
                        : 'bg-white/10 text-white'
                    }`}
                  >
                    {c.id}
                  </span>
                  <span className="uppercase text-[#A3E635] font-black">{c.status}</span>
                </div>
                <h3 className="font-black text-white text-sm uppercase tracking-tight">{c.title}</h3>
                <p className="text-xs text-[#94A3B8] line-clamp-2 mt-1 font-medium">{c.description}</p>
              </div>

              <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[10px] font-mono-code text-[#64748B] font-bold">
                <span>{c.leadOfficer}</span>
                <span className="text-white">{c.pinnedEntities.length} Pinned</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Active Case Detail Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Pinned Entities & Paths */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-[#16191E] border border-white/10 p-5 space-y-4 shadow-xl">
            <h3 className="text-xs font-black text-white font-mono-code uppercase tracking-wider flex items-center gap-2 border-b border-white/10 pb-3">
              <Pin className="w-4 h-4 text-[#A3E635]" />
              <span>PINNED ENTITIES & EVIDENCE HOOKS ({currentCase.pinnedEntities.length})</span>
            </h3>

            {currentCase.pinnedEntities.length === 0 ? (
              <p className="text-xs text-[#64748B] italic">
                No entities pinned to this case. Click "Pin to Case" in Entity Directory or Graph view.
              </p>
            ) : (
              <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                {currentCase.pinnedEntities.map((eId) => {
                  const node = graph.nodes.find((n) => n.id === eId);
                  return (
                    <div
                      key={eId}
                      className="p-3 bg-[#0A0C0F] border border-white/10 hover:border-[#A3E635]/50 flex items-center justify-between text-xs font-mono-code"
                    >
                      <div
                        onClick={() => onSelectNodeById(eId)}
                        className="cursor-pointer hover:text-[#A3E635]"
                      >
                        <span className="font-black text-white uppercase">{node?.name || eId}</span>
                        <span className="text-[#A3E635] ml-2 font-bold">({eId})</span>
                        <span className="text-[#64748B] block text-[10px] font-bold">
                          Type: {node?.type || 'Entity'} | Degree: {node?.degree || 1}
                        </span>
                      </div>
                      <button
                        onClick={() => onUnpinEntity(eId)}
                        className="p-1.5 text-[#64748B] hover:text-red-400 hover:bg-white/5 cursor-pointer transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Pinned Discovered Paths */}
          <div className="bg-[#16191E] border border-white/10 p-5 space-y-4 shadow-xl">
            <h3 className="text-xs font-black text-white font-mono-code uppercase tracking-wider flex items-center gap-2 border-b border-white/10 pb-3">
              <GitFork className="w-4 h-4 text-blue-400" />
              <span>BOOKMARKED RELATIONAL CHAINS ({currentCase.pinnedPaths.length})</span>
            </h3>

            {currentCase.pinnedPaths.length === 0 ? (
              <p className="text-xs text-[#64748B] italic">
                No paths bookmarked yet. Run "Find Connection" and click "Pin to Case".
              </p>
            ) : (
              <div className="space-y-2">
                {currentCase.pinnedPaths.map((path) => (
                  <div
                    key={path.id}
                    className="p-3 bg-[#0A0C0F] border border-white/10 space-y-2 text-xs font-mono-code"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-black text-white uppercase">
                        {path.hops}-Hop Chain ({path.connectionStrength}% strength)
                      </span>
                      <button
                        onClick={() => {
                          onHighlightPath(path);
                          onSwitchToGraphTab();
                        }}
                        className="flex items-center gap-1 px-2.5 py-1 bg-white/5 hover:bg-white/10 text-[#A3E635] border border-white/15 text-[10px] font-black uppercase tracking-wider cursor-pointer"
                      >
                        <Eye className="w-3 h-3" />
                        <span>View</span>
                      </button>
                    </div>
                    <div className="text-[11px] text-[#A3E635] font-bold truncate">
                      {path.nodeIds.join(' → ')}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right: Field Notes & Case Log */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-[#16191E] border border-white/10 p-5 space-y-4 shadow-xl flex flex-col h-full">
            <h3 className="text-xs font-black text-white font-mono-code uppercase tracking-wider flex items-center gap-2 border-b border-white/10 pb-3">
              <FileText className="w-4 h-4 text-[#A3E635]" />
              <span>INVESTIGATIVE AUDIT NOTES & HYPOTHESES</span>
            </h3>

            {/* Note list */}
            <div className="space-y-2.5 flex-1 max-h-80 overflow-y-auto pr-1">
              {currentCase.notes.map((note) => (
                <div
                  key={note.id}
                  className="p-3.5 bg-[#0A0C0F] border border-white/10 text-xs space-y-1.5"
                >
                  <div className="flex items-center justify-between text-[10px] font-mono-code text-[#64748B]">
                    <span className="text-white font-bold uppercase tracking-wider">{note.author}</span>
                    <span>{note.timestamp}</span>
                  </div>
                  <p className="text-[#E0E2E6] leading-relaxed font-medium">{note.content}</p>
                </div>
              ))}
            </div>

            {/* Add note input */}
            <form onSubmit={handleNoteSubmit} className="flex gap-2 pt-3 border-t border-white/10">
              <input
                type="text"
                value={noteInput}
                onChange={(e) => setNoteInput(e.target.value)}
                placeholder="Log analytical finding, corroboration status, or next lead..."
                className="flex-1 bg-[#0A0C0F] border border-white/15 px-3 py-2 text-xs text-white placeholder-[#64748B] focus:outline-none focus:border-[#A3E635] font-mono-code font-bold"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-[#A3E635] hover:bg-[#b8f547] text-black font-mono-code text-xs font-black uppercase tracking-wider flex items-center gap-1 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Log</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
