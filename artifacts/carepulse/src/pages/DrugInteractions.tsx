import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pill, AlertTriangle, CheckCircle2, Shield, Loader2, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Interaction {
  drug1: string;
  drug2: string;
  severity: "safe" | "mild" | "moderate" | "severe";
  description: string;
  recommendation: string;
}

interface InteractionResult {
  interactions: Interaction[];
  summary: string;
}

const severityConfig: Record<string, { bg: string; border: string; text: string; badge: string; label: string }> = {
  safe: { bg: "bg-green-50 dark:bg-green-950/30", border: "border-green-200 dark:border-green-800", text: "text-green-700 dark:text-green-300", badge: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200", label: "Safe" },
  mild: { bg: "bg-yellow-50 dark:bg-yellow-950/30", border: "border-yellow-200 dark:border-yellow-800", text: "text-yellow-700 dark:text-yellow-300", badge: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200", label: "Mild" },
  moderate: { bg: "bg-orange-50 dark:bg-orange-950/30", border: "border-orange-200 dark:border-orange-800", text: "text-orange-700 dark:text-orange-300", badge: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200", label: "Moderate" },
  severe: { bg: "bg-red-50 dark:bg-red-950/30", border: "border-red-200 dark:border-red-800", text: "text-red-700 dark:text-red-300", badge: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200", label: "Severe" },
};

export default function DrugInteractions() {
  const [medications, setMedications] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<InteractionResult | null>(null);
  const { toast } = useToast();

  const addMedication = () => {
    const med = inputValue.trim();
    if (!med) return;
    if (medications.some((m) => m.toLowerCase() === med.toLowerCase())) {
      toast({ title: "Duplicate", description: "This medication is already added.", variant: "destructive" });
      return;
    }
    setMedications([...medications, med]);
    setInputValue("");
  };

  const removeMedication = (index: number) => {
    setMedications(medications.filter((_, i) => i !== index));
  };

  const checkInteractions = async () => {
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/drug-interactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ medications }),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to check interactions");
      const data = await res.json();
      setResult(data);
    } catch (error) {
      toast({ title: "Error", description: "Failed to check drug interactions. Please try again.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addMedication();
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2 rounded-xl bg-purple-100 dark:bg-purple-900/30">
          <Pill className="h-6 w-6 text-purple-600 dark:text-purple-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Drug Interaction Checker</h1>
          <p className="text-muted-foreground text-sm">AI-powered medication interaction analysis</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Shield className="h-5 w-5 text-blue-500" />
            Add Medications
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Enter medication name..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1"
            />
            <Button onClick={addMedication} disabled={!inputValue.trim()}>
              Add
            </Button>
          </div>

          {medications.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {medications.map((med, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 text-sm font-medium"
                >
                  <Pill className="h-3.5 w-3.5" />
                  {med}
                  <button
                    onClick={() => removeMedication(i)}
                    className="ml-0.5 p-0.5 rounded-full hover:bg-purple-200 dark:hover:bg-purple-800 transition-colors"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </span>
              ))}
            </div>
          )}

          <Button
            onClick={checkInteractions}
            disabled={medications.length < 2 || loading}
            className="w-full"
            size="lg"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Analyzing Interactions...
              </>
            ) : (
              <>
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Check Interactions ({medications.length} medications)
              </>
            )}
          </Button>

          {medications.length < 2 && medications.length > 0 && (
            <p className="text-sm text-muted-foreground text-center">Add at least 2 medications to check interactions</p>
          )}
        </CardContent>
      </Card>

      {result && (
        <div className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <Shield className="h-5 w-5 text-blue-500 mt-0.5 shrink-0" />
                <div>
                  <h3 className="font-semibold mb-1">Analysis Summary</h3>
                  <p className="text-sm text-muted-foreground">{result.summary}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {result.interactions.map((interaction, i) => {
            const config = severityConfig[interaction.severity] || severityConfig.safe;
            return (
              <Card key={i} className={`${config.bg} ${config.border} border`}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex items-center gap-2">
                      {interaction.severity === "severe" ? (
                        <AlertTriangle className={`h-5 w-5 ${config.text}`} />
                      ) : interaction.severity === "safe" ? (
                        <CheckCircle2 className={`h-5 w-5 ${config.text}`} />
                      ) : (
                        <AlertTriangle className={`h-5 w-5 ${config.text}`} />
                      )}
                      <span className="font-semibold">
                        {interaction.drug1} + {interaction.drug2}
                      </span>
                    </div>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${config.badge}`}>
                      {config.label}
                    </span>
                  </div>
                  <p className="text-sm mb-2">{interaction.description}</p>
                  <div className="mt-3 p-3 rounded-lg bg-white/50 dark:bg-black/20">
                    <p className="text-sm font-medium">Recommendation:</p>
                    <p className="text-sm text-muted-foreground">{interaction.recommendation}</p>
                  </div>
                </CardContent>
              </Card>
            );
          })}

          <p className="text-xs text-muted-foreground text-center px-4">
            ⚠️ This tool provides AI-generated information for educational purposes only. Always consult a qualified pharmacist or healthcare provider before making changes to your medications.
          </p>
        </div>
      )}
    </div>
  );
}