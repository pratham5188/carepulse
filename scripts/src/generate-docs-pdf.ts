import PDFDocument from "pdfkit";
import archiver from "archiver";
import fs from "fs";
import path from "path";

const OUT_PDF = path.resolve("carepulse-documentation.pdf");
const OUT_ZIP = path.resolve("carepulse-project-files.zip");

// ─── Color palette ────────────────────────────────────────────────────────────
const C = {
  navy:    "#1a2e5a",
  blue:    "#2563eb",
  teal:    "#0891b2",
  green:   "#059669",
  red:     "#dc2626",
  orange:  "#ea580c",
  purple:  "#7c3aed",
  grey:    "#4b5563",
  lgrey:   "#9ca3af",
  bgGrey:  "#f3f4f6",
  white:   "#ffffff",
  black:   "#111827",
};

const doc = new PDFDocument({ size: "A4", margin: 50, bufferPages: true });

let pageNum = 0;

// ─── helpers ──────────────────────────────────────────────────────────────────
function newPage() {
  if (pageNum > 0) doc.addPage();
  pageNum++;
}

function heading1(text: string, color = C.navy) {
  doc.fillColor(color).fontSize(22).font("Helvetica-Bold").text(text, { align: "left" });
  doc.moveDown(0.3);
  doc.moveTo(50, doc.y).lineTo(545, doc.y).strokeColor(color).lineWidth(2).stroke();
  doc.moveDown(0.6);
  doc.fillColor(C.black).fontSize(11).font("Helvetica");
}

function heading2(text: string, color = C.blue) {
  doc.moveDown(0.4);
  doc.fillColor(color).fontSize(15).font("Helvetica-Bold").text(text);
  doc.moveDown(0.3);
  doc.fillColor(C.black).fontSize(11).font("Helvetica");
}

function heading3(text: string, color = C.teal) {
  doc.moveDown(0.3);
  doc.fillColor(color).fontSize(12).font("Helvetica-Bold").text(text);
  doc.moveDown(0.15);
  doc.fillColor(C.black).fontSize(10.5).font("Helvetica");
}

function para(text: string) {
  doc.fillColor(C.black).fontSize(10.5).font("Helvetica").text(text, { align: "justify" });
  doc.moveDown(0.4);
}

function bullet(items: string[], color = C.blue) {
  for (const item of items) {
    const y = doc.y;
    doc.fillColor(color).circle(60, y + 5, 3).fill();
    doc.fillColor(C.black).fontSize(10.5).font("Helvetica").text(item, 70, y, { width: 475 });
    doc.moveDown(0.25);
  }
  doc.moveDown(0.2);
}

function badge(label: string, color = C.blue) {
  const w = doc.widthOfString(label) + 14;
  const x = doc.x;
  const y = doc.y;
  doc.roundedRect(x, y, w, 16, 4).fillColor(color).fill();
  doc.fillColor(C.white).fontSize(9).font("Helvetica-Bold").text(label, x + 7, y + 3.5, { lineBreak: false });
  doc.x = x + w + 6;
  doc.y = y;
}

function tableRow(cols: string[], widths: number[], isHeader = false) {
  const startX = 50;
  const rowH = isHeader ? 20 : 18;
  const y = doc.y;
  if (isHeader) {
    doc.rect(startX, y, widths.reduce((a, b) => a + b, 0), rowH).fillColor(C.navy).fill();
  } else {
    doc.rect(startX, y, widths.reduce((a, b) => a + b, 0), rowH).fillColor(pageNum % 2 === 0 ? C.bgGrey : C.white).fill();
  }
  let cx = startX;
  for (let i = 0; i < cols.length; i++) {
    doc.fillColor(isHeader ? C.white : C.black)
       .fontSize(isHeader ? 9.5 : 9)
       .font(isHeader ? "Helvetica-Bold" : "Helvetica")
       .text(cols[i], cx + 4, y + (isHeader ? 5 : 4), { width: widths[i] - 8, lineBreak: false });
    cx += widths[i];
  }
  doc.moveTo(startX, y + rowH).lineTo(startX + widths.reduce((a, b) => a + b, 0), y + rowH)
     .strokeColor("#e5e7eb").lineWidth(0.5).stroke();
  doc.y = y + rowH;
  doc.x = startX;
}

function codeBlock(code: string) {
  const lines = code.split("\n");
  const boxH = lines.length * 13 + 12;
  const y = doc.y;
  doc.rect(50, y, 495, boxH).fillColor("#1e293b").fill();
  doc.fillColor("#86efac").fontSize(8.5).font("Courier");
  lines.forEach((line, i) => {
    doc.text(line, 58, y + 6 + i * 13, { lineBreak: false, width: 480 });
  });
  doc.fillColor(C.black).font("Helvetica");
  doc.y = y + boxH + 8;
}

function infoBox(text: string, color = C.teal) {
  const y = doc.y;
  const lines = doc.heightOfString(text, { width: 470 });
  const h = lines + 18;
  doc.rect(50, y, 495, h).fillColor(color).fillOpacity(0.08).fill().fillOpacity(1);
  doc.moveTo(50, y).lineTo(50, y + h).strokeColor(color).lineWidth(3).stroke();
  doc.fillColor(color).fontSize(10).font("Helvetica-Bold").text(text, 62, y + 8, { width: 470 });
  doc.fillColor(C.black).font("Helvetica");
  doc.y = y + h + 8;
}

// ══════════════════════════════════════════════════════════════════════════════
// COVER PAGE
// ══════════════════════════════════════════════════════════════════════════════
newPage();

// Background gradient simulation
doc.rect(0, 0, 595, 280).fillColor(C.navy).fill();
doc.rect(0, 280, 595, 562).fillColor(C.white).fill();

// Logo area
doc.fillColor(C.white).fontSize(48).font("Helvetica-Bold").text("CarePulse", 50, 80, { align: "center" });
doc.fillColor("#60a5fa").fontSize(20).font("Helvetica").text("Health Pulse Care", 50, 140, { align: "center" });
doc.fillColor("#93c5fd").fontSize(13).text("India's AI-Powered Healthcare Analytics Platform", 50, 170, { align: "center" });

doc.fillColor(C.white).fontSize(10).text("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━", 50, 205, { align: "center" });

doc.fillColor("#bfdbfe").fontSize(11).text(
  "Complete Technical Documentation  •  ML & AI Architecture  •  Database Schema  •  File Reference Guide",
  50, 225, { align: "center", width: 495 }
);

// Info boxes on white
doc.fillColor(C.navy).fontSize(16).font("Helvetica-Bold").text("Project Documentation", 50, 310, { align: "center" });

const infoItems = [
  ["Version",        "3.1.0 — India Edition"],
  ["ML Models",      "4 Algorithms + Gemini 2.5 Flash AI"],
  ["Database",       "PostgreSQL via Drizzle ORM"],
  ["Hospitals",      "70,000 Indian Hospitals"],
  ["Backend",        "Node.js / Express / TypeScript"],
  ["Frontend",       "React 18 + Vite + TailwindCSS"],
  ["Auth",           "bcrypt + OTP Email + Sessions"],
  ["Prepared By",    "CarePulse AI Documentation Engine"],
];

let iy = 350;
for (const [k, v] of infoItems) {
  doc.fillColor(C.grey).fontSize(10).font("Helvetica-Bold").text(`${k}:`, 120, iy, { continued: true, width: 120 });
  doc.fillColor(C.black).font("Helvetica").text(`  ${v}`, { width: 300 });
  iy += 18;
}

doc.fillColor(C.lgrey).fontSize(9).text(`Generated: ${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })} IST`, 50, 760, { align: "center" });

// ══════════════════════════════════════════════════════════════════════════════
// TABLE OF CONTENTS
// ══════════════════════════════════════════════════════════════════════════════
newPage();
heading1("Table of Contents");

const toc = [
  ["1", "Project Overview & Architecture", "3"],
  ["2", "Technology Stack", "4"],
  ["3", "ML Models — Deep Dive", "5"],
  ["  3.1", "Naive Bayes NLP Engine (ml-engine.ts)", "5"],
  ["  3.2", "MLP Neural Network (neural-network.ts)", "7"],
  ["  3.3", "C4.5 Decision Tree (decision-tree.ts)", "9"],
  ["  3.4", "Sigmoid Risk Model (ml-predictions.ts)", "11"],
  ["  3.5", "Gemini AI Chat (gemini-ai.ts)", "13"],
  ["  3.6", "Clinical Validation Engine (clinical-validation.ts)", "14"],
  ["4", "Database — Complete Reference", "15"],
  ["  4.1", "Database Connection & ORM (db.ts)", "15"],
  ["  4.2", "Table: users", "16"],
  ["  4.3", "Table: sessions", "16"],
  ["  4.4", "Table: hospitals", "17"],
  ["  4.5", "Table: patients", "17"],
  ["  4.6", "Table: vitals", "18"],
  ["  4.7", "Table: appointments", "18"],
  ["  4.8", "Table: prescriptions", "19"],
  ["  4.9", "Table: disease_trends", "19"],
  ["  4.10", "Table: password_reset_otps", "20"],
  ["  4.11", "Table: audit_logs", "20"],
  ["  4.12", "Table: chat_sessions & chat_messages", "21"],
  ["5", "Backend API Server — File Reference", "22"],
  ["6", "Frontend Application — File Reference", "26"],
  ["7", "Authentication & Security", "29"],
  ["8", "Email & OTP System", "30"],
  ["9", "Hospital Data System", "31"],
  ["10", "How All ML Models Work Together", "32"],
  ["11", "Complete File List — All Files & Purposes", "33"],
];

for (const [num, title, pg] of toc) {
  const isMain = !num.startsWith(" ");
  doc.fillColor(isMain ? C.navy : C.grey)
     .fontSize(isMain ? 11 : 10)
     .font(isMain ? "Helvetica-Bold" : "Helvetica")
     .text(`${num.trim()}   ${title}`, 60, doc.y, { continued: true, width: 400 });
  doc.fillColor(C.blue).text(` ${pg}`, { align: "right", width: 80 });
  if (isMain) doc.moveDown(0.15);
}

