import React, { useState } from "react";
import {
  Mic,
  Radio,
  Server,
  Cloud,
  Play,
  Square,
  Volume2,
  Terminal,
  CheckCircle2,
  Copy,
  ExternalLink,
  Layers,
  Cpu,
  Sparkles,
  FileJson,
  RefreshCw,
  Zap,
  Code,
  Globe,
  Github,
  GitBranch,
  AlertCircle
} from "lucide-react";
import { speakText } from "../utils/audioSynth";

interface PresetUtterance {
  id: string;
  intent: string;
  utterance: string;
  category: "Breathing" | "Grounding" | "schizoOS" | "Somatic" | "Wisdom" | "CBT Thought";
  description: string;
  payload: any;
}

const PRESET_UTTERANCES: PresetUtterance[] = [
  {
    id: "launch",
    intent: "LaunchRequest",
    utterance: "Alexa, open Vayu Vaidya",
    category: "Breathing",
    description: "Invokes Wallmiki e-psychiatry sanctuary and prepares the session.",
    payload: {
      version: "1.0",
      session: { new: true, sessionId: "amzn1.echo-api.session.test-108" },
      request: {
        type: "LaunchRequest",
        requestId: "amzn1.echo-api.request.launch",
        timestamp: new Date().toISOString(),
        locale: "en-US"
      }
    }
  },
  {
    id: "pranayama",
    intent: "VayuPranayamaIntent",
    utterance: "Alexa, ask Vayu Vaidya for a breathing exercise",
    category: "Breathing",
    description: "Guides 4-4-6-2 vagal pacing with SSML breath pauses.",
    payload: {
      version: "1.0",
      session: { new: false, sessionId: "amzn1.echo-api.session.test-108" },
      request: {
        type: "IntentRequest",
        requestId: "amzn1.echo-api.request.pranayama",
        timestamp: new Date().toISOString(),
        intent: { name: "VayuPranayamaIntent" }
      }
    }
  },
  {
    id: "grounding",
    intent: "GroundingIntent",
    utterance: "Alexa, ask Vayu Vaidya to ground my senses",
    category: "Grounding",
    description: "5-4-3-2-1 sensory grounding to disarm panic prediction errors.",
    payload: {
      version: "1.0",
      session: { new: false, sessionId: "amzn1.echo-api.session.test-108" },
      request: {
        type: "IntentRequest",
        requestId: "amzn1.echo-api.request.grounding",
        timestamp: new Date().toISOString(),
        intent: { name: "GroundingIntent" }
      }
    }
  },
  {
    id: "autopilot",
    intent: "AutopilotCheckIntent",
    utterance: "Alexa, ask Vayu Vaidya about autopilot loops",
    category: "schizoOS",
    description: "Dr. Bheemaiah Anil K's schizoOS discernment: separating Autopilot from Buddhi.",
    payload: {
      version: "1.0",
      session: { new: false, sessionId: "amzn1.echo-api.session.test-108" },
      request: {
        type: "IntentRequest",
        requestId: "amzn1.echo-api.request.autopilot",
        timestamp: new Date().toISOString(),
        intent: { name: "AutopilotCheckIntent" }
      }
    }
  },
  {
    id: "somatic",
    intent: "SomaticScanIntent",
    utterance: "Alexa, ask Vayu Vaidya to scan my body",
    category: "Somatic",
    description: "MiCBT interoceptive body scan focusing on solar plexus equanimity.",
    payload: {
      version: "1.0",
      session: { new: false, sessionId: "amzn1.echo-api.session.test-108" },
      request: {
        type: "IntentRequest",
        requestId: "amzn1.echo-api.request.somatic",
        timestamp: new Date().toISOString(),
        intent: { name: "SomaticScanIntent" }
      }
    }
  },
  {
    id: "wisdom",
    intent: "WallmikiWisdomIntent",
    utterance: "Alexa, ask Vayu Vaidya for wisdom",
    category: "Wisdom",
    description: "Ethereal poetic reflection on mind stillness and living breath.",
    payload: {
      version: "1.0",
      session: { new: false, sessionId: "amzn1.echo-api.session.test-108" },
      request: {
        type: "IntentRequest",
        requestId: "amzn1.echo-api.request.wisdom",
        timestamp: new Date().toISOString(),
        intent: { name: "WallmikiWisdomIntent" }
      }
    }
  },
  {
    id: "cbt-thought",
    intent: "CbtReflectIntent",
    utterance: "Alexa, ask Vayu Vaidya to reframe: I feel everyone is silently judging me",
    category: "CBT Thought",
    description: "Gemini-powered Socratic reframing of automatic negative thoughts.",
    payload: {
      version: "1.0",
      session: { new: false, sessionId: "amzn1.echo-api.session.test-108" },
      request: {
        type: "IntentRequest",
        requestId: "amzn1.echo-api.request.cbt",
        timestamp: new Date().toISOString(),
        intent: {
          name: "CbtReflectIntent",
          slots: {
            userThought: {
              name: "userThought",
              value: "I feel everyone is silently judging me"
            }
          }
        }
      }
    }
  }
];

