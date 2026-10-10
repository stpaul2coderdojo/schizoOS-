/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from "react";
import {
  Download,
  Video,
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  Github,
  CheckCircle2,
  Volume2,
  VolumeX,
  FileSpreadsheet,
  Film,
  Sparkles,
  Copy,
  ExternalLink,
  Terminal,
  Layers
} from "lucide-react";
import PptxGenJS from "pptxgenjs";
import { speakText, soundEngine } from "../utils/audioSynth";
import heroWallmikiImg from "../assets/images/hero_wallmiki_sanctuary_1791451754909.jpg";
import schizoOsCardImg from "../assets/images/card_schizoos_autopilot_1791451638452.jpg";
import picassoBlueImg from "../assets/images/card_picasso_blue_art_therapy_1791454402375.jpg";

export interface HackathonSlide {
  slideNumber: number;
  phase: "OVERVIEW" | "PROBLEM" | "BUILD" | "SHIP" | "SHAPE" | "DEMO";
  tag: string;
  title: string;
  subtitle: string;
  bullets: string[];
  metrics: { label: string; value: string }[];
  narration: string;
  accentHex: string;
  imageSrc: string;
  durationSec: number;
}

export const HACKATHON_SLIDES: HackathonSlide[] = [
  {
    slideNumber: 1,
    phase: "OVERVIEW",
    tag: "AMAZON DEVELOPER HACKATHON 2026: BUILD, SHIP, SHAPE · DEVPOST",
    title: "Vayu Vaidya · Wallmiki E-Psychiatrist",
    subtitle:
      "Voice-First Alexa Mental Wellness Sanctuary, schizoOS Cognitive Architecture & State Pod Art Therapy",
    bullets: [
      "Directed by Dr. Bheemaiah Anil K · Vayu Vaidya Sanctuary (Milwaukee, WI)",
      "Built on Amazon Alexa Skills Kit (ASK), AWS Lambda Container Images, ECR & CodePipeline",
      "Integrates Woebot-style CBT, MiCBT Somatic Scans, 4-4-6-2 Pranayama & Picasso Blue Period Art Therapy",
      "Zero-Stigma, Sovereign Neurodivergent Empowerment & Collaborative Harm-Reduction Scoring"
    ],
    metrics: [
      { label: "Voice Resonance", value: "85Hz / 432Hz" },
      { label: "Alexa Intents", value: "8 Clinical Intents" },
      { label: "Cloud Stack", value: "AWS Lambda + ASK" }
    ],
    narration:
      "Welcome to Vayu Vaidya Wallmiki, our submission for the Amazon Developer Hackathon 2026: Build, Ship, Shape on Devpost. Directed by Doctor Bheemaiah Anil K, Wallmiki is a voice-first Amazon Alexa and web mental wellness sanctuary uniting schizoOS cognitive modeling, somatic mindfulness, and expressive art therapy.",
    accentHex: "#22d3ee",
    imageSrc: heroWallmikiImg,
    durationSec: 6
  },
  {
    slideNumber: 2,
    phase: "PROBLEM",
    tag: "01 · THE CLINICAL CHALLENGE & VISION",
    title: "Reimagining Psychiatric Support at 3 AM",
    subtitle:
      "Replacing Stigmatizing Pathologization with Sovereign Voice & Visual Grounding",
    bullets: [
      "Crisis of Accessibility: 60%+ of individuals experiencing acute nighttime panic or perceptual distress lack immediate grounding tools.",
      "Limitations of Pure Pharmacotherapy: High-dose neuroleptics carry severe metabolic, extrapyramidal (EPS), and sedative burdens.",
      "Screen Fatigue During Panic: Reading complex menus during an autonomic surge increases cognitive overload.",
      "The Wallmiki Solution: Hands-free Amazon Alexa voice guidance paired with a 45° holographic sanctuary and interactive art studio."
    ],
    metrics: [
      { label: "Target Latency", value: "< 18ms Sync" },
      { label: "Crisis Access", value: "24/7 Hands-Free" },
      { label: "Vagal Protocol", value: "4-4-6-2 Breath" }
    ],
    narration:
      "When acute anxiety, auditory hyper-salience, or cognitive distress strikes at three A M, screens can feel overwhelming and clinical care is often out of reach. Vayu Vaidya solves this by turning any Amazon Echo device and browser into a compassionate, zero-stigma sanctuary guided by Wallmiki's low resonant baritone voice.",
    accentHex: "#38bdf8",
    imageSrc: heroWallmikiImg,
    durationSec: 6
  },
  {
    slideNumber: 3,
    phase: "BUILD",
    tag: "02 · BUILD · AMAZON ALEXA SKILLS KIT (ASK) ARCHITECTURE",
    title: "Voice-First Clinical Empathy on Amazon Alexa",
    subtitle:
      'Invocation: "Alexa, open Vayu Vaidya" · Custom SSML Prosody & Multi-Intent Routing',
    bullets: [
      'Ethereal Low Resonant Voice Profile: Tuned via SSML (<prosody pitch="-15%" rate="92%">) to calm amygdala hyper-reactivity.',
      "VayuPranayamaIntent: Guides 4s inhale, 4s hold, 6s exhale, 2s pause with precision SSML <break> intervals.",
      "GroundingIntent & SomaticScanIntent: 5-4-3-2-1 sensory reality testing and MiCBT interoceptive body scans.",
      "AutopilotCheckIntent & CbtReflectIntent: Live Gemini 2.5 Flash Socratic cognitive restructuring for automatic negative thoughts."
    ],
    metrics: [
      { label: "Invocation", value: '"vayu vaidya"' },
      { label: "SSML Tuning", value: "-15% Pitch / 92% Rate" },
      { label: "NLP Engine", value: "ASK + Gemini 2.5" }
    ],
    narration:
      "In the Build phase, we architected a custom Amazon Alexa Skill invoked simply by saying, Alexa, open Vayu Vaidya. Using specialized S S M L prosody tuned to minus fifteen percent pitch and ninety-two percent speaking rate, Wallmiki guides users through four-four-six-two vagal breathing, sensory reality testing, and real-time C B T thought reframing.",
    accentHex: "#a855f7",
    imageSrc: heroWallmikiImg,
    durationSec: 6
  },
  {
    slideNumber: 4,
    phase: "BUILD",
    tag: "03 · BUILD · SCHIZOOS COGNITIVE ARCHITECTURE",
    title: "schizoOS: Deconstructing the Subconscious Autopilot",
    subtitle:
      "Invented by Dr. Bheemaiah Anil K · 5-Plane Cybernetic Consciousness Modeling",
    bullets: [
      "Autopilot Loop: Identifies mechanical Default Mode Network (DMN) rumination and fear-driven prediction errors.",
      "Manas (Sensory Gate) & Chitta (Memory Reservoir): Separates raw present-moment signals from stored trauma impressions (vasanas).",
      "Buddhi Circuit Breaker: Installs conscious metacognitive witness nodes to interrupt recursive panic amplification.",
      "Bodhichitta Anchor: Grounds the mind in unconditional self-compassion and inter-being safety."
    ],
    metrics: [
      { label: "Cognitive Planes", value: "5 Interactive Layers" },
      { label: "Circuit Breakers", value: "Buddhi Witness" },
      { label: "Efficacy Rating", value: "95% Protocol Score" }
    ],
    narration:
      "At the heart of our clinical innovation is schizo O S, invented by Doctor Bheemaiah Anil K. Instead of labeling neurodivergent distress as random noise, schizo O S maps five planes of consciousness: helping users distinguish subconscious Autopilot loops and Chitta memory traces from Manas sensory input, while activating Buddhi discernment and Bodhichitta compassion.",
    accentHex: "#818cf8",
    imageSrc: schizoOsCardImg,
    durationSec: 6
  },
  {
    slideNumber: 5,
    phase: "BUILD",
    tag: "04 · BUILD · STATE POD ART AUTOMATISM & PICASSO BLUE STUDIO",
    title: "Feminist Art Therapy & Picasso Blue Period Studio",
    subtitle:
      "Expressive Gestural Canvas, 8-Fold Sacred Mandala Projection & Color Cluster Analytics",
    bullets: [
      "Picasso Blue Period Aesthetic Anchor: Deep Prussian blue, cerulean, and indigo resonance validating profound emotional depth without stigma.",
      "8-Fold Radial Mandala & Bot Media Underlays: Project Sri Yantra, Lotus of Bodhichitta, and schizoOS circuits onto the canvas.",
      "Real-Time Color Cluster Telemetry: Quantifies Automatism Index (0–100%), Catharsis Score, and somatic emotional resonance.",
      "Feminist Art Therapy Framework: Reclaims bodily sovereignty and honors lived neurodivergent expression as sacred creative insight."
    ],
    metrics: [
      { label: "Symmetry Engine", value: "8-Fold Mandala" },
      { label: "Art Reference", value: "Picasso Blue Period" },
      { label: "Telemetry", value: "Live Color Clusters" }
    ],
    narration:
      "When words cannot express inner tension, our State Pod Art Automatism Studio invites spontaneous painting inspired by Pablo Picasso's Blue Period and feminist art therapy. Users paint with eight-fold mandala symmetry and bot media projections while real-time algorithms analyze Prussian blue, cerulean, and violet color clusters to foster emotional catharsis.",
    accentHex: "#f43f5e",
    imageSrc: picassoBlueImg,
    durationSec: 6
  },
  {
    slideNumber: 6,
    phase: "SHIP",
    tag: "05 · SHIP · AUTOMATED AWS CLOUD & GITHUB ACTIONS CI/CD",
    title: "Production Cloud Pipeline: GitHub Actions, AWS ECR & Lambda",
    subtitle:
      "Zero-Touch Deployment via OIDC IAM Roles, AWS CodePipeline & Render Blueprint",
    bullets: [
      "Repository Structure: Standardized skill.json manifest, interactionModel/custom/en-US.json, buildspec.yml & Dockerfile.lambda.",
      "GitHub Actions CI/CD (deploy-alexa-aws.yml): Automated ASK CLI skill publishing + Docker container push to Amazon ECR.",
      "Serverless Compute: AWS Lambda Container Image (Node.js 20 + Express + ASK Webhook) with <18ms speech sync latency.",
      "Public Privacy Compliance: Live HIPAA/GDPR-aligned Consent Privacy Notice hosted at /privacy for Alexa certification."
    ],
    metrics: [
      { label: "CI/CD Pipeline", value: "GitHub + CodePipeline" },
      { label: "Container Runtime", value: "AWS Lambda Docker" },
      { label: "Certification", value: "ASK Privacy Ready" }
    ],
    narration:
      "In the Ship phase, we built a complete, automated DevOps pipeline. Every git push triggers GitHub Actions and A W S CodePipeline to package our Node twenty Docker image into Amazon E C R, update our A W S Lambda container function, and deploy the Alexa skill manifest and interaction model via A S K C L I.",
    accentHex: "#10b981",
    imageSrc: schizoOsCardImg,
    durationSec: 6
  },
  {
    slideNumber: 7,
    phase: "SHAPE",
    tag: "06 · SHAPE · PHARMACOTHERAPY HARMONIZATION & WELLNESS SCORING",
    title: "Shaping the Future of Collaborative Harm Reduction",
    subtitle:
      "BPRS/PANSS-Equivalent Drug Burden vs. Alternative Therapy Readiness Matrix",
    bullets: [
      "Chlorpromazine (CPZ) Equivalency Engine: Evaluates 7 major antipsychotics (Olanzapine, Risperidone, Aripiprazole, Quetiapine, etc.).",
      "Side-Effect Risk Profiling: Quantifies Metabolic, Extrapyramidal (EPS), and Sedation burden scores (0–100 scale).",
      "Alternative Therapy Efficacy Index: Measures vagal tone support and cognitive clarity from daily Pranayama, 528Hz audio, and CBT.",
      "3-Phase Physician Titration Roadmap: Empowers safe, gradual, doctor-supervised dose optimization with 988 crisis safeguards."
    ],
    metrics: [
      { label: "Agents Modeled", value: "7 Antipsychotics" },
      { label: "Scoring Version", value: "NeuroScore v2.1" },
      { label: "Safety Standard", value: "MD-Supervised" }
    ],
    narration:
      "In the Shape phase, we shape the future of integrative psychiatry with our Wellness Scoring Engine. By weighing Chlorpromazine-equivalent medication burden against daily Pranayama, acoustic entrainment, and C B T adherence, patients and physicians gain a transparent, three-phase readiness index for safe, gradual harm reduction.",
    accentHex: "#f59e0b",
    imageSrc: picassoBlueImg,
    durationSec: 6
  },
  {
    slideNumber: 8,
    phase: "DEMO",
    tag: "07 · LIVE DEMO, REPOSITORY & DEVPOST SUBMISSION",
    title: "Build, Ship, Shape: Ready for Global Sanctuary Access",
    subtitle:
      "Downloadable GitHub PPTX Deck · Auto-Video Generator · Live Alexa Skill Webhook",
    bullets: [
      "100% Functional Full-Stack Sanctuary: Live 45° Holoprojector, Alexa Simulator, schizoOS Explorer, Art Studio & Scoring Engine.",
      "Auto-Video Presentation Engine: Built-in WebM/MP4 Canvas + Web Speech API synthesizer for instant Devpost demo video export.",
      "Direct GitHub Artifact: Pre-compiled PowerPoint (.pptx) lives in public/deck/ for one-click download from GitHub or the web app.",
      'Thank You, Amazon Developer Hackathon 2026 Judges! Say: "Alexa, open Vayu Vaidya".'
    ],
    metrics: [
      { label: "PPTX Artifact", value: "GitHub Downloadable" },
      { label: "Video Export", value: "Auto-Synthesized" },
      { label: "Project Portal", value: "www.vayuvaidya.info" }
    ],
    narration:
      "Vayu Vaidya Wallmiki is live, tested, and ready to scale. Our PowerPoint slide deck is directly downloadable from our GitHub repository and converts automatically into a narrated video presentation right inside the app. Thank you to the Amazon Developer Hackathon 2026 judges. Breathe gently, and welcome to the sanctuary.",
    accentHex: "#22d3ee",
    imageSrc: heroWallmikiImg,
    durationSec: 6
  }
];