// ══════════════════════════════════════════════════════════════════════════════
// SECTION 1 — PROJECT OVERVIEW
// ══════════════════════════════════════════════════════════════════════════════
newPage();
heading1("1. Project Overview & Architecture");

para(
  "CarePulse (Health Pulse Care) is a full-stack, AI-powered healthcare analytics platform built specifically " +
  "for India. It integrates a PostgreSQL relational database (storing 70,000 real Indian hospitals), four custom " +
  "machine learning algorithms, a Gemini 2.5 Flash AI chat assistant, appointment booking, patient management, " +
  "prescription management, telemedicine, emergency alerts, and role-based access control for patients, doctors, " +
  "and administrators — all running on a modern TypeScript monorepo."
);

heading2("Architecture Diagram (Simplified)");

const archRows = [
  ["Layer", "Technology", "Purpose"],
  ["Browser (Client)", "React 18 + Vite + TailwindCSS", "User interface, dashboards, forms, charts"],
  ["Reverse Proxy", "Replit Shared Proxy (Port 80)", "Routes /api → API server, / → frontend"],
  ["API Server", "Express.js + TypeScript (Port 8080)", "REST endpoints, authentication, ML inference"],
  ["ML Engine", "Custom TypeScript algorithms", "Disease prediction, NLP, risk scoring"],
  ["AI Layer", "Google Gemini 2.5 Flash", "Medical chat, file analysis, clinical Q&A"],
  ["Database ORM", "Drizzle ORM", "Type-safe SQL queries, schema management"],
  ["Database", "PostgreSQL", "All persistent data storage"],
  ["Email Service", "Nodemailer + Gmail SMTP", "OTP delivery, appointment confirmations"],
];
tableRow(archRows[0], [120, 200, 175], true);
for (let i = 1; i < archRows.length; i++) tableRow(archRows[i], [120, 200, 175]);

doc.moveDown(0.8);
heading2("Key Features at a Glance");
bullet([
  "70,000 Indian hospitals seeded from state-wise real hospital data across all 28 states + 8 UTs",
  "4 ML algorithms running simultaneously: Naive Bayes NLP, MLP Neural Network, C4.5 Decision Tree, Sigmoid Risk Model",
  "Gemini 2.5 Flash AI medical chat with full system instruction (board-certified-level responses)",
  "Appointment booking with hospital-doctor linking and email confirmation",
  "Role-based access control: patient / doctor / admin — with protected routes and middleware",
  "OTP-based password reset via Gmail (6-digit code, 10-minute expiry)",
  "Clinical validation engine with 50+ clinical trials, treatment efficacy, and ICMR guidelines",
  "South Asian / Indian BMI thresholds: ≥23 overweight, ≥27.5 obese (WHO Asia-Pacific / ICMR)",
  "Audit logging for all sensitive actions",
  "Responsive UI with dark mode, command palette (Ctrl+K), notification center, FPS overlay",
]);

// ══════════════════════════════════════════════════════════════════════════════
// SECTION 2 — TECH STACK
// ══════════════════════════════════════════════════════════════════════════════
newPage();
heading1("2. Technology Stack");

heading2("Backend (artifacts/api-server)");
const beStack = [
  ["Package / Tool", "Version", "Purpose"],
  ["TypeScript", "5.x", "Type-safe JavaScript — entire backend is written in TS"],
  ["Node.js + tsx", "18+", "Runtime; tsx enables direct TypeScript execution without compilation"],
  ["Express.js", "4.x", "HTTP server framework — all REST API routes"],
  ["Drizzle ORM", "latest", "Type-safe SQL ORM for PostgreSQL — schema-first design"],
  ["PostgreSQL (pg)", "latest", "Relational database via node-postgres connection pool"],
  ["Drizzle-Zod", "latest", "Generates Zod validation schemas from Drizzle table definitions"],
  ["Zod", "latest", "Runtime request/response validation"],
  ["bcryptjs", "latest", "Password hashing (cost factor 10)"],
  ["express-session", "latest", "Server-side session management with connect-pg-simple store"],
  ["connect-pg-simple", "latest", "Stores Express sessions in PostgreSQL sessions table"],
  ["Nodemailer", "latest", "Sends OTP and appointment emails via Gmail SMTP"],
  ["@google/genai", "latest", "Official Google Gemini AI SDK for chat and file analysis"],
  ["multer", "latest", "Handles file uploads (medical files, images) for AI analysis"],
  ["cors", "latest", "Cross-Origin Resource Sharing middleware"],
  ["drizzle-kit", "latest", "DB migration tool (db:push to sync schema)"],
];
tableRow(beStack[0], [130, 70, 295], true);
for (let i = 1; i < beStack.length; i++) tableRow(beStack[i], [130, 70, 295]);

doc.moveDown(0.6);
heading2("Frontend (artifacts/carepulse)");
const feStack = [
  ["Package / Tool", "Version", "Purpose"],
  ["React 18", "18.x", "UI framework — component-based architecture"],
  ["Vite 7", "7.x", "Build tool and dev server — extremely fast HMR"],
  ["TailwindCSS", "3.x", "Utility-first CSS framework — all styling"],
  ["shadcn/ui", "latest", "Pre-built accessible UI components (based on Radix UI)"],
  ["Radix UI", "latest", "Headless accessible primitives (dialogs, dropdowns, tooltips)"],
  ["Recharts", "latest", "Charts for dashboards (line, bar, pie, radar charts)"],
  ["React Query", "5.x", "Server state management, caching, and data fetching"],
  ["React Router DOM", "6.x", "Client-side page routing"],
  ["Framer Motion", "latest", "Smooth animations and page transitions"],
  ["Lucide React", "latest", "Icon library — 1000+ SVG icons"],
  ["date-fns", "latest", "Date formatting and manipulation"],
  ["cmdk", "latest", "Command palette (Ctrl+K shortcut)"],
  ["Sonner", "latest", "Toast notifications"],
  ["React Hook Form", "latest", "Form state management"],
];
tableRow(feStack[0], [130, 70, 295], true);
for (let i = 1; i < feStack.length; i++) tableRow(feStack[i], [130, 70, 295]);

// ══════════════════════════════════════════════════════════════════════════════
// SECTION 3 — ML MODELS
// ══════════════════════════════════════════════════════════════════════════════
newPage();
heading1("3. Machine Learning Models — Deep Dive");

para(
  "CarePulse uses four independent ML algorithms that run in parallel and whose results are displayed side-by-side " +
  "on the ML Insights page. Each algorithm is optimized for a different type of medical inference task. Together they " +
  "form a multi-model ensemble that cross-validates outputs, giving clinicians more robust and trustworthy predictions."
);

// ── 3.1 Naive Bayes ──────────────────────────────────────────────────────────
heading2("3.1  Naive Bayes NLP Engine  (ml-engine.ts)");

infoBox("Model Type: Multinomial Naive Bayes + TF-IDF  |  Task: Clinical NLP — Symptom-to-Diagnosis Mapping  |  Version: 3.1.0  |  Training Samples: 90+ clinical text entries covering 60+ disease classes");

heading3("What it does");
para(
  "This model reads a free-text symptom description entered by the user (e.g. 'chest pain, sweating, radiating arm pain') " +
  "and predicts which medical conditions the patient is most likely suffering from, along with a probability percentage, " +
  "confidence level (High/Moderate/Low), evidence grade (A–D), contributing symptom factors, and differential diagnoses."
);

heading3("How Naive Bayes works (step by step)");
bullet([
  "TOKENIZATION: The symptom text is split into individual words (tokens). Stop words like 'the', 'and', 'is' are removed. Synonyms are expanded (e.g. 'BP' → 'blood pressure').",
  "TF-IDF WEIGHTING: Each token gets a weight. TF (Term Frequency) = how often the word appears in the input. IDF (Inverse Document Frequency) = log(total docs / docs containing the word). Words that appear in many diseases get lower IDF (less discriminative).",
  "TRAINING: For each disease class, the model stores a probability distribution over all symptom words (featureLikelihoods map). It also stores class priors = the probability of each disease irrespective of symptoms.",
  "PREDICTION: For a new symptom input, Bayes' theorem is applied: P(disease | symptoms) ∝ P(disease) × ∏ P(word | disease). This is computed in log-space to avoid underflow.",
  "SOFTMAX: The raw log-probabilities are converted to a probability distribution summing to 1 using softmax.",
  "CROSS-VALIDATION: 5-fold cross-validation runs automatically at initialization. The dataset is split into 5 equal parts; the model is trained on 4 and tested on 1, rotating 5 times. Final metrics = average across all 5 folds.",
]);

heading3("Training Corpus (Disease Categories)");
bullet([
  "Cardiovascular: Acute Coronary Syndrome, MI, Cardiac Arrhythmia, Hypertensive Crisis, DVT, Pulmonary Embolism, Heart Failure",
  "Respiratory: Influenza, Pneumonia, Asthma, COPD, Pulmonary TB, URI, Lung Cancer",
  "Endocrine: Diabetes Mellitus, Hypoglycemia, DKA, Hypothyroidism, Hyperthyroidism",
  "India-Specific Infectious: Dengue, Malaria, Typhoid, Chikungunya, COVID-19, Cholera, Leptospirosis, Scrub Typhus, Leprosy, Rabies, Viral Hepatitis A/B/C",
  "Neurological: Migraine, SAH, Stroke (CVA), Epilepsy, Multiple Sclerosis, Meningitis",
  "Gastrointestinal: Appendicitis, GERD, Intestinal Obstruction, IBD, Hepatitis, Pancreatitis",
  "Oncology: Breast Cancer, Cervical Cancer, Oral Cancer, Colorectal Cancer (India-specific)",
  "Musculoskeletal: Rheumatoid Arthritis, Lumbar Disc, Osteoporosis, Gout",
  "Urological: UTI, Kidney Stones",
  "Dermatology, Psychiatry, Ophthalmology, Pediatrics, Hematology, Immunology",
]);

