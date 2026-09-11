import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as d3 from 'd3';
import {
  EntityNode,
  EntityType,
  GraphLink,
  GraphPath,
  KnowledgeGraphData,
} from '../types';
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  Filter,
  Search,
  Layers,
  Sparkles,
  Info,
  Shield,
  Phone,
  Landmark,
  Car,
  MapPin,
  Building,
  FileSpreadsheet,
  FileText,
  RotateCcw,
} from 'lucide-react';

interface KnowledgeGraphViewProps {
  graph: KnowledgeGraphData;
  selectedNode: EntityNode | null;
  onSelectNode: (node: EntityNode | null) => void;
  selectedLink: GraphLink | null;
  onSelectLink: (link: GraphLink | null) => void;
  highlightedPath: GraphPath | null;
  onClearHighlightPath: () => void;
}

const ENTITY_COLORS: Record<EntityType, { bg: string; border: string; glow: string }> = {
  Person: { bg: '#2563eb', border: '#60a5fa', glow: 'rgba(59, 130, 246, 0.4)' },
  Phone: { bg: '#059669', border: '#34d399', glow: 'rgba(16, 185, 129, 0.4)' },
  'Bank Account': { bg: '#d97706', border: '#fbbf24', glow: 'rgba(245, 158, 11, 0.4)' },
  Vehicle: { bg: '#0891b2', border: '#22d3ee', glow: 'rgba(6, 182, 212, 0.4)' },
  Location: { bg: '#dc2626', border: '#f87171', glow: 'rgba(239, 68, 68, 0.4)' },
  Organization: { bg: '#7c3aed', border: '#a78bfa', glow: 'rgba(124, 58, 237, 0.4)' },
  FIR: { bg: '#e11d48', border: '#fb7185', glow: 'rgba(225, 29, 72, 0.4)' },
  Event: { bg: '#4f46e5', border: '#818cf8', glow: 'rgba(79, 70, 229, 0.4)' },
  Report: { bg: '#475569', border: '#94a3b8', glow: 'rgba(71, 85, 105, 0.4)' },
};

