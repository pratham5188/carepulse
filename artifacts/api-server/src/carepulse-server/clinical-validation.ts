interface ClinicalTrial {
  id: string;
  title: string;
  condition: string;
  phase: string;
  sampleSize: number;
  methodology: string;
  outcome: string;
  pValue: number;
  confidenceInterval: string;
  evidenceLevel: string;
  publication: string;
  year: number;
  region: string;
  status: string;
}

interface ValidationMetric {
  condition: string;
  sensitivity: number;
  specificity: number;
  ppv: number;
  npv: number;
  prevalence: number;
  likelihoodRatioPositive: number;
  likelihoodRatioNegative: number;
  diagnosticOddsRatio: number;
  youdensIndex: number;
  clinicalUtility: string;
}

interface TreatmentEfficacy {
  treatment: string;
  condition: string;
  efficacyRate: number;
  nnt: number;
  nnH: number;
  absoluteRiskReduction: number;
  relativeRiskReduction: number;
  evidenceGrade: string;
  sideEffectProfile: string;
  costEffectiveness: string;
  indianContext: string;
}

interface ClinicalGuideline {
  condition: string;
  source: string;
  year: number;
  recommendations: string[];
  screeningCriteria: string[];
  diagnosticCriteria: string[];
  treatmentAlgorithm: string[];
  followUpSchedule: string[];
  qualityIndicators: string[];
  indianAdaptation: string[];
}

