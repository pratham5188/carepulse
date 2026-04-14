# CarePulse - Healthcare Analytics Platform

## Overview
Full-stack healthcare analytics and management platform for medical professionals and patients in India. Features MedAssist AI chat (OpenAI), 70,000 Indian hospitals with browse/search/filter, appointment booking, real-time dashboard analytics with AI insights, and hospital management.

## Tech Stack
- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS (shadcn/ui), TanStack Query, Wouter, Recharts, Framer Motion
- **Backend**: Express.js (Node.js), TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **AI**: OpenAI (gpt-4o-mini) via Replit AI Integrations for medical chat and dashboard insights; local fallback AI engine

## Project Structure
- `/client` - React frontend (pages, components, hooks)
- `/server` - Express backend (routes, storage, AI engine, hospital data)
- `/shared` - Shared schema (Drizzle models, Zod validation)
- `/attached_assets` - Static assets

## Key Files
- `server/hospital-generator.ts` - Generates 70,000 Indian hospitals programmatically (seeded RNG, batch inserts of 500)
- `server/india-hospitals-data.ts` - Base hospital data: states, districts, hospital chains, types
- `server/gemini-ai.ts` - Google Gemini integration: `chatWithAI()` (comprehensive medical knowledge system prompt covering 10 domains: clinical medicine, pharmacology, lab medicine, surgery, emergency medicine, preventive medicine, nutrition, traditional medicine, Indian healthcare, medical procedures) and `generateDashboardInsights()` using gemini-2.5-flash
- `server/routes.ts` - API routes with auto-seeding logic, server-side hospital search/browse
- `server/medical-ai.ts` - Local AI fallback engine
- `shared/schema.ts` - Database schema
- `server/replit_integrations/auth/` - Authentication system
- `client/src/pages/Dashboard.tsx` - Dashboard with AI insights (PieChart, BarChart, recommendations)
- `client/src/pages/Appointments.tsx` - Appointment booking with debounced server-side hospital search
- `client/src/pages/MedAssistAI.tsx` - AI-powered medical Q&A chat (renamed from KnowledgeBase)
- `client/src/pages/Hospitals.tsx` - Hospital browse page with search, filters, pagination (all roles)

## API Endpoints
- `GET /api/hospitals-list?search=&limit=50` - Lightweight hospital search for appointment booking
- `GET /api/hospitals-browse?search=&state=&city=&department=&page=&limit=` - Full hospital browse with pagination
- `GET /api/hospitals-states` - List all distinct states
- `GET /api/hospitals-cities?state=` - List cities for a given state
- `POST /api/ai/insights` - AI dashboard insights with summary, insights[], chartData[], recommendations[]
- `POST /api/knowledge/search` - AI medical knowledge search (OpenAI with local fallback)
- `POST /api/analyze-image` - AI single file analysis (multipart form: image file + optional query); any file type; max 20MB; rejects non-medical content
- `POST /api/analyze-files` - AI multi-file analysis (multipart form: up to 10 files via "files" field + optional query); any file type; max 20MB each; cross-references multiple files together
- `POST /api/forgot-password` - Sends OTP for password reset (stores in password_reset_otps table, 10min expiry)
- `POST /api/reset-password` - Verifies OTP and resets password (requires email, otp, newPassword)
- `POST /api/change-password` - Authenticated password change (requires currentPassword, newPassword)
- `POST /api/ml/health-risk` - ML health risk prediction (logistic regression, 5 diseases)
- `POST /api/ml/appointment-recommend` - ML smart appointment recommendations (symptom-to-specialty mapping)
- `POST /api/ml/report-summarize` - Medical report summarizer (Gemini AI, multipart files)
- `GET /api/ml/outbreak-predict` - Disease outbreak prediction (linear regression on trends)
- `POST /api/ml/decision-tree` - C4.5 Decision Tree prediction (depth 4, 23 nodes, 5 diseases, split path tracing)
- `POST /api/ml/neural-network` - MLP Neural Network prediction (9→14→5, sigmoid, hidden layer activations)
- `GET /api/ml/bias-report` - Algorithmic fairness / bias metrics by gender/age groups (admin/doctor)
- `GET /api/blockchain/audit-chain` - SHA-256 blockchain-style tamper-evident audit log chain (admin/doctor)
- `GET /api/predictive-analytics` - Comprehensive predictive analytics (patient risk, clinical decisions, resource optimization)

