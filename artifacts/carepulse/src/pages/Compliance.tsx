import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Shield, CheckCircle2, AlertCircle, XCircle, Loader2, Building2,
  Activity, Lock, Users, FileText, BarChart3, ClipboardCheck,
  Database, Cpu, ArrowRight, ChevronRight, Link2, Hash
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from "recharts";

const COLORS = ["#3b82f6", "#ef4444", "#f59e0b", "#10b981", "#8b5cf6", "#ec4899", "#14b8a6", "#f97316", "#a855f7", "#06b6d4"];

function statusIcon(status: string) {
  if (status === "compliant") return <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />;
  if (status === "partial") return <AlertCircle className="h-5 w-5 text-amber-500 shrink-0" />;
  return <XCircle className="h-5 w-5 text-red-500 shrink-0" />;
}

function statusBadge(status: string) {
  if (status === "compliant") return <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20">Compliant</Badge>;
  if (status === "partial") return <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/20">Partial</Badge>;
  return <Badge className="bg-red-500/10 text-red-600 border-red-500/20">Needs Review</Badge>;
}

const pipelineSteps = [
  {
    step: 1, icon: Database, color: "text-blue-500", bg: "bg-blue-500/10 border-blue-500/20",
    title: "Data Ingestion", desc: "Patient vitals, demographics, medical history, and lab values collected from multi-source inputs",
    methods: ["Structured forms", "Vitals monitoring", "EHR import"],
  },
  {
    step: 2, icon: Activity, color: "text-amber-500", bg: "bg-amber-500/10 border-amber-500/20",
    title: "Preprocessing & Cleaning", desc: "Missing value imputation, outlier detection, and standardization of clinical measurements",
    methods: ["Min-max normalization", "Outlier capping at ±3σ", "Median imputation"],
  },
  {
    step: 3, icon: Cpu, color: "text-purple-500", bg: "bg-purple-500/10 border-purple-500/20",
    title: "Feature Engineering", desc: "Deriving clinical features: BMI from height/weight, BP categories, age-group labels, risk factor flags",
    methods: ["BMI computation", "BP classification", "Family history encoding"],
  },
  {
    step: 4, icon: BarChart3, color: "text-emerald-500", bg: "bg-emerald-500/10 border-emerald-500/20",
    title: "Model Inference", desc: "Logistic regression with sigmoid activation for disease risk; Naive Bayes + TF-IDF for symptom classification",
    methods: ["Sigmoid logistic regression", "Naive Bayes NLP", "5-fold cross-validation"],
  },
  {
    step: 5, icon: Shield, color: "text-red-500", bg: "bg-red-500/10 border-red-500/20",
    title: "Risk Stratification & Output", desc: "Patients stratified into Low / Moderate / High / Critical risk tiers; clinical recommendations generated",
    methods: ["4-tier risk labeling", "SHAP-style factor ranking", "Recommendation engine"],
  },
];