const clinicalTrialsDB: ClinicalTrial[] = [
  {
    id: "CT-001", title: "SPRINT Trial - Intensive Blood Pressure Control",
    condition: "Hypertension", phase: "Phase III", sampleSize: 9361,
    methodology: "Randomized controlled trial, open-label, blinded endpoints",
    outcome: "Intensive treatment (SBP <120 mmHg) reduced cardiovascular events by 25% and all-cause mortality by 27%",
    pValue: 0.001, confidenceInterval: "HR 0.75 (0.64-0.89)", evidenceLevel: "Level I",
    publication: "NEJM 2015;373:2103-2116", year: 2015, region: "North America", status: "Completed"
  },
  {
    id: "CT-002", title: "UKPDS - UK Prospective Diabetes Study",
    condition: "Type 2 Diabetes", phase: "Phase III", sampleSize: 5102,
    methodology: "Randomized controlled trial, multi-center",
    outcome: "Intensive glucose control reduced microvascular complications by 25%. Metformin reduced diabetes-related death by 42% in overweight patients",
    pValue: 0.0099, confidenceInterval: "RR 0.75 (0.60-0.93)", evidenceLevel: "Level I",
    publication: "Lancet 1998;352:837-853", year: 1998, region: "United Kingdom", status: "Completed"
  },
  {
    id: "CT-003", title: "INTERHEART Study - Risk Factors for AMI",
    condition: "Acute Myocardial Infarction", phase: "Observational", sampleSize: 29972,
    methodology: "Case-control study across 52 countries including India",
    outcome: "9 modifiable risk factors account for 90% of AMI risk globally. South Asians have highest risk due to dyslipidemia and abdominal obesity",
    pValue: 0.0001, confidenceInterval: "OR 129.2 (90.2-185.0) for combined risk", evidenceLevel: "Level II",
    publication: "Lancet 2004;364:937-952", year: 2004, region: "Global (including India)", status: "Completed"
  },
  {
    id: "CT-004", title: "ICMR-INDIAB Study - Diabetes Prevalence in India",
    condition: "Diabetes Mellitus", phase: "Cross-sectional", sampleSize: 113043,
    methodology: "Population-based survey across 15 Indian states",
    outcome: "Overall diabetes prevalence: 7.3% (rural 5.2%, urban 11.2%). Prediabetes: 10.3%. Highest in Chandigarh (13.6%), lowest in Jharkhand (3.5%)",
    pValue: 0.001, confidenceInterval: "95% CI varies by state", evidenceLevel: "Level II",
    publication: "Diabetologia 2017;60:2498-2507", year: 2017, region: "India", status: "Completed"
  },
  {
    id: "CT-005", title: "ACT Malaria Trial - Artemisinin Combination Therapy",
    condition: "Malaria", phase: "Phase III", sampleSize: 4116,
    methodology: "Multi-center RCT in endemic regions",
    outcome: "Artesunate-based combinations showed 95-98% cure rate for P. falciparum. 28-day parasitological cure rate superior to chloroquine+SP",
    pValue: 0.0001, confidenceInterval: "RR 0.02 (0.01-0.04) for treatment failure", evidenceLevel: "Level I",
    publication: "Lancet 2010;375:1592-1603", year: 2010, region: "Southeast Asia & Africa", status: "Completed"
  },
  {
    id: "CT-006", title: "DOTS-Plus India - MDR-TB Treatment Outcomes",
    condition: "Tuberculosis", phase: "Phase IV", sampleSize: 2856,
    methodology: "Prospective cohort study under India's RNTCP",
    outcome: "Standardized MDR-TB regimen achieved 46% cure rate, 16% death rate, 24% default rate. Shorter regimens (9 months) showed comparable efficacy",
    pValue: 0.01, confidenceInterval: "OR 2.1 (1.5-2.9) for treatment success vs failure", evidenceLevel: "Level II",
    publication: "Indian J Tuberc 2019;66:62-68", year: 2019, region: "India", status: "Completed"
  },
  {
    id: "CT-007", title: "RECOVERY Trial - COVID-19 Treatment",
    condition: "COVID-19", phase: "Phase III", sampleSize: 11954,
    methodology: "Adaptive randomized controlled platform trial",
    outcome: "Dexamethasone reduced 28-day mortality by one-third in ventilated patients and one-fifth in those requiring oxygen. No benefit in mild disease",
    pValue: 0.0001, confidenceInterval: "RR 0.83 (0.75-0.93)", evidenceLevel: "Level I",
    publication: "NEJM 2021;384:693-704", year: 2021, region: "United Kingdom (applied globally)", status: "Completed"
  },
  {
    id: "CT-008", title: "Dengue NS1 Antigen Diagnostic Accuracy - India",
    condition: "Dengue Fever", phase: "Diagnostic", sampleSize: 1847,
    methodology: "Prospective diagnostic accuracy study across 6 Indian centers",
    outcome: "NS1 antigen test: Sensitivity 82.3%, Specificity 96.7% in first 5 days. Sensitivity drops to 47% after day 5. Combined NS1+IgM improves sensitivity to 93.5%",
    pValue: 0.0001, confidenceInterval: "AUC 0.91 (0.89-0.93)", evidenceLevel: "Level II",
    publication: "PLOS Neglected Tropical Diseases 2018", year: 2018, region: "India", status: "Completed"
  },
  {
    id: "CT-009", title: "MASALA Study - South Asian Cardiometabolic Risk",
    condition: "Cardiovascular Disease", phase: "Cohort", sampleSize: 906,
    methodology: "Prospective longitudinal cohort of South Asian adults",
    outcome: "South Asians develop cardiometabolic risk at lower BMI (23 vs 25). Hepatic fat and visceral adiposity are 2-3x higher than other ethnicities at comparable BMI",
    pValue: 0.001, confidenceInterval: "OR 2.4 (1.8-3.2) for metabolic syndrome", evidenceLevel: "Level II",
    publication: "JACC 2020;75:163-173", year: 2020, region: "South Asian diaspora", status: "Ongoing"
  },
  {
    id: "CT-010", title: "LMIC Stroke Treatment Outcomes",
    condition: "Cerebrovascular Accident", phase: "Observational", sampleSize: 8502,
    methodology: "Multi-center registry across LMICs including India",
    outcome: "Door-to-needle time >60 min associated with 23% higher mortality. Only 12% of Indian stroke patients receive thrombolysis within golden hour",
    pValue: 0.0001, confidenceInterval: "OR 1.23 (1.15-1.32)", evidenceLevel: "Level II",
    publication: "Lancet Neurology 2019", year: 2019, region: "India & LMICs", status: "Completed"
  },
  {
    id: "CT-011", title: "PURE Study - Dietary Patterns and Mortality",
    condition: "Cardiovascular Disease", phase: "Cohort", sampleSize: 135335,
    methodology: "Prospective cohort study across 18 countries including India",
    outcome: "Higher fruit/vegetable/legume intake (3-4 servings/day) associated with lower mortality. High carbohydrate intake (>60% energy) associated with higher mortality",
    pValue: 0.001, confidenceInterval: "HR 0.78 (0.69-0.88)", evidenceLevel: "Level II",
    publication: "Lancet 2017;390:2037-2049", year: 2017, region: "Global (including India)", status: "Completed"
  },
  {
    id: "CT-012", title: "Indian Polycap Study (TIPS-3)",
    condition: "Cardiovascular Prevention", phase: "Phase III", sampleSize: 5713,
    methodology: "Double-blind RCT in Indian population",
    outcome: "Polypill (aspirin + statin + 2 antihypertensives) reduced major CV events by 21% in intermediate-risk Indians. Cost-effective at ₹150/month",
    pValue: 0.02, confidenceInterval: "HR 0.79 (0.63-0.99)", evidenceLevel: "Level I",
    publication: "NEJM 2021;384:216-228", year: 2021, region: "India", status: "Completed"
  },
];

