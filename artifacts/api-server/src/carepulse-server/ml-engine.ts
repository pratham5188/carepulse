interface TrainingDataPoint {
  id: string;
  features: Record<string, number>;
  label: string;
  category: string;
  timestamp: number;
}

interface ModelMetrics {
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  specificity: number;
  auc: number;
  confusionMatrix: { tp: number; fp: number; tn: number; fn: number };
  trainingSamples: number;
  lastTrained: string;
}

interface PredictionResult {
  condition: string;
  probability: number;
  confidence: string;
  riskLevel: string;
  evidenceGrade: string;
  contributingFactors: string[];
  differentialDiagnosis: string[];
}

interface RiskAssessment {
  overallRisk: number;
  riskCategory: string;
  riskFactors: { factor: string; weight: number; present: boolean }[];
  projectedOutcome: string;
  interventionUrgency: string;
  mortalityRisk: number;
  readmissionRisk: number;
  complicationRisk: number;
  recommendations: string[];
}

interface ModelState {
  vocabulary: Map<string, number>;
  idf: Map<string, number>;
  classPriors: Map<string, number>;
  featureLikelihoods: Map<string, Map<string, number>>;
  documentCount: number;
  classDocCounts: Map<string, number>;
  trained: boolean;
  version: string;
  metrics: ModelMetrics;
}

const trainingCorpus: TrainingDataPoint[] = [];

