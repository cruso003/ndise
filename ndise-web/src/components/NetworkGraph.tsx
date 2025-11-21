import { useRef, useCallback, useState } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import {
  Users,
  Briefcase,
  Phone,
  Plane,
  DollarSign,
  X,
  Filter,
  Download,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';

export interface GraphNode {
  id: string;
  name: string;
  type: 'person' | 'organization' | 'location' | 'event';
  riskLevel: 'critical' | 'high' | 'medium' | 'low' | 'neutral';
  photo?: string;
  details?: Record<string, any>;
  size?: number;
}

export interface GraphLink {
  source: string;
  target: string;
  type: 'family' | 'business' | 'phone' | 'travel' | 'financial' | 'associate';
  strength: number; // 1-10
  label?: string;
  details?: Record<string, any>;
}

export interface NetworkGraphData {
  nodes: GraphNode[];
  links: GraphLink[];
}

interface NetworkGraphProps {
  data: NetworkGraphData;
  centralNodeId?: string;
  onNodeClick?: (node: GraphNode) => void;
  onLinkClick?: (link: GraphLink) => void;
  height?: number;
  width?: number;
}

export default function NetworkGraph({
  data,
  centralNodeId,
  onNodeClick,
  onLinkClick,
  height = 600,
  width,
}: NetworkGraphProps) {
  const graphRef = useRef<any>();
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [selectedLink, setSelectedLink] = useState<GraphLink | null>(null);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  const linkTypes = [
    { value: 'family', label: 'Family', icon: Users, color: '#10b981' },
    { value: 'business', label: 'Business', icon: Briefcase, color: '#3b82f6' },
    { value: 'phone', label: 'Phone', icon: Phone, color: '#8b5cf6' },
    { value: 'travel', label: 'Travel', icon: Plane, color: '#f59e0b' },
    { value: 'financial', label: 'Financial', icon: DollarSign, color: '#ef4444' },
    { value: 'associate', label: 'Associate', icon: Users, color: '#6b7280' },
  ];

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'critical':
        return '#dc2626';
      case 'high':
        return '#f97316';
      case 'medium':
        return '#fbbf24';
      case 'low':
        return '#3b82f6';
      case 'neutral':
      default:
        return '#9ca3af';
    }
  };

  const getLinkColor = (type: string) => {
    return linkTypes.find(t => t.value === type)?.color || '#9ca3af';
  };

  const toggleFilter = (type: string) => {
    setSelectedFilters(prev =>
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  const filteredData = {
    nodes: data.nodes,
    links:
      selectedFilters.length === 0
        ? data.links
        : data.links.filter(link => selectedFilters.includes(link.type)),
  };

  const handleNodeClick = useCallback(
    (node: any) => {
      setSelectedNode(node);
      setSelectedLink(null);
      if (onNodeClick) {
        onNodeClick(node);
      }
      // Center on clicked node
      if (graphRef.current) {
        graphRef.current.centerAt(node.x, node.y, 1000);
        graphRef.current.zoom(2, 1000);
      }
    },
    [onNodeClick]
  );

  const handleLinkClick = useCallback(
    (link: any) => {
      setSelectedLink(link);
      setSelectedNode(null);
      if (onLinkClick) {
        onLinkClick(link);
      }
    },
    [onLinkClick]
  );

  const handleZoomIn = () => {
    if (graphRef.current) {
      graphRef.current.zoom(graphRef.current.zoom() * 1.5, 300);
    }
  };

  const handleZoomOut = () => {
    if (graphRef.current) {
      graphRef.current.zoom(graphRef.current.zoom() / 1.5, 300);
    }
  };

  const handleReset = () => {
    if (graphRef.current) {
      graphRef.current.zoomToFit(400);
    }
    setSelectedFilters([]);
    setSelectedNode(null);
    setSelectedLink(null);
  };

  const handleExport = () => {
    // Export graph as PNG
    if (graphRef.current) {
      const canvas = graphRef.current.scene().children[0];
      const image = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = 'network-graph.png';
      link.href = image;
      link.click();
    }
  };

  return (
    <div className="relative">
      {/* Controls */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
        <button
          onClick={handleZoomIn}
          className="p-2 bg-white rounded-lg shadow-sm border border-slate-200 hover:bg-slate-50 transition-colors"
          title="Zoom In"
        >
          <ZoomIn className="w-5 h-5 text-slate-700" />
        </button>
        <button
          onClick={handleZoomOut}
          className="p-2 bg-white rounded-lg shadow-sm border border-slate-200 hover:bg-slate-50 transition-colors"
          title="Zoom Out"
        >
          <ZoomOut className="w-5 h-5 text-slate-700" />
        </button>
        <button
          onClick={handleReset}
          className="p-2 bg-white rounded-lg shadow-sm border border-slate-200 hover:bg-slate-50 transition-colors"
          title="Reset View"
        >
          <Filter className="w-5 h-5 text-slate-700" />
        </button>
        <button
          onClick={handleExport}
          className="p-2 bg-white rounded-lg shadow-sm border border-slate-200 hover:bg-slate-50 transition-colors"
          title="Export as Image"
        >
          <Download className="w-5 h-5 text-slate-700" />
        </button>
      </div>

      {/* Filter Buttons */}
      <div className="absolute top-4 right-4 z-10 bg-white rounded-lg shadow-sm border border-slate-200 p-3">
        <div className="text-xs font-medium text-slate-700 mb-2">Filter Connections</div>
        <div className="flex flex-col gap-1">
          {linkTypes.map(type => {
            const Icon = type.icon;
            const isActive = selectedFilters.length === 0 || selectedFilters.includes(type.value);
            return (
              <button
                key={type.value}
                onClick={() => toggleFilter(type.value)}
                className={`flex items-center gap-2 px-2 py-1 rounded text-xs transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 font-medium'
                    : 'text-slate-400 hover:bg-slate-50'
                }`}
              >
                <Icon className="w-3 h-3" style={{ color: isActive ? type.color : undefined }} />
                {type.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Graph */}
      <div className="bg-slate-50 rounded-lg border border-slate-200 overflow-hidden">
        <ForceGraph2D
          ref={graphRef}
          graphData={filteredData}
          nodeRelSize={6}
          height={height}
          width={width}
          nodeCanvasObject={(node: any, ctx: CanvasRenderingContext2D, globalScale: number) => {
            const size = node.size || (node.id === centralNodeId ? 8 : 5);
            const isHovered = hoveredNode === node.id;
            const isSelected = selectedNode?.id === node.id;

            // Draw circle
            ctx.beginPath();
            ctx.arc(node.x, node.y, size, 0, 2 * Math.PI);
            ctx.fillStyle = getRiskColor(node.riskLevel);
            ctx.fill();

            // Draw border for central node or selected/hovered
            if (node.id === centralNodeId || isSelected || isHovered) {
              ctx.strokeStyle = isSelected ? '#3b82f6' : '#ffffff';
              ctx.lineWidth = isSelected ? 2 : 1.5;
              ctx.stroke();
            }

            // Draw label
            if (globalScale > 1.5 || node.id === centralNodeId || isHovered) {
              const label = node.name;
              const fontSize = 12 / globalScale;
              ctx.font = `${fontSize}px Sans-Serif`;
              ctx.textAlign = 'center';
              ctx.textBaseline = 'middle';
              ctx.fillStyle = '#1e293b';
              ctx.fillText(label, node.x, node.y + size + fontSize);
            }
          }}
          nodeCanvasObjectMode={() => 'replace'}
          linkColor={link => getLinkColor((link as any).type)}
          linkWidth={link => ((link as any).strength || 1) / 2}
          linkDirectionalParticles={2}
          linkDirectionalParticleWidth={link => ((link as any).strength || 1) / 4}
          onNodeClick={handleNodeClick}
          onLinkClick={handleLinkClick}
          onNodeHover={(node: any) => setHoveredNode(node ? node.id : null)}
          cooldownTicks={100}
          onEngineStop={() => {
            if (graphRef.current && !selectedNode) {
              graphRef.current.zoomToFit(400);
            }
          }}
        />
      </div>

      {/* Legend */}
      <div className="mt-4 grid grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200">
          <div className="text-xs font-bold text-slate-900 mb-2">Risk Levels</div>
          <div className="flex flex-wrap gap-2">
            {['critical', 'high', 'medium', 'low', 'neutral'].map(level => (
              <div key={level} className="flex items-center gap-1.5">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: getRiskColor(level) }}
                />
                <span className="text-xs text-slate-600 capitalize">{level}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200">
          <div className="text-xs font-bold text-slate-900 mb-2">Connection Types</div>
          <div className="flex flex-wrap gap-2">
            {linkTypes.map(type => {
              const Icon = type.icon;
              return (
                <div key={type.value} className="flex items-center gap-1.5">
                  <Icon className="w-3 h-3" style={{ color: type.color }} />
                  <span className="text-xs text-slate-600">{type.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Node Details Modal */}
      {selectedNode && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6 border-b border-slate-200 flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-bold text-slate-900">{selectedNode.name}</h3>
                <p className="text-sm text-slate-600 capitalize mt-1">{selectedNode.type}</p>
              </div>
              <button
                onClick={() => setSelectedNode(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <div className="space-y-3">
                <div>
                  <span className="text-sm text-slate-600">Risk Level:</span>
                  <div className="flex items-center gap-2 mt-1">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: getRiskColor(selectedNode.riskLevel) }}
                    />
                    <span className="text-sm font-medium text-slate-900 capitalize">
                      {selectedNode.riskLevel}
                    </span>
                  </div>
                </div>
                {selectedNode.details &&
                  Object.entries(selectedNode.details).map(([key, value]) => (
                    <div key={key}>
                      <span className="text-sm text-slate-600 capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}:
                      </span>
                      <p className="text-sm font-medium text-slate-900 mt-1">
                        {String(value)}
                      </p>
                    </div>
                  ))}
              </div>
            </div>
            <div className="p-6 border-t border-slate-200">
              <button
                onClick={() => setSelectedNode(null)}
                className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Link Details Modal */}
      {selectedLink && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6 border-b border-slate-200 flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-bold text-slate-900">Connection Details</h3>
                <p className="text-sm text-slate-600 capitalize mt-1">{selectedLink.type}</p>
              </div>
              <button
                onClick={() => setSelectedLink(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <div className="space-y-3">
                <div>
                  <span className="text-sm text-slate-600">Connection Strength:</span>
                  <div className="w-full bg-slate-200 rounded-full h-2 mt-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: `${(selectedLink.strength / 10) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs text-slate-500 mt-1">
                    {selectedLink.strength}/10
                  </span>
                </div>
                {selectedLink.label && (
                  <div>
                    <span className="text-sm text-slate-600">Description:</span>
                    <p className="text-sm font-medium text-slate-900 mt-1">
                      {selectedLink.label}
                    </p>
                  </div>
                )}
                {selectedLink.details &&
                  Object.entries(selectedLink.details).map(([key, value]) => (
                    <div key={key}>
                      <span className="text-sm text-slate-600 capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}:
                      </span>
                      <p className="text-sm font-medium text-slate-900 mt-1">
                        {String(value)}
                      </p>
                    </div>
                  ))}
              </div>
            </div>
            <div className="p-6 border-t border-slate-200">
              <button
                onClick={() => setSelectedLink(null)}
                className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
