import { useState, useEffect, useRef } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  Brain, HeartPulse, CalendarCheck, FileSearch, TrendingUp, TrendingDown, Minus,
  AlertTriangle, Upload, Loader2, ArrowRight, Shield, Activity, Clock, Stethoscope,
  ChevronRight, Network, GitBranch, Scale, CheckCircle2, Info
} from "lucide-react";
import { Link } from "wouter";
import { HealthRiskXAIPanel } from "@/components/XAIPanel";
import { useAuth } from "@/hooks/use-auth";

function riskColor(level: string) {
  switch (level) {
    case "low": return "text-emerald-500";
    case "moderate": return "text-amber-500";
    case "high": return "text-orange-500";
    case "critical": return "text-red-500";
    default: return "text-muted-foreground";
  }
}

function riskBg(level: string) {
  switch (level) {
    case "low": return "bg-emerald-500";
    case "moderate": return "bg-amber-500";
    case "high": return "bg-orange-500";
    case "critical": return "bg-red-500";
    default: return "bg-muted";
  }
}

function riskBadgeVariant(level: string): "default" | "secondary" | "destructive" | "outline" {
  if (level === "critical" || level === "high") return "destructive";
  if (level === "moderate") return "secondary";
  return "outline";
}

function urgencyColor(urgency: string) {
  switch (urgency) {
    case "emergency": return "text-red-500 bg-red-500/10 border-red-500/30";
    case "urgent": return "text-orange-500 bg-orange-500/10 border-orange-500/30";
    case "soon": return "text-amber-500 bg-amber-500/10 border-amber-500/30";
    default: return "text-emerald-500 bg-emerald-500/10 border-emerald-500/30";
  }
}

