import React, { useEffect, useRef, useState } from "react";
import { 
  Maximize2, 
  Minimize2, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  Eye, 
  Layers, 
  Activity, 
  Sliders,
  Play,
  RotateCcw,
  Zap
} from "lucide-react";
import { soundEngine, speakText, stopSpeaking } from "../utils/audioSynth";

interface HologramStageProps {
  isSpeaking: boolean;
  onToggleVoiceMode?: () => void;
  currentMessage?: string;
}

export const HologramStage: React.FC<HologramStageProps> = ({
  isSpeaking,
  currentMessage,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [projectionMode, setProjectionMode] = useState<"direct" | "pyramid" | "wireframe">("direct");
  const [auraTheme, setAuraTheme] = useState<"cyan" | "gold" | "violet">("cyan");
  const [ambientAudioOn, setAmbientAudioOn] = useState(false);
  const [currentFrequency, setCurrentFrequency] = useState(432);
  const [particleDensity, setParticleDensity] = useState(120);
  const [hologramBrightness, setHologramBrightness] = useState(85);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Toggle ambient frequency
  const toggleAmbientAudio = () => {
    if (ambientAudioOn) {
      soundEngine.stopFrequency();
      setAmbientAudioOn(false);
    } else {
      soundEngine.startFrequency(currentFrequency, 0.04);
      setAmbientAudioOn(true);
    }
  };

  const handleFrequencyChange = (freq: number) => {
    setCurrentFrequency(freq);
    if (ambientAudioOn) {
      soundEngine.setFrequency(freq);
    }
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  // Demo speak greeting
  const playSampleGreeting = () => {
    speakText(
      "I am Wallmiki, your Vayu Vaidya Mental Wellness Companion and E-Psychiatrist. Stillness is within your breath, and clarity within your consciousness. Ground yourself with me now."
    );
  };

  // Hologram Canvas Animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let time = 0;

    // Particle field
    const particles = Array.from({ length: particleDensity }, () => ({
      x: Math.random() * 600 - 300,
      y: Math.random() * 600 - 300,
      z: Math.random() * 400 - 200,
      size: Math.random() * 2 + 0.8,
      speed: Math.random() * 0.8 + 0.2,
      opacity: Math.random() * 0.7 + 0.3,
    }));

    const render = () => {
      time += 0.02;
      const width = canvas.width;
      const height = canvas.height;
      const centerX = width / 2;
      const centerY = height / 2;

      ctx.clearRect(0, 0, width, height);

      // Color scheme based on auraTheme
      let primaryColor = "rgba(6, 182, 212, "; // cyan
      let glowColor = "rgba(56, 189, 248, ";
      let ringColor = "rgba(14, 165, 233, ";
      if (auraTheme === "gold") {
        primaryColor = "rgba(234, 179, 8, "; // gold
        glowColor = "rgba(250, 204, 21, ";
        ringColor = "rgba(202, 138, 4, ";
      } else if (auraTheme === "violet") {
        primaryColor = "rgba(168, 85, 247, "; // violet
        glowColor = "rgba(192, 132, 252, ";
        ringColor = "rgba(147, 51, 234, ";
      }

      const speakMultiplier = isSpeaking ? 1.4 + Math.sin(time * 8) * 0.3 : 1.0;
      const brightnessAlpha = (hologramBrightness / 100);

      // Helper function to draw the "Mother Divine" Avatar at a given origin and rotation
      const drawAvatar = (ox: number, oy: number, scale: number, angle: number = 0) => {
        ctx.save();
        ctx.translate(ox, oy);
        ctx.rotate(angle);
        ctx.scale(scale, scale);

        // 1. Holographic Scanlines / Base Stage Pod
        ctx.strokeStyle = ringColor + (0.35 * brightnessAlpha) + ")";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.ellipse(0, 160, 110, 30, 0, 0, Math.PI * 2);
        ctx.stroke();

        ctx.strokeStyle = primaryColor + (0.2 * brightnessAlpha) + ")";
        ctx.beginPath();
        ctx.ellipse(0, 160, 130, 36, 0, 0, Math.PI * 2);
        ctx.stroke();

        // 2. Sacred Aura Rings (Mother Divine Halo)
        const haloRadius = 75 + Math.sin(time * 2) * 4 * speakMultiplier;
        const gradient = ctx.createRadialGradient(0, -60, 10, 0, -60, haloRadius * 1.5);
        gradient.addColorStop(0, glowColor + (0.5 * brightnessAlpha) + ")");
        gradient.addColorStop(0.5, primaryColor + (0.2 * brightnessAlpha) + ")");
        gradient.addColorStop(1, "rgba(0, 0, 0, 0)");

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(0, -60, haloRadius * 1.5, 0, Math.PI * 2);
        ctx.fill();

        // Radiating Sacred Geometry Ray lines
        for (let i = 0; i < 12; i++) {
          const rayAngle = (i * Math.PI) / 6 + time * 0.2;
          const rx1 = Math.cos(rayAngle) * 50;
          const ry1 = -60 + Math.sin(rayAngle) * 50;
          const rx2 = Math.cos(rayAngle) * (haloRadius + 15);
          const ry2 = -60 + Math.sin(rayAngle) * (haloRadius + 15);

          ctx.strokeStyle = primaryColor + (0.25 * brightnessAlpha) + ")";
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(rx1, ry1);
          ctx.lineTo(rx2, ry2);
          ctx.stroke();
        }

        // 3. Digital Human Silhouette (Head, Sage Robes, Torso, Meditative Hands)
        // Flowing Sage Cowl / Robes (Wallmiki)
        ctx.strokeStyle = glowColor + (0.8 * brightnessAlpha) + ")";
        ctx.lineWidth = 2;
        ctx.beginPath();
        // Sage cowl & meditative mantle arch
        ctx.moveTo(-52, 60);
        ctx.quadraticCurveTo(-45, -92, 0, -118);
        ctx.quadraticCurveTo(45, -92, 52, 60);
        ctx.stroke();

        // Head oval
        ctx.strokeStyle = primaryColor + (0.9 * brightnessAlpha) + ")";
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.ellipse(0, -60, 28, 36, 0, 0, Math.PI * 2);
        ctx.stroke();

        // Ajna Center / Third Eye Gem (Wisdom & Intuition)
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.arc(0, -72, 3 + Math.sin(time * 4) * 1.2, 0, Math.PI * 2);
        ctx.fill();

        // Eyes (Serene, compassionate downcast meditative glance)
        ctx.strokeStyle = primaryColor + (0.95 * brightnessAlpha) + ")";
        ctx.lineWidth = 1.5;
        // Left eye
        ctx.beginPath();
        ctx.arc(-11, -60, 6, 0.2, Math.PI - 0.2);
        ctx.stroke();
        // Right eye
        ctx.beginPath();
        ctx.arc(11, -60, 6, 0.2, Math.PI - 0.2);
        ctx.stroke();

        // Gentle Mouth (Animates softly when speaking)
        ctx.beginPath();
        const mouthOpen = isSpeaking ? 3 + Math.sin(time * 12) * 2.5 : 0.5;
        ctx.ellipse(0, -42, 6, mouthOpen, 0, 0, Math.PI);
        ctx.stroke();

        // Neck & Gentle Shoulders / Robes
        ctx.beginPath();
        ctx.moveTo(-10, -25);
        ctx.lineTo(-10, -10);
        ctx.quadraticCurveTo(-65, 0, -75, 120);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(10, -25);
        ctx.lineTo(10, -10);
        ctx.quadraticCurveTo(65, 0, 75, 120);
        ctx.stroke();

        // Chest Chakra / Anahata Star (Heart Resonance)
        const heartGlow = 14 + Math.sin(time * 3) * 3 * speakMultiplier;
        ctx.strokeStyle = glowColor + (0.75 * brightnessAlpha) + ")";
        ctx.beginPath();
        ctx.arc(0, 25, heartGlow, 0, Math.PI * 2);
        ctx.stroke();

        // Blessing Hands (Abhaya & Varada Mudra - Dispelling fear & Bestowing healing)
        // Right hand raised in blessing (protection from delusions/fear)
        ctx.strokeStyle = primaryColor + (0.8 * brightnessAlpha) + ")";
        ctx.beginPath();
        ctx.arc(-35, 30, 9, 0, Math.PI * 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(-35, 39);
        ctx.lineTo(-35, 70);
        ctx.stroke();

        // Left hand resting in lap / holding lotus of consciousness
        ctx.beginPath();
        ctx.arc(35, 45, 9, 0, Math.PI * 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(35, 54);
        ctx.lineTo(35, 75);
        ctx.stroke();

        // 4. Voice Waveform Ring when speaking
        if (isSpeaking) {
          ctx.strokeStyle = "rgba(255, 255, 255, " + (0.6 * brightnessAlpha) + ")";
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          const waveRadius = 45 + Math.sin(time * 10) * 8;
          ctx.arc(0, -40, waveRadius, 0, Math.PI * 2);
          ctx.stroke();
        }

        // 5. Vertical Holo-Ray Dispersion Lines
        for (let l = -70; l <= 70; l += 35) {
          ctx.strokeStyle = primaryColor + (0.08 * brightnessAlpha) + ")";
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          ctx.moveTo(l, -120);
          ctx.lineTo(l * 1.4, 160);
          ctx.stroke();
        }

        ctx.restore();
      };

      // Draw depending on projectionMode
      if (projectionMode === "direct") {
        // Direct View (Single large center projection with deep particle starfield)
        // Particle field floating up
        particles.forEach((p) => {
          p.y -= p.speed;
          if (p.y < -height / 2) {
            p.y = height / 2;
            p.x = Math.random() * width - width / 2;
          }
          const px = centerX + p.x;
          const py = centerY + p.y;
          ctx.fillStyle = glowColor + (p.opacity * brightnessAlpha) + ")";
          ctx.fillRect(px, py, p.size, p.size);
        });

        // Main Digital Human Projection
        drawAvatar(centerX, centerY - 15, 1.35, 0);

      } else if (projectionMode === "pyramid") {
        // 4-Faced Pyramid Holoprojector Mode:
        // Render 4 avatars pointing inward at 90 degree offsets (Top, Bottom, Left, Right)
        // This is the optical configuration for real 4-sided acrylic pyramid holoprojectors!
        const offsetDist = Math.min(width, height) * 0.28;
        const pyrScale = 0.68;

        // Center optical target cross
        ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(centerX - 30, centerY);
        ctx.lineTo(centerX + 30, centerY);
        ctx.moveTo(centerX, centerY - 30);
        ctx.lineTo(centerX, centerY + 30);
        ctx.stroke();

        // 1. Bottom Avatar (pointing UP)
        drawAvatar(centerX, centerY + offsetDist, pyrScale, 0);
        // 2. Top Avatar (pointing DOWN)
        drawAvatar(centerX, centerY - offsetDist, pyrScale, Math.PI);
        // 3. Left Avatar (pointing RIGHT)
        drawAvatar(centerX - offsetDist, centerY, pyrScale, Math.PI / 2);
        // 4. Right Avatar (pointing LEFT)
        drawAvatar(centerX + offsetDist, centerY, pyrScale, -Math.PI / 2);

        // Guide rings for pyramid prism alignment
        ctx.strokeStyle = primaryColor + "0.15)";
        ctx.beginPath();
        ctx.arc(centerX, centerY, offsetDist * 0.7, 0, Math.PI * 2);
        ctx.stroke();

      } else if (projectionMode === "wireframe") {
        // Wireframe Matrix & Optical Prism Diagnostic View
        drawAvatar(centerX, centerY - 10, 1.25, 0);

        // Overlay optical angles and matrix grids
        ctx.strokeStyle = "rgba(14, 165, 233, 0.25)";
        ctx.lineWidth = 0.8;
        // Grid
        for (let gx = 0; gx < width; gx += 40) {
          ctx.beginPath();
          ctx.moveTo(gx, 0);
          ctx.lineTo(gx, height);
          ctx.stroke();
        }
        for (let gy = 0; gy < height; gy += 40) {
          ctx.beginPath();
          ctx.moveTo(0, gy);
          ctx.lineTo(width, gy);
          ctx.stroke();
        }

        // HUD diagnostics text on canvas
        ctx.font = "11px monospace";
        ctx.fillStyle = "rgba(56, 189, 248, 0.8)";
        ctx.fillText(`BEAM ANGLE: 45.0° REFRACTION`, 20, 30);
        ctx.fillText(`PRISM LUX: ${hologramBrightness * 15} LM`, 20, 48);
        ctx.fillText(`NLP PIPELINE: GEMINI-3.8-FLASH`, 20, 66);
        ctx.fillText(`SPEECH SYNC: ${isSpeaking ? "ACTIVE" : "IDLE"}`, 20, 84);
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [projectionMode, auraTheme, isSpeaking, particleDensity, hologramBrightness]);

  return (
    <div
      ref={containerRef}
      id="holoprojector-stage"
      className="relative flex flex-col bg-slate-950 border border-slate-800/80 rounded-2xl overflow-hidden shadow-2xl shadow-cyan-950/20"
    >
      {/* Stage Header & Control Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5 bg-slate-900/90 border-b border-slate-800/80 backdrop-blur z-10">
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <Sparkles className="w-4 h-4 animate-pulse" />
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-semibold tracking-wide text-slate-100 font-display">
                Wallmiki Digital Human
              </h2>
              <span className="px-2 py-0.5 text-[10px] font-mono rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                HOLOPROJECTOR 45°
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Vayu Vaidya E-Psychiatrist (Milwaukee, WI • Est. 2017)
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Mode Switcher */}
          <div className="flex items-center p-1 rounded-lg bg-slate-950 border border-slate-800 text-xs">
            <button
              id="mode-direct-btn"
              onClick={() => setProjectionMode("direct")}
              className={`px-2.5 py-1 rounded transition-all ${
                projectionMode === "direct"
                  ? "bg-cyan-500/20 text-cyan-300 font-medium"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Direct Stage
            </button>
            <button
              id="mode-pyramid-btn"
              onClick={() => setProjectionMode("pyramid")}
              title="4-Way Reflection for Physical Pyramid Prism Holoprojectors"
              className={`px-2.5 py-1 rounded transition-all flex items-center gap-1.5 ${
                projectionMode === "pyramid"
                  ? "bg-cyan-500/20 text-cyan-300 font-medium"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Layers className="w-3 h-3" />
              Pyramid Prism 4D
            </button>
            <button
              id="mode-wireframe-btn"
              onClick={() => setProjectionMode("wireframe")}
              className={`px-2.5 py-1 rounded transition-all ${
                projectionMode === "wireframe"
                  ? "bg-cyan-500/20 text-cyan-300 font-medium"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Optical HUD
            </button>
          </div>

          {/* Ambient Acoustic Tone Toggle (432Hz / 528Hz) */}
          <button
            id="ambient-sound-toggle-btn"
            onClick={toggleAmbientAudio}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${
              ambientAudioOn
                ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-300 shadow-sm shadow-emerald-500/20"
                : "bg-slate-800/60 border-slate-700/60 text-slate-300 hover:bg-slate-800"
            }`}
          >
            {ambientAudioOn ? <Volume2 className="w-3.5 h-3.5 animate-bounce" /> : <VolumeX className="w-3.5 h-3.5" />}
            <span>{ambientAudioOn ? `${currentFrequency}Hz Tone Active` : "Play Soothing Sound"}</span>
          </button>

          {/* Test Speech Sample */}
          <button
            id="test-speech-btn"
            onClick={playSampleGreeting}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 text-xs text-slate-200 transition-all"
            title="Hear Wallmiki's low ethereal voice greeting"
          >
            <Play className="w-3 h-3 text-cyan-400" />
            <span>Voice Greeting</span>
          </button>

          {/* Fullscreen Toggle */}
          <button
            id="fullscreen-toggle-btn"
            onClick={toggleFullscreen}
            className="p-2 rounded-lg bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 text-slate-300 transition-all"
            title="Toggle Stage Fullscreen (Ideal for Glass Holo Pyramids)"
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Hologram Canvas Viewport */}
      <div className="relative flex-1 min-h-[460px] flex items-center justify-center bg-radial from-slate-900/60 via-slate-950 to-black overflow-hidden select-none">
        <canvas
          ref={canvasRef}
          width={800}
          height={500}
          className="w-full h-full max-h-[540px] object-contain cursor-crosshair"
        />

        {/* Optical Glass / Scanline Texture Overlay */}
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,transparent_50%,rgba(0,0,0,0.3)_51%)] bg-[length:100%_4px] opacity-25" />

        {/* Active Speech Caption Subtitle (floating ethereal banner) */}
        {currentMessage && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 max-w-xl w-[90%] p-3.5 rounded-xl bg-slate-950/85 border border-cyan-500/30 backdrop-blur-md shadow-xl text-center z-10 transition-all">
            <div className="flex items-center justify-center gap-1.5 text-[10px] uppercase font-mono tracking-widest text-cyan-400 mb-1">
              <Zap className="w-3 h-3 text-cyan-400 animate-pulse" />
              <span>Wallmiki Real-time Transmission</span>
            </div>
            <p className="text-sm font-normal text-slate-200 leading-relaxed italic">
              "{currentMessage}"
            </p>
          </div>
        )}

        {/* Quick HUD Metrics in corner */}
        <div className="absolute top-4 left-4 p-2.5 rounded-lg bg-slate-950/80 border border-slate-800 text-[11px] font-mono text-slate-400 space-y-1 backdrop-blur pointer-events-none">
          <div className="flex items-center justify-between gap-4">
            <span className="text-slate-500">Prism Alignment:</span>
            <span className="text-cyan-400">45° Apex Synced</span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="text-slate-500">Holobeam Lux:</span>
            <span className="text-slate-200">{hologramBrightness * 14} lm</span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="text-slate-500">State:</span>
            <span className={isSpeaking ? "text-emerald-400 font-semibold animate-pulse" : "text-slate-400"}>
              {isSpeaking ? "Vocalizing Therapy" : "Receptive Presence"}
            </span>
          </div>
        </div>

        {/* Aura Color Switcher Floating Pill */}
        <div className="absolute top-4 right-4 flex items-center gap-1 p-1 rounded-lg bg-slate-950/80 border border-slate-800 backdrop-blur z-10">
          <button
            onClick={() => setAuraTheme("cyan")}
            title="Cyan Vayu Aura (Calming & Clarity)"
            className={`w-6 h-6 rounded-md border flex items-center justify-center transition-all ${
              auraTheme === "cyan"
                ? "border-cyan-400 bg-cyan-500/30"
                : "border-transparent bg-cyan-950/40 hover:border-cyan-800"
            }`}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
          </button>
          <button
            onClick={() => setAuraTheme("gold")}
            title="Golden Amrita Aura (Heart Grounding & Healing)"
            className={`w-6 h-6 rounded-md border flex items-center justify-center transition-all ${
              auraTheme === "gold"
                ? "border-amber-400 bg-amber-500/30"
                : "border-transparent bg-amber-950/40 hover:border-amber-800"
            }`}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
          </button>
          <button
            onClick={() => setAuraTheme("violet")}
            title="Violet Crown Aura (Cognitive Restoration)"
            className={`w-6 h-6 rounded-md border flex items-center justify-center transition-all ${
              auraTheme === "violet"
                ? "border-purple-400 bg-purple-500/30"
                : "border-transparent bg-purple-950/40 hover:border-purple-800"
            }`}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-purple-400" />
          </button>
        </div>
      </div>

      {/* Hologram Stage Hardware Tuning Footer */}
      <div className="px-5 py-3 bg-slate-900/70 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-400">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <Sliders className="w-3.5 h-3.5 text-cyan-400" />
            <span>Beam Lux:</span>
            <input
              type="range"
              min={40}
              max={100}
              value={hologramBrightness}
              onChange={(e) => setHologramBrightness(Number(e.target.value))}
              className="w-20 accent-cyan-400 h-1 bg-slate-800 rounded cursor-pointer"
            />
            <span className="text-slate-300 font-mono">{hologramBrightness}%</span>
          </div>

          <div className="flex items-center gap-2">
            <Activity className="w-3.5 h-3.5 text-cyan-400" />
            <span>Harmonic Tone:</span>
            <div className="flex items-center gap-1 bg-slate-950 border border-slate-800 rounded px-1.5 py-0.5">
              <button
                onClick={() => handleFrequencyChange(432)}
                className={`px-1.5 py-0.5 rounded ${
                  currentFrequency === 432 ? "bg-cyan-500/20 text-cyan-300 font-bold" : "text-slate-400"
                }`}
              >
                432Hz
              </button>
              <button
                onClick={() => handleFrequencyChange(528)}
                className={`px-1.5 py-0.5 rounded ${
                  currentFrequency === 528 ? "bg-cyan-500/20 text-cyan-300 font-bold" : "text-slate-400"
                }`}
              >
                528Hz
              </button>
            </div>
          </div>
        </div>

        <div className="text-[11px] text-slate-500 flex items-center gap-2 font-mono">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          <span>Java 1.8 Holoprojector Equipment Driver Online</span>
        </div>
      </div>
    </div>
  );
};