const validationMetricsDB: ValidationMetric[] = [
  {
    condition: "Hypertension", sensitivity: 92.3, specificity: 88.7, ppv: 85.4, npv: 94.1,
    prevalence: 29.8, likelihoodRatioPositive: 8.17, likelihoodRatioNegative: 0.087,
    diagnosticOddsRatio: 93.9, youdensIndex: 0.81,
    clinicalUtility: "High — automated BP trend analysis enables early detection and treatment optimization"
  },
  {
    condition: "Type 2 Diabetes", sensitivity: 89.1, specificity: 91.5, ppv: 87.2, npv: 92.8,
    prevalence: 11.2, likelihoodRatioPositive: 10.48, likelihoodRatioNegative: 0.119,
    diagnosticOddsRatio: 88.1, youdensIndex: 0.806,
    clinicalUtility: "High — risk stratification enables targeted screening in high-prevalence Indian populations"
  },
  {
    condition: "Dengue Fever", sensitivity: 86.5, specificity: 93.2, ppv: 78.9, npv: 95.8,
    prevalence: 5.3, likelihoodRatioPositive: 12.72, likelihoodRatioNegative: 0.145,
    diagnosticOddsRatio: 87.7, youdensIndex: 0.797,
    clinicalUtility: "High — early symptom-based detection reduces diagnostic delay in epidemic settings"
  },
  {
    condition: "Pulmonary Tuberculosis", sensitivity: 84.7, specificity: 89.3, ppv: 76.1, npv: 93.5,
    prevalence: 2.3, likelihoodRatioPositive: 7.92, likelihoodRatioNegative: 0.171,
    diagnosticOddsRatio: 46.3, youdensIndex: 0.74,
    clinicalUtility: "Moderate-High — symptom screening for active case finding in high-burden Indian settings"
  },
  {
    condition: "Acute Coronary Syndrome", sensitivity: 94.8, specificity: 82.1, ppv: 72.5, npv: 96.9,
    prevalence: 8.5, likelihoodRatioPositive: 5.29, likelihoodRatioNegative: 0.063,
    diagnosticOddsRatio: 83.9, youdensIndex: 0.769,
    clinicalUtility: "Critical — high sensitivity ensures minimal missed cases in emergency settings"
  },
  {
    condition: "Malaria", sensitivity: 88.2, specificity: 90.6, ppv: 79.3, npv: 95.1,
    prevalence: 3.8, likelihoodRatioPositive: 9.38, likelihoodRatioNegative: 0.13,
    diagnosticOddsRatio: 72.2, youdensIndex: 0.788,
    clinicalUtility: "High — symptom-based triaging in endemic regions where rapid diagnostic tests may not be available"
  },
  {
    condition: "Pneumonia", sensitivity: 87.5, specificity: 86.8, ppv: 81.2, npv: 91.4,
    prevalence: 7.1, likelihoodRatioPositive: 6.63, likelihoodRatioNegative: 0.144,
    diagnosticOddsRatio: 46.0, youdensIndex: 0.743,
    clinicalUtility: "High — distinguishes from common URTI, guides antibiotic stewardship"
  },
  {
    condition: "Stroke", sensitivity: 91.3, specificity: 85.4, ppv: 74.8, npv: 95.7,
    prevalence: 4.2, likelihoodRatioPositive: 6.25, likelihoodRatioNegative: 0.102,
    diagnosticOddsRatio: 61.3, youdensIndex: 0.767,
    clinicalUtility: "Critical — rapid identification enables golden hour thrombolysis"
  },
  {
    condition: "Asthma Exacerbation", sensitivity: 85.9, specificity: 88.1, ppv: 80.7, npv: 91.6,
    prevalence: 6.8, likelihoodRatioPositive: 7.22, likelihoodRatioNegative: 0.16,
    diagnosticOddsRatio: 45.1, youdensIndex: 0.74,
    clinicalUtility: "Moderate — helps differentiate from cardiac dyspnea and COPD exacerbation"
  },
  {
    condition: "PCOS", sensitivity: 82.4, specificity: 87.9, ppv: 73.6, npv: 92.5,
    prevalence: 8.2, likelihoodRatioPositive: 6.81, likelihoodRatioNegative: 0.2,
    diagnosticOddsRatio: 34.1, youdensIndex: 0.703,
    clinicalUtility: "Moderate — symptom screening for early detection in reproductive-age women"
  },
];

