import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/use-auth";
import { Sidebar } from "@/components/Sidebar";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Menu } from "lucide-react";
import { motion } from "framer-motion";
import { CarePulseLogo } from "@/components/CarePulseLogo";
import { PerformanceOptimizer } from "@/components/PerformanceOptimizer";
import { FpsOverlay } from "@/components/FpsOverlay";
import { NotificationCenter } from "@/components/NotificationCenter";
import { CommandPalette } from "@/components/CommandPalette";

import Landing from "@/pages/Landing";
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import Patients from "@/pages/Patients";
import Hospitals from "@/pages/Hospitals";
import Settings from "@/pages/Settings";
import MedAssistAI from "@/pages/MedAssistAI";
import PatientDetail from "@/pages/PatientDetail";
import EmergencyAlerts from "@/pages/EmergencyAlerts";
import PatientPortal from "@/pages/PatientPortal";
import SymptomChecker from "@/pages/SymptomChecker";
import Appointments from "@/pages/Appointments";
import Prescriptions from "@/pages/Prescriptions";
import AdminUsers from "@/pages/AdminUsers";
import AdminAnalytics from "@/pages/AdminAnalytics";
import AdminAppointments from "@/pages/AdminAppointments";
import HealthCalculators from "@/pages/HealthCalculators";
import DrugInteractions from "@/pages/DrugInteractions";
import MedicalID from "@/pages/MedicalID";
import MedicalIDView from "@/pages/MedicalIDView";
import MLInsights from "@/pages/MLInsights";
import PredictiveAnalytics from "@/pages/PredictiveAnalytics";
import Compliance from "@/pages/Compliance";
import ConsentManager from "@/pages/ConsentManager";
import Telemedicine from "@/pages/Telemedicine";
import NotFound from "@/pages/not-found";

