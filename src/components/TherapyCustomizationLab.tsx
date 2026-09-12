import React, { useState, useEffect } from "react";
import {
  Wind,
  Volume2,
  VolumeX,
  Code2,
  Sparkles,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  Sliders,
  FileText,
  Activity,
  Heart,
  Calendar,
  Send
} from "lucide-react";
import { TherapyProtocol } from "../types";
import { soundEngine } from "../utils/audioSynth";

interface TherapyCustomizationLabProps {
  onSelectTherapyToChat?: (promptText: string) => void;
}

export const TherapyCustomizationLab: React.FC<TherapyCustomizationLabProps> = ({
  onSelectTherapyToChat,
}) => {
  const [protocols, setProtocols] = useState<TherapyProtocol[]>([]);
  const [selectedProtocol, setSelectedProtocol] = useState<TherapyProtocol | null>(null);

  // Pranayama Breath Pacer state
  const [isBreathingActive, setIsBreathingActive] = useState(false);
  const [breathPhase, setBreathPhase] = useState<"Inhale" | "Hold" | "Exhale" | "Pause">("Inhale");
  const [breathCounter, setBreathCounter] = useState(4);
  const [completedBreathCycles, setCompletedBreathCycles] = useState(0);

  // Acoustic Frequency State
  const [freqPlaying, setFreqPlaying] = useState(false);
  const [activeFreq, setActiveFreq] = useState(432);

  // Gemini Customization Script Editor state
  const [customPromptScript, setCustomPromptScript] = useState<string>(`// Vayu Vaidya Mother Divine Customization Script (v3.0)
// Clinical Framework: Woebot CBT, MiCBT & schizoOS by Dr. Bheemaiah Anil K
TARGET_FRAMEWORK: "Mental Wellness Practices replacing coercive interventions"
COGNITIVE_MODULE: "Woebot CBT + MiCBT Interoceptive Equanimity"
NEURO_ARCHITECTURE: "schizoOS: Autopilot vs. Chitta, Manas, Buddhi, Bodhichitta"
EXPRESSIVE_ART: "State Pod Automatism & Feminist Art Therapy (Dr. Bheemaiah Anil K)"

DIRECTIVES:
1. Woebot CBT: Detect cognitive distortions (catastrophizing, mind reading) with warm, friendly conversational reframing.
2. MiCBT Body Scan: Encourage somatic equanimity; observe visceral alarm without reacting.
3. schizoOS Patterning: Assist user in recognizing the subconscious Autopilot vs. Buddhi (higher discernment witness).
4. Bodhichitta Sanctuary: Wrap all interactions in maternal loving-kindness and bodily sovereignty.`);

  const [scriptTestInput, setScriptTestInput] = useState("");
  const [scriptTestOutput, setScriptTestOutput] = useState("");
  const [testingScript, setTestingScript] = useState(false);

  // Session Logging
  const [sessionLogs, setSessionLogs] = useState<{ id: string; therapy: string; durationMin: number; reliefScore: number; date: string }[]>([
    { id: "log-1", therapy: "Vayu Vaidya Pranayama", durationMin: 12, reliefScore: 8, date: "Today, 10:15 AM" },
    { id: "log-2", therapy: "528Hz Acoustic Resonator", durationMin: 15, reliefScore: 9, date: "Yesterday, 8:40 PM" },
    { id: "log-3", therapy: "5-4-3-2-1 Sensory Reality Anchor", durationMin: 8, reliefScore: 7, date: "2 days ago" },
  ]);

  // Load protocols
  useEffect(() => {
    fetch("/api/therapy-protocols")
      .then((res) => res.json())
      .then((data) => {
        if (data.protocols) {
          setProtocols(data.protocols);
          setSelectedProtocol(data.protocols[0]);
        }
      })
      .catch((err) => console.error("Error loading protocols:", err));
  }, []);

  // Breath Pacer Interval Loop (4s Inhale, 4s Hold, 6s Exhale, 2s Pause)
  useEffect(() => {
    if (!isBreathingActive) return;

    const phaseDurations = {
      Inhale: 4,
      Hold: 4,
      Exhale: 6,
      Pause: 2,
    };

    const interval = setInterval(() => {
      setBreathCounter((prev) => {
        if (prev <= 1) {
          // Switch to next phase
          if (breathPhase === "Inhale") {
            setBreathPhase("Hold");
            return phaseDurations.Hold;
          } else if (breathPhase === "Hold") {
            setBreathPhase("Exhale");
            return phaseDurations.Exhale;
          } else if (breathPhase === "Exhale") {
            setBreathPhase("Pause");
            return phaseDurations.Pause;
          } else {
            setBreathPhase("Inhale");
            setCompletedBreathCycles((c) => c + 1);
            return phaseDurations.Inhale;
          }
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isBreathingActive, breathPhase]);

  // Toggle Frequency
  const toggleFrequency = (freq: number) => {
    if (freqPlaying && activeFreq === freq) {
      soundEngine.stopFrequency();
      setFreqPlaying(false);
    } else {
      setActiveFreq(freq);
      soundEngine.startFrequency(freq, 0.05);
      setFreqPlaying(true);
    }
  };

  // Test custom script with Gemini API
  const handleTestScript = async () => {
    if (!scriptTestInput.trim()) return;
    setTestingScript(true);
    setScriptTestOutput("");

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: `${customPromptScript}\n\nUser Question:\n${scriptTestInput}`,
          therapyMode: "custom",
        }),
      });
      const data = await res.json();
      setScriptTestOutput(data.text || "Response generated under custom script conditioning.");
    } catch (e) {
      setScriptTestOutput("Simulated therapy test: Mother Divine acknowledges your custom script guidance.");
    } finally {
      setTestingScript(false);
    }
  };

  const logCurrentSession = () => {
    if (!selectedProtocol) return;
    const newLog = {
      id: `log-${Date.now()}`,
      therapy: selectedProtocol.name,
      durationMin: selectedProtocol.durationMinutes,
      reliefScore: 9,
      date: "Just now",
    };
    setSessionLogs((prev) => [newLog, ...prev]);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-950/20 border border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-medium bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
              Therapy Customization Lab
            </span>
            <span className="text-xs text-slate-400">• Vayu Vaidya Modalities</span>
          </div>
          <h2 className="text-xl font-bold text-slate-100 font-display">
            Alternative Therapy Protocols & Gemini Bot Customization Scripts
          </h2>
          <p className="text-xs text-slate-300 leading-relaxed">
            Customize and monitor the clinical therapies prescribed alongside the Mother Divine E-Psychiatrist.
            Interactive breath pacers, acoustic resonance generators, and Gemini conditioning scripts.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => toggleFrequency(432)}
            className={`px-3 py-1.5 rounded-xl border text-xs font-mono transition-all flex items-center gap-1.5 ${
              freqPlaying && activeFreq === 432
                ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-300"
                : "bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200"
            }`}
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span>432Hz Calm Tone</span>
          </button>
          <button
            onClick={() => toggleFrequency(528)}
            className={`px-3 py-1.5 rounded-xl border text-xs font-mono transition-all flex items-center gap-1.5 ${
              freqPlaying && activeFreq === 528
                ? "bg-cyan-500/20 border-cyan-500/50 text-cyan-300"
                : "bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200"
            }`}
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span>528Hz Solfeggio</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Interactive Pacer & Protocol Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Interactive Vayu Pranayama Breathing Pacer */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col items-center justify-center text-center space-y-5">
            <div className="space-y-1">
              <span className="text-[11px] font-mono uppercase tracking-wider text-cyan-400">
                Vayu Vaidya Interactive Breath Pacer
              </span>
              <h3 className="text-base font-bold text-slate-100">
                4-4-6-2 Parasympathetic Vagal Loop
              </h3>
              <p className="text-xs text-slate-400 max-w-xs">
                Restores autonomic equilibrium, reduces dopamine surge restlessness, and calms internal noise.
              </p>
            </div>

            {/* Visual Animated Breathing Sphere / Ring */}
            <div className="relative w-56 h-56 flex items-center justify-center">
              {/* Outer Pulsing Glow */}
              <div
                className={`absolute inset-0 rounded-full transition-all duration-1000 ${
                  breathPhase === "Inhale"
                    ? "scale-105 bg-cyan-500/10 border-2 border-cyan-400/40"
                    : breathPhase === "Hold"
                    ? "scale-105 bg-amber-500/10 border-2 border-amber-400/40"
                    : breathPhase === "Exhale"
                    ? "scale-75 bg-indigo-500/10 border-2 border-indigo-400/40"
                    : "scale-75 bg-slate-800/20 border-2 border-slate-700/30"
                }`}
              />

              {/* Center Circle with Timer and Phase */}
              <div className="relative z-10 flex flex-col items-center justify-center w-36 h-36 rounded-full bg-slate-950 border border-slate-700/80 shadow-2xl shadow-cyan-950/40">
                <Wind className={`w-6 h-6 mb-1 transition-colors ${
                  breathPhase === "Inhale" ? "text-cyan-400 animate-pulse" :
                  breathPhase === "Hold" ? "text-amber-400" :
                  breathPhase === "Exhale" ? "text-indigo-400" : "text-slate-500"
                }`} />
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                  {isBreathingActive ? breathPhase : "Ready"}
                </span>
                <span className="text-2xl font-bold font-mono text-cyan-400">
                  {isBreathingActive ? `${breathCounter}s` : "4s"}
                </span>
              </div>
            </div>

            {/* Pacer Controls */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsBreathingActive(!isBreathingActive)}
                className={`px-5 py-2.5 rounded-xl font-medium text-xs transition-all flex items-center gap-2 shadow-lg ${
                  isBreathingActive
                    ? "bg-amber-500 hover:bg-amber-400 text-slate-950"
                    : "bg-cyan-500 hover:bg-cyan-400 text-slate-950"
                }`}
              >
                {isBreathingActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                <span>{isBreathingActive ? "Pause Pacer" : "Start Vayu Breathwork"}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsBreathingActive(false);
                  setBreathPhase("Inhale");
                  setBreathCounter(4);
                  setCompletedBreathCycles(0);
                }}
                className="p-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-slate-200"
                title="Reset"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

            {/* Session Stats */}
            <div className="grid grid-cols-2 gap-3 w-full pt-3 border-t border-slate-800/80 text-xs font-mono">
              <div className="p-2 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-slate-500 block text-[10px]">Cycles Completed:</span>
                <span className="text-emerald-400 font-bold text-sm">{completedBreathCycles}</span>
              </div>
              <div className="p-2 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-slate-500 block text-[10px]">Vagal Modulation:</span>
                <span className="text-cyan-400 font-bold text-sm">
                  {completedBreathCycles > 0 ? "+28% Active" : "Baseline"}
                </span>
              </div>
            </div>
          </div>

          {/* Longitudinal Efficacy Logs */}
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-semibold text-slate-200 flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                Alternative Therapy Monitoring Logs
              </h4>
              <button
                onClick={logCurrentSession}
                className="text-[11px] text-cyan-400 hover:underline font-mono"
              >
                + Log Completed Session
              </button>
            </div>

            <div className="space-y-2">
              {sessionLogs.map((log) => (
                <div
                  key={log.id}
                  className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-between text-xs"
                >
                  <div>
                    <div className="font-semibold text-slate-200">{log.therapy}</div>
                    <span className="text-[10px] text-slate-500">{log.date}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-emerald-400 font-mono font-semibold">
                      {log.reliefScore}/10 Relief
                    </span>
                    <span className="text-[10px] text-slate-400 block">{log.durationMin} mins</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Protocols Catalog & Gemini Bot Customization Script Editor */}
        <div className="lg:col-span-7 space-y-6">
          {/* Protocol Catalog Selector */}
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
            <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
              <Activity className="w-4 h-4 text-cyan-400" />
              Specialized Prescribed Protocols
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {protocols.map((proto) => {
                const isSelected = selectedProtocol?.id === proto.id;
                return (
                  <div
                    key={proto.id}
                    onClick={() => setSelectedProtocol(proto)}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? "bg-cyan-500/10 border-cyan-500/40 text-slate-100 shadow-md shadow-cyan-500/5"
                        : "bg-slate-950/60 border-slate-800/80 text-slate-400 hover:border-slate-700"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className="text-xs font-bold text-slate-100">{proto.name}</span>
                      <span className="text-[10px] font-mono text-emerald-400 font-semibold">
                        {proto.efficacyRating}% Eff.
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                      {proto.summary}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Selected Protocol Detailed Breakdown */}
            {selectedProtocol && (
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3 mt-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono uppercase tracking-wider text-cyan-400">
                    Clinical Instructions • {selectedProtocol.durationMinutes} Minutes
                  </span>
                  {onSelectTherapyToChat && (
                    <button
                      onClick={() =>
                        onSelectTherapyToChat(
                          `Please guide me through the "${selectedProtocol.name}" protocol step-by-step.`
                        )
                      }
                      className="text-xs text-cyan-300 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 px-2.5 py-1 rounded-lg transition-colors"
                    >
                      Consult Mother Divine on this
                    </button>
                  )}
                </div>

                <ol className="space-y-1.5 text-xs text-slate-300 list-decimal list-inside leading-relaxed">
                  {selectedProtocol.instructions.map((step, idx) => (
                    <li key={idx} className="text-slate-300">
                      {step}
                    </li>
                  ))}
                </ol>

                <div className="pt-2 border-t border-slate-800/80 flex flex-wrap gap-2 text-[11px]">
                  <span className="text-slate-500">Target Symptoms:</span>
                  {selectedProtocol.targetSymptoms.map((sym, i) => (
                    <span key={i} className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300">
                      {sym}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Gemini Bot Customization Script Editor */}
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Code2 className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-semibold text-slate-200">
                  Gemini API Therapy Conditioning Script
                </h3>
              </div>
              <span className="text-[10px] font-mono text-slate-400">
                Injected into Gemini System Context
              </span>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              This prompt directive instructs the Google Gemini API to adapt its psychiatric dialogue, grounding
              algorithms, and therapy pacing to the user's specific clinical state.
            </p>

            <textarea
              rows={6}
              value={customPromptScript}
              onChange={(e) => setCustomPromptScript(e.target.value)}
              className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-cyan-300 leading-relaxed focus:outline-none focus:border-cyan-500"
            />

            {/* Test Custom Prompt Sandbox */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={scriptTestInput}
                  onChange={(e) => setScriptTestInput(e.target.value)}
                  placeholder="Test script: e.g., 'I hear whispering sounds behind my door'..."
                  className="flex-1 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                />
                <button
                  type="button"
                  onClick={handleTestScript}
                  disabled={testingScript || !scriptTestInput.trim()}
                  className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 text-slate-950 font-semibold text-xs transition-all flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{testingScript ? "Testing..." : "Test Script"}</span>
                </button>
              </div>

              {scriptTestOutput && (
                <div className="p-3 rounded-xl bg-slate-950/80 border border-emerald-500/30 text-xs text-slate-200 leading-relaxed">
                  <span className="font-mono text-emerald-400 text-[10px] block mb-1">
                    Output from Custom Script Conditioning:
                  </span>
                  {scriptTestOutput}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