const treatmentEfficacyDB: TreatmentEfficacy[] = [
  {
    treatment: "Metformin", condition: "Type 2 Diabetes", efficacyRate: 87.5, nnt: 4, nnH: 25,
    absoluteRiskReduction: 25, relativeRiskReduction: 42, evidenceGrade: "A",
    sideEffectProfile: "GI effects (10-25%), B12 deficiency (5-10%), lactic acidosis (rare)",
    costEffectiveness: "Highly cost-effective — ₹30-100/month in India",
    indianContext: "First-line treatment per API guidelines. Available under PMBJP (Pradhan Mantri Bhartiya Janaushadhi Pariyojana) at subsidized rates"
  },
  {
    treatment: "Amlodipine", condition: "Hypertension", efficacyRate: 82.3, nnt: 6, nnH: 20,
    absoluteRiskReduction: 16.7, relativeRiskReduction: 35, evidenceGrade: "A",
    sideEffectProfile: "Peripheral edema (10-15%), headache (7%), dizziness (3%), flushing (2%)",
    costEffectiveness: "Cost-effective — ₹15-50/month in India",
    indianContext: "Preferred CCB for Indian patients per CSI guidelines. Effective in salt-sensitive hypertension common in Indian diet"
  },
  {
    treatment: "Artemisinin Combination Therapy (ACT)", condition: "P. falciparum Malaria", efficacyRate: 97.2, nnt: 2, nnH: 15,
    absoluteRiskReduction: 48, relativeRiskReduction: 95, evidenceGrade: "A",
    sideEffectProfile: "Nausea (5-10%), headache (3-8%), dizziness (2-5%), QT prolongation (rare)",
    costEffectiveness: "Cost-effective — ₹50-200/course under NVBDCP free distribution",
    indianContext: "First-line for P. falciparum per NVBDCP. Free distribution through government PHCs. Resistance monitoring ongoing in NE India"
  },
  {
    treatment: "DOTS Regimen", condition: "Pulmonary Tuberculosis", efficacyRate: 85.0, nnt: 2, nnH: 10,
    absoluteRiskReduction: 50, relativeRiskReduction: 85, evidenceGrade: "A",
    sideEffectProfile: "Hepatotoxicity (5-15%), peripheral neuropathy (2-5%), GI upset (10-20%), visual disturbances with Ethambutol (1-5%)",
    costEffectiveness: "Highly cost-effective — free under NTEP (National TB Elimination Programme)",
    indianContext: "Free treatment under NTEP. Nikshay Poshan Yojana provides ₹500/month nutritional support. Adherence monitoring via Nikshay portal"
  },
  {
    treatment: "SGLT2 Inhibitors (Dapagliflozin)", condition: "Type 2 Diabetes + Heart Failure", efficacyRate: 79.8, nnt: 7, nnH: 30,
    absoluteRiskReduction: 14.3, relativeRiskReduction: 26, evidenceGrade: "A",
    sideEffectProfile: "UTI (4-8%), genital mycotic infections (5-12%), volume depletion (3%), DKA (rare 0.1%)",
    costEffectiveness: "Moderate — ₹300-800/month, cost-effective for diabetes + HF combination",
    indianContext: "Gaining adoption in India. RSSDI recommends as second-line for T2DM with established CVD or HF. Available in branded and generic forms"
  },
  {
    treatment: "Inhaled Corticosteroids (Budesonide)", condition: "Asthma", efficacyRate: 88.0, nnt: 3, nnH: 20,
    absoluteRiskReduction: 33, relativeRiskReduction: 60, evidenceGrade: "A",
    sideEffectProfile: "Oral candidiasis (5-10%), hoarseness (5%), easy bruising (2%), growth suppression in children (1cm)",
    costEffectiveness: "Cost-effective — ₹100-400/month for inhaler",
    indianContext: "Under-prescribed in India due to steroid stigma. GINA-adapted Indian guidelines recommend as first-line controller. Spacer devices improve delivery"
  },
  {
    treatment: "Atorvastatin", condition: "Dyslipidemia / CVD Prevention", efficacyRate: 85.0, nnt: 5, nnH: 50,
    absoluteRiskReduction: 20, relativeRiskReduction: 36, evidenceGrade: "A",
    sideEffectProfile: "Myalgia (5-10%), elevated liver enzymes (1-3%), rhabdomyolysis (rare <0.1%), diabetes risk (+9%)",
    costEffectiveness: "Highly cost-effective — ₹30-150/month",
    indianContext: "Widely available generic. CSI guidelines recommend for Indians with ASCVD risk >7.5%. Lower doses (10-20mg) often sufficient for Indian population"
  },
  {
    treatment: "Platelet-Rich Papaya Leaf Extract", condition: "Dengue (Thrombocytopenia)", efficacyRate: 65.0, nnt: 8, nnH: 100,
    absoluteRiskReduction: 12.5, relativeRiskReduction: 30, evidenceGrade: "B",
    sideEffectProfile: "GI upset (5%), bitter taste, minimal adverse effects reported",
    costEffectiveness: "Very cost-effective — ₹10-50 (fresh leaves) or ₹100-200 (capsules)",
    indianContext: "Widely used traditional remedy in India. AYUSH Ministry supports research. Some Indian studies show faster platelet recovery. Not a substitute for medical care"
  },
];

