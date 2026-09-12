import React, { useState, useEffect } from "react";
import {
  Activity,
  ShieldAlert,
  ShieldCheck,
  Percent,
  CheckCircle2,
  FileCheck,
  TrendingUp,
  AlertTriangle,
  Scale,
  Brain,
  Pill,
  Sparkles,
  ArrowRight,
  Info
} from "lucide-react";
import { ScoringResult } from "../types";

interface DrugScoringEngineProps {
  onApplyContextToChat?: (drugName: string, dailyDose: number) => void;
}

export const DrugScoringEngine: React.FC<DrugScoringEngineProps> = ({
  onApplyContextToChat,
}) => {
  // Input parameters
  const [selectedDrug, setSelectedDrug] = useState("Olanzapine");
  const [dailyDoseMg, setDailyDoseMg] = useState(10);
  const [durationWeeks, setDurationWeeks] = useState(24);
  const [baselineSeverity, setBaselineSeverity] = useState(55); // PANSS scale 0-100
  const [selectedSideEffects, setSelectedSideEffects] = useState<string[]>([
    "metabolic_weight",
    "sedation_drowsiness",
  ]);
  const [selectedTherapies, setSelectedTherapies] = useState<string[]>([
    "vayu_pranayama",
    "sound_therapy",
    "mindfulness_cbt",
  ]);

  const [loading, setLoading] = useState(false);
  const [scoringResult, setScoringResult] = useState<ScoringResult | null>(null);

  // Available drug profiles
  const drugsCatalog = [
    { name: "Olanzapine", defaultDose: 10, maxDose: 20, unit: "mg", commonFor: "Schizophrenia, Bipolar mania" },
    { name: "Risperidone", defaultDose: 4, maxDose: 16, unit: "mg", commonFor: "Psychosis, agitation" },
    { name: "Aripiprazole", defaultDose: 15, maxDose: 30, unit: "mg", commonFor: "Schizophrenia, partial D2 agonist" },
    { name: "Quetiapine", defaultDose: 300, maxDose: 800, unit: "mg", commonFor: "Schizophrenia, heavy sedative" },
    { name: "Haloperidol", defaultDose: 5, maxDose: 20, unit: "mg", commonFor: "First-generation typical antipsychotic" },
    { name: "Clozapine", defaultDose: 250, maxDose: 900, unit: "mg", commonFor: "Refractory schizophrenia" },
    { name: "Ziprasidone", defaultDose: 80, maxDose: 160, unit: "mg", commonFor: "Atypical antipsychotic" },
  ];

  const sideEffectsOptions = [
    { id: "metabolic_weight", label: "Metabolic Strain & Weight Gain" },
    { id: "sedation_drowsiness", label: "Heavy Sedation & Chronic Daytime Fatigue" },
    { id: "eps_tremors", label: "Extrapyramidal Symptoms (EPS / Motor Restlessness)" },
    { id: "cognitive_blunting", label: "Emotional Flattening & Cognitive Fog" },
    { id: "anticholinergic", label: "Anticholinergic Effects (Dry Mouth, Constipation)" },
    { id: "prolactin_elevation", label: "Endocrine Dysregulation / Prolactin Elevation" },
  ];

  const alternativeTherapiesCatalog = [
    {
      id: "vayu_pranayama",
      name: "Vayu Vaidya Rhythmic Pranayama",
      type: "Vagal Autonomic Pacing",
      evidence: "Stimulates parasympathetic acetylcholine release; dampens hyperdopaminergic anxiety",
    },
    {
      id: "sound_therapy",
      name: "528Hz / 432Hz Acoustic Entrainment",
      type: "Auditory Cortex Gating",
      evidence: "Soothes auditory perceptual distortion; strengthens gamma/theta phase synchronization",
    },
    {
      id: "mindfulness_cbt",
      name: "5-4-3-2-1 Sensory Reality Anchoring",
      type: "Cognitive Somatics",
      evidence: "Gold standard reality orientation; dispels dissociative depersonalization",
    },
    {
      id: "ayurvedic_herbs",
      name: "Ayurvedic Medhya Rasayana (Brahmi / Ashwagandha)",
      type: "Neuro-Adaptogen",
      evidence: "Anti-neuroinflammatory; enhances BDNF neurogenesis without D2 blockade",
    },
    {
      id: "circadian_light",
      name: "Circadian Rhythm Phototherapy",
      type: "Pineal Gating",
      evidence: "Regulates REM-NREM sleep architecture; prevents nocturnal psychosis exacerbation",
    },
  ];

  const toggleSideEffect = (id: string) => {
    setSelectedSideEffects((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleTherapy = (id: string) => {
    setSelectedTherapies((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleDrugChange = (drugName: string) => {
    setSelectedDrug(drugName);
    const found = drugsCatalog.find((d) => d.name === drugName);
    if (found) {
      setDailyDoseMg(found.defaultDose);
    }
  };

  // Run scoring calculation
  const calculateScore = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/score-therapy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          drugName: selectedDrug,
          dailyDoseMg,
          durationWeeks,
          sideEffects: selectedSideEffects,
          alternativeTherapies: selectedTherapies,
          baselineSymptomSeverity: baselineSeverity,
        }),
      });

      const data = await res.json();
      setScoringResult(data);

      if (onApplyContextToChat) {
        onApplyContextToChat(selectedDrug, dailyDoseMg);
      }
    } catch (e) {
      console.error("Scoring error:", e);
    } finally {
      setLoading(false);
    }
  };

  // Auto calculate on initial load
  useEffect(() => {
    calculateScore();
  }, [selectedDrug]);

  const activeDrug = drugsCatalog.find((d) => d.name === selectedDrug);

  return (
    <div className="space-y-6">
      {/* Overview Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-cyan-950/30 border border-slate-800 relative overflow-hidden">
        <div className="max-w-3xl space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-medium bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
              Vayu Vaidya Clinical Algorithm v2.1
            </span>
            <span className="text-xs text-slate-400">• Milwaukee, WI Project</span>
          </div>
          <h2 className="text-xl font-bold text-slate-100 font-display">
            Drug Therapy Replacement & Alternative Efficacy Scoring Engine
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            Algorithmic scoring model designed to objectively measure conventional antipsychotic drug burden
            against the neuro-stabilizing efficacy of Vayu Vaidya alternative therapies. Formulates a clinically
            gated stepwise tapering protocol for safe psychiatric transitions.
          </p>
        </div>
      </div>

      {/* Main 2-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Clinical Inputs & Selectors */}
        <div className="lg:col-span-6 space-y-6">
          {/* 1. Pharmaceutical Regimen Card */}
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  <Pill className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-200">
                    Conventional Antipsychotic Regimen
                  </h3>
                  <p className="text-xs text-slate-400">Current prescribed drug therapy</p>
                </div>
              </div>
              <span className="text-xs font-mono text-cyan-400 bg-slate-950 px-2 py-1 rounded border border-slate-800">
                CPZ Eq Calculated
              </span>
            </div>

            {/* Drug Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">Medication Name</label>
              <select
                value={selectedDrug}
                onChange={(e) => handleDrugChange(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-200 focus:outline-none focus:border-cyan-500"
              >
                {drugsCatalog.map((drug) => (
                  <option key={drug.name} value={drug.name}>
                    {drug.name} ({drug.commonFor})
                  </option>
                ))}
              </select>
            </div>

            {/* Dose and Duration Sliders */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Daily Dosage</span>
                  <span className="font-mono text-cyan-400 font-semibold">
                    {dailyDoseMg} {activeDrug?.unit} / day
                  </span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={activeDrug?.maxDose || 30}
                  step={selectedDrug === "Risperidone" || selectedDrug === "Haloperidol" ? 0.5 : 2.5}
                  value={dailyDoseMg}
                  onChange={(e) => setDailyDoseMg(Number(e.target.value))}
                  className="w-full accent-cyan-400 h-1.5 bg-slate-800 rounded cursor-pointer"
                />
                <span className="text-[10px] text-slate-500">
                  Max typical dose: {activeDrug?.maxDose} {activeDrug?.unit}
                </span>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Duration on Drug</span>
                  <span className="font-mono text-cyan-400 font-semibold">{durationWeeks} weeks</span>
                </div>
                <input
                  type="range"
                  min={2}
                  max={104}
                  value={durationWeeks}
                  onChange={(e) => setDurationWeeks(Number(e.target.value))}
                  className="w-full accent-cyan-400 h-1.5 bg-slate-800 rounded cursor-pointer"
                />
                <span className="text-[10px] text-slate-500">
                  {Math.round(durationWeeks / 4.3)} months duration
                </span>
              </div>
            </div>

            {/* Side Effects Checklist */}
            <div className="space-y-2 pt-2 border-t border-slate-800/80">
              <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                Active Adverse Side-Effect Burden
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {sideEffectsOptions.map((se) => {
                  const isChecked = selectedSideEffects.includes(se.id);
                  return (
                    <button
                      key={se.id}
                      type="button"
                      onClick={() => toggleSideEffect(se.id)}
                      className={`text-left p-2.5 rounded-xl border text-xs transition-all flex items-start gap-2 ${
                        isChecked
                          ? "bg-amber-500/10 border-amber-500/30 text-amber-200"
                          : "bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700"
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded mt-0.5 flex items-center justify-center shrink-0 border ${
                          isChecked
                            ? "bg-amber-500 border-amber-500 text-slate-950"
                            : "border-slate-700"
                        }`}
                      >
                        {isChecked && <CheckCircle2 className="w-3.5 h-3.5" />}
                      </div>
                      <span className="leading-tight">{se.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* 2. Alternative Therapies Prescribed Card */}
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-200">
                  Prescribed Alternative Therapies
                </h3>
                <p className="text-xs text-slate-400">
                  Vayu Vaidya neuro-stabilizing protocols
                </p>
              </div>
            </div>

            <div className="space-y-2.5">
              {alternativeTherapiesCatalog.map((t) => {
                const isSelected = selectedTherapies.includes(t.id);
                return (
                  <div
                    key={t.id}
                    onClick={() => toggleTherapy(t.id)}
                    className={`p-3 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? "bg-emerald-500/10 border-emerald-500/30 text-slate-200 shadow-sm shadow-emerald-500/5"
                        : "bg-slate-950/40 border-slate-800/80 text-slate-400 hover:border-slate-700"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-4 h-4 rounded flex items-center justify-center shrink-0 border ${
                            isSelected
                              ? "bg-emerald-500 border-emerald-500 text-slate-950"
                              : "border-slate-700"
                          }`}
                        >
                          {isSelected && <CheckCircle2 className="w-3.5 h-3.5" />}
                        </div>
                        <span className="text-xs font-semibold text-slate-100">{t.name}</span>
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-emerald-300 border border-emerald-500/20">
                        {t.type}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1 pl-6 leading-relaxed">
                      {t.evidence}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Baseline Severity Slider */}
            <div className="pt-3 border-t border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Brain className="w-3.5 h-3.5 text-purple-400" />
                  Baseline Symptom Severity (PANSS Score Equivalent)
                </span>
                <span className="font-mono text-purple-400 font-semibold">{baselineSeverity} / 100</span>
              </div>
              <input
                type="range"
                min={10}
                max={95}
                value={baselineSeverity}
                onChange={(e) => setBaselineSeverity(Number(e.target.value))}
                className="w-full accent-purple-400 h-1.5 bg-slate-800 rounded cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>Mild (10-30)</span>
                <span>Moderate (31-60)</span>
                <span>Severe (61-95)</span>
              </div>
            </div>

            <button
              type="button"
              onClick={calculateScore}
              disabled={loading}
              className="w-full py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-sm transition-all shadow-md shadow-cyan-500/20 flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? (
                <Activity className="w-4 h-4 animate-spin" />
              ) : (
                <Scale className="w-4 h-4" />
              )}
              <span>Run Vayu Vaidya Replacement Scoring Algorithm</span>
            </button>
          </div>
        </div>

        {/* Right Column: Algorithmic Output & Replacement Recommendation */}
        <div className="lg:col-span-6 space-y-6">
          {scoringResult ? (
            <>
              {/* Scorecard Primary Header */}
              <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-5">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-cyan-400" />
                    Algorithmic Replacement Feasibility
                  </h3>
                  <span className="text-xs font-mono text-slate-400">
                    Code: VV-ALGO-2017
                  </span>
                </div>

                {/* Main Gauge & Big Metrics */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {/* Readiness Index */}
                  <div className="p-3.5 rounded-xl bg-slate-950 border border-cyan-500/30 text-center space-y-1">
                    <span className="text-[11px] text-slate-400">Readiness Score</span>
                    <div className="text-2xl font-bold text-cyan-400 font-mono">
                      {scoringResult.replacementIndex.readinessScore}%
                    </div>
                    <span className="text-[10px] text-cyan-500/80 block">Replacement Potential</span>
                  </div>

                  {/* Alternative Efficacy */}
                  <div className="p-3.5 rounded-xl bg-slate-950 border border-emerald-500/30 text-center space-y-1">
                    <span className="text-[11px] text-slate-400">Alt. Efficacy Score</span>
                    <div className="text-2xl font-bold text-emerald-400 font-mono">
                      {scoringResult.alternativeTherapyAnalysis.alternativeEfficacyScore}%
                    </div>
                    <span className="text-[10px] text-emerald-500/80 block">Neural Stability</span>
                  </div>

                  {/* Drug Burden */}
                  <div className="p-3.5 rounded-xl bg-slate-950 border border-amber-500/30 text-center space-y-1 col-span-2 sm:col-span-1">
                    <span className="text-[11px] text-slate-400">Drug Burden Load</span>
                    <div className="text-2xl font-bold text-amber-400 font-mono">
                      {scoringResult.drugAnalysis.drugBurdenScore}%
                    </div>
                    <span className="text-[10px] text-amber-500/80 block">
                      {scoringResult.drugAnalysis.chlorpromazineEquivalentMg}mg CPZ Eq
                    </span>
                  </div>
                </div>

                {/* Current Safe Titration Phase Box */}
                <div className="p-4 rounded-xl bg-gradient-to-br from-slate-950 to-cyan-950/20 border border-cyan-500/20 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-cyan-400" />
                      Algorithmic Titration Recommendation
                    </span>
                    <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                      {scoringResult.replacementIndex.taperingRateAllowed}
                    </span>
                  </div>
                  <h4 className="text-base font-bold text-slate-100">
                    {scoringResult.replacementIndex.phase}
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {scoringResult.replacementIndex.phaseDescription}
                  </p>
                </div>

                {/* Subsystem Telemetry Bars */}
                <div className="space-y-3 pt-2">
                  <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Efficacy & Neuro-Vagal Biomarkers
                  </h4>

                  {/* Vagal Tone Support */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-300">Vagal Tone Stimulation (Pranayama):</span>
                      <span className="font-mono text-emerald-400">
                        {scoringResult.alternativeTherapyAnalysis.vagalToneSupport}%
                      </span>
                    </div>
                    <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                      <div
                        className="h-full bg-emerald-400 rounded-full transition-all duration-500"
                        style={{ width: `${scoringResult.alternativeTherapyAnalysis.vagalToneSupport}%` }}
                      />
                    </div>
                  </div>

                  {/* Cognitive Clarity Index */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-300">Cognitive Clarity & Reality Gating:</span>
                      <span className="font-mono text-cyan-400">
                        {scoringResult.alternativeTherapyAnalysis.cognitiveClarityIndex}%
                      </span>
                    </div>
                    <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                      <div
                        className="h-full bg-cyan-400 rounded-full transition-all duration-500"
                        style={{ width: `${scoringResult.alternativeTherapyAnalysis.cognitiveClarityIndex}%` }}
                      />
                    </div>
                  </div>

                  {/* Symptom Alleviation Potential */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-300">Non-Pharmacological Symptom Relief:</span>
                      <span className="font-mono text-indigo-400">
                        {scoringResult.alternativeTherapyAnalysis.symptomAlleviationPotential}%
                      </span>
                    </div>
                    <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                      <div
                        className="h-full bg-indigo-400 rounded-full transition-all duration-500"
                        style={{ width: `${scoringResult.alternativeTherapyAnalysis.symptomAlleviationPotential}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Safety Protocol Checklist */}
              <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-200">
                  <ShieldAlert className="w-4 h-4 text-amber-400" />
                  Mandatory Clinical Safety Guardrails
                </div>
                <ul className="space-y-2 text-xs text-slate-300">
                  {scoringResult.replacementIndex.safetyChecklist.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2 leading-relaxed">
                      <span className="text-cyan-400 font-bold">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 text-[11px] text-slate-400 flex items-start gap-2 mt-2">
                  <Info className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                  <span>
                    <strong>Clinician Note:</strong> This replacement algorithm operates under the Vayu Vaidya integrative framework. Any dose modifications must be verified and executed under the direct oversight of a licensed psychiatrist.
                  </span>
                </div>
              </div>
            </>
          ) : (
            <div className="p-12 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col items-center justify-center text-center text-slate-400 space-y-3">
              <Scale className="w-8 h-8 text-cyan-400 animate-pulse" />
              <p className="text-sm font-medium">Click "Run Replacement Scoring Algorithm" to compute analysis.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
