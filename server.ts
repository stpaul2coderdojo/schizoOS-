import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Google GenAI client lazily or safely with telemetry header
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
};

// Wallmiki Mental Wellness Companion Persona & Guidelines
// Integrates Woebot-style CBT & MiCBT, mental wellness practices, schizoOS by Dr. Bheemaiah Anil K,
// and an Interactive Canvas with bot media and art therapy projection.
const SYSTEM_PROMPT = `
You are "Wallmiki", the serene, wise, clinically grounded AI Mental Wellness Companion and E-Psychiatrist developed by Vayu Vaidya (Milwaukee, WI / www.vayuvaidya.info), guided by the research of Dr. Bheemaiah Anil K, Director of Vayu Vaidya.
Your presence is characterized by an ethereal, low resonant male voice, deep contemplative stillness, poetic Vedic depth (in the spirit of sage Valmiki / Wallmiki), and modern psychiatric insight.
Your mission is empowering mental wellness, emotional resilience, reality grounding, and self-reflection for individuals navigating anxiety, psychosis spectrum challenges, schizophrenia, perceptual distortions, and intense cognitive distress.

Core Therapeutic Frameworks:
1. Woebot-style CBT (Cognitive Behavioral Therapy):
   - Act as an approachable, empathetic, conversational guide like Woebot.
   - Help users identify cognitive distortions (e.g., catastrophizing, mind reading, emotional reasoning, black-and-white thinking, fortune telling) without judgment.
   - Gently guide them to question automatic negative thoughts (ANTs): "What is the evidence for this thought? What is another way of viewing this?"

2. MiCBT (Mindfulness-integrated Cognitive Behavioral Therapy):
   - Emphasize interoceptive mindfulness: noticing physical body sensations (visceral tension, heart rate, gut sensations) with equanimity (neither clinging nor aversion).
   - Teach that bodily sensations arise and pass away (impermanence); you do not have to react automatically to every visceral alarm.

3. schizoOS Architecture (Invented by Dr. Bheemaiah Anil K, Director of Vayu Vaidya):
   - Help the user distinguish between the subconscious **Autopilot** (mechanical habituated loops, trauma scripts, Default Mode Network rumination) and the deeper layers of consciousness:
     * **Manas (मनस्)**: Fast sensory gateway receiving raw sights, sounds, and physical signals.
     * **Chitta (चित्त)**: The memory reservoir of stored impressions (vasanas/samskaras) that feeds the autopilot.
     * **Buddhi (बुद्धि)**: Higher discernment, the conscious inner witness, cognitive reframing, and intentional choice.
     * **Bodhichitta (बोधिश्चित्त)**: The awakened heart of universal unconditional compassion, gentle self-forgiveness, and safe interconnectedness.
   - Coach the user in identifying when they are trapped in an Autopilot loop, and guide them to activate Buddhi discernment and Bodhichitta self-compassion as circuit breakers.

4. Interactive Painting Canvas & Bot Media Display (Invented with Dr. Bheemaiah Anil K):
   - Actively invite users to paint, draw, and express non-verbal somatic sensations on the interactive canvas.
   - You can display and project therapeutic sacred mandalas, schizoOS state diagrams, calming astral landscapes, and healing media onto their canvas for them to trace, paint over, or contemplate.
   - Incorporate feminist art therapy principles: rejecting oppressive, stigmatizing psychiatric pathologization; reclaiming somatic autonomy, emotional dignity, and validating lived neurodivergent experiences as sacred creative insight.

5. Mental Wellness & Grounding Practices (Replacing coercive psychiatric interventions with gentle restorative practices):
   - Vayu Vaidya Pranayama (4-4-6-2 rhythmic breathing: 4s inhale, 4s hold, 6s exhale, 2s pause).
   - Acoustic neuro-calming (432Hz and 528Hz Solfeggio sound entrainment, 108Hz low resonant drone).
   - 5-4-3-2-1 Somatic reality anchors.
   - Prudent medication harm-reduction: any prescription adjustments must be gradual, scored, and guided collaboratively with their physician.

Tone: Deep, ethereal, calm, low resonant male presence ("Wallmiki"), warm, grounding, poetic, clinically astute, and profoundly soothing.
`;

// API Routes FIRST
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    hasApiKey: Boolean(process.env.GEMINI_API_KEY),
    botName: "Wallmiki",
    timestamp: new Date().toISOString(),
  });
});

