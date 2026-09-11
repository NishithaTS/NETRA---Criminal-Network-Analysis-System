import React, { useState, useMemo, useCallback } from 'react';
import { SYNTHETIC_DATASET_300 } from './data/syntheticDataset';
import {
  AnomalyAlert,
  DatasetStats,
  EntityNode,
  GraphLink,
  GraphPath,
  InvestigationCase,
  KnowledgeGraphData,
  SourceRecord,
} from './types';
import {
  buildKnowledgeGraph,
  computeNetworkAnalytics,
  findConnections,
} from './utils/graphEngine';
import { detectAnomalies } from './utils/anomalyEngine';

import { Navbar } from './components/Navbar';
import { KnowledgeGraphView } from './components/KnowledgeGraphView';
import { PathFinderView } from './components/PathFinderView';
import { EntityDirectoryView } from './components/EntityDirectoryView';
import { NetworkAnalyticsView } from './components/NetworkAnalyticsView';
import { AnomalyDetectionView } from './components/AnomalyDetectionView';
import { TimelineView } from './components/TimelineView';
import { CaseManagerView } from './components/CaseManagerView';
import { EntityDossierDrawer } from './components/EntityDossierDrawer';
import { EvidenceModal } from './components/EvidenceModal';
import { AIAssistantDrawer } from './components/AIAssistantDrawer';
import { DataIngestionModal } from './components/DataIngestionModal';
import { ReportGeneratorModal } from './components/ReportGeneratorModal';