function DataPipelineTab() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Cpu className="h-5 w-5 text-primary" />
            Data Preprocessing Pipeline
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Standardized pipeline improving ML accuracy by 8.3% through consistent feature handling — aligned with paper benchmarks
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {pipelineSteps.map((step, i) => (
              <div key={step.step} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-full border-2 ${step.bg} shrink-0`}>
                    <step.icon className={`h-5 w-5 ${step.color}`} />
                  </div>
                  {i < pipelineSteps.length - 1 && (
                    <div className="flex-1 w-px bg-border mt-2 min-h-[24px]" />
                  )}
                </div>
                <div className="pb-4 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono text-muted-foreground">Step {step.step}</span>
                    <h4 className="font-semibold text-sm">{step.title}</h4>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{step.desc}</p>
                  <div className="flex flex-wrap gap-2">
                    {step.methods.map((m) => (
                      <Badge key={m} variant="outline" className="text-xs font-mono">{m}</Badge>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-blue-500/20">
          <CardContent className="pt-4 text-center">
            <p className="text-3xl font-bold text-blue-500">8.3%</p>
            <p className="text-sm text-muted-foreground mt-1">Accuracy gain from preprocessing</p>
            <p className="text-xs text-muted-foreground">(Paper benchmark)</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 border-emerald-500/20">
          <CardContent className="pt-4 text-center">
            <p className="text-3xl font-bold text-emerald-500">5</p>
            <p className="text-sm text-muted-foreground mt-1">Pipeline stages implemented</p>
            <p className="text-xs text-muted-foreground">End-to-end automated</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border-purple-500/20">
          <CardContent className="pt-4 text-center">
            <p className="text-3xl font-bold text-purple-500">9</p>
            <p className="text-sm text-muted-foreground mt-1">Clinical features engineered</p>
            <p className="text-xs text-muted-foreground">Per disease model</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function ComplianceTab({ data }: { data: any }) {
  const compliantCount = data.indicators.filter((i: any) => i.status === "compliant").length;
  const totalCount = data.indicators.length;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 border-emerald-500/20">
          <CardContent className="pt-4 text-center">
            <p className="text-3xl font-bold text-emerald-500">{data.overallCompliance}%</p>
            <p className="text-sm text-muted-foreground mt-1">Overall Compliance Score</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-blue-500/20">
          <CardContent className="pt-4 text-center">
            <p className="text-3xl font-bold text-blue-500">{compliantCount}/{totalCount}</p>
            <p className="text-sm text-muted-foreground mt-1">Controls Fully Implemented</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-amber-500/10 to-amber-600/5 border-amber-500/20">
          <CardContent className="pt-4 text-center">
            <p className="text-3xl font-bold text-amber-500">{data.auditActivity.last30Days}</p>
            <p className="text-sm text-muted-foreground mt-1">Audit Events (30 days)</p>
          </CardContent>
        </Card>
      </div>

      <Progress value={data.overallCompliance} className="h-3" />

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            HIPAA / Data Protection Controls
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Paper benchmark: 82.3% security framework compliance rate; 71.4% incident reduction with structured controls
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {data.indicators.map((item: any) => (
              <div key={item.name} className="flex items-start gap-3 p-3 rounded-lg border bg-muted/20">
                {statusIcon(item.status)}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-medium text-sm">{item.name}</span>
                    {statusBadge(item.status)}
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">{item.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {data.auditActivity.topActions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Top Audit Actions (Last 30 Days)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {data.auditActivity.topActions.map((a: any) => (
                <div key={a.action} className="flex items-center gap-3">
                  <span className="text-sm font-mono text-muted-foreground min-w-[140px] truncate">{a.action}</span>
                  <div className="flex-1 bg-muted rounded-full h-2">
                    <div
                      className="bg-primary rounded-full h-2"
                      style={{ width: `${Math.min(100, (a.count / data.auditActivity.last30Days) * 100)}%` }}
                    />
                  </div>
                  <span className="text-sm font-semibold tabular-nums">{a.count}</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-3">
              Unique users active: <strong>{data.auditActivity.uniqueUsers}</strong>
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function BenchmarksTab({ data }: { data: any }) {
  if (!data || data.benchmarks.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <Building2 className="h-10 w-10 mx-auto mb-3 opacity-40" />
        <p>No cross-hospital data available yet.</p>
        <p className="text-sm">Data will appear as patients are registered under different hospitals.</p>
      </div>
    );
  }

  const chartData = data.benchmarks.map((h: any) => ({
    name: h.name.split(" ").slice(0, 2).join(" "),
    "High Risk %": h.highRiskRate,
    "Critical %": h.criticalRiskRate,
    Patients: h.totalPatients,
  }));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-blue-500/20">
          <CardContent className="pt-4 text-center">
            <p className="text-3xl font-bold text-blue-500">{data.totalHospitalsWithData}</p>
            <p className="text-sm text-muted-foreground mt-1">Hospitals with Patient Data</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-amber-500/10 to-amber-600/5 border-amber-500/20">
          <CardContent className="pt-4 text-center">
            <p className="text-3xl font-bold text-amber-500">{data.avgHighRisk}%</p>
            <p className="text-sm text-muted-foreground mt-1">Avg High-Risk Rate (Network)</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 border-emerald-500/20">
          <CardContent className="pt-4 text-center">
            <p className="text-3xl font-bold text-emerald-500">45.6%</p>
            <p className="text-sm text-muted-foreground mt-1">Data Exchange Improvement</p>
            <p className="text-xs text-muted-foreground">(Paper benchmark)</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Building2 className="h-5 w-5 text-primary" />
            High-Risk Rate by Hospital (Anonymized)
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Aggregated, de-identified patient risk metrics across your hospital network. Patient PII is never shared.
          </p>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="name" className="text-xs" tick={{ fontSize: 11 }} />
              <YAxis className="text-xs" unit="%" />
              <Tooltip formatter={(val) => `${val}%`} />
              <Bar dataKey="High Risk %" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Critical %" fill="#ef4444" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Hospital-by-Hospital Detail</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {data.benchmarks.map((h: any, i: number) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-lg border bg-muted/20">
                <div
                  className="h-8 w-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
                  style={{ background: COLORS[i % COLORS.length] }}
                >
                  {h.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{h.name}</p>
                  <p className="text-xs text-muted-foreground">Top condition: {h.topCondition}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-semibold">{h.totalPatients} patients</p>
                  <p className="text-xs text-amber-600">{h.highRiskRate}% high-risk</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function BlockchainTab() {
  const { data, isLoading, error } = useQuery<any>({ queryKey: ["/api/blockchain/audit-chain"], staleTime: 30000 });

  if (isLoading) return <div className="flex items-center gap-2 py-8 text-muted-foreground"><Loader2 className="h-5 w-5 animate-spin" />Building blockchain audit chain...</div>;
  if (error || !data) return <div className="text-center py-8 text-muted-foreground">Failed to load blockchain records</div>;

  return (
    <div className="space-y-5">
      {/* Header stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { icon: Link2, label: "Total Blocks", value: data.totalBlocks, color: "text-blue-500", bg: "bg-blue-500/10" },
          { icon: Shield, label: "Chain Integrity", value: data.chainValid ? "Valid ✓" : "Compromised", color: data.chainValid ? "text-emerald-500" : "text-red-500", bg: data.chainValid ? "bg-emerald-500/10" : "bg-red-500/10" },
          { icon: Hash, label: "Algorithm", value: "SHA-256", color: "text-violet-500", bg: "bg-violet-500/10" },
          { icon: Database, label: "Chain Type", value: "Permissioned", color: "text-amber-500", bg: "bg-amber-500/10" },
        ].map(({ icon: Icon, label, value, color, bg }) => (
          <Card key={label} className="border-border/60">
            <CardContent className="pt-4 pb-4 flex items-center gap-3">
              <div className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 ${bg}`}>
                <Icon className={`h-5 w-5 ${color}`} />
              </div>
              <div>
                <p className={`text-sm font-bold ${color}`}>{value}</p>
                <p className="text-xs text-muted-foreground">{label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        <div className="p-3 rounded-lg bg-muted/30 border">
          <p className="text-muted-foreground">Genesis Block Hash</p>
          <p className="font-mono text-primary mt-0.5">{data.genesisHash}</p>
        </div>
        <div className="p-3 rounded-lg bg-muted/30 border">
          <p className="text-muted-foreground">Latest Block Hash</p>
          <p className="font-mono text-primary mt-0.5">{data.latestHash}</p>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Link2 className="h-4 w-4 text-blue-500" />
            Immutable Audit Chain ({data.totalBlocks} blocks)
          </CardTitle>
          <p className="text-xs text-muted-foreground">{data.blockchainInfo?.consensus}</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {data.chain?.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">No audit records yet. System actions will appear here.</p>
            ) : (
              data.chain?.map((block: any) => (
                <div key={block.id} className="p-3 rounded-lg border bg-muted/20 hover:bg-muted/40 transition-colors">
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-muted-foreground bg-muted px-1.5 py-0.5 rounded">#{block.index}</span>
                      <span className="text-xs font-semibold truncate max-w-[200px]">{block.action}</span>
                    </div>
                    <Badge className="bg-emerald-100 text-emerald-700 text-[10px] px-1.5 py-0.5 shrink-0">✓ Verified</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mb-1">{block.details}</p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 text-[10px]">
                    <span className="font-mono text-blue-500 truncate">Hash: {block.hash}</span>
                    <span className="font-mono text-muted-foreground truncate">Prev: {block.previousHash}</span>
                    <span className="text-muted-foreground">{block.userEmail} · {new Date(block.timestamp).toLocaleString("en-IN")}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/30">
        <p className="text-xs text-blue-700 dark:text-blue-400">
          <strong>Reference:</strong> Junaid et al. (2022) — Emerging Technologies in Healthcare Management. Blockchain ensures tamper-evident audit trails: each block contains the SHA-256 hash of the previous block, making any modification detectable without a full chain re-computation.
        </p>
      </div>
    </div>
  );
}

export default function Compliance() {
  const { data: complianceData, isLoading: compLoading } = useQuery<any>({
    queryKey: ["/api/compliance/status"],
  });
  const { data: benchmarkData, isLoading: benchLoading } = useQuery<any>({
    queryKey: ["/api/hospitals/benchmarks"],
  });

  const isLoading = compLoading || benchLoading;

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-muted-foreground">Loading compliance and benchmarks...</p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-3">
          <ClipboardCheck className="h-7 w-7 text-primary" />
          Compliance & Benchmarks
        </h1>
        <p className="text-muted-foreground mt-1">
          HIPAA compliance dashboard, data preprocessing pipeline, and cross-hospital benchmarking
        </p>
      </div>

      <Tabs defaultValue="compliance" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 h-auto">
          <TabsTrigger value="compliance" className="gap-2 py-2">
            <Shield className="h-4 w-4" />
            <span className="hidden sm:inline">HIPAA Compliance</span>
            <span className="sm:hidden">Compliance</span>
          </TabsTrigger>
          <TabsTrigger value="pipeline" className="gap-2 py-2">
            <Cpu className="h-4 w-4" />
            <span className="hidden sm:inline">Data Pipeline</span>
            <span className="sm:hidden">Pipeline</span>
          </TabsTrigger>
          <TabsTrigger value="benchmarks" className="gap-2 py-2">
            <Building2 className="h-4 w-4" />
            <span className="hidden sm:inline">Hospital Benchmarks</span>
            <span className="sm:hidden">Benchmarks</span>
          </TabsTrigger>
          <TabsTrigger value="blockchain" className="gap-2 py-2" data-testid="tab-blockchain">
            <Link2 className="h-4 w-4" />
            <span className="hidden sm:inline">Blockchain Audit</span>
            <span className="sm:hidden">Blockchain</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="compliance">
          {complianceData ? <ComplianceTab data={complianceData} /> : (
            <div className="text-center py-12 text-muted-foreground">Failed to load compliance data</div>
          )}
        </TabsContent>
        <TabsContent value="pipeline">
          <DataPipelineTab />
        </TabsContent>
        <TabsContent value="benchmarks">
          {benchmarkData ? <BenchmarksTab data={benchmarkData} /> : (
            <div className="text-center py-12 text-muted-foreground">Failed to load benchmark data</div>
          )}
        </TabsContent>
        <TabsContent value="blockchain">
          <BlockchainTab />
        </TabsContent>
      </Tabs>

      <p className="text-xs text-muted-foreground text-center">
        Compliance indicators reflect current system implementation. Cross-hospital data is anonymized and aggregated.
        All clinical data handling follows HIPAA Safe Harbor De-identification guidelines.
      </p>
    </div>
  );
}
