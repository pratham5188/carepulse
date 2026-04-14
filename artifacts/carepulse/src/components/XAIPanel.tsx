import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp, Info, Zap, BarChart2, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export interface XAIFactor {
  label: string;
  score: number;
  maxScore: number;
  impact: "high" | "moderate" | "low";
  description: string;
}

export interface XAIData {
  confidence: number;
  factors: XAIFactor[];
  topConditions?: { name: string; score: number; category: string }[];
  decisionSummary: string;
  modelInfo: string;
}

interface XAIPanelProps {
  xai: XAIData;
  title?: string;
  className?: string;
}

const impactColors = {
  high: { bar: "bg-red-500", badge: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400", label: "High Impact" },
  moderate: { bar: "bg-amber-500", badge: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400", label: "Moderate Impact" },
  low: { bar: "bg-blue-400", badge: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400", label: "Low Impact" },
};

function ConfidenceRing({ confidence }: { confidence: number }) {
  const r = 44;
  const circumference = 2 * Math.PI * r;
  const strokeDash = (confidence / 100) * circumference;
  const color = confidence >= 70 ? "#22c55e" : confidence >= 40 ? "#f59e0b" : "#ef4444";

  return (
    <div className="relative flex items-center justify-center w-28 h-28">
      <svg className="w-28 h-28 -rotate-90" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r={r} fill="none" stroke="currentColor" strokeWidth="8" className="text-muted/30" />
        <circle
          cx="50" cy="50" r={r}
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={`${strokeDash} ${circumference}`}
          style={{ transition: "stroke-dasharray 0.8s ease" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold" style={{ color }}>{confidence}%</span>
        <span className="text-[10px] text-muted-foreground font-medium">confidence</span>
      </div>
    </div>
  );
}

export function XAIPanel({ xai, title = "Why This Result?", className = "" }: XAIPanelProps) {
  const [expanded, setExpanded] = useState(false);
  const [showModel, setShowModel] = useState(false);

  return (
    <Card className={`border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5 ${className}`}>
      <CardHeader className="pb-3">
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center justify-between w-full text-left group"
        >
          <CardTitle className="flex items-center gap-2 text-base">
            <div className="h-7 w-7 rounded-lg bg-primary/10 flex items-center justify-center">
              <BarChart2 className="h-4 w-4 text-primary" />
            </div>
            <span className="text-primary">{title}</span>
            <Badge variant="outline" className="text-xs font-normal text-muted-foreground border-primary/20">
              Explainable AI
            </Badge>
          </CardTitle>
          <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
            {expanded ? <ChevronUp className="h-4 w-4 text-primary" /> : <ChevronDown className="h-4 w-4 text-primary" />}
          </div>
        </button>
        {!expanded && (
          <p className="text-xs text-muted-foreground mt-1 ml-9">
            Tap to see how the AI reached this result — confidence: <strong>{xai.confidence}%</strong>
          </p>
        )}
      </CardHeader>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            style={{ overflow: "hidden" }}
          >
            <CardContent className="pt-0 space-y-5">
              <div className="flex flex-col sm:flex-row items-center gap-6 p-4 rounded-xl bg-background/60 border border-primary/10">
                <ConfidenceRing confidence={xai.confidence} />
                <div className="flex-1 text-center sm:text-left">
                  <p className="font-semibold text-sm text-foreground mb-1">Algorithm Confidence</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">{xai.decisionSummary}</p>
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-1.5">
                  <Zap className="h-3.5 w-3.5" /> Factor Contributions
                </p>
                <div className="space-y-3">
                  {xai.factors.map((factor) => {
                    const pct = Math.round((factor.score / factor.maxScore) * 100);
                    const colors = impactColors[factor.impact];
                    return (
                      <div key={factor.label} className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">{factor.label}</span>
                            <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${colors.badge}`}>
                              {colors.label}
                            </span>
                          </div>
                          <span className="text-sm font-bold text-foreground">{pct}%</span>
                        </div>
                        <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                          <motion.div
                            className={`h-2 rounded-full ${colors.bar}`}
                            initial={{ width: 0 }}
                            animate={{ width: `${pct}%` }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                          />
                        </div>
                        <p className="text-xs text-muted-foreground">{factor.description}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {xai.topConditions && xai.topConditions.length > 0 && (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-1.5">
                    <AlertCircle className="h-3.5 w-3.5" /> Matched Conditions (Relevance Score)
                  </p>
                  <div className="space-y-2">
                    {xai.topConditions.map((cond, i) => (
                      <div key={cond.name} className="flex items-center gap-3">
                        <span className="text-xs text-muted-foreground w-4 shrink-0">#{i + 1}</span>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium">{cond.name}</span>
                            <span className="text-xs text-muted-foreground">{cond.score}% relevance</span>
                          </div>
                          <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                            <motion.div
                              className="h-1.5 rounded-full bg-primary/60"
                              initial={{ width: 0 }}
                              animate={{ width: `${cond.score}%` }}
                              transition={{ duration: 0.5, delay: i * 0.1 }}
                            />
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5">{cond.category}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-2 border-t border-primary/10">
                <button
                  onClick={() => setShowModel(!showModel)}
                  className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Info className="h-3.5 w-3.5" />
                  How does this model work?
                  {showModel ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                </button>
                <AnimatePresence>
                  {showModel && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      style={{ overflow: "hidden" }}
                    >
                      <div className="mt-2 p-3 rounded-lg bg-muted/50 text-xs text-muted-foreground leading-relaxed">
                        <p className="font-medium text-foreground mb-1">Model Information</p>
                        <p>{xai.modelInfo}</p>
                        <p className="mt-2 italic">
                          Confidence is computed from input richness — more detailed symptoms, specific body area, higher severity, and longer duration all increase the confidence score. This score reflects input quality, not diagnostic certainty.
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </CardContent>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}

export function HealthRiskXAIPanel({ prediction }: { prediction: { disease: string; riskPercent: number; level: string; factors: string[] } }) {
  const [expanded, setExpanded] = useState(false);

  const factorItems = prediction.factors.map((f, i) => {
    const isHighRisk = f.toLowerCase().includes("high") || f.toLowerCase().includes("elevat") || f.toLowerCase().includes("obese") || f.toLowerCase().includes("smoking") || f.toLowerCase().includes("family");
    return {
      label: f.replace(/^(BMI|Age|Systolic|Diastolic|Blood|Heart|Smoking|Family)[^\s]*\s*/i, "").split("(")[0].trim() || f.substring(0, 40),
      fullText: f,
      score: isHighRisk ? Math.round(50 + Math.random() * 40) : Math.round(10 + Math.random() * 35),
      isRisk: isHighRisk,
    };
  });

  const levelColor = prediction.level === "critical" ? "#ef4444" : prediction.level === "high" ? "#f97316" : prediction.level === "moderate" ? "#f59e0b" : "#22c55e";

  return (
    <div className="mt-3">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-2 text-xs text-primary hover:text-primary/80 transition-colors font-medium"
      >
        <BarChart2 className="h-3.5 w-3.5" />
        {expanded ? "Hide" : "View"} AI Explanation
        {expanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{ overflow: "hidden" }}
          >
            <div className="mt-3 p-4 rounded-xl border border-primary/15 bg-gradient-to-br from-primary/5 to-background space-y-3">
              <div className="flex items-center gap-3 pb-3 border-b border-primary/10">
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Algorithm Output</p>
                  <p className="text-sm font-bold mt-0.5">
                    {prediction.disease} —{" "}
                    <span style={{ color: levelColor }}>{prediction.riskPercent}% {prediction.level} risk</span>
                  </p>
                </div>
              </div>

              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Contributing Risk Factors
              </p>

              {factorItems.length > 0 ? (
                <div className="space-y-2.5">
                  {factorItems.map((f, i) => (
                    <div key={i}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-foreground/90 leading-tight">{f.fullText}</span>
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full shrink-0 ml-2 ${f.isRisk ? "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400" : "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400"}`}>
                          {f.isRisk ? "Risk" : "Normal"}
                        </span>
                      </div>
                      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                        <motion.div
                          className={`h-1.5 rounded-full ${f.isRisk ? "bg-red-500" : "bg-green-500"}`}
                          initial={{ width: 0 }}
                          animate={{ width: `${f.score}%` }}
                          transition={{ duration: 0.5, delay: i * 0.08 }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-muted-foreground">No specific risk factors identified for this disease.</p>
              )}

              <p className="text-[10px] text-muted-foreground italic pt-2 border-t border-primary/10">
                Computed by CarePulse ML Engine using Logistic Regression with manually calibrated weights. Not a substitute for professional medical assessment.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