function HealthRiskTab() {
  const { toast } = useToast();
  const [form, setForm] = useState({
    age: 35,
    gender: "male" as "male" | "female",
    bmi: 24.5,
    systolicBP: 120,
    diastolicBP: 80,
    heartRate: 72,
    bloodSugar: 90,
    smoking: false,
    familyHistory: [] as string[],
  });
  const [familyInput, setFamilyInput] = useState("");
  const hrMounted = useRef(false);
  const hrDebounce = useRef<ReturnType<typeof setTimeout>>();

  const mutation = useMutation({
    mutationFn: async (data: typeof form) => {
      const res = await apiRequest("POST", "/api/ml/health-risk", data);
      return res.json();
    },
    onError: (err: Error) => {
      toast({ title: "Prediction failed", description: err.message, variant: "destructive" });
    },
  });

  // Run on mount immediately, then auto re-run 1.5s after any input change
  useEffect(() => {
    if (!hrMounted.current) {
      hrMounted.current = true;
      mutation.mutate(form);
      return;
    }
    clearTimeout(hrDebounce.current);
    hrDebounce.current = setTimeout(() => mutation.mutate(form), 1500);
    return () => clearTimeout(hrDebounce.current);
  }, [form]);

  const addFamily = () => {
    if (familyInput.trim()) {
      setForm((f) => ({ ...f, familyHistory: [...f.familyHistory, familyInput.trim()] }));
      setFamilyInput("");
    }
  };

  const removeFamily = (i: number) => {
    setForm((f) => ({ ...f, familyHistory: f.familyHistory.filter((_, idx) => idx !== i) }));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HeartPulse className="h-5 w-5 text-red-500" />
            Health Parameters
          </CardTitle>
        </CardHeader>
        <CardContent>
          {(() => {
            const rangeErr = (val: number, min: number, max: number, label: string, unit: string) =>
              val !== 0 && (val < min || val > max)
                ? <p className="text-[11px] text-red-500 mt-0.5">{label}: {min}–{max} {unit}</p>
                : null;
            return (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <Label>Age</Label>
                  <Input data-testid="input-age" type="number" value={form.age || ""} onChange={(e) => setForm((f) => ({ ...f, age: e.target.value === "" ? 0 : +e.target.value }))} min={1} max={120} className={form.age !== 0 && (form.age < 1 || form.age > 120) ? "border-red-400 focus-visible:ring-red-400" : ""} />
                  {rangeErr(form.age, 1, 120, "Valid range", "years")}
                </div>
                <div>
                  <Label>Gender</Label>
                  <Select value={form.gender} onValueChange={(v) => setForm((f) => ({ ...f, gender: v as "male" | "female" }))}>
                    <SelectTrigger data-testid="select-gender"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>BMI</Label>
                  <Input data-testid="input-bmi" type="number" step="0.1" value={form.bmi || ""} onChange={(e) => setForm((f) => ({ ...f, bmi: e.target.value === "" ? 0 : +e.target.value }))} min={10} max={60} className={form.bmi !== 0 && (form.bmi < 10 || form.bmi > 60) ? "border-red-400 focus-visible:ring-red-400" : ""} />
                  {rangeErr(form.bmi, 10, 60, "Valid range", "")}
                </div>
                <div>
                  <Label>Systolic BP (mmHg)</Label>
                  <Input data-testid="input-systolic" type="number" value={form.systolicBP || ""} onChange={(e) => setForm((f) => ({ ...f, systolicBP: e.target.value === "" ? 0 : +e.target.value }))} min={60} max={250} className={form.systolicBP !== 0 && (form.systolicBP < 60 || form.systolicBP > 250) ? "border-red-400 focus-visible:ring-red-400" : ""} />
                  {rangeErr(form.systolicBP, 60, 250, "Valid range", "mmHg")}
                </div>
                <div>
                  <Label>Diastolic BP (mmHg)</Label>
                  <Input data-testid="input-diastolic" type="number" value={form.diastolicBP || ""} onChange={(e) => setForm((f) => ({ ...f, diastolicBP: e.target.value === "" ? 0 : +e.target.value }))} min={40} max={180} className={form.diastolicBP !== 0 && (form.diastolicBP < 40 || form.diastolicBP > 180) ? "border-red-400 focus-visible:ring-red-400" : ""} />
                  {rangeErr(form.diastolicBP, 40, 180, "Valid range", "mmHg")}
                </div>
                <div>
                  <Label>Heart Rate (bpm)</Label>
                  <Input data-testid="input-heartrate" type="number" value={form.heartRate || ""} onChange={(e) => setForm((f) => ({ ...f, heartRate: e.target.value === "" ? 0 : +e.target.value }))} min={30} max={200} className={form.heartRate !== 0 && (form.heartRate < 30 || form.heartRate > 200) ? "border-red-400 focus-visible:ring-red-400" : ""} />
                  {rangeErr(form.heartRate, 30, 200, "Valid range", "bpm")}
                </div>
                <div>
                  <Label>Blood Sugar (mg/dL)</Label>
                  <Input data-testid="input-bloodsugar" type="number" value={form.bloodSugar || ""} onChange={(e) => setForm((f) => ({ ...f, bloodSugar: e.target.value === "" ? 0 : +e.target.value }))} min={40} max={500} className={form.bloodSugar !== 0 && (form.bloodSugar < 40 || form.bloodSugar > 500) ? "border-red-400 focus-visible:ring-red-400" : ""} />
                  {rangeErr(form.bloodSugar, 40, 500, "Valid range", "mg/dL")}
                </div>
            <div className="flex items-end gap-3">
              <div className="flex-1">
                <Label>Smoking</Label>
                <div className="flex items-center gap-2 mt-2">
                  <Switch data-testid="switch-smoking" checked={form.smoking} onCheckedChange={(v) => setForm((f) => ({ ...f, smoking: v }))} />
                  <span className="text-sm text-muted-foreground">{form.smoking ? "Yes" : "No"}</span>
                </div>
              </div>
            </div>
          </div>
            );
          })()}

          <div className="mt-4">
            <Label>Family History</Label>
            <div className="flex gap-2 mt-1">
              <Input data-testid="input-family-history" placeholder="e.g. Diabetes, Heart Disease" value={familyInput} onChange={(e) => setFamilyInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addFamily())} />
              <Button variant="outline" onClick={addFamily} data-testid="button-add-family">Add</Button>
            </div>
            {form.familyHistory.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {form.familyHistory.map((h, i) => (
                  <Badge key={i} variant="secondary" className="cursor-pointer" onClick={() => removeFamily(i)}>{h} &times;</Badge>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <Button
              className="mt-6 w-full sm:w-auto"
              onClick={() => mutation.mutate(form)}
              disabled={mutation.isPending}
              data-testid="button-predict-risk"
            >
              {mutation.isPending ? <><Loader2 className="h-4 w-4 animate-spin mr-2" />Analyzing...</> : <><Brain className="h-4 w-4 mr-2" />Predict Health Risk</>}
            </Button>
            {mutation.isPending && mutation.data && (
              <span className="text-xs text-muted-foreground mt-6 flex items-center gap-1">
                <Loader2 className="h-3 w-3 animate-spin" /> Auto-updating...
              </span>
            )}
          </div>
        </CardContent>
      </Card>

      {mutation.data && (
        <div className="space-y-4" data-testid="risk-results">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Overall Risk Assessment</h3>
                <Badge variant={riskBadgeVariant(mutation.data.overallRisk)} className="text-base px-3 py-1" data-testid="badge-overall-risk">
                  {mutation.data.overallRisk.toUpperCase()} — {mutation.data.overallScore}%
                </Badge>
              </div>
              <Progress value={mutation.data.overallScore} className="h-3" />
            </CardContent>
          </Card>

          {mutation.data.predictions.map((pred: any) => (
            <Card key={pred.disease}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold">{pred.disease}</h4>
                  <span className={`font-bold text-lg ${riskColor(pred.level)}`} data-testid={`risk-percent-${pred.disease.replace(/\s+/g, "-").toLowerCase()}`}>
                    {pred.riskPercent}%
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-2.5 mb-3">
                  <div className={`h-2.5 rounded-full transition-all duration-500 ${riskBg(pred.level)}`} style={{ width: `${pred.riskPercent}%` }} />
                </div>
                <Badge variant={riskBadgeVariant(pred.level)} className="mb-3">{pred.level}</Badge>
                {pred.factors.length > 0 && (
                  <div className="mt-2">
                    <p className="text-sm font-medium text-muted-foreground mb-1">Risk Factors:</p>
                    <ul className="text-sm space-y-1">
                      {pred.factors.map((f: string, i: number) => (
                        <li key={i} className="flex items-start gap-2">
                          <AlertTriangle className="h-3.5 w-3.5 mt-0.5 text-amber-500 shrink-0" />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {pred.recommendations.length > 0 && (
                  <div className="mt-3">
                    <p className="text-sm font-medium text-muted-foreground mb-1">Recommendations:</p>
                    <ul className="text-sm space-y-1">
                      {pred.recommendations.map((r: string, i: number) => (
                        <li key={i} className="flex items-start gap-2">
                          <Shield className="h-3.5 w-3.5 mt-0.5 text-blue-500 shrink-0" />
                          <span>{r}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                <HealthRiskXAIPanel prediction={pred} />
              </CardContent>
            </Card>
          ))}

          <Card>
            <CardHeader><CardTitle className="text-base">General Recommendations</CardTitle></CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {mutation.data.generalRecommendations.map((r: string, i: number) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <ChevronRight className="h-4 w-4 mt-0.5 text-primary shrink-0" />
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

function AppointmentRecommendTab() {
  const { toast } = useToast();
  const [symptoms, setSymptoms] = useState("");
  const [age, setAge] = useState<number | undefined>();
  const [gender, setGender] = useState<string | undefined>();

  const mutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/ml/appointment-recommend", {
        symptoms,
        ...(age && { age }),
        ...(gender && { gender }),
      });
      return res.json();
    },
    onError: () => {
      toast({ title: "Recommendation failed", variant: "destructive" });
    },
  });

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Stethoscope className="h-5 w-5 text-blue-500" />
            Describe Your Symptoms
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Symptoms</Label>
            <Textarea
              data-testid="input-symptoms"
              placeholder="Describe your symptoms in detail, e.g. 'I have been experiencing severe headaches for the past week, along with dizziness and blurry vision...'"
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              rows={4}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label>Age (optional)</Label>
              <Input data-testid="input-recommend-age" type="number" placeholder="Your age" value={age || ""} onChange={(e) => setAge(e.target.value ? +e.target.value : undefined)} />
            </div>
            <div>
              <Label>Gender (optional)</Label>
              <Select value={gender || ""} onValueChange={(v) => setGender(v || undefined)}>
                <SelectTrigger data-testid="select-recommend-gender"><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button
            onClick={() => mutation.mutate()}
            disabled={mutation.isPending || symptoms.length < 3}
            data-testid="button-get-recommendations"
          >
            {mutation.isPending ? <><Loader2 className="h-4 w-4 animate-spin mr-2" />Analyzing...</> : <><CalendarCheck className="h-4 w-4 mr-2" />Get Recommendations</>}
          </Button>
        </CardContent>
      </Card>

      {mutation.data && (
        <div className="space-y-4" data-testid="recommend-results">
          <Card>
            <CardContent className="pt-6">
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border font-semibold ${urgencyColor(mutation.data.urgency)}`} data-testid="urgency-badge">
                <Activity className="h-4 w-4" />
                Urgency: {mutation.data.urgency.toUpperCase()}
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{mutation.data.urgencyReason}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-base">Recommended Specialties</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {mutation.data.specialties.map((spec: any, i: number) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-muted/50 border" data-testid={`specialty-${i}`}>
                  <div>
                    <p className="font-semibold">{spec.specialty}</p>
                    <p className="text-sm text-muted-foreground">{spec.department}</p>
                    <p className="text-xs text-muted-foreground mt-1">{spec.reason}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-bold text-primary">{spec.confidence}%</span>
                    <p className="text-xs text-muted-foreground">confidence</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-base flex items-center gap-2"><Clock className="h-4 w-4" />Suggested Times</CardTitle></CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {mutation.data.suggestedTimes.map((t: string, i: number) => (
                  <li key={i} className="text-sm flex items-start gap-2">
                    <ChevronRight className="h-4 w-4 mt-0.5 text-primary shrink-0" />
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-base">Tips for Your Visit</CardTitle></CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {mutation.data.tips.map((t: string, i: number) => (
                  <li key={i} className="text-sm flex items-start gap-2">
                    <Shield className="h-3.5 w-3.5 mt-0.5 text-blue-500 shrink-0" />
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
              <Link href="/appointments">
                <Button className="mt-4" variant="outline" data-testid="button-book-appointment">
                  <CalendarCheck className="h-4 w-4 mr-2" />Book Appointment<ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

function ReportSummarizerTab() {
  const { toast } = useToast();
  const [files, setFiles] = useState<File[]>([]);
  const [result, setResult] = useState<any>(null);

  const mutation = useMutation({
    mutationFn: async () => {
      const formData = new FormData();
      files.forEach((f) => formData.append("files", f));
      const res = await fetch("/api/ml/report-summarize", {
        method: "POST",
        body: formData,
        credentials: "include",
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to summarize");
      }
      return res.json();
    },
    onSuccess: (data) => {
      setResult(data);
      toast({ title: "Report analyzed successfully!" });
    },
    onError: () => {
      toast({ title: "Analysis failed", variant: "destructive" });
    },
  });

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const dropped = Array.from(e.dataTransfer.files);
    setFiles((prev) => [...prev, ...dropped].slice(0, 5));
  };

  const statusColor = (s: string) => {
    if (s === "critical") return "text-red-500 bg-red-500/10";
    if (s === "high") return "text-orange-500 bg-orange-500/10";
    if (s === "low") return "text-blue-500 bg-blue-500/10";
    return "text-amber-500 bg-amber-500/10";
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileSearch className="h-5 w-5 text-purple-500" />
            Upload Medical Reports
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div
            className="border-2 border-dashed rounded-xl p-8 text-center cursor-pointer hover:border-primary/50 transition-colors"
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            onClick={() => document.getElementById("report-upload")?.click()}
            data-testid="drop-zone-reports"
          >
            <Upload className="h-10 w-10 mx-auto mb-3 text-muted-foreground" />
            <p className="text-sm font-medium">Drop medical reports here or click to upload</p>
            <p className="text-xs text-muted-foreground mt-1">PDF, images, CSV — up to 5 files, 20MB each</p>
            <input
              id="report-upload"
              type="file"
              multiple
              className="hidden"
              accept=".pdf,.png,.jpg,.jpeg,.webp,.csv,.xlsx,.doc,.docx"
              onChange={(e) => {
                const selected = Array.from(e.target.files || []);
                setFiles((prev) => [...prev, ...selected].slice(0, 5));
              }}
            />
          </div>
          {files.length > 0 && (
            <div className="mt-3 space-y-2">
              {files.map((f, i) => (
                <div key={i} className="flex items-center justify-between p-2 bg-muted/50 rounded-lg text-sm">
                  <span className="truncate">{f.name}</span>
                  <Button variant="ghost" size="sm" onClick={() => setFiles((prev) => prev.filter((_, idx) => idx !== i))}>&times;</Button>
                </div>
              ))}
            </div>
          )}
          <Button
            className="mt-4"
            onClick={() => mutation.mutate()}
            disabled={mutation.isPending || files.length === 0}
            data-testid="button-analyze-report"
          >
            {mutation.isPending ? <><Loader2 className="h-4 w-4 animate-spin mr-2" />Analyzing Report...</> : <><FileSearch className="h-4 w-4 mr-2" />Analyze Report</>}
          </Button>
        </CardContent>
      </Card>

      {result && (
        <div className="space-y-4" data-testid="report-results">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-lg">Summary</h3>
                {result.urgency && (
                  <Badge variant={result.urgency === "critical" || result.urgency === "urgent" ? "destructive" : "secondary"} data-testid="report-urgency">
                    {result.urgency}
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground" data-testid="report-summary">{result.summary}</p>
            </CardContent>
          </Card>

          {result.keyFindings?.length > 0 && (
            <Card>
              <CardHeader><CardTitle className="text-base">Key Findings</CardTitle></CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {result.keyFindings.map((f: string, i: number) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <ChevronRight className="h-4 w-4 mt-0.5 text-primary shrink-0" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {result.abnormalValues?.length > 0 && (
            <Card>
              <CardHeader><CardTitle className="text-base">Abnormal Values</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {result.abnormalValues.map((v: any, i: number) => (
                    <div key={i} className={`flex items-center justify-between p-3 rounded-lg border ${statusColor(v.status)}`}>
                      <div>
                        <p className="font-medium">{v.parameter}</p>
                        <p className="text-xs">Normal: {v.normalRange}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">{v.value}</p>
                        <Badge variant={v.status === "critical" ? "destructive" : "secondary"} className="text-xs">{v.status}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {result.diagnoses?.length > 0 && (
            <Card>
              <CardHeader><CardTitle className="text-base">Diagnoses</CardTitle></CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {result.diagnoses.map((d: string, i: number) => (
                    <Badge key={i} variant="outline" className="px-3 py-1">{d}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {result.recommendations?.length > 0 && (
            <Card>
              <CardHeader><CardTitle className="text-base">Recommendations</CardTitle></CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {result.recommendations.map((r: string, i: number) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <Shield className="h-3.5 w-3.5 mt-0.5 text-blue-500 shrink-0" />
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}

function OutbreakPredictionTab() {
  const { data, isLoading, error } = useQuery<any[]>({
    queryKey: ["/api/ml/outbreak-predict"],
  });

  const trendIcon = (t: string) => {
    if (t === "rising") return <TrendingUp className="h-5 w-5 text-red-500" />;
    if (t === "falling") return <TrendingDown className="h-5 w-5 text-emerald-500" />;
    return <Minus className="h-5 w-5 text-amber-500" />;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-3 text-muted-foreground">Analyzing disease trends...</span>
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="pt-6 text-center text-destructive">
          Failed to load outbreak predictions. Please try again.
        </CardContent>
      </Card>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6 text-center text-muted-foreground">
          No disease trend data available for prediction. Trends will appear once data is recorded.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4" data-testid="outbreak-results">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="bg-muted/30">
          <CardContent className="pt-6 text-center">
            <p className="text-3xl font-bold text-primary">{data.length}</p>
            <p className="text-sm text-muted-foreground">Diseases Tracked</p>
          </CardContent>
        </Card>
        <Card className="bg-muted/30">
          <CardContent className="pt-6 text-center">
            <p className="text-3xl font-bold text-red-500">{data.filter((d: any) => d.trend === "rising").length}</p>
            <p className="text-sm text-muted-foreground">Rising Trends</p>
          </CardContent>
        </Card>
        <Card className="bg-muted/30">
          <CardContent className="pt-6 text-center">
            <p className="text-3xl font-bold text-orange-500">{data.filter((d: any) => d.riskLevel === "critical" || d.riskLevel === "high").length}</p>
            <p className="text-sm text-muted-foreground">High Risk Outbreaks</p>
          </CardContent>
        </Card>
      </div>

      {data.map((pred: any, i: number) => (
        <Card key={i}>
          <CardContent className="pt-6">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                {trendIcon(pred.trend)}
                <div>
                  <h4 className="font-semibold text-lg" data-testid={`outbreak-disease-${i}`}>{pred.disease}</h4>
                  <p className="text-sm text-muted-foreground">{pred.locations.join(", ")}</p>
                </div>
              </div>
              <Badge variant={riskBadgeVariant(pred.riskLevel)} data-testid={`outbreak-risk-${i}`}>{pred.riskLevel}</Badge>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 my-4">
              <div className="bg-muted/50 rounded-lg p-3 text-center">
                <p className="text-lg font-bold">{pred.currentCases.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">Current Cases</p>
              </div>
              <div className="bg-muted/50 rounded-lg p-3 text-center">
                <p className="text-lg font-bold">{pred.predictedCases.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">Predicted Next</p>
              </div>
              <div className="bg-muted/50 rounded-lg p-3 text-center">
                <p className={`text-lg font-bold ${pred.growthRate > 0 ? "text-red-500" : pred.growthRate < 0 ? "text-emerald-500" : "text-amber-500"}`}>
                  {pred.growthRate > 0 ? "+" : ""}{pred.growthRate}%
                </p>
                <p className="text-xs text-muted-foreground">Growth Rate</p>
              </div>
              <div className="bg-muted/50 rounded-lg p-3 text-center">
                <p className={`text-lg font-bold capitalize ${pred.trend === "rising" ? "text-red-500" : pred.trend === "falling" ? "text-emerald-500" : "text-amber-500"}`}>
                  {pred.trend}
                </p>
                <p className="text-xs text-muted-foreground">Trend</p>
              </div>
            </div>

            <p className="text-sm text-muted-foreground" data-testid={`outbreak-prediction-${i}`}>{pred.prediction}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// ─── Deep Learning Tab (Decision Tree + MLP + Fairness) ───────────────────────
const DISEASE_COLORS: Record<string, string> = {
  "Type 2 Diabetes": "text-amber-600",
  "Hypertension": "text-red-500",
  "Heart Disease": "text-rose-600",
  "Stroke": "text-purple-600",
  "Kidney Disease": "text-blue-500",
};

function RiskBar({ label, value, level }: { label: string; value: number; level: string }) {
  const barColor = level === "critical" ? "bg-red-500" : level === "high" ? "bg-orange-500" : level === "moderate" ? "bg-amber-500" : "bg-emerald-500";
  return (
    <div className="space-y-1">
      <div className="flex justify-between items-center">
        <span className={`text-sm font-medium ${DISEASE_COLORS[label] ?? ""}`}>{label}</span>
        <span className={`text-sm font-bold ${barColor.replace("bg-", "text-")}`}>{value}%</span>
      </div>
      <div className="h-2.5 bg-muted rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${barColor} transition-all duration-700`} style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

function DeepLearningTab() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [form, setForm] = useState({
    age: "45", gender: "male", bmi: "28", systolicBP: "135", diastolicBP: "85",
    heartRate: "78", bloodSugar: "115", smoking: false, familyHistory: false,
  });
  const [activeModel, setActiveModel] = useState<"dt" | "mlp">("dt");
  const [dtResult, setDtResult] = useState<any>(null);
  const [mlpResult, setMlpResult] = useState<any>(null);
  const [fairness, setFairness] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [showDifferInfo, setShowDifferInfo] = useState(false);
  const dlMounted = useRef(false);
  const dlDebounceRef = useRef<ReturnType<typeof setTimeout>>();

  const isPrivileged = user?.role === "admin" || user?.role === "doctor";

  // Build payload from current form state
  const buildPayload = (f: typeof form) => ({
    age: Number(f.age), gender: f.gender, bmi: Number(f.bmi),
    systolicBP: Number(f.systolicBP), diastolicBP: Number(f.diastolicBP),
    heartRate: Number(f.heartRate), bloodSugar: Number(f.bloodSugar),
    smoking: f.smoking, familyHistory: f.familyHistory,
  });

  const handlePredict = async (f: typeof form = form) => {
    setLoading(true);
    try {
      const payload = buildPayload(f);
      const [dt, mlp, fair] = await Promise.all([
        apiRequest("POST", "/api/ml/decision-tree", payload).then(r => r.json()),
        apiRequest("POST", "/api/ml/neural-network", payload).then(r => r.json()),
        apiRequest("POST", "/api/ml/fairness-analysis", payload).then(r => r.json()),
      ]);
      setDtResult(dt);
      setMlpResult(mlp);
      setFairness(fair);
    } catch (err) {
      toast({ title: "Prediction failed", description: (err as Error).message, variant: "destructive" });
    } finally { setLoading(false); }
  };

  // Run on mount immediately; then auto re-run 1.5s after any input change
  useEffect(() => {
    if (!dlMounted.current) {
      dlMounted.current = true;
      handlePredict(form);
      return;
    }
    clearTimeout(dlDebounceRef.current);
    dlDebounceRef.current = setTimeout(() => handlePredict(form), 1500);
    return () => clearTimeout(dlDebounceRef.current);
  }, [form]);

  const boolField = (key: "smoking" | "familyHistory", label: string) => (
    <div className="flex items-center gap-2">
      <Switch
        checked={form[key]}
        onCheckedChange={(v) => setForm(f => ({ ...f, [key]: v }))}
      />
      <Label className="text-sm">{label}</Label>
    </div>
  );

  const activeResult = activeModel === "dt" ? dtResult : mlpResult;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Network className="h-5 w-5 text-violet-500" />
            Multi-Model Deep Learning Predictor
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { key: "age", label: "Age (years)" },
              { key: "bmi", label: "BMI" },
              { key: "systolicBP", label: "Systolic BP" },
              { key: "diastolicBP", label: "Diastolic BP" },
              { key: "heartRate", label: "Heart Rate" },
              { key: "bloodSugar", label: "Blood Sugar (mg/dL)" },
            ].map(({ key, label }) => (
              <div key={key}>
                <Label className="text-xs">{label}</Label>
                <Input
                  type="number"
                  value={(form as any)[key]}
                  onChange={(e) => setForm(f => ({ ...f, [key]: e.target.value }))}
                  className="h-9"
                />
              </div>
            ))}
            <div>
              <Label className="text-xs">Gender</Label>
              <Select value={form.gender} onValueChange={(v) => setForm(f => ({ ...f, gender: v }))}>
                <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-2 justify-center pt-4">
              {boolField("smoking", "Smoker")}
              {boolField("familyHistory", "Family History")}
            </div>
          </div>

          <div className="flex gap-3 flex-wrap">
            <Button onClick={() => handlePredict()} disabled={loading} className="gap-2">
              {loading ? <><Loader2 className="h-4 w-4 animate-spin" />Running Models...</> : <><Brain className="h-4 w-4" />Run Both Models</>}
            </Button>
            {(dtResult || mlpResult) && (
              <div className="flex rounded-md overflow-hidden border">
                <button
                  onClick={() => setActiveModel("dt")}
                  className={`px-3 py-1.5 text-xs font-medium gap-1.5 flex items-center ${activeModel === "dt" ? "bg-primary text-primary-foreground" : "bg-background text-muted-foreground hover:text-foreground"}`}
                >
                  <GitBranch className="h-3.5 w-3.5" />Decision Tree
                </button>
                <button
                  onClick={() => setActiveModel("mlp")}
                  className={`px-3 py-1.5 text-xs font-medium gap-1.5 flex items-center ${activeModel === "mlp" ? "bg-primary text-primary-foreground" : "bg-background text-muted-foreground hover:text-foreground"}`}
                >
                  <Network className="h-3.5 w-3.5" />Neural Network
                </button>
              </div>
            )}
          </div>

          {/* Results */}
          {activeResult && (
            <div className="space-y-4 pt-2 border-t">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <p className="font-semibold text-sm">
                    {activeModel === "dt" ? activeResult.algorithmInfo?.name : activeResult.networkInfo?.architecture}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {activeModel === "dt"
                      ? `Depth: ${activeResult.algorithmInfo?.depth} | Nodes: ${activeResult.algorithmInfo?.nodes} | Split: ${activeResult.algorithmInfo?.splitCriterion}`
                      : `Params: ${activeResult.networkInfo?.parameters} | Activation: ${activeResult.networkInfo?.activationFn}`}
                  </p>
                </div>
                <Badge className={`capitalize ${activeResult.overallRisk === "critical" ? "bg-red-100 text-red-700" : activeResult.overallRisk === "high" ? "bg-orange-100 text-orange-700" : activeResult.overallRisk === "moderate" ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700"}`}>
                  {activeResult.overallRisk} overall
                </Badge>
              </div>

              <div className="space-y-3">
                {activeResult.predictions?.map((p: any) => (
                  <RiskBar key={p.disease} label={p.disease} value={p.riskPercent} level={p.level} />
                ))}
              </div>

              {/* Decision Tree: show split path for the highest-risk disease */}
              {activeModel === "dt" && activeResult.predictions && (() => {
                const top = [...activeResult.predictions].sort((a: any, b: any) => b.riskPercent - a.riskPercent)[0];
                return top?.splitPath?.length > 0 ? (
                  <div className="p-3 rounded-lg bg-violet-50 dark:bg-violet-900/20 border border-violet-200 dark:border-violet-700/30 space-y-1.5">
                    <p className="text-xs font-semibold text-violet-700 dark:text-violet-400 flex items-center gap-1.5">
                      <GitBranch className="h-3.5 w-3.5" />Decision Path — {top.disease}
                    </p>
                    {top.splitPath.map((step: string, i: number) => (
                      <div key={i} className="flex items-start gap-2">
                        <ChevronRight className="h-3.5 w-3.5 text-violet-400 mt-0.5 shrink-0" />
                        <p className="text-xs text-violet-600 dark:text-violet-300">{step}</p>
                      </div>
                    ))}
                    <p className="text-xs font-mono text-violet-500 dark:text-violet-400 mt-1 pl-5">{top.leafRule}</p>
                  </div>
                ) : null;
              })()}

              {/* MLP: show hidden neuron activations */}
              {activeModel === "mlp" && activeResult.hiddenLayerOutputs && (
                <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700/30">
                  <p className="text-xs font-semibold text-blue-700 dark:text-blue-400 flex items-center gap-1.5 mb-2">
                    <Network className="h-3.5 w-3.5" />Hidden Layer Neuron Activations (14 neurons)
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {activeResult.hiddenLayerOutputs.map((v: number, i: number) => (
                      <div key={i} className={`flex flex-col items-center p-1.5 rounded bg-background border min-w-[40px]`}>
                        <span className="text-xs font-bold">{v}%</span>
                        <span className="text-[10px] text-muted-foreground">h{i}</span>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">{activeResult.networkInfo?.trainingApproach}</p>
                </div>
              )}

              {/* Model comparison if both results exist */}
              {dtResult && mlpResult && (
                <div className="p-3 rounded-lg bg-muted/30 border space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold flex items-center gap-1.5"><Scale className="h-3.5 w-3.5" />Model Comparison</p>
                    <button
                      onClick={() => setShowDifferInfo(v => !v)}
                      className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      <Info className="h-3.5 w-3.5" />
                      {showDifferInfo ? "Hide" : "About"}
                    </button>
                  </div>

                  {showDifferInfo && (
                    <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/30 text-xs space-y-2">
                      <p className="font-semibold text-blue-700 dark:text-blue-400">Why do the two models sometimes disagree?</p>
                      <p className="text-blue-600 dark:text-blue-300">
                        <span className="font-medium">Decision Tree (C4.5)</span> uses strict yes/no rules — it checks each value against a fixed threshold (e.g. "Is Blood Sugar ≥ 126?") and follows a single path to a result.
                      </p>
                      <p className="text-blue-600 dark:text-blue-300">
                        <span className="font-medium">Neural Network (MLP)</span> combines all 9 inputs simultaneously through 14 hidden neurons. Small interactions between features (e.g. age + gender + family history together) can add up and produce a different score even when individual values seem normal.
                      </p>
                      <p className="text-blue-600 dark:text-blue-300">
                        <span className="font-medium text-emerald-600">Green ✓</span> = both models agree within ±10%. &nbsp;
                        <span className="font-medium text-amber-600">Amber ⚠</span> = models diverge by more than 10% — a doctor should review both results.
                      </p>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-2">
                    {dtResult.predictions?.map((dp: any, i: number) => {
                      const mp = mlpResult.predictions?.[i];
                      if (!mp) return null;
                      const agree = Math.abs(dp.riskPercent - mp.riskPercent) <= 10;
                      return (
                        <div key={dp.disease} className="flex items-center justify-between text-xs p-2 rounded bg-background border">
                          <span className="text-muted-foreground truncate mr-1">{dp.disease.replace("Type 2 ", "")}</span>
                          <div className="flex items-center gap-1.5 shrink-0">
                            <span className="font-mono">{dp.riskPercent}%</span>
                            <span className="text-muted-foreground">vs</span>
                            <span className="font-mono">{mp.riskPercent}%</span>
                            {agree ? <CheckCircle2 className="h-3 w-3 text-emerald-500" /> : <Info className="h-3 w-3 text-amber-500" />}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <p className="text-xs text-muted-foreground">DT% vs MLP% — Green = agree (±10%). Amber = divergent.</p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Algorithmic Fairness */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Scale className="h-5 w-5 text-emerald-500" />
            Algorithmic Fairness & Bias Metrics
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading && !fairness ? (
            <div className="flex items-center gap-2 text-muted-foreground py-4">
              <Loader2 className="h-4 w-4 animate-spin" />Loading fairness data...
            </div>
          ) : !fairness ? (
            <p className="text-sm text-muted-foreground py-4">Run predictions to view fairness metrics.</p>
          ) : (
            <div className="space-y-5">
              <p className="text-xs text-muted-foreground">Both Decision Tree and Neural Network are run for each demographic group using your exact inputs — changes as you adjust parameters.</p>

              {/* Summary cards — all change with inputs */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-4 rounded-xl border text-center">
                  <p className={`text-3xl font-bold ${fairness.biasScore >= 80 ? "text-emerald-500" : fairness.biasScore >= 60 ? "text-amber-500" : "text-red-500"}`}>
                    {fairness.biasScore}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">Fairness Score / 100</p>
                </div>
                <div className="p-4 rounded-xl border text-center">
                  <p className={`text-3xl font-bold ${fairness.avgOverallRisk <= 25 ? "text-emerald-500" : fairness.avgOverallRisk <= 50 ? "text-amber-500" : "text-red-500"}`}>
                    {fairness.avgOverallRisk}%
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">Avg Risk (All Groups)</p>
                </div>
                <div className="p-4 rounded-xl border text-center">
                  <p className={`text-3xl font-bold ${fairness.genderGap <= 4 ? "text-emerald-500" : fairness.genderGap <= 10 ? "text-amber-500" : "text-red-500"}`}>
                    {fairness.genderGap}%
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">Gender Gap (M vs F)</p>
                </div>
                <div className="p-4 rounded-xl border text-center">
                  <p className={`text-lg font-bold pt-2 ${fairness.equityStatus === "Equitable" ? "text-emerald-500" : fairness.equityStatus === "Minor Bias" ? "text-amber-500" : "text-red-500"}`}>
                    {fairness.equityStatus}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">Equity Status</p>
                </div>
              </div>

              {/* Gender Fairness — DT + MLP side by side */}
              <div>
                <p className="text-sm font-semibold mb-3 flex items-center gap-1.5">
                  <Activity className="h-4 w-4 text-blue-500" />Gender Fairness — Same Inputs, Gender Varied
                </p>
                <div className="space-y-3">
                  {fairness.genderFairness?.map((g: any) => (
                    <div key={g.group} className="p-3 rounded-xl border bg-muted/20 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-sm">{g.group}</span>
                        <Badge variant="outline" className={`text-[10px] ${g.combinedRisk >= 70 ? "border-red-400 text-red-600" : g.combinedRisk >= 50 ? "border-orange-400 text-orange-600" : g.combinedRisk >= 25 ? "border-amber-400 text-amber-600" : "border-emerald-400 text-emerald-600"}`}>
                          Combined {g.combinedRisk}%
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <div className="flex justify-between mb-1 text-[11px] text-muted-foreground">
                            <span>🧠 Neural Network (MLP)</span><span className="font-bold text-foreground">{g.mlpRisk}%</span>
                          </div>
                          <div className="h-2 rounded-full bg-muted overflow-hidden">
                            <div className="h-full rounded-full bg-violet-500 transition-all duration-500" style={{ width: `${g.mlpRisk}%` }} />
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between mb-1 text-[11px] text-muted-foreground">
                            <span>🌳 Decision Tree (C4.5)</span><span className="font-bold text-foreground">{g.dtRisk}%</span>
                          </div>
                          <div className="h-2 rounded-full bg-muted overflow-hidden">
                            <div className="h-full rounded-full bg-blue-500 transition-all duration-500" style={{ width: `${g.dtRisk}%` }} />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Age Fairness — DT + MLP side by side */}
              <div>
                <p className="text-sm font-semibold mb-3 flex items-center gap-1.5">
                  <Clock className="h-4 w-4 text-violet-500" />Age Group Fairness — Same Inputs, Age Group Varied
                </p>
                <div className="space-y-3">
                  {fairness.ageFairness?.map((g: any) => (
                    <div key={g.group} className="p-3 rounded-xl border bg-muted/20 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-sm">{g.group}</span>
                        <Badge variant="outline" className={`text-[10px] ${g.combinedRisk >= 70 ? "border-red-400 text-red-600" : g.combinedRisk >= 50 ? "border-orange-400 text-orange-600" : g.combinedRisk >= 25 ? "border-amber-400 text-amber-600" : "border-emerald-400 text-emerald-600"}`}>
                          Combined {g.combinedRisk}%
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <div className="flex justify-between mb-1 text-[11px] text-muted-foreground">
                            <span>🧠 Neural Network (MLP)</span><span className="font-bold text-foreground">{g.mlpRisk}%</span>
                          </div>
                          <div className="h-2 rounded-full bg-muted overflow-hidden">
                            <div className="h-full rounded-full bg-violet-500 transition-all duration-500" style={{ width: `${g.mlpRisk}%` }} />
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between mb-1 text-[11px] text-muted-foreground">
                            <span>🌳 Decision Tree (C4.5)</span><span className="font-bold text-foreground">{g.dtRisk}%</span>
                          </div>
                          <div className="h-2 rounded-full bg-muted overflow-hidden">
                            <div className="h-full rounded-full bg-blue-500 transition-all duration-500" style={{ width: `${g.dtRisk}%` }} />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800/30">
                <p className="text-xs text-emerald-700 dark:text-emerald-400">
                  <strong>Age Disparity:</strong> {fairness.maxAgeDisparity}% across age groups. &nbsp;
                  <strong>Avg Risk (all groups):</strong> {fairness.avgOverallRisk}%. &nbsp;
                  <strong>Gender Gap:</strong> {fairness.genderGap}% (M vs F). &nbsp;
                  <strong>Benchmark:</strong> Bias reduction {fairness.paperBenchmark?.biasReduction}% — Equity improvement {fairness.paperBenchmark?.equityImprovement}%.
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default function MLInsights() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-3" data-testid="ml-insights-title">
          <Brain className="h-7 w-7 text-primary" />
          CareIntelligence
        </h1>
        <p className="text-muted-foreground mt-1">AI-Powered Health Analytics — Smart predictions, risk assessment & outbreak tracking</p>
      </div>

      <Tabs defaultValue="health-risk" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 lg:grid-cols-5 h-auto">
          <TabsTrigger value="health-risk" className="gap-2 py-2" data-testid="tab-health-risk">
            <HeartPulse className="h-4 w-4" />
            <span className="hidden sm:inline">Health Risk</span>
            <span className="sm:hidden">Risk</span>
          </TabsTrigger>
          <TabsTrigger value="appointment" className="gap-2 py-2" data-testid="tab-appointment">
            <CalendarCheck className="h-4 w-4" />
            <span className="hidden sm:inline">Smart Booking</span>
            <span className="sm:hidden">Booking</span>
          </TabsTrigger>
          <TabsTrigger value="report" className="gap-2 py-2" data-testid="tab-report">
            <FileSearch className="h-4 w-4" />
            <span className="hidden sm:inline">Report Summary</span>
            <span className="sm:hidden">Report</span>
          </TabsTrigger>
          <TabsTrigger value="outbreak" className="gap-2 py-2" data-testid="tab-outbreak">
            <TrendingUp className="h-4 w-4" />
            <span className="hidden sm:inline">Outbreak Predict</span>
            <span className="sm:hidden">Outbreak</span>
          </TabsTrigger>
          <TabsTrigger value="deep-learning" className="gap-2 py-2" data-testid="tab-deep-learning">
            <Network className="h-4 w-4" />
            <span className="hidden sm:inline">Deep Learning</span>
            <span className="sm:hidden">DL</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="health-risk"><HealthRiskTab /></TabsContent>
        <TabsContent value="appointment"><AppointmentRecommendTab /></TabsContent>
        <TabsContent value="report"><ReportSummarizerTab /></TabsContent>
        <TabsContent value="outbreak"><OutbreakPredictionTab /></TabsContent>
        <TabsContent value="deep-learning"><DeepLearningTab /></TabsContent>
      </Tabs>

      <p className="text-xs text-muted-foreground text-center">
        ML predictions are for educational purposes only and do not replace professional medical advice.
        Always consult a qualified healthcare provider.
      </p>
    </div>
  );
}
