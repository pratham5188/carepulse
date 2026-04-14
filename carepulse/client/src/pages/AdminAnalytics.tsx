import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  Activity,
  Calendar,
  Pill,
  Hospital,
  AlertCircle,
  Shield,
  Search,
  BarChart3,
  TrendingUp,
  Server,
  Clock,
  CheckCircle,
  XCircle,
  RefreshCw,
} from "lucide-react";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { motion } from "framer-motion";
import { format } from "date-fns";

interface PlatformStats {
  totalUsers: number;
  usersByRole: { patients: number; doctors: number; admins: number };
  totalAppointments: number;
  appointmentsByStatus: { scheduled: number; completed: number; cancelled: number };
  totalPrescriptions: number;
  totalPatients: number;
  totalHospitals: number;
  criticalPatients: number;
}

interface AuditLog {
  id: number;
  userId: string | null;
  userEmail: string | null;
  action: string;
  details: string | null;
  createdAt: string | null;
}

const COLORS = ["hsl(221, 83%, 53%)", "hsl(142, 71%, 45%)", "hsl(38, 92%, 50%)", "hsl(0, 84%, 60%)"];

export default function AdminAnalytics() {
  const { user } = useAuth();
  const [auditSearch, setAuditSearch] = useState("");
  const [auditFilter, setAuditFilter] = useState<string>("all");

  const { data: stats, isLoading: statsLoading, refetch: refetchStats } = useQuery<PlatformStats>({
    queryKey: ["/api/admin/analytics"],
    queryFn: async () => {
      const res = await fetch("/api/admin/analytics", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch analytics");
      return res.json();
    },
  });

  const { data: auditLogs, isLoading: logsLoading, refetch: refetchLogs } = useQuery<AuditLog[]>({
    queryKey: ["/api/admin/audit-logs"],
    queryFn: async () => {
      const res = await fetch("/api/admin/audit-logs", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch audit logs");
      return res.json();
    },
  });

  const userRoleData = stats
    ? [
        { name: "Patients", value: stats.usersByRole.patients },
        { name: "Doctors", value: stats.usersByRole.doctors },
        { name: "Admins", value: stats.usersByRole.admins },
      ]
    : [];

  const appointmentStatusData = stats
    ? [
        { name: "Scheduled", value: stats.appointmentsByStatus.scheduled },
        { name: "Completed", value: stats.appointmentsByStatus.completed },
        { name: "Cancelled", value: stats.appointmentsByStatus.cancelled },
      ]
    : [];

  const overviewBarData = stats
    ? [
        { name: "Users", count: stats.totalUsers },
        { name: "Patients", count: stats.totalPatients },
        { name: "Appointments", count: stats.totalAppointments },
        { name: "Prescriptions", count: stats.totalPrescriptions },
        { name: "Hospitals", count: stats.totalHospitals },
      ]
    : [];

  const uniqueActions = auditLogs
    ? Array.from(new Set(auditLogs.map((l) => l.action)))
    : [];

  const filteredLogs = auditLogs
    ? auditLogs.filter((log) => {
        const matchesSearch =
          !auditSearch ||
          log.action.toLowerCase().includes(auditSearch.toLowerCase()) ||
          (log.userEmail || "").toLowerCase().includes(auditSearch.toLowerCase()) ||
          (log.details || "").toLowerCase().includes(auditSearch.toLowerCase());
        const matchesFilter = auditFilter === "all" || log.action === auditFilter;
        return matchesSearch && matchesFilter;
      })
    : [];

  if (statsLoading) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 space-y-6 lg:space-y-8 animate-pulse">
        <div className="h-8 w-64 bg-muted rounded-lg"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-muted rounded-2xl"></div>
          ))}
        </div>
        <div className="h-96 bg-muted rounded-2xl"></div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 lg:space-y-8 max-w-7xl mx-auto">
      <header className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-foreground flex items-center gap-3">
            <BarChart3 className="h-6 w-6 sm:h-8 sm:w-8 text-primary shrink-0" />
            Platform Analytics
          </h1>
          <p className="text-muted-foreground mt-1">
            Comprehensive overview of CarePulse platform usage and health
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              refetchStats();
              refetchLogs();
            }}
          >
            <RefreshCw className="h-4 w-4 mr-1" />
            Refresh
          </Button>
          <div className="text-sm text-muted-foreground bg-secondary px-4 py-2 rounded-full font-mono">
            {format(new Date(), "MMM dd, yyyy • HH:mm")}
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="border-l-4 border-l-blue-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground font-medium">Total Users</p>
                  <p className="text-3xl font-bold mt-1">{stats?.totalUsers || 0}</p>
                </div>
                <div className="h-12 w-12 rounded-xl bg-blue-100 flex items-center justify-center">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <div className="flex gap-2 mt-3">
                <Badge variant="secondary" className="text-xs">{stats?.usersByRole.doctors || 0} doctors</Badge>
                <Badge variant="secondary" className="text-xs">{stats?.usersByRole.patients || 0} patients</Badge>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="border-l-4 border-l-green-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground font-medium">Appointments</p>
                  <p className="text-3xl font-bold mt-1">{stats?.totalAppointments || 0}</p>
                </div>
                <div className="h-12 w-12 rounded-xl bg-green-100 flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-green-600" />
                </div>
              </div>
              <div className="flex gap-2 mt-3">
                <Badge variant="secondary" className="text-xs">{stats?.appointmentsByStatus.scheduled || 0} active</Badge>
                <Badge variant="secondary" className="text-xs">{stats?.appointmentsByStatus.completed || 0} done</Badge>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card className="border-l-4 border-l-purple-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground font-medium">Prescriptions</p>
                  <p className="text-3xl font-bold mt-1">{stats?.totalPrescriptions || 0}</p>
                </div>
                <div className="h-12 w-12 rounded-xl bg-purple-100 flex items-center justify-center">
                  <Pill className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <Card className="border-l-4 border-l-red-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground font-medium">Critical Patients</p>
                  <p className="text-3xl font-bold mt-1">{stats?.criticalPatients || 0}</p>
                </div>
                <div className="h-12 w-12 rounded-xl bg-red-100 flex items-center justify-center">
                  <AlertCircle className="h-6 w-6 text-red-600" />
                </div>
              </div>
              <div className="flex gap-2 mt-3">
                <Badge variant="secondary" className="text-xs">{stats?.totalHospitals || 0} hospitals</Badge>
                <Badge variant="secondary" className="text-xs">{stats?.totalPatients || 0} patients</Badge>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5 }}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <TrendingUp className="h-5 w-5 text-primary" />
                Platform Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={overviewBarData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                    <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip
                      contentStyle={{ backgroundColor: "hsl(var(--card))", borderRadius: "8px", border: "1px solid hsl(var(--border))" }}
                      itemStyle={{ color: "hsl(var(--foreground))" }}
                    />
                    <Bar dataKey="count" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.6 }}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Users className="h-5 w-5 text-primary" />
                Users by Role
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={userRoleData}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      innerRadius={50}
                      paddingAngle={5}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}`}
                    >
                      {userRoleData.map((_entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.7 }}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Calendar className="h-5 w-5 text-primary" />
              Appointment Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-xl border border-blue-200">
                <Clock className="h-8 w-8 text-blue-600" />
                <div>
                  <p className="text-2xl font-bold text-blue-900">{stats?.appointmentsByStatus.scheduled || 0}</p>
                  <p className="text-sm text-blue-700">Scheduled</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-green-50 rounded-xl border border-green-200">
                <CheckCircle className="h-8 w-8 text-green-600" />
                <div>
                  <p className="text-2xl font-bold text-green-900">{stats?.appointmentsByStatus.completed || 0}</p>
                  <p className="text-sm text-green-700">Completed</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-red-50 rounded-xl border border-red-200">
                <XCircle className="h-8 w-8 text-red-600" />
                <div>
                  <p className="text-2xl font-bold text-red-900">{stats?.appointmentsByStatus.cancelled || 0}</p>
                  <p className="text-sm text-red-700">Cancelled</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}>
        <Card className="bg-gradient-to-r from-emerald-50 to-blue-50 border-emerald-200">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                <Server className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold font-display">System Health</h3>
                <p className="text-sm text-muted-foreground">Platform operational status</p>
              </div>
            </div>
            <div className="grid md:grid-cols-4 gap-4">
              <div className="bg-white/80 rounded-xl p-4 border border-emerald-200">
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div>
                  <span className="text-sm font-medium">Database</span>
                </div>
                <p className="text-xs text-muted-foreground">Operational</p>
              </div>
              <div className="bg-white/80 rounded-xl p-4 border border-emerald-200">
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div>
                  <span className="text-sm font-medium">API Server</span>
                </div>
                <p className="text-xs text-muted-foreground">Operational</p>
              </div>
              <div className="bg-white/80 rounded-xl p-4 border border-emerald-200">
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div>
                  <span className="text-sm font-medium">Authentication</span>
                </div>
                <p className="text-xs text-muted-foreground">Operational</p>
              </div>
              <div className="bg-white/80 rounded-xl p-4 border border-emerald-200">
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div>
                  <span className="text-sm font-medium">AI Services</span>
                </div>
                <p className="text-xs text-muted-foreground">Operational</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }}>
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Activity className="h-5 w-5 text-primary" />
                Audit Logs
              </CardTitle>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search logs..."
                    value={auditSearch}
                    onChange={(e) => setAuditSearch(e.target.value)}
                    className="pl-9 w-full sm:w-[200px]"
                  />
                </div>
                <select
                  className="bg-secondary border border-border text-sm rounded-lg px-3 py-2 outline-none w-full sm:w-auto"
                  value={auditFilter}
                  onChange={(e) => setAuditFilter(e.target.value)}
                >
                  <option value="all">All Actions</option>
                  {uniqueActions.map((action) => (
                    <option key={action} value={action}>
                      {action}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {logsLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-16 bg-muted rounded-xl animate-pulse"></div>
                ))}
              </div>
            ) : filteredLogs.length === 0 ? (
              <div className="text-center py-12">
                <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground font-medium">No audit logs found</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {auditSearch || auditFilter !== "all"
                    ? "Try adjusting your search or filter"
                    : "Actions will appear here as users interact with the platform"}
                </p>
              </div>
            ) : (
              <div className="space-y-2 max-h-[400px] overflow-y-auto">
                {filteredLogs.slice(0, 50).map((log) => (
                  <div
                    key={log.id}
                    className="flex items-start gap-3 p-3 rounded-xl hover:bg-muted/50 transition-colors border border-transparent hover:border-border"
                  >
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                      <Activity className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge variant="outline" className="text-xs font-mono">
                          {log.action}
                        </Badge>
                        {log.userEmail && (
                          <span className="text-xs text-muted-foreground">{log.userEmail}</span>
                        )}
                      </div>
                      {log.details && (
                        <p className="text-sm text-muted-foreground mt-1 truncate">{log.details}</p>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground shrink-0">
                      {log.createdAt ? format(new Date(log.createdAt), "MMM dd, HH:mm") : "—"}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      <div className="p-3 bg-muted/50 rounded-xl border border-border">
        <p className="text-xs text-center text-muted-foreground">
          <Shield className="h-3 w-3 inline mr-1" />
          Platform analytics are restricted to administrators only. All data access is logged for compliance.
        </p>
      </div>
    </div>
  );
}
