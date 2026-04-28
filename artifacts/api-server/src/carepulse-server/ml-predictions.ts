interface HealthParams {
  age: number;
  gender: "male" | "female";
  bmi: number;
  systolicBP: number;
  diastolicBP: number;
  heartRate: number;
  bloodSugar: number;
  smoking: boolean;
  familyHistory: string[];
}

interface DiseaseRisk {
  disease: string;
  riskPercent: number;
  level: "low" | "moderate" | "high" | "critical";
  factors: string[];
  recommendations: string[];
}

interface HealthRiskResult {
  overallRisk: "low" | "moderate" | "high" | "critical";
  overallScore: number;
  predictions: DiseaseRisk[];
  generalRecommendations: string[];
}

function sigmoid(x: number): number {
  return 1 / (1 + Math.exp(-x));
}

function clamp(val: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, val));
}

function riskLevel(percent: number): "low" | "moderate" | "high" | "critical" {
  if (percent < 20) return "low";
  if (percent < 45) return "moderate";
  if (percent < 70) return "high";
  return "critical";
}

/**
 * Normalize raw clinical inputs to [0, 1] using clinically relevant ranges.
 * Weights below are designed for these normalized values — do NOT feed raw values.
 */
function normalizeInputs(p: HealthParams): Record<string, number> {
  return {
    age:         Math.min(1, Math.max(0, (p.age - 18) / 62)),          // [18, 80]
    bmi:         Math.min(1, Math.max(0, (p.bmi - 15) / 25)),          // [15, 40]
    systolicBP:  Math.min(1, Math.max(0, (p.systolicBP - 90) / 100)), // [90, 190]
    diastolicBP: Math.min(1, Math.max(0, (p.diastolicBP - 60) / 50)), // [60, 110]
    heartRate:   Math.min(1, Math.max(0, (p.heartRate - 50) / 100)),  // [50, 150]
    bloodSugar:  Math.min(1, Math.max(0, (p.bloodSugar - 70) / 200)), // [70, 270]
    smoking:     p.smoking ? 1 : 0,
    genderMale:  p.gender === "male" ? 1 : 0,
  };
}

/**
 * Weights calibrated for normalized [0,1] inputs.
 * Healthy baseline (age~25, BMI~22, BP~115/75, BS~85, non-smoker) → ~8-13% risk
 * High-risk profile (age~65, BMI~35, BP~160/100, BS~180, smoker + family) → ~85-95%
 */
const diseaseModels: Record<string, { weights: Record<string, number>; bias: number; familyKeys: string[] }> = {
  "Type 2 Diabetes": {
    weights: {
      age: 1.0, bmi: 1.2, systolicBP: 0.6, diastolicBP: 0.4,
      bloodSugar: 2.0, smoking: 0.6, familyHistory: 1.0, genderMale: 0.2, heartRate: 0.2,
    },
    bias: -2.8,
    familyKeys: ["diabetes", "type 2 diabetes", "sugar"],
  },
  "Heart Disease": {
    weights: {
      age: 1.2, bmi: 0.8, systolicBP: 1.0, diastolicBP: 0.6,
      bloodSugar: 0.8, smoking: 1.2, familyHistory: 1.2, genderMale: 0.8, heartRate: 0.5,
    },
    bias: -3.0,
    familyKeys: ["heart", "cardiac", "cardiovascular", "heart attack", "heart disease"],
  },
  "Stroke": {
    weights: {
      age: 1.5, bmi: 0.6, systolicBP: 1.4, diastolicBP: 0.8,
      bloodSugar: 0.6, smoking: 1.0, familyHistory: 1.0, genderMale: 0.4, heartRate: 0.3,
    },
    bias: -3.2,
    familyKeys: ["stroke", "brain", "cerebrovascular"],
  },
  "Hypertension": {
    weights: {
      age: 0.8, bmi: 1.0, systolicBP: 2.5, diastolicBP: 1.5,
      bloodSugar: 0.5, smoking: 0.7, familyHistory: 0.8, genderMale: 0.3, heartRate: 0.4,
    },
    bias: -3.5,
    familyKeys: ["hypertension", "high blood pressure", "bp"],
  },
  "Kidney Disease": {
    weights: {
      age: 1.0, bmi: 0.6, systolicBP: 1.0, diastolicBP: 0.8,
      bloodSugar: 1.5, smoking: 0.5, familyHistory: 0.9, genderMale: 0.2, heartRate: 0.2,
    },
    bias: -3.3,
    familyKeys: ["kidney", "renal", "kidney disease"],
  },
};

