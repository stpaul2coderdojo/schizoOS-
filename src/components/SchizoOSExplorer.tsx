import React, { useState, useRef, useEffect } from "react";
import {
  Brain,
  Sparkles,
  Layers,
  ArrowRight,
  Plus,
  Trash2,
  Play,
  Pause,
  RotateCcw,
  Zap,
  Info,
  Shield,
  HelpCircle,
  Eye,
  Activity,
  Workflow,
  Compass,
  CheckCircle2,
  AlertTriangle
} from "lucide-react";
import { ConsciousnessPlane, SchizoOSNode, SchizoOSTransition, AutopilotPatternPreset } from "../types";

const CONSCIOUSNESS_LEVELS: {
  plane: ConsciousnessPlane;
  title: string;
  sanskrit: string;
  role: string;
  description: string;
  color: string;
  border: string;
  bg: string;
}[] = [
  {
    plane: "autopilot",
    title: "Subconscious Autopilot",
    sanskrit: "Yantra / Samskara Loop",
    role: "Automated Habit Engine",
    description: "Default Mode Network (DMN) automatic reflexive reactions, internalized trauma scripts, hypervigilance triggers, and involuntary rumination loops.",
    color: "text-rose-400",
    border: "border-rose-500/40",
    bg: "bg-rose-950/20",
  },
  {
    plane: "manas",
    title: "Manas",
    sanskrit: "मनस् (Sensory-Emotional Processing)",
    role: "Sensory Gateway & Instincts",
    description: "The fast sensory coordinator receiving sights, sounds, visceral signals, and immediate emotional surges before intellectual evaluation.",
    color: "text-amber-400",
    border: "border-amber-500/40",
    bg: "bg-amber-950/20",
  },
  {
    plane: "chitta",
    title: "Chitta",
    sanskrit: "चित्त (Mind-Stuff & Stored Impressions)",
    role: "Memory & Impression Reservoir",
    description: "The deep lake of consciousness storing past memories, impressions, affective conditioning, and latent vasanas that fuel the autopilot.",
    color: "text-cyan-400",
    border: "border-cyan-500/40",
    bg: "bg-cyan-950/20",
  },
  {
    plane: "buddhi",
    title: "Buddhi",
    sanskrit: "बुद्धि (Higher Discernment & Will)",
    role: "Reflective Insight & Awakening",
    description: "The wise, witnessing intellect capable of seeing through cognitive distortions, pausing autopilot loops, and exercising conscious choice.",
    color: "text-indigo-400",
    border: "border-indigo-500/40",
    bg: "bg-indigo-950/20",
  },
  {
    plane: "bodhichitta",
    title: "Bodhichitta",
    sanskrit: "बोधिश्चित्त (Awakened Heart & Compassion)",
    role: "Universal Compassionate Ground",
    description: "The luminous core of unconditional loving-kindness, self-compassion, safe interconnectedness, and ultimate non-judgmental stability.",
    color: "text-emerald-400",
    border: "border-emerald-500/40",
    bg: "bg-emerald-950/20",
  },
];

