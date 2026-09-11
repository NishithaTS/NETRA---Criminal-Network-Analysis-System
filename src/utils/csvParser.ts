import Papa from 'papaparse';
import { SourceRecord } from '../types';

export interface ParseResult {
  records: SourceRecord[];
  validCount: number;
  duplicateCount: number;
  errorCount: number;
  errors: string[];
}

export function parseAndValidateCSV(csvString: string): ParseResult {
  const parsed = Papa.parse<Record<string, string>>(csvString, {
    header: true,
    skipEmptyLines: true,
    transformHeader: (h) => h.trim().toLowerCase().replace(/[\s-]+/g, '_'),
  });

  const records: SourceRecord[] = [];
  const seenIds = new Set<string>();
  const errors: string[] = [];
  let duplicateCount = 0;
  let errorCount = 0;

  parsed.data.forEach((row, idx) => {
    const rowNum = idx + 2; // 1-based + header
    let recordId = (row.record_id || '').trim();
    if (!recordId) {
      recordId = `REC${String(idx + 1).padStart(4, '0')}`;
    }

    if (seenIds.has(recordId)) {
      duplicateCount++;
      recordId = `${recordId}_DUP${duplicateCount}`;
    }
    seenIds.add(recordId);

    const sourceType = (row.source_type || 'Intel Report').trim();
    const dateTime = (row.date_time || new Date().toISOString().replace('T', ' ').slice(0, 19)).trim();
    const relationship = (row.relationship || 'LINKED_TO').trim().toUpperCase().replace(/[\s-]+/g, '_');
    const sourceRef = (row.source_reference || `SRC${String(idx + 1).padStart(4, '0')}`).trim();

    let amount: number | null = null;
    if (row.amount) {
      const cleanAmt = String(row.amount).replace(/[^0-9.-]+/g, '');
      const parsedNum = parseFloat(cleanAmt);
      if (!isNaN(parsedNum)) amount = parsedNum;
    }

    const description = (row.description || `Record entry from ${sourceType}`).trim();

    const record: SourceRecord = {
      record_id: recordId,
      source_type: sourceType,
      date_time: dateTime,
      person_id: row.person_id ? row.person_id.trim() : undefined,
      person_name: row.person_name ? row.person_name.trim() : undefined,
      phone_id: row.phone_id ? row.phone_id.trim() : undefined,
      account_id: row.account_id ? row.account_id.trim() : undefined,
      vehicle_id: row.vehicle_id ? row.vehicle_id.trim() : undefined,
      location_id: row.location_id ? row.location_id.trim() : undefined,
      location_name: row.location_name ? row.location_name.trim() : undefined,
      organization_id: row.organization_id ? row.organization_id.trim() : undefined,
      organization_name: row.organization_name ? row.organization_name.trim() : undefined,
      related_entity: row.related_entity ? row.related_entity.trim() : undefined,
      relationship: relationship,
      amount,
      description,
      source_reference: sourceRef,
    };

    // Validation: at least one entity ID or name must be present
    if (!record.person_id && !record.phone_id && !record.account_id && !record.organization_id && !record.location_id && !record.person_name) {
      errorCount++;
      errors.push(`Row ${rowNum}: Lacks identifying entity keys (person_id, phone, account, org, location).`);
    } else {
      records.push(record);
    }
  });

  return {
    records,
    validCount: records.length,
    duplicateCount,
    errorCount,
    errors: errors.slice(0, 10),
  };
}

export function exportRecordsToCSV(records: SourceRecord[]): string {
  return Papa.unparse(records);
}