export function getFeatureImportance(): { disease: string; features: { name: string; weight: number }[] }[] {
  const featureLabels: Record<string, string> = {
    age: "Age", bmi: "BMI", systolicBP: "Systolic BP", diastolicBP: "Diastolic BP",
    heartRate: "Heart Rate", bloodSugar: "Blood Sugar", smoking: "Smoking",
    familyHistory: "Family History", genderMale: "Gender (Male)",
  };
  return Object.entries(diseaseModels).map(([disease, model]) => ({
    disease,
    features: Object.entries(model.weights)
      .map(([k, w]) => ({ name: featureLabels[k] || k, weight: Math.round(w * 1000) / 10 }))
      .sort((a, b) => b.weight - a.weight),
  }));
}

export function predictHealthRisk(params: HealthParams): HealthRiskResult {
  const predictions: DiseaseRisk[] = [];
  const norm = normalizeInputs(params);

  for (const [disease, model] of Object.entries(diseaseModels)) {
    const hasFamilyHistory = params.familyHistory.some((h) =>
      model.familyKeys.some((k) => h.toLowerCase().includes(k))
    );

    // Use normalized [0,1] inputs so weights are scale-invariant
    let z = model.bias;
    z += model.weights.age         * norm.age;
    z += model.weights.bmi         * norm.bmi;
    z += model.weights.systolicBP  * norm.systolicBP;
    z += model.weights.diastolicBP * norm.diastolicBP;
    z += model.weights.heartRate   * norm.heartRate;
    z += model.weights.bloodSugar  * norm.bloodSugar;
    z += model.weights.smoking     * norm.smoking;
    z += model.weights.familyHistory * (hasFamilyHistory ? 1 : 0);
    z += model.weights.genderMale  * norm.genderMale;

    const rawProb = sigmoid(z);
    const riskPercent = clamp(Math.round(rawProb * 100), 1, 98);

    const factors: string[] = [];
    // Indian/South Asian age thresholds — metabolic risk starts earlier
    if (params.age > 40) factors.push(`Age ${params.age} increases risk (South Asians develop metabolic diseases earlier)`);
    // Indian BMI thresholds: ≥23 overweight, ≥27.5 obese (WHO Asia-Pacific / ICMR guidelines)
    if (params.bmi >= 27.5) factors.push(`BMI ${params.bmi.toFixed(1)} (obese by Indian standard ≥27.5) significantly increases risk`);
    else if (params.bmi >= 23) factors.push(`BMI ${params.bmi.toFixed(1)} (overweight by South Asian standard ≥23) increases risk`);
    if (params.systolicBP > 140) factors.push(`High systolic BP (${params.systolicBP} mmHg) — above Stage 1 hypertension threshold`);
    else if (params.systolicBP > 130) factors.push(`Elevated systolic BP (${params.systolicBP} mmHg) — pre-hypertension`);
    if (params.diastolicBP > 90) factors.push(`High diastolic BP (${params.diastolicBP} mmHg)`);
    if (params.bloodSugar >= 126) factors.push(`Diabetic blood sugar level (${params.bloodSugar} mg/dL ≥ 126 mg/dL threshold)`);
    else if (params.bloodSugar >= 100) factors.push(`Pre-diabetic blood sugar (${params.bloodSugar} mg/dL, normal <100 mg/dL)`);
    if (params.smoking) factors.push("Smoking significantly increases cardiovascular, respiratory, and metabolic risk");
    if (hasFamilyHistory) factors.push(`Family history of ${disease} — genetic predisposition`);
    if (params.heartRate > 100) factors.push(`Elevated heart rate (${params.heartRate} bpm) — resting tachycardia`);
    else if (params.heartRate > 90) factors.push(`Mildly elevated resting heart rate (${params.heartRate} bpm)`);

    const recommendations: string[] = [];
    if (riskPercent >= 45) {
      recommendations.push(`Consult a specialist for ${disease} screening and early intervention`);
    }
    // Indian BMI threshold recommendations
    if (params.bmi >= 27.5) recommendations.push("Work with a nutritionist — target BMI <23 for South Asians (Indian standard)");
    else if (params.bmi >= 23) recommendations.push("Healthy weight management — target BMI <23 for South Asians per ICMR guidelines");
    if (params.smoking) recommendations.push("Smoking cessation is the single most impactful intervention — consult your doctor");
    if (params.systolicBP > 130 || params.diastolicBP > 85) recommendations.push("Monitor blood pressure at home daily; target <130/80 mmHg");
    if (params.bloodSugar >= 100) recommendations.push("Get HbA1c test to assess 3-month average blood sugar levels");
    if (params.heartRate > 90) recommendations.push("Aerobic exercise (brisk walking 30 min/day) helps lower resting heart rate");

    predictions.push({
      disease,
      riskPercent,
      level: riskLevel(riskPercent),
      factors: factors.length > 0 ? factors : ["No significant risk factors identified"],
      recommendations: recommendations.length > 0 ? recommendations : ["Maintain current healthy lifestyle"],
    });
  }

  predictions.sort((a, b) => b.riskPercent - a.riskPercent);

  const avgRisk = predictions.reduce((sum, p) => sum + p.riskPercent, 0) / predictions.length;
  const overallScore = Math.round(avgRisk);

  const generalRecommendations = [
    "Schedule regular health checkups — at least annually, or every 6 months if any risk factors present",
    "Follow a balanced Indian diet: include millets (ragi, jowar, bajra), legumes, vegetables, and limit refined carbs",
    "Exercise for at least 150 minutes per week — brisk walking, yoga, swimming, or cycling",
    "Get 7–8 hours of quality sleep; poor sleep increases insulin resistance and BP",
    "Stay hydrated — drink at least 2–3 liters of water daily; avoid sugary beverages",
    "Manage stress through pranayama, yoga, or meditation — high stress elevates cortisol and BP",
    "Limit sodium intake to <5g/day (average Indian diet has 10–11g/day) — reduces HTN risk",
    "Reduce tobacco and alcohol consumption; both are leading causes of preventable disease in India",
  ];

  if (params.age > 35) generalRecommendations.push("Get fasting blood sugar + lipid panel done annually — diabetes/CVD onset is earlier in Indians");
  if (params.age > 40) generalRecommendations.push("Annual cardiac and kidney function screening recommended after age 40");
  if (params.bmi >= 23) generalRecommendations.push("Target BMI <23 — South Asian overweight threshold is lower than Western standard (WHO Asia-Pacific)");
  if (params.bloodSugar >= 100) generalRecommendations.push("Consider HbA1c test — gives 3-month average blood glucose, better than single fasting reading");

  return {
    overallRisk: riskLevel(overallScore),
    overallScore,
    predictions,
    generalRecommendations,
  };
}