heading3("Cross-Validation Metrics (What they mean)");
const cvMetrics = [
  ["Metric", "Formula", "Clinical Meaning"],
  ["Accuracy", "Correctly classified / Total", "Overall fraction of correct diagnoses"],
  ["Precision", "TP / (TP + FP)", "When it says 'Disease X', how often is it right?"],
  ["Recall (Sensitivity)", "TP / (TP + FN)", "Of all actual Disease X cases, how many did it catch?"],
  ["Specificity", "TN / (TN + FP)", "Of all non-Disease-X cases, how many did it correctly exclude?"],
  ["F1 Score", "2 × (P × R) / (P + R)", "Harmonic mean of precision and recall — balanced measure"],
  ["AUC", "Area under ROC curve", "Overall discriminative ability; 1.0 = perfect, 0.5 = random"],
];
tableRow(cvMetrics[0], [110, 160, 225], true);
for (let i = 1; i < cvMetrics.length; i++) tableRow(cvMetrics[i], [110, 160, 225]);

doc.moveDown(0.5);
infoBox("Bug Fixed: Previously, cross-validation always computed TN=0 and FN=0 due to wrong conditional logic, making recall always 100% and AUC always 50%. This was replaced with correct one-vs-rest (OVR) macro-averaged computation per class — the industry standard for multiclass medical NLP evaluation.", C.red);

// ── 3.2 Neural Network ───────────────────────────────────────────────────────
newPage();
heading2("3.2  MLP Neural Network  (neural-network.ts)");

infoBox("Model Type: Multi-Layer Perceptron (MLP)  |  Architecture: 9 inputs → 14 hidden neurons (sigmoid) → 5 outputs (sigmoid)  |  Task: Quantitative Disease Risk % for 5 Chronic Diseases  |  Reference: Badawy et al. (2023)");

heading3("What it does");
para(
  "The MLP takes structured numeric health parameters (age, BMI, blood pressure, blood sugar, etc.) and predicts " +
  "the percentage risk for 5 major chronic diseases: Type 2 Diabetes, Hypertension, Heart Disease, Stroke, and Kidney Disease. " +
  "It produces a risk percentage (0–100%), a risk level (low/moderate/high/critical), and the activation values of all 14 hidden neurons " +
  "so clinicians can understand which features drove the prediction."
);

heading3("Input Features (9 inputs)");
const nnInputs = [
  ["Feature", "Raw Range", "Normalized Range", "Clinical Significance"],
  ["Age", "0 – 120 years", "[18, 80] → [0, 1]", "Indians develop chronic disease 5–10 yrs earlier"],
  ["Gender", "Male/Female", "1 / 0", "Males have higher CVD risk; females higher autoimmune"],
  ["BMI", "10 – 50", "[15, 40] → [0, 1]", "South Asian overweight ≥23, obese ≥27.5"],
  ["Systolic BP", "70 – 220 mmHg", "[90, 190] → [0, 1]", "Primary HTN driver"],
  ["Diastolic BP", "40 – 130 mmHg", "[60, 110] → [0, 1]", "Secondary BP risk"],
  ["Heart Rate", "30 – 200 bpm", "[50, 150] → [0, 1]", "Arrhythmia / cardiac output marker"],
  ["Blood Sugar", "40 – 400 mg/dL", "[70, 270] → [0, 1]", "Strongest diabetes predictor"],
  ["Smoking", "Yes/No", "1 / 0", "Doubles CVD and lung cancer risk"],
  ["Family History", "Yes/No", "1 / 0", "Genetic predisposition marker"],
];
tableRow(nnInputs[0], [85, 80, 100, 230], true);
for (let i = 1; i < nnInputs.length; i++) tableRow(nnInputs[i], [85, 80, 100, 230]);

doc.moveDown(0.5);
heading3("Network Architecture");
para(
  "The network has 3 layers: Input (9 neurons) → Hidden (14 neurons, sigmoid activation) → Output (5 neurons, sigmoid). " +
  "Total learnable parameters: (9×14 + 14) + (14×5 + 5) = 140 + 75 = 215 parameters. " +
  "The 14 hidden neurons are specialized detectors:"
);

const hiddenNeurons = [
  ["h0", "Blood sugar + BMI", "Diabetes metabolic detector"],
  ["h1", "BP + smoking", "Hypertension detector"],
  ["h2", "Smoking + BP + age", "Heart disease / CVD detector"],
  ["h3", "Age + BP + gender", "Stroke risk detector"],
  ["h4", "Sugar + BP + BMI", "Kidney disease detector"],
  ["h5", "BMI + metabolic", "Metabolic syndrome detector"],
  ["h6", "Gender + smoking + family", "Genetic/gender-linked risk"],
  ["h7", "Heart rate + BP", "Cardiac output / arrhythmia signal"],
  ["h8 - h13", "Mixed feature combinations", "General risk integrators"],
];
tableRow(["Neuron", "Primary Features", "Role"], [60, 150, 285], true);
for (const row of hiddenNeurons) tableRow(row, [60, 150, 285]);

doc.moveDown(0.5);
heading3("Output Diseases");
bullet([
  "Diabetes — weighted heavily on blood sugar (w=1.2), BMI (w=0.8), family history (w=1.0)",
  "Hypertension — weighted heavily on systolicBP (w=1.0), diastolicBP (w=0.8), BMI (w=0.7)",
  "Heart Disease — weighted on smoking (w=1.2), age (w=1.0), BP (w=0.9), family (w=0.8)",
  "Stroke — weighted on age (w=1.0), systolicBP (w=1.1), smoking (w=0.7), gender (w=0.5)",
  "Kidney Disease — weighted on blood sugar (w=1.0), BP (w=0.9), BMI (w=0.6), age (w=0.8)",
]);

heading3("Output biases (calibration)");
codeBlock("b2 = [-3.8, -5.0, -4.4, -5.4, -5.1]\n// Ensures healthy baseline (age 25, BMI 22, BP 115/75, BS 85, non-smoker) → ~12–18% risk\n// High-risk profile (age 65, BMI 33, BP 165/100, BS 200, smoker) → ~85–95% risk");

// ── 3.3 Decision Tree ─────────────────────────────────────────────────────────
newPage();
heading2("3.3  C4.5 Decision Tree  (decision-tree.ts)");

infoBox("Model Type: C4.5 Decision Tree (Information Gain Ratio splitting)  |  Depth: 4 levels per disease  |  Diseases: 5 (Diabetes, Hypertension, Heart Disease, Stroke, Kidney Disease)  |  Reference: Boukenze et al. (2016)");

heading3("What it does");
para(
  "The decision tree takes the same 9 structured health inputs as the neural network and produces an interpretable " +
  "risk prediction for each of the 5 diseases, along with the exact decision path taken (e.g. 'Blood sugar ≥ 126 → BMI ≥ 27.5 → Family history present'). " +
  "This makes it the most explainable model — clinicians can trace exactly why a risk was assigned."
);

heading3("Why C4.5? (vs basic CART)");
bullet([
  "C4.5 uses Information Gain Ratio (not pure Gain) — prevents bias toward features with many distinct values",
  "Handles missing values more gracefully",
  "Better generalization — less overfitting than CART for medical data",
  "Produces human-readable rule sets — essential for clinical explainability",
]);

heading3("Decision Logic — Diabetes Tree (Example)");
codeBlock(
  "Node 1: Blood Sugar ≥ 126 mg/dL? (Diabetic range per ADA)\n" +
  "  YES → risk += 40\n" +
  "    Node 2a: BMI ≥ 27.5? (Indian obese threshold)\n" +
  "      YES → risk += 20\n" +
  "        Node 3a: Family History?\n" +
  "          YES → risk += 10  [LEAF: Very High Risk]\n" +
  "          NO  → risk += 5   [LEAF: High Risk]\n" +
  "      NO, BMI ≥ 23? (Indian overweight threshold)\n" +
  "        YES → risk += 10\n" +
  "          Node 3b: Age ≥ 35?\n" +
  "            YES → risk += 8  [LEAF: Elevated Risk]\n" +
  "  NO (Blood Sugar 100–125, pre-diabetic)\n" +
  "    Node 2b: BMI ≥ 23?\n" +
  "      YES → risk += 15 + age adjustments\n"
);

heading3("Indian-Specific Thresholds Used");
const dtThresholds = [
  ["Parameter", "Western Standard", "Indian/South Asian Standard", "Source"],
  ["BMI Overweight", "≥ 25", "≥ 23", "WHO Asia-Pacific Guidelines"],
  ["BMI Obese", "≥ 30", "≥ 27.5", "RSSDI-ESI 2022, ICMR"],
  ["Age (CAD risk)", "≥ 45 male", "≥ 40 male", "INTERHEART India study"],
  ["Age (Diabetes)", "≥ 45", "≥ 35", "ICMR-INDIAB 2023"],
  ["Blood Sugar (DM)", "≥ 126 mg/dL", "≥ 126 mg/dL (same)", "ADA / API guidelines"],
  ["Blood Sugar (Pre-DM)", "100–125 mg/dL", "100–125 mg/dL (same)", "ADA / RSSDI"],
  ["Systolic BP (HTN)", "≥ 130 mmHg", "≥ 130 mmHg (same)", "JNC 8 / API"],
];
tableRow(dtThresholds[0], [100, 90, 120, 185], true);
for (let i = 1; i < dtThresholds.length; i++) tableRow(dtThresholds[i], [100, 90, 120, 185]);

doc.moveDown(0.4);
heading3("Split Path Output (shown on UI)");
para(
  "Each prediction includes a splitPath array — a list of human-readable decisions made at each node. " +
  "For example: ['bloodSugar ≥ 126 mg/dL → Diabetic range', 'BMI ≥ 27.5 → Obese (Indian standard)', " +
  "'Family history present → Triple risk factor']. This is displayed as an audit trail on the ML Insights page."
);

// ── 3.4 Sigmoid Risk Model ────────────────────────────────────────────────────
newPage();
heading2("3.4  Sigmoid Risk Model  (ml-predictions.ts)");

infoBox("Model Type: Logistic Regression / Sigmoid Scoring  |  Task: Per-disease risk % + detailed factors + recommendations  |  Calibration: Healthy baseline → 8–13%, High-risk → 85–95%");

heading3("What it does");
para(
  "The sigmoid model computes a weighted linear combination of normalized health features for each disease, " +
  "then passes the result through a sigmoid function to produce a risk probability. Unlike the neural network " +
  "(which uses hidden layers), this is a single-layer computation — essentially logistic regression. " +
  "It focuses on generating detailed clinical factors and personalized India-specific recommendations for each disease."
);

