import { useState } from "react";
import { useAnalyticsStats, useAnalyticsTrends, usePatients } from "@/hooks/use-medical-data";
import { useAuth } from "@/hooks/use-auth";
import { StatCard } from "@/components/StatCard";
import { Users, AlertCircle, Activity, Bed, Brain, Shield, AlertTriangle, TrendingUp, TrendingDown, Info, CheckCircle2, Lightbulb } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, Legend } from "recharts";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";

type InsightType = "positive" | "warning" | "critical" | "info";

interface AIInsightData {
  summary: string;
  insights: { title: string; description: string; type: InsightType }[];
  chartData: { label: string; value: number; color: string }[];
  recommendations: string[];
}

const insightTypeConfig: Record<InsightType, { icon: typeof CheckCircle2; bg: string; text: string; border: string }> = {
  positive: { icon: CheckCircle2, bg: "bg-emerald-50 dark:bg-emerald-950/30", text: "text-emerald-700 dark:text-emerald-400", border: "border-emerald-200 dark:border-emerald-800" },
  warning: { icon: AlertTriangle, bg: "bg-amber-50 dark:bg-amber-950/30", text: "text-amber-700 dark:text-amber-400", border: "border-amber-200 dark:border-amber-800" },
  critical: { icon: AlertCircle, bg: "bg-red-50 dark:bg-red-950/30", text: "text-red-700 dark:text-red-400", border: "border-red-200 dark:border-red-800" },
  info: { icon: Info, bg: "bg-blue-50 dark:bg-blue-950/30", text: "text-blue-700 dark:text-blue-400", border: "border-blue-200 dark:border-blue-800" },
};