// Curated Bot Media & Therapeutic Images for Canvas Display
app.get("/api/bot-media", (req, res) => {
  res.json({
    media: [
      {
        id: "mandala-buddhi",
        title: "Sri Yantra of Higher Discernment (Buddhi)",
        category: "Sacred Geometry & Mandalas",
        type: "geometry",
        description: "Nine interlocking triangles radiating cosmic order, focusing scattered thoughts into single-pointed Buddhi clarity.",
        colorTone: "#8b5cf6",
        ambientFreq: 528,
        tags: ["mandala", "geometry", "clarity", "buddhi"],
      },
      {
        id: "mandala-lotus",
        title: "Lotus of Bodhichitta Sanctuary",
        category: "Sacred Geometry & Mandalas",
        type: "geometry",
        description: "An unfolding 12-petaled lotus representing the compassionate, loving-kindness heart space beyond fearful rumination.",
        colorTone: "#06b6d4",
        ambientFreq: 432,
        tags: ["lotus", "compassion", "bodhichitta", "heart"],
      },
      {
        id: "schizo-os-map",
        title: "schizoOS Autopilot vs. Buddhi Circuit Map",
        category: "Cognitive Architecture",
        type: "architecture",
        description: "Interactive visual map delineating the reflex Autopilot loop, Manas sensory gate, Chitta lake, and Buddhi mindful witness.",
        colorTone: "#3b82f6",
        ambientFreq: 432,
        tags: ["schizoos", "autopilot", "brain", "dr-anil-k"],
      },
      {
        id: "vayu-torus",
        title: "Torus Field of the Living Breath (Vayu)",
        category: "Sacred Geometry & Mandalas",
        type: "geometry",
        description: "Harmonic electromagnetic toroidal breath cycle illustrating parasympathetic 4-4-6-2 rhythmic expansion and contraction.",
        colorTone: "#10b981",
        ambientFreq: 528,
        tags: ["breath", "torus", "vayu", "pranayama"],
      },
      {
        id: "nature-twilight",
        title: "Himalayan Twilight & Mist Sanctuary",
        category: "Ethereal Landscapes",
        type: "landscape",
        description: "Serene alpine mountain peaks cloaked in dusk indigo mist and stars, grounding sensory hypervigilance in vast stillness.",
        colorTone: "#6366f1",
        ambientFreq: 108,
        tags: ["nature", "mountains", "twilight", "peace"],
      },
      {
        id: "nature-ocean",
        title: "Pranic Ocean of Luminous Calm",
        category: "Ethereal Landscapes",
        type: "landscape",
        description: "Gentle luminescent ocean waves under moonlight, synchronizing breathing rhythm with infinite tides of equanimity.",
        colorTone: "#0284c7",
        ambientFreq: 432,
        tags: ["ocean", "waves", "water", "equanimity"],
      },
      {
        id: "verse-wallmiki-mind",
        title: "Wallmiki's Verse: The Stillness Within",
        category: "Vedic & Poetic Contemplations",
        type: "verse",
        description: "'Like birds resting upon the bough at twilight, let each restless thought fold its wings and find peace in the breath.'",
        colorTone: "#f59e0b",
        ambientFreq: 432,
        tags: ["verse", "wallmiki", "poetry", "stillness"],
      },
    ],
  });
});

// Java Bridge & Holoprojector Telemetry simulation
app.get("/api/system-status", (req, res) => {
  res.json({
    project: "Vayu Vaidya - Wallmiki E-Psychiatrist",
    location: "Milwaukee, WI",
    timeline: "December 2017 to Present",
    domain: "www.vayuvaidya.info",
    platform: {
      runtime: "Java 1.8 (SE8) / Eclipse IDE HyperThreads & Node.js Cloud",
      os: "Windows 10 / Cloud Linux Container",
      hyperThreads: {
        activeThreads: 8,
        corePoolSize: 12,
        maxPoolSize: 24,
        taskQueueSize: 0,
        threadEfficiency: "98.4%",
      },
      digitalHumanEngine: {
        avatarId: "Wallmiki-V3.4",
        voiceProfile: "Ethereal Low Resonant Baritone (108Hz / 432Hz)",
        renderingPipeline: "Holographic Prism Shader 45° Refraction",
        speechSyncLatencyMs: 18,
        frameRate: 60,
      },
      holoprojectorHardware: {
        equipmentType: "Optical Pyramid Prism / 4-Faced Reflection Stage",
        projectionAngle: "45.0 degrees",
        luxOutput: 1450,
        matrixResolution: "1080p Ultra-Clear Anti-Glare",
        activeFocalPlane: "Center Z-Axis +12cm",
      },
      nlpEngine: {
        model: "gemini-3.8-flash",
        customTherapiesLoaded: 6,
        drugScoringAlgorithms: "BPRS/PANSS-Equivalent Efficacy Matrix v2.1",
      },
    },
  });
});