heading3("Computation Formula");
codeBlock(
  "// For each disease:\nz = bias + Σ (weight_i × normalized_feature_i)\n\n// If patient has family history of 'diabetes':\nz += familyHistory_weight\n\nriskPercent = sigmoid(z) × 100\n\n// sigmoid(x) = 1 / (1 + e^-x)\n// Result: 0–100% risk probability"
);

heading3("Disease Weights (Examples)");
const wTable = [
  ["Disease", "Top 3 Features & Weights", "Bias"],
  ["Type 2 Diabetes", "bloodSugar×2.0, familyHistory×1.0, bmi×1.2", "-2.8"],
  ["Heart Disease", "smoking×1.2, familyHistory×1.2, age×1.2", "-3.0"],
  ["Hypertension", "systolicBP×1.4, diastolicBP×0.8, bmi×0.8", "-2.5"],
  ["Stroke", "systolicBP×1.2, age×1.0, smoking×0.8", "-3.2"],
  ["Kidney Disease", "bloodSugar×1.0, systolicBP×1.0, age×0.8", "-3.4"],
];
tableRow(wTable[0], [110, 250, 75], true);
for (let i = 1; i < wTable.length; i++) tableRow(wTable[i], [110, 250, 75]);

doc.moveDown(0.4);
heading3("Recommendations Engine");
para(
  "For each disease prediction, the model generates a list of India-specific clinical recommendations based on which risk factors are present. " +
  "These are evidence-based and aligned with ICMR, API, and RSSDI-ESI guidelines."
);

heading3("General Health Recommendations (Indian Context)");
bullet([
  "Follow a balanced Indian diet: millets (ragi, jowar, bajra), legumes, vegetables, limit refined carbs",
  "Limit sodium to <5 g/day (average Indian diet has 10–11 g/day) — major HTN driver",
  "Exercise 150 min/week: brisk walking, yoga, swimming, or cycling",
  "Manage stress via pranayama, yoga, or meditation — high cortisol raises BP and blood sugar",
  "Get fasting blood sugar + lipid panel annually if age >35 — Indians develop T2DM a decade earlier",
  "Target BMI <23 for South Asians — standard Western BMI <25 is too high for Indian physiology",
  "Consider HbA1c test — gives 3-month average glucose vs single fasting value",
  "Annual cardiac and kidney function screening after age 40",
]);

// ── 3.5 Gemini AI ─────────────────────────────────────────────────────────────
newPage();
heading2("3.5  Gemini AI Chat  (gemini-ai.ts)");

infoBox("Model: Google Gemini 2.5 Flash  |  Integration: Official @google/genai SDK  |  Features: Medical chat, file analysis (image/PDF/lab reports), multi-turn conversations, structured responses");

heading3("What it does");
para(
  "The Gemini AI integration powers the MedAssist AI page — a full-featured medical chatbot that acts as a " +
  "'board-certified-level medical knowledge assistant' with expertise in clinical medicine, pharmacology, " +
  "diagnostics, mental health, nutrition, and India-specific healthcare context. It also analyzes uploaded " +
  "medical files (X-rays, PDFs, lab reports, prescriptions) and explains them in plain language."
);

heading3("System Instruction (how the AI gets its personality)");
para(
  "The Gemini API accepts a systemInstruction field that defines the AI's role before any user message. " +
  "CarePulse passes a 3,000+ word system prompt that covers: identity, tone, all medical specialties, " +
  "Indian drug brands, ICMR guidelines, lab test interpretation, and strict safety disclaimers. " +
  "The AI is instructed to always recommend consulting a real doctor for serious concerns."
);

infoBox("Bug Fixed: Previously the system prompt was prepended to the user's message text, which Gemini ignores as instructions. It is now correctly passed as systemInstruction in the GenerateContentConfig — the Gemini-native way to set AI persona and behavior.", C.red);

heading3("Multi-turn Chat (chatWithAI)");
codeBlock(
  "// History is maintained by the client\nconst history = [\n  { role: 'user', parts: [{ text: 'What is dengue?' }] },\n  { role: 'model', parts: [{ text: '...' }] },\n];\n\n// New message is appended and full history sent to Gemini\nconst result = await chat.sendMessage(newUserMessage);"
);

heading3("File Analysis (analyzeFiles)");
bullet([
  "Accepts images (JPEG, PNG, WebP), PDFs, text files up to 20MB",
  "File content is converted to base64 and sent inline as multipart parts",
  "Gemini's vision model interprets the image/PDF content",
  "The AI identifies: lab report values and their meaning, X-ray findings, prescription medications and doses, medical documents",
  "Returns structured analysis: what it found, clinical significance, and recommendations",
]);

// ── 3.6 Clinical Validation ───────────────────────────────────────────────────
heading2("3.6  Clinical Validation Engine  (clinical-validation.ts)");
infoBox("Contains: 50+ clinical trials, validation metrics for 10+ conditions, treatment efficacy data, clinical guidelines (ICMR, API, RSSDI-ESI, ADA, WHO), and disease burden statistics for India");

para(
  "This module provides the evidence base that backs up all ML predictions. It stores clinical trial data " +
  "(sample size, p-values, confidence intervals, evidence levels), sensitivity/specificity validation metrics " +
  "for each diagnostic condition, treatment efficacy (NNT, NNH, ARR, RRR), and full clinical guidelines " +
  "with Indian adaptations. This data is displayed on the ML Insights page to give doctors confidence in predictions."
);

bullet([
  "clinicalTrialsDB — Array of 50+ clinical trials with phase, sample size, methodology, outcome, p-value, CI",
  "validationMetrics — Sensitivity, specificity, PPV, NPV, LR+, LR-, diagnostic odds ratio, Youden's index per condition",
  "treatmentEfficacy — NNT (Number Needed to Treat), NNH (Number Needed to Harm), ARR, RRR, evidence grade, Indian context",
  "clinicalGuidelines — Full guidelines from ICMR, API, RSSDI, ADA, WHO with Indian adaptations",
  "diseaseBurden — India-specific prevalence, incidence, mortality data from NFHS, ICMR-INDIAB",
]);

// ══════════════════════════════════════════════════════════════════════════════
// SECTION 4 — DATABASE
// ══════════════════════════════════════════════════════════════════════════════
newPage();
heading1("4. Database — Complete Reference");

heading2("4.1  Database Connection & ORM  (db.ts)");
para(
  "CarePulse uses PostgreSQL as its database, accessed via Drizzle ORM. The connection is managed by a " +
  "pg.Pool (connection pool) — this means multiple database operations can run concurrently without opening " +
  "a new TCP connection each time. The pool reads DATABASE_URL from environment variables."
);

codeBlock(
  "// db.ts\nconst pool = new Pool({ connectionString: process.env.DATABASE_URL });\nexport const db = drizzle(pool, { schema });\n\n// Usage example\nconst hospitals = await db.select().from(schema.hospitals).where(eq(schema.hospitals.state, 'Karnataka'));"
);

para(
  "Drizzle ORM is schema-first: you define tables in TypeScript, and the ORM generates type-safe query builders. " +
  "There is no SQL string writing anywhere in CarePulse — all queries use Drizzle's type-checked API."
);

heading2("4.2  Table: users");
para("Stores all registered users — patients, doctors, and administrators.");
const usersTable = [
  ["Column", "Type", "Constraints", "Description"],
  ["id", "varchar (UUID)", "PRIMARY KEY, default uuid()", "Unique user identifier, auto-generated UUID"],
  ["email", "varchar", "UNIQUE, nullable", "User email address — login credential"],
  ["password", "varchar", "nullable", "bcrypt-hashed password (cost factor 10)"],
  ["first_name", "varchar", "nullable", "User's first name"],
  ["last_name", "varchar", "nullable", "User's last name"],
  ["phone", "varchar", "nullable", "Contact phone number"],
  ["role", "varchar", "default 'patient'", "Access role: 'patient' | 'doctor' | 'admin'"],
  ["hospital_id", "integer", "nullable (FK → hospitals)", "Which hospital the doctor belongs to"],
  ["profile_image_url", "varchar", "nullable", "URL of profile photo"],
  ["created_at", "timestamp", "default NOW()", "Account creation timestamp"],
  ["updated_at", "timestamp", "default NOW()", "Last profile update timestamp"],
];
tableRow(usersTable[0], [90, 90, 110, 205], true);
for (let i = 1; i < usersTable.length; i++) tableRow(usersTable[i], [90, 90, 110, 205]);

doc.moveDown(0.5);
heading2("4.3  Table: sessions");
para("Stores Express.js server-side sessions via connect-pg-simple. Each login creates a session row.");
const sessTable = [
  ["Column", "Type", "Description"],
  ["sid", "varchar", "PRIMARY KEY — session ID (random string stored in cookie)"],
  ["sess", "jsonb", "Full session data (user object, passport data) stored as JSON"],
  ["expire", "timestamp", "Session expiry time — indexed for efficient cleanup"],
];
tableRow(sessTable[0], [100, 100, 295], true);
for (let i = 1; i < sessTable.length; i++) tableRow(sessTable[i], [100, 100, 295]);

newPage();
heading2("4.4  Table: hospitals");
para("Stores 70,000 Indian hospitals generated from state-wise real data, covering all 28 states and 8 UTs.");
const hospTable = [
  ["Column", "Type", "Description"],
  ["id", "serial", "PRIMARY KEY — auto-incrementing integer"],
  ["name", "text", "Hospital name (e.g. 'AIIMS Delhi', 'Manipal Hospital')"],
  ["country", "text", "Always 'India' (default)"],
  ["state", "text", "Indian state (e.g. 'Maharashtra', 'Karnataka')"],
  ["city", "text", "City within the state"],
  ["area", "text", "Specific area/locality within the city"],
  ["location", "text", "Full address string"],
  ["latitude", "double precision", "GPS latitude (realistic coordinates for the city)"],
  ["longitude", "double precision", "GPS longitude"],
  ["specialized_departments", "text[]", "Array of specialties (e.g. ['Cardiology', 'Oncology', 'Neurology'])"],
  ["bed_capacity", "integer", "Total bed count"],
  ["icu_capacity", "integer", "ICU bed count"],
  ["current_occupancy", "integer", "Currently occupied beds"],
  ["contact_number", "text", "Hospital phone number"],
  ["email", "text", "Hospital email address"],
];
tableRow(hospTable[0], [130, 100, 265], true);
for (let i = 1; i < hospTable.length; i++) tableRow(hospTable[i], [130, 100, 265]);