interface SpecialtyRecommendation {
  specialty: string;
  confidence: number;
  reason: string;
  department: string;
}

interface AppointmentRecommendation {
  urgency: "routine" | "soon" | "urgent" | "emergency";
  urgencyReason: string;
  specialties: SpecialtyRecommendation[];
  suggestedTimes: string[];
  tips: string[];
}

const symptomSpecialtyMap: Array<{ keywords: string[]; specialty: string; department: string; urgencyBoost: number }> = [
  { keywords: ["chest pain", "heart", "palpitation", "breathless", "shortness of breath"], specialty: "Cardiologist", department: "Cardiology", urgencyBoost: 2 },
  { keywords: ["headache", "migraine", "seizure", "numbness", "tingling", "dizziness", "vertigo"], specialty: "Neurologist", department: "Neurology", urgencyBoost: 1 },
  { keywords: ["skin", "rash", "acne", "eczema", "itching", "dermatitis", "psoriasis"], specialty: "Dermatologist", department: "Dermatology", urgencyBoost: 0 },
  { keywords: ["stomach", "abdomen", "nausea", "vomiting", "diarrhea", "constipation", "acid reflux", "gastric"], specialty: "Gastroenterologist", department: "Gastroenterology", urgencyBoost: 0 },
  { keywords: ["bone", "joint", "fracture", "back pain", "knee", "arthritis", "spine", "shoulder"], specialty: "Orthopedist", department: "Orthopedics", urgencyBoost: 0 },
  { keywords: ["eye", "vision", "blurry", "cataract", "glaucoma"], specialty: "Ophthalmologist", department: "Ophthalmology", urgencyBoost: 0 },
  { keywords: ["ear", "hearing", "throat", "tonsil", "sinus", "nose", "snoring"], specialty: "ENT Specialist", department: "ENT", urgencyBoost: 0 },
  { keywords: ["diabetes", "thyroid", "hormone", "blood sugar", "insulin"], specialty: "Endocrinologist", department: "Endocrinology", urgencyBoost: 0 },
  { keywords: ["kidney", "urine", "urinary", "bladder", "renal"], specialty: "Nephrologist / Urologist", department: "Nephrology", urgencyBoost: 0 },
  { keywords: ["lung", "cough", "asthma", "breathing", "pneumonia", "bronchitis", "tb", "tuberculosis"], specialty: "Pulmonologist", department: "Pulmonology", urgencyBoost: 1 },
  { keywords: ["anxiety", "depression", "stress", "insomnia", "panic", "mental health"], specialty: "Psychiatrist", department: "Psychiatry", urgencyBoost: 0 },
  { keywords: ["pregnancy", "periods", "menstrual", "gynec", "pcos", "fertility"], specialty: "Gynecologist", department: "Obstetrics & Gynecology", urgencyBoost: 0 },
  { keywords: ["child", "pediatric", "infant", "baby", "vaccination"], specialty: "Pediatrician", department: "Pediatrics", urgencyBoost: 0 },
  { keywords: ["cancer", "tumor", "lump", "biopsy", "oncology"], specialty: "Oncologist", department: "Oncology", urgencyBoost: 2 },
  { keywords: ["allergy", "allergic", "hives", "swelling", "anaphylaxis"], specialty: "Allergist / Immunologist", department: "Allergy & Immunology", urgencyBoost: 1 },
  { keywords: ["fever", "cold", "flu", "infection", "fatigue", "weakness", "general"], specialty: "General Physician", department: "General Medicine", urgencyBoost: 0 },
  { keywords: ["dental", "tooth", "teeth", "gum", "cavity"], specialty: "Dentist", department: "Dentistry", urgencyBoost: 0 },
];

