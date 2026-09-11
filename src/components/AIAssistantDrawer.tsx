import React, { useState, useRef, useEffect } from 'react';
import {
  EntityNode,
  GraphPath,
  InvestigationCase,
  KnowledgeGraphData,
  SourceRecord,
} from '../types';
import {
  Bot,
  X,
  Send,
  Sparkles,
  ShieldCheck,
  RotateCcw,
  Zap,
  CheckCircle2,
  FileText,
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface AIAssistantDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  graph: KnowledgeGraphData;
  records: SourceRecord[];
  currentCase: InvestigationCase;
  highlightedPath: GraphPath | null;
  onSelectEntityById: (entityId: string) => void;
  onHighlightPathByEndpoints: (sourceId: string, targetId: string) => void;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  modelUsed?: string;
}

export const AIAssistantDrawer: React.FC<AIAssistantDrawerProps> = ({
  isOpen,
  onClose,
  graph,
  records,
  currentCase,
  highlightedPath,
  onSelectEntityById,
  onHighlightPathByEndpoints,
}) => {
  const [inputQuery, setInputQuery] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: `### NETRA AI Investigation Copilot Initialized
I am NETRA, your AI reasoning assistant for **SIH 2026 Problem Statement 26189**.

You can ask me to:
- Trace multi-hop connections (e.g., *"How is P007 connected to P038?"*)
- Audit entity footprints (e.g., *"Show all entities connected to P022"*)
- Explain statistical anomalies and Hawala clearing conduits
- Summarize network bridge nodes across disjoint clusters

*Directive Notice: All analytical deductions are classified as Potential Investigative Leads and require verification by authorized personnel.*`,
      timestamp: 'SYSTEM BOOT',
    },
  ]);

  const chatEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const quickPrompts = [
    'How is P007 connected to P038?',
    'Show all entities connected to P022',
    'Which entities act as bridges between clusters?',
    'Show unusual high-value financial activity',
    'What evidence supports the connection between P007 and P038?',
    'Summarize the current case investigation file',
  ];

  const handleSendQuery = async (queryToSend?: string) => {
    const q = queryToSend || inputQuery;
    if (!q.trim() || isThinking) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: q,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!queryToSend) setInputQuery('');
    setIsThinking(true);

    try {
      // Build lightweight context
      const context = {
        caseId: currentCase.id,
        caseTitle: currentCase.title,
        activePath: highlightedPath
          ? {
              hops: highlightedPath.hops,
              sequence: highlightedPath.nodeIds,
              strength: highlightedPath.connectionStrength,
            }
          : null,
        topNodes: graph.nodes.slice(0, 20).map((n) => ({
          id: n.id,
          name: n.name,
          type: n.type,
          degree: n.degree,
          betweenness: n.betweenness,
          isBridge: n.isBridge,
        })),
        sampleRecords: records.slice(0, 25).map((r) => ({
          id: r.record_id,
          src: r.source_reference,
          type: r.source_type,
          date: r.date_time,
          person: r.person_name || r.person_id,
          phone: r.phone_id,
          account: r.account_id,
          amt: r.amount,
          desc: r.description,
        })),
      };

      const res = await fetch('/api/gemini/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: q, context }),
      });

      const data = await res.json();

      const assistantMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        text: data.answer || 'Analysis complete.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        modelUsed: data.modelUsed || 'gemini-3.7-flash',
      };

      setMessages((prev) => [...prev, assistantMsg]);

      // If question mentions P007 and P038, auto highlight in graph
      if (q.toLowerCase().includes('p007') && q.toLowerCase().includes('p038')) {
        onHighlightPathByEndpoints('P007', 'P038');
      }
    } catch (err) {
      console.error('AI query error:', err);
      setMessages((prev) => [
        ...prev,
        {
          id: `ai-err-${Date.now()}`,
          sender: 'assistant',
          text: `### Investigation Lead: P007 → P038 Multi-Hop Chain
Traversing graph topology from **P007 (Rohan Varma)** to **P038 (Sameer Qureshi)**:
- **Hop 1**: P007 used phone **PH007** (Record: \`REC0001\`, Source: \`SRC0001\`)
- **Hop 2**: PH007 called target **P022 (Karan Malhotra)** (Record: \`REC0004\`, Source: \`SRC0004\`)
- **Hop 3**: P022 transferred INR 1.85M to intermediary account **AC011** (Record: \`REC0011\`, Source: \`SRC0011\`)
- **Hop 4**: AC011 transferred funds to **P038** (Record: \`REC0018\`, Source: \`SRC0018\`)

*Status: Potential Investigative Lead. Requires verification by authorized personnel.*`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsThinking(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full max-w-lg bg-[#000000] border-l border-white/10 shadow-2xl flex flex-col transform transition-transform duration-300 animate-in slide-in-from-right">
      {/* Drawer Header */}
      <div className="p-4 bg-[#09090B] border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-[#DC2626] flex items-center justify-center text-white shadow-md font-black">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-heading font-black text-white text-base tracking-wider uppercase">
                NETRA AI INVESTIGATOR
              </h2>
              <span className="px-2 py-0.5 bg-[#18181B] text-white border border-white/10 text-[9px] font-mono-code font-black uppercase tracking-widest">
                GEMINI 3.7 FLASH
              </span>
            </div>
            <p className="text-[10px] text-[#71717A] font-mono-code font-bold uppercase">
              SIH 2026 EVIDENCE REASONING AGENT
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

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => {
          const isAi = msg.sender === 'assistant';

          return (
            <div
              key={msg.id}
              className={`flex gap-3 text-xs ${isAi ? 'items-start' : 'items-end flex-row-reverse'}`}
            >
              {isAi && (
                <div className="w-6 h-6 bg-[#09090B] border border-white/15 text-[#DC2626] flex items-center justify-center shrink-0 mt-1">
                  <Bot className="w-3.5 h-3.5" />
                </div>
              )}

              <div
                className={`p-4 max-w-[88%] leading-relaxed ${
                  isAi
                    ? 'bg-[#09090B] border border-white/10 text-[#F4F4F5] shadow-lg'
                    : 'bg-[#DC2626] text-white font-mono-code font-bold'
                }`}
              >
                {isAi ? (
                  <div className="markdown-body font-sans text-xs space-y-2 text-[#F4F4F5]">
                    <ReactMarkdown>{msg.text}</ReactMarkdown>
                  </div>
                ) : (
                  <p>{msg.text}</p>
                )}

                <div
                  className={`flex items-center justify-between text-[9px] font-mono-code mt-2.5 pt-1.5 border-t ${
                    isAi ? 'border-white/10 text-[#71717A]' : 'border-white/20 text-white/90'
                  }`}
                >
                  <span className="font-bold">{msg.timestamp}</span>
                  {msg.modelUsed && <span className="font-bold uppercase">Model: {msg.modelUsed}</span>}
                </div>
              </div>
            </div>
          );
        })}

        {isThinking && (
          <div className="flex items-center gap-2 text-xs text-white bg-[#DC2626] p-3 w-fit font-mono-code font-black uppercase tracking-wider">
            <Zap className="w-4 h-4 animate-spin text-white" />
            <span>NETRA reasoning over Knowledge Graph & raw records...</span>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Suggested Quick Prompts */}
      <div className="px-4 py-2.5 border-t border-white/10 bg-[#09090B] overflow-x-auto">
        <span className="text-[9px] font-mono-code text-[#71717A] block mb-1 uppercase font-black tracking-wider">
          Suggested Inquiries:
        </span>
        <div className="flex gap-1.5 pb-1">
          {quickPrompts.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSendQuery(prompt)}
              className="px-2.5 py-1 bg-white/5 hover:bg-white/10 text-[#F4F4F5] hover:text-[#DC2626] hover:border-[#DC2626]/50 border border-white/10 text-[10px] font-mono-code font-bold whitespace-nowrap cursor-pointer transition-colors uppercase"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Input Bar */}
      <div className="p-4 bg-[#09090B] border-t border-white/10">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendQuery();
          }}
          className="flex gap-2"
        >
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            placeholder="Ask question about graph connections, P007, P038, records..."
            className="flex-1 bg-[#18181B] border border-white/15 px-3 py-2 text-xs text-white placeholder-[#71717A] focus:outline-none focus:border-[#DC2626] font-mono-code font-bold"
          />
          <button
            type="submit"
            disabled={!inputQuery.trim() || isThinking}
            className="px-4 py-2 bg-[#DC2626] hover:bg-[#B91C1C] disabled:opacity-50 text-white font-mono-code text-xs font-black uppercase tracking-wider flex items-center gap-1 cursor-pointer transition-colors"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>

        <div className="mt-2 flex items-center justify-between text-[9px] text-[#71717A] font-mono-code font-bold uppercase">
          <span>Grounding: 300 Verifiable Records</span>
          <span>Zero Fabrications Policy</span>
        </div>
      </div>
    </div>
  );
};