export const App: React.FC = () => {
  // Main Dataset State
  const [records, setRecords] = useState<SourceRecord[]>(SYNTHETIC_DATASET_300);

  // Active Navigation Tab
  const [activeTab, setActiveTab] = useState<string>('graph');

  // Interactive Selection State
  const [selectedNode, setSelectedNode] = useState<EntityNode | null>(null);
  const [selectedLink, setSelectedLink] = useState<GraphLink | null>(null);
  const [inspectedRecord, setInspectedRecord] = useState<SourceRecord | null>(null);

  // Path Finder State
  const [sourceId, setSourceId] = useState<string>('P007');
  const [targetId, setTargetId] = useState<string>('P038');
  const [highlightedPath, setHighlightedPath] = useState<GraphPath | null>(null);

  // Modals & Drawers Visibility
  const [isIngestModalOpen, setIsIngestModalOpen] = useState(false);
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  // Investigation Case Files State
  const [cases, setCases] = useState<InvestigationCase[]>([
    {
      id: 'CASE-2026-081',
      title: 'Operation SilverStream Hawala Probe',
      description:
        'Investigation into cross-border trade misinvoicing, cellular proxy pooling, and high-velocity fund structuring between Nhava Sheva port logistics and escrow accounts.',
      leadOfficer: 'Inspector V. R. Sharma (Lead Criminal Analyst)',
      dateCreated: '2026-01-20',
      status: 'active',
      pinnedEntities: ['P007', 'P022', 'P038', 'AC011', 'PH007'],
      pinnedPaths: [],
      pinnedAnomalies: ['ANOM-PHONE-PH007', 'ANOM-ACCT-AC011'],
      notes: [
        {
          id: 'n1',
          author: 'Inspector Sharma',
          timestamp: '2026-01-22 10:30',
          text:
            'Observed direct telecommunication link between P007 and P022 via shared burner PH007. AC011 confirmed as routing conduit to P038.',
          content:
            'Observed direct telecommunication link between P007 and P022 via shared burner PH007. AC011 confirmed as routing conduit to P038.',
        },
        {
          id: 'n2',
          author: 'Analyst K. Nair',
          timestamp: '2026-01-25 15:45',
          text:
            'Z-Score statistical outlier on transaction REC0011 (INR 1.85M) matches invoice discrepancy reported in intel file SRC0011.',
          content:
            'Z-Score statistical outlier on transaction REC0011 (INR 1.85M) matches invoice discrepancy reported in intel file SRC0011.',
        },
      ],
    },
    {
      id: 'CASE-2026-042',
      title: 'Navi Mumbai Port Container Contraband Hub',
      description:
        'Surveillance ANPR correlation and customs declaration audit linking transport vehicles to industrial warehouse depots.',
      leadOfficer: 'DSP A. Deshmukh',
      dateCreated: '2026-01-10',
      status: 'active',
      pinnedEntities: ['P015', 'P029', 'LOC005'],
      pinnedPaths: [],
      pinnedAnomalies: [],
      notes: [],
    },
  ]);

  const [currentCaseId, setCurrentCaseId] = useState<string>('CASE-2026-081');
  const currentCase = useMemo(
    () => cases.find((c) => c.id === currentCaseId) || cases[0],
    [cases, currentCaseId]
  );

  // Compute Knowledge Graph & Graph Analytics
  const graph: KnowledgeGraphData = useMemo(() => {
    const rawGraph = buildKnowledgeGraph(records);
    return rawGraph;
  }, [records]);

  const networkMetrics = useMemo(() => {
    return computeNetworkAnalytics(graph);
  }, [graph]);

  // Compute Anomalies
  const anomalies: AnomalyAlert[] = useMemo(() => {
    return detectAnomalies(records, graph);
  }, [records, graph]);

  // Dataset Statistics
  const stats: DatasetStats = useMemo(() => {
    const uniquePersons = new Set(records.map((r) => r.person_id).filter(Boolean)).size;
    const uniquePhones = new Set(records.map((r) => r.phone_id).filter(Boolean)).size;
    const uniqueAccounts = new Set(records.map((r) => r.account_id).filter(Boolean)).size;
    const uniqueVehicles = new Set(records.map((r) => r.vehicle_id).filter(Boolean)).size;
    const uniqueLocations = new Set(records.map((r) => r.location_id).filter(Boolean)).size;
    const uniqueOrganizations = new Set(records.map((r) => r.organization_id).filter(Boolean)).size;

    return {
      totalRecords: records.length,
      uniquePersons,
      uniquePhones,
      uniqueAccounts,
      uniqueVehicles,
      uniqueLocations,
      uniqueOrganizations,
      totalRelationships: graph.links.length,
      anomaliesDetected: anomalies.length,
    };
  }, [records, graph, anomalies]);

  // 1-Click Demo Execution (SIH 2026 Canonical Test Case: P007 to P038)
  const handleRunDemo = useCallback(() => {
    setSourceId('P007');
    setTargetId('P038');
    setActiveTab('paths');

    const paths = findConnections('P007', 'P038', graph);
    if (paths.length > 0) {
      setHighlightedPath(paths[0]);
    }
  }, [graph]);

  // Node Selection Handlers
  const handleSelectNode = useCallback((node: EntityNode | null) => {
    setSelectedNode(node);
  }, []);

  const handleSelectNodeById = useCallback(
    (nodeId: string) => {
      const found = graph.nodes.find((n) => n.id === nodeId);
      if (found) {
        setSelectedNode(found);
      }
    },
    [graph]
  );

  // Link Selection Handler
  const handleSelectLink = useCallback((link: GraphLink | null) => {
    setSelectedLink(link);
  }, []);

  // Record Inspection Handler
  const handleInspectRecord = useCallback((record: SourceRecord) => {
    setInspectedRecord(record);
  }, []);

  const handleInspectRecordById = useCallback(
    (recordId: string) => {
      const found = records.find((r) => r.record_id === recordId);
      if (found) {
        setInspectedRecord(found);
      }
    },
    [records]
  );

  // Set Path Endpoint
  const handleSetPathEndpoint = useCallback((nodeId: string, role: 'source' | 'target') => {
    if (role === 'source') setSourceId(nodeId);
    if (role === 'target') setTargetId(nodeId);
    setActiveTab('paths');
  }, []);

  // Pin Entity to Active Case
  const handlePinEntityToCase = useCallback(
    (nodeId: string) => {
      setCases((prev) =>
        prev.map((c) => {
          if (c.id === currentCase.id) {
            const hasPin = c.pinnedEntities.includes(nodeId);
            return {
              ...c,
              pinnedEntities: hasPin
                ? c.pinnedEntities.filter((id) => id !== nodeId)
                : [...c.pinnedEntities, nodeId],
            };
          }
          return c;
        })
      );
    },
    [currentCase.id]
  );

  // Bookmark Path to Case
  const handleBookmarkPath = useCallback(
    (path: GraphPath) => {
      setCases((prev) =>
        prev.map((c) => {
          if (c.id === currentCase.id) {
            const exists = c.pinnedPaths.some((p) => p.id === path.id);
            return {
              ...c,
              pinnedPaths: exists ? c.pinnedPaths : [...c.pinnedPaths, path],
            };
          }
          return c;
        })
      );
    },
    [currentCase.id]
  );

  // Add Note to Case
  const handleAddNoteToCase = useCallback(
    (noteContent: string) => {
      const newNote = {
        id: `note-${Date.now()}`,
        author: 'Lead Analyst',
        timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
        text: noteContent,
        content: noteContent,
      };

      setCases((prev) =>
        prev.map((c) => {
          if (c.id === currentCase.id) {
            return { ...c, notes: [newNote, ...c.notes] };
          }
          return c;
        })
      );
    },
    [currentCase.id]
  );

  // Create Case
  const handleCreateCase = useCallback(
    (title: string, description: string, leadOfficer: string) => {
      const newCase: InvestigationCase = {
        id: `CASE-2026-${String(cases.length + 1).padStart(3, '0')}`,
        title,
        description,
        leadOfficer,
        dateCreated: new Date().toISOString().slice(0, 10),
        status: 'active',
        pinnedEntities: [],
        pinnedPaths: [],
        pinnedAnomalies: [],
        notes: [
          {
            id: `n-${Date.now()}`,
            author: leadOfficer,
            timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
            text: 'Case initialized and evidence files attached.',
            content: 'Case initialized and evidence files attached.',
          },
        ],
      };

      setCases((prev) => [newCase, ...prev]);
      setCurrentCaseId(newCase.id);
    },
    [cases.length]
  );

  // Ingestion Handlers
  const handleIngestNewRecords = useCallback((newRecords: SourceRecord[]) => {
    setRecords(newRecords);
    setIsIngestModalOpen(false);
  }, []);

  const handleRestoreDefaultDataset = useCallback(() => {
    setRecords(SYNTHETIC_DATASET_300);
    setIsIngestModalOpen(false);
  }, []);

  // AI Prompt Handlers
  const handleAskAiAboutEntity = useCallback((entity: EntityNode) => {
    setIsAIModalOpen(true);
  }, []);

  const handleAskAiAboutAnomaly = useCallback((anomaly: AnomalyAlert) => {
    setIsAIModalOpen(true);
  }, []);

  return (
    <div className="min-h-screen bg-[#09090B] text-[#F4F4F5] flex flex-col selection:bg-[#DC2626] selection:text-white">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        stats={stats}
        currentCase={currentCase}
        onOpenIngestModal={() => setIsIngestModalOpen(true)}
        onOpenAIModal={() => setIsAIModalOpen(true)}
        onOpenReportModal={() => setIsReportModalOpen(true)}
        onRunDemo={handleRunDemo}
      />

      {/* Main Tab Content */}
      <main className="flex-1">
        {activeTab === 'graph' && (
          <KnowledgeGraphView
            graph={graph}
            selectedNode={selectedNode}
            onSelectNode={handleSelectNode}
            selectedLink={selectedLink}
            onSelectLink={handleSelectLink}
            highlightedPath={highlightedPath}
            onClearHighlightPath={() => setHighlightedPath(null)}
          />
        )}

        {activeTab === 'paths' && (
          <PathFinderView
            graph={graph}
            sourceId={sourceId}
            targetId={targetId}
            setSourceId={setSourceId}
            setTargetId={setTargetId}
            onHighlightPath={(path) => setHighlightedPath(path)}
            onBookmarkPath={handleBookmarkPath}
            onInspectRecord={handleInspectRecord}
            onSelectNode={handleSelectNode}
            onSwitchToGraphTab={() => setActiveTab('graph')}
          />
        )}

        {activeTab === 'search' && (
          <EntityDirectoryView
            graph={graph}
            onSelectNode={handleSelectNode}
            onSetPathEndpoint={handleSetPathEndpoint}
            onPinEntityToCase={handlePinEntityToCase}
            pinnedEntityIds={currentCase.pinnedEntities}
          />
        )}

        {activeTab === 'analytics' && (
          <NetworkAnalyticsView
            metrics={networkMetrics}
            graph={graph}
            onSelectNode={handleSelectNode}
            onSelectCluster={(cluster) => {
              // Focus nodes in cluster
              setActiveTab('graph');
            }}
            onSwitchToGraphTab={() => setActiveTab('graph')}
          />
        )}

        {activeTab === 'anomalies' && (
          <AnomalyDetectionView
            anomalies={anomalies}
            graph={graph}
            onSelectNode={handleSelectNode}
            onInspectRecordById={handleInspectRecordById}
            onAskAiAboutAnomaly={handleAskAiAboutAnomaly}
            onSwitchToGraphTab={() => setActiveTab('graph')}
          />
        )}

        {activeTab === 'timeline' && (
          <TimelineView
            records={records}
            graph={graph}
            onInspectRecord={handleInspectRecord}
            onSelectNodeById={handleSelectNodeById}
          />
        )}

        {activeTab === 'cases' && (
          <CaseManagerView
            cases={cases}
            currentCase={currentCase}
            graph={graph}
            onSelectCase={(c) => setCurrentCaseId(c.id)}
            onCreateCase={handleCreateCase}
            onAddNote={handleAddNoteToCase}
            onUnpinEntity={handlePinEntityToCase}
            onSelectNodeById={handleSelectNodeById}
            onHighlightPath={(path) => setHighlightedPath(path)}
            onSwitchToGraphTab={() => setActiveTab('graph')}
          />
        )}
      </main>

      {/* Entity Dossier Drawer */}
      <EntityDossierDrawer
        node={selectedNode}
        graph={graph}
        records={records}
        onClose={() => setSelectedNode(null)}
        onSelectNode={handleSelectNode}
        onInspectRecord={handleInspectRecord}
        onSetPathEndpoint={handleSetPathEndpoint}
        onPinEntityToCase={handlePinEntityToCase}
        onAskAiAboutEntity={handleAskAiAboutEntity}
        isPinnedInCase={selectedNode ? currentCase.pinnedEntities.includes(selectedNode.id) : false}
      />

      {/* Evidence Traceability Audit Modal */}
      {(inspectedRecord || selectedLink) && (
        <EvidenceModal
          record={inspectedRecord}
          link={selectedLink}
          onClose={() => {
            setInspectedRecord(null);
            setSelectedLink(null);
          }}
        />
      )}

      {/* Gemini AI Assistant Drawer */}
      <AIAssistantDrawer
        isOpen={isAIModalOpen}
        onClose={() => setIsAIModalOpen(false)}
        graph={graph}
        records={records}
        currentCase={currentCase}
        highlightedPath={highlightedPath}
        onSelectEntityById={handleSelectNodeById}
        onHighlightPathByEndpoints={(src, tgt) => {
          setSourceId(src);
          setTargetId(tgt);
          const p = findConnections(src, tgt, graph);
          if (p.length > 0) setHighlightedPath(p[0]);
        }}
      />

      {/* Data Ingestion Modal */}
      <DataIngestionModal
        isOpen={isIngestModalOpen}
        onClose={() => setIsIngestModalOpen(false)}
        currentRecords={records}
        onIngestNewRecords={handleIngestNewRecords}
        onRestoreDefaultDataset={handleRestoreDefaultDataset}
      />

      {/* Summary Report Generator Modal */}
      <ReportGeneratorModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        currentCase={currentCase}
        graph={graph}
        anomalies={anomalies}
        paths={highlightedPath ? [highlightedPath] : []}
        records={records}
      />
    </div>
  );
};

export default App;