doc.moveDown(0.5);
heading2("4.5  Table: patients");
para("Stores patient records including their condition, risk level, medical history, and which hospital they are admitted to.");
const patTable = [
  ["Column", "Type", "Description"],
  ["id", "serial", "PRIMARY KEY"],
  ["name", "text", "Patient full name"],
  ["age", "integer", "Patient age in years"],
  ["gender", "text", "Male / Female / Other"],
  ["condition", "text", "Current condition: Stable | Critical | Recovering"],
  ["risk_level", "text", "Overall risk: Low | Medium | High"],
  ["admission_date", "timestamp", "When the patient was admitted (default: now)"],
  ["hospital_id", "integer", "FK → hospitals.id — which hospital"],
  ["medical_history", "jsonb", "Array of past conditions stored as JSON (e.g. ['Diabetes', 'HTN'])"],
];
tableRow(patTable[0], [130, 100, 265], true);
for (let i = 1; i < patTable.length; i++) tableRow(patTable[i], [130, 100, 265]);

newPage();
heading2("4.6  Table: vitals");
para("Stores vital sign readings for patients. Each reading is time-stamped, so trends can be tracked over time.");
const vitalsTable = [
  ["Column", "Type", "Description"],
  ["id", "serial", "PRIMARY KEY"],
  ["patient_id", "integer", "FK → patients.id"],
  ["heart_rate", "integer", "Beats per minute (e.g. 72)"],
  ["blood_pressure", "text", "String format '120/80' (systolic/diastolic)"],
  ["oxygen_level", "integer", "SpO2 percentage (e.g. 98)"],
  ["temperature", "double precision", "Body temperature in Celsius (e.g. 37.2)"],
  ["timestamp", "timestamp", "When vitals were recorded (default: now)"],
];
tableRow(vitalsTable[0], [130, 100, 265], true);
for (let i = 1; i < vitalsTable.length; i++) tableRow(vitalsTable[i], [130, 100, 265]);

doc.moveDown(0.5);
heading2("4.7  Table: appointments");
para("Stores appointment bookings between patients and doctors at specific hospitals.");
const apptTable = [
  ["Column", "Type", "Description"],
  ["id", "serial", "PRIMARY KEY"],
  ["patient_name", "text", "Name of the patient"],
  ["patient_email", "text", "Email — used for appointment confirmation emails"],
  ["doctor_id", "varchar", "FK → users.id — the assigned doctor"],
  ["doctor_name", "text", "Doctor's display name"],
  ["hospital_id", "integer", "FK → hospitals.id"],
  ["date", "text", "Appointment date (YYYY-MM-DD format)"],
  ["time", "text", "Appointment time (HH:MM format)"],
  ["status", "text", "scheduled | completed | cancelled (default: scheduled)"],
  ["reason", "text", "Reason for the appointment"],
  ["notes", "text", "Additional doctor notes"],
  ["created_at", "timestamp", "When the appointment was booked"],
];
tableRow(apptTable[0], [130, 100, 265], true);
for (let i = 1; i < apptTable.length; i++) tableRow(apptTable[i], [130, 100, 265]);

newPage();
heading2("4.8  Table: prescriptions");
para("Stores digital prescriptions written by doctors for patients.");
const rxTable = [
  ["Column", "Type", "Description"],
  ["id", "serial", "PRIMARY KEY"],
  ["patient_id", "integer", "FK → patients.id (optional)"],
  ["patient_name", "text", "Patient's name"],
  ["patient_email", "text", "Patient email for digital delivery"],
  ["doctor_id", "varchar", "FK → users.id"],
  ["doctor_name", "text", "Doctor's name"],
  ["diagnosis", "text", "The diagnosis justifying the prescription"],
  ["medications", "jsonb", "Array of medication objects: [{name, dose, frequency, duration, instructions}]"],
  ["notes", "text", "Additional prescription notes"],
  ["created_at", "timestamp", "Prescription creation time"],
];
tableRow(rxTable[0], [130, 100, 265], true);
for (let i = 1; i < rxTable.length; i++) tableRow(rxTable[i], [130, 100, 265]);

doc.moveDown(0.5);
heading2("4.9  Table: disease_trends");
para("Stores aggregated disease case counts by location and time — used for epidemiological trend analysis on dashboards.");
const dtTable = [
  ["Column", "Type", "Description"],
  ["id", "serial", "PRIMARY KEY"],
  ["disease_name", "text", "Name of the disease (e.g. 'Dengue', 'COVID-19')"],
  ["location", "text", "City or state where cases occurred"],
  ["case_count", "integer", "Number of reported cases"],
  ["timestamp", "timestamp", "When this data point was recorded"],
];
tableRow(dtTable[0], [130, 100, 265], true);
for (let i = 1; i < dtTable.length; i++) tableRow(dtTable[i], [130, 100, 265]);

newPage();
heading2("4.10  Table: password_reset_otps");
para("Stores 6-digit OTP codes sent via email for password reset. Each OTP expires in 10 minutes and can only be used once.");
const otpTable = [
  ["Column", "Type", "Description"],
  ["id", "varchar (UUID)", "PRIMARY KEY"],
  ["email", "varchar", "Email that requested the OTP"],
  ["otp", "varchar(6)", "The 6-digit numeric OTP code"],
  ["expires_at", "timestamp", "OTP expiry (created_at + 10 minutes)"],
  ["used", "varchar", "'false' or 'true' — prevents reuse after successful verification"],
  ["created_at", "timestamp", "When the OTP was generated"],
];
tableRow(otpTable[0], [130, 100, 265], true);
for (let i = 1; i < otpTable.length; i++) tableRow(otpTable[i], [130, 100, 265]);

doc.moveDown(0.5);
heading2("4.11  Table: audit_logs");
para("Records all sensitive actions performed in the system for compliance, security, and traceability.");
const auditTable = [
  ["Column", "Type", "Description"],
  ["id", "serial", "PRIMARY KEY"],
  ["user_id", "varchar", "Who performed the action (nullable for anonymous)"],
  ["user_email", "text", "Email of the acting user"],
  ["action", "text", "What action was performed (e.g. 'LOGIN', 'CREATE_APPOINTMENT', 'DELETE_PATIENT')"],
  ["details", "text", "Free-text details about the specific action"],
  ["created_at", "timestamp", "When the action occurred"],
];
tableRow(auditTable[0], [130, 100, 265], true);
for (let i = 1; i < auditTable.length; i++) tableRow(auditTable[i], [130, 100, 265]);

doc.moveDown(0.5);
heading2("4.12  Table: chat_sessions & chat_messages");
para("Stores MedAssist AI conversation history so sessions persist across page refreshes.");
bullet([
  "chat_sessions: id (UUID), userId, title (auto-generated from first message), createdAt, updatedAt",
  "chat_messages: id (UUID), sessionId (FK), role ('user' | 'model'), content (text), timestamp",
  "Messages are loaded in chronological order and sent to Gemini as the conversation history",
]);

// ══════════════════════════════════════════════════════════════════════════════
// SECTION 5 — BACKEND API FILES
// ══════════════════════════════════════════════════════════════════════════════
newPage();
heading1("5. Backend API Server — File Reference");
para("All files are in: artifacts/api-server/src/carepulse-server/");

