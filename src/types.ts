export type SourceType =
  | 'FIR'
  | 'CDR'
  | 'Financial'
  | 'Surveillance'
  | 'Social Media'
  | 'Criminal History'
  | 'Intel Report'
  | string;

export type EntityType =
  | 'Person'
  | 'Phone'
  | 'Bank Account'
  | 'Vehicle'
  | 'Location'
  | 'Organization'
  | 'FIR'
  | 'Event'
  | 'Report';

export type RelationshipType =
  | 'CALLED'
  | 'RECEIVED_CALL'
  | 'USED_PHONE'
  | 'TRANSFERRED_TO'
  | 'ACCOUNT_LINK'
  | 'VISITED'
  | 'OBSERVED_AT'
  | 'ASSOCIATED_WITH'
  | 'MENTIONED_IN'
  | 'INTERACTED_WITH'
  | 'GROUP_MEMBER'
  | 'PREVIOUS_CASE'
  | 'LINKED_TO'
  | string;

export interface SourceRecord {
  record_id: string;
  source_type: SourceType;
  date_time: string;
  person_id?: string;
  person_name?: string;
  phone_id?: string;
  account_id?: string;
  vehicle_id?: string;
  location_id?: string;
  location_name?: string;
  organization_id?: string;
  organization_name?: string;
  related_entity?: string;
  relationship: RelationshipType;
  amount?: number | null;
  description: string;
  source_reference: string;
}

export interface EntityNode {
  id: string;
  name: string;
  type: EntityType;
  relatedRecords: string[];
  relationships: {
    targetId: string;
    type: RelationshipType;
    recordId: string;
    sourceRef: string;
  }[];
  firstSeen: string;
  lastSeen: string;
  degree: number;
  betweenness: number;
  closeness?: number;
  clusterId: number;
  isBridge?: boolean;
  isHighCentrality?: boolean;
  metadata?: Record<string, any>;
  // D3 physics simulation coordinates
  x?: number;
  y?: number;
  vx?: number;
  vy?: number;
  fx?: number | null;
  fy?: number | null;
}

export interface GraphLink {
  id: string;
  source: string | EntityNode;
  target: string | EntityNode;
  type: RelationshipType;
  recordIds: string[];
  sourceReferences: string[];
  amount?: number | null;
  weight: number;
  records: SourceRecord[];
}

export interface KnowledgeGraphData {
  nodes: EntityNode[];
  links: GraphLink[];
  totalRecords: number;
  generatedAt: string;
}

export interface GraphPath {
  id: string;
  sourceId: string;
  targetId: string;
  nodeIds: string[];
  nodes: EntityNode[];
  links: GraphLink[];
  hops: number;
  relationshipSequence: string[];
  supportingRecords: SourceRecord[];
  sourceReferences: string[];
  connectionStrength: number; // 0 to 100
  explanation: string;
  isLead: boolean;
}

export type AnomalyCategory =
  | 'HIGH_VALUE_TX'
  | 'SHARED_PHONE'
  | 'SHARED_ACCOUNT'
  | 'RAPID_GEO_MOVEMENT'
  | 'CDR_BURST'
  | 'HUB_CONCENTRATION'
  | 'CROSS_CLUSTER_BRIDGE';

export interface AnomalyAlert {
  id: string;
  title: string;
  category: AnomalyCategory;
  severity: 'critical' | 'high' | 'medium' | 'low';
  description: string;
  whyFlagged: string;
  entityIds: string[];
  entityNames: string[];
  relevantRecordIds: string[];
  sourceReferences: string[];
  timestamp: string;
  supportingEvidence: string[];
}

export interface NetworkCluster {
  id: number;
  name: string;
  entityIds: string[];
  entities: EntityNode[];
  totalEntities: number;
  totalRelationships: number;
  keyEntities: EntityNode[];
  commonLocations: string[];
  commonPhones: string[];
  commonAccounts: string[];
  commonOrganizations: string[];
}

export interface NetworkMetrics {
  totalNodes: number;
  totalEdges: number;
  density: number;
  connectedComponentsCount: number;
  avgDegree: number;
  highestDegreeEntities: EntityNode[];
  potentialBridges: EntityNode[];
  clusters: NetworkCluster[];
}

export interface CaseNote {
  id: string;
  timestamp: string;
  author: string;
  text: string;
  content?: string;
}

export interface InvestigationCase {
  id: string;
  title: string;
  description: string;
  createdAt?: string;
  dateCreated?: string;
  updatedAt?: string;
  status: 'Active' | 'Under Review' | 'Escalated' | 'Closed' | 'active';
  investigator?: string;
  leadOfficer?: string;
  pinnedEntityIds?: string[];
  pinnedEntities: string[];
  pinnedRelationshipIds?: string[];
  bookmarkedPaths?: GraphPath[];
  pinnedPaths: GraphPath[];
  pinnedAnomalyIds?: string[];
  pinnedAnomalies?: string[];
  notes: CaseNote[];
  aiSummary?: string;
}

export interface DatasetStats {
  totalRecords: number;
  recordsBySource?: Record<string, number>;
  uniquePersons: number;
  uniquePhones: number;
  uniqueAccounts: number;
  uniqueVehicles: number;
  uniqueLocations: number;
  uniqueOrganizations: number;
  uniqueFIRs?: number;
  uniqueIntelReports?: number;
  totalRelationships?: number;
  anomaliesDetected?: number;
}