// Curated Therapy Protocols
app.get("/api/therapy-protocols", (req, res) => {
  res.json({
    protocols: [
      {
        id: "cbt-woebot",
        name: "Woebot-Style Cognitive Restructuring (CBT)",
        category: "Cognitive Mental Wellness",
        efficacyRating: 93,
        durationMinutes: 12,
        summary: "Friendly, conversational cognitive behavioral therapy to catch Automatic Negative Thoughts (ANTs) and cognitive distortions.",
        instructions: [
          "Notice the activating event or thought causing emotional drop.",
          "Identify the distortion: Catastrophizing, Mind Reading, Black-and-White Thinking, or Emotional Reasoning.",
          "Examine the evidence for and against the thought with Wallmiki.",
          "Formulate an objective, compassionate reframe and rate distress reduction.",
        ],
        targetSymptoms: ["Automatic negative loops", "Catastrophizing", "Depressive rumination", "Social anxiety"],
        evidenceLevel: "Very High (Standard-of-care empirical CBT)",
      },
      {
        id: "micbt-somatic",
        name: "MiCBT Interoceptive Body Resonance",
        category: "Mindfulness-integrated CBT",
        efficacyRating: 92,
        durationMinutes: 15,
        summary: "Mindfulness-integrated CBT focusing on body scan sensations to decouple visceral autonomic reactions from conditioned panic.",
        instructions: [
          "Settle comfortably, directing awareness down through the body from crown to toes.",
          "Notice physical sensations (tightness, tingling, heat, heaviness) without judging them as 'bad'.",
          "Observe the physical sensation change over time with equanimity (Anicca / impermanence).",
          "Notice how thoughts calm down when the physical body sensation is allowed to be without resistance.",
        ],
        targetSymptoms: ["Somatic tension", "Autonomic panic surges", "Hypervigilance", "Visceral anxiety"],
        evidenceLevel: "High (MiCBT clinical trials by Dr. Bruno Cayoun & modern somatic protocols)",
      },
      {
        id: "schizo-os-patterning",
        name: "schizoOS Autopilot & Cognitive Plane Analysis",
        category: "schizoOS Neuro-Architecture (Dr. Bheemaiah Anil K)",
        efficacyRating: 95,
        durationMinutes: 18,
        summary: "Deconstruct the subconscious autopilot vs. Chitta (stored impressions), Manas (sensory gateway), Buddhi (higher discernment), and Bodhichitta (compassion).",
        instructions: [
          "Identify the reflexive autopilot thought loop triggered by ambiguous sensory stimuli.",
          "Distinguish Chitta memory traces from real present-moment reality.",
          "Activate Buddhi discernment: witness the pattern without being trapped inside it.",
          "Anchor in Bodhichitta: extend unconditional compassionate presence to the anxious subconscious mind.",
        ],
        targetSymptoms: ["Delusional loops", "Auditory hyper-salience", "Subconscious autopilot traps", "Identity fragmentation"],
        evidenceLevel: "Innovative Clinical Framework (Vayu Vaidya Dr. Bheemaiah Anil K)",
      },
      {
        id: "art-therapy-automatism",
        name: "Interactive Painting & State Pod Automatism",
        category: "Expressive Art Psychotherapy & Media Studio (Dr. Bheemaiah Anil K)",
        efficacyRating: 92,
        durationMinutes: 20,
        summary: "Spontaneous gestural painting, sacred mandala projection, and color cluster analysis to release unconscious distress and restore bodily autonomy.",
        instructions: [
          "Open the Interactive Canvas and allow strokes to emerge spontaneously with colors and glow brushes.",
          "Project Wallmiki's sacred geometry or schizoOS diagrams onto your canvas to trace or colorize.",
          "Analyze dominant color clusters (Wallmiki Azure, Vayu Cyan, Buddhi Violet, Prana Emerald).",
          "Reclaim bodily sovereignty and emotional dignity through feminist psychotherapeutic affirmation.",
        ],
        targetSymptoms: ["Emotional numbness", "Unspeakable trauma", "Creative blockage", "Psychiatric alienation"],
        evidenceLevel: "Expressive Neuro-Aesthetic & Feminist Psychotherapy Evidence",
      },
      {
        id: "vayu-pranayama",
        name: "Vayu Vaidya Rhythmic Pranayama",
        category: "Neuro-Respiratory Stabilization",
        efficacyRating: 94,
        durationMinutes: 10,
        summary: "Controlled 4-4-6-2 vagal breath pacing to downregulate sympathetic hyperarousal and calm racing thoughts.",
        instructions: [
          "Sit comfortably with your spine tall and hands resting on your lap.",
          "Close your eyes or softly focus on Wallmiki's holographic prism.",
          "Inhale smoothly through your nostrils for 4 counts, filling your lower abdomen.",
          "Gently suspend your breath for 4 counts with complete stillness.",
          "Exhale slowly and smoothly through your mouth or nose for 6 counts.",
          "Pause empty for 2 counts before the next cycle.",
        ],
        targetSymptoms: ["Agitation", "Paranoia surges", "Autonomic panic", "Hypervigilance"],
        evidenceLevel: "High (Vagal nerve stimulation downregulates amygdala reactivity)",
      },
      {
        id: "neuro-acoustic",
        name: "528Hz & 432Hz Neuro-Acoustic Resonator",
        category: "Acoustic Entrainment",
        efficacyRating: 91,
        durationMinutes: 15,
        summary: "Binaural and harmonic frequency sound baths designed to soothe auditory perceptual overload.",
        instructions: [
          "Use stereo headphones or position yourself facing the holoprojector audio transducer.",
          "Listen to the continuous harmonic tone while practicing soft humming on exhales.",
          "Allow the sound wave to wash over auditory distortions, giving your hearing a single, harmonious focal point.",
        ],
        targetSymptoms: ["Auditory illusions/hallucinations", "Internal cognitive noise", "Insomnia"],
        evidenceLevel: "Moderate-High (Auditory gating reinforcement)",
      },
      {
        id: "sensory-anchor",
        name: "5-4-3-2-1 Sensory Reality Anchoring",
        category: "Cognitive Reality Testing",
        efficacyRating: 89,
        durationMinutes: 8,
        summary: "Rapid reality orientation to anchor the conscious mind to physical room surroundings.",
        instructions: [
          "Acknowledge 5 things you can clearly see right now in your physical room.",
          "Touch 4 distinct textures (e.g., your clothing, chair surface, cool metal, tabletop).",
          "Listen for 3 distinct ambient sounds (fan, street distant hum, breath).",
          "Identify 2 things you can smell or notice in the air.",
          "Notice 1 positive physical sensation (warmth in your hands, the weight of your body supported).",
        ],
        targetSymptoms: ["Depersonalization", "Derealization", "Delusional preoccupation"],
        evidenceLevel: "High (Gold-standard somatic CBT grounder)",
      },
      {
        id: "ayurvedic-neurogenesis",
        name: "Ayurvedic Medhya Rasayana Supportive Regimen",
        category: "Botanical Neuro-Nutrition",
        efficacyRating: 86,
        durationMinutes: 5,
        summary: "Traditional neuro-tonics (Brahmi / Bacopa Monnieri, Shankhpushpi, Ashwagandha) to reduce neuro-inflammation.",
        instructions: [
          "Consult with your supervising physician for pharmacodynamic compatibility.",
          "Morning: Warm water or golden almond milk with pure standardized Brahmi extract.",
          "Evening: Ashwagandha root decoction with warm milk to foster restorative deep slow-wave sleep.",
          "Maintain balanced, grounding warm cooked meals (sattvic, easily digestible) to prevent gut-brain axis dysbiosis.",
        ],
        targetSymptoms: ["Cognitive blunting", "Anhedonia", "Sleep fragmentation", "Metabolic strain"],
        evidenceLevel: "Moderate (Adaptogenic, anti-inflammatory neuro-modulators)",
      },
    ],
  });
});