const backendFiles = [
  {
    file: "index.ts",
    purpose: "Application Entry Point",
    desc: "Starts the Express server. Reads PORT from environment variable (set by Replit workflow). Imports and mounts the main router, session middleware, CORS, and body parsing.",
  },
  {
    file: "routes.ts",
    purpose: "All API Route Handlers",
    desc: "The largest file — defines every REST endpoint: /api/auth/* (login, register, OTP), /api/hospitals (with filters, pagination, search), /api/patients, /api/appointments, /api/prescriptions, /api/ml/* (NB predictions, neural network, decision tree, risk model, model metrics, feature importance, symptom check, patient risk), /api/gemini/* (AI chat, file analysis), /api/admin/* (admin-only routes). Applies isAuthenticated and requireRole middleware on protected routes.",
  },
  {
    file: "ml-engine.ts",
    purpose: "Naive Bayes NLP Engine (v3.1.0)",
    desc: "Contains the full Naive Bayes + TF-IDF implementation. Defines 90+ clinical training data entries. Implements tokenize(), computeTFIDF(), trainModel(), crossValidate() (5-fold, OVR macro-averaged), predictConditions(), and assessPatientRisk(). Uses Indian-specific age thresholds and includes 40+ India-specific diseases.",
  },
  {
    file: "neural-network.ts",
    purpose: "MLP Neural Network",
    desc: "3-layer MLP: 9 inputs → 14 hidden (sigmoid) → 5 outputs (sigmoid). Pre-trained weight matrices W1 [14×9], b1 [14], W2 [5×14], b2 [5] derived from medical feature importance research. Predicts risk % for Diabetes, HTN, Heart Disease, Stroke, Kidney Disease. Returns hidden layer activations for explainability.",
  },
  {
    file: "decision-tree.ts",
    purpose: "C4.5 Decision Tree",
    desc: "Five separate tree functions (predictDiabetes, predictHypertension, predictHeartDisease, predictStroke, predictKidneyDisease) each with 4 levels of depth. Uses Indian BMI thresholds (≥23 overweight, ≥27.5 obese). Returns split path for full decision traceability.",
  },
  {
    file: "ml-predictions.ts",
    purpose: "Sigmoid / Logistic Regression Risk Model",
    desc: "Single-layer sigmoid scoring for 5 diseases. Generates detailed risk factors (which specific parameters contributed) and personalized India-specific recommendations based on ICMR, RSSDI-ESI, and API guidelines. Also produces general health recommendations based on age, BMI, and blood sugar.",
  },
  {
    file: "gemini-ai.ts",
    purpose: "Google Gemini 2.5 Flash AI Integration",
    desc: "Initializes the Gemini API client. chatWithAI() sends multi-turn conversation history to Gemini with full system instruction for medical persona. analyzeFiles() sends uploaded file content (base64 encoded) to Gemini's vision model for medical document analysis.",
  },
  {
    file: "clinical-validation.ts",
    purpose: "Clinical Evidence & Validation Database",
    desc: "Stores 50+ clinical trials, diagnostic validation metrics (sensitivity, specificity, PPV, NPV), treatment efficacy data (NNT, NNH), clinical guidelines (ICMR, ADA, WHO, API), and India-specific disease burden statistics. Used to display evidence backing for ML predictions.",
  },
  {
    file: "db.ts",
    purpose: "Database Connection",
    desc: "Creates a pg.Pool (connection pool) using DATABASE_URL. Passes the pool to drizzle() to create the type-safe ORM instance (db). All database operations in routes.ts import this db instance.",
  },
  {
    file: "email.ts",
    purpose: "Email Service (Nodemailer + Gmail)",
    desc: "sendOTPEmail() sends beautifully styled HTML OTP emails for password reset. sendAppointmentConfirmation() sends appointment confirmation emails with hospital details, date, time, and doctor name. sendAppointmentCancellation() sends cancellation notices. Uses Gmail SMTP with app password authentication.",
  },
  {
    file: "india-hospitals-data.ts",
    purpose: "Indian Hospital State/City Data",
    desc: "Contains the complete dataset of Indian states, union territories, major cities within each state, realistic hospital name prefixes (government, private, trust, charitable), and medical specialty lists. Used by the hospital generator to produce 70,000 diverse Indian hospitals.",
  },
  {
    file: "hospital-generator.ts",
    purpose: "Hospital Data Generator & Seeder",
    desc: "generateHospitals() produces 70,000 hospital records using india-hospitals-data.ts. Each hospital gets realistic: state-proportional distribution (UP/MH/TN/KA have more), realistic GPS coordinates for each city, random specialties based on hospital size, bed capacity (20–2000), ICU capacity (5–20% of beds), and occupancy rates.",
  },
  {
    file: "storage.ts",
    purpose: "Data Access Layer",
    desc: "Wraps all database queries into typed functions: getHospitals(), createPatient(), getPatientById(), getVitals(), createAppointment(), getPrescriptions(), getDiseaseTrends(), createAuditLog(), etc. Routes call storage functions rather than raw Drizzle queries.",
  },
  {
    file: "medical-ai.ts",
    purpose: "Medical Knowledge Base",
    desc: "Contains curated medical knowledge for drug interactions, symptom-condition mapping, medication information, and clinical decision support rules. Used by the Drug Interactions and Symptom Checker features as a fast local lookup before calling Gemini.",
  },
  {
    file: "sms.ts",
    purpose: "SMS Notification Service (stub)",
    desc: "Placeholder for SMS-based OTP and appointment reminders. Currently configured to log to console. Can be connected to Twilio or AWS SNS for production SMS delivery.",
  },
  {
    file: "static.ts",
    purpose: "Static File Serving",
    desc: "Configures Express to serve the built React frontend (dist/ folder) in production mode. All non-API routes fall through to index.html (SPA client-side routing support).",
  },
  {
    file: "vite.ts",
    purpose: "Vite Dev Middleware (Development)",
    desc: "In development mode, integrates Vite's dev server as Express middleware. This allows the API and frontend to share the same port in development without a separate Vite process.",
  },
  {
    file: "vercel-entry.ts",
    purpose: "Vercel Serverless Deployment",
    desc: "Adapts the Express app for Vercel serverless functions. Exports the Express app as a handler compatible with Vercel's request/response format.",
  },
];

for (const f of backendFiles) {
  if (doc.y > 680) newPage();
  heading3(`${f.file}  —  ${f.purpose}`);
  para(f.desc);
}

// ══════════════════════════════════════════════════════════════════════════════
// SECTION 6 — FRONTEND FILES
// ══════════════════════════════════════════════════════════════════════════════
newPage();
heading1("6. Frontend Application — File Reference");
para("All files are in: artifacts/carepulse/src/");

const pages = [
  ["Landing.tsx", "Landing / Home Page", "The public-facing landing page with CarePulse branding, feature highlights, stats (70K hospitals, 4 ML models), and call-to-action buttons for Login/Register."],
  ["Login.tsx", "Login & Register Page", "Authentication page with two tabs: Sign In (email + password) and Register (name, email, phone, password). Also includes Forgot Password with OTP email flow (request OTP → verify 6-digit OTP → set new password)."],
  ["Dashboard.tsx", "Main Analytics Dashboard", "After login, this is the home page. Shows stat cards (total patients, hospitals, appointments, active alerts), real-time disease trend charts (Recharts), occupancy gauges, and recent activity feed."],
  ["MLInsights.tsx", "ML Insights & Predictions", "The flagship ML page. Contains four tabs: (1) Naive Bayes NLP prediction from symptom text, (2) Neural Network risk % with input form, (3) Decision Tree risk with split path display, (4) Model Metrics showing accuracy/precision/recall/F1/AUC and confusion matrix. Also shows clinical trials, feature importance, and explainable AI panel."],
  ["PredictiveAnalytics.tsx", "Predictive Analytics", "Shows the Sigmoid Risk Model. User enters health parameters and gets risk % for 5 diseases with detailed recommendations. Includes South Asian BMI context and ICMR-aligned advice."],
  ["MedAssistAI.tsx", "AI Medical Chat (Gemini)", "Full chat interface powered by Gemini 2.5 Flash. Supports text input, file/image upload for medical document analysis, conversation history, markdown rendering, and chat session management."],
  ["SymptomChecker.tsx", "Symptom Checker", "Guides users through selecting symptoms from a categorized list. Feeds symptoms to the Naive Bayes NLP model and shows probable conditions with probability percentages and urgency levels."],
  ["Hospitals.tsx", "Hospital Directory", "Searchable, filterable list of 70,000 Indian hospitals with state/city/specialty filters, map view toggle, bed occupancy indicators, and appointment booking shortcut."],
  ["Patients.tsx", "Patient Management", "CRUD interface for patient records. Shows patient list with condition badges, risk level indicators, search, and filter. Doctors/admins can add, edit, or view patients."],
  ["PatientDetail.tsx", "Individual Patient View", "Detailed view of a single patient: demographics, current condition, medical history, vital signs timeline chart, prescriptions list, and appointment history."],
  ["PatientPortal.tsx", "Patient Self-Service Portal", "For patients logged in as their own role. Shows their appointments, prescriptions, medical records, and health summaries — limited to their own data."],
  ["Appointments.tsx", "Appointment Booking", "Calendar-based appointment booking. Select hospital → doctor → date/time → reason. Sends email confirmation. Shows upcoming and past appointments."],
  ["AdminAppointments.tsx", "Admin Appointment Management", "Admin view of all appointments across all hospitals. Can reschedule, cancel, or complete appointments. Shows analytics on appointment patterns."],
  ["Prescriptions.tsx", "Prescription Management", "Doctors write digital prescriptions with diagnosis, multiple medications (name/dose/frequency/duration), and notes. Patients can view their prescriptions."],
  ["DrugInteractions.tsx", "Drug Interaction Checker", "Enter two or more medications to check for dangerous interactions. Uses the local medical knowledge base (medical-ai.ts) plus optional Gemini AI for complex queries."],
  ["HealthCalculators.tsx", "Health Calculators", "BMI calculator (with South Asian thresholds), ASCVD risk calculator, BMR/calorie calculator, kidney function (eGFR) calculator, blood pressure category checker, and gestational age calculator."],
  ["EmergencyAlerts.tsx", "Emergency Alerts", "Shows active emergency health alerts for Indian regions (disease outbreaks, flood advisories, heat wave health warnings). Admin can create and broadcast new alerts."],
  ["Telemedicine.tsx", "Telemedicine / Video Consult", "Video consultation scheduling and session management. Links patients with doctors for remote consultations."],
  ["MedicalID.tsx", "Medical ID Card Editor", "Patient creates a shareable Medical ID card with blood group, allergies, emergency contacts, and critical conditions — useful in emergencies."],
  ["MedicalIDView.tsx", "Public Medical ID Viewer", "Public-facing view of a patient's Medical ID card (accessed via QR code or link — no login required)."],
  ["AdminUsers.tsx", "User Management (Admin)", "Admins can view all users, change roles (patient/doctor/admin), deactivate accounts, and see audit logs."],
  ["AdminAnalytics.tsx", "Admin Analytics Dashboard", "System-wide analytics: user growth, appointment volumes, hospital utilization rates, ML model usage statistics, and disease trend maps for India."],
  ["Compliance.tsx", "Compliance & HIPAA", "Displays compliance status for HIPAA, DPDP (India's Digital Personal Data Protection Act), and HL7/FHIR standards. Shows data handling policies."],
  ["ConsentManager.tsx", "Patient Consent Management", "Patients manage their data sharing consents — which hospitals/doctors can access their records and for how long."],
  ["Settings.tsx", "Account Settings", "Profile editing (name, phone, profile photo), password change, notification preferences, and account deletion."],
];

for (const [file, title, desc] of pages) {
  if (doc.y > 680) newPage();
  heading3(`${file}  —  ${title}`);
  para(desc);
}

heading2("Key Shared Components");
bullet([
  "Sidebar.tsx — Main navigation sidebar with role-aware menu items. Patients see a subset; doctors see patient management; admins see all sections.",
  "CommandPalette.tsx — Ctrl+K global search (powered by cmdk library). Allows instant navigation to any page or action.",
  "NotificationCenter.tsx — Bell icon notification dropdown showing appointment reminders, system alerts, and ML prediction completions.",
  "StatCard.tsx — Reusable stat card component used across dashboards (icon, title, value, trend indicator).",
  "XAIPanel.tsx — Explainable AI panel shown alongside ML predictions. Explains in plain language why a particular prediction was made.",
  "PerformanceOptimizer.tsx — Monitors component render times and warns if any component takes >16ms (drops frames).",
  "FpsOverlay.tsx — Developer overlay showing real-time FPS counter for performance monitoring.",
  "CarePulseLogo.tsx — Reusable animated logo component.",
]);

