import { AnomalyAlert, KnowledgeGraphData, SourceRecord } from '../types';

export function detectAnomalies(records: SourceRecord[], graph: KnowledgeGraphData): AnomalyAlert[] {
  const alerts: AnomalyAlert[] = [];
  const nodeMap = new Map<string, any>();
  graph.nodes.forEach((n) => nodeMap.set(n.id, n));

  // 1. HIGH VALUE FINANCIAL OUTLIERS (Statistical Z-Score)
  const financialRecords = records.filter((r) => r.source_type === 'Financial' && typeof r.amount === 'number' && r.amount > 0);
  if (financialRecords.length > 0) {
    const amounts = financialRecords.map((r) => r.amount!);
    const mean = amounts.reduce((a, b) => a + b, 0) / amounts.length;
    const variance = amounts.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / amounts.length;
    const stdDev = Math.sqrt(variance) || 1;

    financialRecords.forEach((rec) => {
      const zScore = (rec.amount! - mean) / stdDev;
      if (zScore > 2.0 || rec.amount! >= 5000000) {
        const entityName = rec.person_name || nodeMap.get(rec.person_id || '')?.name || rec.account_id || 'Entity';
        alerts.push({
          id: `ANOM-TX-${rec.record_id}`,
          title: `Unusual High-Value Transaction Flag (INR ${rec.amount!.toLocaleString()})`,
          category: 'HIGH_VALUE_TX',
          severity: rec.amount! > 8000000 ? 'critical' : 'high',
          description: `Transaction amount of INR ${rec.amount!.toLocaleString()} exceeds statistical standard baseline (Z-Score: +${zScore.toFixed(2)}σ above average INR ${Math.round(mean).toLocaleString()}).`,
          whyFlagged: `Statistical outlier in financial velocity. The transaction amount represents an acute spike compared to typical ledger thresholds.`,
          entityIds: [rec.person_id || '', rec.account_id || '', rec.related_entity || ''].filter(Boolean),
          entityNames: [entityName, rec.account_id || '', rec.related_entity || ''].filter(Boolean),
          relevantRecordIds: [rec.record_id],
          sourceReferences: [rec.source_reference],
          timestamp: rec.date_time,
          supportingEvidence: [
            `Record ${rec.record_id} (${rec.source_reference}): ${rec.description}`,
            `Statistical Z-Score: ${zScore.toFixed(2)}σ`,
            `Source Type: ${rec.source_type}`,
          ],
        });
      }
    });
  }

  // 2. SHARED IDENTIFIER / PHONE HUBS (Multiple persons using same phone)
  const phoneToPersons = new Map<string, Set<string>>();
  const phoneRecords = new Map<string, SourceRecord[]>();

  records.forEach((r) => {
    if (r.phone_id && r.person_id) {
      if (!phoneToPersons.has(r.phone_id)) phoneToPersons.set(r.phone_id, new Set());
      phoneToPersons.get(r.phone_id)!.add(r.person_id);

      if (!phoneRecords.has(r.phone_id)) phoneRecords.set(r.phone_id, []);
      phoneRecords.get(r.phone_id)!.push(r);
    }
  });

  phoneToPersons.forEach((personSet, phoneId) => {
    if (personSet.size >= 2) {
      const recs = phoneRecords.get(phoneId) || [];
      const personIds = Array.from(personSet);
      const names = personIds.map((pId) => nodeMap.get(pId)?.name || pId);

      alerts.push({
        id: `ANOM-PHONE-${phoneId}`,
        title: `Shared Telephony Terminal (${phoneId} used by ${personSet.size} distinct entities)`,
        category: 'SHARED_PHONE',
        severity: personSet.size >= 3 ? 'critical' : 'high',
        description: `Cellular device / SIM identifier ${phoneId} has been registered as active across ${personSet.size} unique person entities (${names.join(', ')}).`,
        whyFlagged: `Indicative of potential proxy communication or shared burner hardware among syndicate co-associates.`,
        entityIds: [phoneId, ...personIds],
        entityNames: [phoneId, ...names],
        relevantRecordIds: recs.map((r) => r.record_id).slice(0, 5),
        sourceReferences: Array.from(new Set(recs.map((r) => r.source_reference))).slice(0, 5),
        timestamp: recs[0]?.date_time || '2026-01-15 12:00:00',
        supportingEvidence: recs.slice(0, 4).map((r) => `${r.record_id} (${r.source_type}): ${r.description}`),
      });
    }
  });

  // 3. SHARED BANK ACCOUNT / PROXY CLEARING
  const accountToPersons = new Map<string, Set<string>>();
  const accountRecs = new Map<string, SourceRecord[]>();

  records.forEach((r) => {
    if (r.account_id && r.person_id) {
      if (!accountToPersons.has(r.account_id)) accountToPersons.set(r.account_id, new Set());
      accountToPersons.get(r.account_id)!.add(r.person_id);

      if (!accountRecs.has(r.account_id)) accountRecs.set(r.account_id, []);
      accountRecs.get(r.account_id)!.push(r);
    }
  });

  accountToPersons.forEach((personSet, accountId) => {
    if (personSet.size >= 2) {
      const recs = accountRecs.get(accountId) || [];
      const personIds = Array.from(personSet);
      const names = personIds.map((pId) => nodeMap.get(pId)?.name || pId);

      alerts.push({
        id: `ANOM-ACCT-${accountId}`,
        title: `Multi-Signatory Account Co-Usage (${accountId})`,
        category: 'SHARED_ACCOUNT',
        severity: 'high',
        description: `Bank account ${accountId} (e.g., SilverStream / Escrow) linked directly to transactions of multiple distinct actors (${names.join(', ')}).`,
        whyFlagged: `Potential intermediary escrow or pooling conduit for structuring illicit capital flows.`,
        entityIds: [accountId, ...personIds],
        entityNames: [accountId, ...names],
        relevantRecordIds: recs.map((r) => r.record_id).slice(0, 4),
        sourceReferences: Array.from(new Set(recs.map((r) => r.source_reference))).slice(0, 4),
        timestamp: recs[0]?.date_time || '2026-01-16 14:00:00',
        supportingEvidence: recs.slice(0, 4).map((r) => `${r.record_id} [${r.source_type}]: ${r.description}`),
      });
    }
  });

  // 4. RAPID GEOGRAPHICAL MOVEMENT / ANPR TRAJECTORY SPURTS
  const personLocations = new Map<string, { loc: string; locName: string; time: string; rec: SourceRecord }[]>();
  records.forEach((r) => {
    if (r.person_id && r.location_id) {
      if (!personLocations.has(r.person_id)) personLocations.set(r.person_id, []);
      personLocations.get(r.person_id)!.push({
        loc: r.location_id,
        locName: r.location_name || r.location_id,
        time: r.date_time,
        rec: r,
      });
    }
  });

  personLocations.forEach((locList, personId) => {
    locList.sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime());
    for (let i = 0; i < locList.length - 1; i++) {
      const p1 = locList[i];
      const p2 = locList[i + 1];
      if (p1.loc !== p2.loc) {
        const tDiffHours = (new Date(p2.time).getTime() - new Date(p1.time).getTime()) / (1000 * 60 * 60);
        if (tDiffHours < 8 && tDiffHours > 0) {
          const pName = nodeMap.get(personId)?.name || personId;
          alerts.push({
            id: `ANOM-GEO-${personId}-${i}`,
            title: `Rapid Transit Velocity: ${pName} (${p1.locName} → ${p2.locName})`,
            category: 'RAPID_GEO_MOVEMENT',
            severity: 'medium',
            description: `${pName} logged at ${p1.locName} at ${p1.time} and subsequently observed at ${p2.locName} at ${p2.time} within ${tDiffHours.toFixed(1)} hours.`,
            whyFlagged: `High-velocity geographic displacement across distinct jurisdictions in brief transit window.`,
            entityIds: [personId, p1.loc, p2.loc],
            entityNames: [pName, p1.locName, p2.locName],
            relevantRecordIds: [p1.rec.record_id, p2.rec.record_id],
            sourceReferences: [p1.rec.source_reference, p2.rec.source_reference],
            timestamp: p2.time,
            supportingEvidence: [
              `Leg 1: ${p1.rec.record_id} (${p1.time}) at ${p1.locName}`,
              `Leg 2: ${p2.rec.record_id} (${p2.time}) at ${p2.locName}`,
            ],
          });
        }
      }
    }
  });

  // 5. POTENTIAL NETWORK BRIDGES (High Betweenness across clusters)
  graph.nodes
    .filter((n) => n.isBridge && n.betweenness > 0.04)
    .slice(0, 4)
    .forEach((bridgeNode) => {
      alerts.push({
        id: `ANOM-BRIDGE-${bridgeNode.id}`,
        title: `Potential Network Bridge: ${bridgeNode.name} (${bridgeNode.id})`,
        category: 'CROSS_CLUSTER_BRIDGE',
        severity: 'high',
        description: `Entity ${bridgeNode.name} exhibits significant Betweenness Centrality (${bridgeNode.betweenness}) and connects multiple disjoint clusters.`,
        whyFlagged: `Acts as a primary relational conduit between otherwise separate network clusters. Disruption or monitoring of this node provides critical investigative leverage.`,
        entityIds: [bridgeNode.id],
        entityNames: [bridgeNode.name],
        relevantRecordIds: bridgeNode.relatedRecords.slice(0, 5),
        sourceReferences: bridgeNode.relationships.map((r: any) => r.sourceRef).filter(Boolean).slice(0, 5),
        timestamp: bridgeNode.lastSeen,
        supportingEvidence: [
          `Betweenness Centrality: ${bridgeNode.betweenness}`,
          `Direct Degree: ${bridgeNode.degree} active connections`,
          `Associated Records: ${bridgeNode.relatedRecords.length} files`,
        ],
      });
    });

  // Sort alerts by severity
  const severityOrder: Record<string, number> = { critical: 4, high: 3, medium: 2, low: 1 };
  alerts.sort((a, b) => severityOrder[b.severity] - severityOrder[a.severity]);

  return alerts;
}
