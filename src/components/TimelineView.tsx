import React, { useState, useMemo } from 'react';
import { EntityNode, KnowledgeGraphData, SourceRecord } from '../types';
import {
  Calendar,
  Filter,
  Search,
  FileSpreadsheet,
  Clock,
  ArrowUpRight,
  Landmark,
  Phone,
  Car,
  MapPin,
} from 'lucide-react';

interface TimelineViewProps {
  records: SourceRecord[];
  graph: KnowledgeGraphData;
  onInspectRecord: (record: SourceRecord) => void;
  onSelectNodeById: (entityId: string) => void;
}

export const TimelineView: React.FC<TimelineViewProps> = ({
  records,
  graph,
  onInspectRecord,
  onSelectNodeById,
}) => {
  const [selectedSourceType, setSelectedSourceType] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredRecords = useMemo(() => {
    let list = [...records];

    if (selectedSourceType !== 'ALL') {
      list = list.filter((r) => r.source_type === selectedSourceType);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (r) =>
          r.record_id.toLowerCase().includes(q) ||
          r.description.toLowerCase().includes(q) ||
          (r.person_name && r.person_name.toLowerCase().includes(q)) ||
          (r.person_id && r.person_id.toLowerCase().includes(q)) ||
          (r.phone_id && r.phone_id.toLowerCase().includes(q)) ||
          (r.account_id && r.account_id.toLowerCase().includes(q)) ||
          (r.location_name && r.location_name.toLowerCase().includes(q))
      );
    }

    // Sort chronologically ascending
    list.sort((a, b) => new Date(a.date_time).getTime() - new Date(b.date_time).getTime());

    return list;
  }, [records, selectedSourceType, searchQuery]);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-[#16191E] border border-white/10 p-6 shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 bg-white/10 text-white border border-white/10 text-[10px] font-mono-code font-bold uppercase tracking-widest">
                CHRONOLOGICAL ANALYSIS
              </span>
              <span className="text-[10px] font-mono-code text-[#64748B] font-bold uppercase">
                SECTION 11 // TEMPORAL SEQUENCING
              </span>
            </div>
            <h1 className="text-3xl font-black text-white font-display-grotesk tracking-tighter italic uppercase leading-none">
              INVESTIGATION TIMELINE & EVENTS
            </h1>
            <p className="text-xs text-[#94A3B8] mt-2 font-medium">
              Time-series analysis reconstructing the chronological cadence of phone calls, funds clearing, and ANPR sightings.
            </p>
          </div>

          <div className="bg-[#0A0C0F] px-4 py-2.5 border border-white/15 text-xs font-mono-code">
            <span className="text-[#64748B] block text-[9px] uppercase tracking-wider font-bold">TOTAL EVENTS</span>
            <span className="text-[#A3E635] font-black text-xl leading-tight">{filteredRecords.length} Records</span>
          </div>
        </div>
      </div>

      {/* Filter Controls */}
      <div className="bg-[#16191E] border border-white/10 p-4 shadow-xl flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-[#A3E635] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search timeline events, IDs, locations..."
            className="w-full bg-[#0A0C0F] border border-white/15 pl-9 pr-3 py-2 text-xs text-white placeholder-[#64748B] focus:outline-none focus:border-[#A3E635] font-mono-code font-bold"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {[
            'ALL',
            'FIR',
            'CDR',
            'Financial',
            'Surveillance',
            'Social Media',
            'Intel Report',
          ].map((type) => (
            <button
              key={type}
              onClick={() => setSelectedSourceType(type)}
              className={`px-3 py-1.5 text-[10px] font-mono-code font-bold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap border ${
                selectedSourceType === type
                  ? 'bg-[#A3E635] text-black border-[#A3E635]'
                  : 'bg-white/5 text-[#94A3B8] border-white/10 hover:text-white hover:bg-white/10'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Chronological Stream */}
      <div className="relative border-l-2 border-white/15 ml-4 md:ml-6 pl-6 space-y-6">
        {filteredRecords.map((rec) => (
          <div key={rec.record_id} className="relative group">
            {/* Timeline Node Point */}
            <div className="absolute -left-[31px] top-2 w-3.5 h-3.5 bg-[#0A0C0F] border-2 border-[#A3E635] group-hover:scale-125 group-hover:bg-[#A3E635] transition-all"></div>

            {/* Event Card */}
            <div
              onClick={() => onInspectRecord(rec)}
              className="bg-[#16191E] hover:bg-[#1C2027] border border-white/10 hover:border-[#A3E635]/50 p-4 space-y-2.5 transition-all shadow-md cursor-pointer"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-2">
                <div className="flex items-center gap-2 font-mono-code text-xs">
                  <span className="px-2 py-0.5 bg-[#A3E635]/15 text-[#A3E635] border border-[#A3E635]/30 font-black text-[10px]">
                    {rec.record_id}
                  </span>
                  <span className="px-2 py-0.5 bg-white/10 text-white border border-white/10 text-[10px] font-bold uppercase">
                    {rec.source_type}
                  </span>
                  <span className="text-[#64748B] text-[10px] font-bold">REF: {rec.source_reference}</span>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-[#94A3B8] font-mono-code font-bold">
                  <Clock className="w-3.5 h-3.5 text-[#A3E635]" />
                  <span>{rec.date_time}</span>
                </div>
              </div>

              {/* Description */}
              <p className="text-xs text-[#E0E2E6] leading-relaxed font-medium">{rec.description}</p>

              {/* Tag Badges */}
              <div className="flex flex-wrap items-center gap-2 pt-1 text-[10px] font-mono-code font-bold">
                {rec.person_name && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (rec.person_id) onSelectNodeById(rec.person_id);
                    }}
                    className="px-2 py-0.5 bg-[#0A0C0F] hover:bg-white/10 text-white border border-white/10 uppercase cursor-pointer"
                  >
                    Person: {rec.person_name} ({rec.person_id})
                  </button>
                )}
                {rec.phone_id && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectNodeById(rec.phone_id!);
                    }}
                    className="px-2 py-0.5 bg-[#0A0C0F] hover:bg-white/10 text-emerald-400 border border-white/10 uppercase cursor-pointer"
                  >
                    Phone: {rec.phone_id}
                  </button>
                )}
                {rec.account_id && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectNodeById(rec.account_id!);
                    }}
                    className="px-2 py-0.5 bg-[#0A0C0F] hover:bg-white/10 text-[#A3E635] border border-white/10 uppercase cursor-pointer"
                  >
                    Acct: {rec.account_id}
                  </button>
                )}
                {rec.amount && (
                  <span className="px-2 py-0.5 bg-emerald-950 text-emerald-300 border border-emerald-800 font-black">
                    INR {rec.amount.toLocaleString()}
                  </span>
                )}
                {rec.location_name && (
                  <span className="px-2 py-0.5 bg-[#0A0C0F] text-red-400 border border-white/10 uppercase">
                    Loc: {rec.location_name}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
