import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import { createClient } from "@supabase/supabase-js";
import { Card } from "@/components/ui/card";
import { useTheme } from "next-themes";

// Supabase setup
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const COLORS: Record<string, string> = {
  user: "#06B6D4",
  problem: "#3B82F6",
  ministry: "#FACC15",
  solution: "#22C55E",
  location: "#9CA3AF",
};

interface GraphNode {
  id: string;
  type: string;
  label?: string;
  x?: number;
  y?: number;
  fx?: number | null;
  fy?: number | null;
}

interface GraphEdge {
  source: string;
  target: string;
  strength?: number;
}

interface GraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

const CivicGraphExplorer: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const nodesMapRef = useRef<Map<string, GraphNode>>(new Map());
  const edgesRef = useRef<GraphEdge[]>([]);
  const { theme } = useTheme();

  useEffect(() => {
    if (!ref.current) return;

    const containerEl = ref.current;
    const width = containerEl.offsetWidth;
    const height = containerEl.offsetHeight;

    const svg = d3
      .select(containerEl)
      .append("svg")
      .attr("width", "100%")
      .attr("height", "100%")
      .attr("viewBox", `0 0 ${width} ${height}`)
      .style("cursor", "grab");

    const container = svg.append("g");

    // Define glow filter
    const defs = svg.append("defs");
    const filter = defs
      .append("filter")
      .attr("id", "nodeGlow")
      .attr("width", "300%")
      .attr("x", "-100%")
      .attr("height", "300%")
      .attr("y", "-100%");
    filter
      .append("feGaussianBlur")
      .attr("class", "blur")
      .attr("stdDeviation", "4")
      .attr("result", "coloredBlur");
    const feMerge = filter.append("feMerge");
    feMerge.append("feMergeNode").attr("in", "coloredBlur");
    feMerge.append("feMergeNode").attr("in", "SourceGraphic");

    // Zoom & Pan
    const zoom = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.3, 5])
      .on("zoom", (event) => container.attr("transform", event.transform));
    svg.call(zoom);

    // Tooltip
    const tooltip = d3.select(tooltipRef.current);

    // Simulation
    const simulation = d3
      .forceSimulation<GraphNode>()
      .force("link", d3.forceLink<GraphNode, any>().id((d) => d.id).distance(130))
      .force("charge", d3.forceManyBody().strength(-250))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collision", d3.forceCollide(40));

    const updateGraph = (data: GraphData) => {
      nodesMapRef.current = new Map(data.nodes.map((n) => [n.id, n]));
      edgesRef.current = data.edges.map((e) => ({
        source: nodesMapRef.current.get(e.source)!,
        target: nodesMapRef.current.get(e.target)!,
        strength: e.strength,
      }));

      // LINKS
      const link = container
        .selectAll<SVGLineElement, any>("line")
        .data(edgesRef.current, (d: any) => `${d.source.id}-${d.target.id}`);

      link
        .join(
          (enter) =>
            enter
              .append("line")
              .attr("stroke", theme === "dark" ? "#444" : "#ccc")
              .attr("stroke-opacity", 0.7)
              .attr("stroke-width", (d: any) =>
                d.strength ? 1.5 + d.strength * 2 : 1.5
              ),
          (update) => update.transition().duration(300),
          (exit) => exit.transition().duration(200).style("opacity", 0).remove()
        );

      // NODES
      const node = container
        .selectAll<SVGCircleElement, GraphNode>("circle")
        .data(Array.from(nodesMapRef.current.values()), (d: any) => d.id);

      node
        .join(
          (enter) =>
            enter
              .append("circle")
              .attr("r", 22)
              .attr("fill", (d) => `url(#grad-${d.type})`)
              .style("stroke", theme === "dark" ? "#fff" : "#111")
              .style("stroke-width", 2.2)
              .style("filter", "url(#nodeGlow)")
              .call(
                d3
                  .drag<SVGCircleElement, GraphNode>()
                  .on("start", (event, d) => {
                    if (!event.active) simulation.alphaTarget(0.3).restart();
                    d.fx = d.x;
                    d.fy = d.y;
                  })
                  .on("drag", (event, d) => {
                    d.fx = event.x;
                    d.fy = event.y;
                  })
                  .on("end", (event, d) => {
                    if (!event.active) simulation.alphaTarget(0);
                    d.fx = null;
                    d.fy = null;
                  })
              )
              .on("mouseover", (event, d) => {
                tooltip
                  .style("opacity", 1)
                  .html(
                    `<strong>${d.label || d.id}</strong><br/><span class="text-xs text-gray-500">Type: ${d.type}</span>`
                  )
                  .style("left", event.pageX + 10 + "px")
                  .style("top", event.pageY - 28 + "px");

                link
                  .style("stroke", (l: any) =>
                    l.source.id === d.id || l.target.id === d.id
                      ? COLORS[d.type]
                      : theme === "dark"
                      ? "#444"
                      : "#ccc"
                  )
                  .style("stroke-width", (l: any) =>
                    l.source.id === d.id || l.target.id === d.id ? 3 : 1.5
                  );
              })
              .on("mousemove", (event) => {
                tooltip
                  .style("left", event.pageX + 10 + "px")
                  .style("top", event.pageY - 28 + "px");
              })
              .on("mouseout", () => {
                tooltip.style("opacity", 0);
                link
                  .style("stroke", theme === "dark" ? "#444" : "#ccc")
                  .style("stroke-width", 1.5);
              }),
          (update) => update.transition().duration(300),
          (exit) => exit.transition().duration(200).attr("r", 0).remove()
        );

      // GRADIENTS FOR NODES
      const uniqueTypes = Array.from(new Set(data.nodes.map((n) => n.type)));
      uniqueTypes.forEach((type) => {
        const grad = defs
          .append("linearGradient")
          .attr("id", `grad-${type}`)
          .attr("x1", "0%")
          .attr("x2", "100%")
          .attr("y1", "0%")
          .attr("y2", "100%");
        grad
          .append("stop")
          .attr("offset", "0%")
          .attr("stop-color", COLORS[type])
          .attr("stop-opacity", 0.9);
        grad
          .append("stop")
          .attr("offset", "100%")
          .attr("stop-color", d3.color(COLORS[type])?.darker(0.8)?.toString() || COLORS[type])
          .attr("stop-opacity", 1);
      });

      // LABELS
      const label = container
        .selectAll<SVGTextElement, GraphNode>("text")
        .data(Array.from(nodesMapRef.current.values()), (d: any) => d.id);

      label
        .join(
          (enter) =>
            enter
              .append("text")
              .text((d) => d.label || d.id)
              .attr("font-size", 14)
              .attr("font-weight", 600)
              .attr("text-anchor", "middle")
              .attr("dy", 5)
              .attr("fill", theme === "dark" ? "#fff" : "#111")
              .attr("paint-order", "stroke")
              .attr("stroke", theme === "dark" ? "#000" : "#fff")
              .attr("stroke-width", 3),
          (update) => update.transition().duration(300),
          (exit) => exit.remove()
        );

      simulation.nodes(Array.from(nodesMapRef.current.values()));
      (simulation.force("link") as any).links(edgesRef.current);
      simulation.alpha(1).restart();

      simulation.on("tick", () => {
        container
          .selectAll("line")
          .attr("x1", (d: any) => d.source.x!)
          .attr("y1", (d: any) => d.source.y!)
          .attr("x2", (d: any) => d.target.x!)
          .attr("y2", (d: any) => d.target.y!);

        container
          .selectAll("circle")
          .attr("cx", (d: any) => d.x!)
          .attr("cy", (d: any) => d.y!);

        container
          .selectAll("text")
          .attr("x", (d: any) => d.x!)
          .attr("y", (d: any) => d.y!);
      });
    };

    const graphApiUrl = `${supabaseUrl}/functions/v1/graph`;
    fetch(graphApiUrl)
      .then((res) => res.json())
      .then(updateGraph)
      .catch(console.error);

    const problemSub = supabase
      .channel("realtime-graph")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "problems" },
        () => fetch(graphApiUrl).then((res) => res.json()).then(updateGraph)
      )
      .subscribe();

    const relSub = supabase
      .channel("realtime-graph-rel")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "problem_relationships" },
        () => fetch(graphApiUrl).then((res) => res.json()).then(updateGraph)
      )
      .subscribe();

    const handleResize = () => {
      const w = containerEl.offsetWidth;
      const h = containerEl.offsetHeight;
      svg.attr("viewBox", `0 0 ${w} ${h}`);
      simulation.force("center", d3.forceCenter(w / 2, h / 2));
      simulation.alpha(0.5).restart();
    };
    window.addEventListener("resize", handleResize);

    return () => {
      supabase.removeChannel(problemSub);
      supabase.removeChannel(relSub);
      window.removeEventListener("resize", handleResize);
      svg.remove();
    };
  }, [theme]);

  return (
    <Card className="relative w-full h-[600px] sm:h-[700px] lg:h-[800px] bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-2 shadow-md overflow-hidden">
      <div ref={ref} className="w-full h-full rounded-xl" />
      <div
        ref={tooltipRef}
        className="absolute pointer-events-none px-3 py-1.5 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 opacity-0 transition-opacity duration-200"
        style={{ position: "absolute" }}
      />
    </Card>
  );
};

export default CivicGraphExplorer;