const urgencyKeywords: Record<string, number> = {
  "severe": 3, "extreme": 3, "unbearable": 3, "emergency": 4, "sudden": 2, "sharp": 2,
  "blood": 2, "bleeding": 3, "fainted": 3, "unconscious": 4, "paralysis": 4,
  "can't breathe": 4, "chest pain": 3, "stroke": 4, "heart attack": 4,
  "high fever": 2, "persistent": 1, "chronic": 1, "worsening": 2, "spreading": 1,
};

export function recommendAppointment(symptoms: string, age?: number, gender?: string): AppointmentRecommendation {
  const symptomsLower = symptoms.toLowerCase();

  const matchedSpecialties: SpecialtyRecommendation[] = [];
  for (const entry of symptomSpecialtyMap) {
    const matchedKws = entry.keywords.filter((kw) => symptomsLower.includes(kw));
    if (matchedKws.length > 0) {
      const confidence = Math.min(95, 50 + matchedKws.length * 15);
      matchedSpecialties.push({
        specialty: entry.specialty,
        confidence,
        reason: `Symptoms match: ${matchedKws.join(", ")}`,
        department: entry.department,
      });
    }
  }

  if (matchedSpecialties.length === 0) {
    matchedSpecialties.push({
      specialty: "General Physician",
      confidence: 70,
      reason: "General consultation recommended for symptom evaluation",
      department: "General Medicine",
    });
  }

  matchedSpecialties.sort((a, b) => b.confidence - a.confidence);

  let urgencyScore = 0;
  for (const [kw, score] of Object.entries(urgencyKeywords)) {
    if (symptomsLower.includes(kw)) urgencyScore += score;
  }
  if (age && age > 60) urgencyScore += 1;

  for (const entry of symptomSpecialtyMap) {
    if (entry.keywords.some((kw) => symptomsLower.includes(kw))) {
      urgencyScore += entry.urgencyBoost;
    }
  }

  let urgency: "routine" | "soon" | "urgent" | "emergency";
  let urgencyReason: string;
  if (urgencyScore >= 6) {
    urgency = "emergency";
    urgencyReason = "Symptoms suggest a potentially serious condition. Seek immediate medical attention.";
  } else if (urgencyScore >= 4) {
    urgency = "urgent";
    urgencyReason = "Symptoms require prompt medical evaluation. Book within 24-48 hours.";
  } else if (urgencyScore >= 2) {
    urgency = "soon";
    urgencyReason = "Schedule an appointment within the next few days.";
  } else {
    urgency = "routine";
    urgencyReason = "A routine appointment at your convenience is recommended.";
  }

  const suggestedTimes = [
    "Morning (9:00 AM - 11:00 AM) — Best for fasting tests and fresh consultations",
    "Late Morning (11:00 AM - 1:00 PM) — Good availability, shorter wait times",
    "Afternoon (2:00 PM - 4:00 PM) — Suitable for follow-up visits",
  ];

  if (urgency === "emergency" || urgency === "urgent") {
    suggestedTimes.unshift("Earliest available slot — prioritize immediate booking");
  }

  const tips: string[] = [
    "Bring a list of all current medications",
    "Note the duration and frequency of your symptoms",
    "Bring previous medical reports or test results if available",
  ];

  if (symptomsLower.includes("blood") || symptomsLower.includes("test")) {
    tips.push("Fast for 8-12 hours if blood tests may be required");
  }

  return {
    urgency,
    urgencyReason,
    specialties: matchedSpecialties.slice(0, 5),
    suggestedTimes,
    tips,
  };
}

