# Vayu Vaidya • Wallmiki System Architecture

This document provides an exhaustive technical analysis of the **Vayu Vaidya • Wallmiki E-Psychiatrist** full-stack web application.

---

## 1. High-Level Architecture Overview

The system is architected as a modern, reactive full-stack web platform combining a client-side single-page application (SPA) built with **React 19**, **TypeScript**, and **Tailwind CSS v4** with a robust server-side **Express** proxy on **Node.js**. 

The core design objectives are:
1. **Zero-Latency Somatic Interactivity**: Local client execution of audio frequency generation (Web Audio API) and gestural canvas painting to eliminate network latency during autonomic grounding.
2. **Server-Side API Key Protection**: The Google Gemini API key is retained exclusively on the Node.js server to prevent client-side credential exposure.
3. **Resilient Multitier Failover**: Multi-model fallback across `gemini-2.5-flash`, `gemini-3.8-flash`, and `gemini-3.1-flash-lite`, coupled with deterministic clinical safe fallbacks during network degradation.
4. **Clinical Interoperability Modeling**: Emulating hospital HIS/EHR Java 1.8 HyperThreaded pipeline telemetry for digital human holoprojector deployment.

---

## 2. Component Hierarchy & Data Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                   App.tsx                                   │
│  - Active Navigation Tab State                                              │
│  - Wallmiki Global Speech State                                             │
│  - Cross-Tab Telemetry (Patient Drug, Dose Mg, Active Therapies)            │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
        ┌──────────────────────────────┼──────────────────────────────┐
        ▼                              ▼                              ▼
┌───────────────────┐        ┌───────────────────┐        ┌───────────────────┐
│   HologramStage   │        │    TherapyChat    │        │   ArtTherapyLab   │
│ - 45° Prism Shader│        │ - Woebot CBT Loop │        │ - 8-Fold Mandala  │
│ - Web Audio Synth │        │ - Grounding Score │        │ - Bot Media Under-│
│ - Low Male Voice  │        │ - Media Triggers  │        │   lay Projections │
└───────────────────┘        └─────────┬─────────┘        │ - Cluster Analysis│
                                       │                  └───────────────────┘
        ┌──────────────────────────────┼──────────────────────────────┐
        ▼                              ▼                              ▼
┌───────────────────┐        ┌───────────────────┐        ┌───────────────────┐
│  SchizoOSExplorer │        │ DrugScoringEngine │        │ JavaBridgeExplorer│
│ - Autopilot Loop  │        │ - CPZ Equivalents │        │ - HyperThreads    │
│ - Manas/Chitta/   │        │ - Metabolic Risk  │        │   Simulation      │
│   Buddhi Circuits │        │ - Titration Chart │        │ - Prism Telemetry │
└───────────────────┘        └───────────────────┘        └───────────────────┘
```

---

## 3. Subsystem Breakdown

### 3.1. Web Audio & Acoustic Resonance Engine (`/src/utils/audioSynth.ts`)
The acoustic synthesizer operates directly in the browser using the **Web Audio API** (`AudioContext`), ensuring exact phase coherence and zero buffering latency:
* **Oscillator Node Types**: Configurable pure sine waves (`sine`) or soft tri-waveforms (`triangle`) for gentle harmonic warmth without harsh odd-order harmonics.
* **Resonant Grounding Drones**:
  * **108Hz**: Low sacred resonant bass tone corresponding to foundational stillness and vagal downregulation.
  * **432Hz**: Natural acoustic overtone fostering parasympathetic homeostasis.
  * **528Hz**: Solfeggio "transformation" tone used during active cognitive restructuring.
* **Binaural Delta/Theta Carrier**: Dual-channel frequency shift (e.g., 432Hz in left ear, 436Hz in right ear) to entrain 4Hz theta brainwaves for deep somatic calming.
* **Web Speech API Configuration**: Customized voice filtering prioritizing low-pitch male formants (rate: 0.88, pitch: 0.72) to generate the signature "Wallmiki" baritone sanctuary presence.

---

### 3.2. Interactive Canvas & State Pod Automatism Engine (`/src/components/ArtTherapyLab.tsx`)
The creative studio utilizes an HTML5 2D rendering context optimized for responsive gestural feedback:
* **Radial 8-Fold Mandala Symmetry Engine**:
  * For each line segment `(x1, y1) -> (x2, y2)`, coordinates are translated relative to canvas center `(cx, cy)`.
  * Segments are rotated across `i * (2π / 8)` radians and mirrored across radial axes to achieve bilateral sacred mandala reflections.
* **Undo/Redo Snapshot Buffer**:
  * Ring buffer of `ImageData` snapshots captured via `ctx.getImageData()` prior to every stroke sequence.
* **Bot Media Underlay Projection Pipeline**:
  * Dynamically renders procedural mandalas (Sri Yantra, Bodhichitta Lotus, Breath Torus) or circuit topologies directly onto the canvas buffer.
  * Supports real-time underlay opacity blending (`0.1` to `1.0`), enabling users to trace or paint over therapeutic motifs.
* **Color Cluster Analysis**:
  * Sub-samples canvas pixel array (`Uint8ClampedArray`) to extract color frequencies.
  * Categorizes pixels into symbolic therapeutic clusters (*Vayu Cyan*, *Lotus Rose*, *Buddhi Indigo*, *Prana Emerald*).
  * Computes gestural automatism indices and catharsis ratings.

---

### 3.3. Conversational E-Psychiatrist Backend (`server.ts`)
The server exposes RESTful endpoints and brokers communication with the Gemini API:
* **Gemini SDK**: Uses `@google/genai` with `GoogleGenAI` initialized lazily with `process.env.GEMINI_API_KEY`.
* **Multi-Model Cascade**:
  1. Primary attempt: `gemini-2.5-flash`
  2. Fallback 1: `gemini-3.8-flash`
  3. Fallback 2: `gemini-3.1-flash-lite`
  4. Deterministic Clinical Fallback: If all models encounter rate limits or network issues, contextual clinical responses tailored to the therapy mode are delivered immediately.
* **Vite Middleware Integration**:
  * In development mode (`NODE_ENV !== "production"`), Vite middleware is attached to Express to deliver fast hot reload.
  * In production, the backend serves pre-compiled static files from `dist/` and acts as a SPA fallback.

---

## 4. Production Build & Deployment Pipeline

* **Client Compilation**: Handled via `vite build`, outputting hashed assets and index.html to `dist/`.
* **Server Compilation**: Bundled via `esbuild server.ts --bundle --platform=node --format=cjs --packages=external --sourcemap --outfile=dist/server.cjs`.
* **Container Port**: Strictly bound to `PORT 3000` on host `0.0.0.0` for Cloud Run reverse-proxy compatibility.
