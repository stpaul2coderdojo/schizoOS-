/**
 * Vayu Vaidya • Wallmiki Alexa Skills Kit (ASK) Request Handler
 * 
 * Processes Alexa Skills Kit JSON payloads (LaunchRequest, IntentRequest, SessionEndedRequest)
 * and generates compliant Alexa JSON responses with SSML (Speech Synthesis Markup Language)
 * formatted for Wallmiki's deep soothing baritone voice profile.
 */

import { GoogleGenAI } from "@google/genai";

export interface AlexaRequestEnvelope {
  version?: string;
  session?: {
    new?: boolean;
    sessionId?: string;
    application?: { applicationId?: string };
    attributes?: Record<string, any>;
    user?: { userId?: string };
  };
  context?: {
    System?: {
      application?: { applicationId?: string };
      user?: { userId?: string };
      device?: { deviceId?: string };
      apiEndpoint?: string;
    };
  };
  request: {
    type: "LaunchRequest" | "IntentRequest" | "SessionEndedRequest";
    requestId: string;
    timestamp: string;
    locale?: string;
    reason?: string;
    intent?: {
      name: string;
      confirmationStatus?: string;
      slots?: Record<string, { name: string; value?: string; slotValue?: any }>;
    };
  };
}

export interface AlexaResponseEnvelope {
  version: "1.0";
  sessionAttributes?: Record<string, any>;
  response: {
    outputSpeech?: {
      type: "SSML" | "PlainText";
      ssml?: string;
      text?: string;
    };
    card?: {
      type: "Simple" | "Standard";
      title?: string;
      content?: string;
      text?: string;
    };
    reprompt?: {
      outputSpeech: {
        type: "SSML" | "PlainText";
        ssml?: string;
        text?: string;
      };
    };
    shouldEndSession: boolean;
  };
}

// SSML generator wrapping Wallmiki's baritone prosody
export function wrapWallmikiSSML(innerSpeech: string): string {
  return `<speak><prosody pitch="-15%" rate="92%">${innerSpeech}</prosody></speak>`;
}