interface TrendPoint {
  diseaseName: string;
  location: string;
  caseCount: number;
  timestamp: Date | string | null;
}

interface OutbreakPrediction {
  disease: string;
  currentCases: number;
  predictedCases: number;
  trend: "rising" | "falling" | "stable";
  growthRate: number;
  riskLevel: "low" | "moderate" | "high" | "critical";
  locations: string[];
  prediction: string;
}

export function predictOutbreaks(trendData: TrendPoint[]): OutbreakPrediction[] {
  const validData = trendData.filter((p) => p.timestamp !== null);
  const diseaseGroups: Record<string, TrendPoint[]> = {};
  for (const point of validData) {
    if (!diseaseGroups[point.diseaseName]) {
      diseaseGroups[point.diseaseName] = [];
    }
    diseaseGroups[point.diseaseName].push(point);
  }

  const predictions: OutbreakPrediction[] = [];

  for (const [disease, points] of Object.entries(diseaseGroups)) {
    const sortedPoints = [...points].sort(
      (a, b) => new Date(a.timestamp as string).getTime() - new Date(b.timestamp as string).getTime()
    );

    const totalCases = sortedPoints.reduce((sum, p) => sum + p.caseCount, 0);
    const avgCases = totalCases / sortedPoints.length;

    const locations = [...new Set(sortedPoints.map((p) => p.location))];

    let trend: "rising" | "falling" | "stable" = "stable";
    let growthRate = 0;
    let predictedCases = Math.round(avgCases);

    if (sortedPoints.length >= 2) {
      const n = sortedPoints.length;
      const xVals = sortedPoints.map((_, i) => i);
      const yVals = sortedPoints.map((p) => p.caseCount);

      const xMean = xVals.reduce((a, b) => a + b, 0) / n;
      const yMean = yVals.reduce((a, b) => a + b, 0) / n;

      let numerator = 0;
      let denominator = 0;
      for (let i = 0; i < n; i++) {
        numerator += (xVals[i] - xMean) * (yVals[i] - yMean);
        denominator += (xVals[i] - xMean) ** 2;
      }

      const slope = denominator !== 0 ? numerator / denominator : 0;
      const intercept = yMean - slope * xMean;

      predictedCases = Math.max(0, Math.round(intercept + slope * (n + 2)));
      growthRate = avgCases > 0 ? Math.round((slope / avgCases) * 100) : 0;

      if (growthRate > 5) trend = "rising";
      else if (growthRate < -5) trend = "falling";
      else trend = "stable";
    }

    let outbreakRisk: "low" | "moderate" | "high" | "critical";
    if (predictedCases > avgCases * 1.5 || totalCases > 2000) outbreakRisk = "critical";
    else if (predictedCases > avgCases * 1.2 || totalCases > 1000) outbreakRisk = "high";
    else if (trend === "rising") outbreakRisk = "moderate";
    else outbreakRisk = "low";

    let prediction = "";
    if (trend === "rising") {
      prediction = `${disease} cases are projected to increase to approximately ${predictedCases} in the coming period. Active monitoring and preventive measures recommended in ${locations.join(", ")}.`;
    } else if (trend === "falling") {
      prediction = `${disease} cases show a declining trend, projected at ${predictedCases}. Continue current containment measures.`;
    } else {
      prediction = `${disease} cases remain stable at approximately ${predictedCases}. Maintain routine surveillance in ${locations.join(", ")}.`;
    }

    predictions.push({
      disease,
      currentCases: totalCases,
      predictedCases,
      trend,
      growthRate,
      riskLevel: outbreakRisk,
      locations,
      prediction,
    });
  }

  predictions.sort((a, b) => b.currentCases - a.currentCases);

  return predictions;
}