export const AlexaSkillSimulator: React.FC = () => {
  const [selectedPreset, setSelectedPreset] = useState<PresetUtterance>(PRESET_UTTERANCES[0]);
  const [customUtterance, setCustomUtterance] = useState("");
  const [isExecuting, setIsExecuting] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [alexaResponse, setAlexaResponse] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<"simulator" | "git-guide" | "render-guide" | "deploy-guide" | "skill-manifest" | "dockerfile">("simulator");
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  // Clean SSML tags to play audio in the browser speech engine
  const extractCleanTextFromSSML = (ssml: string): string => {
    return ssml
      .replace(/<break\s+time="[^"]*"\s*\/>/gi, " ... ")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  };

  // Run the Alexa Skill Request against the server /api/alexa endpoint
  const executeAlexaRequest = async (preset: PresetUtterance, customText?: string) => {
    setIsExecuting(true);
    let payload = preset.payload;

    if (customText && customText.trim()) {
      payload = {
        version: "1.0",
        session: { new: false, sessionId: "amzn1.echo-api.session.custom-test" },
        request: {
          type: "IntentRequest",
          requestId: `amzn1.echo-api.request.${Date.now()}`,
          timestamp: new Date().toISOString(),
          intent: {
            name: "CbtReflectIntent",
            slots: {
              userThought: {
                name: "userThought",
                value: customText.trim()
              }
            }
          }
        }
      };
    }

    try {
      const res = await fetch("/api/alexa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      setAlexaResponse(data);

      // Auto-speak using Wallmiki's low baritone synthesis
      if (data?.response?.outputSpeech?.ssml) {
        const cleanText = extractCleanTextFromSSML(data.response.outputSpeech.ssml);
        setIsSpeaking(true);
        speakText(cleanText, () => {
          setIsSpeaking(false);
        });
      }
    } catch (err) {
      console.error("Alexa request execution failed:", err);
    } finally {
      setIsExecuting(false);
    }
  };

  const copyToClipboard = (text: string, sectionId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(sectionId);
    setTimeout(() => setCopiedSection(null), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-xl border border-cyan-500/20 bg-slate-900/80 backdrop-blur-sm p-5 sm:p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="p-3 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <Radio className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-white font-display">
                  Alexa Skill & AWS Lambda Container Hub
                </h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  ASK 1.0 • SSML PROSODY
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  AWS LAMBDA DOCKER
                </span>
              </div>
              <p className="text-sm text-slate-300 mt-1 max-w-3xl">
                Experience Wallmiki's clinical e-psychiatry voice interface on Amazon Echo and Alexa devices. 
                Deploy the entire containerized application directly to AWS Lambda using the AWS Lambda Web Adapter.
              </p>
            </div>
          </div>

          {/* Quick Stats / Voice Profile */}
          <div className="flex items-center gap-3 bg-slate-950/60 border border-slate-800 rounded-lg p-3 text-xs font-mono">
            <div className="text-right">
              <div className="text-slate-400">Voice Synthesis Profile</div>
              <div className="text-cyan-300 font-semibold">Wallmiki Baritone (-15% pitch, 92% rate)</div>
            </div>
            <div className="w-px h-8 bg-slate-800" />
            <div>
              <div className="text-slate-400">Invocation Name</div>
              <div className="text-purple-300 font-semibold">"vayu vaidya"</div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs within Alexa Hub */}
        <div className="flex items-center gap-2 mt-6 pt-4 border-t border-slate-800/80 overflow-x-auto text-xs">
          <button
            onClick={() => setActiveTab("simulator")}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-2 transition-all ${
              activeTab === "simulator"
                ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-medium"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Mic className="w-3.5 h-3.5" />
            <span>Interactive Voice Simulator</span>
          </button>

          <button
            onClick={() => setActiveTab("git-guide")}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-2 transition-all ${
              activeTab === "git-guide"
                ? "bg-slate-700 text-white border border-slate-600 font-medium"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Github className="w-3.5 h-3.5 text-white" />
            <span>GitHub Sync & Push</span>
          </button>

          <button
            onClick={() => setActiveTab("render-guide")}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-2 transition-all ${
              activeTab === "render-guide"
                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-medium"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Deploy to Render (render.yaml)</span>
          </button>

          <button
            onClick={() => setActiveTab("deploy-guide")}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-2 transition-all ${
              activeTab === "deploy-guide"
                ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-medium"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Cloud className="w-3.5 h-3.5" />
            <span>AWS Lambda Docker Guide</span>
          </button>

          <button
            onClick={() => setActiveTab("skill-manifest")}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-2 transition-all ${
              activeTab === "skill-manifest"
                ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-medium"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <FileJson className="w-3.5 h-3.5" />
            <span>Interaction Model & Manifest</span>
          </button>

          <button
            onClick={() => setActiveTab("dockerfile")}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-2 transition-all ${
              activeTab === "dockerfile"
                ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-medium"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Server className="w-3.5 h-3.5" />
            <span>Dockerfile.lambda Spec</span>
          </button>
        </div>
      </div>

      {/* TAB 1: INTERACTIVE VOICE SIMULATOR */}
      {activeTab === "simulator" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Preset Voice Commands & Custom Input */}
          <div className="lg:col-span-6 space-y-4">
            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                  <Mic className="w-4 h-4 text-cyan-400" />
                  <span>Alexa Utterance Trigger</span>
                </h3>
                <span className="text-xs text-slate-400 font-mono">
                  Select or type a command
                </span>
              </div>

              {/* Presets List */}
              <div className="space-y-2">
                {PRESET_UTTERANCES.map((p) => {
                  const isSelected = selectedPreset.id === p.id;
                  return (
                    <div
                      key={p.id}
                      onClick={() => {
                        setSelectedPreset(p);
                        executeAlexaRequest(p);
                      }}
                      className={`p-3 rounded-lg border cursor-pointer transition-all ${
                        isSelected
                          ? "bg-cyan-950/40 border-cyan-500/40 ring-1 ring-cyan-500/20"
                          : "bg-slate-950/40 border-slate-800 hover:border-slate-700"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-cyan-300">
                          {p.utterance}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-slate-300">
                          {p.category}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-1">
                        {p.description}
                      </p>
                      <div className="flex items-center gap-2 mt-2 font-mono text-[10px] text-slate-500">
                        <span>Intent: {p.intent}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Custom Utterance Input */}
              <div className="mt-4 pt-4 border-t border-slate-800">
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Test Custom Voice Thought (CBT Socratic Reframe):
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={customUtterance}
                    onChange={(e) => setCustomUtterance(e.target.value)}
                    placeholder="e.g., I'm spiraling about my job interview tomorrow..."
                    className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && customUtterance.trim()) {
                        executeAlexaRequest(selectedPreset, customUtterance);
                      }
                    }}
                  />
                  <button
                    onClick={() => executeAlexaRequest(selectedPreset, customUtterance)}
                    disabled={isExecuting || !customUtterance.trim()}
                    className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold flex items-center gap-1.5 disabled:opacity-50 transition-colors"
                  >
                    {isExecuting ? (
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Play className="w-3.5 h-3.5" />
                    )}
                    <span>Speak</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Simulated Alexa Speaker & Response Inspector */}
          <div className="lg:col-span-6 space-y-4">
            {/* Alexa Speaker Virtual Device */}
            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-cyan-400 animate-pulse shadow-sm shadow-cyan-400/50" />
                  <h3 className="text-sm font-semibold text-white">
                    Amazon Echo / Alexa Simulator
                  </h3>
                </div>
                {isSpeaking && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 flex items-center gap-1">
                    <Volume2 className="w-3 h-3 animate-bounce" />
                    WALLMIKI SPEAKING
                  </span>
                )}
              </div>

              {/* Speaker Visualizer Card */}
              <div className="rounded-lg bg-slate-950 border border-slate-800 p-4 relative overflow-hidden">
                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-full bg-gradient-to-br from-cyan-600 to-blue-700 text-white shadow-lg shadow-cyan-900/30 shrink-0">
                    <Radio className="w-5 h-5" />
                  </div>
                  <div className="space-y-1 flex-1">
                    <div className="text-xs font-mono text-cyan-400">
                      Wallmiki Output Speech (SSML Rendered):
                    </div>
                    <div className="text-sm text-slate-100 font-sans leading-relaxed">
                      {alexaResponse?.response?.outputSpeech?.ssml ? (
                        extractCleanTextFromSSML(alexaResponse.response.outputSpeech.ssml)
                      ) : (
                        <span className="text-slate-500 italic">
                          Click any voice preset on the left to simulate an Amazon Alexa command...
                        </span>
                      )}
                    </div>

                    {alexaResponse?.response?.card && (
                      <div className="mt-3 p-3 rounded bg-slate-900 border border-slate-800 text-xs">
                        <div className="font-semibold text-cyan-300">
                          {alexaResponse.response.card.title}
                        </div>
                        <div className="text-slate-400 mt-1">
                          {alexaResponse.response.card.text}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Audio controls */}
                {alexaResponse?.response?.outputSpeech?.ssml && (
                  <div className="flex items-center justify-end gap-2 mt-4 pt-3 border-t border-slate-800">
                    <button
                      onClick={() => {
                        const clean = extractCleanTextFromSSML(alexaResponse.response.outputSpeech.ssml);
                        setIsSpeaking(true);
                        speakText(clean, () => setIsSpeaking(false));
                      }}
                      className="px-3 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs flex items-center gap-1.5 transition-colors"
                    >
                      <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Replay Wallmiki Voice</span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Raw JSON Payload Inspector */}
            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <Code className="w-3.5 h-3.5 text-purple-400" />
                  <span>Alexa Skills Kit JSON Response</span>
                </span>
                <button
                  onClick={() =>
                    copyToClipboard(
                      JSON.stringify(alexaResponse, null, 2),
                      "alexa-json"
                    )
                  }
                  className="text-xs text-slate-400 hover:text-white flex items-center gap-1 font-mono"
                >
                  {copiedSection === "alexa-json" ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                  <span>Copy JSON</span>
                </button>
              </div>

              <pre className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-[11px] font-mono text-cyan-300 max-h-56 overflow-y-auto leading-tight">
                {alexaResponse
                  ? JSON.stringify(alexaResponse, null, 2)
                  : `// Alexa Skills Kit JSON will populate here upon invoking a preset...`}
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* TAB: GITHUB COMMIT & PUSH HUB */}
      {activeTab === "git-guide" && (
        <div className="space-y-6">
          {/* Top Banner */}
          <div className="p-5 rounded-xl border border-slate-700 bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-950">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-lg bg-white/10 text-white border border-white/20">
                  <Github className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-white">
                      GitHub Repository Commit & Sync
                    </h3>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                      BRANCH: main
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-blue-500/20 text-blue-300 border border-blue-500/40">
                      TREE CLEAN
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mt-1 max-w-2xl">
                    All latest changes (Render blueprint, Dockerfile, Alexa Skill models, and documentation) are fully committed to the local <code className="text-cyan-300">main</code> branch and ready to push to your GitHub repository.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() =>
                    copyToClipboard(
                      `# 1. Target repository is already set to stpaul2coderdojo/schizoOS-
# 2. Push with your GitHub Personal Access Token (PAT):
./deploy/github-push.sh <YOUR_GITHUB_PAT>

# Or push directly via git:
git push https://<YOUR_GITHUB_PAT>@github.com/stpaul2coderdojo/schizoOS-.git main`,
                      "git-commands"
                    )
                  }
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors border border-slate-700"
                >
                  {copiedSection === "git-commands" ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                  <span>Copy Push Commands</span>
                </button>
              </div>
            </div>
          </div>

          {/* 2 Methods Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Method 1: AI Studio UI Export */}
            <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/60 space-y-4">
              <div className="flex items-center gap-2 text-cyan-400 font-semibold text-sm">
                <Sparkles className="w-4 h-4" />
                <span>Method 1: AI Studio 1-Click Export (Easiest)</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Google AI Studio has built-in GitHub integration that syncs the entire codebase directly to your personal or organization GitHub account without needing to type terminal commands:
              </p>
              <ol className="text-xs text-slate-300 space-y-2 list-decimal list-inside">
                <li>Click the <strong>Settings / Menu icon</strong> (three dots or gear icon in the top header).</li>
                <li>Select <strong>Export to GitHub</strong> (or <strong>Push to GitHub</strong>).</li>
                <li>Authenticate with your GitHub account if prompted.</li>
                <li>Choose or create a repository name (e.g. <code className="text-cyan-300 font-mono">vayu-vaidya-wallmiki</code>).</li>
                <li>Click <strong>Export</strong>. Your repo is immediately live on GitHub!</li>
              </ol>

              {/* Permitted Repositories Note */}
              <div className="p-3.5 rounded-lg border border-amber-500/30 bg-amber-950/20 text-xs text-slate-300 space-y-2">
                <div className="font-semibold text-amber-300 flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>Fixing "Add this repository to permitted repos" for stpaul2coderdojo/schizoOS-</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Because <strong>stpaul2coderdojo</strong> is a GitHub Organization, GitHub restricts third-party apps by default until granted under the Organization settings:
                </p>
                <ol className="text-[11px] text-slate-400 space-y-1 list-decimal list-inside">
                  <li>Go to: <code className="text-amber-200">github.com/organizations/stpaul2coderdojo/settings/installations</code></li>
                  <li>Click <strong>Configure</strong> next to <strong>Google AI Studio</strong> (or <strong>Render</strong>).</li>
                  <li>Under <em>Repository access</em>, select <strong>"All repositories"</strong> or check <code className="text-amber-200">schizoOS-</code> under <em>Only select repositories</em>.</li>
                  <li>Click <strong>Save</strong>. You can now export directly without permission errors!</li>
                </ol>
              </div>
            </div>

            {/* Method 2: Git CLI */}
            <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/60 space-y-4">
              <div className="flex items-center gap-2 text-emerald-400 font-semibold text-sm">
                <Terminal className="w-4 h-4" />
                <span>Method 2: Direct Git Push to stpaul2coderdojo/schizoOS-</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                The local repository is already configured with <code className="text-emerald-300 font-mono">origin: stpaul2coderdojo/schizoOS-</code>. You can push using a GitHub Personal Access Token (PAT):
              </p>
              <div className="space-y-2.5">
                <div className="text-[11px] font-mono text-slate-400">Step 1: Generate a token at <span className="text-cyan-300">github.com/settings/tokens</span> with repo write permissions.</div>
                <div className="text-[11px] font-mono text-slate-400">Step 2: Push with your token:</div>
                <div className="p-2.5 rounded bg-slate-950 border border-slate-800 font-mono text-[11px] text-emerald-300 break-all">
                  ./deploy/github-push.sh ghp_yourPersonalAccessTokenHere
                </div>
                <div className="text-[11px] font-mono text-slate-400">Or push directly with git:</div>
                <div className="p-2.5 rounded bg-slate-950 border border-slate-800 font-mono text-[10.5px] text-cyan-300 break-all">
                  git push https://&lt;YOUR_TOKEN&gt;@github.com/stpaul2coderdojo/schizoOS-.git main
                </div>
              </div>
            </div>
          </div>

          {/* Recent Commits Checklist */}
          <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/60 space-y-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-white">
              <GitBranch className="w-4 h-4 text-purple-400" />
              <span>Clean Local Git Commit History Ready to Push</span>
            </div>
            <div className="space-y-2 font-mono text-xs text-slate-300">
              <div className="flex items-center gap-2 p-2 rounded bg-slate-950 border border-slate-800/80">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-slate-500">HEAD → main</span>
                <span className="text-slate-200">Add GitHub push automation helper script & clean commit tree</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded bg-slate-950 border border-slate-800/80">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-slate-500">fe2771b</span>
                <span className="text-slate-200">Clarify GEMINI_API_KEY dashboard configuration for Render deployments</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded bg-slate-950 border border-slate-800/80">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-slate-500">59f2e06</span>
                <span className="text-slate-200">Add Render.com deployment blueprint (render.yaml), automated deploy script, and in-app deployment hub</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB: RENDER.COM DEPLOYMENT (render.yaml Blueprint) */}
      {activeTab === "render-guide" && (
        <div className="space-y-6">
          {/* Top Banner */}
          <div className="p-5 rounded-xl border border-emerald-500/30 bg-gradient-to-r from-emerald-950/40 via-slate-900/80 to-cyan-950/40">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  <Globe className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-white">
                      Deploy to Render (Render.com)
                    </h3>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                      BLUEPRINT (render.yaml)
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                      MULTI-STAGE DOCKER
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mt-1 max-w-2xl">
                    Deploy Vayu Vaidya • Wallmiki to Render with automated builds, free SSL/TLS certificates, zero-downtime deploys, and direct Alexa Skills Kit webhook support.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <a
                  href="https://dashboard.render.com/blueprints/new"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-lg shadow-emerald-900/20"
                >
                  <span>Open Render Blueprint</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>

          {/* 3 Step Deployment Flow */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 space-y-2">
              <div className="flex items-center gap-2 text-emerald-400 font-semibold text-sm">
                <div className="w-6 h-6 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-xs">1</div>
                <span>Push to GitHub / GitLab</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Commit and push the workspace repository with <code className="text-emerald-300">render.yaml</code> and <code className="text-emerald-300">Dockerfile</code> to your GitHub/GitLab account.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 space-y-2">
              <div className="flex items-center gap-2 text-cyan-400 font-semibold text-sm">
                <div className="w-6 h-6 rounded-full bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-xs">2</div>
                <span>Connect Blueprint</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                In Render Dashboard, click <strong>New +</strong> → <strong>Blueprint</strong>, select the repository, and provide your <code className="text-cyan-300">GEMINI_API_KEY</code>.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 space-y-2">
              <div className="flex items-center gap-2 text-purple-400 font-semibold text-sm">
                <div className="w-6 h-6 rounded-full bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-xs">3</div>
                <span>Connect Alexa & Domain</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Point your Alexa Skill HTTPS endpoint to <code className="text-purple-300">https://your-service.onrender.com/api/alexa</code> and attach <code className="text-purple-300">www.vayuvaidya.info</code>.
              </p>
            </div>
          </div>

          {/* Configuration & Environment Variables */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Blueprint Specification */}
            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileJson className="w-4 h-4 text-emerald-400" />
                  <span className="text-sm font-semibold text-white">render.yaml Specification</span>
                </div>
                <button
                  onClick={() =>
                    copyToClipboard(
                      `services:
  - type: web
    name: vayu-vaidya-wallmiki
    runtime: docker
    dockerfilePath: ./Dockerfile
    plan: free
    region: oregon
    branch: main
    autoDeploy: true
    healthCheckPath: /api/health
    envVars:
      - key: NODE_ENV
        value: production
      - key: PORT
        value: 3000
      - key: GEMINI_API_KEY
        sync: false`,
                      "render-yaml"
                    )
                  }
                  className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs flex items-center gap-1.5 transition-colors"
                >
                  {copiedSection === "render-yaml" ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                  <span>Copy YAML</span>
                </button>
              </div>

              <pre className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 text-[11px] font-mono text-emerald-300 overflow-x-auto leading-relaxed">
{`services:
  - type: web
    name: vayu-vaidya-wallmiki
    runtime: docker
    dockerfilePath: ./Dockerfile
    plan: free # or 'starter' ($7/mo for 0% sleep)
    region: oregon
    branch: main
    autoDeploy: true
    healthCheckPath: /api/health
    envVars:
      - key: NODE_ENV
        value: production
      - key: PORT
        value: 3000
      - key: GEMINI_API_KEY
        sync: false`}
              </pre>
            </div>

            {/* Environment Variables & Alexa Integration */}
            <div className="space-y-4">
              <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 space-y-3">
                <div className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-cyan-400" />
                  <span className="text-sm font-semibold text-white">Render Environment Variables</span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-950/60 text-slate-400 border-b border-slate-800 font-mono">
                      <tr>
                        <th className="p-2">Key</th>
                        <th className="p-2">Value</th>
                        <th className="p-2">Description</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 font-mono text-slate-300">
                      <tr>
                        <td className="p-2 text-cyan-300">NODE_ENV</td>
                        <td className="p-2">production</td>
                        <td className="p-2 text-slate-400">Enables production Express compression and React static caching</td>
                      </tr>
                      <tr>
                        <td className="p-2 text-cyan-300">PORT</td>
                        <td className="p-2">3000</td>
                        <td className="p-2 text-slate-400">Matches Docker EXPOSE 3000 port binding</td>
                      </tr>
                      <tr>
                        <td className="p-2 text-amber-300">GEMINI_API_KEY</td>
                        <td className="p-2 text-slate-500">AIzaSy...</td>
                        <td className="p-2 text-slate-400">Powers conversational CBT and clinical reframing</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Alexa Integration with Render */}
              <div className="rounded-xl border border-purple-500/20 bg-slate-900/60 p-5 space-y-2">
                <div className="flex items-center gap-2 text-purple-400 font-semibold text-sm">
                  <Radio className="w-4 h-4" />
                  <span>Alexa Skill HTTPS Webhook on Render</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Render provides automatic HTTPS with free SSL certificates. You can use Render as your primary Alexa backend without needing AWS Lambda:
                </p>
                <div className="p-2 rounded bg-slate-950 border border-slate-800 font-mono text-[11px] text-purple-300 select-all">
                  https://vayu-vaidya-wallmiki.onrender.com/api/alexa
                </div>
                <p className="text-[11px] text-slate-400">
                  In Alexa Developer Console → Endpoint → Select HTTPS and choose: <em>"My development endpoint is a sub-domain of a domain that has a wildcard certificate from a certificate authority"</em>.
                </p>
              </div>

              {/* Did Render not prompt for the key? Callout */}
              <div className="rounded-xl border border-amber-500/30 bg-amber-950/20 p-5 space-y-2.5">
                <div className="flex items-center gap-2 text-amber-400 font-semibold text-sm">
                  <Zap className="w-4 h-4" />
                  <span>Did Render not ask for your Gemini API key?</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  If you created a <strong>Web Service</strong> instead of a <strong>Blueprint</strong>, or clicked Deploy right away, Render doesn't halt the build. You can add it in 15 seconds:
                </p>
                <ol className="text-xs text-slate-300 space-y-1 list-decimal list-inside font-sans">
                  <li>Go to <strong>dashboard.render.com</strong> → Click your service <strong>vayu-vaidya-wallmiki</strong></li>
                  <li>Click <strong>Environment</strong> in the left sidebar</li>
                  <li>Click <strong>Add Environment Variable</strong></li>
                  <li>Set Key: <code className="text-amber-300 font-mono">GEMINI_API_KEY</code>, Value: <span className="text-slate-400 font-mono">[your API key]</span></li>
                  <li>Click <strong>Save Changes</strong> (Render auto-redeploys immediately)</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: AWS LAMBDA DOCKER DEPLOYMENT GUIDE */}
      {activeTab === "deploy-guide" && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60">
              <div className="flex items-center gap-2 text-cyan-400 font-semibold text-sm mb-1">
                <Cpu className="w-4 h-4" />
                <span>1. Container Size & RAM</span>
              </div>
              <p className="text-xs text-slate-400">
                AWS Lambda supports up to <strong>10GB</strong> container images and 10,240MB RAM. We recommend <strong>1024MB</strong> for dedicated vCPU allocation and sub-2s cold boots.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60">
              <div className="flex items-center gap-2 text-purple-400 font-semibold text-sm mb-1">
                <Zap className="w-4 h-4" />
                <span>2. Lambda Web Adapter</span>
              </div>
              <p className="text-xs text-slate-400">
                Uses official <code className="text-cyan-300">aws-lambda-adapter</code> extension. Express and Vite run unaltered on port 3000 inside Lambda, answering both web traffic and Alexa calls.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60">
              <div className="flex items-center gap-2 text-emerald-400 font-semibold text-sm mb-1">
                <Radio className="w-4 h-4" />
                <span>3. Dual Endpoint Triggers</span>
              </div>
              <p className="text-xs text-slate-400">
                Connect the skill either via direct <strong>AWS Lambda ARN</strong> trigger in the Alexa Developer Console, or via public <strong>Lambda Function URL</strong> HTTPS endpoint.
              </p>
            </div>
          </div>

          {/* Automated Script Box */}
          <div className="rounded-xl border border-cyan-500/30 bg-slate-900/80 p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-white font-semibold text-sm">
                <Terminal className="w-4 h-4 text-cyan-400" />
                <span>Automated 1-Click CLI Deployment</span>
              </div>
              <button
                onClick={() =>
                  copyToClipboard("./deploy/aws-lambda-deploy.sh", "deploy-cmd")
                }
                className="text-xs text-cyan-300 hover:text-white flex items-center gap-1 font-mono"
              >
                {copiedSection === "deploy-cmd" ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
                <span>Copy Command</span>
              </button>
            </div>
            <p className="text-xs text-slate-300">
              Run this single script to check AWS CLI, authenticate Docker with Amazon ECR, build the Lambda image, push to ECR, deploy the Lambda function, and configure the Alexa trigger:
            </p>
            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 font-mono text-xs text-cyan-300">
              export AWS_REGION="us-east-1"<br />
              export GEMINI_API_KEY="AIzaSy..."<br />
              ./deploy/aws-lambda-deploy.sh
            </div>
          </div>

          {/* Manual Step-by-Step CLI Walkthrough */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 space-y-4">
            <h4 className="text-sm font-semibold text-white">
              Manual Step-by-Step CLI Walkthrough
            </h4>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded bg-slate-950 border border-slate-800">
                <div className="font-semibold text-cyan-400 mb-1">
                  Step 1: Authenticate Docker with Amazon ECR
                </div>
                <div className="font-mono text-slate-300">
                  aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin &lt;AWS_ACCOUNT_ID&gt;.dkr.ecr.us-east-1.amazonaws.com
                </div>
              </div>

              <div className="p-3 rounded bg-slate-950 border border-slate-800">
                <div className="font-semibold text-cyan-400 mb-1">
                  Step 2: Build & Tag Container for AWS Lambda
                </div>
                <div className="font-mono text-slate-300">
                  docker build -t vayu-vaidya-wallmiki:latest -f Dockerfile.lambda .<br />
                  docker tag vayu-vaidya-wallmiki:latest &lt;AWS_ACCOUNT_ID&gt;.dkr.ecr.us-east-1.amazonaws.com/vayu-vaidya-wallmiki:latest
                </div>
              </div>

              <div className="p-3 rounded bg-slate-950 border border-slate-800">
                <div className="font-semibold text-cyan-400 mb-1">
                  Step 3: Push Container Image to ECR
                </div>
                <div className="font-mono text-slate-300">
                  docker push &lt;AWS_ACCOUNT_ID&gt;.dkr.ecr.us-east-1.amazonaws.com/vayu-vaidya-wallmiki:latest
                </div>
              </div>

              <div className="p-3 rounded bg-slate-950 border border-slate-800">
                <div className="font-semibold text-cyan-400 mb-1">
                  Step 4: Create Lambda Function from Container
                </div>
                <div className="font-mono text-slate-300">
                  aws lambda create-function \<br />
                  &nbsp;&nbsp;--function-name vayu-vaidya-wallmiki \<br />
                  &nbsp;&nbsp;--package-type Image \<br />
                  &nbsp;&nbsp;--code ImageUri=&lt;AWS_ACCOUNT_ID&gt;.dkr.ecr.us-east-1.amazonaws.com/vayu-vaidya-wallmiki:latest \<br />
                  &nbsp;&nbsp;--role arn:aws:iam::&lt;AWS_ACCOUNT_ID&gt;:role/lambda-execution-role \<br />
                  &nbsp;&nbsp;--memory-size 1024 \<br />
                  &nbsp;&nbsp;--timeout 30 \<br />
                  &nbsp;&nbsp;--region us-east-1
                </div>
              </div>

              <div className="p-3 rounded bg-slate-950 border border-slate-800">
                <div className="font-semibold text-cyan-400 mb-1">
                  Step 5: Grant Alexa Skills Kit Invoke Permission
                </div>
                <div className="font-mono text-slate-300">
                  aws lambda add-permission \<br />
                  &nbsp;&nbsp;--function-name vayu-vaidya-wallmiki \<br />
                  &nbsp;&nbsp;--statement-id AlexaPermission \<br />
                  &nbsp;&nbsp;--action lambda:InvokeFunction \<br />
                  &nbsp;&nbsp;--principal alexa-appkit.amazon.com \<br />
                  &nbsp;&nbsp;--region us-east-1
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: INTERACTION MODEL & MANIFEST */}
      {activeTab === "skill-manifest" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Interaction Model JSON */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-white flex items-center gap-1.5">
                <FileJson className="w-4 h-4 text-purple-400" />
                <span>alexa/interactionModels/custom/en-US.json</span>
              </span>
              <button
                onClick={() =>
                  copyToClipboard(
                    JSON.stringify(
                      {
                        interactionModel: {
                          languageModel: {
                            invocationName: "vayu vaidya",
                            intents: [
                              { name: "VayuPranayamaIntent", samples: ["start breathing exercise", "breathe with me", "pranayama"] },
                              { name: "GroundingIntent", samples: ["ground my senses", "sensory grounding", "five four three two one"] },
                              { name: "AutopilotCheckIntent", samples: ["check my autopilot", "break my thought loop", "activate buddhi"] },
                              { name: "SomaticScanIntent", samples: ["scan my body", "body scan", "interoceptive scan"] },
                              { name: "WallmikiWisdomIntent", samples: ["give me wisdom", "words of wisdom"] },
                              { name: "CbtReflectIntent", slots: [{ name: "userThought", type: "AMAZON.SearchQuery" }] }
                            ]
                          }
                        }
                      },
                      null,
                      2
                    ),
                    "interaction-model"
                  )
                }
                className="text-xs text-slate-400 hover:text-white flex items-center gap-1 font-mono"
              >
                {copiedSection === "interaction-model" ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
                <span>Copy JSON</span>
              </button>
            </div>
            <p className="text-xs text-slate-400">
              Paste this into the <strong>JSON Editor</strong> inside the Alexa Developer Console:
            </p>
            <pre className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-[11px] font-mono text-purple-300 max-h-96 overflow-y-auto leading-relaxed">
{`{
  "interactionModel": {
    "languageModel": {
      "invocationName": "vayu vaidya",
      "intents": [
        {
          "name": "VayuPranayamaIntent",
          "samples": [
            "start breathing exercise",
            "start a breathing exercise",
            "guide me through breathing",
            "breathe with me",
            "four four six two breathing"
          ]
        },
        {
          "name": "GroundingIntent",
          "samples": [
            "ground my senses",
            "do a grounding exercise",
            "sensory grounding",
            "five four three two one"
          ]
        },
        {
          "name": "AutopilotCheckIntent",
          "samples": [
            "check my autopilot",
            "am i stuck in autopilot",
            "break my thought loop",
            "activate buddhi"
          ]
        },
        {
          "name": "SomaticScanIntent",
          "samples": [
            "scan my body",
            "body scan",
            "check my physical sensations"
          ]
        },
        {
          "name": "WallmikiWisdomIntent",
          "samples": [
            "give me wisdom",
            "share a reflection",
            "tell me a peaceful thought"
          ]
        },
        {
          "name": "CbtReflectIntent",
          "slots": [
            { "name": "userThought", "type": "AMAZON.SearchQuery" }
          ],
          "samples": [
            "i feel like {userThought}",
            "help me reframe {userThought}",
            "i cannot stop thinking {userThought}"
          ]
        }
      ]
    }
  }
}`}
            </pre>
          </div>

          {/* Skill Manifest JSON */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-white flex items-center gap-1.5">
                <FileJson className="w-4 h-4 text-cyan-400" />
                <span>alexa/skill.json</span>
              </span>
              <button
                onClick={() =>
                  copyToClipboard(
                    JSON.stringify(
                      {
                        manifest: {
                          publishingInformation: {
                            locales: {
                              "en-US": {
                                name: "Vayu Vaidya Wallmiki",
                                summary: "Clinically grounded AI E-Psychiatrist & vagal breathwork companion.",
                                invocationPhrase: "open vayu vaidya"
                              }
                            }
                          }
                        }
                      },
                      null,
                      2
                    ),
                    "skill-manifest"
                  )
                }
                className="text-xs text-slate-400 hover:text-white flex items-center gap-1 font-mono"
              >
                {copiedSection === "skill-manifest" ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
                <span>Copy JSON</span>
              </button>
            </div>
            <p className="text-xs text-slate-400">
              Defines skill metadata, category, privacy compliance, and Lambda endpoints:
            </p>
            <pre className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-[11px] font-mono text-cyan-300 max-h-96 overflow-y-auto leading-relaxed">
{`{
  "manifest": {
    "publishingInformation": {
      "locales": {
        "en-US": {
          "name": "Vayu Vaidya Wallmiki",
          "summary": "Clinically grounded AI E-Psychiatrist, vagal breathwork, and cognitive grounding companion.",
          "examplePhrases": [
            "Alexa, open Vayu Vaidya",
            "Alexa, ask Vayu Vaidya for a breathing exercise",
            "Alexa, ask Vayu Vaidya to check my autopilot loop"
          ],
          "keywords": ["mental health", "psychiatry", "breathing", "cbt", "schizoos"]
        }
      },
      "category": "HEALTH_AND_FITNESS"
    },
    "apis": {
      "custom": {
        "endpoint": {
          "uri": "arn:aws:lambda:us-east-1:YOUR_ACCOUNT_ID:function:vayu-vaidya-wallmiki"
        }
      }
    }
  }
}`}
            </pre>
          </div>
        </div>
      )}

      {/* TAB 4: DOCKERFILE.LAMBDA SPEC */}
      {activeTab === "dockerfile" && (
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <Server className="w-4 h-4 text-cyan-400" />
                <span>Dockerfile.lambda — Multi-Stage Build with AWS Lambda Web Adapter</span>
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Optimized for AWS Lambda custom runtime images. Bundles Vite client, Express server, and AWS Lambda Web Adapter extension.
              </p>
            </div>
            <button
              onClick={() =>
                copyToClipboard(
                  `# Stage 1: Build\nFROM node:20-alpine AS builder\nWORKDIR /app\nCOPY package*.json ./\nRUN npm ci\nCOPY . .\nRUN npm run build\n\n# Stage 2: Lambda Runner\nFROM node:20-alpine AS runner\nWORKDIR /app\nCOPY --from=public.ecr.aws/awsgsl/aws-lambda-adapter:0.8.4 /lambda-adapter /opt/extensions/lambda-adapter\nENV NODE_ENV=production\nENV PORT=3000\nENV AWS_LWA_PORT=3000\nCOPY package*.json ./\nRUN npm ci --omit=dev\nCOPY --from=builder /app/dist ./dist\nCOPY --from=builder /app/public ./public\nEXPOSE 3000\nCMD ["node", "dist/server.cjs"]`,
                  "dockerfile-code"
                )
              }
              className="text-xs text-cyan-300 hover:text-white flex items-center gap-1 font-mono"
            >
              {copiedSection === "dockerfile-code" ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
              <span>Copy Dockerfile</span>
            </button>
          </div>

          <pre className="p-4 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono text-emerald-300 leading-relaxed overflow-x-auto">
{`# Stage 1: Build frontend & compile backend
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: AWS Lambda Execution Image with Lambda Web Adapter
FROM node:20-alpine AS runner
WORKDIR /app

# Copy AWS Lambda Web Adapter extension (bridges Lambda runtime to Express)
COPY --from=public.ecr.aws/awsgsl/aws-lambda-adapter:0.8.4 /lambda-adapter /opt/extensions/lambda-adapter

ENV NODE_ENV=production
ENV PORT=3000
ENV AWS_LWA_PORT=3000
ENV AWS_LWA_ENABLE_COMPRESSION=true

# Install production dependencies only
COPY package*.json ./
RUN npm ci --omit=dev

# Copy compiled SPA & bundled server
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/public ./public

EXPOSE 3000
CMD ["node", "dist/server.cjs"]`}
          </pre>
        </div>
      )}
    </div>
  );
};