## Database
- PostgreSQL with Drizzle ORM
- Schema push: `npm run db:push`
- Auto-seeds 70,000 hospitals on first run (skips if already seeded)

## Environment Variables
- `AI_INTEGRATIONS_GEMINI_API_KEY` - Gemini API key (via Replit AI Integrations)
- `AI_INTEGRATIONS_GEMINI_BASE_URL` - Gemini base URL (via Replit AI Integrations)
- `DATABASE_URL` - PostgreSQL connection string
- `GMAIL_USER` - Gmail address for sending OTP emails
- `GMAIL_APP_PASSWORD` - Gmail App Password for SMTP authentication
- `FAST2SMS_API_KEY` - Fast2SMS API key for sending OTP via SMS (India)

## Running
- Development: `npm run dev` (port 5000)
- Build: `npm run build`
- Production: `npm start`

## Vercel Deployment
- `vercel.json` — routes `/api/*` to serverless Express function (`api/index.ts`), static frontend from Vite build
- `api/index.ts` — serverless function wrapping Express app with lazy initialization
- Session cookies: auto-configured for production (secure, sameSite:none, proxy:true)
- Vite config: Replit-specific plugins only load when REPL_ID is set
- Hospital seeding runs in background on Vercel (non-blocking)
- Required Vercel environment variables: `DATABASE_URL`, `SESSION_SECRET`, `AI_INTEGRATIONS_GEMINI_API_KEY`, `AI_INTEGRATIONS_GEMINI_BASE_URL`

## Hospital Data Coverage
70,000 hospitals covering all 36 Indian states and union territories:
- District hospitals, government medical colleges
- Private chains (Apollo, Fortis, Max, Manipal, Narayana, Medanta)
- Primary Health Centers (PHCs), Community Health Centers (CHCs)
- Nursing homes, specialty clinics

## Layout Architecture
- **Sidebar**: Split into two separate DOM elements — desktop sidebar (`hidden lg:flex`, always in DOM) and mobile sidebar (conditionally rendered only when open)
- **AuthenticatedLayout**: Wrapper component in App.tsx that holds sidebar state (mobileOpen, desktopCollapsed) and renders Sidebar + main content. Shared across all authenticated routes.
- **Mobile**: Hamburger menu in sticky header bar opens mobile sidebar overlay; auto-closes on route change via `useEffect` on location
- **Desktop**: Sidebar always visible, collapsible via toggle button; main content uses `lg:ml-64` / `lg:ml-20` margin

