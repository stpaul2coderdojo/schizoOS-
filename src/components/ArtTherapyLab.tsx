import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  Palette,
  Sparkles,
  RotateCcw,
  Download,
  Eye,
  Activity,
  Heart,
  Compass,
  PieChart,
  Layers,
  Send,
  Sliders,
  CheckCircle2,
  Wand2,
  Image as ImageIcon,
  Volume2,
  Undo2,
  Redo2,
  Paintbrush,
  Eraser,
  CircleDot,
  Upload,
  Radio,
  Play,
  X,
  Maximize2
} from "lucide-react";
import { ColorClusterMetric, StatePodAnalysis, BotMediaItem } from "../types";
import { speakText, soundEngine } from "../utils/audioSynth";

const PALETTES = [
  { name: "Vayu Cyan", hex: "#06b6d4" },
  { name: "Wallmiki Azure", hex: "#0284c7" },
  { name: "Chitta Deep Indigo", hex: "#3b82f6" },
  { name: "Buddhi Sacred Violet", hex: "#8b5cf6" },
  { name: "Bodhichitta Gold", hex: "#eab308" },
  { name: "Lotus Rose", hex: "#f43f5e" },
  { name: "Prana Emerald", hex: "#10b981" },
  { name: "Solar Amber", hex: "#f59e0b" },
  { name: "Subconscious Shadow", hex: "#1e1b4b" },
  { name: "Moonlight Luminous", hex: "#f8fafc" },
];

const BRUSH_PRESETS = [
  { id: "glow", name: "Ethereal Glow", icon: Sparkles, blur: 14, defaultOpacity: 0.9 },
  { id: "fluid", name: "Fluid Paint", icon: Paintbrush, blur: 0, defaultOpacity: 0.85 },
  { id: "wash", name: "Watercolor Wash", icon: CircleDot, blur: 4, defaultOpacity: 0.35 },
  { id: "eraser", name: "Eraser", icon: Eraser, blur: 0, defaultOpacity: 1.0 },
];

const SYMMETRY_MODES = [
  { id: "none", label: "Freehand", description: "Direct expressive gestures" },
  { id: "mirror", label: "Bilateral Mirror", description: "Left-right reflection" },
  { id: "quad", label: "4-Way Cross", description: "Four quadrant reflections" },
  { id: "mandala", label: "8-Fold Mandala", description: "Radial 8-petaled sacred symmetry" },
];

// Curated Wallmiki Bot Media items
const FALLBACK_BOT_MEDIA: BotMediaItem[] = [
  {
    id: "mandala-buddhi",
    title: "Sri Yantra of Higher Discernment (Buddhi)",
    category: "Sacred Geometry",
    type: "geometry",
    description: "Nine interlocking triangles radiating cosmic harmony. Sharpens focus and calms erratic autopilot thoughts into single-pointed Buddhi clarity.",
    colorTone: "#8b5cf6",
    ambientFreq: 528,
    tags: ["Sacred Geometry", "Buddhi", "Focus", "528Hz"],
    quote: "In the still center of the Sri Yantra, the chatter of the autopilot dissolves into pure witnessing awareness."
  },
  {
    id: "mandala-lotus",
    title: "Lotus of Bodhichitta Sanctuary",
    category: "Sacred Geometry",
    type: "geometry",
    description: "Twelve radiant petals blooming in deep waters. Embodying compassion, heart resonance, and non-judgmental acceptance of all sensations.",
    colorTone: "#06b6d4",
    ambientFreq: 432,
    tags: ["Heart Chakra", "Compassion", "Somatic Ease", "432Hz"],
    quote: "Like the lotus untouched by murky mud, the mind rests unsullied by momentary delusions."
  },
  {
    id: "mandala-torus",
    title: "Torus Field of Living Breath (Vayu)",
    category: "Sacred Geometry",
    type: "geometry",
    description: "Continuous self-sustaining harmonic energy vortex mapping the circulatory flow of prana through the heart and respiratory field.",
    colorTone: "#10b981",
    ambientFreq: 432,
    tags: ["Prana", "Vayu Circulation", "Autonomic Balance"],
    quote: "Every inhalation draws the cosmos inward; every exhalation returns peace to the universe."
  },
  {
    id: "schizo-os-map",
    title: "schizoOS Autopilot vs. Buddhi Circuit Map",
    category: "schizoOS Architecture",
    type: "architecture",
    description: "Cognitive circuit topology delineating the sub-conscious autopilot reflex loop, the Manas sensory gate, the Chitta memory lake, and the Buddhi mindful witness.",
    colorTone: "#3b82f6",
    ambientFreq: 108,
    tags: ["schizoOS", "Dr. Anil K", "Autopilot Deconstruction"],
    quote: "You are not the mechanical autopilot loop of your thoughts; you are the vast, silent space in which they arise and pass."
  },
  {
    id: "nature-twilight",
    title: "Himalayan Twilight & Mist Sanctuary",
    category: "Landscapes & Nature",
    type: "landscape",
    description: "Silent alpine mountain silhouettes shrouded in indigo dusk, cedar mist, and starshine. Calms hyper-arousal and visual/auditory overstimulation.",
    colorTone: "#6366f1",
    ambientFreq: 432,
    tags: ["Grounding", "Twilight", "Sensory Rest"],
    quote: "Stillness settles upon the mountains as peace settles upon the observant heart."
  },
  {
    id: "verse-wallmiki",
    title: "Wallmiki's Calligraphy of the Still Witness",
    category: "Sacred Verses",
    type: "verse",
    description: "Ancient meditative Sanskrit and English verses on the unshakeable inner observer, grounding identity beyond fleeting psychiatric labels.",
    colorTone: "#eab308",
    ambientFreq: 528,
    tags: ["Vedic Wisdom", "Self-Reflection", "Poetic Healing"],
    quote: "The wind (Vayu) blows through the flute, yet the flute remains hollow and serene. So let thoughts move through you without disturbing your peace."
  }
];