export const KnowledgeGraphView: React.FC<KnowledgeGraphViewProps> = ({
  graph,
  selectedNode,
  onSelectNode,
  selectedLink,
  onSelectLink,
  highlightedPath,
  onClearHighlightPath,
}) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const zoomBehaviorRef = useRef<d3.ZoomBehavior<SVGSVGElement, unknown> | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [activeTypes, setActiveTypes] = useState<Set<EntityType>>(
    new Set<EntityType>([
      'Person',
      'Phone',
      'Bank Account',
      'Vehicle',
      'Location',
      'Organization',
      'FIR',
      'Report',
      'Event',
    ])
  );
  const [showClusters, setShowClusters] = useState(false);
  const [hoveredNode, setHoveredNode] = useState<EntityNode | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null);

  // Filter nodes & links based on active types
  const filteredData = useMemo(() => {
    const validNodeIds = new Set<string>();
    const nodes = graph.nodes.filter((n) => {
      // Always include nodes in the highlighted path
      if (highlightedPath && highlightedPath.nodeIds.includes(n.id)) {
        validNodeIds.add(n.id);
        return true;
      }
      if (activeTypes.has(n.type)) {
        validNodeIds.add(n.id);
        return true;
      }
      return false;
    });

    const links = graph.links.filter((l) => {
      const sId = typeof l.source === 'string' ? l.source : l.source.id;
      const tId = typeof l.target === 'string' ? l.target : l.target.id;
      return validNodeIds.has(sId) && validNodeIds.has(tId);
    });

    return { nodes, links };
  }, [graph, activeTypes, highlightedPath]);

  // Highlighted path sets for quick lookup
  const pathNodeSet = useMemo(() => {
    return new Set(highlightedPath?.nodeIds || []);
  }, [highlightedPath]);

  const pathLinkIds = useMemo(() => {
    return new Set(highlightedPath?.links.map((l) => l.id) || []);
  }, [highlightedPath]);

  // Main D3 Force Simulation Effect
  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;

    const width = containerRef.current.clientWidth || 900;
    const height = containerRef.current.clientHeight || 650;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove(); // Clean container

    // Definitions (arrows, gradients, filters)
    const defs = svg.append('defs');

    // Arrowhead marker
    defs
      .append('marker')
      .attr('id', 'arrow')
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', 22)
      .attr('refY', 0)
      .attr('markerWidth', 6)
      .attr('markerHeight', 6)
      .attr('orient', 'auto')
      .append('path')
      .attr('d', 'M0,-4L8,0L0,4')
      .attr('fill', '#4b5563');

    // Path highlighted arrow in Swindled Red
    defs
      .append('marker')
      .attr('id', 'arrow-highlight')
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', 24)
      .attr('refY', 0)
      .attr('markerWidth', 8)
      .attr('markerHeight', 8)
      .attr('orient', 'auto')
      .append('path')
      .attr('d', 'M0,-4L10,0L0,4')
      .attr('fill', '#DC2626');

    // Glow filter
    const filter = defs.append('filter').attr('id', 'glow').attr('x', '-50%').attr('y', '-50%').attr('width', '200%').attr('height', '200%');
    filter.append('feGaussianBlur').attr('stdDeviation', '4').attr('result', 'coloredBlur');
    const feMerge = filter.append('feMerge');
    feMerge.append('feMergeNode').attr('in', 'coloredBlur');
    feMerge.append('feMergeNode').attr('in', 'SourceGraphic');

    const g = svg.append('g').attr('class', 'main-graph-group');

    // Zoom setup
    const zoom = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.15, 4])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
      });

    zoomBehaviorRef.current = zoom;
    svg.call(zoom);

    // Initial center transform
    svg.call(zoom.transform, d3.zoomIdentity.translate(width / 2, height / 2).scale(0.85));

    // Prepare node copy for D3
    const d3Nodes = filteredData.nodes.map((d) => ({ ...d }));
    const d3Links = filteredData.links.map((d) => ({ ...d }));

    // Force simulation
    const simulation = d3
      .forceSimulation(d3Nodes as any)
      .force(
        'link',
        d3
          .forceLink(d3Links)
          .id((d: any) => d.id)
          .distance((d: any) => (pathLinkIds.has(d.id) ? 140 : 100))
      )
      .force('charge', d3.forceManyBody().strength(-240).distanceMax(500))
      .force('center', d3.forceCenter(0, 0))
      .force('collide', d3.forceCollide().radius((d: any) => (d.isBridge ? 35 : 24)))
      .alphaDecay(0.025);

    // Render Links Group
    const linkGroup = g.append('g').attr('class', 'links');
    const link = linkGroup
      .selectAll('line')
      .data(d3Links)
      .enter()
      .append('line')
      .attr('stroke', (d: any) => {
        if (highlightedPath && pathLinkIds.has(d.id)) return '#DC2626';
        if (selectedLink && selectedLink.id === d.id) return '#F59E0B';
        return 'rgba(255, 255, 255, 0.12)';
      })
      .attr('stroke-width', (d: any) => {
        if (highlightedPath && pathLinkIds.has(d.id)) return 3.5;
        if (selectedLink && selectedLink.id === d.id) return 2.5;
        return Math.min(3, 1 + (d.weight || 1) * 0.5);
      })
      .attr('stroke-dasharray', (d: any) => (d.type === 'PREVIOUS_CASE' || d.type === 'ASSOCIATED_WITH' ? '4,3' : 'none'))
      .attr('marker-end', (d: any) => (highlightedPath && pathLinkIds.has(d.id) ? 'url(#arrow-highlight)' : 'url(#arrow)'))
      .attr('class', (d: any) => (highlightedPath && pathLinkIds.has(d.id) ? 'path-glow-red cursor-pointer' : 'cursor-pointer hover:stroke-[#94a3b8]'))
      .on('click', (_event, d: any) => {
        onSelectLink(d);
      });

    // Render Nodes Group
    const nodeGroup = g.append('g').attr('class', 'nodes');
    const node = nodeGroup
      .selectAll('g')
      .data(d3Nodes)
      .enter()
      .append('g')
      .attr('class', 'node-group cursor-pointer')
      .call(
        d3
          .drag<SVGGElement, any>()
          .on('start', (event, d) => {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
          })
          .on('drag', (event, d) => {
            d.fx = event.x;
            d.fy = event.y;
          })
          .on('end', (event, d) => {
            if (!event.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
          })
      )
      .on('click', (_event, d: any) => {
        const originalNode = graph.nodes.find((n) => n.id === d.id) || d;
        onSelectNode(originalNode);
      })
      .on('mouseenter', (event, d: any) => {
        setHoveredNode(d);
        const rect = containerRef.current?.getBoundingClientRect();
        if (rect) {
          setTooltipPos({
            x: event.clientX - rect.left,
            y: event.clientY - rect.top - 10,
          });
        }
      })
      .on('mouseleave', () => {
        setHoveredNode(null);
        setTooltipPos(null);
      });

    // Node Outer Glow / Halo for high centrality & active path
    node
      .append('circle')
      .attr('r', (d: any) => {
        const isPath = pathNodeSet.has(d.id);
        const base = d.isBridge ? 22 : d.degree >= 5 ? 18 : 13;
        return isPath ? base + 8 : base + 2;
      })
      .attr('fill', (d: any) => {
        if (pathNodeSet.has(d.id)) return 'rgba(220, 38, 38, 0.4)';
        if (selectedNode?.id === d.id) return 'rgba(255, 255, 255, 0.3)';
        return ENTITY_COLORS[d.type as EntityType]?.glow || 'rgba(255,255,255,0.05)';
      })
      .attr('class', (d: any) => (pathNodeSet.has(d.id) ? 'path-glow-red' : ''));

    // Node Main Circle
    node
      .append('circle')
      .attr('r', (d: any) => (d.isBridge ? 18 : d.degree >= 5 ? 14 : 11))
      .attr('fill', (d: any) => {
        if (pathNodeSet.has(d.id)) return '#DC2626';
        return ENTITY_COLORS[d.type as EntityType]?.bg || '#1E293B';
      })
      .attr('stroke', (d: any) => {
        if (pathNodeSet.has(d.id)) return '#FFFFFF';
        if (selectedNode?.id === d.id) return '#DC2626';
        return ENTITY_COLORS[d.type as EntityType]?.border || '#475569';
      })
      .attr('stroke-width', (d: any) => (pathNodeSet.has(d.id) || selectedNode?.id === d.id ? 2.5 : 1.5))
      .attr('opacity', (d: any) => {
        if (highlightedPath) {
          return pathNodeSet.has(d.id) ? 1 : 0.25;
        }
        return 1;
      });

    // Node Text Label
    node
      .append('text')
      .text((d: any) => (d.name.length > 18 ? d.name.slice(0, 16) + '...' : d.name))
      .attr('dy', (d: any) => (d.isBridge ? 28 : 22))
      .attr('text-anchor', 'middle')
      .attr('fill', (d: any) => (pathNodeSet.has(d.id) ? '#DC2626' : '#F4F4F5'))
      .attr('font-size', (d: any) => (pathNodeSet.has(d.id) ? '11px' : '9.5px'))
      .attr('font-weight', '800')
      .attr('font-family', 'JetBrains Mono, monospace')
      .attr('letter-spacing', '0.05em')
      .attr('opacity', (d: any) => {
        if (highlightedPath) {
          return pathNodeSet.has(d.id) ? 1 : 0.2;
        }
        return 0.9;
      });

    // Node ID Badge Subtext
    node
      .append('text')
      .text((d: any) => d.id)
      .attr('dy', (d: any) => (d.isBridge ? 38 : 31))
      .attr('text-anchor', 'middle')
      .attr('fill', (d: any) => (pathNodeSet.has(d.id) ? '#FFFFFF' : '#71717A'))
      .attr('font-size', '8.5px')
      .attr('font-weight', '700')
      .attr('font-family', 'JetBrains Mono, monospace')
      .attr('opacity', (d: any) => (pathNodeSet.has(d.id) ? 1 : 0.6));

    // Simulation Tick Update
    simulation.on('tick', () => {
      link
        .attr('x1', (d: any) => d.source.x)
        .attr('y1', (d: any) => d.source.y)
        .attr('x2', (d: any) => d.target.x)
        .attr('y2', (d: any) => d.target.y);

      node.attr('transform', (d: any) => `translate(${d.x},${d.y})`);
    });

    return () => {
      simulation.stop();
    };
  }, [filteredData, highlightedPath, selectedNode, selectedLink, pathNodeSet, pathLinkIds]);

  // Zoom control helpers
  const handleZoom = (factor: number) => {
    if (!svgRef.current || !zoomBehaviorRef.current) return;
    d3.select(svgRef.current).transition().duration(300).call(zoomBehaviorRef.current.scaleBy, factor);
  };

  const handleResetZoom = () => {
    if (!svgRef.current || !zoomBehaviorRef.current || !containerRef.current) return;
    const width = containerRef.current.clientWidth || 900;
    const height = containerRef.current.clientHeight || 650;
    d3.select(svgRef.current)
      .transition()
      .duration(400)
      .call(zoomBehaviorRef.current.transform, d3.zoomIdentity.translate(width / 2, height / 2).scale(0.85));
  };

  const toggleType = (t: EntityType) => {
    const next = new Set(activeTypes);
    if (next.has(t)) {
      if (next.size > 1) next.delete(t);
    } else {
      next.add(t);
    }
    setActiveTypes(next);
  };

  const handleSearchFocus = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    const query = searchQuery.trim().toLowerCase();
    const found = graph.nodes.find(
      (n) => n.id.toLowerCase() === query || n.name.toLowerCase().includes(query)
    );
    if (found) {
      onSelectNode(found);
    }
  };

  return (
    <div ref={containerRef} className="relative w-full h-[calc(100vh-112px)] bg-[#09090B] overflow-hidden flex flex-col select-none">
      {/* Top Floating Control Bar */}
      <div className="absolute top-4 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
        {/* Search spotlight */}
        <form
          onSubmit={handleSearchFocus}
          className="pointer-events-auto flex items-center bg-[#000000]/95 backdrop-blur-md border border-white/15 px-3.5 py-2 shadow-2xl w-80"
        >
          <Search className="w-4 h-4 text-[#DC2626] mr-2 shrink-0" />
          <input
            type="text"
            placeholder="Search Dossier (e.g. P007, AC011)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent text-xs text-white placeholder-[#71717A] focus:outline-none w-full font-mono-code font-bold tracking-wider"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="text-[#71717A] hover:text-white text-xs ml-1 font-bold"
            >
              ✕
            </button>
          )}
        </form>

        {/* Active Path Notice Banner (when Find Connection is triggered) */}
        {highlightedPath && (
          <div className="pointer-events-auto flex items-center gap-3 bg-[#000000] border border-[#DC2626] px-4 py-2 shadow-[0_0_16px_rgba(220,38,38,0.3)] animate-in fade-in slide-in-from-top-2">
            <Sparkles className="w-4 h-4 text-[#DC2626] animate-spin" />
            <div className="text-xs">
              <span className="text-[#DC2626] font-black uppercase tracking-wider font-mono-code mr-1.5">
                [CRIME CONSPIRACY CHAIN]
              </span>
              <span className="text-white font-mono-code font-black">
                {highlightedPath.nodeIds.join(' → ')}
              </span>
              <span className="text-[#A1A1AA] ml-2 text-[11px] font-mono-code">
                ({highlightedPath.hops} hops • {highlightedPath.connectionStrength}% strength)
              </span>
            </div>
            <button
              onClick={onClearHighlightPath}
              className="ml-2 px-2.5 py-1 bg-[#18181B] hover:bg-[#27272A] text-white text-[10px] font-mono-code font-black uppercase tracking-wider border border-white/20 cursor-pointer"
            >
              Clear
            </button>
          </div>
        )}

        {/* Action Controls & Legend Toggle */}
        <div className="pointer-events-auto flex items-center gap-1 bg-[#000000]/95 backdrop-blur-md border border-white/15 p-1 shadow-xl">
          <button
            onClick={() => handleZoom(1.3)}
            className="p-2 text-[#A1A1AA] hover:text-white hover:bg-white/10 transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleZoom(0.7)}
            className="p-2 text-[#A1A1AA] hover:text-white hover:bg-white/10 transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={handleResetZoom}
            className="p-2 text-[#A1A1AA] hover:text-white hover:bg-white/10 transition-colors"
            title="Reset View"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* SVG Canvas with Noir Grid */}
      <div className="w-full h-full bg-dot-radial">
        <svg ref={svgRef} className="w-full h-full cursor-grab active:cursor-grabbing" />
      </div>

      {/* Bottom Filter & Legend Drawer */}
      <div className="absolute bottom-4 left-4 z-20 flex flex-wrap items-center gap-2 bg-[#000000]/95 backdrop-blur-md border border-white/10 px-4 py-2.5 shadow-2xl text-xs">
        <span className="sidebar-heading flex items-center gap-1.5 mr-1 text-[#F4F4F5]">
          <Filter className="w-3.5 h-3.5 text-[#DC2626]" />
          Entity Layers:
        </span>

        {[
          { type: 'Person' as EntityType, label: 'Person', color: '#3b82f6' },
          { type: 'Phone' as EntityType, label: 'Phone', color: '#10b981' },
          { type: 'Bank Account' as EntityType, label: 'Account', color: '#f59e0b' },
          { type: 'Vehicle' as EntityType, label: 'Vehicle', color: '#06b6d4' },
          { type: 'Location' as EntityType, label: 'Location', color: '#ef4444' },
          { type: 'Organization' as EntityType, label: 'Organization', color: '#a855f7' },
          { type: 'FIR' as EntityType, label: 'FIR', color: '#f43f5e' },
          { type: 'Report' as EntityType, label: 'Report', color: '#64748b' },
        ].map((item) => {
          const isActive = activeTypes.has(item.type);
          return (
            <button
              key={item.type}
              onClick={() => toggleType(item.type)}
              className={`flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-mono-code font-bold uppercase tracking-wider transition-all cursor-pointer border ${
                isActive
                  ? 'bg-[#18181B] text-white border-white/20'
                  : 'bg-transparent text-[#71717A] border-transparent line-through opacity-40'
              }`}
            >
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Floating Hover Tooltip */}
      {hoveredNode && tooltipPos && (
        <div
          className="absolute z-50 pointer-events-none bg-[#000000] border border-[#DC2626]/50 p-3.5 shadow-2xl text-xs max-w-xs transform -translate-x-1/2 -translate-y-full"
          style={{ left: tooltipPos.x, top: tooltipPos.y }}
        >
          <div className="flex items-center gap-2 mb-1.5">
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: ENTITY_COLORS[hoveredNode.type]?.bg || '#fff' }}
            />
            <span className="font-mono-code font-black text-white text-sm tracking-wide">
              {hoveredNode.name}
            </span>
          </div>
          <div className="font-mono-code text-[11px] text-[#A1A1AA] space-y-1">
            <div>
              ID: <span className="text-white font-bold">{hoveredNode.id}</span> | Type:{' '}
              <span className="text-[#DC2626] font-bold">{hoveredNode.type}</span>
            </div>
            <div>
              Direct Degree:{' '}
              <span className="text-white font-bold">{hoveredNode.degree} links</span> |
              Betweenness:{' '}
              <span className="text-white font-bold">{hoveredNode.betweenness}</span>
            </div>
            <div>
              Related Records:{' '}
              <span className="text-white font-bold">{hoveredNode.relatedRecords.length} files</span>
            </div>
            {hoveredNode.isBridge && (
              <div className="text-[#DC2626] font-black mt-1 uppercase tracking-wider">
                ⚠️ Potential Network Bridge
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