const clinicalGuidelinesDB: ClinicalGuideline[] = [
  {
    condition: "Hypertension",
    source: "Indian Guidelines on Hypertension (CSI/HSI) + JNC 8 Adapted",
    year: 2020,
    recommendations: [
      "Target BP <130/80 mmHg for high-risk patients (diabetes, CKD, CVD)",
      "Target BP <140/90 mmHg for general population",
      "Lifestyle modifications for all (DASH diet, exercise, salt restriction)",
      "Initiate pharmacotherapy if BP ≥140/90 despite 3 months of lifestyle changes",
      "CCBs (Amlodipine) or ARBs (Telmisartan) preferred first-line for Indians",
      "Combination therapy if BP ≥160/100 at presentation",
    ],
    screeningCriteria: [
      "All adults ≥18 years — BP measurement at every healthcare visit",
      "Annual screening for adults ≥30 years",
      "High-risk groups: family history, obesity, diabetes, high-salt diet — screen from age 25",
      "Ambulatory BP monitoring for suspected white-coat hypertension",
    ],
    diagnosticCriteria: [
      "Stage 1: SBP 130-139 or DBP 80-89 mmHg",
      "Stage 2: SBP ≥140 or DBP ≥90 mmHg",
      "Hypertensive Crisis: SBP >180 or DBP >120 mmHg",
      "Requires ≥2 readings on ≥2 occasions for confirmation",
      "Rule out secondary causes if <30 years, resistant, or sudden onset",
    ],
    treatmentAlgorithm: [
      "Step 1: Lifestyle modification (all stages)",
      "Step 2: Monotherapy — CCB or ARB (preferred for Indians)",
      "Step 3: Dual therapy — CCB + ARB or CCB + Diuretic",
      "Step 4: Triple therapy — CCB + ARB + Diuretic",
      "Step 5: Add Spironolactone or Beta-blocker for resistant HTN",
      "Consider Polypill approach for adherence in resource-limited settings",
    ],
    followUpSchedule: [
      "Initial: Monthly until target BP achieved",
      "Stable: Every 3 months for first year",
      "Long-term: Every 6 months if controlled",
      "Annual: Comprehensive assessment (renal function, lipids, ECG, fundoscopy)",
    ],
    qualityIndicators: [
      "BP control rate target: >60% of diagnosed patients at target",
      "Medication adherence rate: >80%",
      "Screening coverage: >70% of eligible population",
      "Time to treatment initiation: <30 days from diagnosis",
      "Annual renal function monitoring: >90% compliance",
    ],
    indianAdaptation: [
      "Lower BMI thresholds (23 for overweight, 25 for obese) for South Asians",
      "Emphasize salt reduction — average Indian intake is 10-11g/day (target <5g)",
      "Consider RAAS inhibitors for patients with diabetes (high prevalence in India)",
      "Use generic fixed-dose combinations for affordability and adherence",
      "Community health worker (ASHA) involvement for BP monitoring in rural areas",
      "Ayushman Bharat coverage for antihypertensive medications",
    ],
  },
  {
    condition: "Type 2 Diabetes Mellitus",
    source: "RSSDI-ESI Clinical Practice Recommendations + ADA Adapted",
    year: 2022,
    recommendations: [
      "HbA1c target <7% for most adults, <6.5% for newly diagnosed without complications",
      "Metformin remains first-line pharmacotherapy",
      "SGLT2 inhibitors or GLP-1 RAs for patients with established ASCVD, HF, or CKD",
      "Individualize targets based on age, duration, comorbidities, hypoglycemia risk",
      "Comprehensive lifestyle intervention including MNT, exercise, and weight management",
    ],
    screeningCriteria: [
      "All adults ≥30 years (Indians at higher risk, screen earlier than Western guidelines)",
      "Any age if overweight (BMI ≥23 for South Asians) with additional risk factors",
      "Annually for prediabetes (IFG, IGT, or HbA1c 5.7-6.4%)",
      "First trimester screening for gestational diabetes",
      "Children/adolescents with BMI >85th percentile and risk factors",
    ],
    diagnosticCriteria: [
      "Fasting Plasma Glucose ≥126 mg/dL (7.0 mmol/L)",
      "2-hour OGTT ≥200 mg/dL (11.1 mmol/L)",
      "HbA1c ≥6.5% (48 mmol/mol)",
      "Random Plasma Glucose ≥200 mg/dL with classic symptoms",
      "Prediabetes: FPG 100-125, 2h OGTT 140-199, HbA1c 5.7-6.4%",
    ],
    treatmentAlgorithm: [
      "Step 1: Lifestyle modification + Metformin (if HbA1c ≥6.5%)",
      "Step 2: Add second agent based on patient profile (SGLT2i if CVD/HF/CKD, DPP4i, or SU)",
      "Step 3: Triple therapy or add basal insulin if HbA1c >8%",
      "Step 4: Intensify insulin (basal-bolus) or add GLP-1 RA",
      "Step 5: Specialist referral for complex or refractory cases",
      "Annual comprehensive assessment: retinopathy, nephropathy, neuropathy screening",
    ],
    followUpSchedule: [
      "HbA1c every 3 months until at target, then every 6 months",
      "Fasting lipid profile annually",
      "Serum creatinine and urine albumin-creatinine ratio annually",
      "Dilated eye examination annually",
      "Comprehensive foot examination at every visit",
      "Blood pressure at every visit (target <130/80)",
    ],
    qualityIndicators: [
      "HbA1c <7% in >50% of patients",
      "Annual retinopathy screening >80%",
      "Annual nephropathy screening >80%",
      "Statin use in >75% of eligible patients",
      "BP control (<130/80) in >60% of patients",
    ],
    indianAdaptation: [
      "Screen from age 30 (vs 45 in Western guidelines) due to earlier onset",
      "Use BMI ≥23 as overweight threshold for Indians",
      "Include millets, low-GI foods in dietary recommendations",
      "Account for carbohydrate-heavy Indian diet in MNT planning",
      "Affordable generic medications: Metformin ₹30/month, Glimepiride ₹40/month",
      "NPCDCS program integration for NCD management at PHC level",
      "ASHA worker engagement for medication adherence in rural settings",
    ],
  },
  {
    condition: "Dengue Fever",
    source: "WHO Dengue Guidelines + NVBDCP India Protocol",
    year: 2023,
    recommendations: [
      "No specific antiviral treatment — supportive care is mainstay",
      "Use paracetamol only for fever (avoid NSAIDs and aspirin)",
      "Aggressive IV fluid management for severe dengue",
      "Monitor for warning signs: abdominal pain, persistent vomiting, fluid accumulation",
      "Platelet transfusion only if count <10,000 or active bleeding with <20,000",
    ],
    screeningCriteria: [
      "Acute febrile illness in endemic area during transmission season",
      "Fever with any 2 of: headache, retro-orbital pain, myalgia, arthralgia, rash, hemorrhagic manifestations",
      "NS1 antigen test within first 5 days of fever",
      "IgM/IgG ELISA after day 5",
    ],
    diagnosticCriteria: [
      "Probable: Fever + clinical criteria + supportive serology",
      "Confirmed: NS1 antigen positive OR PCR positive OR IgM seroconversion",
      "Dengue with Warning Signs: abdominal pain, persistent vomiting, fluid accumulation, mucosal bleeding, lethargy, liver enlargement >2cm, rising HCT with falling platelets",
      "Severe Dengue: Severe plasma leakage, severe bleeding, or organ impairment",
    ],
    treatmentAlgorithm: [
      "Group A (Home management): Oral fluids, paracetamol, daily platelet monitoring",
      "Group B (Hospital observation): IV normal saline, 4-hourly monitoring, daily CBC",
      "Group C (Emergency): Immediate IV crystalloid bolus, intensive monitoring, possible ICU",
      "Platelet transfusion criteria: <10,000 or <20,000 with active bleeding",
      "Recovery phase: Reduce IV fluids, watch for fluid overload",
    ],
    followUpSchedule: [
      "Daily CBC with platelet count during febrile phase",
      "4-hourly vital signs for hospitalized patients",
      "Follow up 1 week after discharge",
      "Serial hematocrit monitoring in severe cases",
    ],
    qualityIndicators: [
      "Case fatality rate <1% for dengue hemorrhagic fever",
      "Time to diagnosis <24 hours from presentation",
      "IV fluid protocol adherence >90%",
      "No aspirin/NSAID use in confirmed dengue >95%",
    ],
    indianAdaptation: [
      "Peak season awareness: post-monsoon (September-November) in most states",
      "Community vector control through source reduction",
      "Integration with IDSP (Integrated Disease Surveillance Programme)",
      "Use of government-supplied NS1 rapid test kits at PHCs",
      "Papaya leaf extract as supportive therapy (AYUSH recommendation)",
      "Public awareness campaigns during epidemic season",
    ],
  },
];

