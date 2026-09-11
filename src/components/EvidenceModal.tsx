import React from 'react';
import { GraphLink, SourceRecord } from '../types';
import { X, FileCheck2, Calendar, Landmark, MapPin, Phone, ShieldCheck, AlertCircle } from 'lucide-react';

interface EvidenceModalProps {
  record: SourceRecord | null;
  link: GraphLink | null;
  onClose: () => void;
}

export const EvidenceModal: React.FC<EvidenceModalProps> = ({ record, link, onClose }) => {
  if (!record && !link) return null;

  const recordsToShow: SourceRecord[] = record
    ? [record]
    : link?.records || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#000000] border border-white/15 shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="bg-[#09090B] border-b border-white/10 p-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-[#DC2626] flex items-center justify-center text-white font-black">
              <FileCheck2 className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-heading font-black text-white uppercase tracking-wider flex items-center gap-2">
                VERIFIABLE EVIDENCE AUDIT
                <span className="text-[9px] px-2 py-0.5 bg-red-950 text-red-300 border border-red-800 font-bold font-mono-code">
                  {recordsToShow.length} SOURCE FILE(S)
                </span>
              </h2>
              <p className="text-[10px] text-[#71717A] font-mono-code font-bold uppercase">
                SIH 2026 EVIDENCE TRACEABILITY LAYER // ZERO FABRICATIONS
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-[#A1A1AA] hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content List */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1 bg-[#000000]">
          {link && (
            <div className="p-3.5 bg-[#09090B] border border-white/10 text-xs font-mono-code flex items-center justify-between font-bold">
              <div>
                <span className="text-[#71717A]">Rel: </span>
                <span className="text-white uppercase">{typeof link.source === 'string' ? link.source : link.source.id}</span>
                <span className="text-[#DC2626] mx-2">──[ {link.type} ]──►</span>
                <span className="text-white uppercase">{typeof link.target === 'string' ? link.target : link.target.id}</span>
              </div>
              <span className="text-[#DC2626] font-black">{link.records.length} Supporting Record(s)</span>
            </div>
          )}

          {recordsToShow.map((rec) => (
            <div
              key={rec.record_id}
              className="bg-[#09090B] border border-white/10 p-4 space-y-3"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-2.5">
                <div className="flex items-center gap-2 font-mono-code text-xs font-bold">
                  <span className="px-2 py-0.5 bg-red-950 text-red-300 border border-red-800 text-[10px] font-black">
                    RECORD: {rec.record_id}
                  </span>
                  <span className="px-2 py-0.5 bg-white/10 text-white text-[10px]">
                    REF: {rec.source_reference}
                  </span>
                  <span className="px-2 py-0.5 bg-white/5 text-[#A1A1AA] text-[10px] uppercase">
                    TYPE: {rec.source_type}
                  </span>
                </div>
                <span className="text-[10px] text-[#A1A1AA] font-mono-code flex items-center gap-1 font-bold">
                  <Calendar className="w-3.5 h-3.5 text-[#DC2626]" />
                  {rec.date_time}
                </span>
              </div>

              {/* Narrative Content */}
              <div className="text-xs text-[#F4F4F5] leading-relaxed bg-[#18181B] p-3 border border-white/10 font-medium">
                <strong className="text-[#71717A] block text-[9px] font-mono-code uppercase font-bold mb-1">
                  Primary Observation / Description:
                </strong>
                {rec.description}
              </div>

              {/* Specific Field Details */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[10px] font-mono-code pt-1 font-bold">
                {rec.person_name && (
                  <div className="bg-[#18181B] p-2 border border-white/10">
                    <span className="text-[#71717A] block text-[9px] uppercase">PERSON NAME / ID</span>
                    <span className="text-white uppercase">{rec.person_name} ({rec.person_id})</span>
                  </div>
                )}
                {rec.phone_id && (
                  <div className="bg-[#18181B] p-2 border border-white/10">
                    <span className="text-[#71717A] block text-[9px] uppercase">PHONE / SIM</span>
                    <span className="text-red-400">{rec.phone_id}</span>
                  </div>
                )}
                {rec.account_id && (
                  <div className="bg-[#18181B] p-2 border border-white/10">
                    <span className="text-[#71717A] block text-[9px] uppercase">ACCOUNT NUMBER</span>
                    <span className="text-[#DC2626]">{rec.account_id}</span>
                  </div>
                )}
                {rec.amount && (
                  <div className="bg-[#18181B] p-2 border border-white/10">
                    <span className="text-[#71717A] block text-[9px] uppercase">AMOUNT</span>
                    <span className="text-emerald-400 font-black">INR {rec.amount.toLocaleString()}</span>
                  </div>
                )}
                {rec.location_name && (
                  <div className="bg-[#18181B] p-2 border border-white/10">
                    <span className="text-[#71717A] block text-[9px] uppercase">LOCATION</span>
                    <span className="text-amber-400 truncate block uppercase">{rec.location_name}</span>
                  </div>
                )}
                {rec.organization_name && (
                  <div className="bg-[#18181B] p-2 border border-white/10">
                    <span className="text-[#71717A] block text-[9px] uppercase">ORGANIZATION</span>
                    <span className="text-purple-400 truncate block uppercase">{rec.organization_name}</span>
                  </div>
                )}
              </div>
            </div>
          ))}

          <div className="p-3 bg-[#09090B] border border-white/10 text-[10px] text-[#71717A] font-mono-code font-bold uppercase flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-[#DC2626] shrink-0 mt-0.5" />
            <span>
              All relationships in NETRA are cryptographically pinned to verifiable raw records. Unsubstantiated connections are omitted by default.
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-[#09090B] border-t border-white/10 p-3.5 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-[#DC2626] hover:bg-[#B91C1C] text-white text-xs font-mono-code font-black uppercase tracking-wider cursor-pointer transition-colors"
          >
            Close Audit Inspector
          </button>
        </div>
      </div>
    </div>
  );
};
