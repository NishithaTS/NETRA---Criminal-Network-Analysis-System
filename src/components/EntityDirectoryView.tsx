import React, { useState, useMemo } from 'react';
import { EntityNode, EntityType, KnowledgeGraphData } from '../types';
import {
  Search,
  Filter,
  ArrowUpDown,
  User,
  Phone,
  Landmark,
  Car,
  MapPin,
  Building,
  FileSpreadsheet,
  Activity,
  ArrowUpRight,
  GitFork,
  Pin,
} from 'lucide-react';

interface EntityDirectoryViewProps {
  graph: KnowledgeGraphData;
  onSelectNode: (node: EntityNode) => void;
  onSetPathEndpoint: (nodeId: string, role: 'source' | 'target') => void;
  onPinEntityToCase: (nodeId: string) => void;
  pinnedEntityIds: string[];
}

export const EntityDirectoryView: React.FC<EntityDirectoryViewProps> = ({
  graph,
  onSelectNode,
  onSetPathEndpoint,
  onPinEntityToCase,
  pinnedEntityIds,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'degree' | 'betweenness' | 'name' | 'id'>('degree');

  const filteredEntities = useMemo(() => {
    let list = [...graph.nodes];

    if (selectedType !== 'ALL') {
      list = list.filter((n) => n.type === selectedType);
    }

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      list = list.filter(
        (n) =>
          n.id.toLowerCase().includes(q) ||
          n.name.toLowerCase().includes(q) ||
          n.type.toLowerCase().includes(q) ||
          n.relatedRecords.some((r) => r.toLowerCase().includes(q))
      );
    }

    list.sort((a, b) => {
      if (sortBy === 'degree') return b.degree - a.degree;
      if (sortBy === 'betweenness') return b.betweenness - a.betweenness;
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      return a.id.localeCompare(b.id);
    });

    return list;
  }, [graph.nodes, selectedType, searchTerm, sortBy]);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-[#16191E] border border-white/10 p-6 shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 bg-white/10 text-white border border-white/10 text-[10px] font-mono-code font-bold uppercase tracking-widest">
                ENTITY REGISTRY
              </span>
              <span className="text-[10px] font-mono-code text-[#64748B] font-bold uppercase tracking-wider">
                {graph.nodes.length} NORMALIZED ENTITIES
              </span>
            </div>
            <h1 className="text-3xl font-black text-white font-display-grotesk tracking-tighter italic uppercase leading-none">
              ENTITY DIRECTORY & SEARCH
            </h1>
            <p className="text-xs text-[#94A3B8] mt-2 font-medium">
              Search by Person ID, Phone Number, Bank Account, Vehicle Plate, Location, Organization, or Case Dossier.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-[#0A0C0F] px-4 py-2.5 border border-white/15 text-xs font-mono-code">
              <span className="text-[#64748B] block text-[9px] uppercase tracking-wider font-bold">MATCHING RESULTS</span>
              <span className="text-[#A3E635] font-black text-xl leading-tight">{filteredEntities.length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Search & Filter Controls */}
      <div className="bg-[#16191E] border border-white/10 p-4 shadow-xl flex flex-col md:flex-row gap-3 items-center justify-between">
        {/* Search Bar */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-[#A3E635] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search ID, name, phone, account..."
            className="w-full bg-[#0A0C0F] border border-white/15 pl-9 pr-3 py-2 text-xs text-white placeholder-[#64748B] focus:outline-none focus:border-[#A3E635] font-mono-code font-bold"
          />
        </div>

        {/* Type Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {[
            'ALL',
            'Person',
            'Phone',
            'Bank Account',
            'Vehicle',
            'Location',
            'Organization',
            'FIR',
            'Report',
          ].map((t) => (
            <button
              key={t}
              onClick={() => setSelectedType(t)}
              className={`px-3 py-1.5 text-[10px] font-mono-code font-bold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer border ${
                selectedType === t
                  ? 'bg-[#A3E635] text-black border-[#A3E635]'
                  : 'bg-white/5 text-[#94A3B8] border-white/10 hover:text-white hover:bg-white/10'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          <ArrowUpDown className="w-3.5 h-3.5 text-[#64748B]" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-[#0A0C0F] border border-white/15 px-3 py-1.5 text-xs text-white font-mono-code font-bold focus:outline-none focus:border-[#A3E635]"
          >
            <option value="degree">Sort by Connections (Degree)</option>
            <option value="betweenness">Sort by Centrality (Betweenness)</option>
            <option value="name">Sort by Name</option>
            <option value="id">Sort by Entity ID</option>
          </select>
        </div>
      </div>

      {/* Entities Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredEntities.map((entity) => {
          const isPinned = pinnedEntityIds.includes(entity.id);

          return (
            <div
              key={entity.id}
              className="bg-[#16191E] hover:bg-[#1C2027] border border-white/10 hover:border-[#A3E635]/50 p-4 space-y-3 transition-all shadow-md group flex flex-col justify-between"
            >
              <div>
                {/* Header */}
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2 py-0.5 bg-white/10 text-white border border-white/10 text-[9px] font-mono-code font-bold uppercase tracking-wider">
                    {entity.type}
                  </span>
                  <span className="text-[11px] font-mono-code text-[#A3E635] font-bold">
                    {entity.id}
                  </span>
                </div>

                {/* Name */}
                <h3
                  onClick={() => onSelectNode(entity)}
                  className="font-black text-white text-sm hover:text-[#A3E635] cursor-pointer line-clamp-1 transition-colors uppercase tracking-tight"
                >
                  {entity.name}
                </h3>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-2 text-[10px] font-mono-code text-[#94A3B8] mt-3">
                  <div className="bg-[#0A0C0F] p-2 border border-white/10">
                    <span className="font-bold">DEGREE: </span>
                    <strong className="text-white font-bold">{entity.degree}</strong>
                  </div>
                  <div className="bg-[#0A0C0F] p-2 border border-white/10">
                    <span className="font-bold">BETWEENNESS: </span>
                    <strong className="text-[#A3E635] font-bold">{entity.betweenness}</strong>
                  </div>
                </div>

                {entity.isBridge && (
                  <div className="mt-2 px-2 py-0.5 bg-red-950/80 border border-red-800 text-[10px] text-red-300 font-mono-code font-bold uppercase tracking-wider">
                    ⚠️ Potential Network Bridge
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-1 text-[11px] font-mono-code">
                <button
                  onClick={() => onSelectNode(entity)}
                  className="flex items-center gap-1 px-3 py-1.5 bg-white/5 hover:bg-white/10 text-white border border-white/10 font-bold uppercase tracking-wider transition-colors cursor-pointer"
                >
                  <span>Dossier</span>
                  <ArrowUpRight className="w-3 h-3 text-[#A3E635]" />
                </button>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onSetPathEndpoint(entity.id, 'source')}
                    className="p-1.5 bg-white/5 hover:bg-white/10 text-blue-400 border border-white/10 transition-colors"
                    title="Set as Find Connection Source"
                  >
                    <GitFork className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => onPinEntityToCase(entity.id)}
                    className={`p-1.5 border transition-colors ${
                      isPinned
                        ? 'bg-[#A3E635]/20 text-[#A3E635] border-[#A3E635]/50'
                        : 'bg-white/5 hover:bg-white/10 text-[#64748B] hover:text-white border-white/10'
                    }`}
                    title={isPinned ? 'Pinned in Active Case' : 'Pin to Case'}
                  >
                    <Pin className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