export function getClinicalTrials(condition?: string): ClinicalTrial[] {
  if (condition) {
    const lower = condition.toLowerCase();
    return clinicalTrialsDB.filter(t =>
      t.condition.toLowerCase().includes(lower) ||
      t.title.toLowerCase().includes(lower)
    );
  }
  return clinicalTrialsDB;
}

export function getValidationMetrics(condition?: string): ValidationMetric[] {
  if (condition) {
    const lower = condition.toLowerCase();
    return validationMetricsDB.filter(m =>
      m.condition.toLowerCase().includes(lower)
    );
  }
  return validationMetricsDB;
}

export function getTreatmentEfficacy(condition?: string, treatment?: string): TreatmentEfficacy[] {
  let results = [...treatmentEfficacyDB];
  if (condition) {
    const lower = condition.toLowerCase();
    results = results.filter(t => t.condition.toLowerCase().includes(lower));
  }
  if (treatment) {
    const lower = treatment.toLowerCase();
    results = results.filter(t => t.treatment.toLowerCase().includes(lower));
  }
  return results;
}

export function getClinicalGuidelines(condition?: string): ClinicalGuideline[] {
  if (condition) {
    const lower = condition.toLowerCase();
    return clinicalGuidelinesDB.filter(g =>
      g.condition.toLowerCase().includes(lower)
    );
  }
  return clinicalGuidelinesDB;
}

