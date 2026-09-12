export type NavigationTab = 
  | "holoprojector"
  | "chat"
  | "canvas"
  | "art-therapy"
  | "schizo-os"
  | "scoring"
  | "therapies"
  | "java-bridge";

export interface BotMediaItem {
  id: string;
  title: string;
  category: string;
  type: "geometry" | "architecture" | "landscape" | "verse" | "soundscape";
  description: string;
  colorTone: string;
  ambientFreq?: number;
  tags?: string[];
  quote?: string;
}

export interface Message {
  id: string;
  sender: "user" | "wallmiki" | "mother-divine";
  text: string;
  timestamp: string;
  isSimulated?: boolean;
  groundingScore?: number;
  therapyMode?: string;
  suggestedMedia?: BotMediaItem;
  wellnessExercise?: {
    type: "cbt-distortion" | "micbt-body-scan" | "autopilot-check" | "thought-challenge";
    title: string;
    description: string;
    options?: string[];
  };
}

export interface TherapyProtocol {
  id: string;
  name: string;
  category: string;
  efficacyRating: number;
  durationMinutes: number;
  summary: string;
  instructions: string[];
  targetSymptoms: string[];
  evidenceLevel: string;
}

export interface DrugAnalysis {
  drugName: string;
  dailyDoseMg: number;
  durationWeeks: number;
  drugBurdenScore: number;
  chlorpromazineEquivalentMg: number;
  sideEffectBurden: {
    epsRisk: number;
    metabolicRisk: number;
    sedationRisk: number;
  };
}

export interface AlternativeTherapyAnalysis {
  activeTherapiesCount: number;
  alternativeEfficacyScore: number;
  vagalToneSupport: number;
  cognitiveClarityIndex: number;
  symptomAlleviationPotential: number;
}

export interface ReplacementIndex {
  readinessScore: number;
  phase: string;
  phaseDescription: string;
  taperingRateAllowed: string;
  safetyChecklist: string[];
}

export interface ScoringResult {
  drugAnalysis: DrugAnalysis;
  alternativeTherapyAnalysis: AlternativeTherapyAnalysis;
  replacementIndex: ReplacementIndex;
  algorithmMetadata: {
    version: string;
    developedAt: string;
    validatedDate: string;
  };
}

export interface SystemStatus {
  project: string;
  location: string;
  timeline: string;
  domain: string;
  platform: {
    runtime: string;
    os: string;
    hyperThreads: {
      activeThreads: number;
      corePoolSize: number;
      maxPoolSize: number;
      taskQueueSize: number;
      threadEfficiency: string;
    };
    digitalHumanEngine: {
      avatarId: string;
      renderingPipeline: string;
      speechSyncLatencyMs: number;
      frameRate: number;
    };
    holoprojectorHardware: {
      equipmentType: string;
      projectionAngle: string;
      luxOutput: number;
      matrixResolution: string;
      activeFocalPlane: string;
    };
    nlpEngine: {
      model: string;
      customTherapiesLoaded: number;
      drugScoringAlgorithms: string;
    };
  };
}

// schizoOS & Cognitive Architecture Types
export type ConsciousnessPlane = "autopilot" | "manas" | "chitta" | "buddhi" | "bodhichitta";

export interface SchizoOSNode {
  id: string;
  label: string;
  type: "trigger" | "autopilot_loop" | "distortion" | "buddhi_discernment" | "bodhichitta_anchor" | "somatic_sensation";
  plane: ConsciousnessPlane;
  x: number;
  y: number;
  intensity: number; // 1-10
  notes?: string;
  color?: string;
}

export interface SchizoOSTransition {
  id: string;
  from: string; // node id
  to: string;   // node id
  label: string;
  triggerCondition: string;
  habitStrength: number; // 1-10 (how habitual this autopilot transition is)
}

export interface AutopilotPatternPreset {
  id: string;
  title: string;
  description: string;
  behavioralPattern: string;
  designPatternName: string; // e.g., "Recursive Error Loop", "Feedback Amplification", "Circuit Breaker Awakening"
  chittaAutopilotContrast: string;
  buddhiResolution: string;
  nodes: SchizoOSNode[];
  transitions: SchizoOSTransition[];
}

// Art Therapy & State Pod Automatism Types
export interface ColorClusterMetric {
  name: string;
  hex: string;
  percentage: number;
  symbolism: string;
  emotionalResonance: string;
  feministArtPerspective: string;
}

export interface StatePodAnalysis {
  automatismIndex: number; // 0-100% measure of subconscious automatic stroke rhythm
  gesturalSpeed: string;
  dominantClusters: ColorClusterMetric[];
  subconsciousTone: string;
  somaticFeedback: string;
  feministEmpowermentInterpretation: string;
  catharsisScore: number;
  buddhiRecommendation: string;
}
