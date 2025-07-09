
import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import * as d3 from 'd3';
import { Network, Info, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import { mockKnowledgeGraph } from '../services/mockData';
import Layout from '../components/Layout/Layout';

const KnowledgeGraph: React.FC = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;

    const container = d3.select(containerRef.current);
    const svg = d3.select(svgRef.current);
    
    // Clear previous content
    svg.selectAll("*").remove();
    
    const width = containerRef.current.clientWidth;
    const height = 600;
    
    svg.attr("width", width).attr("height", height);
    
    const g = svg.append("g");
    
    // Create zoom behavior
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.1, 3])
      .on("zoom", (event) => {
        g.attr("transform", event.transform);
      });
    
    svg.call(zoom);
    
    // Color scale for different groups
    const color = d3.scaleOrdinal(d3.schemeCategory10);
    
    // Create simulation
    const simulation = d3.forceSimulation(mockKnowledgeGraph.nodes as any)
      .force("link", d3.forceLink(mockKnowledgeGraph.links).id((d: any) => d.id).distance(100))
      .force("charge", d3.forceManyBody().strength(-300))
      .force("center", d3.forceCenter(width / 2, height / 2));
    
    // Create links
    const link = g.append("g")
      .attr("class", "links")
      .selectAll("line")
      .data(mockKnowledgeGraph.links)
      .enter().append("line")
      .attr("stroke", "#999")
      .attr("stroke-opacity", 0.6)
      .attr("stroke-width", (d: any) => Math.sqrt(d.strength * 10));
    
    // Create nodes
    const node = g.append("g")
      .attr("class", "nodes")
      .selectAll("g")
      .data(mockKnowledgeGraph.nodes)
      .enter().append("g")
      .attr("class", "node")
      .call(d3.drag<SVGGElement, any>()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended));
    
    // Add circles to nodes
    node.append("circle")
      .attr("r", (d: any) => d.size || 10)
      .attr("fill", (d: any) => color(d.group))
      .attr("stroke", "#fff")
      .attr("stroke-width", 2);
    
    // Add labels to nodes
    node.append("text")
      .attr("dy", -15)
      .attr("text-anchor", "middle")
      .attr("font-size", "12px")
      .attr("font-weight", "bold")
      .attr("fill", "#333")
      .text((d: any) => d.label);
    
    // Add tooltips
    node.append("title")
      .text((d: any) => d.label);
    
    // Update positions on simulation tick
    simulation.on("tick", () => {
      link
        .attr("x1", (d: any) => d.source.x)
        .attr("y1", (d: any) => d.source.y)
        .attr("x2", (d: any) => d.target.x)
        .attr("y2", (d: any) => d.target.y);
      
      node
        .attr("transform", (d: any) => `translate(${d.x},${d.y})`);
    });
    
    // Drag functions
    function dragstarted(event: any, d: any) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }
    
    function dragged(event: any, d: any) {
      d.fx = event.x;
      d.fy = event.y;
    }
    
    function dragended(event: any, d: any) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }
    
    // Zoom controls
    const zoomIn = () => {
      svg.transition().call(
        zoom.scaleBy as any, 1.5
      );
    };
    
    const zoomOut = () => {
      svg.transition().call(
        zoom.scaleBy as any, 1 / 1.5
      );
    };
    
    const resetZoom = () => {
      svg.transition().call(
        zoom.transform as any,
        d3.zoomIdentity
      );
    };
    
    // Expose controls to component
    (window as any).graphControls = { zoomIn, zoomOut, resetZoom };
    
    return () => {
      simulation.stop();
    };
  }, []);

  const handleZoomIn = () => {
    (window as any).graphControls?.zoomIn();
  };

  const handleZoomOut = () => {
    (window as any).graphControls?.zoomOut();
  };

  const handleResetZoom = () => {
    (window as any).graphControls?.resetZoom();
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Knowledge Graph
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Explore the interconnected web of knowledge threads and topics
              </p>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={handleZoomIn}
                className="p-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"
                title="Zoom In"
              >
                <ZoomIn className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              </button>
              <button
                onClick={handleZoomOut}
                className="p-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"
                title="Zoom Out"
              >
                <ZoomOut className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              </button>
              <button
                onClick={handleResetZoom}
                className="p-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"
                title="Reset View"
              >
                <RotateCcw className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Graph Container */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
        >
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-2">
              <Network className="h-5 w-5 text-blue-500" />
              <span className="font-medium text-gray-900 dark:text-white">
                Interactive Knowledge Network
              </span>
            </div>
          </div>
          
          <div ref={containerRef} className="relative">
            <svg
              ref={svgRef}
              className="w-full h-[600px] bg-gray-50 dark:bg-gray-900"
            />
          </div>
        </motion.div>

        {/* Legend and Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {/* Legend */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Legend
            </h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                <span className="text-sm text-gray-600 dark:text-gray-400">Frontend Technologies</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-600 dark:text-gray-400">AI & Machine Learning</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 bg-purple-500 rounded-full"></div>
                <span className="text-sm text-gray-600 dark:text-gray-400">Programming Languages</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                <span>━━━</span>
                <span>Knowledge Connections</span>
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Info className="h-5 w-5 text-blue-500" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                How to Use
              </h3>
            </div>
            <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <p>• <strong>Drag</strong> nodes to rearrange the graph</p>
              <p>• <strong>Zoom</strong> in/out using mouse wheel or controls</p>
              <p>• <strong>Pan</strong> by dragging the background</p>
              <p>• <strong>Hover</strong> over nodes to see details</p>
              <p>• <strong>Click</strong> nodes to explore related threads</p>
            </div>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default KnowledgeGraph;
