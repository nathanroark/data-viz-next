"use client";
import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import type { D3DragEvent, Simulation, SimulationNodeDatum } from "d3";
import { drag as d3drag } from "d3";

export interface Node {
  id: string;
  group?: number;
  x?: number;
  y?: number;
  fx?: number | null; // Add this line
  fy?: number | null; // And this line
}

export interface Link {
  source: string | Node; // Node.id or Node object
  target: string | Node; // Node.id or Node object
  value?: number;
}

export interface ForceGraphProps {
  nodes: Node[];
  links: Link[];
}

export const ForceGraph: React.FC<ForceGraphProps> = ({ nodes, links }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [simulation, setSimulation] = useState<Simulation<Node, Link> | null>(
    null,
  );

  useEffect(() => {
    // Resize observer to update force center dynamically
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (simulation && entry.target === svgRef.current) {
          const { width, height } = entry.contentRect;
          simulation.force("center", d3.forceCenter(width / 2, height / 2));
          simulation.alpha(1).restart(); // Restart simulation to apply the new center
        }
      }
    });

    if (svgRef.current) {
      resizeObserver.observe(svgRef.current);
    }

    if (!simulation) {
      const sim: Simulation<Node, Link> = d3
        .forceSimulation(nodes)
        .force(
          "link",
          d3.forceLink(links).id((d: SimulationNodeDatum) => (d as Node).id),
        )
        .force("charge", d3.forceManyBody())
        .force(
          "center",
          d3.forceCenter(svgRef.current!.clientWidth / 2 || 300, 600 / 2),
        )
        .on("tick", ticked);

      setSimulation(sim);

      const colors = [
        "#ff8000",
        "#ff00ff",
        "#fffc00",
        "#0080ff",
        "#a0ff00",
        "#ff0040",
        "#00ff60",
        "#b000ff",
        "#00ffff",
        "#00bfff",
        "#0040ff",
        // "#8000ff",
        // "#ff00bf",
        // "#ff0000",
      ];

      // const color = d3.scaleOrdinal(d3.schemeSet2);
      const color = d3.scaleOrdinal(colors);

      function drag(simulation: Simulation<Node, Link>) {
        const dragstarted = (
          event: D3DragEvent<SVGCircleElement, Node, Node>,
          d: Node,
        ) => {
          if (!event.active) simulation.alphaTarget(0.3).restart();
          d.fx = d.x;
          d.fy = d.y;
        };

        const dragged = (
          event: D3DragEvent<SVGCircleElement, Node, Node>,
          d: Node,
        ) => {
          d.fx = event.x;
          d.fy = event.y;
        };

        const dragended = (
          event: D3DragEvent<SVGCircleElement, Node, Node>,
          d: Node,
        ) => {
          if (!event.active) simulation.alphaTarget(0);
          d.fx = null;
          d.fy = null;
        };

        return d3drag<SVGCircleElement, Node, Node>()
          .on("start", dragstarted)
          .on("drag", dragged)
          .on("end", dragended);
      }

      function ticked() {
        d3.select(svgRef.current)
          .selectAll(".link")
          .data(links)
          .join("line")
          .attr("class", "link")
          .attr("stroke", "#999")
          .attr("stroke-opacity", 0.6)
          .attr("stroke-width", (d) => Math.sqrt(d.value ?? 1))
          .attr("x1", (d) => (d.source as Node).x ?? 0)
          .attr("y1", (d) => (d.source as Node).y ?? 0)
          .attr("x2", (d) => (d.target as Node).x ?? 0)
          .attr("y2", (d) => (d.target as Node).y ?? 0);

        d3.select(svgRef.current)
          .selectAll(".node")
          .data(nodes)
          .join("circle")
          .attr("class", "node")
          .attr("r", 5)
          .attr("fill", (d) => color(d.group!.toString())) // Use group for color
          .attr("cx", (d) => d.x ?? 0)
          .attr("cy", (d) => d.y ?? 0)
          // @ts-expect-error TS2339
          .call(drag(sim));
      }
    }

    return () => {
      if (simulation) {
        simulation.stop();
      }
    };
  }, [nodes, links, simulation]);

  return <svg ref={svgRef} width="full" height="600"></svg>;
};