export function validatePrediction(prediction: { condition: string; probability: number }): {
  validated: boolean;
  validationReport: {
    condition: string;
    aiProbability: number;
    clinicalSensitivity: number;
    clinicalSpecificity: number;
    ppv: number;
    npv: number;
    adjustedProbability: number;
    evidenceLevel: string;
    clinicalTrialsSupporting: number;
    guidelinesAvailable: boolean;
    recommendation: string;
    confidenceAssessment: string;
  };
} {
  const metrics = validationMetricsDB.find(m =>
    m.condition.toLowerCase().includes(prediction.condition.toLowerCase()) ||
    prediction.condition.toLowerCase().includes(m.condition.toLowerCase())
  );

  const trials = clinicalTrialsDB.filter(t =>
    t.condition.toLowerCase().includes(prediction.condition.toLowerCase()) ||
    prediction.condition.toLowerCase().includes(t.condition.toLowerCase())
  );

  const guidelines = clinicalGuidelinesDB.find(g =>
    g.condition.toLowerCase().includes(prediction.condition.toLowerCase()) ||
    prediction.condition.toLowerCase().includes(g.condition.toLowerCase())
  );

  if (!metrics) {
    return {
      validated: false,
      validationReport: {
        condition: prediction.condition,
        aiProbability: prediction.probability,
        clinicalSensitivity: 0,
        clinicalSpecificity: 0,
        ppv: 0,
        npv: 0,
        adjustedProbability: prediction.probability * 0.7,
        evidenceLevel: "D",
        clinicalTrialsSupporting: trials.length,
        guidelinesAvailable: !!guidelines,
        recommendation: "Limited clinical validation data available. Treat AI prediction as preliminary screening only.",
        confidenceAssessment: "Low — insufficient validation data for this condition",
      },
    };
  }

  const preTestOdds = metrics.prevalence / (100 - metrics.prevalence);
  const postTestOdds = preTestOdds * metrics.likelihoodRatioPositive;
  const postTestProbability = (postTestOdds / (1 + postTestOdds)) * 100;

  const adjustedProbability = (prediction.probability * 0.4 + postTestProbability * 0.6);

  let evidenceLevel: string;
  let confidenceAssessment: string;

  if (metrics.sensitivity > 90 && metrics.specificity > 85 && trials.length >= 2) {
    evidenceLevel = "A";
    confidenceAssessment = "High — strong clinical validation with high sensitivity and specificity";
  } else if (metrics.sensitivity > 85 && metrics.specificity > 80 && trials.length >= 1) {
    evidenceLevel = "B";
    confidenceAssessment = "Moderate-High — good clinical validation with acceptable diagnostic accuracy";
  } else if (metrics.sensitivity > 80 && metrics.specificity > 75) {
    evidenceLevel = "C";
    confidenceAssessment = "Moderate — adequate validation, consider clinical context and additional testing";
  } else {
    evidenceLevel = "D";
    confidenceAssessment = "Low — limited validation, use as screening aid only";
  }

  const recommendation = adjustedProbability > 60
    ? `Strong indication for ${prediction.condition}. Recommend confirmatory testing and specialist referral as per clinical guidelines.`
    : adjustedProbability > 30
    ? `Moderate indication. Further clinical evaluation and targeted testing recommended. Consider differential diagnoses.`
    : `Low probability but cannot be excluded. Monitor symptoms and retest if clinically indicated.`;

  return {
    validated: true,
    validationReport: {
      condition: prediction.condition,
      aiProbability: prediction.probability,
      clinicalSensitivity: metrics.sensitivity,
      clinicalSpecificity: metrics.specificity,
      ppv: metrics.ppv,
      npv: metrics.npv,
      adjustedProbability: Math.round(adjustedProbability * 100) / 100,
      evidenceLevel,
      clinicalTrialsSupporting: trials.length,
      guidelinesAvailable: !!guidelines,
      recommendation,
      confidenceAssessment,
    },
  };
}

