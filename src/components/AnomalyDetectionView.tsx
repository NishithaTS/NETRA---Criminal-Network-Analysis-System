import React, { useState } from 'react';
import { AnomalyAlert, EntityNode, KnowledgeGraphData, SourceRecord } from '../types';
import {
  AlertTriangle,
  FileSpreadsheet,
  ShieldAlert,
  ArrowUpRight,
  Bot,
  Filter,
  CheckCircle2,
  Calendar,
  Flame,
  Info,
} from 'lucide-react';

interface AnomalyDetectionViewProps {
  anomalies: AnomalyAlert[];
  graph: KnowledgeGraphData;
  onSelectNode: (node: EntityNode) => void;
  onInspectRecordById: (recordId: string) => void;
  onAskAiAboutAnomaly: (anomaly: AnomalyAlert) => void;
  onSwitchToGraphTab: () => void;
}

export const AnomalyDetectionView: React.FC<AnomalyDetectionViewProps> = ({
  anomalies,
  graph,
  onSelectNode,
  onInspectRecordById,
  onAskAiAboutAnomaly,
  onSwitchToGraphTab,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const filteredAnomalies = selectedCategory === 'ALL'
    ? anomalies
    : anomalies.filter((a) => a.category === selectedCategory);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-[#000000] border border-white/10 p-6 shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 bg-red-950 text-red-300 border border-red-800 text-[10px] font-mono-code font-bold uppercase tracking-widest">
                STATISTICAL ANOMALY ENGINE
              </span>
              <span className="text-[10px] font-mono-code text-[#71717A] font-bold uppercase">
                SECTION 9 // EXPLAINABLE OUTLIERS
              </span>
            </div>
            <h1 className="text-3xl font-heading font-black text-white tracking-wider uppercase leading-none">
              SUSPICIOUS ANOMALIES & SPIKES
            </h1>
            <p className="text-xs text-[#A1A1AA] mt-2 font-medium">
              Automated behavioral profiling flagging statistical transaction outliers (Z-Score &gt; 2.0σ), multi-user SIM sharing, proxy bank escrow pooling, and rapid ANPR velocities.
            </p>
          </div>

          <div className="bg-[#09090B] px-4 py-2.5 border border-white/15 text-xs font-mono-code text-right">
            <span className="text-[#71717A] block text-[9px] uppercase tracking-wider font-bold">ACTIVE ANOMALIES</span>
            <span className="text-[#DC2626] font-black text-xl leading-tight">{anomalies.length} Flagged Leads</span>
          </div>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {[
          { id: 'ALL', label: 'All Anomalies' },
          { id: 'HIGH_VALUE_TX', label: 'High-Value Financials' },
          { id: 'SHARED_PHONE', label: 'Shared SIM / Phones' },
          { id: 'SHARED_ACCOUNT', label: 'Proxy Accounts' },
          { id: 'RAPID_GEO_MOVEMENT', label: 'Rapid Geo Displacement' },
          { id: 'CROSS_CLUSTER_BRIDGE', label: 'Network Bridges' },
        ].map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3 py-1.5 text-[10px] font-mono-code font-bold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap border ${
              selectedCategory === cat.id
                ? 'bg-[#DC2626] text-white border-[#DC2626]'
                : 'bg-[#000000] text-[#A1A1AA] border-white/10 hover:text-white hover:bg-white/10'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Alerts Grid */}
      <div className="space-y-4">
        {filteredAnomalies.map((alert) => {
          const isCritical = alert.severity === 'critical';
          const isHigh = alert.severity === 'high';

          return (
            <div
              key={alert.id}
              className={`bg-[#000000] border p-5 space-y-4 shadow-xl transition-all ${
                isCritical
                  ? 'border-red-600/70 hover:border-red-500 bg-red-950/20'
                  : isHigh
                  ? 'border-red-900/60 hover:border-red-800'
                  : 'border-white/10 hover:border-white/20'
              }`}
            >
              {/* Alert Header */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-3">
                <div className="flex items-center gap-3">
                  <span
                    className={`w-8 h-8 flex items-center justify-center font-mono-code text-xs font-black ${
                      isCritical
                        ? 'bg-red-950 text-red-300 border border-red-800 animate-pulse'
                        : isHigh
                        ? 'bg-red-950/80 text-red-300 border border-red-800'
                        : 'bg-white/10 text-white border border-white/10'
                    }`}
                  >
                    <AlertTriangle className="w-4 h-4" />
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-heading font-black text-white text-base uppercase tracking-tight">
                        {alert.title}
                      </h3>
                      <span
                        className={`px-2 py-0.5 text-[9px] font-mono-code font-black uppercase tracking-wider ${
                          isCritical
                            ? 'bg-red-900/80 text-red-200 border border-red-600'
                            : 'bg-red-950 text-red-300 border border-red-800'
                        }`}
                      >
                        {alert.severity} SEVERITY
                      </span>
                    </div>
                    <p className="text-[10px] text-[#71717A] font-mono-code font-bold uppercase mt-0.5">
                      Category: <span className="text-[#A1A1AA]">{alert.category}</span> | Timestamp: {alert.timestamp}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onAskAiAboutAnomaly(alert)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 text-[#DC2626] border border-white/15 text-[10px] font-mono-code font-black uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    <Bot className="w-3.5 h-3.5" />
                    <span>Explain with AI</span>
                  </button>
                </div>
              </div>

              {/* Narrative & Statistical Explanation */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="bg-[#09090B] p-4 border border-white/10 space-y-1.5">
                  <span className="text-[9px] font-mono-code text-[#71717A] uppercase block font-bold tracking-wider">
                    Description & Observations:
                  </span>
                  <p className="text-[#A1A1AA] leading-relaxed font-medium">{alert.description}</p>
                </div>

                <div className="bg-[#09090B] p-4 border border-white/10 space-y-1.5">
                  <span className="text-[9px] font-mono-code text-[#DC2626] uppercase block font-bold tracking-wider flex items-center gap-1">
                    <Info className="w-3.5 h-3.5" />
                    Why Flagged by NETRA:
                  </span>
                  <p className="text-white leading-relaxed font-medium">{alert.whyFlagged}</p>
                </div>
              </div>

              {/* Supporting Evidence List & Entity Pins */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs font-mono-code">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-[#71717A] text-[10px] uppercase font-bold tracking-wider">Associated Entities:</span>
                  {alert.entityIds.map((eId) => {
                    const node = graph.nodes.find((n) => n.id === eId);
                    return (
                      <button
                        key={eId}
                        onClick={() => {
                          if (node) onSelectNode(node);
                        }}
                        className="px-2 py-0.5 bg-[#09090B] hover:bg-white/10 text-[#DC2626] border border-white/10 text-[10px] font-mono-code font-bold uppercase cursor-pointer"
                      >
                        {node?.name || eId} ({eId})
                      </button>
                    );
                  })}
                </div>

                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-[#71717A] text-[10px] uppercase font-bold tracking-wider">Source Records:</span>
                  {alert.relevantRecordIds.map((rId) => (
                    <button
                      key={rId}
                      onClick={() => onInspectRecordById(rId)}
                      className="px-2 py-0.5 bg-red-950/70 hover:bg-red-900 text-red-300 border border-red-800/70 text-[10px] font-mono-code font-bold uppercase cursor-pointer"
                    >
                      {rId}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