export default function Dashboard() {
  const { user } = useAuth();
  const { data: stats, isLoading: statsLoading } = useAnalyticsStats();
  const { data: trends, isLoading: trendsLoading } = useAnalyticsTrends();
  const { data: patients } = usePatients();
  const [aiInsight, setAiInsight] = useState<AIInsightData | null>(null);
  const [loadingInsight, setLoadingInsight] = useState(false);

  const hasTrends = trends && trends.length > 0;
  const chartData = hasTrends ? trends : [
    { name: 'Mon', value: 400 },
    { name: 'Tue', value: 300 },
    { name: 'Wed', value: 550 },
    { name: 'Thu', value: 480 },
    { name: 'Fri', value: 650 },
    { name: 'Sat', value: 590 },
    { name: 'Sun', value: 720 },
  ];

  const criticalPatients = patients?.filter((p: any) => p.condition === "Critical") || [];

  const generateAIInsight = async () => {
    setLoadingInsight(true);
    try {
      const summaryData = {
        totalPatients: stats?.totalPatients || 0,
        criticalCases: stats?.criticalPatients || 0,
        activeAlerts: stats?.activeAlerts || 0,
        totalHospitals: stats?.totalHospitals || 0,
        topDiseases: trends?.slice(0, 5).map((t: any) => `${t.diseaseName}: ${t.caseCount} cases`).join(", ") || "No data",
      };

      const res = await fetch("/api/ai/insights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(summaryData),
      });
      if (!res.ok) throw new Error("Failed to generate insights");
      const data = await res.json();
      setAiInsight({
        summary: data.summary || "",
        insights: Array.isArray(data.insights) ? data.insights : [],
        chartData: Array.isArray(data.chartData) ? data.chartData : [],
        recommendations: Array.isArray(data.recommendations) ? data.recommendations : [],
      });
    } catch {
      setAiInsight({
        summary: "Unable to generate AI insights at this time.",
        insights: [{ title: "Error", description: "Please try again later.", type: "warning" }],
        chartData: [],
        recommendations: ["Try generating insights again after a moment."],
      });
    }
    setLoadingInsight(false);
  };

  if (statsLoading) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 space-y-6 lg:space-y-8 animate-pulse">
        <div className="h-8 w-48 bg-muted rounded-lg"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {[1,2,3,4].map(i => <div key={i} className="h-32 bg-muted rounded-2xl"></div>)}
        </div>
        <div className="h-96 bg-muted rounded-2xl"></div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 lg:space-y-8 max-w-7xl mx-auto">
      <header className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-foreground">
            Welcome, {user?.firstName || "User"}
          </h1>
          <p className="text-muted-foreground mt-1 text-sm sm:text-base">
            {user?.role === "admin" ? "System Administration Dashboard" :
             user?.role === "doctor" ? "Clinical Analytics Dashboard" :
             "Health Insights Dashboard"}
          </p>
        </div>
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          <span className={`text-xs font-bold uppercase px-3 py-1 rounded-full ${
            user?.role === "admin" ? "bg-amber-100 text-amber-700" :
            user?.role === "doctor" ? "bg-emerald-100 text-emerald-700" :
            "bg-blue-100 text-blue-700"
          }`}>
            {user?.role || "Patient"}
          </span>
          <div className="text-xs sm:text-sm text-muted-foreground bg-secondary px-3 sm:px-4 py-1.5 sm:py-2 rounded-full font-mono">
            {format(new Date(), "MMM dd, yyyy • HH:mm")}
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <StatCard
            title="Total Patients"
            value={stats?.totalPatients || 0}
            icon={Users}
            color="primary"
            trend={{ value: 12, isPositive: true }}
          />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <StatCard
            title="Critical Cases"
            value={stats?.criticalPatients || 0}
            icon={AlertCircle}
            color="orange"
            trend={{ value: 4, isPositive: false }}
          />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <StatCard
            title="Active Alerts"
            value={stats?.activeAlerts || 0}
            icon={Activity}
            color="purple"
          />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <StatCard
            title="Hospitals"
            value={stats?.totalHospitals || 0}
            icon={Bed}
            color="accent"
          />
        </motion.div>
      </div>

      <div className="grid lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="lg:col-span-2 bg-card border border-border rounded-2xl p-4 sm:p-6 shadow-sm"
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold font-display">Disease Trends</h3>
            <select className="bg-secondary border-none text-sm rounded-lg px-3 py-1 outline-none">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
            </select>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis
                  dataKey={hasTrends ? "diseaseName" : "name"}
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: '8px', border: '1px solid hsl(var(--border))' }}
                  itemStyle={{ color: 'hsl(var(--foreground))' }}
                />
                <Area
                  type="monotone"
                  dataKey={hasTrends ? "caseCount" : "value"}
                  stroke="hsl(var(--primary))"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorValue)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-card border border-border rounded-2xl p-6 shadow-sm"
        >
          <h3 className="text-lg font-bold font-display mb-4 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            Urgent Alerts
          </h3>
          <div className="space-y-3">
            {criticalPatients.length > 0 ? (
              criticalPatients.slice(0, 4).map((p: any, i: number) => (
                <a key={p.id} href={`/patients/${p.id}`} className="flex gap-3 p-3 rounded-xl hover:bg-muted/50 transition-colors border border-transparent hover:border-border cursor-pointer">
                  <div className={`h-10 w-10 rounded-full flex items-center justify-center shrink-0 ${
                    p.riskLevel === "High" ? "bg-red-100" : "bg-amber-100"
                  }`}>
                    <AlertCircle className={`h-5 w-5 ${p.riskLevel === "High" ? "text-red-600 animate-pulse" : "text-amber-600"}`} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{p.name}</p>
                    <p className="text-xs text-muted-foreground">{p.condition} - Risk: {p.riskLevel}</p>
                    <p className="text-xs text-red-500 font-medium mt-0.5">Needs attention</p>
                  </div>
                </a>
              ))
            ) : (
              <div className="text-center py-6">
                <Shield className="h-8 w-8 text-emerald-500 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">No critical patients</p>
              </div>
            )}
          </div>
          {criticalPatients.length > 0 && (
            <a href="/alerts" className="block w-full mt-4 py-2 text-sm font-medium text-primary hover:bg-primary/5 rounded-lg transition-colors text-center">
              View All Alerts
            </a>
          )}
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="bg-gradient-to-r from-primary/5 to-accent/5 border border-primary/20 rounded-2xl p-4 sm:p-6"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <Brain className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold font-display">AI Interpretation Module</h3>
              <p className="text-xs sm:text-sm text-muted-foreground">Powered by Google Gemini — Real-time healthcare analytics</p>
            </div>
          </div>
          <button
            onClick={generateAIInsight}
            disabled={loadingInsight}
            className="px-5 py-2.5 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary/90 disabled:opacity-50 transition-colors shadow-md shadow-primary/20 flex items-center gap-2"
          >
            {loadingInsight ? (
              <>
                <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Analyzing...
              </>
            ) : (
              <>
                <Brain className="h-4 w-4" />
                Generate Insights
              </>
            )}
          </button>
        </div>

        <AnimatePresence mode="wait">
          {loadingInsight && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-3 mt-4 p-4 bg-card/50 rounded-xl"
            >
              <div className="h-6 w-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin"></div>
              <div>
                <p className="text-sm font-medium">AI is analyzing your healthcare data...</p>
                <p className="text-xs text-muted-foreground">This may take a few seconds</p>
              </div>
            </motion.div>
          )}

          {aiInsight && !loadingInsight && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-5 mt-4"
            >
              <div className="bg-card border border-border rounded-xl p-5">
                <h4 className="text-sm font-bold text-primary mb-2 flex items-center gap-2">
                  <Brain className="h-4 w-4" />
                  Executive Summary
                </h4>
                <p className="text-sm text-foreground/80 leading-relaxed">{aiInsight.summary}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {aiInsight.insights.map((insight, i) => {
                  const config = insightTypeConfig[insight.type] || insightTypeConfig.info;
                  const IconComp = config.icon;
                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className={`p-4 rounded-xl border ${config.bg} ${config.border}`}
                    >
                      <div className="flex items-start gap-3">
                        <IconComp className={`h-5 w-5 shrink-0 mt-0.5 ${config.text}`} />
                        <div>
                          <p className={`text-sm font-bold ${config.text}`}>{insight.title}</p>
                          <p className="text-xs text-foreground/70 mt-1">{insight.description}</p>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {aiInsight.chartData.length > 0 && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div className="bg-card border border-border rounded-xl p-5">
                    <h4 className="text-sm font-bold mb-4 flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-primary" />
                      Healthcare Distribution
                    </h4>
                    <div className="h-[220px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={aiInsight.chartData}
                            cx="50%"
                            cy="50%"
                            innerRadius={50}
                            outerRadius={80}
                            paddingAngle={4}
                            dataKey="value"
                            nameKey="label"
                          >
                            {aiInsight.chartData.map((entry, index) => (
                              <Cell key={index} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip
                            contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: '8px', border: '1px solid hsl(var(--border))', fontSize: '12px' }}
                          />
                          <Legend
                            formatter={(value) => <span className="text-xs text-foreground">{value}</span>}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div className="bg-card border border-border rounded-xl p-5">
                    <h4 className="text-sm font-bold mb-4 flex items-center gap-2">
                      <Activity className="h-4 w-4 text-primary" />
                      Metrics Breakdown
                    </h4>
                    <div className="h-[220px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={aiInsight.chartData} barSize={30}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                          <XAxis
                            dataKey="label"
                            fontSize={10}
                            tickLine={false}
                            axisLine={false}
                            stroke="hsl(var(--muted-foreground))"
                          />
                          <YAxis
                            fontSize={10}
                            tickLine={false}
                            axisLine={false}
                            stroke="hsl(var(--muted-foreground))"
                          />
                          <Tooltip
                            contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: '8px', border: '1px solid hsl(var(--border))', fontSize: '12px' }}
                          />
                          <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                            {aiInsight.chartData.map((entry, index) => (
                              <Cell key={index} fill={entry.color} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              )}

              {aiInsight.recommendations.length > 0 && (
                <div className="bg-card border border-border rounded-xl p-5">
                  <h4 className="text-sm font-bold text-primary mb-3 flex items-center gap-2">
                    <Lightbulb className="h-4 w-4" />
                    AI Recommendations
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {aiInsight.recommendations.map((rec, i) => (
                      <div key={i} className="flex items-start gap-2 p-3 bg-primary/5 rounded-lg">
                        <span className="text-primary font-bold text-xs mt-0.5">{i + 1}.</span>
                        <p className="text-xs text-foreground/80">{rec}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-3 border-t border-border/50">
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Shield className="h-3 w-3" />
                  AI-generated analysis for educational purposes only. Does not substitute professional medical judgment.
                </p>
              </div>
            </motion.div>
          )}

          {!aiInsight && !loadingInsight && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-sm text-muted-foreground mt-2"
            >
              Click "Generate Insights" to get AI-powered analysis of your dashboard data with interactive charts and actionable recommendations.
            </motion.p>
          )}
        </AnimatePresence>
      </motion.div>

      <div className="p-3 bg-muted/50 rounded-xl border border-border">
        <p className="text-xs text-center text-muted-foreground">
          <Shield className="h-3 w-3 inline mr-1" />
          All patient data is anonymized and processed in compliance with healthcare data privacy standards. This platform is for educational and analytical purposes only.
        </p>
      </div>
    </div>
  );
}