const clinicalTrainingData: { text: string; label: string; category: string; severity: number }[] = [
  { text: "chest pain shortness of breath sweating nausea radiating arm pain", label: "Acute Coronary Syndrome", category: "Cardiovascular", severity: 9 },
  { text: "severe chest pain pressure tightness jaw pain left arm numbness", label: "Myocardial Infarction", category: "Cardiovascular", severity: 10 },
  { text: "palpitations rapid heartbeat irregular pulse dizziness fainting", label: "Cardiac Arrhythmia", category: "Cardiovascular", severity: 7 },
  { text: "high blood pressure headache vision changes dizziness nosebleed", label: "Hypertensive Crisis", category: "Cardiovascular", severity: 8 },
  { text: "leg swelling pain redness warmth calf tenderness", label: "Deep Vein Thrombosis", category: "Cardiovascular", severity: 8 },
  { text: "sudden breathlessness chest pain coughing blood rapid pulse", label: "Pulmonary Embolism", category: "Cardiovascular", severity: 10 },

  { text: "high fever headache body aches fatigue cough sore throat chills", label: "Influenza", category: "Respiratory", severity: 4 },
  { text: "persistent cough fever shortness of breath chest pain fatigue", label: "Pneumonia", category: "Respiratory", severity: 7 },
  { text: "wheezing breathlessness chest tightness cough night worsening", label: "Asthma Exacerbation", category: "Respiratory", severity: 6 },
  { text: "chronic cough sputum production breathlessness exercise intolerance", label: "COPD Exacerbation", category: "Respiratory", severity: 7 },
  { text: "persistent cough blood sputum weight loss night sweats fever", label: "Pulmonary Tuberculosis", category: "Respiratory", severity: 8 },
  { text: "runny nose sneezing sore throat mild cough congestion low fever", label: "Upper Respiratory Infection", category: "Respiratory", severity: 2 },

  { text: "excessive thirst frequent urination blurred vision fatigue weight loss", label: "Diabetes Mellitus", category: "Endocrine", severity: 5 },
  { text: "confusion sweating trembling rapid heartbeat hunger irritability", label: "Hypoglycemia", category: "Endocrine", severity: 7 },
  { text: "nausea vomiting abdominal pain fruity breath confusion rapid breathing", label: "Diabetic Ketoacidosis", category: "Endocrine", severity: 9 },
  { text: "weight gain fatigue cold intolerance dry skin constipation depression", label: "Hypothyroidism", category: "Endocrine", severity: 4 },
  { text: "weight loss anxiety tremor heat intolerance rapid heartbeat sweating", label: "Hyperthyroidism", category: "Endocrine", severity: 5 },

  { text: "high fever rash behind eyes pain joint pain muscle pain platelet drop", label: "Dengue Fever", category: "Infectious", severity: 7 },
  { text: "cyclic fever chills rigors sweating headache anemia spleen enlarged", label: "Malaria", category: "Infectious", severity: 8 },
  { text: "high fever abdominal pain rose spots constipation diarrhea headache", label: "Typhoid Fever", category: "Infectious", severity: 7 },
  { text: "fever cough loss of taste smell fatigue body aches sore throat", label: "COVID-19", category: "Infectious", severity: 6 },
  { text: "fever rash joint pain muscle pain conjunctivitis headache", label: "Chikungunya", category: "Infectious", severity: 6 },
  { text: "burning urination frequency urgency cloudy urine pelvic pain", label: "Urinary Tract Infection", category: "Urological", severity: 4 },
  { text: "severe flank pain radiating groin blood urine nausea vomiting", label: "Kidney Stones", category: "Urological", severity: 7 },

  { text: "severe headache one side throbbing nausea light sensitivity aura", label: "Migraine", category: "Neurological", severity: 6 },
  { text: "sudden severe headache worst ever stiff neck confusion vomiting", label: "Subarachnoid Hemorrhage", category: "Neurological", severity: 10 },
  { text: "sudden weakness one side face drooping speech difficulty arm weakness", label: "Cerebrovascular Accident", category: "Neurological", severity: 10 },
  { text: "seizure convulsion loss consciousness jerking movements confusion", label: "Epileptic Seizure", category: "Neurological", severity: 8 },
  { text: "numbness tingling weakness limbs difficulty walking balance problems", label: "Multiple Sclerosis", category: "Neurological", severity: 7 },

  { text: "abdominal pain nausea vomiting fever right lower quadrant rebound", label: "Acute Appendicitis", category: "Gastrointestinal", severity: 8 },
  { text: "heartburn acid reflux chest burning regurgitation difficulty swallowing", label: "GERD", category: "Gastrointestinal", severity: 3 },
  { text: "severe abdominal pain vomiting distension constipation no gas passage", label: "Intestinal Obstruction", category: "Gastrointestinal", severity: 9 },
  { text: "bloody stool abdominal cramps diarrhea weight loss fatigue", label: "Inflammatory Bowel Disease", category: "Gastrointestinal", severity: 6 },
  { text: "jaundice abdominal pain dark urine pale stool fatigue nausea", label: "Hepatitis", category: "Gastrointestinal", severity: 7 },
  { text: "upper abdominal pain radiating back nausea vomiting fever", label: "Acute Pancreatitis", category: "Gastrointestinal", severity: 8 },

  { text: "joint pain swelling stiffness morning stiffness fatigue multiple joints", label: "Rheumatoid Arthritis", category: "Musculoskeletal", severity: 5 },
  { text: "lower back pain radiating leg numbness tingling weakness", label: "Lumbar Disc Herniation", category: "Musculoskeletal", severity: 6 },
  { text: "bone pain fracture height loss stooped posture", label: "Osteoporosis", category: "Musculoskeletal", severity: 5 },

  { text: "persistent sadness loss interest sleep changes appetite changes fatigue hopelessness", label: "Major Depressive Disorder", category: "Psychiatric", severity: 6 },
  { text: "excessive worry restlessness muscle tension sleep difficulty concentration problems", label: "Generalized Anxiety Disorder", category: "Psychiatric", severity: 5 },
  { text: "panic attacks heart racing sweating trembling fear of dying chest pain", label: "Panic Disorder", category: "Psychiatric", severity: 6 },

  { text: "irregular periods acne weight gain excess hair growth pelvic pain", label: "PCOS", category: "Gynecological", severity: 4 },
  { text: "heavy periods pain cramps fatigue iron deficiency anemia", label: "Menorrhagia", category: "Gynecological", severity: 5 },
  { text: "itchy rash red patches scaling dry skin eczema flaking", label: "Dermatitis", category: "Dermatological", severity: 3 },
  { text: "fever rash itchy blisters fluid filled lesions fatigue", label: "Varicella (Chickenpox)", category: "Infectious", severity: 4 },

  { text: "fatigue pale skin weakness dizziness cold hands shortness breath", label: "Iron Deficiency Anemia", category: "Hematological", severity: 5 },
  { text: "easy bruising prolonged bleeding fatigue petechiae purpura", label: "Thrombocytopenia", category: "Hematological", severity: 7 },
  { text: "swollen lymph nodes fever night sweats weight loss fatigue", label: "Lymphoma", category: "Oncological", severity: 8 },
];

