import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  Stethoscope,
  BotMessageSquare,
  Pill,
  HeartPulse,
  FileText,
  TrendingUp,
  Download,
  RotateCcw,
  Info,
  Lock,
  Eye,
  Clock,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";

const CONSENT_KEY = "carepulse-consent";

interface ConsentState {
  symptomChecker: boolean;
  medassistAI: boolean;
  drugChecker: boolean;
  healthRiskPrediction: boolean;
  medicalFileAnalysis: boolean;
  anonymousResearch: boolean;
  updatedAt: string;
}

const defaultConsent: ConsentState = {
  symptomChecker: true,
  medassistAI: true,
  drugChecker: true,
  healthRiskPrediction: true,
  medicalFileAnalysis: true,
  anonymousResearch: false,
  updatedAt: new Date().toISOString(),
};

function loadConsent(): ConsentState {
  try {
    const raw = localStorage.getItem(CONSENT_KEY);
    if (raw) return { ...defaultConsent, ...JSON.parse(raw) };
  } catch {}
  return { ...defaultConsent };
}

function saveConsent(state: ConsentState) {
  localStorage.setItem(CONSENT_KEY, JSON.stringify({ ...state, updatedAt: new Date().toISOString() }));
}

export function useConsent() {
  const [consent, setConsent] = useState<ConsentState>(loadConsent);

  const update = (key: keyof Omit<ConsentState, "updatedAt">, value: boolean) => {
    setConsent((prev) => {
      const next = { ...prev, [key]: value, updatedAt: new Date().toISOString() };
      saveConsent(next);
      return next;
    });
  };

  return { consent, update };
}

interface FeatureCard {
  key: keyof Omit<ConsentState, "updatedAt">;
  title: string;
  icon: React.ElementType;
  iconColor: string;
  description: string;
  dataUsed: string[];
  retention: string;
  purpose: string;
  isOptional?: boolean;
}

const features: FeatureCard[] = [
  {
    key: "symptomChecker",
    title: "AI Symptom Checker",
    icon: Stethoscope,
    iconColor: "text-blue-500",
    description: "Analyses your described symptoms using a keyword-scoring NLP model to suggest possible conditions and urgency levels.",
    dataUsed: ["Symptom description text", "Selected body area", "Self-reported severity", "Symptom duration"],
    retention: "Not stored — processed in real-time only",
    purpose: "Provide preliminary guidance on possible conditions and whether to seek medical care.",
  },
  {
    key: "medassistAI",
    title: "MedAssist AI (Gemini)",
    icon: BotMessageSquare,
    iconColor: "text-violet-500",
    description: "A conversational medical AI powered by Google Gemini that answers medical questions, explains lab results, and summarises conditions.",
    dataUsed: ["Your chat messages", "Uploaded medical reports (optional)", "Medical image uploads (optional)"],
    retention: "Chat history stored in your browser session only",
    purpose: "Provide personalised medical information and explanations.",
  },
  {
    key: "drugChecker",
    title: "Drug Interaction Checker",
    icon: Pill,
    iconColor: "text-red-500",
    description: "Checks combinations of medications for potential interactions, side effects, and severity levels.",
    dataUsed: ["Names of medications you enter", "Dosage information (if provided)"],
    retention: "Not stored — real-time analysis only",
    purpose: "Identify dangerous drug combinations and alert patients and doctors.",
  },
  {
    key: "healthRiskPrediction",
    title: "Health Risk Prediction",
    icon: HeartPulse,
    iconColor: "text-rose-500",
    description: "Uses logistic regression models to estimate your risk of chronic conditions like diabetes, heart disease, and hypertension.",
    dataUsed: ["Age and gender", "BMI", "Blood pressure readings", "Heart rate", "Blood sugar level", "Smoking status", "Family history of disease"],
    retention: "Not stored — computed on demand only",
    purpose: "Proactively identify risk factors and recommend preventive actions.",
  },
  {
    key: "medicalFileAnalysis",
    title: "Medical Report Analysis",
    icon: FileText,
    iconColor: "text-emerald-500",
    description: "Extracts and summarises key findings from uploaded PDF reports, prescriptions, and medical images using AI.",
    dataUsed: ["Uploaded PDF documents", "Uploaded images (X-rays, skin photos, prescriptions)"],
    retention: "Files processed then discarded — not persisted on server",
    purpose: "Help patients and doctors quickly understand complex medical documents.",
  },
  {
    key: "anonymousResearch",
    title: "Anonymous Research Data Sharing",
    icon: TrendingUp,
    iconColor: "text-orange-500",
    description: "Contribute anonymised, aggregated data (no personal identifiers) to improve CarePulse's AI models and India-specific disease analytics.",
    dataUsed: ["Anonymised symptom patterns (no name/contact)", "Aggregated risk score distributions", "Anonymised disease trend data"],
    retention: "Stored in anonymised aggregate form indefinitely",
    purpose: "Improve AI accuracy and contribute to public health analytics.",
    isOptional: true,
  },
];