// Built-in therapeutic content library for low-latency Alexa voice responses
export const ALEXA_THERAPEUTIC_CONTENT = {
  launch: {
    speech: "Welcome to Vayu Vaidya. I am Wallmiki, your mental wellness companion and e-psychiatrist. Breathe deeply and arrive in this moment. You can ask for a four-four-six-two breathing exercise, sensory grounding, an autopilot check-in, or cognitive guidance. How may I support your inner peace today?",
    reprompt: "You can say: 'Start a breathing exercise', 'Guide me through grounding', or 'Check my autopilot loop'. What feels most supportive right now?",
    cardTitle: "Vayu Vaidya • Wallmiki Sanctuary",
    cardText: "Welcome to Vayu Vaidya. Wallmiki is ready to guide you through pranayama breathing, sensory grounding, or cognitive reframing.",
  },
  pranayama: {
    speech: "Let us practice the Vayu Vaidya four-four-six-two vagal breathing cycle to gently regulate your nervous system. Place your hand on your belly. <break time=\"1s\"/> Inhale slowly through your nose for four counts... <break time=\"4s\"/> Hold gently at the crown... <break time=\"4s\"/> Exhale slowly through your mouth, releasing all tension, for six counts... <break time=\"6s\"/> Pause in absolute stillness for two... <break time=\"2s\"/> Let us do one more. Inhale light and clarity... <break time=\"4s\"/> Hold in peaceful awareness... <break time=\"4s\"/> Exhale completely, softening your shoulders... <break time=\"6s\"/> Pause... <break time=\"2s\"/> How is your body feeling now?",
    reprompt: "Would you like to continue breathing, do a grounding exercise, or talk about what is on your mind?",
    cardTitle: "Vayu Pranayama (4-4-6-2)",
    cardText: "Vagal nerve stimulation: 4s Inhale, 4s Hold, 6s Exhale, 2s Pause. Clinically designed to downregulate acute autonomic arousal.",
  },
  grounding: {
    speech: "Let us anchor your attention into physical reality with the five-four-three-two-one sensory grounding practice. <break time=\"1s\"/> First, notice five things you can see around your space. <break time=\"2s\"/> Now, bring awareness to four things you can physically feel: your feet on the earth, or the texture of your clothes. <break time=\"2s\"/> Listen for three distinct sounds in your environment. <break time=\"2s\"/> Notice two things you can smell or sense in the air. <break time=\"1s\"/> And acknowledge one truth: you are safe here in this moment, anchored in living breath. Would you like to explore what triggered your distress?",
    reprompt: "You can ask for another grounding exercise, a pranayama breath, or share a thought.",
    cardTitle: "5-4-3-2-1 Sensory Grounding",
    cardText: "Sensory grounding re-engages the prefrontal cortex and halts amygdala panic loops through active sensory orientation.",
  },
  autopilot: {
    speech: "In Dr. Bheemaiah Anil K's schizoOS cognitive architecture, our subconscious minds often run an automatic loop—a program of habitual fears, catastrophizing, or trauma scripts. You are not your autopilot. You are Buddhi, the conscious inner witness observing these thoughts. Whenever a racing or fearful thought arises, remind yourself: 'This is just machine code running on my autopilot loop. It is not my truth.' Take a slow breath. What is the thought your autopilot is generating right now?",
    reprompt: "Tell me the thought that feels heavy, and we will examine it together through Buddhi discernment.",
    cardTitle: "schizoOS Autopilot vs Buddhi",
    cardText: "The subconscious autopilot generates habituated prediction errors. Buddhi is the mindful witness capable of installing conscious circuit breakers.",
  },
  somaticScan: {
    speech: "Let us perform a quick interoceptive scan with equanimity. Close your eyes if comfortable. Scan your solar plexus and chest. Do you feel tightness, flutter, or warmth? Do not try to push it away. In Mindfulness-integrated CBT, we remember Anicca: every visceral sensation is a transient wave that peaks and dissolves. Breathe into that sensation with kindness. What do you notice?",
    reprompt: "Describe what sensations you are feeling, or ask for a breathing exercise.",
    cardTitle: "MiCBT Interoceptive Somatic Scan",
    cardText: "Interoceptive mindfulness trains equanimity with visceral sensations, decoupling physical arousal from cognitive panic.",
  },
  wisdom: {
    speech: "Hear this reflection: The breath is the bridge between the turbulent sea of thoughts and the calm harbor of the soul. No storm in the mind can outlast steady, patient respiration. Be gentle with your human journey today. Would you like a breathing exercise or to reflect on a specific challenge?",
    reprompt: "Say 'pranayama' for breathing, or share what you are experiencing.",
    cardTitle: "Wallmiki Contemplative Wisdom",
    cardText: "Breath and mindful observation restore equilibrium to the neural circuits of the mind.",
  },
  help: {
    speech: "Vayu Vaidya Wallmiki provides conversational e-psychiatry, vagal breath pacing, and cognitive grounding. You can say: 'Start breathing exercise', 'Ground my senses', 'Check autopilot', 'Scan my body', or ask a mental wellness question. What would you like to do?",
    reprompt: "Say 'breathing', 'grounding', or 'autopilot' to begin.",
    cardTitle: "Vayu Vaidya Help & Commands",
    cardText: "Available Voice Commands:\n- 'Alexa, ask Vayu Vaidya for a breathing exercise'\n- 'Alexa, ask Vayu Vaidya for grounding'\n- 'Alexa, ask Vayu Vaidya about autopilot loops'\n- 'Alexa, ask Vayu Vaidya for wisdom'",
  },
  stop: {
    speech: "May calm breath and stillness abide with you. Vayu Vaidya and Wallmiki are always here whenever you need sanctuary. Peace be upon your path.",
    cardTitle: "Session Completed",
    cardText: "Thank you for practicing with Wallmiki. Return anytime by saying 'Alexa, open Vayu Vaidya'.",
  },
  fallback: {
    speech: "I heard you, traveler. In moments of uncertainty, returning to the breath restores clarity. You can ask for a four-four-six-two breathing exercise, sensory grounding, or an autopilot check. How may I best assist you?",
    reprompt: "Would you like a breathing exercise or sensory grounding?",
    cardTitle: "Vayu Vaidya Guidance",
    cardText: "Say 'breathing exercise' or 'grounding' to continue.",
  },
};

/**
 * Main Alexa Skills Kit Request Handler
 */
