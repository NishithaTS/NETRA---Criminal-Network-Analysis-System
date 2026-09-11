import React, { useState, useRef } from 'react';
import { SourceRecord } from '../types';
import { parseAndValidateCSV, exportRecordsToCSV, ParseResult } from '../utils/csvParser';
import {
  UploadCloud,
  X,
  FileSpreadsheet,
  Download,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Search,
  FileText,
} from 'lucide-react';

interface DataIngestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentRecords: SourceRecord[];
  onIngestNewRecords: (records: SourceRecord[]) => void;
  onRestoreDefaultDataset: () => void;
}

export const DataIngestionModal: React.FC<DataIngestionModalProps> = ({
  isOpen,
  onClose,
  currentRecords,
  onIngestNewRecords,
  onRestoreDefaultDataset,
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [parseLog, setParseLog] = useState<ParseResult | null>(null);
  const [searchFilter, setSearchFilter] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 15;

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const text = evt.target?.result as string;
      if (text) {
        const result = parseAndValidateCSV(text);
        setParseLog(result);
        if (result.records.length > 0) {
          onIngestNewRecords(result.records);
        }
      }
    };
    reader.readAsText(file);
  };

  const handleDownloadCSV = () => {
    const csvContent = exportRecordsToCSV(currentRecords);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `NETRA_Synthetic_Crime_Intelligence_Dataset_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filtered = currentRecords.filter((r) => {
    if (!searchFilter.trim()) return true;
    const q = searchFilter.toLowerCase();
    return (
      r.record_id.toLowerCase().includes(q) ||
      r.source_reference.toLowerCase().includes(q) ||
      r.description.toLowerCase().includes(q) ||
      (r.person_name && r.person_name.toLowerCase().includes(q))
    );
  });

  const totalPages = Math.ceil(filtered.length / pageSize) || 1;
  const pagedRecords = filtered.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
      <div className="bg-[#000000] border border-white/15 shadow-2xl w-full max-w-5xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-[#09090B] border-b border-white/10 p-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-[#DC2626] flex items-center justify-center text-white font-black">
              <UploadCloud className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-heading font-black text-white uppercase tracking-wider">
                DATA INGESTION & DATASET EXPLORER
              </h2>
              <p className="text-[10px] text-[#71717A] font-mono-code font-bold uppercase">
                SECTION 3 // MULTI-SOURCE INGESTION & NORMALIZATION
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

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-5 flex-1 bg-[#000000]">
          {/* Top Actions: Upload CSV, Download Dataset, Restore Default */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Upload */}
            <div
              onClick={() => fileInputRef.current?.click()}
              className="p-4 bg-[#09090B] hover:bg-[#18181B] border border-white/10 hover:border-[#DC2626] cursor-pointer transition-all flex items-center gap-3"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv,.txt"
                onChange={handleFileUpload}
                className="hidden"
              />
              <div className="w-10 h-10 bg-[#DC2626] text-white flex items-center justify-center font-black shrink-0">
                <UploadCloud className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-black text-xs text-white uppercase tracking-tight font-heading">Upload Custom CSV</h4>
                <p className="text-[10px] text-[#71717A] font-bold uppercase">FIR, CDR, Bank, ANPR records</p>
              </div>
            </div>

            {/* Download */}
            <div
              onClick={handleDownloadCSV}
              className="p-4 bg-[#09090B] hover:bg-[#18181B] border border-white/10 hover:border-white/25 cursor-pointer transition-all flex items-center gap-3"
            >
              <div className="w-10 h-10 bg-white/10 text-white border border-white/15 flex items-center justify-center shrink-0">
                <Download className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-black text-xs text-white uppercase tracking-tight font-heading">Export Dataset (CSV)</h4>
                <p className="text-[10px] text-[#71717A] font-bold uppercase">Download {currentRecords.length} records</p>
              </div>
            </div>

            {/* Restore Default */}
            <div
              onClick={onRestoreDefaultDataset}
              className="p-4 bg-[#09090B] hover:bg-[#18181B] border border-white/10 hover:border-[#DC2626] cursor-pointer transition-all flex items-center gap-3"
            >
              <div className="w-10 h-10 bg-[#18181B] text-[#DC2626] border border-[#DC2626]/40 flex items-center justify-center shrink-0">
                <RotateCcw className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-black text-xs text-white uppercase tracking-tight font-heading">Restore 300-Row Dataset</h4>
                <p className="text-[10px] text-[#71717A] font-bold uppercase">SIH Canonical Test Suite</p>
              </div>
            </div>
          </div>

          {/* Ingestion Validation Feedback Banner */}
          {parseLog && (
            <div className="p-3 bg-[#09090B] border border-[#DC2626] text-xs font-mono-code space-y-1">
              <div className="flex items-center justify-between text-[#DC2626] font-black uppercase">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#DC2626]" />
                  CSV Ingest Complete: {parseLog.validCount} valid records processed
                </span>
                <span>{parseLog.duplicateCount} duplicates resolved</span>
              </div>
              {parseLog.errors.length > 0 && (
                <div className="text-amber-400 text-[10px] pt-1 font-bold">
                  {parseLog.errors.map((e, idx) => (
                    <div key={idx}>⚠️ {e}</div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Record Explorer Table */}
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
              <h3 className="text-xs font-black text-white font-mono-code uppercase tracking-wider flex items-center gap-2">
                <FileSpreadsheet className="w-4 h-4 text-[#DC2626]" />
                <span>ACTIVE DATASET RECORDS ({currentRecords.length})</span>
              </h3>

              <div className="relative w-full sm:w-64">
                <Search className="w-3.5 h-3.5 text-[#DC2626] absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchFilter}
                  onChange={(e) => {
                    setSearchFilter(e.target.value);
                    setPage(1);
                  }}
                  placeholder="Filter records..."
                  className="w-full bg-[#09090B] border border-white/15 pl-8 pr-2 py-1.5 text-xs text-white placeholder-[#71717A] focus:outline-none focus:border-[#DC2626] font-mono-code font-bold"
                />
              </div>
            </div>

            <div className="border border-white/10 overflow-x-auto bg-[#09090B]">
              <table className="w-full text-left text-xs font-mono-code">
                <thead className="bg-[#09090B] text-[#71717A] border-b border-white/10 text-[10px] uppercase font-black tracking-wider">
                  <tr>
                    <th className="p-3">Record ID</th>
                    <th className="p-3">Source Type</th>
                    <th className="p-3">Date / Time</th>
                    <th className="p-3">Entity / Name</th>
                    <th className="p-3">Phone / Account</th>
                    <th className="p-3">Amount</th>
                    <th className="p-3">Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-[11px]">
                  {pagedRecords.map((r) => (
                    <tr key={r.record_id} className="hover:bg-white/5 text-[#F4F4F5]">
                      <td className="p-3 font-black text-[#DC2626] whitespace-nowrap">
                        {r.record_id}
                      </td>
                      <td className="p-3 whitespace-nowrap">
                        <span className="px-2 py-0.5 bg-white/10 text-white text-[10px] font-bold uppercase">
                          {r.source_type}
                        </span>
                      </td>
                      <td className="p-3 text-[#A1A1AA] whitespace-nowrap font-bold">{r.date_time}</td>
                      <td className="p-3 whitespace-nowrap font-black text-white uppercase">
                        {r.person_name || r.person_id || '—'}
                      </td>
                      <td className="p-3 text-red-400 whitespace-nowrap font-bold">
                        {r.phone_id || r.account_id || r.vehicle_id || '—'}
                      </td>
                      <td className="p-3 text-[#DC2626] font-black whitespace-nowrap">
                        {r.amount ? `₹${r.amount.toLocaleString()}` : '—'}
                      </td>
                      <td className="p-3 max-w-xs truncate text-[#A1A1AA] font-medium">{r.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center justify-between text-xs font-mono-code text-[#71717A] pt-1 font-bold">
              <span>
                Showing {(page - 1) * pageSize + 1}–
                {Math.min(page * pageSize, filtered.length)} of {filtered.length}
              </span>
              <div className="flex gap-1.5 items-center">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-3 py-1 bg-[#09090B] border border-white/15 text-white disabled:opacity-30 uppercase text-[10px] font-bold cursor-pointer"
                >
                  Prev
                </button>
                <span className="px-2 py-1 text-white font-black text-xs">
                  {page} / {totalPages}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-3 py-1 bg-[#09090B] border border-white/15 text-white disabled:opacity-30 uppercase text-[10px] font-bold cursor-pointer"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