## UI Features
- **MedAssist AI** (`/medassist`): AI medical chat with multi-file upload (all file types — images, PDFs, documents, spreadsheets, up to 10 files at once, 20MB each), camera capture, voice input; analyzes medicine photos, prescriptions, lab reports, medical documents; cross-references multiple files together; rejects non-medical content; suggests hospital departments
- **Hospitals** (`/hospitals`): Browse 70k hospitals with search bar, state/city/department filters, pagination (all roles)
- **Hospital Search**: Debounced server-side search in appointment booking (type-ahead, 300ms debounce, max 50 results)
- **Dark Mode**: Persists globally across all pages via App.tsx theme initialization from localStorage
- **Dashboard AI Insights**: "Generate Insights" button produces executive summary, typed insight cards, PieChart/BarChart visualizations, and actionable recommendations
- **Display FPS Auto-Sync**: Detects display refresh rate (60/75/90/120/144/240Hz), applies GPU-accelerated rendering, adapts animation durations and bezier curves for high-refresh displays; optional live FPS overlay toggle in Settings
- **Forgot Password**: OTP-based password reset with choice of Email (Gmail SMTP, professionally formatted HTML template) or SMS (Fast2SMS, India mobile numbers); Change Password in Settings with current password verification
- **Registration**: Includes optional mobile number field (+91 prefix, 10 digits) for SMS-based password recovery
- **Health Calculators** (`/health-tools`): BMI, Heart Rate Zone, Blood Pressure Classifier, Water Intake calculators (patient-only)
- **Medical ID** (`/medical-id`): Digital emergency medical ID card with QR code, editable form, stored in localStorage (patient-only)
- **Drug Interaction Checker** (`/drug-checker`): AI-powered drug interaction analysis via OpenAI, color-coded severity results (all roles)
- **CareIntelligence** (`/ml-insights`): AI-Powered Health Analytics — four ML-powered features (all roles):
  1. **Health Risk Prediction** — Logistic regression model predicts risk % for diabetes, heart disease, stroke, hypertension, kidney disease based on age, gender, BMI, BP, heart rate, blood sugar, smoking, family history
  2. **Smart Appointment Recommendations** — Keyword-based symptom analysis recommends medical specialties with confidence scores, urgency level, optimal appointment times
  3. **Medical Report Summarizer** — Gemini AI extracts structured summary from uploaded medical reports (key findings, abnormal values, diagnoses, recommendations)
  4. **Disease Outbreak Prediction** — Linear regression on disease_trends data projects future case counts, trend direction, growth rate
- **Predictive Analytics** (`/predictive-analytics`): Comprehensive ML-powered healthcare analytics dashboard (all roles):
  1. **Population Analysis** — Age/gender/condition/risk distribution charts (bar + pie charts) with summary statistics
  2. **Patient Risk Assessment** — Per-patient ML-driven risk scoring using Naive Bayes disease prediction, heuristic risk engine (mortality/readmission/complication risk %), vitals analysis, clinical recommendations
  3. **Clinical Decision Support** — Identifies high-risk patients needing immediate intervention, prioritized action lists, urgency classification
  4. **Resource Optimization** — Hospital bed/ICU capacity analysis, occupancy rate forecasting, projected bed needs, operational recommendations
  5. **Data Preprocessing Pipeline** — Shows feature extraction, normalization techniques (TF-IDF, min-max scaling, one-hot encoding), data quality scoring, ML algorithm catalog
- **Data Consent Manager** (`/consent`): Patient privacy control centre — per-feature AI consent toggles, stored in localStorage (`carepulse-consent`); 6 features (Symptom Checker, MedAssist AI, Drug Checker, Health Risk, Report Analysis, Anonymous Research); expandable detail cards showing data used/retention/purpose; "Enable All" / "Disable All" / "Export Record" actions; DPDP Act 2023 (India) reference; accessible via sidebar "Data Consent" link for all roles
- **Explainable AI (XAI) Panels**: Transparent AI reasoning across two features:
  1. **Symptom Checker XAI** — After each analysis, a collapsible "Why This Assessment?" panel shows: confidence ring (0–95%), factor contribution bars for Symptom Description / Reported Severity / Symptom Duration / Body Area Specificity (each with impact level badge), top matched conditions with relevance scores, decision summary, and "How this model works" expandable info section. Server returns structured `xai` object alongside analysis text.
  2. **Health Risk XAI** — Each disease prediction card in CareIntelligence has a "View AI Explanation" toggle that reveals factor contribution bars with "Risk"/"Normal" badges for every contributing factor (BMI, BP, family history, etc.), plus logistic regression model citation.
- **Command Palette** (Ctrl+K / Cmd+K): Spotlight-style quick navigation to any page with fuzzy search, arrow key navigation
- **Notification Center**: Bell icon with dropdown showing health tips, system notifications, unread count badge; integrated in top bar