export const ArtTherapyLab: React.FC<{
  onSendArtAnalysisToChat?: (summary: string) => void;
  initialMediaToProject?: BotMediaItem | null;
}> = ({ onSendArtAnalysisToChat, initialMediaToProject }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  
  // Drawing states
  const [isDrawing, setIsDrawing] = useState(false);
  const [brushColor, setBrushColor] = useState("#06b6d4");
  const [brushSize, setBrushSize] = useState(10);
  const [brushOpacity, setBrushOpacity] = useState(0.85);
  const [brushType, setBrushType] = useState<"glow" | "fluid" | "wash" | "eraser">("glow");
  const [symmetryMode, setSymmetryMode] = useState<"none" | "mirror" | "quad" | "mandala">("none");
  const [strokeCount, setStrokeCount] = useState(0);
  const [drawingSpeedAvg, setDrawingSpeedAvg] = useState("Gentle meditative");
  const [lastPoint, setLastPoint] = useState<{ x: number; y: number; time: number } | null>(null);
  
  // Canvas background mode
  const [canvasBgTone, setCanvasBgTone] = useState<"deep" | "teal" | "parchment">("deep");

  // History for Undo / Redo
  const [undoStack, setUndoStack] = useState<ImageData[]>([]);
  const [redoStack, setRedoStack] = useState<ImageData[]>([]);

  // Bot Media states
  const [botMediaList, setBotMediaList] = useState<BotMediaItem[]>(FALLBACK_BOT_MEDIA);
  const [selectedMedia, setSelectedMedia] = useState<BotMediaItem | null>(initialMediaToProject || null);
  const [projectedMedia, setProjectedMedia] = useState<BotMediaItem | null>(initialMediaToProject || null);
  const [projectedOpacity, setProjectedOpacity] = useState(0.55);
  const [mediaCategoryFilter, setMediaCategoryFilter] = useState<string>("All");
  const [viewerModalMedia, setViewerModalMedia] = useState<BotMediaItem | null>(null);
  const [isPlayingAudioTone, setIsPlayingAudioTone] = useState(false);

  // Analysis result state
  const [analysis, setAnalysis] = useState<StatePodAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [automatismMode, setAutomatismMode] = useState<"feminist" | "surrealist" | "somatic">("feminist");

  // Fetch bot media from backend
  useEffect(() => {
    fetch("/api/bot-media")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && data.media && Array.isArray(data.media) && data.media.length > 0) {
          setBotMediaList(data.media);
        }
      })
      .catch(() => {
        // Fallback to rich embedded media
      });
  }, []);

  // Sync initialMediaToProject if provided
  useEffect(() => {
    if (initialMediaToProject) {
      setSelectedMedia(initialMediaToProject);
      setProjectedMedia(initialMediaToProject);
    }
  }, [initialMediaToProject]);

  // Background color helper
  const getBgColor = (tone: "deep" | "teal" | "parchment") => {
    if (tone === "teal") return "#042f2e";
    if (tone === "parchment") return "#1e293b";
    return "#030712"; // deep cosmos
  };

  // Save current state for undo
  const saveUndoSnapshot = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    try {
      const snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
      setUndoStack((prev) => [...prev.slice(-14), snapshot]);
      setRedoStack([]);
    } catch (e) {
      // Ignored if tainted
    }
  }, []);

  // Render projected bot media onto canvas
  const renderBotMediaUnderlay = useCallback((
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    media: BotMediaItem,
    opacity: number
  ) => {
    ctx.save();
    ctx.globalAlpha = opacity;
    const cx = width / 2;
    const cy = height / 2;

    if (media.type === "geometry" || media.id.includes("mandala")) {
      // Draw procedural sacred geometry mandala
      const isSriYantra = media.id.includes("buddhi");
      const isLotus = media.id.includes("lotus");

      // Outer golden halo / ring
      ctx.strokeStyle = media.colorTone;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(cx, cy, Math.min(width, height) * 0.42, 0, Math.PI * 2);
      ctx.stroke();

      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(cx, cy, Math.min(width, height) * 0.38, 0, Math.PI * 2);
      ctx.stroke();

      // Radiating spokes / petal points
      const petalCount = isLotus ? 12 : 16;
      for (let i = 0; i < petalCount; i++) {
        const angle = (i * Math.PI * 2) / petalCount;
        const r1 = Math.min(width, height) * 0.28;
        const r2 = Math.min(width, height) * 0.38;
        const x1 = cx + Math.cos(angle) * r1;
        const y1 = cy + Math.sin(angle) * r1;
        const x2 = cx + Math.cos(angle) * r2;
        const y2 = cy + Math.sin(angle) * r2;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();

        // Petal curves
        if (isLotus) {
          ctx.beginPath();
          ctx.arc(cx + Math.cos(angle) * (r1 + 20), cy + Math.sin(angle) * (r1 + 20), 22, 0, Math.PI);
          ctx.stroke();
        }
      }

      if (isSriYantra) {
        // Interlocking sacred triangles
        for (let t = 0; t < 7; t++) {
          const size = 50 + t * 24;
          const up = t % 2 === 0;
          ctx.beginPath();
          if (up) {
            ctx.moveTo(cx, cy - size);
            ctx.lineTo(cx - size * 0.866, cy + size * 0.5);
            ctx.lineTo(cx + size * 0.866, cy + size * 0.5);
          } else {
            ctx.moveTo(cx, cy + size);
            ctx.lineTo(cx - size * 0.866, cy - size * 0.5);
            ctx.lineTo(cx + size * 0.866, cy - size * 0.5);
          }
          ctx.closePath();
          ctx.stroke();
        }
      } else {
        // Concentric harmonic circles
        for (let r = 30; r <= 150; r += 30) {
          ctx.beginPath();
          ctx.arc(cx, cy, r, 0, Math.PI * 2);
          ctx.stroke();
        }
      }

      // Center Bindu point
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.arc(cx, cy, 6, 0, Math.PI * 2);
      ctx.fill();
    } else if (media.type === "architecture" || media.id.includes("schizo")) {
      // schizoOS visual circuit map
      ctx.strokeStyle = media.colorTone;
      ctx.lineWidth = 2;

      // Autopilot Node Left
      ctx.strokeRect(cx - 240, cy - 60, 110, 60);
      ctx.fillStyle = "rgba(59, 130, 246, 0.2)";
      ctx.fillRect(cx - 240, cy - 60, 110, 60);
      ctx.fillStyle = "#ffffff";
      ctx.font = "11px monospace";
      ctx.fillText("AUTOPILOT", cx - 225, cy - 35);
      ctx.fillText("Subconscious", cx - 225, cy - 18);

      // Manas Gate Center-Left
      ctx.beginPath();
      ctx.arc(cx - 50, cy, 40, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = "#ffffff";
      ctx.fillText("MANAS", cx - 72, cy - 5);
      ctx.fillText("Sensory Gate", cx - 85, cy + 12);

      // Chitta Reservoir Center-Right
      ctx.beginPath();
      ctx.ellipse(cx + 80, cy, 60, 45, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = "#ffffff";
      ctx.fillText("CHITTA", cx + 60, cy - 5);
      ctx.fillText("Memory Lake", cx + 45, cy + 12);

      // Buddhi Witness Top Center
      ctx.beginPath();
      ctx.arc(cx, cy - 120, 45, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = "#ffffff";
      ctx.fillText("BUDDHI", cx - 22, cy - 125);
      ctx.fillText("Mindful Witness", cx - 45, cy - 108);

      // Interconnecting circuit arrows
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(cx - 130, cy - 30);
      ctx.lineTo(cx - 90, cy - 10);
      ctx.moveTo(cx - 10, cy);
      ctx.lineTo(cx + 20, cy);
      ctx.moveTo(cx + 80, cy - 45);
      ctx.lineTo(cx + 20, cy - 90);
      ctx.moveTo(cx - 20, cy - 90);
      ctx.lineTo(cx - 150, cy - 50);
      ctx.stroke();
      ctx.setLineDash([]);
    } else {
      // Landscape or Verse visual silhouette
      ctx.strokeStyle = media.colorTone;
      ctx.fillStyle = media.colorTone + "22";

      // Mountain ridge lines
      ctx.beginPath();
      ctx.moveTo(0, height * 0.7);
      ctx.lineTo(width * 0.25, height * 0.35);
      ctx.lineTo(width * 0.5, height * 0.65);
      ctx.lineTo(width * 0.75, height * 0.28);
      ctx.lineTo(width, height * 0.75);
      ctx.lineTo(width, height);
      ctx.lineTo(0, height);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Rising celestial sphere
      ctx.beginPath();
      ctx.arc(width * 0.5, height * 0.28, 45, 0, Math.PI * 2);
      ctx.stroke();

      // Quote banner if verse
      if (media.quote) {
        ctx.fillStyle = "#ffffff";
        ctx.font = "italic 13px serif";
        ctx.textAlign = "center";
        ctx.fillText(`"${media.quote}"`, cx, height * 0.9);
      }
    }

    ctx.restore();
  }, []);

  // Redraw canvas with background, optional projected media, and optional state pod stimulus
  const redrawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.fillStyle = getBgColor(canvasBgTone);
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // If bot media is projected onto canvas, render it as underlay
    if (projectedMedia) {
      renderBotMediaUnderlay(ctx, canvas.width, canvas.height, projectedMedia, projectedOpacity);
    } else {
      // Subtle faint pod outlines to encourage spontaneous automatism
      ctx.save();
      ctx.strokeStyle = "rgba(100, 116, 139, 0.2)";
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 8]);
      ctx.beginPath();
      ctx.ellipse(canvas.width * 0.3, canvas.height * 0.45, 90, 70, 0.2, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.ellipse(canvas.width * 0.7, canvas.height * 0.5, 110, 85, -0.3, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.ellipse(canvas.width * 0.5, canvas.height * 0.65, 80, 60, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }
  }, [canvasBgTone, projectedMedia, projectedOpacity, renderBotMediaUnderlay]);

  // Initial Canvas setup
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const parent = canvas.parentElement;
    canvas.width = parent?.clientWidth || 780;
    canvas.height = 480;
    redrawCanvas();
    saveUndoSnapshot();
  }, [redrawCanvas, saveUndoSnapshot]);

  // Handle projection toggle / change
  const handleProjectMediaToCanvas = (media: BotMediaItem) => {
    setProjectedMedia(media);
    setSelectedMedia(media);
    speakText(
      `Projecting ${media.title} onto the interactive canvas. Feel free to paint over it, trace its lines, or express whatever arises in your thoughts.`
    );
  };

  const handleClearProjection = () => {
    setProjectedMedia(null);
  };

  // Drawing Handlers
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;

    const x = clientX - rect.left;
    const y = clientY - rect.top;

    saveUndoSnapshot();
    setIsDrawing(true);
    setLastPoint({ x, y, time: Date.now() });
    setStrokeCount((c) => c + 1);
  };

  // Helper to draw a point or line segment with selected symmetry
  const drawSegment = (
    ctx: CanvasRenderingContext2D,
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    width: number,
    height: number
  ) => {
    const cx = width / 2;
    const cy = height / 2;

    const drawLine = (ax: number, ay: number, bx: number, by: number) => {
      ctx.beginPath();
      ctx.moveTo(ax, ay);
      ctx.lineTo(bx, by);
      ctx.stroke();
    };

    if (symmetryMode === "none") {
      drawLine(x1, y1, x2, y2);
    } else if (symmetryMode === "mirror") {
      // 1. Original
      drawLine(x1, y1, x2, y2);
      // 2. Mirrored horizontally
      drawLine(cx - (x1 - cx), y1, cx - (x2 - cx), y2);
    } else if (symmetryMode === "quad") {
      // 4 Quadrants
      drawLine(x1, y1, x2, y2);
      drawLine(cx - (x1 - cx), y1, cx - (x2 - cx), y2);
      drawLine(x1, cy - (y1 - cy), x2, cy - (y2 - cy));
      drawLine(cx - (x1 - cx), cy - (y1 - cy), cx - (x2 - cx), cy - (y2 - cy));
    } else if (symmetryMode === "mandala") {
      // 8-Fold Radial Mandala Symmetry
      const points = 8;
      for (let i = 0; i < points; i++) {
        const angle = (i * Math.PI * 2) / points;
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);

        // Rotate (x1 - cx, y1 - cy)
        const rx1 = cx + (x1 - cx) * cos - (y1 - cy) * sin;
        const ry1 = cy + (x1 - cx) * sin + (y1 - cy) * cos;
        const rx2 = cx + (x2 - cx) * cos - (y2 - cy) * sin;
        const ry2 = cy + (x2 - cx) * sin + (y2 - cy) * cos;

        drawLine(rx1, ry1, rx2, ry2);

        // Also mirror across radial axis for true bilateral mandala reflection
        const mx1 = cx - (x1 - cx) * cos - (y1 - cy) * sin;
        const my1 = cy + (x1 - cx) * sin - (y1 - cy) * cos;
        const mx2 = cx - (x2 - cx) * cos - (y2 - cy) * sin;
        const my2 = cy + (x2 - cx) * sin - (y2 - cy) * cos;

        drawLine(mx1, my1, mx2, my2);
      }
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !lastPoint) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;

    const x = clientX - rect.left;
    const y = clientY - rect.top;
    const now = Date.now();

    // Speed calculation
    const dist = Math.hypot(x - lastPoint.x, y - lastPoint.y);
    const dt = Math.max(1, now - lastPoint.time);
    const speed = dist / dt;

    if (speed > 1.8) {
      setDrawingSpeedAvg("Rapid cathartic release");
    } else if (speed > 0.8) {
      setDrawingSpeedAvg("Fluid expressive flow");
    } else {
      setDrawingSpeedAvg("Deep contemplative rhythm");
    }

    ctx.save();
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = brushSize;

    if (brushType === "eraser") {
      ctx.globalCompositeOperation = "destination-out";
      ctx.strokeStyle = "rgba(0,0,0,1)";
      ctx.shadowBlur = 0;
    } else {
      ctx.globalCompositeOperation = "source-over";
      ctx.strokeStyle = brushColor;
      ctx.globalAlpha = brushOpacity;

      if (brushType === "glow") {
        ctx.shadowColor = brushColor;
        ctx.shadowBlur = 14;
      } else if (brushType === "wash") {
        ctx.shadowBlur = 4;
        ctx.shadowColor = brushColor;
      } else {
        ctx.shadowBlur = 0;
      }
    }

    drawSegment(ctx, lastPoint.x, lastPoint.y, x, y, canvas.width, canvas.height);
    ctx.restore();

    setLastPoint({ x, y, time: now });
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    setLastPoint(null);
  };

  // Undo Handler
  const handleUndo = () => {
    if (undoStack.length === 0) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const currentImg = ctx.getImageData(0, 0, canvas.width, canvas.height);
    setRedoStack((prev) => [...prev, currentImg]);

    const prevImg = undoStack[undoStack.length - 1];
    setUndoStack((prev) => prev.slice(0, -1));
    ctx.putImageData(prevImg, 0, 0);
  };

  // Redo Handler
  const handleRedo = () => {
    if (redoStack.length === 0) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const nextImg = redoStack[redoStack.length - 1];
    setRedoStack((prev) => prev.slice(0, -1));

    const currentImg = ctx.getImageData(0, 0, canvas.width, canvas.height);
    setUndoStack((prev) => [...prev, currentImg]);

    ctx.putImageData(nextImg, 0, 0);
  };

  // Clear Canvas
  const handleClear = () => {
    saveUndoSnapshot();
    redrawCanvas();
    setStrokeCount(0);
    setAnalysis(null);
  };

  // Download Artwork as PNG
  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const url = canvas.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = url;
    a.download = `wallmiki-art-therapy-${Date.now()}.png`;
    a.click();
  };

  // Image file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        saveUndoSnapshot();
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  // Run State Pod Automatism & Color Cluster Analysis
  const performAnalysis = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    setIsAnalyzing(true);

    setTimeout(() => {
      try {
        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imgData.data;
        let totalNonBgPixels = 0;
        let cyanPixels = 0;
        let rosePixels = 0;
        let amberPixels = 0;
        let violetPixels = 0;
        let emeraldPixels = 0;

        for (let i = 0; i < data.length; i += 16) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          const brightness = (r + g + b) / 3;

          if (brightness > 22) {
            totalNonBgPixels++;
            if (b > r && g > r && b > 90) cyanPixels++;
            else if (r > 140 && b > 90 && g < 130) rosePixels++;
            else if (r > 140 && g > 90 && b < 80) amberPixels++;
            else if (b > 130 && r > 90) violetPixels++;
            else if (g > 130 && r < 110) emeraldPixels++;
          }
        }

        const total = Math.max(1, totalNonBgPixels);
        const cyanPct = Math.round((cyanPixels / total) * 100);
        const rosePct = Math.round((rosePixels / total) * 100);
        const amberPct = Math.round((amberPixels / total) * 100);
        const violetPct = Math.round((violetPixels / total) * 100);
        const emeraldPct = Math.round((emeraldPixels / total) * 100);

        const clusters: ColorClusterMetric[] = [
          {
            name: "Vayu Cyan & Aquatic Calm",
            hex: "#06b6d4",
            percentage: cyanPct || 35,
            symbolism: "Parasympathetic regulation, spacious prana, and sensory clearing.",
            emotionalResonance: "Calms auditory and perceptual hyper-reactivity, establishing soothing stillness.",
            feministArtPerspective: "Fluid, non-linear reclamation of intuitive emotional depth outside patriarchally enforced rigid logic.",
          },
          {
            name: "Lotus Rose & Somatic Warmth",
            hex: "#f43f5e",
            percentage: rosePct || 28,
            symbolism: "Visceral passion, somatic vulnerability, maternal compassion, and raw life-force.",
            emotionalResonance: "Externalization of internalized tension, transforming distress into self-compassion.",
            feministArtPerspective: "Direct connection to the matriarchal life-center, somatic self-ownership, and bodily dignity.",
          },
          {
            name: "Buddhi Indigo / Violet Pod",
            hex: "#8b5cf6",
            percentage: violetPct || 22,
            symbolism: "Higher intellectual witnessing, non-delusional discernment, and spiritual integration.",
            emotionalResonance: "Decouples the conscious witness from mechanical autopilot thinking.",
            feministArtPerspective: "Subverting patriarchal psychiatric labeling; affirming the creative wisdom of altered states.",
          },
          {
            name: "Pranic Vitality Emerald",
            hex: "#10b981",
            percentage: emeraldPct || 15,
            symbolism: "Regeneration, heart-chakra restoration, autonomic equilibrium.",
            emotionalResonance: "Safe re-anchoring in physical vitality, feeling grounded in the earthly vessel.",
            feministArtPerspective: "Ecofeminist healing, honoring interconnected bodily life and organic rhythms.",
          },
        ];

        clusters.sort((a, b) => b.percentage - a.percentage);

        const automatismIndex = Math.min(96, Math.max(45, Math.round(strokeCount * 2.8 + 35)));
        const catharsisScore = Math.min(98, Math.max(50, Math.round(strokeCount * 3.2 + 40)));

        setAnalysis({
          automatismIndex,
          gesturalSpeed: drawingSpeedAvg,
          dominantClusters: clusters,
          subconsciousTone:
            automatismIndex > 75
              ? "High spontaneous release: Autopilot defense structures bypassed; unfiltered Chitta impressions externalized onto canvas pods."
              : "Meditative focused composure: Conscious Buddhi control working harmoniously with somatic release.",
          somaticFeedback:
            "Muscular tension in the shoulder and solar plexus released through continuous gestural curvature. Autonomic pulse deceleration observed.",
          feministEmpowermentInterpretation:
            "In feminist art therapy (grounded in Dr. Bheemaiah Anil K's synthesis), this visual gestural automatism validates lived neurodivergent experiences as legitimate artistic knowledge rather than clinical deficit.",
          catharsisScore,
          buddhiRecommendation:
            "Observe this artwork without labeling it as 'good' or 'bad'. Let the colors exist as your safe externalized mind-state. Follow with a 3-minute 432Hz acoustic grounding bath.",
        });
      } catch (err) {
        console.error("Analysis error:", err);
      } finally {
        setIsAnalyzing(false);
      }
    }, 600);
  };

  // Play Sound frequency associated with a media item
  const playMediaTone = (freq: number = 432) => {
    if (isPlayingAudioTone) {
      soundEngine.stopFrequency();
      setIsPlayingAudioTone(false);
    } else {
      soundEngine.startFrequency(freq);
      setIsPlayingAudioTone(true);
    }
  };

  const filteredMedia =
    mediaCategoryFilter === "All"
      ? botMediaList
      : botMediaList.filter((m) => m.category === mediaCategoryFilter);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/20 to-slate-900 border border-slate-800 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1 max-w-3xl">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-medium bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                Interactive Canvas & Bot Media Studio
              </span>
              <span className="text-xs text-slate-400">
                Wallmiki Mental Wellness • Dr. Bheemaiah Anil K
              </span>
            </div>
            <h2 className="text-xl font-bold text-slate-100 font-display">
              Interactive Drawing Canvas & Wallmiki Media Projections
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              Paint freely with <strong>ethereal glow brushes</strong>, <strong>8-fold mandala symmetry</strong>, and <strong>State Pod Automatism</strong>.
              Wallmiki can display sacred mandalas, schizoOS circuit maps, and restorative twilight landscapes directly onto the canvas
              as an interactive guide or in the high-definition media viewer.
            </p>
          </div>

          {analysis && onSendArtAnalysisToChat && (
            <button
              onClick={() =>
                onSendArtAnalysisToChat(
                  `I completed a State Pod Automatism art session with Wallmiki (Catharsis: ${analysis.catharsisScore}%, Dominant cluster: ${analysis.dominantClusters[0].name}). Wallmiki, please interpret my subconscious drawing and provide CBT/MiCBT reflections.`
                )
              }
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-slate-950 font-semibold text-xs transition-all flex items-center gap-2 shadow-lg shadow-cyan-500/20"
            >
              <Send className="w-4 h-4" />
              <span>Discuss Artwork with Wallmiki</span>
            </button>
          )}
        </div>

        {/* Mode Selector & Quick Links */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-mono">Therapeutic Framework:</span>
            <button
              onClick={() => setAutomatismMode("feminist")}
              className={`px-3 py-1 rounded-lg transition-all ${
                automatismMode === "feminist"
                  ? "bg-rose-500/20 border border-rose-500/50 text-rose-300 font-medium"
                  : "bg-slate-950 text-slate-400 border border-slate-800"
              }`}
            >
              Feminist Art Therapy & Somatic Autonomy
            </button>
            <button
              onClick={() => setAutomatismMode("surrealist")}
              className={`px-3 py-1 rounded-lg transition-all ${
                automatismMode === "surrealist"
                  ? "bg-indigo-500/20 border border-indigo-500/50 text-indigo-300 font-medium"
                  : "bg-slate-950 text-slate-400 border border-slate-800"
              }`}
            >
              Surrealist State Pod Automatism (Dr. Anil K)
            </button>
            <button
              onClick={() => setAutomatismMode("somatic")}
              className={`px-3 py-1 rounded-lg transition-all ${
                automatismMode === "somatic"
                  ? "bg-cyan-500/20 border border-cyan-500/50 text-cyan-300 font-medium"
                  : "bg-slate-950 text-slate-400 border border-slate-800"
              }`}
            >
              MiCBT Somatic Body Resonance
            </button>
          </div>

          {/* Active Projected Media Badge */}
          {projectedMedia && (
            <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-cyan-950/40 border border-cyan-500/30 text-cyan-300 text-xs">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span>Projected: <strong>{projectedMedia.title}</strong></span>
              <button
                onClick={handleClearProjection}
                className="p-0.5 hover:text-rose-400 transition-colors ml-1"
                title="Remove projected media from canvas"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 8 Cols: Interactive Drawing Canvas */}
        <div className="lg:col-span-8 bg-slate-950 rounded-2xl border border-slate-800 p-4 space-y-4 shadow-xl">
          {/* Canvas Toolbar Row 1: Brush Types, Symmetry, Tools */}
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs border-b border-slate-800/80 pb-3">
            {/* Brush Style selection */}
            <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
              {BRUSH_PRESETS.map((bp) => {
                const Icon = bp.icon;
                const active = brushType === bp.id;
                return (
                  <button
                    key={bp.id}
                    onClick={() => {
                      setBrushType(bp.id as any);
                      setBrushOpacity(bp.defaultOpacity);
                    }}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-all ${
                      active
                        ? "bg-cyan-500 text-slate-950 font-semibold shadow-sm shadow-cyan-500/30"
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{bp.name}</span>
                  </button>
                );
              })}
            </div>

            {/* Symmetry / Mandala Mode Selector */}
            <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
              <span className="text-[11px] font-mono text-slate-400 px-1.5">Symmetry:</span>
              {SYMMETRY_MODES.map((sm) => {
                const active = symmetryMode === sm.id;
                return (
                  <button
                    key={sm.id}
                    onClick={() => setSymmetryMode(sm.id as any)}
                    title={sm.description}
                    className={`px-2.5 py-1 rounded-lg text-xs transition-all ${
                      active
                        ? "bg-indigo-500 text-slate-950 font-bold shadow-sm shadow-indigo-500/30"
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    {sm.label}
                  </button>
                );
              })}
            </div>

            {/* Undo, Redo, Clear, Download */}
            <div className="flex items-center gap-1">
              <button
                onClick={handleUndo}
                disabled={undoStack.length === 0}
                className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 disabled:opacity-30 transition-all"
                title="Undo (Ctrl+Z)"
              >
                <Undo2 className="w-4 h-4" />
              </button>
              <button
                onClick={handleRedo}
                disabled={redoStack.length === 0}
                className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 disabled:opacity-30 transition-all"
                title="Redo"
              >
                <Redo2 className="w-4 h-4" />
              </button>
              <button
                onClick={handleClear}
                className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-rose-400 transition-colors"
                title="Clear Canvas"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                onClick={handleDownload}
                className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-cyan-400 transition-colors"
                title="Download Canvas PNG"
              >
                <Download className="w-4 h-4" />
              </button>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-indigo-400 transition-colors"
                title="Upload image to trace / paint over"
              >
                <Upload className="w-4 h-4" />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>
          </div>

          {/* Canvas Toolbar Row 2: Colors, Size Slider, Opacity, Background */}
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
            {/* Color Swatches & Custom Picker */}
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400 mr-1 font-mono">Color:</span>
              {PALETTES.map((p) => (
                <button
                  key={p.hex}
                  onClick={() => setBrushColor(p.hex)}
                  className={`w-6 h-6 rounded-full transition-transform ${
                    brushColor === p.hex
                      ? "scale-125 ring-2 ring-white ring-offset-2 ring-offset-slate-950"
                      : "hover:scale-110"
                  }`}
                  style={{ backgroundColor: p.hex }}
                  title={p.name}
                />
              ))}

              {/* Custom native color input */}
              <label
                className="relative w-6 h-6 rounded-full border border-slate-600 overflow-hidden cursor-pointer hover:scale-110 transition-transform ml-1 flex items-center justify-center bg-gradient-to-tr from-rose-500 via-amber-400 to-cyan-400"
                title="Custom Color Picker"
              >
                <input
                  type="color"
                  value={brushColor}
                  onChange={(e) => setBrushColor(e.target.value)}
                  className="opacity-0 absolute inset-0 cursor-pointer"
                />
              </label>
            </div>

            {/* Size and Opacity Sliders */}
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-slate-400 text-[11px] font-mono">Size:</span>
                <input
                  type="range"
                  min="2"
                  max="48"
                  value={brushSize}
                  onChange={(e) => setBrushSize(Number(e.target.value))}
                  className="w-20 accent-cyan-500"
                />
                <span className="font-mono text-slate-300 w-5 text-right">{brushSize}</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-slate-400 text-[11px] font-mono">Opacity:</span>
                <input
                  type="range"
                  min="0.1"
                  max="1.0"
                  step="0.05"
                  value={brushOpacity}
                  onChange={(e) => setBrushOpacity(Number(e.target.value))}
                  className="w-20 accent-cyan-500"
                />
                <span className="font-mono text-slate-300 w-7 text-right">
                  {Math.round(brushOpacity * 100)}%
                </span>
              </div>

              {/* Background tone selector */}
              <div className="flex items-center gap-1">
                <span className="text-slate-400 text-[11px] font-mono">Canvas:</span>
                <button
                  onClick={() => setCanvasBgTone("deep")}
                  className={`w-5 h-5 rounded-md border text-[10px] ${
                    canvasBgTone === "deep"
                      ? "border-cyan-400 bg-slate-950 text-cyan-300"
                      : "border-slate-800 bg-slate-950 text-slate-500"
                  }`}
                  title="Deep Cosmos"
                >
                  🌌
                </button>
                <button
                  onClick={() => setCanvasBgTone("teal")}
                  className={`w-5 h-5 rounded-md border text-[10px] ${
                    canvasBgTone === "teal"
                      ? "border-cyan-400 bg-teal-950 text-cyan-300"
                      : "border-slate-800 bg-teal-950 text-slate-500"
                  }`}
                  title="Sanctuary Teal"
                >
                  🌊
                </button>
                <button
                  onClick={() => setCanvasBgTone("parchment")}
                  className={`w-5 h-5 rounded-md border text-[10px] ${
                    canvasBgTone === "parchment"
                      ? "border-cyan-400 bg-slate-800 text-cyan-300"
                      : "border-slate-800 bg-slate-800 text-slate-500"
                  }`}
                  title="Twilight Slate"
                >
                  📜
                </button>
              </div>
            </div>
          </div>

          {/* Drawing Canvas Area */}
          <div className="relative rounded-xl border border-slate-800 overflow-hidden shadow-2xl bg-black">
            <canvas
              ref={canvasRef}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={stopDrawing}
              className="w-full h-[480px] cursor-crosshair touch-none select-none"
            />

            {/* Live HUD Overlay top-left */}
            <div className="absolute top-3 left-3 p-2.5 rounded-xl bg-slate-950/85 backdrop-blur border border-slate-800 text-[11px] font-mono space-y-1 select-none pointer-events-none">
              <div className="flex items-center gap-1.5 text-cyan-300">
                <Activity className="w-3.5 h-3.5" />
                <span>Rhythm: {drawingSpeedAvg}</span>
              </div>
              <div className="text-slate-400">
                Strokes: <strong className="text-slate-200">{strokeCount}</strong> • Symmetry:{" "}
                <span className="text-indigo-300 capitalize">{symmetryMode}</span>
              </div>
              {projectedMedia && (
                <div className="text-emerald-400 flex items-center gap-1 pt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Media Underlay: {projectedMedia.title.slice(0, 24)}...</span>
                </div>
              )}
            </div>

            {/* Projection Opacity Slider (when media is projected) */}
            {projectedMedia && (
              <div className="absolute top-3 right-3 p-2 rounded-xl bg-slate-950/90 backdrop-blur border border-cyan-500/40 text-[11px] font-mono flex items-center gap-2 z-10">
                <span className="text-cyan-300">Underlay Opacity:</span>
                <input
                  type="range"
                  min="0.1"
                  max="1.0"
                  step="0.05"
                  value={projectedOpacity}
                  onChange={(e) => {
                    const newOp = Number(e.target.value);
                    setProjectedOpacity(newOp);
                    redrawCanvas();
                  }}
                  className="w-20 accent-cyan-400"
                />
                <span className="text-slate-300 w-6">{Math.round(projectedOpacity * 100)}%</span>
                <button
                  onClick={handleClearProjection}
                  className="p-1 text-slate-400 hover:text-rose-400"
                  title="Remove Underlay"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Bottom Actions on Canvas */}
            <div className="absolute bottom-3 right-3 flex items-center gap-2 z-10">
              <button
                onClick={performAnalysis}
                disabled={strokeCount === 0 || isAnalyzing}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-rose-500 via-indigo-500 to-cyan-500 hover:opacity-90 disabled:opacity-40 text-slate-950 font-bold text-xs shadow-lg transition-all flex items-center gap-2"
              >
                <Wand2 className="w-4 h-4" />
                <span>{isAnalyzing ? "Analyzing Clusters..." : "Analyze State Pod Automatism"}</span>
              </button>
            </div>
          </div>

          <div className="text-[11px] text-slate-400 flex flex-wrap items-center justify-between gap-2">
            <span>
              ✨ Use <strong>8-Fold Mandala Symmetry</strong> for meditative radial patterns. Wallmiki's media underlay guides intentional self-reflection.
            </span>
            <span className="font-mono text-cyan-400">Wallmiki Interactive Canvas v3.2</span>
          </div>
        </div>

        {/* Right 4 Cols: Bot Media Projection Library & Color Cluster Analysis */}
        <div className="lg:col-span-4 space-y-4">
          {/* Wallmiki Media Projection Library Card */}
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3 shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400">
                  <ImageIcon className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-100">Wallmiki Media Projections</h3>
                  <p className="text-[11px] text-slate-400">Bot images, mandalas & cognitive maps</p>
                </div>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                {filteredMedia.length} Available
              </span>
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap gap-1 text-[11px]">
              {["All", "Sacred Geometry", "schizoOS Architecture", "Landscapes & Nature", "Sacred Verses"].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setMediaCategoryFilter(cat)}
                  className={`px-2 py-0.5 rounded-lg transition-all ${
                    mediaCategoryFilter === cat
                      ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-medium"
                      : "bg-slate-950 text-slate-400 border border-slate-800 hover:text-slate-200"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Media Items Scroll List */}
            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
              {filteredMedia.map((media) => {
                const isProjected = projectedMedia?.id === media.id;
                return (
                  <div
                    key={media.id}
                    className={`p-3 rounded-xl border transition-all space-y-2 ${
                      isProjected
                        ? "bg-cyan-950/30 border-cyan-500/50 shadow-md shadow-cyan-950/40"
                        : "bg-slate-950/80 border-slate-800 hover:border-slate-700"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span
                            className="w-2.5 h-2.5 rounded-full"
                            style={{ backgroundColor: media.colorTone }}
                          />
                          <h4 className="text-xs font-semibold text-slate-200">{media.title}</h4>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                          {media.description}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-800/80 text-xs">
                      <div className="flex items-center gap-2">
                        {media.ambientFreq && (
                          <button
                            onClick={() => playMediaTone(media.ambientFreq)}
                            className="flex items-center gap-1 text-[10px] font-mono text-cyan-300 hover:underline"
                            title="Play acoustic resonance tone"
                          >
                            <Volume2 className="w-3 h-3" />
                            <span>{media.ambientFreq}Hz</span>
                          </button>
                        )}
                        <button
                          onClick={() => setViewerModalMedia(media)}
                          className="flex items-center gap-1 text-[10px] font-mono text-indigo-300 hover:underline"
                          title="View in Holographic Preview"
                        >
                          <Eye className="w-3 h-3" />
                          <span>Inspect</span>
                        </button>
                      </div>

                      <button
                        onClick={() => handleProjectMediaToCanvas(media)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold flex items-center gap-1 transition-all ${
                          isProjected
                            ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                            : "bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-200 border border-cyan-500/40"
                        }`}
                      >
                        <Layers className="w-3 h-3" />
                        <span>{isProjected ? "On Canvas" : "Project on Canvas"}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Color Cluster & Feminist Art Therapy Interpretation */}
          {analysis ? (
            <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4 shadow-xl">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono bg-rose-500/10 text-rose-300 border border-rose-500/20 font-semibold">
                  Pod Automatism Output
                </span>
                <span className="text-xs font-mono text-emerald-400 font-bold">
                  {analysis.catharsisScore}% Catharsis Index
                </span>
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-100">
                  Subconscious State Pod Breakdown
                </h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  {analysis.subconsciousTone}
                </p>
              </div>

              {/* Color Clusters */}
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <PieChart className="w-3.5 h-3.5 text-cyan-400" />
                  Dominant Color Cluster Metrics:
                </span>
                <div className="space-y-2">
                  {analysis.dominantClusters.map((cluster) => (
                    <div
                      key={cluster.name}
                      className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80 space-y-1 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: cluster.hex }}
                          />
                          <span className="font-semibold text-slate-200">{cluster.name}</span>
                        </div>
                        <span className="font-mono text-cyan-400">{cluster.percentage}%</span>
                      </div>
                      <p className="text-[11px] text-slate-400 leading-tight">
                        {cluster.emotionalResonance}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Feminist Art Therapy Interpretation */}
              <div className="p-3 rounded-xl bg-rose-950/20 border border-rose-500/30 space-y-1 text-xs">
                <span className="font-semibold text-rose-300 flex items-center gap-1.5">
                  <Heart className="w-3.5 h-3.5 text-rose-400" />
                  Feminist Art Therapy Perspective:
                </span>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  {analysis.feministEmpowermentInterpretation}
                </p>
              </div>

              {/* Wallmiki Bodhichitta Guidance */}
              <div className="p-3 rounded-xl bg-indigo-950/20 border border-indigo-500/30 space-y-1 text-xs">
                <span className="font-semibold text-indigo-300 flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5 text-indigo-400" />
                  Wallmiki Bodhichitta Guidance:
                </span>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  {analysis.buddhiRecommendation}
                </p>
              </div>
            </div>
          ) : (
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500/20 to-indigo-500/20 border border-cyan-500/30 mx-auto flex items-center justify-center text-cyan-400">
                <Palette className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-slate-200">Expressive Automatism & Canvas</h4>
                <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
                  Select a Wallmiki media item above to project onto the canvas as an underlay, or draw spontaneously with radial mandala symmetry. Click "Analyze State Pod Automatism" to decode your subconscious color clusters.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Holographic Media Viewer Modal */}
      {viewerModalMedia && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-2xl bg-slate-950 border border-cyan-500/40 rounded-2xl p-6 space-y-4 shadow-2xl shadow-cyan-950/50">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <span
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: viewerModalMedia.colorTone }}
                />
                <h3 className="text-base font-bold text-slate-100">{viewerModalMedia.title}</h3>
              </div>
              <button
                onClick={() => setViewerModalMedia(null)}
                className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Media Visual Presentation */}
            <div className="h-64 rounded-xl bg-slate-900/90 border border-slate-800/80 flex items-center justify-center p-6 text-center relative overflow-hidden">
              <div
                className="absolute inset-0 opacity-15 pointer-events-none"
                style={{
                  background: `radial-gradient(circle at center, ${viewerModalMedia.colorTone} 0%, transparent 70%)`,
                }}
              />
              <div className="space-y-3 max-w-md relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 mx-auto flex items-center justify-center text-cyan-300">
                  <Sparkles className="w-7 h-7 animate-pulse" />
                </div>
                <h4 className="text-lg font-semibold text-slate-100">{viewerModalMedia.title}</h4>
                <p className="text-xs text-slate-300 leading-relaxed italic">
                  "{viewerModalMedia.quote || viewerModalMedia.description}"
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              {viewerModalMedia.description}
            </p>

            <div className="flex items-center justify-between pt-2 border-t border-slate-800">
              {viewerModalMedia.ambientFreq && (
                <button
                  onClick={() => playMediaTone(viewerModalMedia.ambientFreq)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-cyan-300 text-xs hover:bg-slate-800"
                >
                  <Volume2 className="w-4 h-4" />
                  <span>
                    {isPlayingAudioTone ? "Stop Frequency Tone" : `Play ${viewerModalMedia.ambientFreq}Hz Tone`}
                  </span>
                </button>
              )}

              <div className="flex items-center gap-2 ml-auto">
                <button
                  onClick={() => {
                    handleProjectMediaToCanvas(viewerModalMedia);
                    setViewerModalMedia(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-lg"
                >
                  <Layers className="w-4 h-4" />
                  <span>Project onto Interactive Canvas</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