const PRESETS: AutopilotPatternPreset[] = [
  {
    id: "preset-hypervigilance",
    title: "Perceptual Ambiguity → Catastrophic Autopilot",
    description: "Dr. Bheemaiah Anil K's canonical model of auditory/sensory ambiguity transitioning into rapid threat confirmation via autopilot.",
    behavioralPattern: "Sensory noise interpreted as hostility, leading to withdrawal and autonomic racing.",
    designPatternName: "Negative Feedback Cascade & Circuit Breaker",
    chittaAutopilotContrast: "The autopilot treats stored past trauma (Chitta) as immediate physical danger without verifying through sensory reality.",
    buddhiResolution: "Buddhi pauses the cascade by grounding through tactile senses, allowing Bodhichitta self-compassion to disarm the alarm.",
    nodes: [
      { id: "n1", label: "Ambiguous Ambient Sound", type: "trigger", plane: "manas", x: 120, y: 140, intensity: 6, color: "#f59e0b" },
      { id: "n2", label: "Autopilot: 'They are speaking about me'", type: "autopilot_loop", plane: "autopilot", x: 330, y: 90, intensity: 9, color: "#f43f5e" },
      { id: "n3", label: "Chitta Latent Fear Memory", type: "somatic_sensation", plane: "chitta", x: 260, y: 290, intensity: 7, color: "#06b6d4" },
      { id: "n4", label: "Buddhi: Reality Check & Breath Anchor", type: "buddhi_discernment", plane: "buddhi", x: 540, y: 180, intensity: 8, color: "#818cf8" },
      { id: "n5", label: "Bodhichitta: 'I am safe in this moment'", type: "bodhichitta_anchor", plane: "bodhichitta", x: 740, y: 180, intensity: 10, color: "#10b981" },
    ],
    transitions: [
      { id: "t1", from: "n1", to: "n2", label: "Automatic threat attribution", triggerCondition: "Dopaminergic salience surge", habitStrength: 9 },
      { id: "t2", from: "n2", to: "n3", label: "Resonates stored trauma", triggerCondition: "Chitta activation", habitStrength: 8 },
      { id: "t3", from: "n3", to: "n2", label: "Amplifies rumination loop", triggerCondition: "Feedback loop", habitStrength: 9 },
      { id: "t4", from: "n2", to: "n4", label: "Buddhi Interruption: 4-4-6-2 breath", triggerCondition: "Conscious mindful pause", habitStrength: 4 },
      { id: "t5", from: "n4", to: "n5", label: "Awakened compassionate ground", triggerCondition: "Bodhichitta integration", habitStrength: 6 },
    ],
  },
  {
    id: "preset-rumination",
    title: "Self-Critical Shame Spiral → Buddhi Discernment",
    description: "Deconstructing chronic unworthiness and perceived failure loops using schizoOS state transitions.",
    behavioralPattern: "Small setback triggers generalized self-blame, social avoidance, and depressive paralysis.",
    designPatternName: "Recursive Error Loop & Observer State Switch",
    chittaAutopilotContrast: "Autopilot equates transient performance with immutable identity; Chitta stirs memories of past criticism.",
    buddhiResolution: "Buddhi identifies the cognitive distortion (all-or-nothing thinking) and transfers agency to Bodhichitta.",
    nodes: [
      { id: "r1", label: "Perceived Mistake / Social Pause", type: "trigger", plane: "manas", x: 130, y: 170, intensity: 5, color: "#f59e0b" },
      { id: "r2", label: "Autopilot: 'I ruin everything always'", type: "autopilot_loop", plane: "autopilot", x: 340, y: 110, intensity: 8, color: "#f43f5e" },
      { id: "r3", label: "Somatic Heaviness & Gut Clench", type: "somatic_sensation", plane: "chitta", x: 320, y: 280, intensity: 7, color: "#06b6d4" },
      { id: "r4", label: "Buddhi: 'A thought is not a fact'", type: "buddhi_discernment", plane: "buddhi", x: 550, y: 190, intensity: 9, color: "#818cf8" },
      { id: "r5", label: "Bodhichitta: Loving Kindness to Hurt Self", type: "bodhichitta_anchor", plane: "bodhichitta", x: 750, y: 190, intensity: 10, color: "#10b981" },
    ],
    transitions: [
      { id: "rt1", from: "r1", to: "r2", label: "Instant catastrophizing", triggerCondition: "Habitual self-criticism", habitStrength: 9 },
      { id: "rt2", from: "r2", to: "r3", label: "Somatic translation", triggerCondition: "Vagal shutdown", habitStrength: 8 },
      { id: "rt3", from: "r3", to: "r2", label: "Somatic feedback confirms thought", triggerCondition: "Visceral distress", habitStrength: 8 },
      { id: "rt4", from: "r2", to: "r4", label: "MiCBT interoceptive witness", triggerCondition: "Noting sensation without story", habitStrength: 5 },
      { id: "rt5", from: "r4", to: "r5", label: "Maternal Mother Divine embrace", triggerCondition: "Compassion surge", habitStrength: 7 },
    ],
  },
];