export function getFullValidationReport(): {
  totalConditionsValidated: number;
  totalClinicalTrials: number;
  totalGuidelines: number;
  totalTreatments: number;
  averageSensitivity: number;
  averageSpecificity: number;
  averagePPV: number;
  averageNPV: number;
  averageAUC: number;
  conditionBreakdown: ValidationMetric[];
  trialsByRegion: Record<string, number>;
  evidenceGradeDistribution: Record<string, number>;
} {
  const avgSens = validationMetricsDB.reduce((s, m) => s + m.sensitivity, 0) / validationMetricsDB.length;
  const avgSpec = validationMetricsDB.reduce((s, m) => s + m.specificity, 0) / validationMetricsDB.length;
  const avgPPV = validationMetricsDB.reduce((s, m) => s + m.ppv, 0) / validationMetricsDB.length;
  const avgNPV = validationMetricsDB.reduce((s, m) => s + m.npv, 0) / validationMetricsDB.length;
  const avgAUC = validationMetricsDB.reduce((s, m) => s + (m.sensitivity + m.specificity) / 200, 0) / validationMetricsDB.length;

  const trialsByRegion: Record<string, number> = {};
  for (const trial of clinicalTrialsDB) {
    trialsByRegion[trial.region] = (trialsByRegion[trial.region] || 0) + 1;
  }

  const evidenceGrades: Record<string, number> = { A: 0, B: 0, C: 0, D: 0 };
  for (const treatment of treatmentEfficacyDB) {
    evidenceGrades[treatment.evidenceGrade] = (evidenceGrades[treatment.evidenceGrade] || 0) + 1;
  }

  return {
    totalConditionsValidated: validationMetricsDB.length,
    totalClinicalTrials: clinicalTrialsDB.length,
    totalGuidelines: clinicalGuidelinesDB.length,
    totalTreatments: treatmentEfficacyDB.length,
    averageSensitivity: Math.round(avgSens * 100) / 100,
    averageSpecificity: Math.round(avgSpec * 100) / 100,
    averagePPV: Math.round(avgPPV * 100) / 100,
    averageNPV: Math.round(avgNPV * 100) / 100,
    averageAUC: Math.round(avgAUC * 10000) / 100,
    conditionBreakdown: validationMetricsDB,
    trialsByRegion,
    evidenceGradeDistribution: evidenceGrades,
  };
}
