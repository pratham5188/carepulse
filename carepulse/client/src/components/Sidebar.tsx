import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import {
  LayoutDashboard, Users, LogOut, Settings,
  Hospital, Menu, AlertTriangle, Heart, Stethoscope, Calendar,
  FileText, ShieldCheck, BarChart3, BotMessageSquare, Calculator, Pill, IdCard, X, Brain, TrendingUp, ClipboardCheck, Lock, Video
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { CarePulseLogo } from "@/components/CarePulseLogo";
import { motion } from "framer-motion";

interface SidebarProps {
  mobileOpen: boolean;
  onToggle: () => void;
  desktopCollapsed: boolean;
  onDesktopToggle: () => void;
}

export function Sidebar({ mobileOpen, onToggle, desktopCollapsed, onDesktopToggle }: SidebarProps) {
  const [location] = useLocation();
  const { user, logout } = useAuth();

  const role = user?.role || "patient";

  const allLinks = [
    { href: "/", label: "Overview", icon: LayoutDashboard, roles: ["patient", "doctor", "admin"] },
    { href: "/my-health", label: "My Health", icon: Heart, roles: ["patient"] },
    { href: "/medical-id", label: "Medical ID", icon: IdCard, roles: ["patient"] },
    { href: "/symptom-checker", label: "Symptom Checker", icon: Stethoscope, roles: ["patient"] },
    { href: "/health-tools", label: "Health Tools", icon: Calculator, roles: ["patient"] },
    { href: "/appointments", label: "Appointments", icon: Calendar, roles: ["patient", "doctor", "admin"] },
    { href: "/prescriptions", label: "Prescriptions", icon: FileText, roles: ["patient", "doctor", "admin"] },
    { href: "/patients", label: "Patients", icon: Users, roles: ["doctor", "admin"] },
    { href: "/hospitals", label: "Hospitals", icon: Hospital, roles: ["patient", "doctor", "admin"] },
    { href: "/alerts", label: "Emergency Alerts", icon: AlertTriangle, roles: ["doctor", "admin"] },
    { href: "/medassist", label: "MedAssist AI", icon: BotMessageSquare, roles: ["patient", "doctor", "admin"] },
    { href: "/drug-checker", label: "Drug Checker", icon: Pill, roles: ["patient", "doctor", "admin"] },
    { href: "/ml-insights", label: "CareIntelligence", icon: Brain, roles: ["patient", "doctor", "admin"] },
    { href: "/telemedicine", label: "Telemedicine", icon: Video, roles: ["patient", "doctor", "admin"] },
    { href: "/predictive-analytics", label: "Predictive Analytics", icon: TrendingUp, roles: ["doctor", "admin"] },
    { href: "/admin/appointments", label: "Appointment Management", icon: Calendar, roles: ["admin"] },
    { href: "/admin/users", label: "User Management", icon: ShieldCheck, roles: ["admin"] },
    { href: "/admin/analytics", label: "Platform Analytics", icon: BarChart3, roles: ["admin"] },
    { href: "/admin/compliance", label: "Compliance & Benchmarks", icon: ClipboardCheck, roles: ["admin", "doctor"] },
    { href: "/consent", label: "Data Consent", icon: Lock, roles: ["patient", "doctor", "admin"] },
    { href: "/settings", label: "Settings", icon: Settings, roles: ["patient", "doctor", "admin"] },
  ];

  const links = allLinks.filter((link) => link.roles.includes(role));

  const roleLabel: Record<string, string> = {
    patient: "Patient",
    doctor: "Doctor",
    admin: "Administrator",
  };

  const roleColor: Record<string, string> = {
    patient: "text-blue-500",
    doctor: "text-emerald-500",
    admin: "text-amber-500",
  };

  const showLabels = mobileOpen || !desktopCollapsed;

  return (
    <>
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={onToggle}
          data-testid="sidebar-overlay"
        />
      )}

      <aside
        className={cn(
          "fixed left-0 top-0 h-screen bg-card border-r border-border flex flex-col z-40",
          "hidden lg:flex",
          desktopCollapsed ? "lg:w-20" : "lg:w-64"
        )}
        data-testid="sidebar-desktop"
      >
        <div className={cn("p-4 flex items-center gap-3", !desktopCollapsed ? "justify-between" : "justify-center")}>
          {!desktopCollapsed && (
            <>
              <div className="flex items-center gap-3 min-w-0">
                <CarePulseLogo size="sm" variant="gradient" />
                <div className="shrink-0">
                  <h1 className="font-display font-bold text-lg tracking-tight text-foreground">
                    Care<motion.span
                      className="text-red-500 inline-block"
                      animate={{ opacity: [0.7, 1, 0.7], scale: [0.98, 1.03, 0.98] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    >Pulse</motion.span>
                  </h1>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={onDesktopToggle} className="shrink-0">
                <Menu className="h-5 w-5 text-muted-foreground" />
              </Button>
            </>
          )}
          {desktopCollapsed && (
            <button onClick={onDesktopToggle} className="p-1 rounded-xl hover:bg-muted transition-colors">
              <CarePulseLogo size="sm" variant="gradient" />
            </button>
          )}
        </div>

        <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = location === link.href;
            return (
              <Link key={link.href} href={link.href} className={cn(
                "flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group overflow-hidden",
                isActive ? "bg-primary/10 text-primary font-semibold" : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}>
                <Icon className={cn("h-5 w-5 shrink-0 transition-colors", isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground")} />
                {!desktopCollapsed && <span className="whitespace-nowrap">{link.label}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-border">
          {!desktopCollapsed && (
            <div className="flex items-center gap-3 mb-4 px-1">
              <div className="h-10 w-10 rounded-full bg-secondary overflow-hidden shrink-0">
                {user?.profileImageUrl ? (
                  <img src={user.profileImageUrl} alt="Profile" className="h-full w-full object-cover" />
                ) : (
                  <div className="h-full w-full flex items-center justify-center bg-primary/10 text-primary font-bold">
                    {user?.firstName?.[0] || "U"}
                  </div>
                )}
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="text-sm font-semibold truncate">{user?.firstName} {user?.lastName}</p>
                <p className={cn("text-xs font-medium truncate capitalize", roleColor[role])}>{roleLabel[role] || role}</p>
              </div>
            </div>
          )}
          <button
            onClick={() => logout()}
            className={cn("w-full flex items-center gap-2 px-3 py-2 text-sm text-destructive hover:bg-destructive/10 rounded-lg transition-colors", desktopCollapsed && "justify-center")}
          >
            <LogOut className="h-4 w-4 shrink-0" />
            {!desktopCollapsed && <span>Sign Out</span>}
          </button>
        </div>
      </aside>

      {mobileOpen && <aside
        className="fixed left-0 top-0 h-screen w-64 bg-card border-r border-border flex flex-col z-40 lg:hidden"
        data-testid="sidebar-mobile"
      >
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <CarePulseLogo size="sm" variant="gradient" />
            <h1 className="font-display font-bold text-lg tracking-tight text-foreground">
              Care<span className="text-red-500">Pulse</span>
            </h1>
          </div>
          <Button variant="ghost" size="icon" onClick={onToggle} data-testid="sidebar-close">
            <X className="h-5 w-5 text-muted-foreground" />
          </Button>
        </div>

        <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = location === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={onToggle}
                className={cn(
                  "flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group",
                  isActive ? "bg-primary/10 text-primary font-semibold" : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <Icon className={cn("h-5 w-5 shrink-0", isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground")} />
                <span className="whitespace-nowrap">{link.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-border">
          <div className="flex items-center gap-3 mb-4 px-1">
            <div className="h-10 w-10 rounded-full bg-secondary overflow-hidden shrink-0">
              {user?.profileImageUrl ? (
                <img src={user.profileImageUrl} alt="Profile" className="h-full w-full object-cover" />
              ) : (
                <div className="h-full w-full flex items-center justify-center bg-primary/10 text-primary font-bold">
                  {user?.firstName?.[0] || "U"}
                </div>
              )}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-semibold truncate">{user?.firstName} {user?.lastName}</p>
              <p className={cn("text-xs font-medium truncate capitalize", roleColor[role])}>{roleLabel[role] || role}</p>
            </div>
          </div>
          <button
            onClick={() => logout()}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
          >
            <LogOut className="h-4 w-4 shrink-0" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>}
    </>
  );
}
