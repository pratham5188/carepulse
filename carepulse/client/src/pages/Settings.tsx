import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { User, Bell, Shield, Loader2, LogOut, Moon, Sun, Monitor, Smartphone, Globe, Clock, ShieldCheck, ShieldOff, X, CheckCircle2, KeyRound, Lock, Eye, EyeOff } from "lucide-react";
import { queryClient } from "@/lib/queryClient";
import { motion, AnimatePresence } from "framer-motion";

type ThemeMode = "light" | "dark" | "system";

function getInitialTheme(): ThemeMode {
  const stored = localStorage.getItem("carepulse-theme");
  if (stored === "light" || stored === "dark" || stored === "system") return stored;
  return "system";
}

function applyTheme(mode: ThemeMode) {
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

function getBrowserName(): string {
  const ua = navigator.userAgent;
  if (ua.includes("Firefox")) return "Firefox";
  if (ua.includes("Edg")) return "Microsoft Edge";
  if (ua.includes("Chrome")) return "Chrome";
  if (ua.includes("Safari")) return "Safari";
  if (ua.includes("Opera") || ua.includes("OPR")) return "Opera";
  return "Unknown Browser";
}

function getOSName(): string {
  const ua = navigator.userAgent;
  if (ua.includes("Windows")) return "Windows";
  if (ua.includes("Mac OS")) return "macOS";
  if (ua.includes("Linux")) return "Linux";
  if (ua.includes("Android")) return "Android";
  if (ua.includes("iPhone") || ua.includes("iPad")) return "iOS";
  return "Unknown OS";
}

function getDeviceType(): string {
  const ua = navigator.userAgent;
  if (/Mobi|Android|iPhone|iPad/.test(ua)) return "Mobile";
  return "Desktop";
}

export default function Settings() {
  const { user, logout, isLoggingOut } = useAuth();
  const { toast } = useToast();
  const [firstName, setFirstName] = useState(user?.firstName || "");
  const [lastName, setLastName] = useState(user?.lastName || "");
  const [saving, setSaving] = useState(false);
  const [criticalAlerts, setCriticalAlerts] = useState(true);
  const [dailyReport, setDailyReport] = useState(false);
  const [theme, setTheme] = useState<ThemeMode>(getInitialTheme);

  const [twoFactorEnabled, setTwoFactorEnabled] = useState(() => {
    return localStorage.getItem("carepulse-2fa") === "true";
  });
  const [showTwoFactorSetup, setShowTwoFactorSetup] = useState(false);
  const [twoFactorCode, setTwoFactorCode] = useState("");
  const [twoFactorVerifying, setTwoFactorVerifying] = useState(false);

  const [showChangePassword, setShowChangePassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [cpNewPassword, setCpNewPassword] = useState("");
  const [cpConfirmPassword, setCpConfirmPassword] = useState("");
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);

  const [showSessions, setShowSessions] = useState(false);
  const [sessionLoginTime] = useState(() => {
    const stored = localStorage.getItem("carepulse-session-start");
    if (stored) return new Date(stored);
    const now = new Date();
    localStorage.setItem("carepulse-session-start", now.toISOString());
    return now;
  });

  useEffect(() => {
    applyTheme(theme);
    localStorage.setItem("carepulse-theme", theme);
  }, [theme]);

  useEffect(() => {
    if (theme !== "system") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => applyTheme("system");
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [theme]);

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ firstName, lastName }),
      });

      if (!res.ok) throw new Error("Failed to update profile");

      await queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });

      toast({
        title: "Profile updated",
        description: "Your changes have been saved successfully.",
      });
    } catch {
      toast({
        title: "Update failed",
        description: "Could not save your profile changes. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleToggleCriticalAlerts = () => {
    setCriticalAlerts(!criticalAlerts);
    toast({
      title: !criticalAlerts ? "Critical Alerts enabled" : "Critical Alerts disabled",
      description: !criticalAlerts
        ? "You will receive notifications for critical patient status changes."
        : "Critical patient alert notifications have been turned off.",
    });
  };

  const handleToggleDailyReport = () => {
    setDailyReport(!dailyReport);
    toast({
      title: !dailyReport ? "Daily Report enabled" : "Daily Report disabled",
      description: !dailyReport
        ? "You will receive daily summaries of disease trends and hospital capacity."
        : "Daily analytics report notifications have been turned off.",
    });
  };

  const handleTwoFactorToggle = () => {
    if (twoFactorEnabled) {
      setTwoFactorEnabled(false);
      localStorage.setItem("carepulse-2fa", "false");
      toast({
        title: "2FA Disabled",
        description: "Two-factor authentication has been turned off for your account.",
      });
    } else {
      setShowTwoFactorSetup(true);
      setTwoFactorCode("");
    }
  };

  const handleVerifyTwoFactor = () => {
    if (twoFactorCode.length !== 6 || !/^\d+$/.test(twoFactorCode)) {
      toast({
        title: "Invalid Code",
        description: "Please enter a valid 6-digit verification code.",
        variant: "destructive",
      });
      return;
    }
    setTwoFactorVerifying(true);
    setTimeout(() => {
      setTwoFactorEnabled(true);
      localStorage.setItem("carepulse-2fa", "true");
      setShowTwoFactorSetup(false);
      setTwoFactorCode("");
      setTwoFactorVerifying(false);
      toast({
        title: "2FA Enabled",
        description: "Two-factor authentication is now active on your account.",
      });
    }, 1500);
  };

  const handleChangePassword = async () => {
    if (!currentPassword || !cpNewPassword) {
      toast({ title: "Missing fields", description: "Please fill in all password fields.", variant: "destructive" });
      return;
    }
    if (cpNewPassword.length < 6) {
      toast({ title: "Password too short", description: "New password must be at least 6 characters.", variant: "destructive" });
      return;
    }
    if (cpNewPassword !== cpConfirmPassword) {
      toast({ title: "Passwords don't match", description: "New password and confirmation do not match.", variant: "destructive" });
      return;
    }
    setChangingPassword(true);
    try {
      const res = await fetch("/api/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ currentPassword, newPassword: cpNewPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      toast({ title: "Password Changed", description: "Your password has been updated successfully." });
      setShowChangePassword(false);
      setCurrentPassword("");
      setCpNewPassword("");
      setCpConfirmPassword("");
    } catch (err: any) {
      toast({ title: "Failed", description: err.message || "Could not change password.", variant: "destructive" });
    } finally {
      setChangingPassword(false);
    }
  };

  const sessionDuration = () => {
    const now = new Date();
    const diff = now.getTime() - sessionLoginTime.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto space-y-6 lg:space-y-8">
      <div className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-display font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your account preferences and system notifications.</p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              <CardTitle>Profile Information</CardTitle>
            </div>
            <CardDescription>Update your personal details and how others see you.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" type="email" defaultValue={user?.email || ""} disabled />
            </div>
            <div className="space-y-2">
              <Label>Role</Label>
              <Input value={user?.role || "patient"} disabled className="capitalize" />
            </div>
            <Button className="mt-2" onClick={handleSaveProfile} disabled={saving}>
              {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-primary" />
              <CardTitle>Notifications</CardTitle>
            </div>
            <CardDescription>Configure how you receive critical health alerts.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <button
              onClick={handleToggleCriticalAlerts}
              className="flex items-center justify-between w-full p-4 bg-secondary/30 rounded-xl hover:bg-secondary/50 transition-colors text-left"
            >
              <div className="space-y-0.5">
                <p className="font-medium">Critical Patient Alerts</p>
                <p className="text-sm text-muted-foreground">Receive push notifications for critical status changes.</p>
              </div>
              <div className={`h-6 w-11 rounded-full relative transition-colors ${criticalAlerts ? "bg-primary" : "bg-muted"}`}>
                <div className={`absolute top-1 h-4 w-4 bg-white rounded-full transition-all ${criticalAlerts ? "right-1" : "left-1"}`} />
              </div>
            </button>
            <button
              onClick={handleToggleDailyReport}
              className="flex items-center justify-between w-full p-4 bg-secondary/30 rounded-xl hover:bg-secondary/50 transition-colors text-left"
            >
              <div className="space-y-0.5">
                <p className="font-medium">Daily Analytics Report</p>
                <p className="text-sm text-muted-foreground">Summary of disease trends and hospital capacity.</p>
              </div>
              <div className={`h-6 w-11 rounded-full relative transition-colors ${dailyReport ? "bg-primary" : "bg-muted"}`}>
                <div className={`absolute top-1 h-4 w-4 bg-white rounded-full transition-all ${dailyReport ? "right-1" : "left-1"}`} />
              </div>
            </button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Moon className="h-5 w-5 text-primary" />
              <CardTitle>Appearance</CardTitle>
            </div>
            <CardDescription>Customize the look and feel of the application.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Label>Theme</Label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { value: "light" as ThemeMode, label: "Light", icon: Sun },
                  { value: "dark" as ThemeMode, label: "Dark", icon: Moon },
                  { value: "system" as ThemeMode, label: "System", icon: Monitor },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => {
                      setTheme(opt.value);
                      toast({
                        title: `${opt.label} mode activated`,
                        description: opt.value === "system"
                          ? "Theme will follow your device settings."
                          : `Switched to ${opt.label.toLowerCase()} mode.`,
                      });
                    }}
                    className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                      theme === opt.value
                        ? "border-primary bg-primary/5 text-primary"
                        : "border-border hover:border-muted-foreground/30 text-muted-foreground"
                    }`}
                  >
                    <opt.icon className="h-5 w-5" />
                    <span className="text-sm font-semibold">{opt.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              <CardTitle>Security</CardTitle>
            </div>
            <CardDescription>Manage your session and privacy settings.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-secondary/30 rounded-xl">
              <div className="flex items-center gap-3">
                {twoFactorEnabled ? (
                  <div className="h-10 w-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                    <ShieldCheck className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                ) : (
                  <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                    <ShieldOff className="h-5 w-5 text-muted-foreground" />
                  </div>
                )}
                <div>
                  <p className="text-sm font-medium">Two-Factor Authentication</p>
                  <p className="text-xs text-muted-foreground">
                    {twoFactorEnabled ? "Your account is protected with 2FA" : "Add an extra layer of security to your account"}
                  </p>
                </div>
              </div>
              <Button
                variant={twoFactorEnabled ? "destructive" : "default"}
                size="sm"
                onClick={handleTwoFactorToggle}
              >
                {twoFactorEnabled ? "Disable" : "Enable"}
              </Button>
            </div>

            <AnimatePresence>
              {showTwoFactorSetup && !twoFactorEnabled && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="border border-primary/20 bg-primary/5 rounded-xl p-5 space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-primary flex items-center gap-2">
                        <Shield className="h-4 w-4" />
                        Set Up Two-Factor Authentication
                      </h4>
                      <button onClick={() => setShowTwoFactorSetup(false)} className="p-1 hover:bg-muted rounded">
                        <X className="h-4 w-4 text-muted-foreground" />
                      </button>
                    </div>

                    <div className="space-y-3">
                      <div className="bg-card border border-border rounded-lg p-4">
                        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Step 1</p>
                        <p className="text-sm">Download an authenticator app like <strong>Google Authenticator</strong> or <strong>Microsoft Authenticator</strong> on your phone.</p>
                      </div>
                      <div className="bg-card border border-border rounded-lg p-4">
                        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Step 2</p>
                        <p className="text-sm mb-3">Scan this QR code or enter the setup key manually in your authenticator app.</p>
                        <div className="flex items-center gap-4">
                          <div className="h-28 w-28 bg-white rounded-lg border border-border flex items-center justify-center shrink-0">
                            <div className="grid grid-cols-5 gap-[2px]">
                              {Array.from({ length: 25 }, (_, i) => (
                                <div
                                  key={i}
                                  className={`h-4 w-4 ${[0,1,2,3,4,5,9,10,14,15,19,20,21,22,23,24,6,8,12,16,18].includes(i) ? "bg-black" : "bg-white"}`}
                                />
                              ))}
                            </div>
                          </div>
                          <div className="space-y-2">
                            <p className="text-xs text-muted-foreground">Setup Key:</p>
                            <code className="text-xs bg-muted px-2 py-1 rounded font-mono select-all">
                              JBSW Y3DP EHPK 3PXP
                            </code>
                          </div>
                        </div>
                      </div>
                      <div className="bg-card border border-border rounded-lg p-4">
                        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Step 3</p>
                        <p className="text-sm mb-3">Enter the 6-digit code from your authenticator app to verify setup.</p>
                        <div className="flex items-center gap-3">
                          <Input
                            value={twoFactorCode}
                            onChange={(e) => {
                              const val = e.target.value.replace(/\D/g, "").slice(0, 6);
                              setTwoFactorCode(val);
                            }}
                            placeholder="000000"
                            maxLength={6}
                            className="w-36 text-center font-mono text-lg tracking-widest"
                          />
                          <Button
                            onClick={handleVerifyTwoFactor}
                            disabled={twoFactorCode.length !== 6 || twoFactorVerifying}
                            size="sm"
                          >
                            {twoFactorVerifying ? (
                              <>
                                <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                                Verifying...
                              </>
                            ) : (
                              <>
                                <CheckCircle2 className="h-4 w-4 mr-1" />
                                Verify & Enable
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex items-center justify-between p-4 bg-secondary/30 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <Globe className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-sm font-medium">Active Sessions</p>
                  <p className="text-xs text-muted-foreground">Manage devices logged into your account</p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowSessions(!showSessions)}
              >
                {showSessions ? "Hide" : "View All"}
              </Button>
            </div>

            <AnimatePresence>
              {showSessions && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="border border-border rounded-xl divide-y divide-border">
                    <div className="p-4 flex items-center gap-4">
                      <div className="h-10 w-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center shrink-0">
                        {getDeviceType() === "Mobile" ? (
                          <Smartphone className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                        ) : (
                          <Monitor className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium">{getBrowserName()} on {getOSName()}</p>
                          <span className="px-2 py-0.5 text-[10px] font-bold uppercase bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 rounded-full">
                            Current
                          </span>
                        </div>
                        <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            Active for {sessionDuration()}
                          </span>
                          <span>
                            Logged in {sessionLoginTime.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          {user?.email}
                        </p>
                      </div>
                    </div>

                    <div className="p-3 bg-muted/30">
                      <p className="text-xs text-center text-muted-foreground">
                        This is your only active session. If you notice any suspicious activity, sign out and change your password immediately.
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex items-center justify-between p-4 bg-secondary/30 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                  <KeyRound className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <p className="text-sm font-medium">Change Password</p>
                  <p className="text-xs text-muted-foreground">Update your account password</p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowChangePassword(!showChangePassword)}
              >
                {showChangePassword ? "Cancel" : "Change"}
              </Button>
            </div>

            <AnimatePresence>
              {showChangePassword && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="border border-border rounded-xl p-5 space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="currentPw">Current Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="currentPw"
                          type={showCurrentPw ? "text" : "password"}
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          placeholder="Enter current password"
                          className="pl-10 pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowCurrentPw(!showCurrentPw)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                          {showCurrentPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="newPw">New Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="newPw"
                          type={showNewPw ? "text" : "password"}
                          value={cpNewPassword}
                          onChange={(e) => setCpNewPassword(e.target.value)}
                          placeholder="Min. 6 characters"
                          className="pl-10 pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPw(!showNewPw)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                          {showNewPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPw">Confirm New Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="confirmPw"
                          type="password"
                          value={cpConfirmPassword}
                          onChange={(e) => setCpConfirmPassword(e.target.value)}
                          placeholder="Re-enter new password"
                          className="pl-10"
                        />
                      </div>
                    </div>
                    <Button
                      onClick={handleChangePassword}
                      disabled={changingPassword || !currentPassword || !cpNewPassword || !cpConfirmPassword}
                      className="w-full"
                    >
                      {changingPassword ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Updating...
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="h-4 w-4 mr-2" />
                          Update Password
                        </>
                      )}
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="pt-4 border-t border-border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-red-600">Sign Out</p>
                  <p className="text-xs text-muted-foreground">End your current session and return to the login page.</p>
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => logout()}
                  disabled={isLoggingOut}
                >
                  {isLoggingOut ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogOut className="h-4 w-4 mr-1" />}
                  Sign Out
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