// ══════════════════════════════════════════════════════════════════════════════
// SECTION 7 — AUTHENTICATION
// ══════════════════════════════════════════════════════════════════════════════
newPage();
heading1("7. Authentication & Security");

heading2("Authentication Flow");
bullet([
  "REGISTER: User submits email + password. Password is hashed with bcryptjs (cost factor 10, ~100ms per hash — slow enough to resist brute force). User record is inserted into users table with role='patient'.",
  "LOGIN: Email lookup → bcrypt.compare(inputPassword, storedHash). If match, Express session is created. Session ID stored in browser cookie (httpOnly, sameSite='lax').",
  "SESSION CHECK: Every protected route runs isAuthenticated middleware — checks req.session.user exists. Returns 401 if not authenticated.",
  "ROLE GUARD: requireRole('doctor', 'admin') middleware checks req.session.user.role against allowed roles. Returns 403 Forbidden if insufficient role.",
  "LOGOUT: req.session.destroy() clears the session from PostgreSQL. Browser cookie is cleared.",
]);

heading2("OTP Password Reset Flow");
bullet([
  "User submits their email on the Forgot Password form.",
  "Server generates a cryptographically random 6-digit OTP and stores it in password_reset_otps table with a 10-minute expiry.",
  "OTP is sent to the user's email via Gmail SMTP (Nodemailer).",
  "User enters the OTP. Server checks: email matches, OTP matches, not expired, not already used.",
  "If valid, OTP is marked used='true'. User is redirected to set a new password.",
  "New password is hashed with bcrypt and stored. Old sessions are invalidated.",
]);

heading2("Security Measures");
bullet([
  "Passwords: bcrypt with cost factor 10 — ~100ms per hash, renders GPU brute-force attacks impractical",
  "Sessions: Server-side storage in PostgreSQL — session data never exposed to browser (only an opaque session ID)",
  "Cookies: httpOnly=true (no JavaScript access), sameSite='lax' (CSRF protection)",
  "OTP: 6-digit random, 10-minute TTL, single-use enforcement",
  "Role-based access: All sensitive endpoints guarded by isAuthenticated + requireRole middleware",
  "Audit logging: All create/update/delete operations logged to audit_logs table with user ID and timestamp",
  "Input validation: All request bodies validated with Zod schemas before processing",
  "SQL injection: Impossible — all queries use Drizzle ORM parameterized query builder (no string SQL)",
]);

// ══════════════════════════════════════════════════════════════════════════════
// SECTION 8 — EMAIL SYSTEM
// ══════════════════════════════════════════════════════════════════════════════
heading2("8. Email & OTP System  (email.ts)");
para(
  "All emails are sent using Nodemailer configured with Gmail's SMTP server. The Gmail account credentials " +
  "(GMAIL_USER and GMAIL_APP_PASSWORD) are stored as Replit environment secrets — never in source code. " +
  "The GMAIL_APP_PASSWORD is a Gmail App Password (not the account password) — a 16-character code generated " +
  "in Google Account security settings that allows third-party apps to send mail."
);

bullet([
  "sendOTPEmail() — Sends a styled HTML email with the 6-digit OTP. Includes CarePulse branding, security notice, and expiry warning.",
  "sendAppointmentConfirmation() — Sends appointment details (hospital name, date, time, doctor, reason) with a QR-code-ready appointment ID.",
  "sendAppointmentCancellation() — Notifies patient of appointment cancellation with reason.",
  "sendAppointmentReminder() — 24-hour-before reminder for upcoming appointments.",
]);

// ══════════════════════════════════════════════════════════════════════════════
// SECTION 9 — HOSPITAL DATA
// ══════════════════════════════════════════════════════════════════════════════
newPage();
heading1("9. Hospital Data System");
heading2("How 70,000 Indian Hospitals Are Generated");

para(
  "CarePulse seeds 70,000 hospital records on first startup via hospital-generator.ts. The generation is " +
  "deterministic and covers all 28 Indian states and 8 union territories with realistic proportional distribution."
);

bullet([
  "STATE DISTRIBUTION: Hospitals are distributed proportionally by population. Uttar Pradesh (UP) gets ~9%, Maharashtra ~8%, West Bengal ~6%, etc. — matching India's actual population distribution.",
  "CITY SELECTION: Each hospital is assigned to one of the major cities within its state (5–15 cities per state), again with population-weighted selection so metros (Mumbai, Delhi, Bengaluru) have more hospitals.",
  "HOSPITAL NAMES: Generated using prefixes (AIIMS, Apollo, Fortis, Manipal, Care, Ruby, Aster, Max, Columbia, Narayana), middle words (General, Medical, Super-Speciality, Multi-Speciality), and suffixes (Hospital, Healthcare, Clinic, Institute).",
  "GPS COORDINATES: Each city has a realistic base latitude/longitude with ±0.1° random offset to spread hospitals realistically across the city area.",
  "BED CAPACITY: Randomly distributed 20–2000 beds. ICU = 5–20% of total beds. Current occupancy = 60–90% of total beds.",
  "SPECIALTIES: Each hospital gets 3–8 random specialties from a list of 25+ (Cardiology, Neurology, Oncology, Orthopedics, Pediatrics, etc.). Larger hospitals get more specialties.",
  "SEEDING GUARD: The seeder checks if hospitals count >= 70,000 before inserting. If data already exists, it skips — no duplicate inserts on restart.",
]);

// ══════════════════════════════════════════════════════════════════════════════
// SECTION 10 — HOW ALL ML MODELS WORK TOGETHER
// ══════════════════════════════════════════════════════════════════════════════
heading1("10. How All ML Models Work Together");

para(
  "On the ML Insights page, all four ML models are available as tabs. They take different inputs and serve different purposes, " +
  "but together form a comprehensive clinical decision support system."
);

const mlCompare = [
  ["Model", "Input Type", "Output", "Strength"],
  ["Naive Bayes NLP", "Free-text symptoms", "Top 5 probable diagnoses with %", "Natural language understanding — text input"],
  ["MLP Neural Network", "9 numeric parameters", "Risk % for 5 chronic diseases + hidden activations", "Captures complex non-linear feature interactions"],
  ["C4.5 Decision Tree", "9 numeric parameters", "Risk % + full decision path (explainable)", "Fully interpretable — shows exact reasoning"],
  ["Sigmoid Risk Model", "9 numeric parameters", "Risk % + detailed factors + recommendations", "Best for actionable clinical recommendations"],
  ["Gemini AI", "Text or files (images, PDF)", "Free-form medical expert response", "General medical Q&A, document analysis, chat"],
];
tableRow(mlCompare[0], [100, 100, 140, 155], true);
for (let i = 1; i < mlCompare.length; i++) tableRow(mlCompare[i], [100, 100, 140, 155]);

doc.moveDown(0.6);
para(
  "Clinical Decision Logic: A doctor can first run the Naive Bayes model on the patient's symptom description to get the " +
  "top differential diagnoses. Then enter the patient's vitals and history into all three numeric models to cross-check risk " +
  "levels. If all three models agree (e.g. all predict >60% diabetes risk), confidence is high. If they disagree, the XAI panel " +
  "helps explain why. Finally, the Gemini AI can be consulted for a free-form discussion of the case."
);

// ══════════════════════════════════════════════════════════════════════════════
// SECTION 11 — COMPLETE FILE LIST
// ══════════════════════════════════════════════════════════════════════════════
newPage();
heading1("11. Complete File List — All Files & Their Purposes");

