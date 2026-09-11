import React from 'react';
import {
  EntityNode,
  KnowledgeGraphData,
  SourceRecord,
} from '../types';
import {
  X,
  Shield,
  Activity,
  Calendar,
  Network,
  FileSpreadsheet,
  ArrowUpRight,
  Pin,
  Bot,
  GitFork,
  ExternalLink,
} from 'lucide-react';

interface EntityDossierDrawerProps {
  node: EntityNode | null;
  graph: KnowledgeGraphData;
  records: SourceRecord[];
  onClose: () => void;
  onSelectNode: (node: EntityNode) => void;
  onInspectRecord: (record: SourceRecord) => void;
  onSetPathEndpoint: (nodeId: string, role: 'source' | 'target') => void;
  onPinEntityToCase: (nodeId: string) => void;
  onAskAiAboutEntity: (entity: EntityNode) => void;
  isPinnedInCase?: boolean;
}

export const EntityDossierDrawer: React.FC<EntityDossierDrawerProps> = ({
  node,
  graph,
  records,
  onClose,
  onSelectNode,
  onInspectRecord,
  onSetPathEndpoint,
  onPinEntityToCase,
  onAskAiAboutEntity,
  isPinnedInCase,
}) => {
  if (!node) return null;

  // Filter supporting raw records
  const nodeRecords = records.filter((r) => node.relatedRecords.includes(r.record_id));

  // Find neighbor entities
  const neighbors = node.relationships.map((rel) => {
    const targetNode = graph.nodes.find((n) => n.id === rel.targetId);
    return {
      relationship: rel.type,
      recordId: rel.recordId,
      sourceRef: rel.sourceRef,
      target: targetNode || {
        id: rel.targetId,
        name: rel.targetId,
        type: 'Person' as const,
        degree: 1,
      },
    };
  });

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-[#16191E] border-l border-white/10 shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out">
      {/* Header */}
      <div className="p-4 bg-[#0A0C0F] border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="px-2.5 py-0.5 bg-white/10 text-white border border-white/10 text-[9px] font-mono-code font-black uppercase tracking-widest">
            {node.type} DOSSIER
          </div>
          <span className="text-xs font-mono-code text-[#A3E635] font-bold">ID: {node.id}</span>
        </div>
        <button
          onClick={onClose}
          className="text-[#94A3B8] hover:text-white p-1 hover:bg-white/5 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-5 space-y-6">
        {/* Title & Core Meta */}
        <div>
          <div className="flex items-start justify-between gap-2">
            <h2 className="text-2xl font-black text-white uppercase tracking-tight">{node.name}</h2>
            <button
              onClick={() => onPinEntityToCase(node.id)}
              className={`p-2 text-xs border transition-colors cursor-pointer ${
                isPinnedInCase
                  ? 'bg-[#A3E635]/20 text-[#A3E635] border-[#A3E635]/50'
                  : 'bg-white/5 text-[#94A3B8] border-white/10 hover:text-white'
              }`}
              title={isPinnedInCase ? 'Pinned in Active Case' : 'Pin to Case'}
            >
              <Pin className="w-4 h-4" />
            </button>
          </div>
          <p className="text-xs text-[#64748B] font-mono-code mt-1 font-bold uppercase">
            Network Cluster: <span className="text-[#A3E635]">Cluster #{node.clusterId}</span>
          </p>
        </div>

        {/* Quick Investigative Action Bar */}
        <div className="grid grid-cols-3 gap-2 text-xs font-mono-code">
          <button
            onClick={() => onSetPathEndpoint(node.id, 'source')}
            className="flex items-center justify-center gap-1.5 py-2 px-1 bg-[#0A0C0F] hover:bg-white/10 text-blue-400 border border-white/10 uppercase font-black tracking-wider transition-colors text-center text-[10px] cursor-pointer"
          >
            <GitFork className="w-3.5 h-3.5" />
            <span>Set Source</span>
          </button>
          <button
            onClick={() => onSetPathEndpoint(node.id, 'target')}
            className="flex items-center justify-center gap-1.5 py-2 px-1 bg-[#0A0C0F] hover:bg-white/10 text-[#A3E635] border border-white/10 uppercase font-black tracking-wider transition-colors text-center text-[10px] cursor-pointer"
          >
            <GitFork className="w-3.5 h-3.5" />
            <span>Set Target</span>
          </button>
          <button
            onClick={() => onAskAiAboutEntity(node)}
            className="flex items-center justify-center gap-1.5 py-2 px-1 bg-red-950/80 hover:bg-red-900 text-red-200 border border-red-800 uppercase font-black tracking-wider transition-colors text-center text-[10px] cursor-pointer"
          >
            <Bot className="w-3.5 h-3.5" />
            <span>Ask AI</span>
          </button>
        </div>

        {/* Analytical Metrics Card */}
        <div className="bg-[#0A0C0F] border border-white/10 p-4 space-y-3">
          <h3 className="text-xs font-black text-white font-mono-code uppercase tracking-wider flex items-center gap-1.5 border-b border-white/10 pb-2">
            <Activity className="w-3.5 h-3.5 text-[#A3E635]" />
            Graph Metrics & Centrality
          </h3>
          <div className="grid grid-cols-2 gap-2 text-xs font-mono-code">
            <div className="bg-[#16191E] p-2.5 border border-white/10">
              <span className="text-[#64748B] block text-[9px] font-bold uppercase">DIRECT DEGREE</span>
              <span className="text-white font-black text-sm">{node.degree} Links</span>
            </div>
            <div className="bg-[#16191E] p-2.5 border border-white/10">
              <span className="text-[#64748B] block text-[9px] font-bold uppercase">BETWEENNESS</span>
              <span className="text-[#A3E635] font-black text-sm">{node.betweenness}</span>
            </div>
            <div className="bg-[#16191E] p-2.5 border border-white/10">
              <span className="text-[#64748B] block text-[9px] font-bold uppercase">FIRST OBSERVED</span>
              <span className="text-white text-[10px] font-bold truncate block">{node.firstSeen || 'N/A'}</span>
            </div>
            <div className="bg-[#16191E] p-2.5 border border-white/10">
              <span className="text-[#64748B] block text-[9px] font-bold uppercase">LAST RECORDED</span>
              <span className="text-white text-[10px] font-bold truncate block">{node.lastSeen || 'N/A'}</span>
            </div>
          </div>
          {node.isBridge && (
            <div className="p-2 bg-red-950/80 border border-red-800 text-[10px] text-red-300 font-mono-code font-bold uppercase tracking-wider flex items-center gap-2">
              <Shield className="w-4 h-4 text-red-400 shrink-0" />
              <span>Potential Network Bridge connecting distinct clusters.</span>
            </div>
          )}
        </div>

        {/* Connected Entities Section */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <h3 className="text-xs font-black text-white font-mono-code uppercase tracking-wider flex items-center gap-1.5">
              <Network className="w-3.5 h-3.5 text-[#A3E635]" />
              Connected Entities ({neighbors.length})
            </h3>
          </div>

          <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
            {neighbors.length === 0 ? (
              <p className="text-xs text-[#64748B] italic">No direct linked entities found.</p>
            ) : (
              neighbors.map((nbr, idx) => (
                <div
                  key={idx}
                  onClick={() => onSelectNode(nbr.target as EntityNode)}
                  className="p-2.5 bg-[#0A0C0F] hover:bg-[#121620] border border-white/10 hover:border-[#A3E635]/50 flex items-center justify-between cursor-pointer transition-colors"
                >
                  <div className="truncate mr-2">
                    <div className="flex items-center gap-1.5">
                      <span className="font-black text-xs text-white uppercase truncate">
                        {nbr.target.name}
                      </span>
                      <span className="text-[10px] text-[#A3E635] font-mono-code font-bold">
                        ({nbr.target.id})
                      </span>
                    </div>
                    <div className="text-[10px] text-[#64748B] font-mono-code font-bold uppercase">
                      Rel: <span className="text-white">{nbr.relationship}</span> | Ref:{' '}
                      <span className="text-[#94A3B8]">{nbr.sourceRef}</span>
                    </div>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-[#A3E635]" />
                </div>
              ))
            )}
          </div>
        </div>

        {/* Supporting Source Records (Evidence Traceability) */}
        <div className="space-y-2.5">
          <h3 className="text-xs font-black text-white font-mono-code uppercase tracking-wider flex items-center gap-1.5 border-b border-white/10 pb-2">
            <FileSpreadsheet className="w-3.5 h-3.5 text-amber-400" />
            Supporting Source Records ({nodeRecords.length})
          </h3>

          <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
            {nodeRecords.map((rec) => (
              <div
                key={rec.record_id}
                onClick={() => onInspectRecord(rec)}
                className="p-3 bg-[#0A0C0F] hover:bg-[#121620] border border-white/10 hover:border-white/20 cursor-pointer transition-colors space-y-1.5 text-xs"
              >
                <div className="flex items-center justify-between text-[10px] font-mono-code font-bold">
                  <span className="px-1.5 py-0.5 bg-amber-950/80 text-amber-300 border border-amber-800">
                    {rec.record_id} // {rec.source_reference}
                  </span>
                  <span className="text-[#64748B] uppercase">{rec.source_type}</span>
                </div>
                <p className="text-[#E0E2E6] line-clamp-2 font-medium">{rec.description}</p>
                <div className="flex items-center justify-between text-[10px] text-[#64748B] font-mono-code font-bold pt-1 border-t border-white/10">
                  <span>{rec.date_time}</span>
                  {rec.amount && (
                    <span className="text-emerald-400 font-black">
                      INR {rec.amount.toLocaleString()}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
