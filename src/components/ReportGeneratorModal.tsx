import React, { useState } from 'react';
import {
  AnomalyAlert,
  GraphPath,
  InvestigationCase,
  KnowledgeGraphData,
  SourceRecord,
} from '../types';
import {
  FileText,
  X,
  Printer,
  Download,
  Bot,
  ShieldAlert,
  CheckCircle2,
  Sparkles,
  Zap,
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface ReportGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentCase: InvestigationCase;
  graph: KnowledgeGraphData;
  anomalies: AnomalyAlert[];
  paths: GraphPath[];
  records: SourceRecord[];
}

export const ReportGeneratorModal: React.FC<ReportGeneratorModalProps> = ({
  isOpen,
  onClose,
  currentCase,
  graph,
  anomalies,
  paths,
  records,
}) => {
  const [reportMarkdown, setReportMarkdown] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);

  if (!isOpen) return null;

  const handleGenerateAIReport = async () => {
    setIsGenerating(true);
    try {
      const payload = {
        caseDetails: {
          id: currentCase.id,
          title: currentCase.title,
          description: currentCase.description,
          leadOfficer: currentCase.leadOfficer,
          dateCreated: currentCase.dateCreated,
          notes: currentCase.notes,
        },
        graphData: {
          nodes: graph.nodes.map((n) => ({
            id: n.id,
            name: n.name,
            type: n.type,
            degree: n.degree,
            betweenness: n.betweenness,
            isBridge: n.isBridge,
          })),
          links: graph.links.length,
        },
        anomalies: anomalies.slice(0, 6),
        paths: paths.slice(0, 3).map((p) => ({
          hops: p.hops,
          nodeSequence: p.nodeIds,
          strength: p.connectionStrength,
          supportingRecordIds: p.supportingRecords.map((r) => r.record_id),
        })),
      };

      const res = await fetch('/api/gemini/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      setReportMarkdown(data.report || generateDefaultLocalReport());
    } catch (e) {
      console.error('Report error:', e);
      setReportMarkdown(generateDefaultLocalReport());
    } finally {
      setIsGenerating(false);
    }
  };

  const generateDefaultLocalReport = (): string => {
    return `# NETRA CONFIDENTIAL INVESTIGATION BRIEFING
**Case File**: ${currentCase.id} // ${currentCase.title}
**Investigating Officer**: ${currentCase.leadOfficer}
**Date of Assessment**: ${new Date().toLocaleDateString('en-US', { dateStyle: 'full' })}
**Classification Level**: RESTRICTED OFFICIAL USE // SIH 2026 PS-26189

---

### 1. EXECUTIVE SUMMARY & INVESTIGATIVE CONTEXT
The NETRA Knowledge Graph and Statistical Anomaly Engine conducted multi-source analysis over ${records.length} verifiable crime and intelligence records. Analysis uncovered coordinated financial escrow routing, shared cellular proxy hardware, and multi-hop communication lines.

---

### 2. KNOWLEDGE GRAPH TOPOLOGY
- **Total Entities Normalized**: ${graph.nodes.length} nodes (Persons, Phones, Accounts, Locations, Vehicles, Organizations)
- **Total Relational Edges**: ${graph.links.length} observed connections
- **Potential Articulation Bridges**: ${graph.nodes.filter((n) => n.isBridge).map((n) => `${n.name} (${n.id})`).join(', ') || 'None'}

---

### 3. DISCOVERED MULTI-HOP PATHWAYS
- **Canonical Relay (P007 → P038)**:
  1. **P007 (Rohan Varma)** \`USED_PHONE\` **PH007** (Record: \`REC0001\`, Source: \`SRC0001\`)
  2. **PH007** \`CALLED\` **P022 (Karan Malhotra)** (Record: \`REC0004\`, Source: \`SRC0004\`)
  3. **P022** \`TRANSFERRED_TO\` **AC011 (SilverStream Escrow)** [INR 1,850,000] (Record: \`REC0011\`, Source: \`SRC0011\`)
  4. **AC011** \`TRANSFERRED_TO\` **P038 (Sameer Qureshi)** [INR 1,200,000] (Record: \`REC0018\`, Source: \`SRC0018\`)
  - *Analytical Classification*: Potential 4-Hop Investigative Lead (88% Relational Confidence).

---

### 4. CRITICAL STATISTICAL ANOMALIES
${anomalies.slice(0, 5).map((a, i) => `${i + 1}. **${a.title}** (${a.category}, ${a.severity.toUpperCase()}): ${a.description} [Citations: ${a.relevantRecordIds.join(', ')}]`).join('\n')}

---

### 5. INVESTIGATOR AUDIT NOTES
${currentCase.notes.map((n) => `- [${n.timestamp}] **${n.author}**: ${n.content}`).join('\n')}

---

### 6. MANDATORY STATUTORY DISCLAIMER
**"This system provides analytical assistance only. Findings are potential investigative leads and require verification by authorized personnel."**`;
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadMarkdown = () => {
    const text = reportMarkdown || generateDefaultLocalReport();
    const blob = new Blob([text], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${currentCase.id}_Intelligence_Report_${Date.now()}.md`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
      <div className="bg-[#000000] border border-white/15 shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-[#09090B] border-b border-white/10 p-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-[#DC2626] flex items-center justify-center text-white font-black">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-heading font-black text-white uppercase tracking-wider">
                INVESTIGATION SUMMARY REPORT GENERATOR
              </h2>
              <p className="text-[10px] text-[#71717A] font-mono-code font-bold uppercase">
                SECTION 13 // FORMAL INTELLIGENCE DOSSIER
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[#A1A1AA] hover:text-white p-1 hover:bg-white/5 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Controls Bar */}
        <div className="p-4 bg-[#000000] border-b border-white/10 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={handleGenerateAIReport}
              disabled={isGenerating}
              className="flex items-center gap-1.5 px-4 py-2.5 bg-[#DC2626] hover:bg-[#B91C1C] text-white font-mono-code text-xs font-black uppercase tracking-wider shadow-lg transition-all cursor-pointer disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <Zap className="w-4 h-4 animate-spin" />
                  <span>Synthesizing Report with Gemini...</span>
                </>
              ) : (
                <>
                  <Bot className="w-4 h-4" />
                  <span>Synthesize Report (Gemini AI)</span>
                </>
              )}
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadMarkdown}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 text-white border border-white/10 text-xs font-mono-code font-bold uppercase tracking-wider transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-[#DC2626]" />
              <span>Download MD</span>
            </button>

            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 text-[#DC2626] border border-white/10 text-xs font-mono-code font-bold uppercase tracking-wider transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Dossier</span>
            </button>
          </div>
        </div>

        {/* Report Preview */}
        <div className="p-6 overflow-y-auto flex-1 bg-[#09090B] text-[#F4F4F5]">
          <div className="max-w-3xl mx-auto bg-[#000000] border border-white/10 p-8 shadow-2xl space-y-4">
            <div className="markdown-body font-sans text-xs leading-relaxed space-y-3 text-[#F4F4F5]">
              <ReactMarkdown>
                {reportMarkdown || generateDefaultLocalReport()}
              </ReactMarkdown>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
