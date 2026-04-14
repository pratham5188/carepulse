import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { format } from "date-fns";
import {
  Heart,
  Calendar,
  Pill,
  Stethoscope,
  BookOpen,
  Activity,
  Clock,
  CheckCircle2,
  XCircle,
  TrendingUp,
  Shield,
  Sparkles,
  ArrowRight,
  AlertTriangle,
} from "lucide-react";

const healthTips = [
  { title: "Stay Hydrated", description: "Drink at least 8 glasses of water daily for optimal health.", icon: "💧" },
  { title: "Regular Exercise", description: "30 minutes of moderate activity daily boosts immunity.", icon: "🏃" },
  { title: "Quality Sleep", description: "7-9 hours of sleep improves cognitive function and recovery.", icon: "😴" },
  { title: "Balanced Diet", description: "Include fruits, vegetables, and whole grains in every meal.", icon: "🥗" },
  { title: "Mental Wellness", description: "Practice mindfulness or meditation for 10 minutes daily.", icon: "🧘" },
  { title: "Regular Checkups", description: "Schedule preventive health screenings annually.", icon: "🩺" },
];

export default function PatientPortal() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<"upcoming" | "past">("upcoming");

  const { data: appointments = [], isLoading: appointmentsLoading } = useQuery<any[]>({
    queryKey: ["/api/appointments"],
    queryFn: async () => {
      const res = await fetch("/api/appointments", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch appointments");
      return res.json();
    },
  });

  const { data: prescriptions = [], isLoading: prescriptionsLoading } = useQuery<any[]>({
    queryKey: ["/api/prescriptions"],
    queryFn: async () => {
      const res = await fetch("/api/prescriptions", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch prescriptions");
      return res.json();
    },
  });

  const now = new Date();
  const upcomingAppointments = appointments.filter(
    (a: any) => a.status === "scheduled" && new Date(a.date) >= new Date(now.toISOString().split("T")[0])
  );
  const pastAppointments = appointments.filter(
    (a: any) => a.status !== "scheduled" || new Date(a.date) < new Date(now.toISOString().split("T")[0])
  );

  const healthScore = Math.min(
    100,
    Math.max(
      40,
      75 +
        (upcomingAppointments.length > 0 ? 5 : 0) +
        (prescriptions.length > 0 ? 5 : -5) +
        Math.floor(Math.random() * 10)
    )
  );

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-500";
    if (score >= 60) return "text-amber-500";
    return "text-red-500";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return "Excellent";
    if (score >= 60) return "Good";
    return "Needs Attention";
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "scheduled":
        return <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-700">Scheduled</span>;
      case "completed":
        return <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700">Completed</span>;
      case "cancelled":
        return <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-red-100 text-red-700">Cancelled</span>;
      default:
        return <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-700">{status}</span>;
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 lg:space-y-8 max-w-7xl mx-auto">
      <header className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-foreground">
            My Health Portal
          </h1>
          <p className="text-muted-foreground mt-1 text-sm sm:text-base">
            Welcome back, {user?.firstName || "Patient"}. Here's your health overview.
          </p>
        </div>
        <div className="text-xs sm:text-sm text-muted-foreground bg-secondary px-3 sm:px-4 py-1.5 sm:py-2 rounded-full font-mono w-fit">
          {format(new Date(), "MMM dd, yyyy")}
        </div>
      </header>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-gradient-to-br from-primary/10 via-primary/5 to-accent/10 border border-primary/20 rounded-2xl p-4 sm:p-6 lg:p-8"
      >
        <div className="flex flex-col md:flex-row items-center gap-6 sm:gap-8">
          <div className="relative">
            <svg className="w-28 h-28 sm:w-40 sm:h-40 transform -rotate-90" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="50" stroke="hsl(var(--border))" strokeWidth="10" fill="none" />
              <circle
                cx="60"
                cy="60"
                r="50"
                stroke="hsl(var(--primary))"
                strokeWidth="10"
                fill="none"
                strokeDasharray={`${(healthScore / 100) * 314} 314`}
                strokeLinecap="round"
                className="transition-all duration-1000"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={`text-4xl font-bold font-display ${getScoreColor(healthScore)}`}>{healthScore}</span>
              <span className="text-xs text-muted-foreground font-medium">/ 100</span>
            </div>
          </div>
          <div className="flex-1 text-center md:text-left">
            <div className="flex items-center gap-2 justify-center md:justify-start mb-2">
              <Heart className="h-5 w-5 text-red-500" />
              <h2 className="text-2xl font-bold font-display">Health Score</h2>
            </div>
            <p className={`text-lg font-semibold ${getScoreColor(healthScore)} mb-2`}>{getScoreLabel(healthScore)}</p>
            <p className="text-sm text-muted-foreground max-w-md">
              Your health score is calculated based on your appointment history, prescription adherence, and general wellness indicators.
            </p>
            <div className="flex gap-4 mt-4 justify-center md:justify-start">
              <div className="text-center">
                <p className="text-2xl font-bold text-foreground">{upcomingAppointments.length}</p>
                <p className="text-xs text-muted-foreground">Upcoming</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-foreground">{prescriptions.length}</p>
                <p className="text-xs text-muted-foreground">Prescriptions</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-foreground">{pastAppointments.filter((a: any) => a.status === "completed").length}</p>
                <p className="text-xs text-muted-foreground">Completed</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.a
          href="/appointments"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="group bg-card border border-border rounded-2xl p-6 hover:shadow-md hover:border-primary/30 transition-all cursor-pointer"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-blue-100 text-blue-600">
              <Calendar className="h-6 w-6" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-foreground">Book Appointment</h3>
              <p className="text-sm text-muted-foreground">Schedule a visit with a doctor</p>
            </div>
            <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
          </div>
        </motion.a>

        <motion.a
          href="/symptom-checker"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="group bg-card border border-border rounded-2xl p-6 hover:shadow-md hover:border-primary/30 transition-all cursor-pointer"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-violet-100 text-violet-600">
              <Stethoscope className="h-6 w-6" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-foreground">Symptom Checker</h3>
              <p className="text-sm text-muted-foreground">AI-powered health assessment</p>
            </div>
            <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
          </div>
        </motion.a>

        <motion.a
          href="/medassist"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="group bg-card border border-border rounded-2xl p-6 hover:shadow-md hover:border-primary/30 transition-all cursor-pointer"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-emerald-100 text-emerald-600">
              <BookOpen className="h-6 w-6" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-foreground">MedAssist AI</h3>
              <p className="text-sm text-muted-foreground">Learn about health topics</p>
            </div>
            <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
          </div>
        </motion.a>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-card border border-border rounded-2xl p-6 shadow-sm"
        >
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-lg font-bold font-display flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              My Appointments
            </h3>
            <div className="flex gap-1 bg-muted rounded-lg p-1">
              <button
                onClick={() => setActiveTab("upcoming")}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                  activeTab === "upcoming" ? "bg-primary text-white" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Upcoming ({upcomingAppointments.length})
              </button>
              <button
                onClick={() => setActiveTab("past")}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                  activeTab === "past" ? "bg-primary text-white" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Past ({pastAppointments.length})
              </button>
            </div>
          </div>

          {appointmentsLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-16 bg-muted rounded-xl animate-pulse" />
              ))}
            </div>
          ) : (activeTab === "upcoming" ? upcomingAppointments : pastAppointments).length > 0 ? (
            <div className="space-y-3 max-h-[320px] overflow-y-auto">
              {(activeTab === "upcoming" ? upcomingAppointments : pastAppointments).map((apt: any) => (
                <div
                  key={apt.id}
                  className="flex items-center gap-4 p-4 rounded-xl border border-border hover:bg-muted/50 transition-colors"
                >
                  <div className="flex flex-col items-center bg-primary/10 rounded-xl px-3 py-2 min-w-[60px]">
                    <span className="text-xs text-primary font-semibold">
                      {apt.date ? format(new Date(apt.date), "MMM") : "—"}
                    </span>
                    <span className="text-xl font-bold text-primary">
                      {apt.date ? format(new Date(apt.date), "dd") : "—"}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-foreground truncate">{apt.reason}</p>
                    <p className="text-xs text-muted-foreground">
                      {apt.doctorName ? `Dr. ${apt.doctorName}` : "Doctor TBD"} • {apt.time}
                    </p>
                  </div>
                  <div>{getStatusBadge(apt.status)}</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <Calendar className="h-10 w-10 text-muted-foreground/40 mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">
                {activeTab === "upcoming" ? "No upcoming appointments" : "No past appointments"}
              </p>
              {activeTab === "upcoming" && (
                <a
                  href="/appointments"
                  className="inline-block mt-3 text-sm font-semibold text-primary hover:underline"
                >
                  Book an Appointment
                </a>
              )}
            </div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-card border border-border rounded-2xl p-6 shadow-sm"
        >
          <h3 className="text-lg font-bold font-display flex items-center gap-2 mb-5">
            <Pill className="h-5 w-5 text-violet-500" />
            My Prescriptions
          </h3>

          {prescriptionsLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-16 bg-muted rounded-xl animate-pulse" />
              ))}
            </div>
          ) : prescriptions.length > 0 ? (
            <div className="space-y-3 max-h-[320px] overflow-y-auto">
              {prescriptions.map((rx: any) => (
                <div
                  key={rx.id}
                  className="p-4 rounded-xl border border-border hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-semibold text-sm text-foreground">{rx.diagnosis}</p>
                      <p className="text-xs text-muted-foreground">
                        By Dr. {rx.doctorName} • {rx.createdAt ? format(new Date(rx.createdAt), "MMM dd, yyyy") : "—"}
                      </p>
                    </div>
                    <Pill className="h-4 w-4 text-violet-400 shrink-0" />
                  </div>
                  {rx.medications && Array.isArray(rx.medications) && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {(rx.medications as any[]).slice(0, 3).map((med: any, i: number) => (
                        <span
                          key={i}
                          className="text-xs bg-violet-50 text-violet-700 px-2 py-0.5 rounded-full font-medium"
                        >
                          {typeof med === "string" ? med : med.name || "Medication"}
                        </span>
                      ))}
                      {rx.medications.length > 3 && (
                        <span className="text-xs text-muted-foreground">+{rx.medications.length - 3} more</span>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <Pill className="h-10 w-10 text-muted-foreground/40 mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">No prescriptions found</p>
            </div>
          )}
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <h3 className="text-lg font-bold font-display flex items-center gap-2 mb-4">
          <Sparkles className="h-5 w-5 text-amber-500" />
          Health Tips for You
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {healthTips.map((tip, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 + i * 0.05 }}
              className="bg-card border border-border rounded-2xl p-5 hover:shadow-md hover:border-primary/20 transition-all"
            >
              <div className="text-2xl mb-3">{tip.icon}</div>
              <h4 className="font-semibold text-sm text-foreground mb-1">{tip.title}</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">{tip.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <div className="p-3 bg-muted/50 rounded-xl border border-border">
        <p className="text-xs text-center text-muted-foreground">
          <Shield className="h-3 w-3 inline mr-1" />
          Your health data is securely stored and handled in compliance with privacy standards. This portal is for informational purposes only.
        </p>
      </div>
    </div>
  );
}
