import React from 'react';
import {
  EntityNode,
  KnowledgeGraphData,
  NetworkCluster,
  NetworkMetrics,
} from '../types';
import {
  Radio,
  Network,
  GitBranch,
  Shield,
  Activity,
  Layers,
  ArrowUpRight,
  Sparkles,
  Award,
  Globe,
  Phone,
  Landmark,
  Building,
} from 'lucide-react';

interface NetworkAnalyticsViewProps {
  metrics: NetworkMetrics;
  graph: KnowledgeGraphData;
  onSelectNode: (node: EntityNode) => void;
  onSelectCluster: (cluster: NetworkCluster) => void;
  onSwitchToGraphTab: () => void;
}

export const NetworkAnalyticsView: React.FC<NetworkAnalyticsViewProps> = ({
  metrics,
  graph,
  onSelectNode,
  onSelectCluster,
  onSwitchToGraphTab,
}) => {
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-[#000000] border border-white/10 p-6 shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 bg-[#18181B] text-white border border-white/10 text-[10px] font-mono-code font-bold uppercase tracking-widest">
                GRAPH TOPOLOGY & ANALYTICS
              </span>
              <span className="text-[10px] font-mono-code text-[#71717A] font-bold uppercase">
                SECTIONS 8 & 10 // EXPLAINABLE ALGORITHMS
              </span>
            </div>
            <h1 className="text-3xl font-heading font-black text-white tracking-wider uppercase leading-none">
              NETWORK CENTRALITY & CLUSTERS
            </h1>
            <p className="text-xs text-[#A1A1AA] mt-2 font-medium">
              Automated mathematical topology analysis calculating Degree, Betweenness (Brandes), Network Bridge articulation points, and Louvain modularity clusters.
            </p>
          </div>
        </div>
      </div>

      {/* Top Level Metric Cards with Bold Numerals */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          { label: 'TOTAL NODES', val: metrics.totalNodes, sub: 'Extracted Entities' },
          { label: 'TOTAL RELATIONSHIPS', val: metrics.totalEdges, sub: 'Graph Edges' },
          { label: 'AVG DEGREE', val: metrics.avgDegree, sub: 'Connections / Node' },
          { label: 'GRAPH DENSITY', val: metrics.density, sub: 'Edge Saturation' },
          { label: 'SUB-CLUSTERS', val: metrics.clusters.length, sub: 'Communities' },
          { label: 'POTENTIAL BRIDGES', val: metrics.potentialBridges.length, sub: 'Inter-Cluster Hubs' },
        ].map((item, idx) => (
          <div
            key={idx}
            className="bg-[#000000] border border-white/10 p-4 space-y-1 shadow-md"
          >
            <span className="text-[9px] font-mono-code text-[#71717A] block font-bold uppercase tracking-wider">
              {item.label}
            </span>
            <span className="text-2xl font-black text-[#DC2626] font-mono-code leading-tight block">
              {item.val}
            </span>
            <span className="text-[10px] text-[#A1A1AA] block font-medium">{item.sub}</span>
          </div>
        ))}
      </div>

      {/* Grid: Centrality Leaderboard & Potential Bridges */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Highest Degree Centrality Entities */}
        <div className="bg-[#000000] border border-white/10 p-5 space-y-4 shadow-2xl">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h2 className="text-xs font-heading font-black text-white uppercase tracking-wider flex items-center gap-2">
              <Award className="w-4 h-4 text-[#DC2626]" />
              <span>HIGHLY CONNECTED ENTITIES (DEGREE)</span>
            </h2>
          </div>

          <div className="space-y-2">
            {metrics.highestDegreeEntities.slice(0, 6).map((node, idx) => (
              <div
                key={node.id}
                onClick={() => onSelectNode(node)}
                className="p-3 bg-[#09090B] hover:bg-[#18181B] border border-white/10 hover:border-[#DC2626]/50 flex items-center justify-between cursor-pointer transition-all group"
              >
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 bg-[#18181B] text-[#DC2626] border border-white/10 flex items-center justify-center text-xs font-black font-mono-code">
                    #{idx + 1}
                  </span>
                  <div>
                    <h4 className="font-black text-xs text-white group-hover:text-[#DC2626] transition-colors uppercase tracking-tight font-heading">
                      {node.name}
                    </h4>
                    <span className="text-[10px] text-[#71717A] font-mono-code font-bold">
                      ID: {node.id} | Type: {node.type} | Cluster #{node.clusterId}
                    </span>
                  </div>
                </div>

                <div className="text-right font-mono-code">
                  <span className="px-2 py-0.5 bg-red-950 text-red-300 border border-red-800 text-[11px] font-black block">
                    {node.degree} Connections
                  </span>
                  <span className="text-[10px] text-[#71717A] font-bold">Betw: {node.betweenness}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Potential Network Bridges */}
        <div className="bg-[#000000] border border-white/10 p-5 space-y-4 shadow-2xl">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h2 className="text-xs font-heading font-black text-white uppercase tracking-wider flex items-center gap-2">
              <GitBranch className="w-4 h-4 text-[#DC2626]" />
              <span>POTENTIAL NETWORK BRIDGES (BETWEENNESS)</span>
            </h2>
          </div>

          <div className="space-y-2">
            {metrics.potentialBridges.length === 0 ? (
              <p className="text-xs text-[#71717A] italic">No critical articulation bridges detected.</p>
            ) : (
              metrics.potentialBridges.slice(0, 6).map((node, idx) => (
                <div
                  key={node.id}
                  onClick={() => onSelectNode(node)}
                  className="p-3 bg-[#09090B] hover:bg-[#18181B] border border-white/10 hover:border-[#DC2626]/50 flex items-center justify-between cursor-pointer transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 bg-red-950/80 border border-red-800 text-red-300 flex items-center justify-center text-xs font-black font-mono-code">
                      B{idx + 1}
                    </span>
                    <div>
                      <h4 className="font-black text-xs text-white group-hover:text-red-400 transition-colors uppercase tracking-tight font-heading">
                        {node.name}
                      </h4>
                      <span className="text-[10px] text-[#71717A] font-mono-code font-bold">
                        ID: {node.id} | Bridge Node Across Sub-Networks
                      </span>
                    </div>
                  </div>

                  <div className="text-right font-mono-code">
                    <span className="px-2 py-0.5 bg-red-950/80 text-red-300 border border-red-800 text-[11px] font-bold block">
                      Betw: {node.betweenness}
                    </span>
                    <span className="text-[10px] text-[#71717A] font-bold">{node.degree} links</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Network Clusters Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-heading font-black text-white uppercase tracking-wider flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#DC2626]" />
              <span>DETECTED RELATIONSHIP CLUSTERS ({metrics.clusters.length})</span>
            </h2>
            <p className="text-xs text-[#71717A] font-mono-code mt-0.5 font-bold">
              Community partition groups sharing common phones, accounts, locations, and freight corridors.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {metrics.clusters.map((cluster) => (
            <div
              key={cluster.id}
              className="bg-[#000000] border border-white/10 hover:border-[#DC2626]/50 p-5 space-y-4 transition-all shadow-xl flex flex-col justify-between"
            >
              <div>
                {/* Cluster Card Header */}
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2.5 py-0.5 bg-[#18181B] text-white border border-white/10 text-[9px] font-mono-code font-black uppercase tracking-wider">
                    CLUSTER #{cluster.id}
                  </span>
                  <span className="text-[10px] font-mono-code text-[#71717A] font-bold">
                    {cluster.totalEntities} Entities | {cluster.totalRelationships} Links
                  </span>
                </div>

                <h3 className="font-heading font-black text-white text-base uppercase tracking-tight">{cluster.name}</h3>

                {/* Key Entities */}
                <div className="mt-3 space-y-1.5">
                  <span className="text-[9px] font-mono-code text-[#71717A] uppercase block font-bold tracking-wider">
                    Core Anchor Entities:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {cluster.keyEntities.map((ke) => (
                      <span
                        key={ke.id}
                        onClick={() => onSelectNode(ke)}
                        className="px-2 py-0.5 bg-[#09090B] hover:bg-[#18181B] text-white text-[10px] font-mono-code font-bold uppercase cursor-pointer border border-white/10"
                      >
                        {ke.name} ({ke.id})
                      </span>
                    ))}
                  </div>
                </div>

                {/* Common Attributes */}
                <div className="mt-3 space-y-1.5 text-[10px] font-mono-code text-[#A1A1AA]">
                  {cluster.commonLocations.length > 0 && (
                    <div className="flex items-center gap-1.5 truncate">
                      <Globe className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span className="truncate">{cluster.commonLocations.join(', ')}</span>
                    </div>
                  )}
                  {cluster.commonPhones.length > 0 && (
                    <div className="flex items-center gap-1.5 truncate">
                      <Phone className="w-3.5 h-3.5 text-red-400 shrink-0" />
                      <span className="truncate">{cluster.commonPhones.join(', ')}</span>
                    </div>
                  )}
                  {cluster.commonAccounts.length > 0 && (
                    <div className="flex items-center gap-1.5 truncate">
                      <Landmark className="w-3.5 h-3.5 text-[#DC2626] shrink-0" />
                      <span className="truncate">{cluster.commonAccounts.join(', ')}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-3 border-t border-white/10 flex justify-end">
                <button
                  onClick={() => {
                    onSelectCluster(cluster);
                    onSwitchToGraphTab();
                  }}
                  className="flex items-center gap-1 px-3 py-1.5 bg-white/5 hover:bg-white/10 text-[#DC2626] border border-white/15 text-[10px] font-mono-code font-black uppercase tracking-wider transition-colors cursor-pointer"
                >
                  <span>Explore in Knowledge Graph</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
