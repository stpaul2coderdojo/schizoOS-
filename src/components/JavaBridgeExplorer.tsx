import React, { useState, useEffect } from "react";
import {
  Cpu,
  Server,
  Layers,
  FileCode,
  CheckCircle,
  Copy,
  Terminal,
  Activity,
  Globe,
  MapPin,
  Calendar,
  ExternalLink
} from "lucide-react";
import { SystemStatus } from "../types";

export const JavaBridgeExplorer: React.FC = () => {
  const [systemStatus, setSystemStatus] = useState<SystemStatus | null>(null);
  const [activeCodeTab, setActiveCodeTab] = useState<"digitalHuman" | "geminiBridge" | "scoringAlgo" | "holoprojector">("digitalHuman");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetch("/api/system-status")
      .then((res) => res.json())
      .then((data) => setSystemStatus(data))
      .catch((err) => console.error("Error fetching system status:", err));
  }, []);

  const codeSnippets = {
    digitalHuman: `/**
 * Vayu Vaidya - Mother Divine Digital Human Interface
 * Package: info.vayuvaidya.psychiatry.hologram
 * Platform: Java 1.8 (SE8) / Eclipse IDE / Windows 10 & Cloud
 * Milwaukee, WI - December 2017 to Present
 */
package info.vayuvaidya.psychiatry.hologram;

import java.util.concurrent.*;
import javax.sound.sampled.*;

public class MotherDivineDigitalHuman {
    private static final int CORE_THREADS = 8;
    private static final int MAX_THREADS = 16;
    private final ExecutorService hyperThreadPool;
    private final HoloPrismRenderer prismRenderer;
    private final AudioWaveSynthesizer speechSynth;

    public MotherDivineDigitalHuman() {
        // HyperThreads pool for 60FPS holographic 45-degree prism rendering
        this.hyperThreadPool = new ThreadPoolExecutor(
            CORE_THREADS,
            MAX_THREADS,
            60L, TimeUnit.SECONDS,
            new LinkedBlockingQueue<Runnable>(64),
            new CustomThreadFactory("HoloRender-Worker")
        );
        this.prismRenderer = new HoloPrismRenderer(45.0f, 1450); // 45° pyramid prism
        this.speechSynth = new AudioWaveSynthesizer(432.0f); // 432Hz baseline
    }

    public CompletableFuture<HoloFrame> renderFrameAsync(AudioPacket audio) {
        return CompletableFuture.supplyAsync(() -> {
            // Process facial mesh deformation and phoneme lip-sync
            MeshDeformation mesh = prismRenderer.computeFacialMudra(audio);
            return prismRenderer.projectQuadPyramid(mesh);
        }, hyperThreadPool);
    }
}`,
    geminiBridge: `/**
 * Google Gemini API Client & Alternative Therapy Customizer
 * Package: info.vayuvaidya.psychiatry.gemini
 * Platform: Java 1.8 / Eclipse IDE / Cloud Computing
 */
package info.vayuvaidya.psychiatry.gemini;

import java.io.*;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.StandardCharsets;

public class GeminiTherapyBridge {
    private final String geminiEndpoint;
    private final String apiKey;

    public GeminiTherapyBridge(String apiKey) {
        this.geminiEndpoint = "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent";
        this.apiKey = apiKey;
    }

    public String consultEPsychiatrist(String userUtterance, TherapyCustomizationScript script) throws Exception {
        URL url = new URL(geminiEndpoint + "?key=" + this.apiKey);
        HttpURLConnection conn = (HttpURLConnection) url.openConnection();
        conn.setRequestMethod("POST");
        conn.setRequestProperty("Content-Type", "application/json");
        conn.setRequestProperty("User-Agent", "aistudio-build-vayuvaidya");
        conn.setDoOutput(true);

        // Inject customized Vayu Vaidya alternative therapy instructions
        String payload = buildJsonPayload(userUtterance, script.getPromptDirective());
        try (OutputStream os = conn.getOutputStream()) {
            os.write(payload.getBytes(StandardCharsets.UTF_8));
        }

        return parseGeminiResponse(conn.getInputStream());
    }
}`,
    scoringAlgo: `/**
 * Drug Therapy Replacement & Alternative Efficacy Scoring Matrix
 * Package: info.vayuvaidya.psychiatry.scoring
 * Platform: Java 1.8 / Eclipse IDE
 */
package info.vayuvaidya.psychiatry.scoring;

import java.util.List;

public class TherapyScoringAlgorithm {

    public static ScoringResult computeReplacementIndex(
            AntipsychoticDrug drug,
            double dailyDoseMg,
            int durationWeeks,
            List<SideEffect> sideEffects,
            List<AlternativeTherapy> alternativeTherapies,
            double baselinePanss) {

        // 1. Calculate Drug Burden (CPZ Equivalence + Adverse Effects)
        double cpzEq = dailyDoseMg * drug.getCpzMultiplier();
        double doseRatio = Math.min(dailyDoseMg / drug.getMaxDose(), 1.5);
        double drugBurdenScore = (doseRatio * 50.0) + (sideEffects.size() * 12.0);

        // 2. Calculate Alternative Therapy Efficacy Matrix
        double totalAltEfficacy = 0;
        for (AlternativeTherapy therapy : alternativeTherapies) {
            totalAltEfficacy += therapy.getWeight() * therapy.getComplianceRate();
        }

        // 3. Clinical Replacement Readiness
        double readiness = (totalAltEfficacy * 0.70) - ((baselinePanss / 100.0) * 40.0) 
                         + ((100.0 - drugBurdenScore) * 0.20);
        readiness = Math.max(10.0, Math.min(readiness, 95.0));

        TitrationPhase phase = TitrationPhase.determine(readiness, baselinePanss);
        return new ScoringResult(drugBurdenScore, totalAltEfficacy, readiness, phase);
    }
}`,
    holoprojector: `/**
 * Optical Holoprojector Equipment Driver (JNI / Serial Driver)
 * Package: info.vayuvaidya.hardware.optics
 * Platform: Windows 10 & Cloud Bridge
 */
package info.vayuvaidya.hardware.optics;

public class HoloprojectorHardwareDriver {
    private final float prismAngle; // Standard 45.0 degrees
    private int luxOutput;          // 1200 - 2000 Lumens
    private boolean mirrorQuadActive;

    public HoloprojectorHardwareDriver() {
        this.prismAngle = 45.0f;
        this.luxOutput = 1450;
        this.mirrorQuadActive = true;
    }

    public native void calibratePyramidApex(float x, float y, float z);
    public native void modulateBeamIntensity(int lumens);
    public native void syncRefreshRate(int targetFps);
}`,
    schizoOS: `/**
 * schizoOS Cognitive Architecture & State Transition Machine
 * Package: info.vayuvaidya.psychiatry.schizoos
 * Invented by: Dr. Bheemaiah Anil K, Director of Vayu Vaidya
 * Platform: Java 1.8 / Eclipse IDE / Windows 10 & Cloud
 */
package info.vayuvaidya.psychiatry.schizoos;

import java.util.*;

public class SchizoOSStateMachine {

    public enum ConsciousnessPlane {
        AUTOPILOT, // Subconscious Samskara reactive loops (Default Mode Network)
        MANAS,     // Sensory gateway & immediate visceral instincts
        CHITTA,    // Memory lake of stored impressions (vasanas)
        BUDDHI,    // Higher discernment, the mindful witnessing intellect
        BODHICHITTA // Awakened heart of universal compassionate safety
    }

    public static class CognitiveStateNode {
        private final String stateId;
        private final ConsciousnessPlane plane;
        private final String semanticTag;
        private double autonomicValence;

        public CognitiveStateNode(String stateId, ConsciousnessPlane plane, String semanticTag) {
            this.stateId = stateId;
            this.plane = plane;
            this.semanticTag = semanticTag;
        }

        public boolean isAutopilotTrap() {
            return this.plane == ConsciousnessPlane.AUTOPILOT;
        }
    }

    public static class CircuitBreakerTransition {
        public static CognitiveStateNode tripBreaker(CognitiveStateNode autopilotNode, String mindfulnessTrigger) {
            // Decouple Chitta impression from immediate motor/affective reaction
            System.out.println("[schizoOS] Circuit breaker engaged via: " + mindfulnessTrigger);
            return new CognitiveStateNode("node-buddhi-ground", ConsciousnessPlane.BUDDHI, "Mindful Witness Anchor");
        }
    }
}`,
  };

  const copyCode = () => {
    navigator.clipboard.writeText(codeSnippets[activeCodeTab]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Project Heritage & Architecture Header */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/20 border border-slate-800 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-medium bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                Java 1.8 & Eclipse Architecture
              </span>
              <span className="text-xs text-slate-400">HyperThreads • Windows 10 • Cloud</span>
            </div>
            <h2 className="text-xl font-bold text-slate-100 font-display">
              Vayu Vaidya Project Infrastructure & Java Interface Bridge
            </h2>
          </div>

          <div className="flex items-center gap-3 text-xs font-mono text-slate-300">
            <div className="flex items-center gap-1.5 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
              <MapPin className="w-3.5 h-3.5 text-red-400" />
              <span>Milwaukee, WI</span>
            </div>
            <div className="flex items-center gap-1.5 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
              <Calendar className="w-3.5 h-3.5 text-cyan-400" />
              <span>Dec 2017 to Present</span>
            </div>
            <a
              href="http://www.vayuvaidya.info"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 px-3 py-1.5 rounded-xl border border-cyan-500/30 transition-colors"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>vayuvaidya.info</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        <p className="text-xs text-slate-300 max-w-3xl leading-relaxed">
          The E-Psychiatrist is functional and used for treating Schizophrenia on http://www.vayuvaidya.info.
          Core systems integrate Java 1.8 HyperThreading routines with Google Gemini API natural language
          processing, projecting Mother Divine via 45° optical pyramid holoprojector hardware, coupled with
          proprietary algorithms scoring drug replacement and alternative therapy efficacy.
        </p>
      </div>

      {/* Hardware & HyperThreading Live Status Cards */}
      {systemStatus && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Java Runtime & HyperThreads */}
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <Cpu className="w-4 h-4 text-cyan-400" />
                HyperThreading Pool
              </span>
              <span className="font-mono text-emerald-400">
                {systemStatus.platform.hyperThreads.threadEfficiency}
              </span>
            </div>
            <div className="text-xl font-bold font-mono text-slate-100">
              {systemStatus.platform.hyperThreads.activeThreads} / {systemStatus.platform.hyperThreads.maxPoolSize} Threads
            </div>
            <div className="text-[11px] text-slate-400 font-mono">
              Runtime: Java 1.8 SE (Eclipse IDE)
            </div>
          </div>

          {/* Card 2: Holoprojector Hardware */}
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-amber-400" />
                Optical Prism Stage
              </span>
              <span className="font-mono text-amber-400">
                {systemStatus.platform.holoprojectorHardware.projectionAngle}
              </span>
            </div>
            <div className="text-xl font-bold font-mono text-slate-100">
              {systemStatus.platform.holoprojectorHardware.luxOutput} Lumens
            </div>
            <div className="text-[11px] text-slate-400 font-mono">
              Refraction: 4-Faced Pyramid
            </div>
          </div>

          {/* Card 3: Digital Human Avatar Engine */}
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-emerald-400" />
                Avatar Render Loop
              </span>
              <span className="font-mono text-emerald-400">
                {systemStatus.platform.digitalHumanEngine.frameRate} FPS
              </span>
            </div>
            <div className="text-xl font-bold text-slate-100">
              {systemStatus.platform.digitalHumanEngine.avatarId}
            </div>
            <div className="text-[11px] text-slate-400 font-mono">
              Speech Latency: {systemStatus.platform.digitalHumanEngine.speechSyncLatencyMs}ms
            </div>
          </div>

          {/* Card 4: NLP & Scoring Engine */}
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <Server className="w-4 h-4 text-purple-400" />
                NLP Engine
              </span>
              <span className="font-mono text-purple-400">Cloud Synced</span>
            </div>
            <div className="text-xl font-bold text-slate-100">
              Google Gemini API
            </div>
            <div className="text-[11px] text-slate-400 font-mono">
              {systemStatus.platform.nlpEngine.drugScoringAlgorithms}
            </div>
          </div>
        </div>
      )}

      {/* Code Inspector: Real Java 1.8 Code Developed for the Project */}
      <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <FileCode className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-semibold text-slate-200">
              Java 1.8 Source Modules (Eclipse IDE Workspace)
            </h3>
          </div>

          {/* Code Tabs */}
          <div className="flex items-center p-1 rounded-lg bg-slate-950 border border-slate-800 text-xs">
            <button
              onClick={() => setActiveCodeTab("digitalHuman")}
              className={`px-3 py-1.5 rounded transition-all ${
                activeCodeTab === "digitalHuman"
                  ? "bg-cyan-500/20 text-cyan-300 font-medium"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              MotherDivineDigitalHuman.java
            </button>
            <button
              onClick={() => setActiveCodeTab("geminiBridge")}
              className={`px-3 py-1.5 rounded transition-all ${
                activeCodeTab === "geminiBridge"
                  ? "bg-cyan-500/20 text-cyan-300 font-medium"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              GeminiTherapyBridge.java
            </button>
            <button
              onClick={() => setActiveCodeTab("scoringAlgo")}
              className={`px-3 py-1.5 rounded transition-all ${
                activeCodeTab === "scoringAlgo"
                  ? "bg-cyan-500/20 text-cyan-300 font-medium"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              TherapyScoringAlgorithm.java
            </button>
            <button
              onClick={() => setActiveCodeTab("holoprojector")}
              className={`px-3 py-1.5 rounded transition-all ${
                activeCodeTab === "holoprojector"
                  ? "bg-cyan-500/20 text-cyan-300 font-medium"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              HoloprojectorDriver.java
            </button>
            <button
              onClick={() => setActiveCodeTab("schizoOS" as any)}
              className={`px-3 py-1.5 rounded transition-all ${
                activeCodeTab === ("schizoOS" as any)
                  ? "bg-indigo-500/20 text-indigo-300 font-medium"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              SchizoOSStateMachine.java
            </button>
          </div>

          <button
            onClick={copyCode}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-300 hover:text-cyan-300 transition-colors"
          >
            {copied ? <CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? "Copied" : "Copy Code"}</span>
          </button>
        </div>

        {/* Code Box */}
        <div className="relative rounded-xl bg-slate-950 border border-slate-800/80 p-4 font-mono text-xs overflow-x-auto text-cyan-300 max-h-96">
          <pre className="leading-relaxed">
            {codeSnippets[activeCodeTab]}
          </pre>
        </div>
      </div>
    </div>
  );
};
