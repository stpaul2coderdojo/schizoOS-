/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import {
  Sparkles,
  Layers,
  MessageSquareHeart,
  Scale,
  Wind,
  Cpu,
  Globe,
  ShieldAlert,
  ExternalLink,
  Brain,
  Palette,
  Compass
} from "lucide-react";
import { NavigationTab, BotMediaItem } from "./types";
import { HologramStage } from "./components/HologramStage";
import { TherapyChat } from "./components/TherapyChat";
import { SchizoOSExplorer } from "./components/SchizoOSExplorer";
import { ArtTherapyLab } from "./components/ArtTherapyLab";
import { DrugScoringEngine } from "./components/DrugScoringEngine";
import { TherapyCustomizationLab } from "./components/TherapyCustomizationLab";
import { JavaBridgeExplorer } from "./components/JavaBridgeExplorer";

export default function App() {
  const [activeTab, setActiveTab] = useState<NavigationTab>("holoprojector");
  const [isAvatarSpeaking, setIsAvatarSpeaking] = useState(false);
  const [currentSpokenText, setCurrentSpokenText] = useState<string>(
    "Welcome to the Vayu Vaidya sanctuary. I am Wallmiki, your Mental Wellness Companion."
  );
  const [chatInitialPrompt, setChatInitialPrompt] = useState<string | undefined>(undefined);
  const [mediaToProject, setMediaToProject] = useState<BotMediaItem | null>(null);

  // Shared patient context across scoring & chat
  const [patientDrug, setPatientDrug] = useState("Olanzapine");
  const [patientDose, setPatientDose] = useState(10);

  const handleApplyContext = (drugName: string, dose: number) => {
    setPatientDrug(drugName);
    setPatientDose(dose);
  };

  const handleTherapySelectedToChat = (promptText: string) => {
    setChatInitialPrompt(promptText);
    setActiveTab("chat");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Clinical & System Status Notice Banner */}
      <div className="bg-slate-900 border-b border-slate-800/80 px-4 py-2 text-xs text-slate-400 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 font-mono text-[11px] text-cyan-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Wallmiki Companion Active</span>
          </div>
          <span className="text-slate-600 hidden sm:inline">|</span>
          <span className="hidden sm:inline text-slate-300">
            Project: <strong className="text-slate-100">Milwaukee, WI (Dec 2017 - Present)</strong>
          </span>
          <span className="text-slate-600 hidden md:inline">|</span>
          <span className="hidden md:inline text-slate-400">
            Mental Wellness, Woebot CBT & schizoOS by <strong>Dr. Bheemaiah Anil K</strong>
          </span>
        </div>

        <div className="flex items-center gap-4 text-xs">
          <a
            href="http://www.vayuvaidya.info"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 transition-colors font-mono"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>vayuvaidya.info</span>
            <ExternalLink className="w-3 h-3" />
          </a>
          <span className="text-amber-400/90 hidden lg:flex items-center gap-1">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Support: 988 Suicide & Crisis Lifeline</span>
          </span>
        </div>
      </div>

      {/* Primary Header */}
      <header className="border-b border-slate-800 bg-slate-950/90 backdrop-blur sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-wrap items-center justify-between gap-4">
          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 via-indigo-600 to-rose-500 p-0.5 shadow-lg shadow-cyan-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center text-cyan-400">
                <Sparkles className="w-5 h-5" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-bold tracking-tight text-white font-display">
                  VAYU VAIDYA • WALLMIKI
                </h1>
                <span className="px-2 py-0.5 text-[10px] font-mono rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 font-semibold">
                  MENTAL WELLNESS
                </span>
              </div>
              <p className="text-xs text-slate-400">
                CBT • MiCBT • schizoOS Autopilot Modeling & Art Therapy by Dr. Bheemaiah Anil K
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex items-center p-1 rounded-xl bg-slate-900 border border-slate-800 text-xs overflow-x-auto max-w-full gap-1">
            <button
              onClick={() => setActiveTab("holoprojector")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all whitespace-nowrap font-medium ${
                activeTab === "holoprojector"
                  ? "bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Holoprojector</span>
            </button>

            <button
              onClick={() => setActiveTab("chat")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all whitespace-nowrap font-medium ${
                activeTab === "chat"
                  ? "bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <MessageSquareHeart className="w-3.5 h-3.5" />
              <span>CBT Chatbot</span>
            </button>

            <button
              onClick={() => setActiveTab("schizo-os")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all whitespace-nowrap font-medium ${
                activeTab === "schizo-os"
                  ? "bg-indigo-500 text-slate-950 shadow-md shadow-indigo-500/20 font-bold"
                  : "text-indigo-300 hover:text-indigo-200 bg-indigo-950/40 border border-indigo-500/30"
              }`}
            >
              <Brain className="w-3.5 h-3.5 text-indigo-400" />
              <span>schizoOS Autopilot</span>
            </button>

            <button
              onClick={() => setActiveTab("art-therapy")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all whitespace-nowrap font-medium ${
                activeTab === "art-therapy"
                  ? "bg-rose-500 text-slate-950 shadow-md shadow-rose-500/20 font-bold"
                  : "text-rose-300 hover:text-rose-200 bg-rose-950/40 border border-rose-500/30"
              }`}
            >
              <Palette className="w-3.5 h-3.5 text-rose-400" />
              <span>Interactive Canvas & Art</span>
            </button>

            <button
              onClick={() => setActiveTab("scoring")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all whitespace-nowrap font-medium ${
                activeTab === "scoring"
                  ? "bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Scale className="w-3.5 h-3.5" />
              <span>Wellness Scoring</span>
            </button>

            <button
              onClick={() => setActiveTab("therapies")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all whitespace-nowrap font-medium ${
                activeTab === "therapies"
                  ? "bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Wind className="w-3.5 h-3.5" />
              <span>Pranayama Lab</span>
            </button>

            <button
              onClick={() => setActiveTab("java-bridge")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all whitespace-nowrap font-medium ${
                activeTab === "java-bridge"
                  ? "bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>Java 1.8 Bridge</span>
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 space-y-6">
        {/* Tab 1: Holoprojector Stage */}
        {activeTab === "holoprojector" && (
          <div className="space-y-6">
            <HologramStage
              isSpeaking={isAvatarSpeaking}
              currentMessage={currentSpokenText}
            />

            {/* Quick Interactive Sub-Panel */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div
                onClick={() => setActiveTab("chat")}
                className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 hover:border-cyan-500/40 cursor-pointer transition-all space-y-2 group"
              >
                <div className="flex items-center justify-between">
                  <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 group-hover:bg-cyan-500/20 transition-colors">
                    <MessageSquareHeart className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-mono text-cyan-300">Woebot CBT</span>
                </div>
                <h4 className="text-sm font-semibold text-slate-200 group-hover:text-cyan-300 transition-colors">
                  Mother Divine CBT Companion
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Engage in friendly conversational cognitive restructuring, catch automatic distortions, and practice MiCBT somatic scan exercises.
                </p>
              </div>

              <div
                onClick={() => setActiveTab("schizo-os")}
                className="p-4 rounded-xl bg-indigo-950/30 border border-indigo-500/30 hover:border-indigo-400 cursor-pointer transition-all space-y-2 group"
              >
                <div className="flex items-center justify-between">
                  <div className="p-2 rounded-lg bg-indigo-500/20 text-indigo-300 group-hover:bg-indigo-500/30 transition-colors">
                    <Brain className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-mono text-indigo-300">Dr. Anil K</span>
                </div>
                <h4 className="text-sm font-semibold text-slate-100 group-hover:text-indigo-300 transition-colors">
                  schizoOS Autopilot Modeling
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Understand your subconscious autopilot vs. Chitta (stored impressions), Manas (sensory gateway), and Buddhi discernment.
                </p>
              </div>

              <div
                onClick={() => setActiveTab("art-therapy")}
                className="p-4 rounded-xl bg-rose-950/30 border border-rose-500/30 hover:border-rose-400 cursor-pointer transition-all space-y-2 group"
              >
                <div className="flex items-center justify-between">
                  <div className="p-2 rounded-lg bg-rose-500/20 text-rose-300 group-hover:bg-rose-500/30 transition-colors">
                    <Palette className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-mono text-rose-300">Pod Automatism</span>
                </div>
                <h4 className="text-sm font-semibold text-slate-100 group-hover:text-rose-300 transition-colors">
                  Art Therapy Studio
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Experience State Pod Automatism, real-time color cluster analysis, and feminist art therapy empowerment outside psychiatric labeling.
                </p>
              </div>

              <div
                onClick={() => setActiveTab("scoring")}
                className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 hover:border-cyan-500/40 cursor-pointer transition-all space-y-2 group"
              >
                <div className="flex items-center justify-between">
                  <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 group-hover:bg-amber-500/20 transition-colors">
                    <Scale className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">Harm Reduction</span>
                </div>
                <h4 className="text-sm font-semibold text-slate-200 group-hover:text-cyan-300 transition-colors">
                  Wellness Scoring & Titration
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Evaluate drug burden ({patientDrug} {patientDose}mg) against holistic mental wellness therapies for safe non-pharmacological support.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: CBT Chatbot (Woebot-style + MiCBT + Mother Divine) */}
        {activeTab === "chat" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Hologram Thumbnail / Prescription Context */}
            <div className="lg:col-span-4 space-y-4">
              <HologramStage
                isSpeaking={isAvatarSpeaking}
                currentMessage={currentSpokenText}
              />
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2.5 text-xs text-slate-400">
                <div className="flex items-center justify-between text-slate-200 font-semibold">
                  <span>Mental Wellness Profile</span>
                  <button
                    onClick={() => setActiveTab("scoring")}
                    className="text-cyan-400 hover:underline font-mono text-[11px]"
                  >
                    Adjust
                  </button>
                </div>
                <div className="flex justify-between">
                  <span>Current Regimen:</span>
                  <span className="font-mono text-cyan-300">{patientDrug} ({patientDose}mg/day)</span>
                </div>
                <div className="flex justify-between">
                  <span>Active Wellness:</span>
                  <span className="text-emerald-300">Woebot CBT + schizoOS</span>
                </div>
                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                  <button
                    onClick={() => setActiveTab("schizo-os")}
                    className="text-indigo-300 hover:underline flex items-center gap-1"
                  >
                    <Brain className="w-3 h-3" />
                    <span>Open schizoOS</span>
                  </button>
                  <button
                    onClick={() => setActiveTab("art-therapy")}
                    className="text-rose-300 hover:underline flex items-center gap-1"
                  >
                    <Palette className="w-3 h-3" />
                    <span>Open Art Studio</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Chat Room */}
            <div className="lg:col-span-8">
              <TherapyChat
                onAvatarSpeakStart={() => setIsAvatarSpeaking(true)}
                onAvatarSpeakEnd={() => setIsAvatarSpeaking(false)}
                onNewMessageSpoken={(msg) => setCurrentSpokenText(msg)}
                currentDrugName={patientDrug}
                currentDailyDose={patientDose}
                initialPrompt={chatInitialPrompt}
                onOpenCanvas={(media) => {
                  if (media) setMediaToProject(media);
                  setActiveTab("art-therapy");
                }}
              />
            </div>
          </div>
        )}

        {/* Tab 3: schizoOS Autopilot & Cognitive Plane Modeling */}
        {activeTab === "schizo-os" && (
          <SchizoOSExplorer onSendPatternToChat={handleTherapySelectedToChat} />
        )}

        {/* Tab 4: Interactive Canvas, Bot Media & Feminist Art Therapy Lab */}
        {activeTab === "art-therapy" && (
          <ArtTherapyLab
            onSendArtAnalysisToChat={handleTherapySelectedToChat}
            initialMediaToProject={mediaToProject}
          />
        )}

        {/* Tab 5: Drug Replacement & Wellness Scoring Engine */}
        {activeTab === "scoring" && (
          <DrugScoringEngine onApplyContextToChat={handleApplyContext} />
        )}

        {/* Tab 6: Pranayama & Acoustic Lab */}
        {activeTab === "therapies" && (
          <TherapyCustomizationLab onSelectTherapyToChat={handleTherapySelectedToChat} />
        )}

        {/* Tab 7: Java 1.8 & Eclipse Architecture */}
        {activeTab === "java-bridge" && <JavaBridgeExplorer />}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-800/80 bg-slate-950 px-4 py-4 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-400 font-display">Vayu Vaidya - Mother Divine</span>
            <span>•</span>
            <span>Milwaukee, WI</span>
            <span>•</span>
            <span>December 2017 to Present</span>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="http://www.vayuvaidya.info"
              target="_blank"
              rel="noreferrer"
              className="text-cyan-400 hover:underline"
            >
              www.vayuvaidya.info
            </a>
            <span>•</span>
            <span>schizoOS & Art Automatism by Dr. Bheemaiah Anil K</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
