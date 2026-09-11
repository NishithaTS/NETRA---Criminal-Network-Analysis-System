import React, { useState, useEffect } from 'react';
import {
  EntityNode,
  GraphPath,
  KnowledgeGraphData,
  SourceRecord,
} from '../types';
import { findConnections } from '../utils/graphEngine';
import {
  GitFork,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  FileSpreadsheet,
  Activity,
  BookmarkPlus,
  Eye,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Zap,
} from 'lucide-react';

interface PathFinderViewProps {
  graph: KnowledgeGraphData;
  sourceId: string;
  targetId: string;
  setSourceId: (id: string) => void;
  setTargetId: (id: string) => void;
  onHighlightPath: (path: GraphPath) => void;
  onBookmarkPath: (path: GraphPath) => void;
  onInspectRecord: (record: SourceRecord) => void;
  onSelectNode: (node: EntityNode) => void;
  onSwitchToGraphTab: () => void;
}

export const PathFinderView: React.FC<PathFinderViewProps> = ({
  graph,
  sourceId,
  targetId,
  setSourceId,
  setTargetId,
  onHighlightPath,
  onBookmarkPath,
  onInspectRecord,
  onSelectNode,
  onSwitchToGraphTab,
}) => {
  const [discoveredPaths, setDiscoveredPaths] = useState<GraphPath[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  // Auto-run if source and target are set initially (e.g. P007 -> P038)
  useEffect(() => {
    if (sourceId && targetId) {
      handleSearch();
    }
  }, []);

  const handleSearch = () => {
    if (!sourceId || !targetId) return;
    setIsSearching(true);
    setTimeout(() => {
      const paths = findConnections(sourceId, targetId, graph);
      setDiscoveredPaths(paths);
      setHasSearched(true);
      setIsSearching(false);
      if (paths.length > 0) {
        onHighlightPath(paths[0]);
      }
    }, 150);
  };

  const handleSetDemoCanonical = () => {
    setSourceId('P007');
    setTargetId('P038');
    setIsSearching(true);
    setTimeout(() => {
      const paths = findConnections('P007', 'P038', graph);
      setDiscoveredPaths(paths);
      setHasSearched(true);
      setIsSearching(false);
      if (paths.length > 0) {
        onHighlightPath(paths[0]);
      }
    }, 150);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-[#000000] border border-white/10 p-6 relative overflow-hidden shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 bg-[#18181B] text-white border border-white/10 text-[10px] font-mono-code font-bold uppercase tracking-widest">
                SIH 2026 PS-26189 // SECTION 5
              </span>
              <span className="text-[10px] uppercase font-mono-code text-[#71717A] font-bold">
                GRAPH TRAVERSAL ENGINE
              </span>
            </div>
            <h1 className="text-3xl font-heading font-black tracking-wider uppercase text-white leading-none">
              HIDDEN CONNECTION DETECTION
            </h1>
            <p className="text-xs text-[#A1A1AA] max-w-2xl mt-2 font-medium">
              Traverse multi-hop relationships between disparate target entities across telecommunication, financial escrow, and surveillance logs using BFS & Dijkstra pathfinding.
            </p>
          </div>

          <button
            onClick={handleSetDemoCanonical}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#DC2626] hover:bg-[#B91C1C] text-white font-black uppercase text-xs tracking-wider transition-all cursor-pointer shadow-[0_0_15px_rgba(220,38,38,0.3)] whitespace-nowrap"
          >
            <Sparkles className="w-4 h-4 fill-white text-white" />
            <span>Load Demo Case: P007 → P038</span>
          </button>
        </div>
      </div>

      {/* Traversal Query Form */}
      <div className="bg-[#000000] border border-white/10 p-5 shadow-xl">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
          {/* Source Entity Input */}
          <div className="md:col-span-4 space-y-1.5">
            <label className="text-[11px] font-mono-code text-[#F4F4F5] font-bold tracking-wider flex items-center gap-1.5 uppercase">
              <span className="w-2 h-2 rounded-full bg-blue-400"></span>
              SOURCE ENTITY ID / NAME
            </label>
            <div className="relative">
              <input
                type="text"
                list="entity-list-source"
                value={sourceId}
                onChange={(e) => setSourceId(e.target.value)}
                placeholder="e.g., P007 or Rohan Varma"
                className="w-full bg-[#09090B] border border-white/15 px-3.5 py-2.5 text-xs text-white placeholder-[#71717A] focus:outline-none focus:border-[#DC2626] font-mono-code font-bold"
              />
              <datalist id="entity-list-source">
                {graph.nodes.slice(0, 30).map((n) => (
                  <option key={n.id} value={n.id}>
                    {n.name} ({n.type})
                  </option>
                ))}
              </datalist>
            </div>
          </div>

          {/* Direction Indicator */}
          <div className="md:col-span-1 flex items-center justify-center pb-2">
            <div className="w-9 h-9 bg-[#09090B] border border-white/10 flex items-center justify-center text-[#DC2626]">
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>

          {/* Target Entity Input */}
          <div className="md:col-span-4 space-y-1.5">
            <label className="text-[11px] font-mono-code text-[#F4F4F5] font-bold tracking-wider flex items-center gap-1.5 uppercase">
              <span className="w-2 h-2 rounded-full bg-[#DC2626]"></span>
              TARGET ENTITY ID / NAME
            </label>
            <div className="relative">
              <input
                type="text"
                list="entity-list-target"
                value={targetId}
                onChange={(e) => setTargetId(e.target.value)}
                placeholder="e.g., P038 or Sameer Qureshi"
                className="w-full bg-[#09090B] border border-white/15 px-3.5 py-2.5 text-xs text-white placeholder-[#71717A] focus:outline-none focus:border-[#DC2626] font-mono-code font-bold"
              />
              <datalist id="entity-list-target">
                {graph.nodes.slice(0, 30).map((n) => (
                  <option key={n.id} value={n.id}>
                    {n.name} ({n.type})
                  </option>
                ))}
              </datalist>
            </div>
          </div>

          {/* Action Button */}
          <div className="md:col-span-3">
            <button
              onClick={handleSearch}
              disabled={!sourceId || !targetId || isSearching}
              className={`w-full py-2.5 px-4 font-mono-code text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer ${
                !sourceId || !targetId
                  ? 'bg-white/5 text-[#71717A] cursor-not-allowed border border-white/5'
                  : 'bg-[#DC2626] hover:bg-[#B91C1C] text-white shadow-[0_0_15px_rgba(220,38,38,0.25)]'
              }`}
            >
              {isSearching ? (
                <>
                  <Zap className="w-4 h-4 animate-spin text-white" />
                  <span>Traversing Graph...</span>
                </>
              ) : (
                <>
                  <GitFork className="w-4 h-4" />
                  <span>Find Connection</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Discovered Paths Results Section */}
      {hasSearched && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-heading font-black text-white uppercase tracking-wider flex items-center gap-2">
              <span>DISCOVERED INVESTIGATIVE PATHWAYS ({discoveredPaths.length})</span>
            </h2>
            <div className="text-[10px] font-mono-code text-red-400 bg-red-950/60 border border-red-800 px-3 py-1 font-bold uppercase tracking-wider">
              CLASSIFICATION: POTENTIAL INVESTIGATIVE LEAD
            </div>
          </div>

          {discoveredPaths.length === 0 ? (
            <div className="p-8 bg-[#000000] border border-white/10 text-center space-y-2">
              <AlertTriangle className="w-8 h-8 text-amber-400 mx-auto" />
              <h3 className="text-white font-bold text-sm">No Graph Path Discovered</h3>
              <p className="text-xs text-[#A1A1AA] max-w-md mx-auto">
                No direct or multi-hop path within 6 hops exists between {sourceId} and {targetId} in the current dataset.
              </p>
            </div>
          ) : (
            discoveredPaths.map((path, pIdx) => (
              <div
                key={path.id}
                className="bg-[#000000] border border-white/10 p-5 space-y-5 shadow-2xl transition-all hover:border-[#DC2626]/50"
              >
                {/* Path Header Meta */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2.5">
                    <span className="w-7 h-7 bg-[#09090B] border border-white/15 text-[#DC2626] flex items-center justify-center font-mono-code text-xs font-black">
                      #{pIdx + 1}
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-heading font-black text-white text-base uppercase tracking-wide">
                          {path.hops}-Hop Relational Chain
                        </span>
                        <span className="px-2 py-0.5 bg-red-950 text-red-300 border border-red-800 text-[10px] font-mono-code font-black">
                          STRENGTH: {path.connectionStrength}%
                        </span>
                      </div>
                      <p className="text-[11px] text-[#71717A] font-mono-code">
                        Supported by {path.supportingRecords.length} verifiable raw source records
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        onHighlightPath(path);
                        onSwitchToGraphTab();
                      }}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 text-white border border-white/15 text-xs font-mono-code font-bold uppercase tracking-wider transition-colors cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5 text-[#DC2626]" />
                      <span>View in Graph</span>
                    </button>

                    <button
                      onClick={() => onBookmarkPath(path)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-red-950/40 hover:bg-red-950/80 text-red-300 border border-red-800 text-xs font-mono-code font-bold uppercase tracking-wider transition-colors cursor-pointer"
                    >
                      <BookmarkPlus className="w-3.5 h-3.5" />
                      <span>Pin to Case</span>
                    </button>
                  </div>
                </div>

                {/* Step-by-Step Hop Visualizer */}
                <div className="overflow-x-auto py-2">
                  <div className="flex items-center gap-2 min-w-max">
                    {path.nodes.map((node, nIdx) => {
                      const isLast = nIdx === path.nodes.length - 1;
                      const link = path.links[nIdx];

                      return (
                        <React.Fragment key={node.id}>
                          {/* Node Card */}
                          <div
                            onClick={() => onSelectNode(node)}
                            className="bg-[#09090B] hover:bg-[#18181B] border border-white/10 hover:border-[#DC2626]/60 p-3.5 w-52 transition-all cursor-pointer shadow-md"
                          >
                            <div className="flex items-center justify-between text-[10px] font-mono-code mb-1">
                              <span className="px-1.5 py-0.5 bg-white/10 text-white font-bold uppercase tracking-wider">
                                {node.type}
                              </span>
                              <span className="text-[#71717A] font-bold">HOP {nIdx}</span>
                            </div>
                            <h4 className="font-black text-white text-xs truncate uppercase tracking-tight">{node.name}</h4>
                            <span className="text-[11px] text-[#DC2626] font-mono-code font-bold block mt-0.5">
                              {node.id}
                            </span>
                          </div>

                          {/* Edge Connector in Noir Red */}
                          {!isLast && link && (
                            <div className="flex flex-col items-center px-1">
                              <span className="text-[9px] font-mono-code font-black text-white px-2 py-0.5 bg-[#DC2626] whitespace-nowrap mb-1 uppercase tracking-wider">
                                {link.type}
                              </span>
                              <div className="flex items-center text-[#DC2626]">
                                <div className="w-8 h-[2px] bg-[#DC2626]"></div>
                                <ArrowRight className="w-4 h-4 -ml-1 text-[#DC2626]" />
                              </div>
                              <span className="text-[9px] font-mono-code text-[#71717A] mt-1 font-bold">
                                {link.sourceReferences[0] || 'SRC'}
                              </span>
                            </div>
                          )}
                        </React.Fragment>
                      );
                    })}
                  </div>
                </div>

                {/* Supporting Source Records Accordion / List */}
                <div className="bg-[#09090B] border border-white/10 p-4 space-y-2.5">
                  <h4 className="text-xs font-bold text-[#F4F4F5] font-mono-code uppercase tracking-wider flex items-center gap-1.5">
                    <FileSpreadsheet className="w-3.5 h-3.5 text-[#DC2626]" />
                    Supporting Evidence Records ({path.supportingRecords.length})
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {path.supportingRecords.map((rec) => (
                      <div
                        key={rec.record_id}
                        onClick={() => onInspectRecord(rec)}
                        className="p-3 bg-[#000000] hover:bg-[#18181B] border border-white/10 cursor-pointer transition-colors text-xs space-y-1"
                      >
                        <div className="flex items-center justify-between text-[10px] font-mono-code">
                          <span className="text-[#DC2626] font-bold">
                            {rec.record_id} [{rec.source_reference}]
                          </span>
                          <span className="text-[#A1A1AA] font-bold uppercase">{rec.source_type}</span>
                        </div>
                        <p className="text-[#F4F4F5] text-[11px] line-clamp-1 font-medium">{rec.description}</p>
                        <div className="text-[9px] text-[#71717A] font-mono-code flex justify-between font-bold">
                          <span>{rec.date_time}</span>
                          {rec.amount && (
                            <span className="text-emerald-400 font-black">INR {rec.amount.toLocaleString()}</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Analytical Legal Disclaimer Requirement */}
                <div className="p-3 bg-[#09090B] border border-white/10 text-[11px] text-[#A1A1AA] font-mono-code flex items-start gap-2">
                  <ShieldAlert className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                  <span>
                    <strong>Investigative Caution</strong>: The identified multi-hop path reflects structural connectivity in the synthetic intelligence dataset. Relationships are classified as <strong>Potential Investigative Leads</strong> and must be corroborated by authorized field personnel prior to evidentiary submission.
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};