export default function ConsentManager() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [consent, setConsentState] = useState<ConsentState>(loadConsent);
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const enabledCount = Object.entries(consent)
    .filter(([k, v]) => k !== "updatedAt" && v === true)
    .length;
  const totalCount = features.length;

  const update = (key: keyof Omit<ConsentState, "updatedAt">, value: boolean) => {
    const next = { ...consent, [key]: value, updatedAt: new Date().toISOString() };
    setConsentState(next);
    saveConsent(next);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    toast({
      title: value ? "Consent granted" : "Consent withdrawn",
      description: `${features.find((f) => f.key === key)?.title} is now ${value ? "enabled" : "disabled"}.`,
      duration: 2000,
    });
  };

  const resetAll = (enabled: boolean) => {
    const next: ConsentState = {
      symptomChecker: enabled,
      medassistAI: enabled,
      drugChecker: enabled,
      healthRiskPrediction: enabled,
      medicalFileAnalysis: enabled,
      anonymousResearch: false,
      updatedAt: new Date().toISOString(),
    };
    setConsentState(next);
    saveConsent(next);
    toast({ title: enabled ? "All features enabled" : "All features disabled", duration: 2000 });
  };

  const exportRecord = () => {
    const lines = [
      "CAREPULSE DATA CONSENT RECORD",
      "==============================",
      `Generated: ${new Date().toLocaleString("en-IN")}`,
      `User: ${user?.email || "Unknown"}`,
      `Last Updated: ${new Date(consent.updatedAt).toLocaleString("en-IN")}`,
      "",
      "CONSENT STATUS:",
      ...features.map((f) => `  ${consent[f.key] ? "[GRANTED]" : "[WITHDRAWN]"} ${f.title}`),
      "",
      "This record was generated by CarePulse Healthcare Platform.",
      "Data processed in accordance with India's Digital Personal Data Protection Act (DPDP) 2023.",
    ];
    const blob = new Blob([lines.join("\n")], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `carepulse_consent_${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: "Consent record downloaded", duration: 2000 });
  };

  return (
    <div className="min-h-screen p-6 md:p-8 max-w-4xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
        <div className="flex items-center gap-3 mb-1">
          <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-primary to-violet-500 flex items-center justify-center shadow-lg shadow-primary/20">
            <ShieldCheck className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-display font-bold">Data Consent Manager</h1>
            <p className="text-sm text-muted-foreground">Control how CarePulse AI uses your health data</p>
          </div>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
        <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-violet-500/5">
          <CardContent className="pt-5 pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                  <span className="font-semibold">{enabledCount} of {totalCount} features enabled</span>
                  {saved && <Badge variant="outline" className="text-xs text-green-600 border-green-500">Saved</Badge>}
                </div>
                <p className="text-xs text-muted-foreground">
                  Last updated: {new Date(consent.updatedAt).toLocaleString("en-IN")}
                </p>
                <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                  <Lock className="h-3 w-3" />
                  Protected under India's DPDP Act 2023 — you can withdraw consent at any time.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button size="sm" variant="outline" onClick={() => resetAll(true)} className="gap-1.5 text-xs">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Enable All
                </Button>
                <Button size="sm" variant="outline" onClick={() => resetAll(false)} className="gap-1.5 text-xs">
                  <RotateCcw className="h-3.5 w-3.5" /> Disable All
                </Button>
                <Button size="sm" variant="outline" onClick={exportRecord} className="gap-1.5 text-xs">
                  <Download className="h-3.5 w-3.5" /> Export Record
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <div className="space-y-4">
        {features.map((feature, i) => {
          const Icon = feature.icon;
          const isEnabled = consent[feature.key] as boolean;
          const isOpen = expandedCard === feature.key;

          return (
            <motion.div
              key={feature.key}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 + i * 0.05 }}
            >
              <Card className={`transition-all duration-200 ${isEnabled ? "border-primary/20" : "border-border opacity-75"}`}>
                <CardContent className="pt-5 pb-4">
                  <div className="flex items-start gap-4">
                    <div className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 ${isEnabled ? "bg-primary/10" : "bg-muted"}`}>
                      <Icon className={`h-5 w-5 ${isEnabled ? feature.iconColor : "text-muted-foreground"}`} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-semibold text-sm">{feature.title}</h3>
                            {feature.isOptional && (
                              <Badge variant="outline" className="text-[10px] py-0 border-orange-300 text-orange-600">Optional</Badge>
                            )}
                            <Badge
                              variant="outline"
                              className={`text-[10px] py-0 ${isEnabled ? "border-green-400 text-green-600 dark:text-green-400" : "border-muted-foreground/50 text-muted-foreground"}`}
                            >
                              {isEnabled ? "Enabled" : "Disabled"}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{feature.description}</p>
                        </div>
                        <Switch
                          checked={isEnabled}
                          onCheckedChange={(v) => update(feature.key, v)}
                          className="shrink-0 mt-0.5"
                        />
                      </div>

                      <button
                        onClick={() => setExpandedCard(isOpen ? null : feature.key)}
                        className="mt-2 text-xs text-primary hover:text-primary/80 flex items-center gap-1 transition-colors"
                      >
                        <Info className="h-3 w-3" />
                        {isOpen ? "Hide details" : "What data does this use?"}
                      </button>

                      {isOpen && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.2 }}
                          className="mt-3 space-y-3 overflow-hidden"
                        >
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div className="p-3 rounded-lg bg-muted/50 space-y-1.5">
                              <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                                <Eye className="h-3 w-3" /> Data Used
                              </p>
                              <ul className="space-y-1">
                                {feature.dataUsed.map((d, di) => (
                                  <li key={di} className="text-xs text-foreground/80 flex items-start gap-1.5">
                                    <span className="text-primary mt-0.5">•</span>{d}
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div className="p-3 rounded-lg bg-muted/50 space-y-1.5">
                              <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                                <Clock className="h-3 w-3" /> Retention
                              </p>
                              <p className="text-xs text-foreground/80">{feature.retention}</p>
                            </div>
                            <div className="p-3 rounded-lg bg-muted/50 space-y-1.5">
                              <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                                <ShieldCheck className="h-3 w-3" /> Purpose
                              </p>
                              <p className="text-xs text-foreground/80">{feature.purpose}</p>
                            </div>
                          </div>

                          {!isEnabled && (
                            <div className="flex items-start gap-2 p-2.5 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700/40">
                              <AlertCircle className="h-3.5 w-3.5 text-amber-600 shrink-0 mt-0.5" />
                              <p className="text-xs text-amber-700 dark:text-amber-400">
                                This feature is disabled. You can still visit the page but AI analysis will be blocked until you re-enable consent.
                              </p>
                            </div>
                          )}
                        </motion.div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
        <Card className="border-border bg-muted/30">
          <CardContent className="pt-5 pb-4">
            <div className="flex items-start gap-3">
              <Lock className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-foreground mb-1">Your Privacy Rights</p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Under India's <strong>Digital Personal Data Protection (DPDP) Act 2023</strong>, you have the right to access, correct, and erase your personal data. CarePulse processes health data solely for the purposes described above. No data is sold to third parties. All AI processing happens within the platform. You can withdraw consent at any time using the toggles above — withdrawal takes effect immediately.
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  For data deletion requests or privacy concerns, contact: <span className="font-medium text-foreground">carepulse07@gmail.com</span>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
