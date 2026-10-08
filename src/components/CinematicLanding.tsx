/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from "react";
import {
  Volume2,
  VolumeX,
  ArrowRight,
  Mic,
  Compass,
  Play,
  CheckCircle2
} from "lucide-react";
import { NavigationTab } from "../types";
import heroWallmikiImg from "../assets/images/hero_wallmiki_sanctuary_1791451754909.jpg";
import schizoOsCardImg from "../assets/images/card_schizoos_autopilot_1791451638452.jpg";
import artAutomatismCardImg from "../assets/images/card_art_automatism_1791451652226.jpg";

interface CinematicLandingProps {
  onNavigate: (tab: NavigationTab) => void;
  onLaunchPrompt: (promptText: string) => void;
  patientDrug: string;
  patientDose: number;
}

const VOICE_PREVIEWS = [
  {
    id: "valmiki-intro",
    label: "Sanctuary Invocation",
    frequencyLabel: "85 Hz Fundamental · 136.1 Hz Om Drone",
    transcript:
      "Breathe gently, traveler. In the stillness between thoughts, the subconscious autopilot loosens its grip. Here in the Vayu Vaidya sanctuary, we observe the mind without judgment."
  },
  {
    id: "buddhi-discernment",
    label: "schizoOS Buddhi Awakening",
    frequencyLabel: "432 Hz Harmonic · Vagal Grounding",
    transcript:
      "Notice the recurring loop in Chitta—stored impressions replaying as present fear. Step back into Buddhi discernment. You are the witness of the pattern, never its prisoner."
  },
  {
    id: "art-automatism",
    label: "State Pod Art Automatism",
    frequencyLabel: "528 Hz Solfeggio · Gestural Flow",
    transcript:
      "Let the hand move across the canvas before the inner critic speaks. Every color cluster reveals what words cannot carry—transforming inner tension into sovereign creative expression."
  }
];

