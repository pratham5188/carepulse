import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Activity,
  Brain,
  Heart,
  Loader2,
  ShieldAlert,
  Stethoscope,
  CheckCircle2,
  Phone,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { XAIPanel } from "@/components/XAIPanel";

const BODY_AREAS = [
  { id: "head", label: "Head & Neck", icon: Brain },
  { id: "chest", label: "Chest & Heart", icon: Heart },
  { id: "abdomen", label: "Abdomen & Digestive", icon: Activity },
  { id: "limbs", label: "Arms & Legs", icon: Activity },
  { id: "back", label: "Back & Spine", icon: Activity },
  { id: "skin", label: "Skin & Allergies", icon: Activity },
  { id: "respiratory", label: "Respiratory", icon: Activity },
  { id: "general", label: "General / Full Body", icon: Stethoscope },
];

const DURATION_OPTIONS = [
  "Less than 24 hours",
  "1-3 days",
  "4-7 days",
  "1-2 weeks",
  "More than 2 weeks",
  "Recurring / Chronic",
];

type Step = "body" | "symptoms" | "severity" | "duration" | "results";

interface AnalysisResult {
  analysis: string;
  disclaimer: string;
  xai?: {
    confidence: number;
    factors: { label: string; score: number; maxScore: number; impact: "high" | "moderate" | "low"; description: string }[];
    topConditions: { name: string; score: number; category: string }[];
    decisionSummary: string;
    modelInfo: string;
  };
}