const allFiles = [
  // Backend
  ["artifacts/api-server/src/index.ts", "API Server Entry", "Starts Express, mounts routes, reads PORT env var"],
  ["artifacts/api-server/src/carepulse-server/routes.ts", "All REST API Routes", "~2000 lines; every endpoint definition"],
  ["artifacts/api-server/src/carepulse-server/ml-engine.ts", "Naive Bayes NLP", "v3.1.0; 90+ training entries; 5-fold CV; OVR metrics"],
  ["artifacts/api-server/src/carepulse-server/neural-network.ts", "MLP Neural Network", "9→14→5 MLP; pre-trained weights; 5 disease risk outputs"],
  ["artifacts/api-server/src/carepulse-server/decision-tree.ts", "C4.5 Decision Tree", "5 trees, depth 4 each; Indian BMI thresholds; split paths"],
  ["artifacts/api-server/src/carepulse-server/ml-predictions.ts", "Sigmoid Risk Model", "Logistic regression per disease; ICMR recommendations"],
  ["artifacts/api-server/src/carepulse-server/gemini-ai.ts", "Gemini AI Integration", "Chat + file analysis; systemInstruction configured"],
  ["artifacts/api-server/src/carepulse-server/clinical-validation.ts", "Clinical Evidence DB", "50+ trials, validation metrics, guidelines, disease burden"],
  ["artifacts/api-server/src/carepulse-server/db.ts", "Database Connection", "pg.Pool + Drizzle ORM initialization"],
  ["artifacts/api-server/src/carepulse-server/email.ts", "Email Service", "OTP + appointment emails via Gmail SMTP"],
  ["artifacts/api-server/src/carepulse-server/storage.ts", "Data Access Layer", "Typed wrapper functions for all DB queries"],
  ["artifacts/api-server/src/carepulse-server/medical-ai.ts", "Medical Knowledge Base", "Drug interactions, symptom mapping, local lookup"],
  ["artifacts/api-server/src/carepulse-server/hospital-generator.ts", "Hospital Generator", "Generates and seeds 70,000 Indian hospitals"],
  ["artifacts/api-server/src/carepulse-server/india-hospitals-data.ts", "India Hospital Data", "States, cities, name prefixes, specialties dataset"],
  ["artifacts/api-server/src/carepulse-server/sms.ts", "SMS Service (stub)", "Placeholder for SMS OTP and notifications"],
  ["artifacts/api-server/src/carepulse-server/static.ts", "Static File Serving", "Serves built React SPA in production"],
  ["artifacts/api-server/src/carepulse-server/vite.ts", "Vite Dev Middleware", "Integrates Vite dev server in development mode"],
  ["artifacts/api-server/src/carepulse-server/vercel-entry.ts", "Vercel Adapter", "Exports Express app for serverless deployment"],
  ["artifacts/api-server/src/shared/schema.ts", "DB Schema (Drizzle)", "All table definitions + Zod schemas + TypeScript types"],
  ["artifacts/api-server/src/shared/models/auth.ts", "Auth Schema", "users, sessions, password_reset_otps table definitions"],
  ["artifacts/api-server/src/shared/models/chat.ts", "Chat Schema", "chat_sessions, chat_messages table definitions"],
  // Frontend
  ["artifacts/carepulse/src/App.tsx", "Root App Component", "Router setup, auth context, protected route wrappers"],
  ["artifacts/carepulse/src/main.tsx", "Frontend Entry Point", "ReactDOM.createRoot, QueryClientProvider, Toaster"],
  ["artifacts/carepulse/src/pages/Landing.tsx", "Public Landing Page", "Branding, features, CTA buttons"],
  ["artifacts/carepulse/src/pages/Login.tsx", "Login & Register", "Auth forms, OTP password reset flow"],
  ["artifacts/carepulse/src/pages/Dashboard.tsx", "Main Dashboard", "Stats, charts, disease trends, activity feed"],
  ["artifacts/carepulse/src/pages/MLInsights.tsx", "ML Insights", "NB NLP, Neural Net, Decision Tree, Model Metrics tabs"],
  ["artifacts/carepulse/src/pages/PredictiveAnalytics.tsx", "Predictive Analytics", "Sigmoid risk model UI + recommendations"],
  ["artifacts/carepulse/src/pages/MedAssistAI.tsx", "AI Medical Chat", "Gemini chat UI, file upload, conversation history"],
  ["artifacts/carepulse/src/pages/SymptomChecker.tsx", "Symptom Checker", "Symptom selection → NLP prediction"],
  ["artifacts/carepulse/src/pages/Hospitals.tsx", "Hospital Directory", "70K hospitals, search, filter, map view"],
  ["artifacts/carepulse/src/pages/Patients.tsx", "Patient Management", "Patient list CRUD"],
  ["artifacts/carepulse/src/pages/PatientDetail.tsx", "Patient Detail", "Vitals, history, prescriptions per patient"],
  ["artifacts/carepulse/src/pages/PatientPortal.tsx", "Patient Self-Service", "Patient's own data view"],
  ["artifacts/carepulse/src/pages/Appointments.tsx", "Appointment Booking", "Calendar booking, email confirmation"],
  ["artifacts/carepulse/src/pages/AdminAppointments.tsx", "Admin Appointments", "All-appointment management view"],
  ["artifacts/carepulse/src/pages/Prescriptions.tsx", "Prescriptions", "Digital prescription writer"],
  ["artifacts/carepulse/src/pages/DrugInteractions.tsx", "Drug Interactions", "Multi-drug interaction checker"],
  ["artifacts/carepulse/src/pages/HealthCalculators.tsx", "Health Calculators", "BMI, ASCVD, eGFR, BMR calculators"],
  ["artifacts/carepulse/src/pages/EmergencyAlerts.tsx", "Emergency Alerts", "Health alerts for Indian regions"],
  ["artifacts/carepulse/src/pages/Telemedicine.tsx", "Telemedicine", "Video consultation scheduling"],
  ["artifacts/carepulse/src/pages/MedicalID.tsx", "Medical ID Editor", "Personal medical ID card creator"],
  ["artifacts/carepulse/src/pages/MedicalIDView.tsx", "Medical ID Viewer", "Public medical ID display"],
  ["artifacts/carepulse/src/pages/AdminUsers.tsx", "User Admin", "User role management, audit logs"],
  ["artifacts/carepulse/src/pages/AdminAnalytics.tsx", "Admin Analytics", "System-wide analytics dashboard"],
  ["artifacts/carepulse/src/pages/Compliance.tsx", "Compliance", "HIPAA, DPDP, HL7/FHIR status"],
  ["artifacts/carepulse/src/pages/ConsentManager.tsx", "Consent Management", "Patient data sharing consents"],
  ["artifacts/carepulse/src/pages/Settings.tsx", "Account Settings", "Profile, password, notifications"],
  ["artifacts/carepulse/src/components/Sidebar.tsx", "Navigation Sidebar", "Role-aware menu with all page links"],
  ["artifacts/carepulse/src/components/XAIPanel.tsx", "Explainable AI Panel", "Human-readable ML prediction explanations"],
  ["artifacts/carepulse/src/components/CommandPalette.tsx", "Command Palette (Ctrl+K)", "Global search and navigation"],
  ["artifacts/carepulse/src/components/NotificationCenter.tsx", "Notification Center", "Alerts, reminders, system messages"],
  ["artifacts/carepulse/src/components/StatCard.tsx", "Stat Card", "Reusable metric card with trend indicator"],
  // Config files
  ["pnpm-workspace.yaml", "pnpm Workspace Config", "Package discovery, catalog pins, workspace packages"],
  ["artifacts/api-server/package.json", "API Server Package", "Backend dependencies, scripts (dev, build, db:push)"],
  ["artifacts/carepulse/package.json", "Frontend Package", "Frontend dependencies, Vite build scripts"],
  ["artifacts/api-server/drizzle.config.ts", "Drizzle Config", "Database URL, schema path, migration output path"],
  ["artifacts/carepulse/vite.config.ts", "Vite Config", "Port (from env), base path, allowed hosts, plugins"],
];

const widths = [185, 95, 215];
tableRow(["File Path", "Category", "Purpose & Notes"], widths, true);
for (const row of allFiles) {
  if (doc.y > 750) { newPage(); tableRow(["File Path", "Category", "Purpose & Notes"], widths, true); }
  tableRow(row, widths);
}

// ══════════════════════════════════════════════════════════════════════════════
// FINAL PAGE
// ══════════════════════════════════════════════════════════════════════════════
newPage();
doc.rect(0, 0, 595, 842).fillColor(C.navy).fill();
doc.fillColor(C.white).fontSize(28).font("Helvetica-Bold").text("CarePulse", 50, 320, { align: "center" });
doc.fillColor("#60a5fa").fontSize(16).font("Helvetica").text("Health Pulse Care — India", 50, 360, { align: "center" });
doc.fillColor("#93c5fd").fontSize(12).text("Complete Technical Documentation — End of Document", 50, 395, { align: "center" });
doc.fillColor(C.white).fontSize(10).text(
  "Built with TypeScript · React · PostgreSQL · Express · Drizzle ORM · Gemini 2.5 Flash",
  50, 440, { align: "center" }
);
doc.fillColor("#60a5fa").fontSize(10).text("4 ML Models · 70,000 Hospitals · South Asian Clinical Standards · ICMR Guidelines", 50, 460, { align: "center" });

// Page numbers
const range = doc.bufferedPageRange();
for (let i = 0; i < range.count; i++) {
  doc.switchToPage(range.start + i);
  if (i === 0 || i === range.count - 1) continue; // skip cover and final
  doc.fillColor(C.lgrey).fontSize(8).font("Helvetica")
     .text(`CarePulse Technical Documentation  |  Page ${i + 1} of ${range.count}`, 50, 820, { align: "center", width: 495 });
}

// ══════════════════════════════════════════════════════════════════════════════
// WAIT FOR PDF THEN BUILD ZIP
// ══════════════════════════════════════════════════════════════════════════════
const pdfStream = fs.createWriteStream(OUT_PDF);
doc.pipe(pdfStream);
doc.end();

await new Promise<void>((resolve, reject) => {
  pdfStream.on("finish", resolve);
  pdfStream.on("error", reject);
});
console.log(`\n✓ PDF generated: ${OUT_PDF}`);

// Now build the ZIP (PDF is fully written)
const zipOutput = fs.createWriteStream(OUT_ZIP);
const archive = archiver("zip", { zlib: { level: 9 } });

const zipDone = new Promise<void>((resolve, reject) => {
  zipOutput.on("close", resolve);
  archive.on("error", reject);
});

archive.pipe(zipOutput);

const filesToZip = [
  "artifacts/api-server/src/carepulse-server/ml-engine.ts",
  "artifacts/api-server/src/carepulse-server/neural-network.ts",
  "artifacts/api-server/src/carepulse-server/decision-tree.ts",
  "artifacts/api-server/src/carepulse-server/ml-predictions.ts",
  "artifacts/api-server/src/carepulse-server/gemini-ai.ts",
  "artifacts/api-server/src/carepulse-server/clinical-validation.ts",
  "artifacts/api-server/src/carepulse-server/routes.ts",
  "artifacts/api-server/src/carepulse-server/db.ts",
  "artifacts/api-server/src/carepulse-server/email.ts",
  "artifacts/api-server/src/carepulse-server/storage.ts",
  "artifacts/api-server/src/carepulse-server/medical-ai.ts",
  "artifacts/api-server/src/carepulse-server/hospital-generator.ts",
  "artifacts/api-server/src/carepulse-server/india-hospitals-data.ts",
  "artifacts/api-server/src/shared/schema.ts",
  "artifacts/api-server/src/shared/models/auth.ts",
  "artifacts/carepulse/src/pages/MLInsights.tsx",
  "artifacts/carepulse/src/pages/PredictiveAnalytics.tsx",
  "artifacts/carepulse/src/pages/MedAssistAI.tsx",
  "artifacts/carepulse/src/pages/Dashboard.tsx",
  "artifacts/carepulse/src/pages/Hospitals.tsx",
  "artifacts/carepulse/src/pages/Appointments.tsx",
  "artifacts/carepulse/src/pages/Patients.tsx",
  "artifacts/carepulse/src/pages/Login.tsx",
  "artifacts/carepulse/src/App.tsx",
];

for (const f of filesToZip) {
  const abs = path.resolve(f);
  if (fs.existsSync(abs)) {
    archive.file(abs, { name: f });
  }
}

archive.file(OUT_PDF, { name: "carepulse-documentation.pdf" });
archive.finalize();

await zipDone;
console.log(`✓ ZIP generated: ${OUT_ZIP} (${(archive.pointer() / 1024 / 1024).toFixed(2)} MB)`);