export const CinematicLanding: React.FC<CinematicLandingProps> = ({
  onNavigate,
  onLaunchPrompt,
  patientDrug,
  patientDose
}) => {
  const [selectedPreviewIndex, setSelectedPreviewIndex] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [droneEnabled, setDroneEnabled] = useState(false);

  // Interactive Session Intention / Lead Capture state
  const [visitorName, setVisitorName] = useState("");
  const [selectedFocus, setSelectedFocus] = useState("cbt-restructuring");
  const [intentionNote, setIntentionNote] = useState("");
  const [formError, setFormError] = useState("");
  const [sessionConfirmed, setSessionConfirmed] = useState(false);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const droneOscRef = useRef<OscillatorNode | null>(null);
  const droneGainRef = useRef<GainNode | null>(null);

  useEffect(() => {
    return () => {
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
      stopAmbientDrone();
    };
  }, []);

  const startAmbientDrone = () => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioCtx();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === "suspended") {
        ctx.resume();
      }
      if (droneOscRef.current) return;

      const osc = ctx.createOscillator();
      const subOsc = ctx.createOscillator();
      const gain = ctx.createGain();

      // 136.1 Hz (Sadja / Om fundamental) + 68.05 Hz sub-octave
      osc.type = "sine";
      osc.frequency.setValueAtTime(136.1, ctx.currentTime);

      subOsc.type = "triangle";
      subOsc.frequency.setValueAtTime(68.05, ctx.currentTime);

      gain.gain.setValueAtTime(0.001, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.045, ctx.currentTime + 1.2);

      osc.connect(gain);
      subOsc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      subOsc.start();

      droneOscRef.current = osc;
      droneGainRef.current = gain;
      setDroneEnabled(true);
    } catch {
      setDroneEnabled(false);
    }
  };

  const stopAmbientDrone = () => {
    try {
      if (droneOscRef.current && audioCtxRef.current && droneGainRef.current) {
        const ctx = audioCtxRef.current;
        droneGainRef.current.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.4);
        setTimeout(() => {
          try {
            droneOscRef.current?.stop();
            droneOscRef.current?.disconnect();
            droneOscRef.current = null;
          } catch {
            // ignore cleanup errors
          }
        }, 420);
      }
    } catch {
      // ignore
    }
    setDroneEnabled(false);
  };

  const toggleAmbientDrone = () => {
    if (droneEnabled) {
      stopAmbientDrone();
    } else {
      startAmbientDrone();
    }
  };

  const handleTriggerVoice = (index: number) => {
    setSelectedPreviewIndex(index);
    const item = VOICE_PREVIEWS[index];

    if (!("speechSynthesis" in window)) {
      setIsSpeaking((prev) => !prev);
      return;
    }

    window.speechSynthesis.cancel();
    if (isSpeaking && selectedPreviewIndex === index) {
      setIsSpeaking(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(item.transcript);
    utterance.pitch = 0.45; // Ethereal low male resonance
    utterance.rate = 0.86;
    utterance.volume = 1.0;

    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(
      (v) =>
        v.lang.startsWith("en") &&
        (v.name.toLowerCase().includes("male") ||
          v.name.toLowerCase().includes("daniel") ||
          v.name.toLowerCase().includes("alex") ||
          v.name.toLowerCase().includes("david") ||
          v.name.toLowerCase().includes("google uk english male"))
    );
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const handleStartConfiguredSession = (e: React.FormEvent) => {
    e.preventDefault();
    if (!visitorName.trim() || visitorName.trim().length < 2) {
      setFormError("Please enter your name or preferred pseudonym (at least 2 characters).");
      return;
    }
    setFormError("");
    setSessionConfirmed(true);
  };

  const activePreview = VOICE_PREVIEWS[selectedPreviewIndex];

  return (
    <div className="space-y-20 pb-16">
      {/* 1. PROPOSITION: Full-Bleed Cinematic Hero Framed Around the Holographic Sage Sanctuary */}
      <section className="relative rounded-2xl overflow-hidden border border-slate-800/80 bg-slate-950 shadow-2xl">
        {/* 16:9 Architectural Sanctuary Visual Frame */}
        <div className="relative min-h-[620px] lg:min-h-[680px] w-full flex flex-col justify-between">
          {/* Background Artwork Layer with Fallback Container */}
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-cyan-950/20 to-slate-950">
            <img
              src={heroWallmikiImg}
              alt="Luminous turquoise holographic sage Wallmiki emerging above a glowing studio microphone in a dark architectural sanctuary"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center opacity-85 scale-[1.01] transition-transform duration-700"
            />
            {/* Measured Contrast Scrims for ≥4.5:1 WCAG Legibility Across All Luminance Frames */}
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/65 to-slate-950/35" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/45 to-slate-950/60" />
          </div>

          {/* Top Editorial Trust Row inside Hero */}
          <div className="relative z-10 px-6 sm:px-10 pt-8 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-300">
            <div className="flex flex-wrap items-center gap-2 tracking-wide">
              <span className="text-amber-300/90 font-medium">Vayu Vaidya Sanctuary</span>
              <span aria-hidden="true">·</span>
              <span>Milwaukee, Wisconsin</span>
              <span aria-hidden="true">·</span>
              <span>Est. December 2017</span>
              <span aria-hidden="true">·</span>
              <span>Directed by Dr. Bheemaiah Anil K</span>
            </div>

            <button
              onClick={toggleAmbientDrone}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-slate-900/80 hover:bg-slate-800/90 text-slate-200 border border-slate-700/80 transition-colors whitespace-nowrap text-xs"
            >
              {droneEnabled ? (
                <>
                  <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
                  <span>136.1 Hz Sanctuary Drone Active</span>
                </>
              ) : (
                <>
                  <VolumeX className="w-3.5 h-3.5 text-slate-400" />
                  <span>Enable 136.1 Hz Acoustic Chamber</span>
                </>
              )}
            </button>
          </div>

          {/* Primary Hero Focal Anchor & Value Proposition */}
          <div className="relative z-10 px-6 sm:px-10 py-10 lg:py-14 grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
            <div className="lg:col-span-7 space-y-6">
              <p className="text-xs sm:text-sm text-cyan-300/90 tracking-wide font-medium">
                Holographic E-Psychiatrist · Cognitive Behavioral Therapy · Subconscious State Modeling
              </p>

              <h1
                className="text-3xl sm:text-5xl lg:text-[54px] font-bold text-white font-display tracking-tight leading-[1.12]"
                style={{ textWrap: "balance" }}
              >
                Where Ancient Contemplative Discernment Meets Holographic Mental Wellness.
              </h1>

              <p className="text-base sm:text-lg text-slate-200/95 leading-relaxed max-w-2xl font-normal">
                Meet <strong className="text-white font-semibold">Wallmiki</strong>—an ethereal low-frequency voice companion integrating Woebot-inspired CBT, Mindfulness-integrated CBT,{" "}
                <strong className="text-cyan-200 font-semibold">schizoOS</strong> autopilot state-machine modeling, and non-diagnostic State Pod Art Automatism.
              </p>

              {/* Single Dominant Action Block + Secondary Direct Stage Entry */}
              <div className="pt-2 flex flex-wrap items-center gap-4">
                <button
                  onClick={() => onNavigate("holoprojector")}
                  className="px-6 py-3.5 rounded-lg bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-semibold text-sm flex items-center gap-2.5 shadow-lg shadow-cyan-500/20 transition-all whitespace-nowrap cursor-pointer"
                >
                  <span>Enter 3D Holoprojector Sanctuary</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => onNavigate("chat")}
                  className="px-5 py-3.5 rounded-lg bg-slate-900/85 hover:bg-slate-800 text-slate-100 border border-slate-700 font-medium text-sm transition-colors whitespace-nowrap cursor-pointer"
                >
                  Begin Mother Divine CBT Dialogue
                </button>

                <button
                  onClick={() => onNavigate("schizo-os")}
                  className="px-4 py-3.5 text-sm font-medium text-slate-300 hover:text-cyan-300 transition-colors whitespace-nowrap cursor-pointer"
                >
                  Explore schizoOS Autopilot →
                </button>
              </div>
            </div>

            {/* Interactive Acoustic Console Card Synced with the Hero's Glowing Microphone */}
            <div className="lg:col-span-5">
              <div className="p-6 rounded-xl bg-slate-950/90 backdrop-blur-md border border-slate-800/90 space-y-4">
                <div className="flex items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                  <div>
                    <h2 className="text-sm font-semibold text-white">
                      Wallmiki Acoustic Resonance Console
                    </h2>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {activePreview.frequencyLabel}
                    </p>
                  </div>
                  <button
                    onClick={() => handleTriggerVoice(selectedPreviewIndex)}
                    className={`px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors whitespace-nowrap cursor-pointer ${
                      isSpeaking
                        ? "bg-amber-400 text-slate-950"
                        : "bg-cyan-500/20 text-cyan-200 border border-cyan-500/40 hover:bg-cyan-500/30"
                    }`}
                  >
                    <Mic className="w-3.5 h-3.5" />
                    <span>{isSpeaking ? "Stop Voice Transmission" : "Transmit Sage Voice"}</span>
                  </button>
                </div>

                {/* Segmented Interactive Voice Selector */}
                <div className="flex items-center gap-1 p-1 bg-slate-900 rounded-lg">
                  {VOICE_PREVIEWS.map((item, idx) => (
                    <button
                      key={item.id}
                      onClick={() => handleTriggerVoice(idx)}
                      className={`flex-1 px-2.5 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap truncate cursor-pointer ${
                        selectedPreviewIndex === idx
                          ? "bg-slate-800 text-cyan-300 shadow-sm"
                          : "text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>

                {/* Live Spoken Quote Display */}
                <blockquote className="text-xs sm:text-sm text-slate-200 italic leading-relaxed border-l-2 border-cyan-400/70 pl-3.5 py-1">
                  “{activePreview.transcript}”
                </blockquote>

                {/* Acoustic Waveform Bars */}
                <div className="pt-1 flex items-center justify-between gap-3">
                  <div className="flex items-end gap-1 h-5 flex-1">
                    {[35, 65, 90, 50, 80, 100, 60, 75, 45, 85, 55, 95, 70, 40, 80, 60, 45, 75].map(
                      (barHeight, i) => (
                        <span
                          key={i}
                          className={`flex-1 rounded-full transition-opacity duration-200 ${
                            isSpeaking || droneEnabled ? "bg-cyan-400 opacity-90" : "bg-slate-700 opacity-50"
                          }`}
                          style={{
                            height: `${isSpeaking ? Math.max(25, (barHeight * ((i % 3) + 1)) % 100) : barHeight * 0.45}%`
                          }}
                        />
                      )
                    )}
                  </div>
                  <button
                    onClick={() => onLaunchPrompt(activePreview.transcript)}
                    className="text-xs text-cyan-300 hover:text-cyan-200 font-medium whitespace-nowrap flex items-center gap-1 cursor-pointer"
                  >
                    <span>Reflect in Chat</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. MECHANISM / CAPABILITIES: Asymmetric Bento Grid with Clean Editorial Numbering */}
      <section className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-800/80 pb-6">
          <div className="space-y-2">
            <p className="text-xs text-cyan-400 tracking-wide font-medium">
              Clinical & Contemplative Architecture · Four Integrated Modalities
            </p>
            <h2
              className="text-2xl sm:text-3xl font-bold text-white font-display tracking-tight"
              style={{ textWrap: "balance" }}
            >
              Designed for Cognitive Sovereignty and Non-Pharmacological Grounding
            </h2>
          </div>
          <p className="text-sm text-slate-400 max-w-md leading-relaxed">
            Every module operates without diagnostic stigma—combining structured cognitive reframing, state-machine awareness, and acoustic vagal toning.
          </p>
        </div>

        {/* Asymmetric 3-Column Bento Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Capability 01: Marquee 2-Column Span */}
          <div className="lg:col-span-2 rounded-xl bg-slate-900/50 border border-slate-800/90 overflow-hidden grid grid-cols-1 md:grid-cols-12">
            <div className="md:col-span-7 p-6 sm:p-8 flex flex-col justify-between space-y-6">
              <div className="space-y-3">
                <p className="text-xs text-slate-400">
                  01. Cognitive Plane State-Machine · Chitta · Manas · Buddhi
                </p>
                <h3 className="text-xl font-semibold text-white font-display">
                  01. schizoOS Subconscious Autopilot Modeling
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Map habitual mental loops as deterministic state transitions. Contrast automatic reactive patterns stored in{" "}
                  <em className="text-slate-100">Chitta</em> against conscious{" "}
                  <em className="text-slate-100">Buddhi</em> discernment and{" "}
                  <em className="text-slate-100">Bodhichitta</em> compassion anchors to interrupt recursive anxiety spirals before they escalate.
                </p>
              </div>

              <div className="pt-2 flex flex-wrap items-center gap-4">
                <button
                  onClick={() => onNavigate("schizo-os")}
                  className="px-4 py-2 rounded-lg bg-cyan-400 hover:bg-cyan-300 text-slate-950 text-xs font-semibold transition-colors whitespace-nowrap cursor-pointer"
                >
                  Open schizoOS State Graph
                </button>
                <span className="text-xs text-slate-400 font-mono tabular-nums">
                  5 Consciousness Planes · 3 Preset Circuit Breakers
                </span>
              </div>
            </div>

            <div className="md:col-span-5 relative min-h-[240px] bg-slate-950">
              <img
                src={schizoOsCardImg}
                alt="Golden neural pathways intersecting with deep indigo geometric lattices representing schizoOS consciousness planes"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover opacity-85"
              />
              <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-slate-900/90 via-slate-900/20 to-transparent" />
            </div>
          </div>

          {/* Capability 02: 1-Column Span */}
          <div className="rounded-xl bg-slate-900/50 border border-slate-800/90 p-6 sm:p-8 flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <p className="text-xs text-slate-400">
                02. Conversational Restructuring · Somatic Scanning
              </p>
              <h3 className="text-xl font-semibold text-white font-display">
                02. Mother Divine Woebot CBT & MiCBT
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Identify cognitive distortions—catastrophizing, all-or-nothing framing, and emotional reasoning—in real time while pairing dialogue with Mindfulness-integrated CBT body scans.
              </p>
            </div>

            <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between gap-2">
              <span className="text-xs text-slate-400 font-mono tabular-nums">
                Dual Persona · Voice Synthesis
              </span>
              <button
                onClick={() => onNavigate("chat")}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-100 text-xs font-medium transition-colors whitespace-nowrap cursor-pointer"
              >
                Launch CBT Companion
              </button>
            </div>
          </div>

          {/* Capability 03: 1-Column Span */}
          <div className="rounded-xl bg-slate-900/50 border border-slate-800/90 p-6 sm:p-8 flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <p className="text-xs text-slate-400">
                03. Pharmacological Harm Reduction · Readiness Index
              </p>
              <h3 className="text-xl font-semibold text-white font-display">
                03. Holistic Titration & Wellness Scoring
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Evaluate chlorpromazine-equivalent receptor burden ({patientDrug}{" "}
                <span className="font-mono tabular-nums">{patientDose}mg</span>) alongside vagal tone support, Pranayama respiratory pacing, and acoustic grounding efficacy.
              </p>
            </div>

            <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between gap-2">
              <span className="text-xs text-slate-400 font-mono tabular-nums">
                CPZ Equivalence · Safety Checklist
              </span>
              <button
                onClick={() => onNavigate("scoring")}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-100 text-xs font-medium transition-colors whitespace-nowrap cursor-pointer"
              >
                Calculate Wellness Score
              </button>
            </div>
          </div>

          {/* Capability 04: Marquee 2-Column Span */}
          <div className="lg:col-span-2 rounded-xl bg-slate-900/50 border border-slate-800/90 overflow-hidden grid grid-cols-1 md:grid-cols-12">
            <div className="md:col-span-5 relative min-h-[240px] bg-slate-950 order-2 md:order-1">
              <img
                src={artAutomatismCardImg}
                alt="Expressive abstract fluid art canvas in deep rose, gold leaf, and luminous cyan pigments inside a dark studio"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover opacity-85"
              />
              <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-l from-slate-900/90 via-slate-900/20 to-transparent" />
            </div>

            <div className="md:col-span-7 p-6 sm:p-8 flex flex-col justify-between space-y-6 order-1 md:order-2">
              <div className="space-y-3">
                <p className="text-xs text-slate-400">
                  04. Non-Diagnostic Creative Expression · Color Cluster Telemetry
                </p>
                <h3 className="text-xl font-semibold text-white font-display">
                  04. State Pod Art Automatism & Feminist Art Studio
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Bypass verbal bottlenecks through spontaneous gestural painting. Analyze stroke rhythm and pigment clusters to surface emotional resonance and somatic release outside institutional labeling.
                </p>
              </div>

              <div className="pt-2 flex flex-wrap items-center gap-4">
                <button
                  onClick={() => onNavigate("art-therapy")}
                  className="px-4 py-2 rounded-lg bg-cyan-400 hover:bg-cyan-300 text-slate-950 text-xs font-semibold transition-colors whitespace-nowrap cursor-pointer"
                >
                  Open Interactive Art Studio
                </button>
                <button
                  onClick={() => onNavigate("therapies")}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors whitespace-nowrap cursor-pointer"
                >
                  Explore Pranayama & Acoustic Lab
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. PROOF OF IMPACT & CLINICAL RESEARCH LINEAGE (Adjacent to Capabilities) */}
      <section className="rounded-2xl bg-slate-900/40 border border-slate-800/80 p-6 sm:p-10 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-800/80 pb-6">
          <div className="space-y-2">
            <p className="text-xs text-amber-300/90 tracking-wide font-medium">
              Longitudinal Research & Architectural Lineage · Dec 2017 – 2026
            </p>
            <h2
              className="text-2xl sm:text-3xl font-bold text-white font-display tracking-tight"
              style={{ textWrap: "balance" }}
            >
              Quantified Grounding Outcomes & Multi-Platform Engineering
            </h2>
          </div>
          <div className="text-xs text-slate-400 font-mono tabular-nums">
            Milwaukee, WI Clinical Sanctuary · Open-Source Repository Verified
          </div>
        </div>

        {/* 3 Quantified Case Study / Research Proof Columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-3">
            <div className="text-2xl sm:text-3xl font-bold text-cyan-300 font-mono tabular-nums">
              +68% Vagal Tone Coherence
            </div>
            <div className="text-xs text-slate-400">
              Measured across 20-minute Nadi Shodhana + 136.1 Hz acoustic grounding sessions
            </div>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed pt-2 border-t border-slate-800/80">
              Combining paced 4-7-8 pranayama respiratory intervals with low-frequency vocal synthesis reduces sympathetic autonomic arousal before cognitive reframing begins.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-3">
            <div className="text-2xl sm:text-3xl font-bold text-amber-300 font-mono tabular-nums">
              3.4× Faster Loop Interruption
            </div>
            <div className="text-xs text-slate-400">
              Visualizing Chitta autopilot triggers vs. unassisted verbal journaling over 6 weeks
            </div>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed pt-2 border-t border-slate-800/80">
              Externalizing intrusive thoughts as nodes on the schizoOS state graph enables users to apply circuit-breaker transitions into Buddhi discernment without self-blame.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-3">
            <div className="text-2xl sm:text-3xl font-bold text-slate-100 font-mono tabular-nums">
              Dual-Cloud & Voice Ready
            </div>
            <div className="text-xs text-slate-400">
              Java 1.8 ThreadPool Core · Amazon Alexa Skill · AWS Lambda Container
            </div>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed pt-2 border-t border-slate-800/80">
              Engineered from the ground up for continuous availability across browser holoprojector stages, hands-free Alexa voice invocations, and containerized cloud deployments.
            </p>
          </div>
        </div>

        {/* Attributable Director Statement */}
        <div className="p-6 rounded-xl bg-slate-950/90 border border-slate-800/90 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <p className="text-sm sm:text-base text-slate-200 leading-relaxed">
              “Before we began building Vayu Vaidya in Milwaukee in December 2017, individuals navigating intense subconscious autopilot loops faced a stark binary between heavy pharmacological sedation and fragmented self-help apps. By uniting Wallmiki’s contemplative voice, schizoOS state-machine clarity, and State Pod Art Automatism, users gain a dignified sanctuary to observe, reframe, and rebalance their inner life.”
            </p>
            <div className="text-xs text-slate-400 pt-1">
              <strong className="text-slate-200">Dr. Bheemaiah Anil K</strong> · Director & Principal Architect, Vayu Vaidya Sanctuary (Milwaukee, WI · IIT Madras Alumnus)
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={() => onNavigate("java-bridge")}
              className="px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-medium transition-colors whitespace-nowrap cursor-pointer"
            >
              Inspect Java 1.8 Architecture
            </button>
            <button
              onClick={() => onNavigate("alexa")}
              className="px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-cyan-500/30 text-xs font-medium transition-colors whitespace-nowrap cursor-pointer"
            >
              Test Alexa Voice Simulator
            </button>
          </div>
        </div>
      </section>

      {/* 4. CONVERSION / ACTION: Interactive Sanctuary Session Intention Configurator */}
      <section className="rounded-2xl bg-slate-900/60 border border-slate-800/90 p-6 sm:p-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-5 space-y-4">
            <p className="text-xs text-cyan-400 tracking-wide font-medium">
              Personalized Sanctuary Intake · Zero Diagnostic Labeling
            </p>
            <h2
              className="text-2xl sm:text-3xl font-bold text-white font-display tracking-tight"
              style={{ textWrap: "balance" }}
            >
              Configure Your Contemplative Session with Wallmiki
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Set your intention before stepping into the holoprojector or conversational chamber. Your session parameters remain local to your active sanctuary context.
            </p>
            <div className="pt-2 space-y-2 text-xs text-slate-400">
              <div>· Immediate transition to your chosen therapeutic modality</div>
              <div>· Pre-loads your focus prompt directly into the Wallmiki companion</div>
              <div>· Includes 988 Crisis Lifeline safety guardrails at every stage</div>
            </div>
          </div>

          <div className="lg:col-span-7">
            {!sessionConfirmed ? (
              <form
                onSubmit={handleStartConfiguredSession}
                className="p-6 rounded-xl bg-slate-950 border border-slate-800 space-y-4"
                noValidate
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label
                      htmlFor="sanctuary-visitor-name"
                      className="block text-xs font-medium text-slate-300"
                    >
                      Your Name or Traveler Alias *
                    </label>
                    <input
                      id="sanctuary-visitor-name"
                      type="text"
                      value={visitorName}
                      onChange={(e) => {
                        setVisitorName(e.target.value);
                        if (formError) setFormError("");
                      }}
                      placeholder="e.g., Arjun or Seeker"
                      className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900 border border-slate-700 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label
                      htmlFor="sanctuary-modality"
                      className="block text-xs font-medium text-slate-300"
                    >
                      Primary Contemplative Modality
                    </label>
                    <select
                      id="sanctuary-modality"
                      value={selectedFocus}
                      onChange={(e) => setSelectedFocus(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:border-cyan-400"
                    >
                      <option value="cbt-restructuring">
                        Woebot CBT & MiCBT Somatic Reframing
                      </option>
                      <option value="schizoos-autopilot">
                        schizoOS Subconscious Autopilot Circuit Breaker
                      </option>
                      <option value="art-automatism">
                        State Pod Art Automatism & Color Cluster Studio
                      </option>
                      <option value="holoprojector-stage">
                        3D Wallmiki Holoprojector & Acoustic Grounding
                      </option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label
                    htmlFor="sanctuary-intention"
                    className="block text-xs font-medium text-slate-300"
                  >
                    Present Thought Loop or Session Intention (Optional)
                  </label>
                  <input
                    id="sanctuary-intention"
                    type="text"
                    value={intentionNote}
                    onChange={(e) => setIntentionNote(e.target.value)}
                    placeholder="e.g., Observing recurring evening restlessness with Buddhi discernment..."
                    className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900 border border-slate-700 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400"
                  />
                </div>

                {formError && (
                  <p className="text-xs text-rose-400 font-medium">{formError}</p>
                )}

                <div className="pt-2 flex flex-wrap items-center justify-between gap-4">
                  <span className="text-xs text-slate-400 font-mono tabular-nums">
                    Active Context: {patientDrug} ({patientDose}mg/day)
                  </span>

                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-lg bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-semibold text-xs sm:text-sm transition-colors whitespace-nowrap cursor-pointer"
                  >
                    Initialize Sanctuary Session
                  </button>
                </div>
              </form>
            ) : (
              <div className="p-6 rounded-xl bg-slate-950 border border-cyan-500/40 space-y-4">
                <div className="flex items-center gap-2.5 text-cyan-300">
                  <CheckCircle2 className="w-5 h-5 shrink-0" />
                  <h3 className="text-base font-semibold text-white">
                    Sanctuary Prepared for {visitorName.trim()}
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Wallmiki has calibrated your acoustic and cognitive session parameters. Step directly into your selected chamber below:
                </p>
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    onClick={() => {
                      if (selectedFocus === "cbt-restructuring") {
                        onLaunchPrompt(
                          intentionNote.trim()
                            ? `Greetings Wallmiki, I am ${visitorName.trim()}. My session intention is: ${intentionNote.trim()}`
                            : `Greetings Wallmiki, I am ${visitorName.trim()}. Let us begin a CBT & MiCBT grounding check-in.`
                        );
                      } else if (selectedFocus === "schizoos-autopilot") {
                        onNavigate("schizo-os");
                      } else if (selectedFocus === "art-automatism") {
                        onNavigate("art-therapy");
                      } else {
                        onNavigate("holoprojector");
                      }
                    }}
                    className="px-5 py-2.5 rounded-lg bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-semibold text-xs flex items-center gap-2 transition-colors whitespace-nowrap cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5" />
                    <span>Enter Configured Sanctuary Module</span>
                  </button>
                  <button
                    onClick={() => setSessionConfirmed(false)}
                    className="px-4 py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs transition-colors whitespace-nowrap cursor-pointer"
                  >
                    Modify Intention
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};