function AuthenticatedLayout({ children, allowedRoles }: { children: React.ReactNode, allowedRoles?: string[] }) {
  const { isAuthenticated, isLoading, user } = useAuth();
  const [, setLocation] = useLocation();
  const [location] = useLocation();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [desktopCollapsed, setDesktopCollapsed] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      setLocation("/login");
    }
  }, [isLoading, isAuthenticated, setLocation]);

  if (isLoading) return <div className="h-screen w-full flex items-center justify-center bg-background"><div className="h-8 w-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div></div>;

  if (!isAuthenticated) {
    return null;
  }

  const isRestricted = allowedRoles && user?.role && !allowedRoles.includes(user.role);

  return (
    <div className="flex min-h-screen bg-background text-foreground font-sans">
      <Sidebar mobileOpen={mobileOpen} onToggle={() => setMobileOpen(!mobileOpen)} desktopCollapsed={desktopCollapsed} onDesktopToggle={() => setDesktopCollapsed(!desktopCollapsed)} />
      <main className={cn(
        "flex-1 bg-background/50 relative overflow-x-hidden transition-all duration-300",
        desktopCollapsed ? "lg:ml-20" : "lg:ml-64"
      )}>
        <div className="sticky top-0 z-10 lg:hidden flex items-center gap-3 px-4 py-3 bg-card border-b border-border">
          <button onClick={() => setMobileOpen(true)} className="p-1.5 rounded-lg hover:bg-muted" data-testid="mobile-menu-toggle">
            <Menu className="h-5 w-5 text-muted-foreground" />
          </button>
          <CarePulseLogo size="sm" variant="gradient" />
          <span className="font-display font-bold text-lg tracking-tight text-foreground">Care<motion.span
            className="text-red-500 inline-block"
            animate={{ opacity: [0.7, 1, 0.7], scale: [0.98, 1.03, 0.98] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >Pulse</motion.span></span>
          <div className="ml-auto">
            <NotificationCenter />
          </div>
        </div>
        <div className="hidden lg:block fixed top-4 right-4 z-40">
          <NotificationCenter />
        </div>
        {isRestricted ? (
          <div className="flex flex-col items-center justify-center h-full p-8">
            <h2 className="text-2xl font-bold mb-2">Access Restricted</h2>
            <p className="text-muted-foreground">You don't have permission to view this page.</p>
          </div>
        ) : children}
      </main>
    </div>
  );
}

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <Switch>
      <Route path="/">
        {isLoading ? <Landing /> : isAuthenticated ? <AuthenticatedLayout><Dashboard /></AuthenticatedLayout> : <Landing />}
      </Route>

      <Route path="/login">
        {isLoading ? <Login /> : isAuthenticated ? <AuthenticatedLayout><Dashboard /></AuthenticatedLayout> : <Login />}
      </Route>

      <Route path="/my-health">
        <AuthenticatedLayout allowedRoles={["patient"]}><PatientPortal /></AuthenticatedLayout>
      </Route>
      <Route path="/medical-id">
        <AuthenticatedLayout allowedRoles={["patient"]}><MedicalID /></AuthenticatedLayout>
      </Route>
      <Route path="/symptom-checker">
        <AuthenticatedLayout allowedRoles={["patient"]}><SymptomChecker /></AuthenticatedLayout>
      </Route>
      <Route path="/health-tools">
        <AuthenticatedLayout allowedRoles={["patient"]}><HealthCalculators /></AuthenticatedLayout>
      </Route>
      <Route path="/appointments">
        <AuthenticatedLayout><Appointments /></AuthenticatedLayout>
      </Route>
      <Route path="/prescriptions">
        <AuthenticatedLayout><Prescriptions /></AuthenticatedLayout>
      </Route>
      <Route path="/patients">
        <AuthenticatedLayout allowedRoles={["doctor", "admin"]}><Patients /></AuthenticatedLayout>
      </Route>
      <Route path="/patients/:id">
        {(params) => <AuthenticatedLayout allowedRoles={["doctor", "admin"]}><PatientDetail id={Number(params.id)} /></AuthenticatedLayout>}
      </Route>
      <Route path="/medassist">
        <AuthenticatedLayout><MedAssistAI /></AuthenticatedLayout>
      </Route>
      <Route path="/drug-checker">
        <AuthenticatedLayout><DrugInteractions /></AuthenticatedLayout>
      </Route>
      <Route path="/hospitals">
        <AuthenticatedLayout><Hospitals /></AuthenticatedLayout>
      </Route>
      <Route path="/alerts">
        <AuthenticatedLayout allowedRoles={["doctor", "admin"]}><EmergencyAlerts /></AuthenticatedLayout>
      </Route>
      <Route path="/admin/users">
        <AuthenticatedLayout allowedRoles={["admin"]}><AdminUsers /></AuthenticatedLayout>
      </Route>
      <Route path="/admin/analytics">
        <AuthenticatedLayout allowedRoles={["admin"]}><AdminAnalytics /></AuthenticatedLayout>
      </Route>
      <Route path="/admin/appointments">
        <AuthenticatedLayout allowedRoles={["admin"]}><AdminAppointments /></AuthenticatedLayout>
      </Route>
      <Route path="/admin/compliance">
        <AuthenticatedLayout allowedRoles={["admin", "doctor"]}><Compliance /></AuthenticatedLayout>
      </Route>
      <Route path="/ml-insights">
        <AuthenticatedLayout><MLInsights /></AuthenticatedLayout>
      </Route>
      <Route path="/predictive-analytics">
        <AuthenticatedLayout allowedRoles={["doctor", "admin"]}><PredictiveAnalytics /></AuthenticatedLayout>
      </Route>
      <Route path="/settings">
        <AuthenticatedLayout><Settings /></AuthenticatedLayout>
      </Route>
      <Route path="/consent">
        <AuthenticatedLayout><ConsentManager /></AuthenticatedLayout>
      </Route>
      <Route path="/telemedicine">
        <AuthenticatedLayout><Telemedicine /></AuthenticatedLayout>
      </Route>

      <Route path="/id">
        <MedicalIDView />
      </Route>

      <Route component={NotFound} />
    </Switch>
  );
}

function applyThemeFromStorage() {
  const stored = localStorage.getItem("carepulse-theme");
  const mode = (stored === "light" || stored === "dark" || stored === "system") ? stored : "system";
  const root = document.documentElement;
  if (mode === "dark") {
    root.classList.add("dark");
  } else if (mode === "light") {
    root.classList.remove("dark");
  } else {
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    if (prefersDark) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }
}

function App() {
  useEffect(() => {
    applyThemeFromStorage();

    const handleStorage = (e: StorageEvent) => {
      if (e.key === "carepulse-theme") applyThemeFromStorage();
    };
    window.addEventListener("storage", handleStorage);

    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handleMq = () => applyThemeFromStorage();
    mq.addEventListener("change", handleMq);

    return () => {
      window.removeEventListener("storage", handleStorage);
      mq.removeEventListener("change", handleMq);
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <PerformanceOptimizer />
        <FpsOverlay />
        <CommandPalette />
        <Router />
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