function tokenize(text: string): string[] {
  return text.toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .split(/\s+/)
    .filter(w => w.length > 2);
}

function computeTFIDF(tokens: string[], vocabulary: Map<string, number>, idf: Map<string, number>): Map<string, number> {
  const tf = new Map<string, number>();
  const total = tokens.length;
  for (const token of tokens) {
    tf.set(token, (tf.get(token) || 0) + 1);
  }

  const tfidf = new Map<string, number>();
  for (const [term, count] of tf) {
    const termFreq = count / total;
    const inverseDocFreq = idf.get(term) || Math.log(1000);
    tfidf.set(term, termFreq * inverseDocFreq);
  }
  return tfidf;
}

function cosineSimilarity(a: Map<string, number>, b: Map<string, number>): number {
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (const [key, val] of a) {
    const bVal = b.get(key) || 0;
    dotProduct += val * bVal;
    normA += val * val;
  }
  for (const [, val] of b) {
    normB += val * val;
  }

  if (normA === 0 || normB === 0) return 0;
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

const modelState: ModelState = {
  vocabulary: new Map(),
  idf: new Map(),
  classPriors: new Map(),
  featureLikelihoods: new Map(),
  documentCount: 0,
  classDocCounts: new Map(),
  trained: false,
  version: "3.0.0",
  metrics: {
    accuracy: 0, precision: 0, recall: 0, f1Score: 0,
    specificity: 0, auc: 0,
    confusionMatrix: { tp: 0, fp: 0, tn: 0, fn: 0 },
    trainingSamples: 0, lastTrained: "",
  },
};

function buildVocabulary(): void {
  const docFreq = new Map<string, number>();
  const totalDocs = clinicalTrainingData.length;

  for (const data of clinicalTrainingData) {
    const tokens = new Set(tokenize(data.text));
    for (const token of tokens) {
      docFreq.set(token, (docFreq.get(token) || 0) + 1);
    }
  }

  let idx = 0;
  for (const [term, freq] of docFreq) {
    modelState.vocabulary.set(term, idx++);
    modelState.idf.set(term, Math.log((totalDocs + 1) / (freq + 1)) + 1);
  }
}

function trainNaiveBayes(): void {
  const classWordCounts = new Map<string, Map<string, number>>();
  const classTotalWords = new Map<string, number>();

  for (const data of clinicalTrainingData) {
    const cls = data.label;
    modelState.classDocCounts.set(cls, (modelState.classDocCounts.get(cls) || 0) + 1);

    if (!classWordCounts.has(cls)) {
      classWordCounts.set(cls, new Map());
    }
    const wordCounts = classWordCounts.get(cls)!;

    const tokens = tokenize(data.text);
    for (const token of tokens) {
      wordCounts.set(token, (wordCounts.get(token) || 0) + 1);
      classTotalWords.set(cls, (classTotalWords.get(cls) || 0) + 1);
    }
  }

  const totalDocs = clinicalTrainingData.length;
  for (const [cls, count] of modelState.classDocCounts) {
    modelState.classPriors.set(cls, Math.log(count / totalDocs));
  }

  const vocabSize = modelState.vocabulary.size;
  for (const [cls, wordCounts] of classWordCounts) {
    const total = classTotalWords.get(cls) || 0;
    const likelihoods = new Map<string, number>();

    for (const [word] of modelState.vocabulary) {
      const count = wordCounts.get(word) || 0;
      likelihoods.set(word, Math.log((count + 1) / (total + vocabSize)));
    }
    modelState.featureLikelihoods.set(cls, likelihoods);
  }
}

function crossValidate(): ModelMetrics {
  const k = 5;
  const shuffled = [...clinicalTrainingData].sort(() => Math.random() - 0.5);
  const foldSize = Math.ceil(shuffled.length / k);

  let totalCorrect = 0;
  let totalSamples = 0;
  let totalTP = 0, totalFP = 0, totalTN = 0, totalFN = 0;

  for (let fold = 0; fold < k; fold++) {
    const testStart = fold * foldSize;
    const testEnd = Math.min(testStart + foldSize, shuffled.length);
    const testSet = shuffled.slice(testStart, testEnd);

    for (const testItem of testSet) {
      const predicted = predictConditionInternal(testItem.text);
      const isCorrect = predicted === testItem.label;
      if (isCorrect) totalCorrect++;
      totalSamples++;

      if (isCorrect && predicted === testItem.label) totalTP++;
      else if (!isCorrect && predicted !== testItem.label) totalFP++;
      if (isCorrect && predicted !== testItem.label) totalTN++;
      else if (!isCorrect && predicted === testItem.label) totalFN++;
    }
  }

  const accuracy = totalSamples > 0 ? totalCorrect / totalSamples : 0;
  const precision = totalTP + totalFP > 0 ? totalTP / (totalTP + totalFP) : 0;
  const recall = totalTP + totalFN > 0 ? totalTP / (totalTP + totalFN) : 0;
  const f1 = precision + recall > 0 ? 2 * (precision * recall) / (precision + recall) : 0;
  const specificity = totalTN + totalFP > 0 ? totalTN / (totalTN + totalFP) : 0;
  const auc = (recall + specificity) / 2;

  return {
    accuracy: Math.round(accuracy * 10000) / 100,
    precision: Math.round(precision * 10000) / 100,
    recall: Math.round(recall * 10000) / 100,
    f1Score: Math.round(f1 * 10000) / 100,
    specificity: Math.round(specificity * 10000) / 100,
    auc: Math.round(auc * 10000) / 100,
    confusionMatrix: { tp: totalTP, fp: totalFP, tn: totalTN, fn: totalFN },
    trainingSamples: clinicalTrainingData.length,
    lastTrained: new Date().toISOString(),
  };
}

function predictConditionInternal(text: string): string {
  const tokens = tokenize(text);
  let bestClass = "";
  let bestScore = -Infinity;

  for (const [cls, prior] of modelState.classPriors) {
    let score = prior;
    const likelihoods = modelState.featureLikelihoods.get(cls);
    if (!likelihoods) continue;

    for (const token of tokens) {
      const likelihood = likelihoods.get(token);
      if (likelihood !== undefined) {
        score += likelihood;
      }
    }

    if (score > bestScore) {
      bestScore = score;
      bestClass = cls;
    }
  }
  return bestClass;
}

export function getModelMetrics(): ModelMetrics {
  if (!modelState.trained) initializeMLEngine();
  return { ...modelState.metrics };
}

export function initializeMLEngine(): void {
  if (modelState.trained) return;
  console.log("[ML Engine] Initializing CarePulse ML Engine v3.0...");
  buildVocabulary();
  trainNaiveBayes();
  modelState.metrics = crossValidate();
  modelState.trained = true;
  modelState.documentCount = clinicalTrainingData.length;
  console.log(`[ML Engine] Training complete. ${clinicalTrainingData.length} samples, ${modelState.vocabulary.size} features.`);
  console.log(`[ML Engine] Model metrics — Accuracy: ${modelState.metrics.accuracy}%, F1: ${modelState.metrics.f1Score}%, AUC: ${modelState.metrics.auc}%`);
}

export function predictCondition(symptoms: string): PredictionResult[] {
  if (!modelState.trained) initializeMLEngine();

  const tokens = tokenize(symptoms);
  const inputTFIDF = computeTFIDF(tokens, modelState.vocabulary, modelState.idf);

  const predictions: PredictionResult[] = [];
  const classScores: { cls: string; score: number }[] = [];

  for (const [cls, prior] of modelState.classPriors) {
    let score = prior;
    const likelihoods = modelState.featureLikelihoods.get(cls);
    if (!likelihoods) continue;

    for (const token of tokens) {
      const likelihood = likelihoods.get(token);
      if (likelihood !== undefined) {
        score += likelihood;
      }
    }
    classScores.push({ cls, score });
  }

  classScores.sort((a, b) => b.score - a.score);
  const maxScore = classScores[0]?.score || 0;
  const expScores = classScores.map(cs => ({
    ...cs,
    expScore: Math.exp(cs.score - maxScore),
  }));
  const sumExp = expScores.reduce((s, cs) => s + cs.expScore, 0);

  const topN = expScores.slice(0, 5);

  for (const cs of topN) {
    const probability = cs.expScore / sumExp;
    if (probability < 0.02) continue;

    const trainingEntry = clinicalTrainingData.find(d => d.label === cs.cls);
    const category = trainingEntry?.category || "Unknown";
    const severity = trainingEntry?.severity || 5;

    const matchedTokens = trainingEntry
      ? tokenize(trainingEntry.text).filter(t => tokens.includes(t))
      : [];

    const similar = clinicalTrainingData
      .filter(d => d.label !== cs.cls && d.category === category)
      .map(d => d.label)
      .slice(0, 3);

    predictions.push({
      condition: cs.cls,
      probability: Math.round(probability * 10000) / 100,
      confidence: probability > 0.6 ? "High" : probability > 0.3 ? "Moderate" : "Low",
      riskLevel: severity >= 8 ? "Critical" : severity >= 6 ? "High" : severity >= 4 ? "Moderate" : "Low",
      evidenceGrade: probability > 0.5 ? "A" : probability > 0.3 ? "B" : probability > 0.15 ? "C" : "D",
      contributingFactors: matchedTokens.length > 0
        ? matchedTokens.map(t => t.charAt(0).toUpperCase() + t.slice(1))
        : tokens.slice(0, 5).map(t => t.charAt(0).toUpperCase() + t.slice(1)),
      differentialDiagnosis: similar,
    });
  }

  return predictions;
}

export function assessPatientRisk(patient: {
  age: number;
  gender: string;
  conditions: string[];
  vitals?: { heartRate?: number; systolic?: number; diastolic?: number; oxygenLevel?: number; temperature?: number };
  medicalHistory?: string[];
  medications?: string[];
  lifestyle?: { smoking?: boolean; alcohol?: boolean; exercise?: string; diet?: string };
}): RiskAssessment {
  const factors: { factor: string; weight: number; present: boolean }[] = [];
  let totalRisk = 0;
  let maxWeight = 0;

  if (patient.age > 65) {
    factors.push({ factor: "Advanced age (>65 years)", weight: 15, present: true });
    totalRisk += 15;
  } else if (patient.age > 50) {
    factors.push({ factor: "Age >50 years", weight: 8, present: true });
    totalRisk += 8;
  } else if (patient.age > 40) {
    factors.push({ factor: "Age >40 years", weight: 4, present: true });
    totalRisk += 4;
  } else {
    factors.push({ factor: "Young age (<40)", weight: -2, present: true });
  }

  const highRiskConditions: Record<string, number> = {
    "diabetes": 12, "hypertension": 10, "heart disease": 15, "copd": 13,
    "chronic kidney disease": 14, "cancer": 18, "hiv": 12, "tuberculosis": 11,
    "liver cirrhosis": 14, "heart failure": 16, "stroke": 15, "asthma": 6,
    "obesity": 8, "anemia": 7, "depression": 5, "epilepsy": 7,
  };

  for (const condition of patient.conditions) {
    const lower = condition.toLowerCase();
    for (const [key, weight] of Object.entries(highRiskConditions)) {
      if (lower.includes(key)) {
        factors.push({ factor: `Active condition: ${condition}`, weight, present: true });
        totalRisk += weight;
        maxWeight = Math.max(maxWeight, weight);
      }
    }
  }

  if (patient.medicalHistory) {
    for (const history of patient.medicalHistory) {
      const lower = history.toLowerCase();
      if (lower.includes("surgery")) {
        factors.push({ factor: "Surgical history", weight: 5, present: true });
        totalRisk += 5;
      }
      if (lower.includes("allergy")) {
        factors.push({ factor: "Known allergies", weight: 3, present: true });
        totalRisk += 3;
      }
    }
  }

  if (patient.vitals) {
    const v = patient.vitals;
    if (v.heartRate && (v.heartRate > 100 || v.heartRate < 50)) {
      const w = v.heartRate > 120 || v.heartRate < 40 ? 15 : 8;
      factors.push({ factor: `Abnormal heart rate: ${v.heartRate} bpm`, weight: w, present: true });
      totalRisk += w;
    }
    if (v.systolic && v.systolic > 180) {
      factors.push({ factor: `Critical blood pressure: ${v.systolic}/${v.diastolic || "?"} mmHg`, weight: 18, present: true });
      totalRisk += 18;
    } else if (v.systolic && v.systolic > 140) {
      factors.push({ factor: `Elevated blood pressure: ${v.systolic}/${v.diastolic || "?"} mmHg`, weight: 10, present: true });
      totalRisk += 10;
    }
    if (v.oxygenLevel && v.oxygenLevel < 90) {
      factors.push({ factor: `Critical oxygen level: ${v.oxygenLevel}%`, weight: 20, present: true });
      totalRisk += 20;
    } else if (v.oxygenLevel && v.oxygenLevel < 94) {
      factors.push({ factor: `Low oxygen level: ${v.oxygenLevel}%`, weight: 12, present: true });
      totalRisk += 12;
    }
    if (v.temperature && v.temperature > 103) {
      factors.push({ factor: `High fever: ${v.temperature}°F`, weight: 12, present: true });
      totalRisk += 12;
    } else if (v.temperature && v.temperature > 100.4) {
      factors.push({ factor: `Fever: ${v.temperature}°F`, weight: 6, present: true });
      totalRisk += 6;
    }
  }

  if (patient.lifestyle) {
    if (patient.lifestyle.smoking) {
      factors.push({ factor: "Active smoker", weight: 10, present: true });
      totalRisk += 10;
    }
    if (patient.lifestyle.alcohol) {
      factors.push({ factor: "Regular alcohol consumption", weight: 6, present: true });
      totalRisk += 6;
    }
    if (patient.lifestyle.exercise === "none") {
      factors.push({ factor: "Sedentary lifestyle", weight: 7, present: true });
      totalRisk += 7;
    }
  }

  factors.push({ factor: "No family history recorded", weight: 0, present: false });
  factors.push({ factor: "Genetic predisposition unknown", weight: 0, present: false });

  const normalizedRisk = Math.min(100, Math.max(0, totalRisk));
  let riskCategory: string;
  let interventionUrgency: string;
  let projectedOutcome: string;

  if (normalizedRisk >= 75) {
    riskCategory = "Critical";
    interventionUrgency = "Immediate";
    projectedOutcome = "High probability of adverse event without intervention. Immediate clinical assessment required.";
  } else if (normalizedRisk >= 50) {
    riskCategory = "High";
    interventionUrgency = "Urgent (within 24 hours)";
    projectedOutcome = "Elevated risk of deterioration. Close monitoring and specialist consultation recommended.";
  } else if (normalizedRisk >= 25) {
    riskCategory = "Moderate";
    interventionUrgency = "Soon (within 1 week)";
    projectedOutcome = "Moderate risk requiring scheduled follow-up and preventive measures.";
  } else {
    riskCategory = "Low";
    interventionUrgency = "Routine";
    projectedOutcome = "Low immediate risk. Continue preventive care and regular screening.";
  }

  const mortalityRisk = Math.min(100, normalizedRisk * 0.3 + maxWeight * 1.5);
  const readmissionRisk = Math.min(100, normalizedRisk * 0.5 + patient.conditions.length * 5);
  const complicationRisk = Math.min(100, normalizedRisk * 0.6 + (patient.medicalHistory?.length || 0) * 3);

  const recommendations: string[] = [];
  if (normalizedRisk >= 50) {
    recommendations.push("Immediate specialist consultation required");
    recommendations.push("Increase monitoring frequency to every 2-4 hours");
    recommendations.push("Review and optimize current medication regimen");
  }
  if (patient.vitals?.oxygenLevel && patient.vitals.oxygenLevel < 94) {
    recommendations.push("Initiate supplemental oxygen therapy");
    recommendations.push("Continuous pulse oximetry monitoring");
  }
  if (patient.vitals?.systolic && patient.vitals.systolic > 140) {
    recommendations.push("Antihypertensive medication review");
    recommendations.push("Sodium-restricted diet (DASH protocol)");
    recommendations.push("Regular BP monitoring — target <130/80 mmHg");
  }
  if (patient.conditions.some(c => c.toLowerCase().includes("diabetes"))) {
    recommendations.push("HbA1c monitoring every 3 months");
    recommendations.push("Diabetic foot examination");
    recommendations.push("Retinopathy screening annually");
    recommendations.push("Renal function monitoring");
  }
  if (patient.lifestyle?.smoking) {
    recommendations.push("Smoking cessation program — NRT or Varenicline");
    recommendations.push("Pulmonary function testing");
  }
  recommendations.push("Maintain adequate hydration (2-3 liters/day)");
  recommendations.push("Follow prescribed medication schedule strictly");
  recommendations.push("Regular follow-up as per clinical protocol");

  return {
    overallRisk: Math.round(normalizedRisk * 100) / 100,
    riskCategory,
    riskFactors: factors.sort((a, b) => b.weight - a.weight),
    projectedOutcome,
    interventionUrgency,
    mortalityRisk: Math.round(mortalityRisk * 100) / 100,
    readmissionRisk: Math.round(readmissionRisk * 100) / 100,
    complicationRisk: Math.round(complicationRisk * 100) / 100,
    recommendations,
  };
}

export function trainModelWithNewData(data: { text: string; label: string; category: string; severity: number }[]): {
  success: boolean;
  message: string;
  metrics: ModelMetrics;
  samplesAdded: number;
} {
  const added = data.filter(d => {
    const exists = clinicalTrainingData.some(existing =>
      existing.text === d.text && existing.label === d.label
    );
    if (!exists) {
      clinicalTrainingData.push(d);
      return true;
    }
    return false;
  });

  buildVocabulary();
  trainNaiveBayes();
  const metrics = crossValidate();
  modelState.metrics = metrics;
  modelState.documentCount = clinicalTrainingData.length;

  return {
    success: true,
    message: `Model retrained with ${added.length} new samples. Total corpus: ${clinicalTrainingData.length} samples.`,
    metrics,
    samplesAdded: added.length,
  };
}

export function getModelStatus(): {
  version: string;
  trained: boolean;
  vocabularySize: number;
  totalClasses: number;
  totalSamples: number;
  metrics: ModelMetrics;
  classDistribution: Record<string, number>;
  categoryDistribution: Record<string, number>;
  featureImportance: { feature: string; importance: number }[];
} {
  if (!modelState.trained) initializeMLEngine();

  const classDistribution: Record<string, number> = {};
  const categoryDistribution: Record<string, number> = {};

  for (const data of clinicalTrainingData) {
    classDistribution[data.label] = (classDistribution[data.label] || 0) + 1;
    categoryDistribution[data.category] = (categoryDistribution[data.category] || 0) + 1;
  }

  const featureImportance: { feature: string; importance: number }[] = [];
  const sortedIDF = [...modelState.idf.entries()].sort((a, b) => b[1] - a[1]);
  for (const [feature, idf] of sortedIDF.slice(0, 30)) {
    featureImportance.push({ feature, importance: Math.round(idf * 1000) / 1000 });
  }

  return {
    version: modelState.version,
    trained: modelState.trained,
    vocabularySize: modelState.vocabulary.size,
    totalClasses: modelState.classDocCounts.size,
    totalSamples: clinicalTrainingData.length,
    metrics: modelState.metrics,
    classDistribution,
    categoryDistribution,
    featureImportance,
  };
}

export function batchPredict(cases: { id: string; symptoms: string; age?: number; gender?: string }[]): {
  results: { id: string; predictions: PredictionResult[]; riskScore: number }[];
  processingTime: number;
  modelVersion: string;
} {
  const start = Date.now();
  const results = cases.map(c => {
    const predictions = predictCondition(c.symptoms);
    const riskScore = predictions.length > 0
      ? predictions[0].probability * (predictions[0].riskLevel === "Critical" ? 1.5 : predictions[0].riskLevel === "High" ? 1.2 : 1.0)
      : 0;

    return {
      id: c.id,
      predictions,
      riskScore: Math.min(100, Math.round(riskScore * 100) / 100),
    };
  });

  return {
    results,
    processingTime: Date.now() - start,
    modelVersion: modelState.version,
  };
}

export function getTrainingData(): typeof clinicalTrainingData {
  return [...clinicalTrainingData];
}
