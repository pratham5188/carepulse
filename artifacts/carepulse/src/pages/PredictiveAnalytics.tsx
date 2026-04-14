import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Brain, Activity, Users, Shield, TrendingUp, TrendingDown, Minus,
  AlertTriangle, HeartPulse, Loader2, Database, Cpu, BarChart3,
  Stethoscope, BedDouble, ChevronRight, Zap, Target, Layers, FlaskConical, Scale
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from "recharts";

const COLORS = ["#3b82f6", "#ef4444", "#f59e0b", "#10b981", "#8b5cf6", "#ec4899"];

function riskColor(level: string) {
  if (level === "Critical") return "text-red-500";
  if (level === "High") return "text-orange-500";
  if (level === "Moderate") return "text-amber-500";
  return "text-emerald-500";
}

function riskBadge(level: string): "destructive" | "secondary" | "outline" | "default" {
  if (level === "Critical" || level === "High") return "destructive";
  if (level === "Moderate") return "secondary";
  return "outline";
}

function OverviewTab({ data }: { data: any }) {
  const ageData = Object.entries(data.populationAnalysis.ageDistribution).map(([name, value]) => ({ name, value }));
  const condData = Object.entries(data.populationAnalysis.conditionDistribution).map(([name, value]) => ({ name, value }));
  const riskData = Object.entries(data.populationAnalysis.riskDistribution).map(([name, value]) => ({ name, value }));
  const genderData = Object.entries(data.populationAnalysis.genderDistribution).map(([name, value]) => ({ name, value }));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-blue-500/20">
          <CardContent className="pt-4 pb-3 text-center">
            <Users className="h-6 w-6 mx-auto mb-1 text-blue-500" />
            <p className="text-2xl font-bold" data-testid="stat-total-patients">{data.summary.totalPatients}</p>
            <p className="text-xs text-muted-foreground">Total Patients</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-amber-500/10 to-amber-600/5 border-amber-500/20">
          <CardContent className="pt-4 pb-3 text-center">
            <Activity className="h-6 w-6 mx-auto mb-1 text-amber-500" />
            <p className="text-2xl font-bold">{data.summary.averageAge}</p>
            <p className="text-xs text-muted-foreground">Average Age</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-red-500/10 to-red-600/5 border-red-500/20">
          <CardContent className="pt-4 pb-3 text-center">
            <AlertTriangle className="h-6 w-6 mx-auto mb-1 text-red-500" />
            <p className="text-2xl font-bold" data-testid="stat-high-risk">{data.summary.highRiskCount}</p>
            <p className="text-xs text-muted-foreground">High Risk</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-orange-500/10 to-orange-600/5 border-orange-500/20">
          <CardContent className="pt-4 pb-3 text-center">
            <Zap className="h-6 w-6 mx-auto mb-1 text-orange-500" />
            <p className="text-2xl font-bold">{data.summary.criticalInterventionCount}</p>
            <p className="text-xs text-muted-foreground">Need Intervention</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border-purple-500/20">
          <CardContent className="pt-4 pb-3 text-center">
            <Target className="h-6 w-6 mx-auto mb-1 text-purple-500" />
            <p className="text-2xl font-bold">{data.summary.diseasesTracked}</p>
            <p className="text-xs text-muted-foreground">Diseases Tracked</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle className="text-base">Age Distribution</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={ageData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="name" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip />
                <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Risk Distribution</CardTitle></CardHeader>
          <CardContent className="flex justify-center">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={riskData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                  {riskData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Condition Distribution</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={condData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis type="number" className="text-xs" />
                <YAxis dataKey="name" type="category" className="text-xs" width={90} />
                <Tooltip />
                <Bar dataKey="value" fill="#f59e0b" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Gender Distribution</CardTitle></CardHeader>
          <CardContent className="flex justify-center">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={genderData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                  {genderData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function PatientRiskTab({ data }: { data: any }) {
  return (
    <div className="space-y-4" data-testid="patient-risk-section">
      {data.patientAnalytics.map((patient: any) => (
        <Card key={patient.id}>
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-4">
              <div>
                <h4 className="font-semibold text-lg" data-testid={`patient-name-${patient.id}`}>{patient.name}</h4>
                <p className="text-sm text-muted-foreground">
                  {patient.age}y, {patient.gender} — {patient.condition}
                </p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {patient.medicalHistory.map((h: string, i: number) => (
                    <Badge key={i} variant="outline" className="text-xs">{h}</Badge>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={riskBadge(patient.riskAssessment.riskCategory)} className="text-sm px-3" data-testid={`patient-risk-${patient.id}`}>
                  {patient.riskAssessment.riskCategory}
                </Badge>
                <span className={`text-lg font-bold ${riskColor(patient.riskAssessment.riskCategory)}`}>
                  {patient.riskAssessment.overallRisk}%
                </span>
              </div>
            </div>

            {patient.vitals && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                <div className="bg-muted/50 rounded-lg p-2 text-center">
                  <p className="text-xs text-muted-foreground">Heart Rate</p>
                  <p className="font-semibold">{patient.vitals.heartRate ?? "—"} bpm</p>
                </div>
                <div className="bg-muted/50 rounded-lg p-2 text-center">
                  <p className="text-xs text-muted-foreground">Blood Pressure</p>
                  <p className="font-semibold">{patient.vitals.bloodPressure ?? "—"}</p>
                </div>
                <div className="bg-muted/50 rounded-lg p-2 text-center">
                  <p className="text-xs text-muted-foreground">O2 Level</p>
                  <p className="font-semibold">{patient.vitals.oxygenLevel ?? "—"}%</p>
                </div>
                <div className="bg-muted/50 rounded-lg p-2 text-center">
                  <p className="text-xs text-muted-foreground">Temperature</p>
                  <p className="font-semibold">{patient.vitals.temperature ? `${patient.vitals.temperature.toFixed(1)}°` : "—"}</p>
                </div>
              </div>
            )}

            <div className="grid grid-cols-3 gap-3 mb-4">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Mortality Risk</p>
                <Progress value={patient.riskAssessment.mortalityRisk} className="h-2" />
                <p className="text-xs mt-1 font-medium">{patient.riskAssessment.mortalityRisk}%</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Readmission Risk</p>
                <Progress value={patient.riskAssessment.readmissionRisk} className="h-2" />
                <p className="text-xs mt-1 font-medium">{patient.riskAssessment.readmissionRisk}%</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Complication Risk</p>
                <Progress value={patient.riskAssessment.complicationRisk} className="h-2" />
                <p className="text-xs mt-1 font-medium">{patient.riskAssessment.complicationRisk}%</p>
              </div>
            </div>

            <div className="flex items-center gap-2 mb-2">
              <Stethoscope className="h-4 w-4 text-blue-500" />
              <p className="text-sm font-medium">Urgency: {patient.riskAssessment.interventionUrgency}</p>
            </div>
            <p className="text-sm text-muted-foreground mb-3">{patient.riskAssessment.projectedOutcome}</p>

            {patient.diseasePredictions.length > 0 && (
              <div className="mb-3">
                <p className="text-sm font-medium mb-2">Disease Predictions (ML):</p>
                <div className="flex flex-wrap gap-2">
                  {patient.diseasePredictions.map((pred: any, i: number) => (
                    <div key={i} className="bg-muted/50 rounded-lg px-3 py-1.5 text-sm border">
                      <span className="font-medium">{pred.condition}</span>
                      <span className="text-muted-foreground ml-2">{pred.probability}%</span>
                      <Badge variant="outline" className="ml-2 text-xs">{pred.confidence}</Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {patient.riskAssessment.recommendations.length > 0 && (
              <div>
                <p className="text-sm font-medium mb-1">Recommendations:</p>
                <ul className="space-y-1">
                  {patient.riskAssessment.recommendations.slice(0, 4).map((r: string, i: number) => (
                    <li key={i} className="text-sm flex items-start gap-2">
                      <ChevronRight className="h-3.5 w-3.5 mt-0.5 text-primary shrink-0" />
                      <span className="text-muted-foreground">{r}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function ClinicalDecisionTab({ data }: { data: any }) {
  const cds = data.clinicalDecisionSupport;

  return (
    <div className="space-y-6" data-testid="clinical-decision-section">
      <Card className="border-red-500/30 bg-red-500/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base text-red-500">
            <AlertTriangle className="h-5 w-5" />
            Critical Interventions Required ({cds.criticalInterventions.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {cds.criticalInterventions.length === 0 ? (
            <p className="text-sm text-muted-foreground">No patients require immediate intervention at this time.</p>
          ) : (
            <div className="space-y-4">
              {cds.criticalInterventions.map((p: any, i: number) => (
                <div key={i} className="p-3 rounded-lg border border-red-500/20 bg-background">
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-semibold">{p.name}</p>
                    <Badge variant="destructive">IMMEDIATE</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{p.reason}</p>
                  <ul className="space-y-1">
                    {p.actions.map((a: string, j: number) => (
                      <li key={j} className="text-sm flex items-start gap-2">
                        <Zap className="h-3.5 w-3.5 mt-0.5 text-red-500 shrink-0" />
                        <span>{a}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Shield className="h-5 w-5 text-orange-500" />
            High-Risk Patients ({cds.highRiskPatients.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {cds.highRiskPatients.length === 0 ? (
            <p className="text-sm text-muted-foreground">No high-risk patients identified.</p>
          ) : (
            <div className="space-y-3">
              {cds.highRiskPatients.map((p: any, i: number) => (
                <div key={i} className="flex items-start justify-between p-3 rounded-lg bg-muted/50 border">
                  <div>
                    <p className="font-semibold">{p.name}</p>
                    <p className="text-sm text-muted-foreground">Urgency: {p.urgency}</p>
                    <ul className="mt-1 space-y-0.5">
                      {p.topRecommendations.map((r: string, j: number) => (
                        <li key={j} className="text-xs text-muted-foreground flex items-start gap-1">
                          <ChevronRight className="h-3 w-3 mt-0.5 shrink-0" />
                          <span>{r}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="text-right">
                    <Badge variant={riskBadge(p.riskCategory)}>{p.riskCategory}</Badge>
                    <p className="text-sm mt-1 font-medium">Mortality: {p.mortalityRisk}%</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function ResourceTab({ data }: { data: any }) {
  const res = data.resourceOptimization;
  const outbreaks = data.outbreakPredictions;

  return (
    <div className="space-y-6" data-testid="resource-section">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4 pb-3 text-center">
            <BedDouble className="h-6 w-6 mx-auto mb-1 text-blue-500" />
            <p className="text-2xl font-bold">{res.totalBedCapacity.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">Total Bed Capacity</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-3 text-center">
            <HeartPulse className="h-6 w-6 mx-auto mb-1 text-red-500" />
            <p className="text-2xl font-bold">{res.totalICUCapacity.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">ICU Capacity</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-3 text-center">
            <Activity className="h-6 w-6 mx-auto mb-1 text-amber-500" />
            <p className="text-2xl font-bold">{res.currentOccupancyRate}%</p>
            <p className="text-xs text-muted-foreground">Occupancy Rate</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-3 text-center">
            <TrendingUp className="h-6 w-6 mx-auto mb-1 text-purple-500" />
            <p className="text-2xl font-bold">{res.projectedBedNeed.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">Projected Bed Need</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">Resource Recommendations</CardTitle></CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {res.recommendations.map((r: string, i: number) => (
              <li key={i} className="flex items-start gap-2 text-sm">
                <ChevronRight className="h-4 w-4 mt-0.5 text-primary shrink-0" />
                <span>{r}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">Disease Outbreak Forecasting</CardTitle></CardHeader>
        <CardContent>
          {outbreaks.length === 0 ? (
            <p className="text-sm text-muted-foreground">No outbreak data available.</p>
          ) : (
            <div className="space-y-3">
              {outbreaks.map((ob: any, i: number) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-muted/50 border">
                  <div className="flex items-center gap-3">
                    {ob.trend === "rising" ? <TrendingUp className="h-5 w-5 text-red-500" /> : ob.trend === "falling" ? <TrendingDown className="h-5 w-5 text-emerald-500" /> : <Minus className="h-5 w-5 text-amber-500" />}
                    <div>
                      <p className="font-semibold">{ob.disease}</p>
                      <p className="text-xs text-muted-foreground">{ob.locations.join(", ")}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">{ob.currentCases.toLocaleString()} cases</p>
                    <p className={`text-xs ${ob.growthRate > 0 ? "text-red-500" : ob.growthRate < 0 ? "text-emerald-500" : "text-muted-foreground"}`}>
                      {ob.growthRate > 0 ? "+" : ""}{ob.growthRate}% growth
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function PreprocessingTab({ data }: { data: any }) {
  const dp = data.dataPreprocessing;
  const mi = data.modelInfo;

  return (
    <div className="space-y-6" data-testid="preprocessing-section">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Database className="h-5 w-5 text-blue-500" />
            Data Preprocessing Pipeline
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-muted/50 rounded-lg p-3 text-center border">
              <p className="text-2xl font-bold text-primary">{dp.totalRecords}</p>
              <p className="text-xs text-muted-foreground">Total Records</p>
            </div>
            <div className="bg-muted/50 rounded-lg p-3 text-center border">
              <p className="text-2xl font-bold text-blue-500">{dp.featuresExtracted.length}</p>
              <p className="text-xs text-muted-foreground">Features Extracted</p>
            </div>
            <div className="bg-muted/50 rounded-lg p-3 text-center border">
              <p className="text-2xl font-bold text-amber-500">{dp.missingDataHandled}</p>
              <p className="text-xs text-muted-foreground">Missing Data Handled</p>
            </div>
            <div className="bg-muted/50 rounded-lg p-3 text-center border">
              <p className="text-2xl font-bold text-emerald-500">{dp.dataQualityScore}%</p>
              <p className="text-xs text-muted-foreground">Data Quality Score</p>
            </div>
          </div>

          <div className="mb-4">
            <p className="text-sm font-medium mb-2">Features Extracted:</p>
            <div className="flex flex-wrap gap-2">
              {dp.featuresExtracted.map((f: string, i: number) => (
                <Badge key={i} variant="secondary">{f}</Badge>
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm font-medium mb-2">Normalization Techniques:</p>
            <ul className="space-y-1">
              {dp.normalizationApplied.map((n: string, i: number) => (
                <li key={i} className="text-sm flex items-start gap-2">
                  <Layers className="h-3.5 w-3.5 mt-0.5 text-blue-500 shrink-0" />
                  <span className="text-muted-foreground">{n}</span>
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>

    </div>
  );
}

function ModelIntelligenceTab() {
  const [selectedDisease, setSelectedDisease] = useState("Type 2 Diabetes");

  const { data: metrics, isLoading: metricsLoading } = useQuery<any>({
    queryKey: ["/api/ml/model-metrics"],
  });
  const { data: importanceData, isLoading: importanceLoading } = useQuery<any>({
    queryKey: ["/api/ml/feature-importance"],
  });
  const { data: biasData, isLoading: biasLoading } = useQuery<any>({
    queryKey: ["/api/ml/bias-report"],
  });

  const diseases = importanceData ? importanceData.map((d: any) => d.disease) : [];
  const selectedImportance = importanceData?.find((d: any) => d.disease === selectedDisease);

  if (metricsLoading || importanceLoading || biasLoading) {
    return (
      <div className="flex items-center justify-center py-12 gap-3">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
        <p className="text-muted-foreground text-sm">Loading model intelligence data...</p>
      </div>
    );
  }

  const radarData = metrics ? [
    { metric: "Accuracy", model: metrics.accuracy, paper: metrics.paperBenchmarks.accuracy },
    { metric: "Precision", model: metrics.precision, paper: metrics.paperBenchmarks.precision },
    { metric: "Recall", model: metrics.recall, paper: metrics.paperBenchmarks.recall },
    { metric: "F1 Score", model: metrics.f1Score, paper: metrics.paperBenchmarks.f1Score },
    { metric: "AUC", model: metrics.auc, paper: metrics.paperBenchmarks.auc },
  ] : [];

  return (
    <div className="space-y-8">
      {/* Model Validation */}
      {metrics && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <FlaskConical className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-base">Model Validation (5-Fold Cross-Validation)</h3>
          </div>
          <p className="text-sm text-muted-foreground -mt-2">
            Validated against {metrics.trainingSamples} clinical training samples across {metrics.validationMethod}
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {[
              { label: "Accuracy", val: metrics.accuracy, paper: metrics.paperBenchmarks.accuracy, color: "text-blue-500" },
              { label: "Precision", val: metrics.precision, paper: metrics.paperBenchmarks.precision, color: "text-purple-500" },
              { label: "Recall", val: metrics.recall, paper: metrics.paperBenchmarks.recall, color: "text-amber-500" },
              { label: "F1 Score", val: metrics.f1Score, paper: metrics.paperBenchmarks.f1Score, color: "text-emerald-500" },
              { label: "AUC", val: metrics.auc, paper: metrics.paperBenchmarks.auc, color: "text-red-500" },
            ].map(m => (
              <Card key={m.label} className="text-center">
                <CardContent className="pt-4 pb-3">
                  <p className={`text-2xl font-bold ${m.color}`}>{m.val}%</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{m.label}</p>
                  <div className="mt-1 pt-1 border-t">
                    <p className="text-xs text-muted-foreground">Paper: <span className="font-semibold">{m.paper}%</span></p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader><CardTitle className="text-sm">Model vs. Paper Benchmark</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={220}>
                  <RadarChart data={radarData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="metric" tick={{ fontSize: 11 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 10 }} />
                    <Radar name="CarePulse Model" dataKey="model" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
                    <Radar name="Paper Benchmark" dataKey="paper" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.2} />
                    <Legend />
                    <Tooltip formatter={(v) => `${v}%`} />
                  </RadarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle className="text-sm">Confusion Matrix</CardTitle></CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3 mt-2">
                  {[
                    { label: "True Positive", val: metrics.confusionMatrix.tp, color: "bg-emerald-500/10 border-emerald-500/20 text-emerald-600" },
                    { label: "False Positive", val: metrics.confusionMatrix.fp, color: "bg-amber-500/10 border-amber-500/20 text-amber-600" },
                    { label: "False Negative", val: metrics.confusionMatrix.fn, color: "bg-orange-500/10 border-orange-500/20 text-orange-600" },
                    { label: "True Negative", val: metrics.confusionMatrix.tn, color: "bg-blue-500/10 border-blue-500/20 text-blue-600" },
                  ].map(c => (
                    <div key={c.label} className={`p-3 rounded-lg border text-center ${c.color}`}>
                      <p className="text-2xl font-bold">{c.val}</p>
                      <p className="text-xs mt-0.5">{c.label}</p>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-3 text-center">
                  Architecture: {metrics.architecture}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Explainable AI */}
      {importanceData && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Brain className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-base">Explainable AI — Feature Importance</h3>
          </div>
          <p className="text-sm text-muted-foreground -mt-2">
            Model weights showing which clinical factors most influence each disease prediction (paper: 83.4% clinician trust improvement)
          </p>
          <div className="flex flex-wrap gap-2">
            {diseases.map((d: string) => (
              <button
                key={d}
                onClick={() => setSelectedDisease(d)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
                  selectedDisease === d
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-muted/30 hover:bg-muted border-border"
                }`}
              >
                {d}
              </button>
            ))}
          </div>
          {selectedImportance && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Feature Weights — {selectedDisease}</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={selectedImportance.features} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis type="number" className="text-xs" tick={{ fontSize: 11 }} />
                    <YAxis dataKey="name" type="category" className="text-xs" width={110} tick={{ fontSize: 11 }} />
                    <Tooltip formatter={(v) => `${v}%`} />
                    <Bar dataKey="weight" radius={[0, 4, 4, 0]}>
                      {selectedImportance.features.map((_: any, i: number) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
                <p className="text-xs text-muted-foreground mt-2 text-center">
                  Weight = relative contribution of each feature to the logistic regression score
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Bias & Fairness */}
      {biasData && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Scale className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-base">Bias Mitigation & Fairness Report</h3>
          </div>
          <p className="text-sm text-muted-foreground -mt-2">
            Demographic equity analysis across {biasData.totalPatients} patients — paper reports 58.4% bias reduction with fairness-aware algorithms
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card className={`border-2 ${biasData.equityStatus === "Equitable" ? "border-emerald-500/30" : biasData.equityStatus === "Minor Bias" ? "border-amber-500/30" : "border-red-500/30"}`}>
              <CardContent className="pt-4 text-center">
                <p className={`text-3xl font-bold ${biasData.equityStatus === "Equitable" ? "text-emerald-500" : biasData.equityStatus === "Minor Bias" ? "text-amber-500" : "text-red-500"}`}>
                  {biasData.biasScore}/100
                </p>
                <p className="text-sm text-muted-foreground mt-1">Equity Score</p>
                <Badge className="mt-2" variant={biasData.equityStatus === "Equitable" ? "outline" : "secondary"}>
                  {biasData.equityStatus}
                </Badge>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4 text-center">
                <p className="text-3xl font-bold text-blue-500">{biasData.maxGenderDisparity}%</p>
                <p className="text-sm text-muted-foreground mt-1">Max Gender Disparity</p>
                <p className="text-xs text-muted-foreground">Acceptable threshold: ≤5%</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4 text-center">
                <p className="text-3xl font-bold text-purple-500">{biasData.totalPatients}</p>
                <p className="text-sm text-muted-foreground mt-1">Patients Analyzed</p>
                <p className="text-xs text-muted-foreground">All hospital patients</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader><CardTitle className="text-sm">High-Risk Rate by Gender</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {biasData.genderFairness.map((g: any) => (
                    <div key={g.group}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="capitalize font-medium">{g.group}</span>
                        <span>{g.highRiskRate}% high-risk</span>
                      </div>
                      <Progress value={g.highRiskRate} className="h-2" />
                      <p className="text-xs text-muted-foreground mt-0.5">{g.totalPatients} patients — {g.criticalRiskRate}% critical</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle className="text-sm">High-Risk Rate by Age Group</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={biasData.ageFairness}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="group" className="text-xs" tick={{ fontSize: 11 }} />
                    <YAxis className="text-xs" unit="%" tick={{ fontSize: 11 }} />
                    <Tooltip formatter={(v) => `${v}%`} />
                    <Bar dataKey="highRiskRate" fill="#f59e0b" radius={[4, 4, 0, 0]} name="High Risk %" />
                    <Bar dataKey="criticalRiskRate" fill="#ef4444" radius={[4, 4, 0, 0]} name="Critical %" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}

export default function PredictiveAnalytics() {
  const { data, isLoading, error } = useQuery<any>({
    queryKey: ["/api/predictive-analytics"],
  });

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-muted-foreground">Running predictive analytics on patient data...</p>
        <p className="text-xs text-muted-foreground">Processing ML models, risk assessment, and forecasting</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center">
        <AlertTriangle className="h-10 w-10 mx-auto mb-3 text-destructive" />
        <p className="text-destructive font-medium">Failed to load predictive analytics</p>
        <p className="text-sm text-muted-foreground mt-1">Please try refreshing the page</p>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-3" data-testid="predictive-analytics-title">
          <Brain className="h-7 w-7 text-primary" />
          Predictive Analytics
        </h1>
        <p className="text-muted-foreground mt-1">
          ML-powered patient data analysis, disease prediction, clinical decision support, and resource optimization
        </p>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 lg:grid-cols-5 h-auto">
          <TabsTrigger value="overview" className="gap-1.5 py-2" data-testid="tab-overview">
            <BarChart3 className="h-4 w-4" />
            <span className="hidden sm:inline">Population</span>
          </TabsTrigger>
          <TabsTrigger value="risk" className="gap-1.5 py-2" data-testid="tab-risk">
            <HeartPulse className="h-4 w-4" />
            <span className="hidden sm:inline">Patient Risk</span>
            <span className="sm:hidden">Risk</span>
          </TabsTrigger>
          <TabsTrigger value="clinical" className="gap-1.5 py-2" data-testid="tab-clinical">
            <Shield className="h-4 w-4" />
            <span className="hidden sm:inline">Clinical</span>
          </TabsTrigger>
          <TabsTrigger value="resources" className="gap-1.5 py-2" data-testid="tab-resources">
            <BedDouble className="h-4 w-4" />
            <span className="hidden sm:inline">Resources</span>
          </TabsTrigger>
          <TabsTrigger value="intelligence" className="gap-1.5 py-2" data-testid="tab-intelligence">
            <FlaskConical className="h-4 w-4" />
            <span className="hidden sm:inline">Model AI</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview"><OverviewTab data={data} /></TabsContent>
        <TabsContent value="risk"><PatientRiskTab data={data} /></TabsContent>
        <TabsContent value="clinical"><ClinicalDecisionTab data={data} /></TabsContent>
        <TabsContent value="resources"><ResourceTab data={data} /></TabsContent>
        <TabsContent value="intelligence"><ModelIntelligenceTab /></TabsContent>
      </Tabs>

      <p className="text-xs text-muted-foreground text-center">
        Predictive analytics are generated using machine learning models for educational and decision-support purposes.
        Clinical decisions should always involve qualified healthcare professionals.
      </p>
    </div>
  );
}