interface SchizoOSExplorerProps {
  onSendPatternToChat?: (summary: string) => void;
}

export const SchizoOSExplorer: React.FC<SchizoOSExplorerProps> = ({ onSendPatternToChat }) => {
  const [activePreset, setActivePreset] = useState<AutopilotPatternPreset>(PRESETS[0]);
  const [nodes, setNodes] = useState<SchizoOSNode[]>(PRESETS[0].nodes);
  const [transitions, setTransitions] = useState<SchizoOSTransition[]>(PRESETS[0].transitions);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>("n2");
  const [activeSimulationStep, setActiveSimulationStep] = useState<number | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [draggedNodeId, setDraggedNodeId] = useState<string | null>(null);
  const [activePlaneFilter, setActivePlaneFilter] = useState<ConsciousnessPlane | "all">("all");

  // New Node Form state
  const [newNodeLabel, setNewNodeLabel] = useState("");
  const [newNodePlane, setNewNodePlane] = useState<ConsciousnessPlane>("autopilot");
  const [newNodeIntensity, setNewNodeIntensity] = useState(7);

  // Simulation runner
  useEffect(() => {
    if (!isSimulating) return;

    const interval = setInterval(() => {
      setActiveSimulationStep((prev) => {
        if (prev === null || prev >= nodes.length - 1) {
          return 0;
        }
        return prev + 1;
      });
    }, 1800);

    return () => clearInterval(interval);
  }, [isSimulating, nodes.length]);

  const handleSelectPreset = (preset: AutopilotPatternPreset) => {
    setActivePreset(preset);
    setNodes(preset.nodes);
    setTransitions(preset.transitions);
    setSelectedNodeId(preset.nodes[1]?.id || preset.nodes[0]?.id || null);
    setActiveSimulationStep(null);
    setIsSimulating(false);
  };

  const handleAddNode = () => {
    if (!newNodeLabel.trim()) return;
    const colors: Record<ConsciousnessPlane, string> = {
      autopilot: "#f43f5e",
      manas: "#f59e0b",
      chitta: "#06b6d4",
      buddhi: "#818cf8",
      bodhichitta: "#10b981",
    };

    const newNode: SchizoOSNode = {
      id: `custom-${Date.now()}`,
      label: newNodeLabel.trim(),
      type: newNodePlane === "autopilot" ? "autopilot_loop" : newNodePlane === "buddhi" ? "buddhi_discernment" : "somatic_sensation",
      plane: newNodePlane,
      x: 150 + Math.random() * 450,
      y: 100 + Math.random() * 220,
      intensity: newNodeIntensity,
      color: colors[newNodePlane],
    };

    setNodes((prev) => [...prev, newNode]);

    // Automatically create a transition if a node was selected
    if (selectedNodeId) {
      const newTrans: SchizoOSTransition = {
        id: `trans-${Date.now()}`,
        from: selectedNodeId,
        to: newNode.id,
        label: "Reflective shift",
        triggerCondition: "Mindful observation",
        habitStrength: 5,
      };
      setTransitions((prev) => [...prev, newTrans]);
    }

    setNewNodeLabel("");
    setSelectedNodeId(newNode.id);
  };

  const handleDeleteNode = (id: string) => {
    setNodes((prev) => prev.filter((n) => n.id !== id));
    setTransitions((prev) => prev.filter((t) => t.from !== id && t.to !== id));
    if (selectedNodeId === id) setSelectedNodeId(null);
  };

  // Dragging nodes on canvas
  const handleCanvasMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!draggedNodeId) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.max(50, Math.min(rect.width - 50, e.clientX - rect.left));
    const y = Math.max(40, Math.min(rect.height - 40, e.clientY - rect.top));

    setNodes((prev) =>
      prev.map((node) => (node.id === draggedNodeId ? { ...node, x, y } : node))
    );
  };

  const selectedNode = nodes.find((n) => n.id === selectedNodeId);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1 max-w-3xl">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-medium bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                schizoOS Cognitive Architecture
              </span>
              <span className="text-xs text-slate-400">
                Invented by <strong>Dr. Bheemaiah Anil K</strong>, Director of Vayu Vaidya
              </span>
            </div>
            <h2 className="text-xl font-bold text-slate-100 font-display">
              Autopilot vs. Chitta, Buddhi, Manas & Bodhichitta State Pattern Modeling
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              Understand the subconscious <strong>autopilot</strong> in you versus your deeper consciousness planes:
              <strong> Manas</strong> (sensory gateway), <strong>Chitta</strong> (stored impressions),
              <strong> Buddhi</strong> (higher discernment & discernment-will), and <strong>Bodhichitta</strong> (awakened compassionate heart).
              Map state transitions, discover circuit breakers, and draw behavioral/design patterns for self-reflection.
            </p>
          </div>

          {/* Action to send to chat */}
          {onSendPatternToChat && (
            <button
              onClick={() =>
                onSendPatternToChat(
                  `I am studying my schizoOS Autopilot thinking pattern: "${activePreset.title}". Design pattern: ${activePreset.designPatternName}. How can Mother Divine help me transition my autopilot into Buddhi discernment and Bodhichitta warmth right now?`
                )
              }
              className="px-4 py-2 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-slate-950 font-semibold text-xs transition-all flex items-center gap-2 shadow-lg shadow-indigo-500/20"
            >
              <Compass className="w-4 h-4" />
              <span>Discuss Pattern with Mother Divine</span>
            </button>
          )}
        </div>

        {/* 5 Planes of Consciousness Legend */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 pt-3 border-t border-slate-800/80 text-xs">
          {CONSCIOUSNESS_LEVELS.map((lvl) => (
            <div
              key={lvl.plane}
              onClick={() => setActivePlaneFilter(activePlaneFilter === lvl.plane ? "all" : lvl.plane)}
              className={`p-2.5 rounded-xl border cursor-pointer transition-all ${
                activePlaneFilter === lvl.plane
                  ? `${lvl.bg} ${lvl.border} ring-1 ring-cyan-400/50`
                  : "bg-slate-950/60 border-slate-800/80 hover:border-slate-700"
              }`}
            >
              <div className="flex items-center justify-between gap-1 mb-0.5">
                <span className={`font-semibold text-xs ${lvl.color}`}>{lvl.title}</span>
              </div>
              <div className="text-[10px] text-slate-400 font-mono">{lvl.role}</div>
              <p className="text-[10px] text-slate-500 line-clamp-2 mt-1 leading-tight">{lvl.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Preset Selector & Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs">
        <div className="flex items-center gap-2 overflow-x-auto">
          <span className="text-slate-400 font-medium">Autopilot Pattern Models:</span>
          {PRESETS.map((p) => (
            <button
              key={p.id}
              onClick={() => handleSelectPreset(p)}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all whitespace-nowrap ${
                activePreset.id === p.id
                  ? "bg-indigo-500 text-slate-950 shadow-md shadow-indigo-500/20"
                  : "bg-slate-950 text-slate-300 border border-slate-800 hover:border-slate-700"
              }`}
            >
              {p.title}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsSimulating(!isSimulating)}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 font-medium transition-all ${
              isSimulating
                ? "bg-amber-500 text-slate-950"
                : "bg-emerald-500 hover:bg-emerald-400 text-slate-950"
            }`}
          >
            {isSimulating ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isSimulating ? "Pause State Machine" : "Animate Autopilot Flow"}</span>
          </button>

          <button
            onClick={() => {
              setIsSimulating(false);
              setActiveSimulationStep(null);
            }}
            className="p-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-400 hover:text-slate-200"
            title="Reset Simulation"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Interactive Stage: SVG Canvas State Machine + Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 8 Cols: Interactive State Diagram */}
        <div className="lg:col-span-8 bg-slate-950 rounded-2xl border border-slate-800 p-4 relative overflow-hidden flex flex-col">
          <div className="flex items-center justify-between mb-2 text-xs text-slate-400">
            <span className="flex items-center gap-1.5 font-mono">
              <Workflow className="w-4 h-4 text-cyan-400" />
              Interactive State Machine Canvas (Drag nodes to reposition)
            </span>
            <span className="text-[11px] text-slate-500">
              Pattern: <strong className="text-slate-300">{activePreset.designPatternName}</strong>
            </span>
          </div>

          {/* SVG Diagram Canvas */}
          <div className="relative w-full h-[480px] bg-slate-950/90 rounded-xl border border-slate-800/80 overflow-hidden select-none">
            {/* Background Grid Lines */}
            <svg
              className="w-full h-full cursor-crosshair"
              onMouseMove={handleCanvasMouseMove}
              onMouseUp={() => setDraggedNodeId(null)}
              onMouseLeave={() => setDraggedNodeId(null)}
            >
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(51, 65, 85, 0.2)" strokeWidth="1" />
                </pattern>
                <marker
                  id="arrow"
                  viewBox="0 0 10 10"
                  refX="22"
                  refY="5"
                  markerWidth="6"
                  markerHeight="6"
                  orient="auto-start-reverse"
                >
                  <path d="M 0 1 L 10 5 L 0 9 z" fill="#64748b" />
                </marker>
                <marker
                  id="arrow-active"
                  viewBox="0 0 10 10"
                  refX="22"
                  refY="5"
                  markerWidth="6"
                  markerHeight="6"
                  orient="auto-start-reverse"
                >
                  <path d="M 0 1 L 10 5 L 0 9 z" fill="#06b6d4" />
                </marker>
              </defs>

              <rect width="100%" height="100%" fill="url(#grid)" />

              {/* Draw Transitions (Lines with curved arcs & arrows) */}
              {transitions.map((trans, idx) => {
                const source = nodes.find((n) => n.id === trans.from);
                const target = nodes.find((n) => n.id === trans.to);
                if (!source || !target) return null;

                const isPathActive =
                  activeSimulationStep !== null &&
                  nodes[activeSimulationStep]?.id === source.id;

                // Midpoint for transition label
                const midX = (source.x + target.x) / 2;
                const midY = (source.y + target.y) / 2 - 12;

                return (
                  <g key={trans.id} className="transition-all duration-300">
                    <line
                      x1={source.x}
                      y1={source.y}
                      x2={target.x}
                      y2={target.y}
                      stroke={isPathActive ? "#06b6d4" : "#475569"}
                      strokeWidth={isPathActive ? 3 : 1.5}
                      strokeDasharray={trans.habitStrength > 7 ? "none" : "4 4"}
                      markerEnd={isPathActive ? "url(#arrow-active)" : "url(#arrow)"}
                      className={isPathActive ? "animate-pulse" : ""}
                    />
                    {/* Label chip on edge */}
                    <rect
                      x={midX - 55}
                      y={midY - 9}
                      width={110}
                      height={18}
                      rx={6}
                      fill="#020617"
                      stroke={isPathActive ? "#06b6d4" : "#334155"}
                      strokeWidth={0.8}
                    />
                    <text
                      x={midX}
                      y={midY + 4}
                      fill={isPathActive ? "#38bdf8" : "#94a3b8"}
                      fontSize="9"
                      textAnchor="middle"
                      fontFamily="monospace"
                    >
                      {trans.label.length > 18 ? trans.label.slice(0, 18) + "…" : trans.label}
                    </text>
                  </g>
                );
              })}

              {/* Draw State Nodes (Circles with concentric rings & icons) */}
              {nodes.map((node, index) => {
                const isSelected = selectedNodeId === node.id;
                const isCurrentSim = activeSimulationStep === index;
                const planeConfig = CONSCIOUSNESS_LEVELS.find((p) => p.plane === node.plane);
                const radius = 24 + node.intensity * 1.5;

                return (
                  <g
                    key={node.id}
                    transform={`translate(${node.x}, ${node.y})`}
                    className="cursor-pointer"
                    onMouseDown={() => {
                      setSelectedNodeId(node.id);
                      setDraggedNodeId(node.id);
                    }}
                  >
                    {/* Outer Glow on Active/Selected */}
                    {(isSelected || isCurrentSim) && (
                      <circle
                        r={radius + 8}
                        fill="none"
                        stroke={node.color || "#38bdf8"}
                        strokeWidth="2"
                        opacity={isCurrentSim ? 0.8 : 0.4}
                        className={isCurrentSim ? "animate-ping" : ""}
                      />
                    )}

                    {/* Main Node Circle */}
                    <circle
                      r={radius}
                      fill="#020617"
                      stroke={node.color || "#64748b"}
                      strokeWidth={isSelected ? 3 : 2}
                      className="transition-all hover:scale-105"
                    />

                    {/* Inner Consciousness Core Ring */}
                    <circle
                      r={radius - 6}
                      fill={
                        node.plane === "autopilot"
                          ? "rgba(244, 63, 94, 0.15)"
                          : node.plane === "buddhi"
                          ? "rgba(129, 140, 248, 0.18)"
                          : node.plane === "bodhichitta"
                          ? "rgba(16, 185, 129, 0.18)"
                          : "rgba(6, 182, 212, 0.15)"
                      }
                    />

                    {/* Plane Tag */}
                    <text
                      y="-4"
                      fill="#e2e8f0"
                      fontSize="10"
                      fontWeight="bold"
                      textAnchor="middle"
                      fontFamily="system-ui"
                    >
                      {node.plane.toUpperCase()}
                    </text>
                    <text
                      y="10"
                      fill={node.color || "#94a3b8"}
                      fontSize="8"
                      textAnchor="middle"
                      fontFamily="monospace"
                    >
                      Lv.{node.intensity}
                    </text>

                    {/* Node Text Label Underneath */}
                    <text
                      y={radius + 14}
                      fill={isSelected ? "#38bdf8" : "#cbd5e1"}
                      fontSize="10"
                      textAnchor="middle"
                      fontWeight="500"
                    >
                      {node.label.length > 22 ? node.label.slice(0, 22) + "…" : node.label}
                    </text>
                  </g>
                );
              })}
            </svg>

            {/* Bottom Status Bar on Canvas */}
            <div className="absolute bottom-2 left-2 right-2 p-2 rounded-lg bg-slate-950/80 backdrop-blur border border-slate-800 text-[11px] flex items-center justify-between">
              <span className="text-slate-400">
                {activeSimulationStep !== null
                  ? `Active Step: ${nodes[activeSimulationStep]?.label} (${nodes[activeSimulationStep]?.plane})`
                  : "Click any state node to examine or drag to rearrange thinking flow"}
              </span>
              <span className="font-mono text-cyan-400">
                {nodes.length} States • {transitions.length} Transitions
              </span>
            </div>
          </div>

          {/* Add New State Transition Input */}
          <div className="mt-4 pt-4 border-t border-slate-800 flex flex-wrap items-center gap-3">
            <input
              type="text"
              value={newNodeLabel}
              onChange={(e) => setNewNodeLabel(e.target.value)}
              placeholder="Add thought / reaction (e.g. 'Mindful breath observation')..."
              className="flex-1 min-w-[200px] px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
            />

            <select
              value={newNodePlane}
              onChange={(e) => setNewNodePlane(e.target.value as ConsciousnessPlane)}
              className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 focus:outline-none"
            >
              <option value="autopilot">Autopilot (Yantra loop)</option>
              <option value="manas">Manas (Sensory instinct)</option>
              <option value="chitta">Chitta (Stored memory)</option>
              <option value="buddhi">Buddhi (Higher discernment)</option>
              <option value="bodhichitta">Bodhichitta (Compassion core)</option>
            </select>

            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <span>Intensity:</span>
              <input
                type="range"
                min="1"
                max="10"
                value={newNodeIntensity}
                onChange={(e) => setNewNodeIntensity(Number(e.target.value))}
                className="w-20 accent-cyan-400"
              />
              <span className="font-mono text-cyan-400 w-4">{newNodeIntensity}</span>
            </div>

            <button
              onClick={handleAddNode}
              className="px-3.5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-xs transition-all flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Add State Node</span>
            </button>
          </div>
        </div>

        {/* Right 4 Cols: State Inspector & Philosophical Breakdown */}
        <div className="lg:col-span-4 space-y-4">
          {/* Selected Node Details */}
          {selectedNode ? (
            <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <span
                  className="px-2.5 py-0.5 rounded-full text-[11px] font-mono uppercase font-semibold"
                  style={{
                    backgroundColor: `${selectedNode.color}15`,
                    color: selectedNode.color,
                    border: `1px solid ${selectedNode.color}40`,
                  }}
                >
                  {selectedNode.plane} Plane
                </span>
                <button
                  onClick={() => handleDeleteNode(selectedNode.id)}
                  className="text-slate-500 hover:text-rose-400 transition-colors p-1"
                  title="Delete State"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-100">{selectedNode.label}</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Type: <span className="font-mono text-cyan-300">{selectedNode.type}</span>
                </p>
              </div>

              {/* Plane Insight */}
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5 text-xs">
                <div className="font-semibold text-slate-200">
                  {CONSCIOUSNESS_LEVELS.find((p) => p.plane === selectedNode.plane)?.title}
                </div>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  {CONSCIOUSNESS_LEVELS.find((p) => p.plane === selectedNode.plane)?.description}
                </p>
              </div>

              {/* Autopilot vs Deeper Mind Reflection */}
              <div className="space-y-2 text-xs">
                <div className="font-medium text-slate-300 flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-amber-400" />
                  Self-Reflection Insight:
                </div>
                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80 text-[11px] text-slate-300 leading-relaxed">
                  {selectedNode.plane === "autopilot" ? (
                    <span>
                      ⚠️ <strong>Autopilot Trap:</strong> This state is operating on reflexive habituation.
                      The mind treats internal stories as objective external truth. To disarm, bring in Buddhi discernment.
                    </span>
                  ) : selectedNode.plane === "buddhi" ? (
                    <span>
                      ✨ <strong>Buddhi Awakening:</strong> Here you stand as the conscious witness. You are observing
                      the thought without identifying with it. You have agency to redirect.
                    </span>
                  ) : selectedNode.plane === "bodhichitta" ? (
                    <span>
                      🌿 <strong>Bodhichitta Refuge:</strong> Warm, compassionate embrace. No self-criticism or blame.
                      Holding whatever arises in gentle loving-kindness.
                    </span>
                  ) : (
                    <span>
                      🌊 <strong>Chitta/Manas Wave:</strong> Sensation or past stored memory bubbling up. Neither good nor bad;
                      it just requires non-reactive awareness.
                    </span>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 text-center text-xs text-slate-500">
              Select any state circle on the left canvas to inspect its cognitive plane and transitions.
            </div>
          )}

          {/* Canonical schizoOS Pattern Guide Card */}
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3 text-xs">
            <h4 className="font-semibold text-slate-200 flex items-center gap-1.5">
              <Brain className="w-4 h-4 text-indigo-400" />
              Dr. Bheemaiah Anil K's schizoOS Principles
            </h4>
            <div className="space-y-2 text-slate-400 text-[11px] leading-relaxed">
              <div className="p-2 rounded-lg bg-slate-950 border border-slate-800/80">
                <strong className="text-slate-200 block">1. The Autopilot (Yantra):</strong>
                Our default mechanical thinking repeats past conditioning. In psychosis, the autopilot generates false threat certainty.
              </div>
              <div className="p-2 rounded-lg bg-slate-950 border border-slate-800/80">
                <strong className="text-slate-200 block">2. Chitta vs. Buddhi:</strong>
                Chitta stores impressions; Buddhi is the observer. Mental wellness occurs when Buddhi decouples from the autopilot loops.
              </div>
              <div className="p-2 rounded-lg bg-slate-950 border border-slate-800/80">
                <strong className="text-slate-200 block">3. Bodhichitta as Shield:</strong>
                Radical self-compassion disarms panic. Voices and distortions lose their terror when met with warm maternal peace.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