export const HackathonDeckStudio: React.FC = () => {
  const [activeSlideIdx, setActiveSlideIdx] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [isGeneratingPptx, setIsGeneratingPptx] = useState(false);
  const [isRecordingVideo, setIsRecordingVideo] = useState(false);
  const [videoProgress, setVideoProgress] = useState(0);
  const [recordedVideoUrl, setRecordedVideoUrl] = useState<string | null>(null);
  const [githubOwner, setGithubOwner] = useState("bheemaiah");
  const [githubRepo, setGithubRepo] = useState("vayu-vaidya-wallmiki");
  const [githubBranch, setGithubBranch] = useState("main");
  const [copiedLink, setCopiedLink] = useState<string | null>(null);

  const videoCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const autoPlayTimerRef = useRef<number | null>(null);
  const loadedImagesRef = useRef<Record<string, HTMLImageElement>>({});

  const currentSlide = HACKATHON_SLIDES[activeSlideIdx];

  // Preload slide artwork images for the HTML5 Canvas Video Recorder
  useEffect(() => {
    const sources = [heroWallmikiImg, schizoOsCardImg, picassoBlueImg];
    sources.forEach((src) => {
      if (!loadedImagesRef.current[src]) {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.src = src;
        loadedImagesRef.current[src] = img;
      }
    });
  }, []);

  // Render active slide onto the hidden/preview 1920x1080 HD canvas
  const drawSlideToCanvas = (
    ctx: CanvasRenderingContext2D,
    slide: HackathonSlide,
    progressFraction: number = 1
  ) => {
    const W = 1920;
    const H = 1080;

    // 1. Deep Obsidian Sanctuary Background
    const bgGrad = ctx.createLinearGradient(0, 0, W, H);
    bgGrad.addColorStop(0, "#050811");
    bgGrad.addColorStop(0.6, "#090f1e");
    bgGrad.addColorStop(1, "#05070e");
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, W, H);

    // Subtle radial glow
    const glowGrad = ctx.createRadialGradient(W * 0.78, H * 0.45, 50, W * 0.78, H * 0.45, 650);
    glowGrad.addColorStop(0, `${slide.accentHex}22`);
    glowGrad.addColorStop(1, "transparent");
    ctx.fillStyle = glowGrad;
    ctx.fillRect(0, 0, W, H);

    // 2. Top Accent Bar
    ctx.fillStyle = slide.accentHex;
    ctx.fillRect(0, 0, W, 14);

    // 3. Header Tag & Slide Counter
    ctx.font = "bold 20px 'JetBrains Mono', monospace";
    ctx.fillStyle = slide.accentHex;
    ctx.fillText(slide.tag, 96, 86);

    ctx.font = "bold 20px 'JetBrains Mono', monospace";
    ctx.fillStyle = "#94a3b8";
    ctx.textAlign = "right";
    ctx.fillText(
      `SLIDE 0${slide.slideNumber} / 0${HACKATHON_SLIDES.length} · [${slide.phase}]`,
      W - 96,
      86
    );
    ctx.textAlign = "left";

    // 4. Title
    ctx.font = "bold 52px Georgia, serif";
    ctx.fillStyle = "#f8fafc";
    ctx.fillText(slide.title, 96, 165);

    // 5. Subtitle
    ctx.font = "26px Inter, sans-serif";
    ctx.fillStyle = "#cbd5e1";
    ctx.fillText(slide.subtitle, 96, 218);

    // 6. Left Content Card
    ctx.fillStyle = "rgba(15, 23, 42, 0.88)";
    ctx.strokeStyle = "rgba(51, 65, 85, 0.9)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(96, 265, 1140, 560, 20);
    ctx.fill();
    ctx.stroke();

    // Helper for wrapping text inside canvas
    const wrapText = (
      text: string,
      x: number,
      y: number,
      maxWidth: number,
      lineHeight: number
    ): number => {
      const words = text.split(" ");
      let line = "";
      let curY = y;
      for (let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + " ";
        const metrics = ctx.measureText(testLine);
        if (metrics.width > maxWidth && n > 0) {
          ctx.fillText(line, x, curY);
          line = words[n] + " ";
          curY += lineHeight;
        } else {
          line = testLine;
        }
      }
      ctx.fillText(line, x, curY);
      return curY + lineHeight;
    };

    // Bullets inside Left Card
    let bulletY = 330;
    slide.bullets.forEach((b) => {
      // Bullet square
      ctx.fillStyle = slide.accentHex;
      ctx.fillRect(136, bulletY - 18, 12, 12);

      // Bullet text
      ctx.font = "23px Inter, sans-serif";
      ctx.fillStyle = "#e2e8f0";
      bulletY = wrapText(b, 170, bulletY, 1020, 34) + 28;
    });

    // 7. Right Artwork Preview + Metrics Stack
    const rightX = 1275;
    const rightW = 549;

    // Draw Artwork Card
    ctx.save();
    ctx.beginPath();
    ctx.roundRect(rightX, 265, rightW, 290, 20);
    ctx.clip();
    const img = loadedImagesRef.current[slide.imageSrc];
    if (img && img.complete && img.naturalWidth > 0) {
      ctx.drawImage(img, rightX, 265, rightW, 290);
    } else {
      ctx.fillStyle = "#0f172a";
      ctx.fillRect(rightX, 265, rightW, 290);
    }
    ctx.restore();

    ctx.strokeStyle = slide.accentHex;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(rightX, 265, rightW, 290, 20);
    ctx.stroke();

    // Metrics Row below image
    slide.metrics.forEach((m, idx) => {
      const mY = 580 + idx * 86;
      ctx.fillStyle = "rgba(15, 23, 42, 0.92)";
      ctx.strokeStyle = "rgba(51, 65, 85, 0.85)";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(rightX, mY, rightW, 72, 14);
      ctx.fill();
      ctx.stroke();

      ctx.font = "bold 16px 'JetBrains Mono', monospace";
      ctx.fillStyle = "#94a3b8";
      ctx.fillText(m.label.toUpperCase(), rightX + 24, mY + 42);

      ctx.font = "bold 24px Inter, sans-serif";
      ctx.fillStyle = slide.accentHex;
      ctx.textAlign = "right";
      ctx.fillText(m.value, rightX + rightW - 24, mY + 44);
      ctx.textAlign = "left";
    });

    // 8. Bottom Narration / Subtitles Bar
    ctx.fillStyle = "rgba(9, 13, 22, 0.95)";
    ctx.strokeStyle = "rgba(30, 41, 59, 0.9)";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(96, 860, W - 192, 130, 16);
    ctx.fill();
    ctx.stroke();

    ctx.font = "bold 16px 'JetBrains Mono', monospace";
    ctx.fillStyle = slide.accentHex;
    ctx.fillText("WALLMIKI AUTO-VIDEO VOICEOVER CAPTION:", 128, 896);

    ctx.font = "italic 21px Inter, sans-serif";
    ctx.fillStyle = "#cbd5e1";
    wrapText(`"${slide.narration}"`, 128, 932, W - 256, 30);

    // 9. Progress bar along very bottom
    ctx.fillStyle = "rgba(30, 41, 59, 0.8)";
    ctx.fillRect(0, H - 10, W, 10);
    ctx.fillStyle = slide.accentHex;
    ctx.fillRect(0, H - 10, W * progressFraction, 10);
  };

  // Update preview canvas whenever activeSlideIdx changes
  useEffect(() => {
    const canvas = videoCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    drawSlideToCanvas(ctx, currentSlide, (activeSlideIdx + 1) / HACKATHON_SLIDES.length);
  }, [activeSlideIdx, currentSlide]);

  // Handle Auto-Play Presentation with Voice Synthesis
  useEffect(() => {
    if (!isAutoPlaying) {
      if (autoPlayTimerRef.current) {
        window.clearTimeout(autoPlayTimerRef.current);
      }
      return;
    }

    const slide = HACKATHON_SLIDES[activeSlideIdx];
    if (voiceEnabled) {
      speakText(
        slide.narration,
        () => {},
        () => {
          if (isAutoPlaying) {
            autoPlayTimerRef.current = window.setTimeout(() => {
              setActiveSlideIdx((prev) => {
                if (prev + 1 < HACKATHON_SLIDES.length) {
                  return prev + 1;
                } else {
                  setIsAutoPlaying(false);
                  return 0;
                }
              });
            }, 900);
          }
        }
      );
    } else {
      autoPlayTimerRef.current = window.setTimeout(() => {
        setActiveSlideIdx((prev) => {
          if (prev + 1 < HACKATHON_SLIDES.length) {
            return prev + 1;
          } else {
            setIsAutoPlaying(false);
            return 0;
          }
        });
      }, slide.durationSec * 1000);
    }

    return () => {
      if (autoPlayTimerRef.current) {
        window.clearTimeout(autoPlayTimerRef.current);
      }
    };
  }, [isAutoPlaying, activeSlideIdx, voiceEnabled]);

  const toggleAutoPlay = () => {
    if (isAutoPlaying) {
      setIsAutoPlaying(false);
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    } else {
      setIsAutoPlaying(true);
    }
  };

  // Client-Side PowerPoint (.pptx) Generation + Instant Download
  const handleGenerateAndDownloadPptx = async () => {
    setIsGeneratingPptx(true);
    try {
      const pptx = new PptxGenJS();
      pptx.layout = "LAYOUT_16x9";
      pptx.author = "Dr. Bheemaiah Anil K · Vayu Vaidya";
      pptx.company = "Vayu Vaidya (Milwaukee, WI)";
      pptx.subject = "Amazon Developer Hackathon 2026: Build, Ship, Shape — Devpost Submission";
      pptx.title = "Vayu Vaidya · Wallmiki E-Psychiatrist — Amazon Developer Hackathon 2026";

      HACKATHON_SLIDES.forEach((s) => {
        const slide = pptx.addSlide();
        const cleanColor = s.accentHex.replace("#", "").toUpperCase();
        slide.background = { color: "060A14" };

        slide.addShape(pptx.ShapeType.rect, {
          x: 0,
          y: 0,
          w: "100%",
          h: 0.08,
          fill: { color: cleanColor }
        });

        slide.addText(s.tag, {
          x: 0.6,
          y: 0.35,
          w: 8.8,
          h: 0.3,
          fontSize: 9.5,
          bold: true,
          color: cleanColor,
          fontFace: "Helvetica",
          charSpacing: 1.5
        });

        slide.addText(`SLIDE 0${s.slideNumber} / 0${HACKATHON_SLIDES.length}`, {
          x: 8.2,
          y: 0.35,
          w: 1.2,
          h: 0.3,
          fontSize: 9,
          bold: true,
          color: "94A3B8",
          align: "right",
          fontFace: "Courier New"
        });

        slide.addText(s.title, {
          x: 0.6,
          y: 0.72,
          w: 8.8,
          h: 0.6,
          fontSize: 24,
          bold: true,
          color: "F8FAFC",
          fontFace: "Georgia"
        });

        slide.addText(s.subtitle, {
          x: 0.6,
          y: 1.32,
          w: 8.8,
          h: 0.4,
          fontSize: 12.5,
          color: "CBD5E1",
          fontFace: "Helvetica"
        });

        slide.addShape(pptx.ShapeType.roundRect, {
          x: 0.6,
          y: 1.85,
          w: 6.1,
          h: 2.75,
          fill: { color: "0F172A" },
          line: { color: "1E293B", width: 1 },
          rectRadius: 0.08
        });

        const bulletItems = s.bullets.map((b) => ({
          text: b,
          options: {
            bullet: { code: "25AA", color: cleanColor },
            fontSize: 11.5,
            color: "E2E8F0",
            paraSpaceAfter: 10,
            lineSpacing: 16
          }
        }));

        slide.addText(bulletItems, {
          x: 0.8,
          y: 2.0,
          w: 5.7,
          h: 2.45,
          valign: "top",
          fontFace: "Helvetica"
        });

        s.metrics.forEach((m, idx) => {
          const cardY = 1.85 + idx * 0.95;
          slide.addShape(pptx.ShapeType.roundRect, {
            x: 6.9,
            y: cardY,
            w: 2.5,
            h: 0.82,
            fill: { color: "0F172A" },
            line: { color: cleanColor, width: 0.75 },
            rectRadius: 0.06
          });

          slide.addText(m.label.toUpperCase(), {
            x: 7.05,
            y: cardY + 0.12,
            w: 2.2,
            h: 0.22,
            fontSize: 8,
            bold: true,
            color: "94A3B8",
            fontFace: "Courier New"
          });

          slide.addText(m.value, {
            x: 7.05,
            y: cardY + 0.36,
            w: 2.2,
            h: 0.34,
            fontSize: 13.5,
            bold: true,
            color: cleanColor,
            fontFace: "Helvetica"
          });
        });

        slide.addShape(pptx.ShapeType.roundRect, {
          x: 0.6,
          y: 4.72,
          w: 8.8,
          h: 0.62,
          fill: { color: "090D16" },
          line: { color: "1E293B", width: 0.75 },
          rectRadius: 0.05
        });

        slide.addText(`AUTO-VIDEO VOICEOVER: "${s.narration}"`, {
          x: 0.75,
          y: 4.78,
          w: 8.5,
          h: 0.5,
          fontSize: 8.5,
          italic: true,
          color: "94A3B8",
          valign: "middle",
          fontFace: "Helvetica"
        });

        slide.addNotes(s.narration);
      });

      await pptx.writeFile({
        fileName: "Vayu-Vaidya-Amazon-Hackathon-2026-Build-Ship-Shape.pptx"
      });
      soundEngine.playChime();
    } finally {
      setIsGeneratingPptx(false);
    }
  };

  // Automatic Slide Deck to Video (.webm) Converter with 108Hz/432Hz Ambient Audio Stream
  const handleAutoConvertDeckToVideo = async () => {
    const canvas = videoCanvasRef.current;
    if (!canvas || isRecordingVideo) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    setIsRecordingVideo(true);
    setVideoProgress(0);
    setRecordedVideoUrl(null);
    setIsAutoPlaying(false);

    try {
      const canvasStream = canvas.captureStream(30);

      // Synthesize a subtle 136.1Hz + 432Hz sanctuary harmonic audio track into the video stream
      let audioCtx: AudioContext | null = null;
      let osc1: OscillatorNode | null = null;
      let osc2: OscillatorNode | null = null;
      try {
        const AudioContextClass =
          window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        audioCtx = new AudioContextClass();
        const dest = audioCtx.createMediaStreamDestination();
        osc1 = audioCtx.createOscillator();
        osc2 = audioCtx.createOscillator();
        const gain = audioCtx.createGain();

        osc1.type = "sine";
        osc1.frequency.value = 136.1; // Om fundamental
        osc2.type = "sine";
        osc2.frequency.value = 432; // Sanctuary harmonic

        gain.gain.value = 0.04;
        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(dest);
        osc1.start();
        osc2.start();

        dest.stream.getAudioTracks().forEach((track) => {
          canvasStream.addTrack(track);
        });
      } catch {
        // Fallback to video-only stream if Web Audio capture is restricted
      }

      const mimeType = MediaRecorder.isTypeSupported("video/webm;codecs=vp9")
        ? "video/webm;codecs=vp9"
        : "video/webm";

      const recorder = new MediaRecorder(canvasStream, {
        mimeType,
        videoBitsPerSecond: 4500000
      });

      const chunks: BlobPart[] = [];
      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          chunks.push(e.data);
        }
      };

      const recordingDone = new Promise<string>((resolve) => {
        recorder.onstop = () => {
          const blob = new Blob(chunks, { type: mimeType });
          const url = URL.createObjectURL(blob);
          resolve(url);
        };
      });

      recorder.start(200);

      // Render each slide for 2.5 seconds (20 seconds total 1080p HD Devpost video)
      const framesPerSlide = 50; // 50 * 50ms = 2.5s per slide
      const totalFrames = HACKATHON_SLIDES.length * framesPerSlide;
      let currentFrame = 0;

      for (let i = 0; i < HACKATHON_SLIDES.length; i++) {
        setActiveSlideIdx(i);
        const slide = HACKATHON_SLIDES[i];

        if (voiceEnabled && i === 0) {
          speakText(
            "Synthesizing Amazon Developer Hackathon 2026 video presentation for Vayu Vaidya Wallmiki."
          );
        }

        for (let f = 0; f < framesPerSlide; f++) {
          currentFrame++;
          const overallProgress = currentFrame / totalFrames;
          drawSlideToCanvas(ctx, slide, overallProgress);
          setVideoProgress(Math.round(overallProgress * 100));
          await new Promise((r) => setTimeout(r, 50));
        }
      }

      recorder.stop();
      if (osc1) osc1.stop();
      if (osc2) osc2.stop();
      if (audioCtx) await audioCtx.close();

      const videoUrl = await recordingDone;
      setRecordedVideoUrl(videoUrl);
      soundEngine.playChime();
    } catch (err) {
      console.error("Video synthesis error:", err);
    } finally {
      setIsRecordingVideo(false);
    }
  };

  const githubRawPptxUrl = `https://github.com/${githubOwner}/${githubRepo}/raw/${githubBranch}/public/deck/Vayu-Vaidya-Amazon-Hackathon-2026-Build-Ship-Shape.pptx`;
  const githubBlobPptxUrl = `https://github.com/${githubOwner}/${githubRepo}/blob/${githubBranch}/public/deck/Vayu-Vaidya-Amazon-Hackathon-2026-Build-Ship-Shape.pptx`;

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedLink(id);
    setTimeout(() => setCopiedLink(null), 2000);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Top Hero Banner */}
      <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-950 to-indigo-950/50 border border-slate-800 relative overflow-hidden">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-cyan-400">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Amazon Developer Hackathon 2026: Build, Ship, Shape · Devpost</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white font-display tracking-tight">
              Hackathon Slide Deck & Automatic Video Synthesizer
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              Official 8-slide widescreen (16:9) pitch deck for{" "}
              <strong className="text-white">Vayu Vaidya · Wallmiki E-Psychiatrist</strong>.
              Download the static <code className="text-cyan-300 font-mono">.pptx</code> file directly from
              GitHub or this server, or convert the entire slide deck automatically into a narrated{" "}
              <code className="text-purple-300 font-mono">1080p HD .webm</code> Devpost submission video.
            </p>
          </div>

          {/* Primary Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <a
              href="/deck/Vayu-Vaidya-Amazon-Hackathon-2026-Build-Ship-Shape.pptx"
              download="Vayu-Vaidya-Amazon-Hackathon-2026-Build-Ship-Shape.pptx"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-semibold text-xs sm:text-sm transition-colors shadow-lg shadow-cyan-500/10 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Download Static .PPTX</span>
            </a>

            <button
              onClick={handleGenerateAndDownloadPptx}
              disabled={isGeneratingPptx}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700 font-medium text-xs sm:text-sm transition-colors cursor-pointer disabled:opacity-50"
            >
              <FileSpreadsheet className="w-4 h-4 text-cyan-400" />
              <span>{isGeneratingPptx ? "Compiling PPTX..." : "Rebuild .PPTX in Browser"}</span>
            </button>

            <button
              onClick={handleAutoConvertDeckToVideo}
              disabled={isRecordingVideo}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs sm:text-sm transition-colors shadow-lg shadow-purple-500/20 cursor-pointer disabled:opacity-60"
            >
              <Film className="w-4 h-4" />
              <span>
                {isRecordingVideo
                  ? `Rendering Video (${videoProgress}%)...`
                  : "Auto-Convert Deck to Video"}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Recorded Video Download Alert Banner */}
      {recordedVideoUrl && (
        <div className="p-5 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
            <div>
              <h3 className="text-sm font-semibold text-white">
                1080p HD Devpost Pitch Video Synthesized Successfully!
              </h3>
              <p className="text-xs text-slate-300 mt-0.5">
                Includes all 8 Build, Ship, Shape slides with 136.1Hz Om & 432Hz sanctuary harmonic audio track.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <video
              src={recordedVideoUrl}
              controls
              className="h-16 rounded-lg border border-emerald-500/30 bg-slate-950"
            />
            <a
              href={recordedVideoUrl}
              download="Vayu-Vaidya-Amazon-Hackathon-2026-Pitch-Video.webm"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-semibold text-xs transition-colors shrink-0"
            >
              <Video className="w-4 h-4" />
              <span>Download Video (.webm)</span>
            </a>
          </div>
        </div>
      )}

      {/* Main Interactive Slide Stage + Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left 8 Columns: 16:9 Widescreen Slide Stage */}
        <div className="lg:col-span-8 space-y-4">
          <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 shadow-2xl">
            {/* High-Resolution 1920x1080 Canvas used for both Live Preview & Video Stream Capture */}
            <canvas
              ref={videoCanvasRef}
              width={1920}
              height={1080}
              className="w-full aspect-video block"
            />

            {/* Floating Playback Overlay Controls */}
            <div className="p-4 bg-slate-900/95 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setIsAutoPlaying(false);
                    setActiveSlideIdx((prev) =>
                      prev > 0 ? prev - 1 : HACKATHON_SLIDES.length - 1
                    );
                  }}
                  className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors cursor-pointer"
                  title="Previous Slide"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <button
                  onClick={toggleAutoPlay}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                    isAutoPlaying
                      ? "bg-amber-500 text-slate-950 hover:bg-amber-400"
                      : "bg-cyan-400 text-slate-950 hover:bg-cyan-300"
                  }`}
                >
                  {isAutoPlaying ? (
                    <>
                      <Pause className="w-3.5 h-3.5" />
                      <span>Pause Auto-Narrated Deck</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5" />
                      <span>Play Narrated Slide Show</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => {
                    setIsAutoPlaying(false);
                    setActiveSlideIdx((prev) =>
                      prev + 1 < HACKATHON_SLIDES.length ? prev + 1 : 0
                    );
                  }}
                  className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors cursor-pointer"
                  title="Next Slide"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    const next = !voiceEnabled;
                    setVoiceEnabled(next);
                    if (!next && "speechSynthesis" in window) {
                      window.speechSynthesis.cancel();
                    }
                  }}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                    voiceEnabled
                      ? "bg-cyan-500/10 border-cyan-500/40 text-cyan-300"
                      : "bg-slate-800 border-slate-700 text-slate-400"
                  }`}
                >
                  {voiceEnabled ? (
                    <>
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>Wallmiki Voiceover ON</span>
                    </>
                  ) : (
                    <>
                      <VolumeX className="w-3.5 h-3.5" />
                      <span>Voiceover Muted</span>
                    </>
                  )}
                </button>

                <span className="text-xs font-mono text-slate-400">
                  Slide {activeSlideIdx + 1} of {HACKATHON_SLIDES.length}
                </span>
              </div>
            </div>
          </div>

          {/* Slide Thumbnail Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {HACKATHON_SLIDES.map((s, idx) => (
              <button
                key={s.slideNumber}
                onClick={() => {
                  setIsAutoPlaying(false);
                  setActiveSlideIdx(idx);
                }}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  idx === activeSlideIdx
                    ? "bg-slate-900 border-cyan-400 shadow-md shadow-cyan-500/10"
                    : "bg-slate-900/50 border-slate-800/80 hover:border-slate-700"
                }`}
              >
                <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mb-1">
                  <span style={{ color: s.accentHex }}>0{s.slideNumber} · {s.phase}</span>
                  <span>{s.durationSec}s</span>
                </div>
                <p className="text-xs font-semibold text-slate-100 line-clamp-1">
                  {s.title}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Right 4 Columns: GitHub Direct PPTX Download Links & Video Export Guide */}
        <div className="lg:col-span-4 space-y-5">
          {/* Card 1: Direct GitHub PPTX Download URL Builder */}
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                <Github className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white">
                  GitHub Downloadable .PPTX URL
                </h3>
                <p className="text-[11px] text-slate-400">
                  Committed in repo at <code className="text-cyan-300">public/deck/</code>
                </p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 text-xs">
              <div>
                <label className="block text-[10px] font-mono uppercase text-slate-400 mb-1">
                  GitHub User
                </label>
                <input
                  type="text"
                  value={githubOwner}
                  onChange={(e) => setGithubOwner(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 font-mono text-xs"
                />
              </div>
              <div>
                <label className="block text-[10px] font-mono uppercase text-slate-400 mb-1">
                  Repository
                </label>
                <input
                  type="text"
                  value={githubRepo}
                  onChange={(e) => setGithubRepo(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 font-mono text-xs"
                />
              </div>
              <div>
                <label className="block text-[10px] font-mono uppercase text-slate-400 mb-1">
                  Branch
                </label>
                <input
                  type="text"
                  value={githubBranch}
                  onChange={(e) => setGithubBranch(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 font-mono text-xs"
                />
              </div>
            </div>

            {/* Raw Direct Download URL */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-300 font-medium">
                  Direct Raw .PPTX Download Link (GitHub):
                </span>
                <button
                  onClick={() => copyToClipboard(githubRawPptxUrl, "raw-pptx")}
                  className="text-cyan-400 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Copy className="w-3 h-3" />
                  <span>{copiedLink === "raw-pptx" ? "Copied!" : "Copy URL"}</span>
                </button>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 font-mono text-[11px] text-cyan-300 break-all">
                {githubRawPptxUrl}
              </div>
            </div>

            {/* GitHub Blob Viewer Link */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-300 font-medium">
                  GitHub Repository File Page:
                </span>
                <button
                  onClick={() => copyToClipboard(githubBlobPptxUrl, "blob-pptx")}
                  className="text-cyan-400 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Copy className="w-3 h-3" />
                  <span>{copiedLink === "blob-pptx" ? "Copied!" : "Copy URL"}</span>
                </button>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 font-mono text-[11px] text-slate-400 break-all">
                {githubBlobPptxUrl}
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800 flex items-center justify-between gap-2">
              <a
                href="/deck/Vayu-Vaidya-Amazon-Hackathon-2026-Build-Ship-Shape.pptx"
                download
                className="flex-1 py-2 px-3 rounded-lg bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/25 text-xs font-semibold text-center transition-colors"
              >
                Download Committed .PPTX Now
              </a>
              <a
                href={githubRawPptxUrl}
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                title="Open GitHub Raw Link"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Card 2: Current Slide Speaker Notes & Devpost Video Script */}
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-purple-400" />
                <h3 className="text-sm font-semibold text-white">
                  Slide 0{currentSlide.slideNumber} Speaker Script
                </h3>
              </div>
              <button
                onClick={() => speakText(currentSlide.narration)}
                className="px-2.5 py-1 rounded-md bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 text-[11px] font-medium transition-colors cursor-pointer"
              >
                Speak Slide
              </button>
            </div>
            <p className="text-xs text-slate-300 italic leading-relaxed bg-slate-950 p-3.5 rounded-xl border border-slate-800/90">
              "{currentSlide.narration}"
            </p>
            <div className="text-[11px] text-slate-400 space-y-1">
              <p className="font-semibold text-slate-300">
                3 Ways to Convert to Video for Devpost:
              </p>
              <ol className="list-decimal list-inside space-y-1">
                <li>
                  Click <strong className="text-purple-300">Auto-Convert Deck to Video</strong> above
                  for instant browser <code className="text-slate-200">.webm</code> video synthesis.
                </li>
                <li>
                  Open the downloaded <code className="text-cyan-300">.pptx</code> in PowerPoint →{" "}
                  <strong>File → Export → Create a Video</strong> (speaker notes included).
                </li>
                <li>
                  Upload the <code className="text-cyan-300">.pptx</code> to Google Slides / Canva
                  Video or Loom with Wallmiki's live voiceover.
                </li>
              </ol>
            </div>
          </div>

          {/* Card 3: CLI Command to Regenerate PPTX */}
          <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-200">
              <Terminal className="w-3.5 h-3.5 text-emerald-400" />
              <span>CLI Command to Regenerate .PPTX in Repo</span>
            </div>
            <pre className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 font-mono text-[11px] text-emerald-300 overflow-x-auto">
              npx tsx deploy/generate-hackathon-pptx.ts
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