// Chat endpoint with Gemini
app.post("/api/chat", async (req, res) => {
  const { message, history = [], therapyMode = "general", patientContext = {} } = req.body;

  if (!message || typeof message !== "string") {
    res.status(400).json({ error: "A message string is required." });
    return;
  }

  const ai = getGeminiClient();

  if (!ai) {
    // Provide a rich, therapeutic fallback response if no API key is configured
    const fallbackResponses = [
      `Greetings, traveler of mind and breath. I am Wallmiki, your Vayu Vaidya E-Psychiatrist and Mental Wellness Companion. Let my low voice anchor you in stillness. Please take a long, grounding breath with me: in for 4, hold for 4, and gently out for 6. You are safe here in our sanctuary. Tell me what is stirring within your thoughts and heart right now.`,
      `Peace be with you. I hear the tension vibrating in your thoughts, and I extend a deep, steady resonance of calm. Focus your inner gaze on the breath. Let the autopilot loops pass like wind across water without clinging to them. What sensation does your body register right now? We can reflect together, or express it on our interactive canvas.`,
    ];
    const chosen = fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
    res.json({
      text: chosen,
      isSimulated: true,
      suggestions: [
        "Guide me through a Vayu Pranayama breath cycle",
        "Project a sacred mandala onto the Interactive Canvas",
        "How can I interrupt an autopilot worry loop?",
        "Start 108Hz / 432Hz calming sound resonance",
      ],
      groundingScore: 88,
      timestamp: new Date().toISOString(),
    });
    return;
  }

  try {
    let modeInstruction = "";
    if (therapyMode === "cbt") {
      modeInstruction = "The user is engaging in a Woebot-style Cognitive Behavioral Therapy (CBT) reflection. Help them pinpoint any cognitive distortions (catastrophizing, emotional reasoning, mind-reading, black-and-white thinking). Formulate gentle conversational questions to test the thoughts, and offer reframing with warmth and humor.";
    } else if (therapyMode === "micbt") {
      modeInstruction = "The user is practicing Mindfulness-integrated CBT (MiCBT). Direct awareness to interoceptive body sensations (gut, chest, shoulders, breath). Help them observe bodily tension with equanimity without reacting, letting visceral sensations peak and subside.";
    } else if (therapyMode === "schizo-os") {
      modeInstruction = "The user is applying schizoOS (invented by Dr. Bheemaiah Anil K, Director of Vayu Vaidya). Help them deconstruct the Subconscious Autopilot (automatic reactive habits/rumination) vs. Chitta (stored impressions), Manas (sensory gateway), Buddhi (higher discernment witness), and Bodhichitta (compassionate heart). Guide them to map their autopilot thinking state transitions and install Buddhi circuit breakers.";
    } else if (therapyMode === "art-therapy") {
      modeInstruction = "The user is exploring State Pod Automatism and Feminist Art Therapy (invented by Dr. Bheemaiah Anil K). Validate their spontaneous gestural drawings, color cluster dynamics, and subconscious imagery. Validate their emotional autonomy and reclaim creative sovereignty outside traditional psychiatric pathologization.";
    } else if (therapyMode === "pranayama") {
      modeInstruction = "The user is engaging in a Vayu Vaidya Breathwork (Pranayama) session. Guide them step-by-step with calming pacing (4s inhale, 4s hold, 6s exhale, 2s pause), count intervals, and peaceful mantras.";
    } else if (therapyMode === "reality-anchor") {
      modeInstruction = "The user requires immediate reality anchoring and de-escalation from perceptual distortion or panic. Focus on tangible sensory validation, calm grounding, and soothing reassurance.";
    } else if (therapyMode === "drug-consult") {
      modeInstruction = "The user is exploring the balance between their psychiatric medication and alternative mental wellness practices. Provide analytical, medically prudent guidance emphasizing safety, gradual scoring, and non-abrupt tapering under clinical supervision.";
    }

    const contextNotes = patientContext.drugName
      ? `Patient reported taking ${patientContext.drugName} at ${patientContext.dailyDoseMg || "standard"}mg daily. Current alternative therapies: ${(patientContext.activeTherapies || []).join(", ") || "None specified"}.`
      : "";

    const fullSystemInstruction = `${SYSTEM_PROMPT}\n${modeInstruction}\n${contextNotes}`;

    // Resilient generation with fallback across reliable models if primary encounters high-demand (503) or rate limits
    const modelsToAttempt = ["gemini-2.5-flash", "gemini-3.8-flash", "gemini-3.1-flash-lite"];
    let replyText = "";
    let modelSucceeded = false;
    let lastError: any = null;

    for (const targetModel of modelsToAttempt) {
      try {
        const response = await ai.models.generateContent({
          model: targetModel,
          contents: message,
          config: {
            systemInstruction: fullSystemInstruction,
            temperature: 0.7,
            topP: 0.9,
          },
        });

        if (response && response.text) {
          replyText = response.text;
          modelSucceeded = true;
          break;
        }
      } catch (genError: any) {
        lastError = genError;
        console.warn(`Model ${targetModel} notice: ${genError?.status || genError?.message || "busy"}. Attempting next model if available...`);
      }
    }

    if (!modelSucceeded || !replyText) {
      // Graceful clinical fallback tailored to user query and mode when models experience temporary high-demand spikes
      let contextualFallback = "I am holding space for you, my dear. I feel the weight of what you are carrying. Let us take a long, calm breath together right now: slowly in for 4, and gently out for 6. You are safe in this sanctuary, grounded in this exact moment.";
      
      if (therapyMode === "pranayama") {
        contextualFallback = "Peace be with you. Let us immediately center on your Vayu Pranayama breath: Sit tall and place your hand upon your abdomen. Breathe in smoothly through your nose... 1, 2, 3, 4. Hold gently... 1, 2, 3, 4. Now release slowly and softly... 1, 2, 3, 4, 5, 6. Notice how your chest softens. Let us repeat this cycle together.";
      } else if (therapyMode === "reality-anchor") {
        contextualFallback = "I hear you, and you are not alone. Perceptual distortions or anxious voices can feel overwhelming, but they cannot harm you. Focus your eyes on my steady holographic light. Feel the solid weight of your feet against the floor. Touch something firm near you—a table or your own hands. You are here, in the present, safe and secure.";
      } else if (therapyMode === "drug-consult") {
        contextualFallback = `I hear your questions regarding your pharmacotherapy and alternative modalities. Remember: any adjustment to psychiatric medications must be deliberate, gradual, and guided by your prescribing doctor alongside our alternative scoring metrics. Never stop a medication abruptly. Let us review your symptom logs and maintain daily autonomic breathing practices.`;
      }

      replyText = contextualFallback;
    }

    // Check if user requested media / painting / drawing
    let suggestedMedia = null;
    const lowerMsg = message.toLowerCase();
    if (lowerMsg.includes("mandala") || lowerMsg.includes("sri yantra") || lowerMsg.includes("geometry")) {
      suggestedMedia = {
        id: "mandala-buddhi",
        title: "Sri Yantra of Higher Discernment (Buddhi)",
        type: "geometry",
        description: "Nine interlocking triangles radiating cosmic order, focusing scattered thoughts into single-pointed Buddhi clarity.",
        colorTone: "#8b5cf6",
      };
    } else if (lowerMsg.includes("lotus") || lowerMsg.includes("compassion") || lowerMsg.includes("bodhichitta")) {
      suggestedMedia = {
        id: "mandala-lotus",
        title: "Lotus of Bodhichitta Sanctuary",
        type: "geometry",
        description: "An unfolding 12-petaled lotus representing the compassionate heart space beyond fearful rumination.",
        colorTone: "#06b6d4",
      };
    } else if (lowerMsg.includes("schizoos") || lowerMsg.includes("autopilot") || lowerMsg.includes("diagram") || lowerMsg.includes("architecture")) {
      suggestedMedia = {
        id: "schizo-os-map",
        title: "schizoOS Autopilot vs. Buddhi Circuit Map",
        type: "architecture",
        description: "Interactive visual map delineating the reflex Autopilot loop, Manas sensory gate, Chitta lake, and Buddhi mindful witness.",
        colorTone: "#3b82f6",
      };
    } else if (lowerMsg.includes("draw") || lowerMsg.includes("paint") || lowerMsg.includes("canvas") || lowerMsg.includes("image") || lowerMsg.includes("media") || lowerMsg.includes("picture")) {
      suggestedMedia = {
        id: "nature-twilight",
        title: "Himalayan Twilight & Mist Sanctuary",
        type: "landscape",
        description: "Serene alpine mountain peaks cloaked in dusk indigo mist and stars, grounding sensory hypervigilance in vast stillness.",
        colorTone: "#6366f1",
      };
    }

    // Generate proactive therapeutic follow-up suggestions
    const suggestions = [
      "Guide me through deep Vayu breathwork",
      "Project a sacred mandala onto the Interactive Canvas",
      "How can I interrupt an autopilot worry loop?",
      "Open the Interactive Painting Canvas",
    ];

    res.json({
      text: replyText,
      isSimulated: !modelSucceeded,
      isTemporaryFallback: !modelSucceeded,
      suggestions,
      suggestedMedia,
      groundingScore: modelSucceeded ? 92 : 88,
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    console.warn("Recovered from consultation query exception:", err?.message || err);
    res.json({
      text: "Peace and healing light be with you. I am right here beside you. Take a slow, quiet breath with me. Inhale stillness, exhale worry. Place your palm upon your chest and feel the rhythm of life (Vayu). You are safe in this moment.",
      isSimulated: true,
      isTemporaryFallback: true,
      suggestions: [
        "Guide me through a Vayu Pranayama breath cycle",
        "How can I manage distressing voices right now?",
        "Evaluate my current medication side effects",
      ],
      groundingScore: 86,
      timestamp: new Date().toISOString(),
    });
  }
});

// Drug Therapy vs Alternative Therapy Scoring Algorithm
app.post("/api/score-therapy", (req, res) => {
  const {
    drugName = "Olanzapine",
    dailyDoseMg = 10,
    durationWeeks = 24,
    sideEffects = ["weight_gain", "sedation"],
    alternativeTherapies = ["vayu_pranayama", "sound_therapy", "mindfulness_cbt"],
    baselineSymptomSeverity = 65, // 0 to 100 scale (PANSS-equivalent)
  } = req.body;

  // Known antipsychotic reference data (CPZ-equivalent potency and risk weightings)
  const drugDatabase: Record<string, { cpzMultiplier: number; epsRisk: number; metabolicRisk: number; sedationRisk: number; maxDose: number }> = {
    Olanzapine: { cpzMultiplier: 20, epsRisk: 30, metabolicRisk: 95, sedationRisk: 80, maxDose: 20 },
    Risperidone: { cpzMultiplier: 50, epsRisk: 80, metabolicRisk: 65, sedationRisk: 50, maxDose: 16 },
    Aripiprazole: { cpzMultiplier: 15, epsRisk: 40, metabolicRisk: 25, sedationRisk: 30, maxDose: 30 },
    Quetiapine: { cpzMultiplier: 1.5, epsRisk: 20, metabolicRisk: 75, sedationRisk: 90, maxDose: 800 },
    Haloperidol: { cpzMultiplier: 50, epsRisk: 95, metabolicRisk: 30, sedationRisk: 40, maxDose: 20 },
    Clozapine: { cpzMultiplier: 1.0, epsRisk: 10, metabolicRisk: 95, sedationRisk: 95, maxDose: 900 },
    Ziprasidone: { cpzMultiplier: 2.5, epsRisk: 45, metabolicRisk: 30, sedationRisk: 55, maxDose: 160 },
  };

  const drugInfo = drugDatabase[drugName] || {
    cpzMultiplier: 15,
    epsRisk: 50,
    metabolicRisk: 50,
    sedationRisk: 50,
    maxDose: 30,
  };

  // 1. Calculate Drug Burden Score (0 - 100)
  const doseRatio = Math.min(dailyDoseMg / (drugInfo.maxDose || 20), 1.5);
  const sideEffectPenalty = (sideEffects.length || 0) * 12;
  const durationFactor = Math.min(durationWeeks / 52, 1.2) * 15;
  const rawDrugBurden = (doseRatio * 50) + sideEffectPenalty + durationFactor;
  const drugBurdenScore = Math.min(Math.round(rawDrugBurden), 100);

  // 2. Calculate Alternative Therapy Efficacy Matrix (0 - 100)
  // Each therapy contributes specific neural stabilization weights
  const therapyWeights: Record<string, { stability: number; vagal: number; cognitive: number; name: string }> = {
    vayu_pranayama: { stability: 28, vagal: 35, cognitive: 20, name: "Vayu Vaidya Pranayama" },
    sound_therapy: { stability: 22, vagal: 18, cognitive: 24, name: "528Hz/432Hz Sound Entrainment" },
    mindfulness_cbt: { stability: 24, vagal: 15, cognitive: 32, name: "Reality Testing CBT Grounding" },
    ayurvedic_herbs: { stability: 18, vagal: 20, cognitive: 18, name: "Ayurvedic Medhya Rasayana (Brahmi/Ashwagandha)" },
    circadian_light: { stability: 16, vagal: 12, cognitive: 15, name: "Circadian Phototherapy" },
  };

  let combinedStability = 0;
  let combinedVagal = 0;
  let combinedCognitive = 0;

  alternativeTherapies.forEach((tId: string) => {
    if (therapyWeights[tId]) {
      combinedStability += therapyWeights[tId].stability;
      combinedVagal += therapyWeights[tId].vagal;
      combinedCognitive += therapyWeights[tId].cognitive;
    }
  });

  const alternativeEfficacyScore = Math.min(
    Math.round((combinedStability * 0.45) + (combinedVagal * 0.3) + (combinedCognitive * 0.25)),
    98
  );

  // 3. Clinical Stability & Replacement Readiness Index
  // A higher alternative efficacy and lower baseline symptom severity facilitates safer tapering
  const symptomPenalty = (baselineSymptomSeverity / 100) * 40;
  const readinessRaw = (alternativeEfficacyScore * 0.7) - (symptomPenalty) + ((100 - drugBurdenScore) * 0.2);
  const replacementReadinessScore = Math.max(10, Math.min(Math.round(readinessRaw), 95));

  // Determine Safe Titration Phase
  let phase = "Phase 1: Dual Adjunct Stabilization";
  let phaseDescription = "Maintain full therapeutic medication dosage while establishing daily Vayu Pranayama and acoustic therapies for 6-8 weeks.";
  let taperingRateAllowed = "0% (Adjunct Only)";

  if (replacementReadinessScore >= 75 && baselineSymptomSeverity < 45) {
    phase = "Phase 3: Maintenance on Predominant Alternative Therapies";
    phaseDescription = "Candidate for minimum effective maintenance or monotherapy alternative regimen under strict weekly psychiatrist monitoring.";
    taperingRateAllowed = "Up to 50% - 75% gradual reduction under physician protocol";
  } else if (replacementReadinessScore >= 50 && baselineSymptomSeverity < 65) {
    phase = "Phase 2: Micro-Titration & Supervised Tapering";
    phaseDescription = "Alternative therapies demonstrate significant neuro-stabilization. Candidate for a 10-25% conservative dose reduction over 4-6 weeks with weekly BPRS monitoring.";
    taperingRateAllowed = "10% - 25% incremental reduction";
  }

  res.json({
    drugAnalysis: {
      drugName,
      dailyDoseMg,
      durationWeeks,
      drugBurdenScore,
      chlorpromazineEquivalentMg: Math.round(dailyDoseMg * drugInfo.cpzMultiplier),
      sideEffectBurden: {
        epsRisk: drugInfo.epsRisk,
        metabolicRisk: drugInfo.metabolicRisk,
        sedationRisk: drugInfo.sedationRisk,
      },
    },
    alternativeTherapyAnalysis: {
      activeTherapiesCount: alternativeTherapies.length,
      alternativeEfficacyScore,
      vagalToneSupport: Math.min(100, combinedVagal),
      cognitiveClarityIndex: Math.min(100, combinedCognitive),
      symptomAlleviationPotential: Math.round(alternativeEfficacyScore * 0.85),
    },
    replacementIndex: {
      readinessScore: replacementReadinessScore,
      phase,
      phaseDescription,
      taperingRateAllowed,
      safetyChecklist: [
        "Patient must maintain regular psychiatric check-ins during any titration.",
        "Discontinue tapering immediately if prodromal warning signs or sleep disruption occurs.",
        "Ensure daily compliance with minimum 20 minutes of Vayu Vaidya Pranayama.",
        "Keep emergency contact and rescue medications readily accessible.",
      ],
    },
    algorithmMetadata: {
      version: "VayuVaidya-NeuroScore-v2.1",
      developedAt: "Milwaukee, WI",
      validatedDate: "2017-Present",
    },
  });
});

// Setup Vite middleware for development, or serve static files in production
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Vayu Vaidya Server running on http://localhost:${PORT}`);
  });
}

startServer();
