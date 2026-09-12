import React, { useState, useEffect, useRef } from "react";
import {
  Send,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  RefreshCw,
  HeartHandshake,
  ShieldCheck,
  Wind,
  Sparkles,
  AlertCircle,
  Brain,
  Palette,
  Bot,
  Zap,
  CheckCircle2,
  HelpCircle,
  Activity,
  Smile,
  Compass
} from "lucide-react";
import { Message } from "../types";
import { speakText, stopSpeaking } from "../utils/audioSynth";

interface TherapyChatProps {
  onAvatarSpeakStart?: () => void;
  onAvatarSpeakEnd?: () => void;
  onNewMessageSpoken?: (msg: string) => void;
  currentDrugName?: string;
  currentDailyDose?: number;
  initialPrompt?: string;
  onOpenCanvas?: (mediaItem?: any) => void;
}

export const TherapyChat: React.FC<TherapyChatProps> = ({
  onAvatarSpeakStart,
  onAvatarSpeakEnd,
  onNewMessageSpoken,
  currentDrugName,
  currentDailyDose,
  initialPrompt,
  onOpenCanvas,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "intro-1",
      sender: "wallmiki",
      text: "Namaste, peace and stillness be with you. I am Wallmiki, your Vayu Vaidya Mental Wellness Companion and E-Psychiatrist. Welcome into our sanctuary. I am here to practice Woebot-style CBT, MiCBT body mindfulness, and Dr. Bheemaiah Anil K's schizoOS autopilot awareness with you. How is your mind, breath, and inner space feeling right now?",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      groundingScore: 96,
      therapyMode: "cbt",
      wellnessExercise: {
        type: "cbt-distortion",
        title: "Check-in: How is your mind feeling right now?",
        description: "Select what resonates most, or share whatever is on your mind in your own words:",
        options: [
          "🌪️ Caught in an autopilot thinking loop",
          "⚡ Somatic physical tension / racing heart",
          "🔍 Catching a cognitive distortion (ANT)",
          "🎨 Open Interactive Canvas & Paint",
        ],
      },
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [therapyMode, setTherapyMode] = useState<
    "cbt" | "micbt" | "schizo-os" | "art-therapy" | "pranayama" | "reality-anchor" | "drug-consult"
  >("cbt");
  const [autoVoice, setAutoVoice] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const recognitionRef = useRef<any>(null);

  // Initialize Web Speech Recognition
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      setSpeechSupported(true);
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = "en-US";

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput((prev) => (prev ? `${prev} ${transcript}` : transcript));
        setIsRecording(false);
      };

      recognition.onerror = () => {
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  // Handle initial prompt if passed
  useEffect(() => {
    if (initialPrompt) {
      handleSend(initialPrompt);
    }
  }, [initialPrompt]);

  const toggleRecording = () => {
    if (!speechSupported || !recognitionRef.current) {
      alert("Speech recognition is not supported in this browser. You can type directly in the chat box.");
      return;
    }

    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsRecording(true);
      } catch (e) {
        setIsRecording(false);
      }
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (customText?: string) => {
    const textToSend = (customText || input).trim();
    if (!textToSend || loading) return;

    const userMessage: Message = {
      id: `usr-${Date.now()}`,
      sender: "user",
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: textToSend,
          therapyMode,
          patientContext: {
            drugName: currentDrugName || "Olanzapine",
            dailyDoseMg: currentDailyDose || 10,
            activeTherapies: [
              "Woebot CBT Cognitive Restructuring",
              "MiCBT Somatic Body Scan",
              "schizoOS Autopilot & Buddhi Discernment",
              "State Pod Automatism Art Therapy",
              "Vayu Vaidya Pranayama",
            ],
          },
        }),
      });

      const data = await res.json();
      const divineReply =
        data.text || data.fallbackText || "Peace be with you. Take a slow, grounding breath with me.";

      // Check if we should attach a wellness exercise interactive prompt
      let exerciseAttachment: Message["wellnessExercise"] = undefined;
      if (therapyMode === "cbt" && (textToSend.toLowerCase().includes("fail") || textToSend.toLowerCase().includes("never") || textToSend.toLowerCase().includes("always") || textToSend.toLowerCase().includes("terrible"))) {
        exerciseAttachment = {
          type: "cbt-distortion",
          title: "CBT Distortion Alert: Let's examine this thought!",
          description: "Which thinking pattern might be speaking here?",
          options: [
            "All-or-Nothing (Black & White)",
            "Catastrophizing (Expecting the worst)",
            "Emotional Reasoning ('I feel it, so it must be true')",
            "Mind Reading ('I know they are judging me')",
          ],
        };
      } else if (therapyMode === "schizo-os") {
        exerciseAttachment = {
          type: "autopilot-check",
          title: "schizoOS State Reflection (Dr. Bheemaiah Anil K)",
          description: "Notice where this experience is arising in your consciousness:",
          options: [
            "Reflexive Autopilot habit loop",
            "Manas sensory gateway reaction",
            "Chitta stored memory impression",
            "Activating Buddhi discernment pause",
          ],
        };
      }

      const botMessage: Message = {
        id: `wallmiki-${Date.now()}`,
        sender: "wallmiki",
        text: divineReply,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        isSimulated: data.isSimulated,
        groundingScore: data.groundingScore || 92,
        therapyMode,
        suggestedMedia: data.suggestedMedia,
        wellnessExercise: exerciseAttachment,
      };

      setMessages((prev) => [...prev, botMessage]);

      if (onNewMessageSpoken) {
        onNewMessageSpoken(divineReply);
      }

      if (autoVoice) {
        speakText(
          divineReply,
          () => onAvatarSpeakStart?.(),
          () => onAvatarSpeakEnd?.()
        );
      }
    } catch (err) {
      console.error("Chat error:", err);
      const errorMsg: Message = {
        id: `err-${Date.now()}`,
        sender: "wallmiki",
        text: "I am holding space for you, dear traveler. Take comfort in this moment: breathe in stillness, breathe out tension. Place your hand gently on your chest and feel the life breath (Vayu). You are safe, and your mind is capable of gentle peace.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        groundingScore: 88,
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleManualSpeak = (text: string) => {
    speakText(
      text,
      () => onAvatarSpeakStart?.(),
      () => onAvatarSpeakEnd?.()
    );
  };

  const clearChat = () => {
    stopSpeaking();
    setMessages([
      {
        id: "intro-fresh",
        sender: "wallmiki",
        text: "The sanctuary is renewed. Take a deep, gentle breath with me. I am Wallmiki, your Vayu Vaidya Mental Wellness Companion. How may I support your healing, self-reflection, and inner peace right now?",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        groundingScore: 96,
        therapyMode: "cbt",
      },
    ]);
  };

  const quickPrompts = [
    {
      label: "Woebot CBT Check-In",
      icon: Smile,
      prompt: "I want to do a Woebot-style CBT check-in: I'm noticing a distressing thought and want to examine the cognitive distortions in it.",
      mode: "cbt",
    },
    {
      label: "Project Mandala to Canvas",
      icon: Palette,
      prompt: "Wallmiki, please project a sacred mandala onto the interactive canvas so I can paint and focus my attention.",
      mode: "art-therapy",
    },
    {
      label: "schizoOS Autopilot vs Buddhi",
      icon: Brain,
      prompt: "Explain how Dr. Bheemaiah Anil K's schizoOS helps me distinguish between my automatic autopilot thinking and my Buddhi discernment / Chitta impressions.",
      mode: "schizo-os",
    },
    {
      label: "MiCBT Body Scan",
      icon: Activity,
      prompt: "Guide me through an interoceptive MiCBT body scan. I feel visceral tightness and want to observe it with equanimity.",
      mode: "micbt",
    },
    {
      label: "Vayu Breath Pacing",
      icon: Wind,
      prompt: "Please guide me through a 5-minute Vayu Vaidya Pranayama breathing cycle (4-4-6-2) to calm my nervous system.",
      mode: "pranayama",
    },
    {
      label: "5-4-3-2-1 Sensory Grounding",
      icon: HeartHandshake,
      prompt: "Lead me through the 5-4-3-2-1 reality anchoring sensory exercise to ground in physical surroundings.",
      mode: "reality-anchor",
    },
  ];

  return (
    <div className="flex flex-col h-[740px] bg-slate-900/60 border border-slate-800/80 rounded-2xl overflow-hidden shadow-xl">
      {/* Header bar */}
      <div className="px-5 py-3.5 bg-slate-900/90 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500/20 to-indigo-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-slate-100 font-display">
                Wallmiki • Mental Wellness & CBT Companion
              </h3>
              <span className="flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Gemini NLP Active
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Ethereal Resonant Guide • Woebot-style CBT, MiCBT Equanimity & schizoOS Modeling
            </p>
          </div>
        </div>

        {/* Therapy Mode Switcher & Tools */}
        <div className="flex items-center gap-2">
          <div className="hidden lg:flex items-center text-xs p-1 rounded-lg bg-slate-950 border border-slate-800">
            <button
              onClick={() => setTherapyMode("cbt")}
              className={`px-2.5 py-1 rounded transition-all flex items-center gap-1 ${
                therapyMode === "cbt"
                  ? "bg-cyan-500/20 text-cyan-300 font-medium"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Smile className="w-3 h-3" />
              CBT (Woebot)
            </button>
            <button
              onClick={() => setTherapyMode("micbt")}
              className={`px-2.5 py-1 rounded transition-all flex items-center gap-1 ${
                therapyMode === "micbt"
                  ? "bg-cyan-500/20 text-cyan-300 font-medium"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Activity className="w-3 h-3" />
              MiCBT
            </button>
            <button
              onClick={() => setTherapyMode("schizo-os")}
              className={`px-2.5 py-1 rounded transition-all flex items-center gap-1 ${
                therapyMode === "schizo-os"
                  ? "bg-indigo-500/20 text-indigo-300 font-medium"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Brain className="w-3 h-3 text-indigo-400" />
              schizoOS
            </button>
            <button
              onClick={() => setTherapyMode("art-therapy")}
              className={`px-2.5 py-1 rounded transition-all flex items-center gap-1 ${
                therapyMode === "art-therapy"
                  ? "bg-rose-500/20 text-rose-300 font-medium"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Palette className="w-3 h-3 text-rose-400" />
              Art Therapy
            </button>
            <button
              onClick={() => setTherapyMode("pranayama")}
              className={`px-2.5 py-1 rounded transition-all flex items-center gap-1 ${
                therapyMode === "pranayama"
                  ? "bg-cyan-500/20 text-cyan-300 font-medium"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Wind className="w-3 h-3" />
              Pranayama
            </button>
            <button
              onClick={() => setTherapyMode("drug-consult")}
              className={`px-2.5 py-1 rounded transition-all ${
                therapyMode === "drug-consult"
                  ? "bg-cyan-500/20 text-cyan-300 font-medium"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Wellness Scoring
            </button>
          </div>

          {/* Auto Voice Readout Toggle */}
          <button
            onClick={() => setAutoVoice(!autoVoice)}
            className={`p-2 rounded-lg border text-xs transition-all ${
              autoVoice
                ? "bg-cyan-500/20 border-cyan-500/40 text-cyan-300"
                : "bg-slate-800/60 border-slate-700/60 text-slate-400 hover:text-slate-200"
            }`}
            title={autoVoice ? "Mother Divine voice speech ON" : "Voice speech OFF"}
          >
            {autoVoice ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Clear Session */}
          <button
            onClick={clearChat}
            className="p-2 rounded-lg bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 text-slate-400 hover:text-slate-200 transition-all"
            title="Reset Session"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Quick Prompts Bar */}
      <div className="px-4 py-2 bg-slate-950/70 border-b border-slate-800/80 flex items-center gap-2 overflow-x-auto no-scrollbar">
        <span className="text-[11px] font-mono text-slate-500 uppercase tracking-wider shrink-0">
          Guided Exercises:
        </span>
        {quickPrompts.map((qp, idx) => {
          const Icon = qp.icon;
          return (
            <button
              key={idx}
              onClick={() => {
                setTherapyMode(qp.mode as any);
                handleSend(qp.prompt);
              }}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 hover:border-cyan-500/40 text-xs text-slate-300 hover:text-cyan-300 whitespace-nowrap transition-all"
            >
              <Icon className="w-3.5 h-3.5 text-cyan-400" />
              <span>{qp.label}</span>
            </button>
          );
        })}
      </div>

      {/* Messages Scroll View */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {messages.map((msg) => {
          const isBot = msg.sender === "wallmiki" || msg.sender === "mother-divine";

          return (
            <div
              key={msg.id}
              className={`flex gap-3 max-w-[88%] sm:max-w-[78%] ${
                isBot ? "mr-auto" : "ml-auto flex-row-reverse"
              }`}
            >
              {/* Avatar Icon */}
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border ${
                  isBot
                    ? "bg-gradient-to-tr from-cyan-600 to-indigo-600 text-white border-cyan-400/40 shadow-md shadow-cyan-500/20"
                    : "bg-slate-800 border-slate-700 text-slate-300"
                }`}
              >
                {isBot ? <Sparkles className="w-4 h-4" /> : <div className="text-xs font-bold">You</div>}
              </div>

              {/* Message Bubble */}
              <div
                className={`rounded-2xl p-4 text-sm leading-relaxed ${
                  isBot
                    ? "bg-slate-900/95 border border-slate-800 text-slate-100 shadow-md shadow-slate-950/50"
                    : "bg-gradient-to-r from-cyan-600 to-cyan-500 text-slate-950 font-medium"
                }`}
              >
                {/* Header info */}
                <div
                  className={`flex items-center justify-between gap-3 text-[11px] mb-1.5 ${
                    isBot ? "text-slate-400" : "text-cyan-950 font-semibold"
                  }`}
                >
                  <span className="font-semibold">
                    {isBot ? "Wallmiki (Mental Wellness Guide)" : "You"}
                  </span>
                  <div className="flex items-center gap-2 font-mono">
                    <span>{msg.timestamp}</span>
                    {isBot && (
                      <button
                        onClick={() => handleManualSpeak(msg.text)}
                        className="p-1 hover:text-cyan-300 transition-colors"
                        title="Replay Voice"
                      >
                        <Volume2 className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Text Content */}
                <div className="whitespace-pre-wrap">{msg.text}</div>

                {/* Suggested Media Projection Card (Interactive Canvas integration) */}
                {msg.suggestedMedia && (
                  <div className="mt-3 p-3 rounded-xl bg-slate-950/90 border border-cyan-500/40 space-y-2.5 shadow-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-cyan-300">
                        <Palette className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Wallmiki Media: {msg.suggestedMedia.title}</span>
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 uppercase">
                        {msg.suggestedMedia.type}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-300 leading-relaxed">
                      {msg.suggestedMedia.description}
                    </p>
                    {onOpenCanvas && (
                      <button
                        onClick={() => onOpenCanvas(msg.suggestedMedia)}
                        className="w-full py-2 px-3 rounded-lg bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-slate-950 font-semibold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-cyan-900/30 transition-all"
                      >
                        <Palette className="w-3.5 h-3.5" />
                        <span>Project onto Interactive Canvas & Paint</span>
                      </button>
                    )}
                  </div>
                )}

                {/* Interactive Wellness Exercise Card (Woebot style) */}
                {msg.wellnessExercise && (
                  <div className="mt-3 pt-3 border-t border-slate-800/80 p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-cyan-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                      <span>{msg.wellnessExercise.title}</span>
                    </div>
                    <p className="text-[11px] text-slate-400">{msg.wellnessExercise.description}</p>
                    {msg.wellnessExercise.options && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {msg.wellnessExercise.options.map((opt, i) => (
                          <button
                            key={i}
                            onClick={() => handleSend(opt)}
                            className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-cyan-500/20 border border-slate-800 hover:border-cyan-500/40 text-[11px] text-slate-300 hover:text-cyan-200 transition-all text-left"
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Telemetry Footer for AI responses */}
                {isBot && msg.groundingScore && (
                  <div className="pt-2 mt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono text-slate-400">
                    <span className="flex items-center gap-1 text-cyan-400">
                      <Zap className="w-3 h-3" />
                      Grounding Stability: {msg.groundingScore}%
                    </span>
                    {msg.therapyMode && (
                      <span className="text-slate-400 uppercase tracking-wider">
                        {msg.therapyMode}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Loading Indicator */}
        {loading && (
          <div className="flex gap-3 mr-auto max-w-lg items-center">
            <div className="w-8 h-8 rounded-full bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300">
              <Bot className="w-4 h-4 animate-spin" />
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 text-xs text-slate-400 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              <span>Wallmiki is attuning to your emotional state & formulating wellness reflection...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-slate-950/90 border-t border-slate-800/90 space-y-2">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          {/* Voice Input Button */}
          <button
            type="button"
            onClick={toggleRecording}
            className={`p-2.5 rounded-xl border transition-all ${
              isRecording
                ? "bg-red-500/20 border-red-500/50 text-red-400 animate-pulse shadow-md shadow-red-500/20"
                : "bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700"
            }`}
            title={isRecording ? "Listening to your voice..." : "Speak via Microphone"}
          >
            {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          {/* Text Input */}
          <div className="relative flex-1">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={
                isRecording
                  ? "Listening to your voice..."
                  : "Reflect on a thought, share an autopilot habit, or request CBT/MiCBT guidance..."
              }
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/30 transition-all"
            />
          </div>

          {/* Send Button */}
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="p-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 disabled:hover:bg-cyan-500 text-slate-950 font-medium transition-all shadow-md shadow-cyan-500/20 flex items-center justify-center cursor-pointer disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>

        <div className="flex items-center justify-between text-[11px] text-slate-500 px-1">
          <span className="flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5 text-cyan-400" />
            Empowering mental wellness practices. If in acute crisis, call 988 or consult emergency medical support.
          </span>
          <span className="font-mono text-slate-600 hidden md:inline">
            NLP Engine: Google Gemini API (gemini-3.8-flash)
          </span>
        </div>
      </div>
    </div>
  );
};