export default function SymptomChecker() {
  const [step, setStep] = useState<Step>("body");
  const [bodyArea, setBodyArea] = useState("");
  const [symptoms, setSymptoms] = useState("");
  const [severity, setSeverity] = useState(5);
  const [duration, setDuration] = useState("");
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const analysisMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/symptom-check", {
        bodyArea,
        symptoms,
        severity,
        duration,
      });
      return res.json() as Promise<AnalysisResult>;
    },
    onSuccess: (data) => {
      setResult(data);
      setStep("results");
    },
  });

  const steps: Step[] = ["body", "symptoms", "severity", "duration", "results"];
  const currentIndex = steps.indexOf(step);

  const canProceed = () => {
    switch (step) {
      case "body": return !!bodyArea;
      case "symptoms": return symptoms.trim().length > 5;
      case "severity": return true;
      case "duration": return !!duration;
      default: return false;
    }
  };

  const goNext = () => {
    if (step === "duration") {
      analysisMutation.mutate();
      return;
    }
    const next = steps[currentIndex + 1];
    if (next) setStep(next);
  };

  const goBack = () => {
    const prev = steps[currentIndex - 1];
    if (prev) setStep(prev);
  };

  const resetWizard = () => {
    setStep("body");
    setBodyArea("");
    setSymptoms("");
    setSeverity(5);
    setDuration("");
    setResult(null);
  };

  const getUrgencyColor = (text: string) => {
    const lower = text.toLowerCase();
    if (lower.includes("emergency")) return "text-red-600 bg-red-50 border-red-200";
    if (lower.includes("high")) return "text-orange-600 bg-orange-50 border-orange-200";
    if (lower.includes("moderate")) return "text-yellow-600 bg-yellow-50 border-yellow-200";
    return "text-green-600 bg-green-50 border-green-200";
  };

  const stepVariants = {
    enter: { opacity: 0, x: 30 },
    center: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -30 },
  };

  return (
    <div className="min-h-screen p-6 md:p-8 max-w-4xl mx-auto">
      <div className="text-center mb-8 space-y-3">
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-primary to-accent shadow-xl shadow-primary/20 mb-2">
          <Stethoscope className="h-8 w-8 text-white" />
        </div>
        <h1 className="text-3xl md:text-4xl font-display font-bold">AI Symptom Checker</h1>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Describe your symptoms step-by-step and receive AI-powered guidance on possible conditions and recommended actions.
        </p>
      </div>

      <div className="mb-8 flex items-center justify-center gap-2">
        {["Body Area", "Symptoms", "Severity", "Duration", "Results"].map((label, i) => (
          <div key={label} className="flex items-center gap-2">
            <div
              className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold transition-all ${
                i < currentIndex
                  ? "bg-primary text-white"
                  : i === currentIndex
                  ? "bg-primary text-white ring-4 ring-primary/20"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {i < currentIndex ? <CheckCircle2 className="h-4 w-4" /> : i + 1}
            </div>
            <span className="text-xs text-muted-foreground hidden md:inline">{label}</span>
            {i < 4 && <div className={`w-6 md:w-12 h-0.5 ${i < currentIndex ? "bg-primary" : "bg-muted"}`} />}
          </div>
        ))}
      </div>

      <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-6 flex items-start gap-3">
        <Phone className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-bold text-red-700 dark:text-red-400">Emergency?</p>
          <p className="text-sm text-red-600 dark:text-red-400/80">
            If you are experiencing severe chest pain, difficulty breathing, uncontrolled bleeding, or other life-threatening symptoms, call emergency services immediately.
          </p>
          <div className="flex gap-4 mt-2">
            <span className="text-sm font-bold text-red-700 dark:text-red-400">📞 112 <span className="font-normal">(All Emergency)</span></span>
            <span className="text-sm font-bold text-red-700 dark:text-red-400">🚑 108 <span className="font-normal">(Ambulance)</span></span>
          </div>
        </div>
      </div>

      <Card className="shadow-lg">
        <CardContent className="p-6 md:p-8 min-h-[400px] flex flex-col">
          <AnimatePresence mode="wait">
            {step === "body" && (
              <motion.div key="body" variants={stepVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.2 }} className="flex-1">
                <h2 className="text-xl font-bold mb-2">Where are you experiencing symptoms?</h2>
                <p className="text-muted-foreground mb-6">Select the body area most affected.</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {BODY_AREAS.map((area) => {
                    const Icon = area.icon;
                    return (
                      <button
                        key={area.id}
                        onClick={() => setBodyArea(area.id)}
                        className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all hover:shadow-md ${
                          bodyArea === area.id
                            ? "border-primary bg-primary/5 shadow-md"
                            : "border-border hover:border-primary/40"
                        }`}
                      >
                        <Icon className={`h-6 w-6 ${bodyArea === area.id ? "text-primary" : "text-muted-foreground"}`} />
                        <span className={`text-sm font-medium text-center ${bodyArea === area.id ? "text-primary" : ""}`}>{area.label}</span>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {step === "symptoms" && (
              <motion.div key="symptoms" variants={stepVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.2 }} className="flex-1">
                <h2 className="text-xl font-bold mb-2">Describe your symptoms</h2>
                <p className="text-muted-foreground mb-6">Please be as specific as possible. Include what you feel, when it started, and any triggers.</p>
                <textarea
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                  placeholder="Example: I have a persistent headache on the right side that worsens with bright light. I also feel nauseous and slightly dizzy..."
                  className="w-full min-h-[200px] p-4 rounded-xl border-2 border-border bg-background focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all resize-none text-base"
                />
                <p className="text-xs text-muted-foreground mt-2">{symptoms.length} characters</p>
              </motion.div>
            )}

            {step === "severity" && (
              <motion.div key="severity" variants={stepVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.2 }} className="flex-1">
                <h2 className="text-xl font-bold mb-2">How severe are your symptoms?</h2>
                <p className="text-muted-foreground mb-8">Rate from 1 (very mild) to 10 (extremely severe).</p>
                <div className="flex flex-col items-center gap-6">
                  <div className="text-5xl sm:text-7xl font-bold text-primary">{severity}</div>
                  <div className="text-sm text-muted-foreground">
                    {severity <= 3 ? "Mild" : severity <= 5 ? "Moderate" : severity <= 7 ? "Significant" : "Severe"}
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={severity}
                    onChange={(e) => setSeverity(parseInt(e.target.value))}
                    className="w-full max-w-md h-3 rounded-full appearance-none cursor-pointer accent-primary"
                    style={{
                      background: `linear-gradient(to right, hsl(var(--primary)) 0%, hsl(var(--primary)) ${(severity - 1) * 11.1}%, hsl(var(--muted)) ${(severity - 1) * 11.1}%, hsl(var(--muted)) 100%)`,
                    }}
                  />
                  <div className="flex justify-between w-full max-w-md text-xs text-muted-foreground">
                    <span>1 - Mild</span>
                    <span>5 - Moderate</span>
                    <span>10 - Severe</span>
                  </div>
                </div>
              </motion.div>
            )}

            {step === "duration" && (
              <motion.div key="duration" variants={stepVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.2 }} className="flex-1">
                <h2 className="text-xl font-bold mb-2">How long have you had these symptoms?</h2>
                <p className="text-muted-foreground mb-6">Select the duration that best matches.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {DURATION_OPTIONS.map((opt) => (
                    <button
                      key={opt}
                      onClick={() => setDuration(opt)}
                      className={`p-4 rounded-xl border-2 text-left transition-all hover:shadow-md ${
                        duration === opt
                          ? "border-primary bg-primary/5 shadow-md"
                          : "border-border hover:border-primary/40"
                      }`}
                    >
                      <span className={`font-medium ${duration === opt ? "text-primary" : ""}`}>{opt}</span>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {step === "results" && analysisMutation.isPending && (
              <motion.div key="loading" variants={stepVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.2 }} className="flex-1 flex flex-col items-center justify-center gap-4">
                <Loader2 className="h-12 w-12 text-primary animate-spin" />
                <p className="text-lg font-medium">Analyzing your symptoms...</p>
                <p className="text-muted-foreground text-sm">Our AI is reviewing your information</p>
              </motion.div>
            )}

            {step === "results" && analysisMutation.isError && (
              <motion.div key="error" variants={stepVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.2 }} className="flex-1 flex flex-col items-center justify-center gap-4">
                <ShieldAlert className="h-12 w-12 text-destructive" />
                <p className="text-lg font-medium text-destructive">Analysis failed</p>
                <p className="text-muted-foreground text-sm">Please try again or consult a healthcare professional.</p>
                <Button onClick={resetWizard} variant="outline">Start Over</Button>
              </motion.div>
            )}

            {step === "results" && result && (
              <motion.div key="results" variants={stepVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.2 }} className="flex-1">
                <div className="flex items-center gap-3 mb-6">
                  <Stethoscope className="h-6 w-6 text-primary" />
                  <h2 className="text-xl font-bold">Symptom Analysis</h2>
                </div>

                <div className="mb-4 p-3 rounded-lg bg-muted/50 text-sm text-muted-foreground">
                  <span className="font-semibold">Summary:</span>{" "}
                  {BODY_AREAS.find((a) => a.id === bodyArea)?.label} · Severity {severity}/10 · {duration}
                </div>

                <div className="prose prose-slate dark:prose-invert max-w-none text-foreground/90 leading-relaxed prose-headings:font-display prose-headings:text-primary prose-headings:mb-2 prose-headings:mt-6 prose-p:mb-4 prose-li:mb-1 prose-strong:text-primary">
                  {result.analysis.split("\n").map((line, i) => {
                    if (line.startsWith("### ")) return <h3 key={i} className="text-xl font-bold mt-6 mb-2 text-primary">{line.replace("### ", "")}</h3>;
                    if (line.startsWith("## ")) return <h2 key={i} className="text-2xl font-bold mt-8 mb-4 text-primary border-b pb-2">{line.replace("## ", "")}</h2>;
                    if (line.startsWith("**") && line.endsWith("**")) return <h3 key={i} className="text-lg font-bold mt-4 mb-2 text-primary">{line.replace(/\*\*/g, "")}</h3>;
                    if (line.startsWith("- ") || line.startsWith("* ")) return <li key={i} className="ml-4 list-disc">{line.substring(2)}</li>;
                    if (/^\d+\.\s/.test(line)) return <li key={i} className="ml-4 list-decimal">{line.replace(/^\d+\.\s/, "")}</li>;
                    if (line.trim() === "") return <br key={i} />;
                    return <p key={i} className="mb-2">{line}</p>;
                  })}
                </div>

                {result.xai && (
                  <div className="mt-6">
                    <XAIPanel xai={result.xai} title="Why This Assessment?" />
                  </div>
                )}

                <div className="mt-6 flex gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-700 dark:text-red-400">
                  <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="text-sm font-bold">MEDICAL DISCLAIMER</p>
                    <p className="text-sm">{result.disclaimer}</p>
                  </div>
                </div>

                <div className="mt-4 flex gap-3 p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-700 dark:text-amber-400">
                  <ShieldAlert className="h-5 w-5 shrink-0 mt-0.5" />
                  <p className="text-sm font-medium">
                    This tool provides educational information only and should never replace professional medical advice, diagnosis, or treatment.
                  </p>
                </div>

                <div className="mt-6 flex justify-center">
                  <Button onClick={resetWizard} variant="outline" className="gap-2">
                    <ArrowLeft className="h-4 w-4" />
                    Check Another Symptom
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {step !== "results" && (
            <div className="flex justify-between mt-8 pt-4 border-t">
              <Button
                variant="outline"
                onClick={goBack}
                disabled={currentIndex === 0}
                className="gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
              <Button
                onClick={goNext}
                disabled={!canProceed() || analysisMutation.isPending}
                className="gap-2"
              >
                {step === "duration" ? (
                  analysisMutation.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      Analyze Symptoms
                      <Activity className="h-4 w-4" />
                    </>
                  )
                ) : (
                  <>
                    Next
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