export async function handleAlexaSkillRequest(
  envelope: AlexaRequestEnvelope,
  geminiApiKey?: string
): Promise<AlexaResponseEnvelope> {
  const request = envelope?.request;
  if (!request) {
    return {
      version: "1.0",
      response: {
        outputSpeech: {
          type: "SSML",
          ssml: wrapWallmikiSSML(ALEXA_THERAPEUTIC_CONTENT.fallback.speech),
        },
        shouldEndSession: true,
      },
    };
  }

  // 1. LaunchRequest ("Alexa, open Vayu Vaidya")
  if (request.type === "LaunchRequest") {
    return {
      version: "1.0",
      response: {
        outputSpeech: {
          type: "SSML",
          ssml: wrapWallmikiSSML(ALEXA_THERAPEUTIC_CONTENT.launch.speech),
        },
        reprompt: {
          outputSpeech: {
            type: "SSML",
            ssml: wrapWallmikiSSML(ALEXA_THERAPEUTIC_CONTENT.launch.reprompt),
          },
        },
        card: {
          type: "Standard",
          title: ALEXA_THERAPEUTIC_CONTENT.launch.cardTitle,
          text: ALEXA_THERAPEUTIC_CONTENT.launch.cardText,
        },
        shouldEndSession: false,
      },
    };
  }

  // 2. SessionEndedRequest
  if (request.type === "SessionEndedRequest") {
    return {
      version: "1.0",
      response: {
        shouldEndSession: true,
      },
    };
  }

  // 3. IntentRequest
  if (request.type === "IntentRequest" && request.intent) {
    const intentName = request.intent.name;

    // Vayu Pranayama Breathing
    if (intentName === "VayuPranayamaIntent" || intentName === "BreathingIntent") {
      return {
        version: "1.0",
        response: {
          outputSpeech: {
            type: "SSML",
            ssml: wrapWallmikiSSML(ALEXA_THERAPEUTIC_CONTENT.pranayama.speech),
          },
          reprompt: {
            outputSpeech: {
              type: "SSML",
              ssml: wrapWallmikiSSML(ALEXA_THERAPEUTIC_CONTENT.pranayama.reprompt),
            },
          },
          card: {
            type: "Standard",
            title: ALEXA_THERAPEUTIC_CONTENT.pranayama.cardTitle,
            text: ALEXA_THERAPEUTIC_CONTENT.pranayama.cardText,
          },
          shouldEndSession: false,
        },
      };
    }

    // Sensory Grounding (5-4-3-2-1)
    if (intentName === "GroundingIntent" || intentName === "SensoryGroundingIntent") {
      return {
        version: "1.0",
        response: {
          outputSpeech: {
            type: "SSML",
            ssml: wrapWallmikiSSML(ALEXA_THERAPEUTIC_CONTENT.grounding.speech),
          },
          reprompt: {
            outputSpeech: {
              type: "SSML",
              ssml: wrapWallmikiSSML(ALEXA_THERAPEUTIC_CONTENT.grounding.reprompt),
            },
          },
          card: {
            type: "Standard",
            title: ALEXA_THERAPEUTIC_CONTENT.grounding.cardTitle,
            text: ALEXA_THERAPEUTIC_CONTENT.grounding.cardText,
          },
          shouldEndSession: false,
        },
      };
    }

    // schizoOS Autopilot Check
    if (intentName === "AutopilotCheckIntent" || intentName === "SchizoOSIntent") {
      return {
        version: "1.0",
        response: {
          outputSpeech: {
            type: "SSML",
            ssml: wrapWallmikiSSML(ALEXA_THERAPEUTIC_CONTENT.autopilot.speech),
          },
          reprompt: {
            outputSpeech: {
              type: "SSML",
              ssml: wrapWallmikiSSML(ALEXA_THERAPEUTIC_CONTENT.autopilot.reprompt),
            },
          },
          card: {
            type: "Standard",
            title: ALEXA_THERAPEUTIC_CONTENT.autopilot.cardTitle,
            text: ALEXA_THERAPEUTIC_CONTENT.autopilot.cardText,
          },
          shouldEndSession: false,
        },
      };
    }

    // Somatic Body Scan
    if (intentName === "SomaticScanIntent" || intentName === "BodyScanIntent") {
      return {
        version: "1.0",
        response: {
          outputSpeech: {
            type: "SSML",
            ssml: wrapWallmikiSSML(ALEXA_THERAPEUTIC_CONTENT.somaticScan.speech),
          },
          reprompt: {
            outputSpeech: {
              type: "SSML",
              ssml: wrapWallmikiSSML(ALEXA_THERAPEUTIC_CONTENT.somaticScan.reprompt),
            },
          },
          card: {
            type: "Standard",
            title: ALEXA_THERAPEUTIC_CONTENT.somaticScan.cardTitle,
            text: ALEXA_THERAPEUTIC_CONTENT.somaticScan.cardText,
          },
          shouldEndSession: false,
        },
      };
    }

    // Wallmiki Wisdom / Quote
    if (intentName === "WallmikiWisdomIntent" || intentName === "WisdomIntent") {
      return {
        version: "1.0",
        response: {
          outputSpeech: {
            type: "SSML",
            ssml: wrapWallmikiSSML(ALEXA_THERAPEUTIC_CONTENT.wisdom.speech),
          },
          reprompt: {
            outputSpeech: {
              type: "SSML",
              ssml: wrapWallmikiSSML(ALEXA_THERAPEUTIC_CONTENT.wisdom.reprompt),
            },
          },
          card: {
            type: "Standard",
            title: ALEXA_THERAPEUTIC_CONTENT.wisdom.cardTitle,
            text: ALEXA_THERAPEUTIC_CONTENT.wisdom.cardText,
          },
          shouldEndSession: false,
        },
      };
    }

    // Conversational CBT / Thought Challenge with Gemini (or fallback)
    if (intentName === "CbtReflectIntent" || intentName === "ThoughtQueryIntent") {
      const userThought = request.intent.slots?.userThought?.value || "I am feeling overwhelmed.";
      let aiReflection = `I hear the weight in that thought. Remember, what your mind presents in distress is often an autopilot prediction error. Take a slow, grounding breath. What is one piece of concrete evidence that contradicts this fear?`;

      if (geminiApiKey) {
        try {
          const ai = new GoogleGenAI({
            apiKey: geminiApiKey,
            httpOptions: { headers: { "User-Agent": "aistudio-build-alexa" } },
          });
          const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `You are Wallmiki, an ethereal low-resonant male e-psychiatrist and mental wellness companion from Vayu Vaidya (Milwaukee, WI).
A user speaking to you on an Amazon Alexa Echo device shares: "${userThought}".
Provide a concise, 2-3 sentence therapeutic response in a calm, soothing voice. Use Woebot-style CBT to gently challenge the thought and invite a 4-4-6-2 breath. Keep it under 60 words for voice synthesis.`,
          });
          if (response.text) {
            aiReflection = response.text.trim();
          }
        } catch (e) {
          console.warn("[Alexa ASK] Gemini call fallback:", e);
        }
      }

      return {
        version: "1.0",
        response: {
          outputSpeech: {
            type: "SSML",
            ssml: wrapWallmikiSSML(aiReflection),
          },
          reprompt: {
            outputSpeech: {
              type: "SSML",
              ssml: wrapWallmikiSSML("Would you like to try a breathing exercise, or share more of your thoughts?"),
            },
          },
          card: {
            type: "Standard",
            title: "Wallmiki Cognitive Reflection",
            text: aiReflection,
          },
          shouldEndSession: false,
        },
      };
    }

    // Built-in AMAZON.HelpIntent
    if (intentName === "AMAZON.HelpIntent") {
      return {
        version: "1.0",
        response: {
          outputSpeech: {
            type: "SSML",
            ssml: wrapWallmikiSSML(ALEXA_THERAPEUTIC_CONTENT.help.speech),
          },
          reprompt: {
            outputSpeech: {
              type: "SSML",
              ssml: wrapWallmikiSSML(ALEXA_THERAPEUTIC_CONTENT.help.reprompt),
            },
          },
          card: {
            type: "Standard",
            title: ALEXA_THERAPEUTIC_CONTENT.help.cardTitle,
            text: ALEXA_THERAPEUTIC_CONTENT.help.cardText,
          },
          shouldEndSession: false,
        },
      };
    }

    // Built-in AMAZON.StopIntent / AMAZON.CancelIntent
    if (intentName === "AMAZON.StopIntent" || intentName === "AMAZON.CancelIntent") {
      return {
        version: "1.0",
        response: {
          outputSpeech: {
            type: "SSML",
            ssml: wrapWallmikiSSML(ALEXA_THERAPEUTIC_CONTENT.stop.speech),
          },
          card: {
            type: "Standard",
            title: ALEXA_THERAPEUTIC_CONTENT.stop.cardTitle,
            text: ALEXA_THERAPEUTIC_CONTENT.stop.cardText,
          },
          shouldEndSession: true,
        },
      };
    }

    // Fallback Intent
    if (intentName === "AMAZON.FallbackIntent") {
      return {
        version: "1.0",
        response: {
          outputSpeech: {
            type: "SSML",
            ssml: wrapWallmikiSSML(ALEXA_THERAPEUTIC_CONTENT.fallback.speech),
          },
          reprompt: {
            outputSpeech: {
              type: "SSML",
              ssml: wrapWallmikiSSML(ALEXA_THERAPEUTIC_CONTENT.fallback.reprompt),
            },
          },
          card: {
            type: "Standard",
            title: ALEXA_THERAPEUTIC_CONTENT.fallback.cardTitle,
            text: ALEXA_THERAPEUTIC_CONTENT.fallback.cardText,
          },
          shouldEndSession: false,
        },
      };
    }
  }

  // Default Catch-All
  return {
    version: "1.0",
    response: {
      outputSpeech: {
        type: "SSML",
        ssml: wrapWallmikiSSML(ALEXA_THERAPEUTIC_CONTENT.fallback.speech),
      },
      reprompt: {
        outputSpeech: {
          type: "SSML",
          ssml: wrapWallmikiSSML(ALEXA_THERAPEUTIC_CONTENT.fallback.reprompt),
        },
      },
      shouldEndSession: false,
    },
  };
}
