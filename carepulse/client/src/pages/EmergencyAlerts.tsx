import { useState } from "react";
import { usePatients, useAnalyticsStats } from "@/hooks/use-medical-data";
import { AlertTriangle, Activity, Heart, Thermometer, Wind, Shield, Phone, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface AlertItem {
  id: number;
  patientName: string;
  patientId: number;
  riskLevel: string;
  condition: string;
  type: string;
  message: string;
  severity: "critical" | "warning" | "info";
  timestamp: Date;
}

function generateAlerts(patients: any[]): AlertItem[] {
  const alerts: AlertItem[] = [];

  patients.forEach((p: any) => {
    if (p.riskLevel === "High" && p.condition === "Critical") {
      alerts.push({
        id: alerts.length + 1,
        patientName: p.name,
        patientId: p.id,
        riskLevel: p.riskLevel,
        condition: p.condition,
        type: "Emergency Alert",
        message: `Patient ${p.name} is in CRITICAL condition with HIGH risk. Immediate medical intervention required.`,
        severity: "critical",
        timestamp: new Date(Date.now() - Math.random() * 3600000),
      });
    } else if (p.riskLevel === "High") {
      alerts.push({
        id: alerts.length + 1,
        patientName: p.name,
        patientId: p.id,
        riskLevel: p.riskLevel,
        condition: p.condition,
        type: "High Risk Warning",
        message: `Patient ${p.name} has elevated risk level. Close monitoring recommended.`,
        severity: "warning",
        timestamp: new Date(Date.now() - Math.random() * 7200000),
      });
    } else if (p.condition === "Critical") {
      alerts.push({
        id: alerts.length + 1,
        patientName: p.name,
        patientId: p.id,
        riskLevel: p.riskLevel,
        condition: p.condition,
        type: "Critical Condition",
        message: `Patient ${p.name} condition marked as Critical. Monitor vitals closely.`,
        severity: "warning",
        timestamp: new Date(Date.now() - Math.random() * 7200000),
      });
    }
  });

  return alerts.sort((a, b) => {
    const severityOrder = { critical: 0, warning: 1, info: 2 };
    return severityOrder[a.severity] - severityOrder[b.severity];
  });
}

export default function EmergencyAlerts() {
  const { data: patients, isLoading } = usePatients();
  const { data: stats } = useAnalyticsStats();
  const [selectedAlert, setSelectedAlert] = useState<AlertItem | null>(null);

  const alerts = patients ? generateAlerts(patients) : [];
  const criticalCount = alerts.filter((a) => a.severity === "critical").length;
  const warningCount = alerts.filter((a) => a.severity === "warning").length;

  if (isLoading) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 space-y-6 lg:space-y-8 animate-pulse">
        <div className="h-8 w-64 bg-muted rounded-lg"></div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          {[1, 2, 3].map((i) => <div key={i} className="h-28 bg-muted rounded-2xl"></div>)}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 lg:space-y-8 max-w-7xl mx-auto">
      <header>
        <h1 className="text-2xl sm:text-3xl font-display font-bold text-foreground flex items-center gap-3">
          <AlertTriangle className="h-6 w-6 sm:h-8 sm:w-8 text-red-500 shrink-0" />
          Emergency Alert System
        </h1>
        <p className="text-muted-foreground mt-1">
          Real-time risk evaluation and emergency detection based on patient analytics
        </p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-10 w-10 rounded-full bg-red-500/20 flex items-center justify-center">
              <AlertTriangle className="h-5 w-5 text-red-500" />
            </div>
            <div>
              <p className="text-sm text-red-500 font-medium">Critical Alerts</p>
              <p className="text-3xl font-bold text-red-600">{criticalCount}</p>
            </div>
          </div>
          <p className="text-xs text-red-500/70">Require immediate medical attention</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-10 w-10 rounded-full bg-amber-500/20 flex items-center justify-center">
              <Activity className="h-5 w-5 text-amber-500" />
            </div>
            <div>
              <p className="text-sm text-amber-500 font-medium">Warnings</p>
              <p className="text-3xl font-bold text-amber-600">{warningCount}</p>
            </div>
          </div>
          <p className="text-xs text-amber-500/70">Close monitoring recommended</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-10 w-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
              <Shield className="h-5 w-5 text-emerald-500" />
            </div>
            <div>
              <p className="text-sm text-emerald-500 font-medium">Total Patients</p>
              <p className="text-3xl font-bold text-emerald-600">{stats?.totalPatients || 0}</p>
            </div>
          </div>
          <p className="text-xs text-emerald-500/70">Being monitored in the system</p>
        </motion.div>
      </div>

      <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
        <div className="p-6 border-b border-border bg-muted/30">
          <h2 className="text-lg font-bold font-display">Emergency Alert Flow</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Analytics Result Generated → Risk Level Evaluation → Alert Triggered → User Warning → Advise Immediate Medical Help
          </p>
        </div>

        <div className="divide-y divide-border">
          <AnimatePresence>
            {alerts.length === 0 ? (
              <div className="p-12 text-center">
                <Shield className="h-12 w-12 text-emerald-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-1">All Clear</h3>
                <p className="text-muted-foreground">No emergency alerts at this time. All patients are within safe parameters.</p>
              </div>
            ) : (
              alerts.map((alert, i) => (
                <motion.div
                  key={alert.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => setSelectedAlert(selectedAlert?.id === alert.id ? null : alert)}
                  className={`p-5 flex items-start gap-4 cursor-pointer transition-colors ${
                    alert.severity === "critical" ? "hover:bg-red-50 dark:hover:bg-red-500/5" : "hover:bg-amber-50 dark:hover:bg-amber-500/5"
                  }`}
                >
                  <div className={`h-10 w-10 rounded-full flex items-center justify-center shrink-0 ${
                    alert.severity === "critical" ? "bg-red-100 dark:bg-red-500/20" : "bg-amber-100 dark:bg-amber-500/20"
                  }`}>
                    {alert.severity === "critical" ? (
                      <AlertTriangle className="h-5 w-5 text-red-600 animate-pulse" />
                    ) : (
                      <Activity className="h-5 w-5 text-amber-600" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-xs font-bold uppercase px-2 py-0.5 rounded-full ${
                        alert.severity === "critical" ? "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400" : "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400"
                      }`}>
                        {alert.type}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {Math.round((Date.now() - alert.timestamp.getTime()) / 60000)} mins ago
                      </span>
                    </div>
                    <p className="text-sm font-semibold">{alert.patientName}</p>
                    <p className="text-sm text-muted-foreground">{alert.message}</p>

                    <AnimatePresence>
                      {selectedAlert?.id === alert.id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-4 space-y-3"
                        >
                          <div className="grid grid-cols-2 gap-3">
                            <div className="p-3 bg-muted/50 rounded-xl">
                              <p className="text-xs text-muted-foreground">Condition</p>
                              <p className="text-sm font-semibold">{alert.condition}</p>
                            </div>
                            <div className="p-3 bg-muted/50 rounded-xl">
                              <p className="text-xs text-muted-foreground">Risk Level</p>
                              <p className={`text-sm font-semibold ${alert.riskLevel === "High" ? "text-red-500" : "text-amber-500"}`}>{alert.riskLevel}</p>
                            </div>
                          </div>

                          {alert.severity === "critical" && (
                            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                              <p className="text-sm font-bold text-red-600 mb-1 flex items-center gap-2">
                                <Phone className="h-4 w-4" />
                                IMMEDIATE ACTION REQUIRED
                              </p>
                              <p className="text-sm text-red-600/80">
                                Contact the attending physician immediately. Prepare emergency intervention protocols. 
                                Advise seeking immediate medical help at the nearest emergency department.
                              </p>
                            </div>
                          )}

                          <a
                            href={`/patients/${alert.patientId}`}
                            className="inline-flex items-center gap-1 text-sm text-primary font-medium hover:underline"
                          >
                            View Patient Details <ChevronRight className="h-4 w-4" />
                          </a>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl">
        <div className="flex gap-3">
          <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-bold text-amber-700 dark:text-amber-400">Medical Disclaimer</p>
            <p className="text-sm text-amber-600 dark:text-amber-500">
              This alert system is for informational and educational purposes only. It does not replace professional medical judgment. 
              Always consult with qualified healthcare professionals for clinical decisions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
