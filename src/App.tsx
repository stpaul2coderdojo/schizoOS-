/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import {
  MessageSquareHeart,
  Scale,
  Brain,
  Palette,
  Radio
} from "lucide-react";
import { NavigationTab, BotMediaItem } from "./types";
import { CinematicLanding } from "./components/CinematicLanding";
import { HologramStage } from "./components/HologramStage";
import { TherapyChat } from "./components/TherapyChat";
import { SchizoOSExplorer } from "./components/SchizoOSExplorer";
import { ArtTherapyLab } from "./components/ArtTherapyLab";
import { DrugScoringEngine } from "./components/DrugScoringEngine";
import { TherapyCustomizationLab } from "./components/TherapyCustomizationLab";
import { JavaBridgeExplorer } from "./components/JavaBridgeExplorer";
import { AlexaSkillSimulator } from "./components/AlexaSkillSimulator";

export default function App() {
  const [activeTab, setActiveTab] = useState<NavigationTab>("landing");
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
      {/* Primary Header: Strict 3-Zone Top Bar Contract */}
      <header className="border-b border-slate-800/80 bg-slate-950/95 backdrop-blur sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-6">
          {/* Zone 1: Single text element wordmark */}
          <button
            onClick={() => setActiveTab("landing")}
            className="text-base sm:text-lg font-bold tracking-tight text-white font-display whitespace-nowrap shrink-0 cursor-pointer hover:text-cyan-300 transition-colors"
          >
            VAYU VAIDYA · WALLMIKI
          </button>

          {/* Zone 2: 5 clean text navigation links */}
          <nav className="hidden md:flex items-center gap-6 text-xs sm:text-sm font-medium text-slate-400">
            <button
              onClick={() => setActiveTab("landing")}
              className={`whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                activeTab === "landing"
                  ? "text-white underline underline-offset-8 decoration-cyan-400"
                  : "hover:text-slate-100"
              }`}
            >
              Sanctuary
            </button>
            <button
              onClick={() => setActiveTab("holoprojector")}
              className={`whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                activeTab === "holoprojector"
                  ? "text-white underline underline-offset-8 decoration-cyan-400"
                  : "hover:text-slate-100"
              }`}
            >
              Holoprojector
            </button>
            <button
              onClick={() => setActiveTab("schizo-os")}
              className={`whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                activeTab === "schizo-os"
                  ? "text-white underline underline-offset-8 decoration-cyan-400"
                  : "hover:text-slate-100"
              }`}
            >
              schizoOS
            </button>
            <button
              onClick={() => setActiveTab("art-therapy")}
              className={`whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                activeTab === "art-therapy"
                  ? "text-white underline underline-offset-8 decoration-cyan-400"
                  : "hover:text-slate-100"
              }`}
            >
              Art Studio
            </button>
            <button
              onClick={() => setActiveTab("scoring")}
              className={`whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                activeTab === "scoring"
                  ? "text-white underline underline-offset-8 decoration-cyan-400"
                  : "hover:text-slate-100"
              }`}
            >
              Wellness Scoring
            </button>
            <button
              onClick={() => setActiveTab("therapies")}
              className={`hidden xl:inline-block whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                activeTab === "therapies"
                  ? "text-white underline underline-offset-8 decoration-cyan-400"
                  : "hover:text-slate-100"
              }`}
            >
              Pranayama Lab
            </button>
          </nav>

          {/* Zone 3: 2 primary actions */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setActiveTab("alexa")}
              className="hidden sm:inline-flex px-3.5 py-2 text-xs font-medium text-slate-200 bg-slate-900 border border-slate-700 rounded-lg hover:bg-slate-800 transition-colors whitespace-nowrap cursor-pointer"
            >
              Alexa & Cloud
            </button>
            <button
              onClick={() => setActiveTab("chat")}
              className="px-4 py-2 text-xs font-semibold text-slate-950 bg-cyan-400 rounded-lg hover:bg-cyan-300 transition-colors whitespace-nowrap cursor-pointer"
            >
              Open CBT Session
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 space-y-6">
        {/* Tab 0: Cinematic Landing Page */}
        {activeTab === "landing" && (
          <CinematicLanding
            onNavigate={(tab) => setActiveTab(tab)}
            onLaunchPrompt={handleTherapySelectedToChat}
            patientDrug={patientDrug}
            patientDose={patientDose}
          />
        )}

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

            {/* Alexa & AWS Lambda Quick Access Banner */}
            <div
              onClick={() => setActiveTab("alexa")}
              className="p-4 rounded-xl bg-gradient-to-r from-purple-950/40 via-slate-900/60 to-cyan-950/40 border border-purple-500/30 hover:border-purple-400/60 cursor-pointer transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-purple-500/20 text-purple-300 border border-purple-500/30 group-hover:bg-purple-500/30 transition-colors">
                  <Radio className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-semibold text-white group-hover:text-purple-300 transition-colors">
                      Amazon Alexa Skill & Render / AWS Cloud Deploy Hub
                    </h4>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-purple-500/20 text-purple-300 border border-purple-500/40">
                      "Alexa, open Vayu Vaidya"
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Test Wallmiki voice commands in the simulator, or deploy to Render (render.yaml) or AWS Lambda Docker with automated blueprints.
                  </p>
                </div>
              </div>
              <button className="px-3.5 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shrink-0 transition-colors">
                Launch Cloud & Alexa Hub
              </button>
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

        {/* Tab 8: Alexa Skill & AWS Lambda Container Hub */}
        {activeTab === "alexa" && <AlexaSkillSimulator />}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-800/80 bg-slate-950 px-4 py-6 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-semibold text-slate-200 font-display">Vayu Vaidya · Wallmiki</span>
            <span aria-hidden="true">·</span>
            <span>Milwaukee, WI (Dec 2017 – Present)</span>
            <span aria-hidden="true">·</span>
            <span>Directed by Dr. Bheemaiah Anil K</span>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={() => setActiveTab("landing")}
              className="hover:text-cyan-300 transition-colors cursor-pointer"
            >
              Sanctuary Home
            </button>
            <span aria-hidden="true">·</span>
            <button
              onClick={() => setActiveTab("java-bridge")}
              className="hover:text-cyan-300 transition-colors cursor-pointer"
            >
              Java 1.8 Bridge
            </button>
            <span aria-hidden="true">·</span>
            <a
              href="/privacy"
              target="_blank"
              rel="noreferrer"
              className="hover:text-cyan-300 transition-colors"
            >
              Privacy Notice
            </a>
            <span aria-hidden="true">·</span>
            <a
              href="http://www.vayuvaidya.info"
              target="_blank"
              rel="noreferrer"
              className="text-cyan-400 hover:underline"
            >
              www.vayuvaidya.info
            </a>
            <span aria-hidden="true">·</span>
            <span className="text-amber-300/90">Crisis Support: 988 Lifeline</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
