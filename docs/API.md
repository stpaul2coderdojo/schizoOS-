# Vayu Vaidya • Wallmiki REST API Reference

The backend exposes a JSON REST API on port `3000` (or `PORT` configured in environment). All requests and responses use standard `application/json` headers.

---

## 1. System Endpoints

### 1.1. Health Check
* **Method**: `GET`
* **Path**: `/api/health`
* **Description**: Verifies service status, uptime, and Gemini API key configuration.

#### Response:
```json
{
  "status": "ok",
  "hasApiKey": true,
  "botName": "Wallmiki",
  "timestamp": "2026-09-12T09:22:15.000Z"
}
```

---

### 1.2. Java Bridge & System Status
* **Method**: `GET`
* **Path**: `/api/system-status`
* **Description**: Returns simulated Java 1.8 SE8 multithreading telemetry and 45° optical prism holoprojector hardware parameters.

#### Response:
```json
{
  "project": "Vayu Vaidya - Wallmiki E-Psychiatrist",
  "location": "Milwaukee, WI",
  "timeline": "December 2017 to Present",
  "domain": "www.vayuvaidya.info",
  "platform": {
    "runtime": "Java 1.8 (SE8) / Eclipse IDE HyperThreads & Node.js Cloud",
    "os": "Windows 10 / Cloud Linux Container",
    "hyperThreads": {
      "activeThreads": 8,
      "corePoolSize": 12,
      "maxPoolSize": 24,
      "taskQueueSize": 0,
      "threadEfficiency": "98.4%"
    },
    "digitalHumanEngine": {
      "avatarId": "Wallmiki-V3.4",
      "voiceProfile": "Ethereal Low Resonant Baritone (108Hz / 432Hz)",
      "renderingPipeline": "Holographic Prism Shader 45° Refraction",
      "speechSyncLatencyMs": 18,
      "frameRate": 60
    },
    "holoprojectorHardware": {
      "equipmentType": "Optical Pyramid Prism / 4-Faced Reflection Stage",
      "projectionAngle": "45.0 degrees",
      "luxOutput": 1450,
      "matrixResolution": "1080p Ultra-Clear Anti-Glare",
      "activeFocalPlane": "Center Z-Axis +12cm"
    }
  }
}
```

---

## 2. Clinical Content Endpoints

### 2.1. Bot Media Projections
* **Method**: `GET`
* **Path**: `/api/bot-media`
* **Description**: Retrieves the curated library of therapeutic mandalas, schizoOS circuit maps, and restorative landscapes.

#### Response:
```json
{
  "media": [
    {
      "id": "mandala-buddhi",
      "title": "Sri Yantra of Higher Discernment (Buddhi)",
      "category": "Sacred Geometry & Mandalas",
      "type": "geometry",
      "description": "Nine interlocking triangles radiating cosmic order, focusing scattered thoughts into single-pointed Buddhi clarity.",
      "colorTone": "#8b5cf6",
      "ambientFreq": 528,
      "tags": ["mandala", "geometry", "clarity", "buddhi"]
    },
    {
      "id": "mandala-lotus",
      "title": "Lotus of Bodhichitta Sanctuary",
      "category": "Sacred Geometry & Mandalas",
      "type": "geometry",
      "description": "An unfolding 12-petaled lotus representing the compassionate, loving-kindness heart space beyond fearful rumination.",
      "colorTone": "#06b6d4",
      "ambientFreq": 432,
      "tags": ["lotus", "compassion", "bodhichitta", "heart"]
    },
    {
      "id": "schizo-os-map",
      "title": "schizoOS Autopilot vs. Buddhi Circuit Map",
      "category": "Cognitive Architecture",
      "type": "architecture",
      "description": "Interactive visual map delineating the reflex Autopilot loop, Manas sensory gate, Chitta lake, and Buddhi mindful witness.",
      "colorTone": "#3b82f6",
      "ambientFreq": 432,
      "tags": ["schizoos", "autopilot", "brain", "dr-anil-k"]
    }
  ]
}
```

---

### 2.2. Therapy Protocols
* **Method**: `GET`
* **Path**: `/api/therapy-protocols`
* **Description**: Returns clinical guidance protocols across Woebot CBT, MiCBT, schizoOS, State Pod Automatism, and Vayu Pranayama.

#### Response:
```json
{
  "protocols": [
    {
      "id": "cbt-woebot",
      "name": "Woebot-Style Cognitive Restructuring (CBT)",
      "category": "Cognitive Mental Wellness",
      "efficacyRating": 93,
      "durationMinutes": 12,
      "summary": "Friendly, conversational cognitive behavioral therapy to catch Automatic Negative Thoughts (ANTs) and cognitive distortions.",
      "instructions": [
        "Notice the activating event or thought causing emotional drop.",
        "Identify the distortion: Catastrophizing, Mind Reading, Black-and-White Thinking, or Emotional Reasoning.",
        "Examine the evidence for and against the thought with Wallmiki.",
        "Formulate an objective, compassionate reframe and rate distress reduction."
      ],
      "targetSymptoms": ["Automatic negative loops", "Catastrophizing", "Depressive rumination", "Social anxiety"],
      "evidenceLevel": "Very High (Standard-of-care empirical CBT)"
    }
  ]
}
```

---

## 3. Interaction Endpoints

### 3.1. E-Psychiatrist Dialogue
* **Method**: `POST`
* **Path**: `/api/chat`
* **Description**: Processes user input through Gemini 2.5 Flash with the Wallmiki therapeutic system instruction, returning therapeutic reflections, grounding metrics, and optional interactive canvas media suggestions.

#### Request Body:
```json
{
  "message": "I feel caught in an autopilot worry loop about what people think of me.",
  "therapyMode": "cbt",
  "history": [],
  "patientContext": {
    "drugName": "Olanzapine",
    "dailyDoseMg": 10,
    "activeTherapies": ["vayu_pranayama", "sound_therapy"]
  }
}
```

#### Response:
```json
{
  "text": "Greetings, traveler of mind and breath. Let my voice anchor you in this moment. What you are experiencing is the autopilot habit of 'Mind Reading'—assuming you know the hidden judgments of others without direct evidence. Let us pause and take a long breath together...",
  "isSimulated": false,
  "isTemporaryFallback": false,
  "suggestions": [
    "What is the concrete evidence for this thought?",
    "Project a sacred mandala onto the canvas to calm my racing mind",
    "Guide me through a 4-4-6-2 Pranayama breath"
  ],
  "suggestedMedia": null,
  "groundingScore": 92,
  "timestamp": "2026-09-12T09:22:15.000Z"
}
```

---

### 3.2. Medication & Alternative Therapy Scoring
* **Method**: `POST`
* **Path**: `/api/score-therapy`
* **Description**: Evaluates medication burden and alternative therapy efficacy to formulate safe tapering readiness and phase recommendations.

#### Request Body:
```json
{
  "drugName": "Olanzapine",
  "dailyDoseMg": 10,
  "durationWeeks": 24,
  "sideEffects": ["weight_gain", "sedation"],
  "alternativeTherapies": ["vayu_pranayama", "sound_therapy", "mindfulness_cbt"],
  "baselineSymptomSeverity": 50
}
```

#### Response:
```json
{
  "drugBurdenScore": 58,
  "alternativeEfficacyScore": 76,
  "replacementReadinessScore": 68,
  "titrationPhase": "Phase 2: Supported Micro-Tapering (5-10% reductions)",
  "phaseDescription": "Sufficient neural stability established. Collaborate with psychiatrist for gradual reduction while sustaining daily Vayu Pranayama and art automatism sessions."
}
```
