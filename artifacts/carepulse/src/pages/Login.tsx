import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { Mail, Lock, User, Shield, Stethoscope, Eye, EyeOff, ArrowRight, ArrowLeft, KeyRound, Loader2, CheckCircle2, Phone, Building2, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { CarePulseLogoAnimated, CarePulseLogo } from "@/components/CarePulseLogo";

interface HospitalOption {
  id: number;
  name: string;
  city: string;
  state: string;
}

type PageView = "login" | "register" | "forgot" | "otp";

export default function Login() {
  const [isRegister, setIsRegister] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [pageView, setPageView] = useState<PageView>("login");
  const [form, setForm] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    phone: "",
    role: "patient",
  });
  const [regHospitalSearch, setRegHospitalSearch] = useState("");
  const [regHospitalId, setRegHospitalId] = useState<number | null>(null);
  const [regHospitalLabel, setRegHospitalLabel] = useState("");
  const [regHospitalOptions, setRegHospitalOptions] = useState<HospitalOption[]>([]);
  const [regHospitalOpen, setRegHospitalOpen] = useState(false);
  const hospitalRef = useRef<HTMLDivElement>(null);

  const [error, setError] = useState("");
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotPhone, setForgotPhone] = useState("");
  const [otpMethod, setOtpMethod] = useState<"email" | "sms">("email");
  const [otpCode, setOtpCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [forgotLoading, setForgotLoading] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  const { login, register, isLoggingIn, isRegistering } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (regHospitalId) return;
    const search = regHospitalSearch.trim();
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/public/hospitals-search?q=${encodeURIComponent(search)}`);
        if (res.ok) setRegHospitalOptions(await res.json());
      } catch {}
    }, search.length === 0 ? 0 : 250);
    return () => clearTimeout(timer);
  }, [regHospitalSearch, regHospitalId]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (hospitalRef.current && !hospitalRef.current.contains(e.target as Node)) {
        setRegHospitalOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      toast({
        title: detail?.name || "Login Successful!",
        description: "You are now signed in to CarePulse.",
        duration: 3000,
      });
    };
    window.addEventListener("carepulse:login-success", handler);
    return () => window.removeEventListener("carepulse:login-success", handler);
  }, [toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      if (isRegister) {
        if (!form.firstName || !form.lastName) {
          setError("Please fill in all fields");
          return;
        }
        if ((form.role === "doctor" || form.role === "admin") && !regHospitalId) {
          setError("Please select your hospital");
          return;
        }
        await register({ ...form, hospitalId: regHospitalId });
      } else {
        await login({ email: form.email, password: form.password });
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    }
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!forgotEmail) {
      setError("Please enter your email address");
      return;
    }
    setForgotLoading(true);
    try {
      const res = await fetch("/api/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotEmail, method: "email" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setOtpCode("");
      setPageView("otp");
      toast({
        title: "OTP Sent",
        description: `A 6-digit verification code has been sent to ${forgotEmail}. Check your inbox and spam folder.`,
      });
    } catch (err: any) {
      setError(err.message || "Failed to send OTP");
    } finally {
      setForgotLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (otpCode.length !== 6) {
      setError("Please enter a valid 6-digit OTP");
      return;
    }
    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setResetLoading(true);
    try {
      const resetBody = { email: forgotEmail, otp: otpCode, newPassword };
      const res = await fetch("/api/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(resetBody),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setResetSuccess(true);
      toast({ title: "Password Reset", description: "Your password has been changed successfully." });
    } catch (err: any) {
      setError(err.message || "Failed to reset password");
    } finally {
      setResetLoading(false);
    }
  };

  const backToLogin = () => {
    setPageView("login");
    setIsRegister(false);
    setError("");
    setForgotEmail("");
    setOtpCode("");
    setNewPassword("");
    setConfirmPassword("");
    setResetSuccess(false);
  };

  const roles = [
    { value: "patient", label: "Patient", icon: User, desc: "View health insights & disease awareness" },
    { value: "doctor", label: "Doctor", icon: Stethoscope, desc: "Full analytics, alerts & patient management" },
    { value: "admin", label: "Admin", icon: Shield, desc: "Manage users, platform analytics & audit logs" },
  ];

  const isSubmitting = isLoggingIn || isRegistering;

  const floatingOrbs = [
    { top: "5%", left: "5%", size: "min(45vw, 16rem)", color: "bg-blue-400/20 lg:bg-blue-400/15", duration: 25, delay: 0 },
    { top: "50%", right: "0%", size: "min(50vw, 20rem)", color: "bg-cyan-400/15 lg:bg-cyan-400/10", duration: 30, delay: 3 },
    { bottom: "3%", left: "25%", size: "min(40vw, 14rem)", color: "bg-indigo-400/15 lg:bg-indigo-400/10", duration: 28, delay: 6 },
  ];

  const particles = Array.from({ length: 6 }, (_, i) => ({
    id: i,
    left: `${10 + (i * 47) % 80}%`,
    size: 2 + (i % 2),
    duration: 12 + (i % 4) * 3,
    delay: (i * 1.5) % 8,
  }));

  const pulseLines = [
    { top: "30%", duration: 14, delay: 0 },
    { top: "70%", duration: 16, delay: 5 },
  ];

  return (
    <div className="min-h-[100dvh] flex flex-col lg:flex-row relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-100/80 via-sky-50/60 to-cyan-100/50 lg:from-slate-50 lg:via-blue-50/50 lg:to-cyan-50/30 dark:from-slate-950 dark:via-blue-950/30 dark:to-cyan-950/20" />

      {floatingOrbs.map((orb, i) => (
        <motion.div
          key={`orb-${i}`}
          className={`absolute ${orb.color} rounded-full blur-3xl pointer-events-none`}
          style={{
            width: orb.size,
            height: orb.size,
            top: orb.top,
            left: orb.left,
            right: orb.right,
            bottom: orb.bottom,
          }}
          animate={{
            x: [0, 30, -20, 15, 0],
            y: [0, -20, 15, -25, 0],
            scale: [1, 1.15, 0.95, 1.1, 1],
            opacity: [0.3, 0.5, 0.35, 0.45, 0.3],
          }}
          transition={{
            duration: orb.duration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: orb.delay,
          }}
        />
      ))}

      {particles.map((p) => (
        <motion.div
          key={`particle-${p.id}`}
          className="absolute rounded-full bg-primary/40 lg:bg-primary/25 pointer-events-none"
          style={{ left: p.left, width: p.size + 1, height: p.size + 1, bottom: 0 }}
          animate={{
            y: [0, "-100vh"],
            opacity: [0, 0.8, 0],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            ease: "linear",
            delay: p.delay,
          }}
        />
      ))}

      {pulseLines.map((line, i) => (
        <svg
          key={`pulse-${i}`}
          className="absolute left-0 w-full pointer-events-none"
          style={{ top: line.top }}
          height="30"
          preserveAspectRatio="none"
          viewBox="0 0 100 30"
        >
          <motion.path
            d="M0 15 L15 15 L18 4 L22 26 L26 8 L30 22 L33 15 L50 15 L53 4 L57 26 L61 8 L65 22 L68 15 L82 15 L85 4 L89 26 L93 8 L97 22 L100 15"
            fill="none"
            stroke="currentColor"
            className="text-primary/[0.15] lg:text-primary/[0.07]"
            strokeWidth="0.8"
            vectorEffect="non-scaling-stroke"
            animate={{ pathLength: [0, 1], opacity: [0, 0.6, 0] }}
            transition={{
              pathLength: { duration: line.duration, repeat: Infinity, ease: "linear", delay: line.delay },
              opacity: { duration: line.duration, repeat: Infinity, ease: "easeInOut", delay: line.delay },
            }}
          />
        </svg>
      ))}

      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary via-primary/90 to-accent relative overflow-hidden z-10">
        <div className="absolute inset-0 opacity-10">
          <motion.div
            className="absolute top-[10%] left-[10%] w-[40%] h-[40%] bg-white rounded-full blur-3xl"
            animate={{ scale: [1, 1.2, 1], opacity: [0.8, 1, 0.8] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute bottom-[10%] right-[10%] w-[50%] h-[50%] bg-white rounded-full blur-3xl"
            animate={{ scale: [1.2, 1, 1.2], opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          />
        </div>

        <motion.div
          className="absolute top-[15%] right-[10%] w-[20%] aspect-square rounded-full border border-white/10"
          animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1], rotate: [0, 180, 360] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-[20%] left-[5%] w-[25%] aspect-square rounded-full border border-white/10"
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.05, 0.15, 0.05], rotate: [360, 180, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-[50%] left-[50%] w-[15%] aspect-square rounded-full border border-white/5"
          animate={{ scale: [1, 1.5, 1], opacity: [0.05, 0.1, 0.05], x: ["-50%", "-30%", "-50%"], y: ["-50%", "-40%", "-50%"] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />

        {Array.from({ length: 4 }).map((_, i) => (
          <motion.div
            key={`left-particle-${i}`}
            className="absolute w-1 h-1 bg-white/20 rounded-full"
            style={{ left: `${15 + (i * 37) % 70}%`, top: `${15 + (i * 53) % 70}%` }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.15, 0.4, 0.15],
            }}
            transition={{ duration: 5 + (i % 3), repeat: Infinity, ease: "easeInOut", delay: i * 1.5 }}
          />
        ))}

        <div className="relative z-10 flex flex-col justify-center items-center w-full px-8 xl:px-16 text-white">
          <CarePulseLogoAnimated />

          <motion.div
            className="mt-10 xl:mt-16 space-y-3 xl:space-y-4 w-full max-w-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4, duration: 0.6 }}
          >
            {[
              { icon: Shield, text: "Role-Based Access Control" },
              { icon: Stethoscope, text: "AI-Powered Medical Insights" },
            ].map((item, i) => (
              <motion.div
                key={i}
                className="flex items-center gap-3 text-white/80"
                animate={{ opacity: [0.6, 1, 0.6], x: [0, 5, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: i * 0.5 }}
              >
                <motion.div
                  className="h-8 w-8 rounded-lg bg-white/10 flex items-center justify-center shrink-0"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: i * 0.3 }}
                >
                  <item.icon className="h-4 w-4" />
                </motion.div>
                <span className="text-sm font-medium">{item.text}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      <div className="lg:hidden absolute top-0 left-0 right-0 h-[35vh] bg-gradient-to-b from-primary/20 via-primary/10 to-transparent pointer-events-none z-[5]">
        <motion.div
          className="absolute top-[10%] left-[15%] w-[30vw] h-[30vw] bg-primary/20 rounded-full blur-3xl"
          animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.6, 0.3], x: [0, 20, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-[5%] right-[10%] w-[25vw] h-[25vw] bg-accent/20 rounded-full blur-3xl"
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.2, 0.5, 0.2], y: [0, 15, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />
      </div>

      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="lg:hidden flex flex-col items-center gap-2 mb-6 sm:mb-8">
            <CarePulseLogo size="lg" />
            <span className="font-display font-bold text-2xl">Care<span className="text-red-500">Pulse</span></span>
            <span className="text-muted-foreground text-xs font-medium tracking-wide">Intelligent Healthcare Analytics</span>
          </div>

          <AnimatePresence mode="wait">
            {pageView === "forgot" || pageView === "otp" ? (
              <motion.div
                key="forgot-flow"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <div className="text-center mb-6 sm:mb-8">
                  <div className="mx-auto h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                    <KeyRound className="h-7 w-7 text-primary" />
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-display font-bold mb-2">
                    {resetSuccess ? "Password Reset" : pageView === "forgot" ? "Forgot Password" : "Verify & Reset"}
                  </h1>
                  <p className="text-muted-foreground text-sm sm:text-base">
                    {resetSuccess
                      ? "Your password has been changed successfully"
                      : pageView === "forgot"
                      ? "Enter your email to receive a verification code"
                      : "Enter the OTP sent to your email and set a new password"}
                  </p>
                </div>

                <AnimatePresence mode="wait">
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-xl text-destructive text-sm font-medium"
                    >
                      {error}
                    </motion.div>
                  )}
                </AnimatePresence>

                {resetSuccess ? (
                  <div className="space-y-4">
                    <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl flex items-center gap-3">
                      <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
                      <p className="text-sm text-emerald-700 dark:text-emerald-300">You can now sign in with your new password.</p>
                    </div>
                    <button
                      onClick={backToLogin}
                      className="w-full flex items-center justify-center gap-2 py-2.5 sm:py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      Back to Sign In
                    </button>
                  </div>
                ) : pageView === "forgot" ? (
                  <form onSubmit={handleSendOtp} className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-foreground mb-1.5 block">Email Address</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <input
                          type="email"
                          value={forgotEmail}
                          onChange={(e) => setForgotEmail(e.target.value)}
                          className="w-full pl-10 pr-4 py-2.5 sm:py-3 rounded-xl border border-border bg-card focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm"
                          placeholder="Enter your registered email"
                          required
                          data-testid="input-forgot-email"
                        />
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">A 6-digit OTP will be sent to this email address.</p>
                    </div>

                    <button
                      type="submit"
                      disabled={forgotLoading}
                      data-testid="btn-send-otp"
                      className="w-full flex items-center justify-center gap-2 py-2.5 sm:py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-primary/20"
                    >
                      {forgotLoading ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        <>
                          Send OTP via Email
                          <ArrowRight className="h-4 w-4" />
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={backToLogin}
                      className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center justify-center gap-1"
                    >
                      <ArrowLeft className="h-3 w-3" />
                      Back to Sign In
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handleResetPassword} className="space-y-4">
                    <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl">
                      <p className="text-sm text-blue-700 dark:text-blue-300 text-center">
                        A 6-digit OTP has been sent to <strong>{forgotEmail}</strong>. Check your inbox and spam folder.
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground mb-1.5 block">Verification Code</label>
                      <input
                        type="text"
                        value={otpCode}
                        onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                        className="w-full px-4 py-2.5 sm:py-3 rounded-xl border border-border bg-card focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-center text-lg font-mono tracking-[0.4em]"
                        placeholder="Enter 6-digit code"
                        maxLength={6}
                        required
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground mb-1.5 block">New Password</label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <input
                          type={showNewPassword ? "text" : "password"}
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="w-full pl-10 pr-12 py-2.5 sm:py-3 rounded-xl border border-border bg-card focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm"
                          placeholder="Min. 6 characters"
                          minLength={6}
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground mb-1.5 block">Confirm Password</label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <input
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="w-full pl-10 pr-4 py-2.5 sm:py-3 rounded-xl border border-border bg-card focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm"
                          placeholder="Re-enter new password"
                          minLength={6}
                          required
                        />
                      </div>
                    </div>
                    <button
                      type="submit"
                      disabled={resetLoading || otpCode.length !== 6}
                      className="w-full flex items-center justify-center gap-2 py-2.5 sm:py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-primary/20"
                    >
                      {resetLoading ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        <>
                          Reset Password
                          <CheckCircle2 className="h-4 w-4" />
                        </>
                      )}
                    </button>
                    <div className="flex items-center justify-between">
                      <button
                        type="button"
                        onClick={async () => {
                          setError("");
                          setOtpCode("");
                          setForgotLoading(true);
                          try {
                            const body = otpMethod === "sms"
                              ? { phone: forgotPhone, email: forgotEmail, method: "sms" }
                              : { email: forgotEmail, method: "email" };
                            const res = await fetch("/api/forgot-password", {
                              method: "POST",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify(body),
                            });
                            const data = await res.json();
                            if (!res.ok) throw new Error(data.message);
                            setOtpCode("");
                            toast({
                              title: "OTP Resent",
                              description: otpMethod === "sms"
                                ? "A new verification code has been sent to your mobile."
                                : "A new verification code has been sent to your email. Check your inbox and spam folder.",
                            });
                          } catch (err: any) {
                            setError(err.message || "Failed to resend OTP");
                          } finally {
                            setForgotLoading(false);
                          }
                        }}
                        disabled={forgotLoading}
                        className="text-sm text-primary font-medium hover:underline transition-colors flex items-center gap-1 disabled:opacity-50"
                      >
                        {forgotLoading ? <Loader2 className="h-3 w-3 animate-spin" /> : <ArrowLeft className="h-3 w-3" />}
                        Resend OTP
                      </button>
                      <button
                        type="button"
                        onClick={backToLogin}
                        className="text-sm text-primary font-semibold hover:underline"
                      >
                        Back to Sign In
                      </button>
                    </div>
                  </form>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="login-register"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                <div className="text-center mb-6 sm:mb-8">
                  <h1 className="text-2xl sm:text-3xl font-display font-bold mb-2">
                    {isRegister ? "Create Account" : "Welcome Back"}
                  </h1>
                  <p className="text-muted-foreground text-sm sm:text-base">
                    {isRegister ? "Register to access the healthcare platform" : "Sign in to your account"}
                  </p>
                </div>

                <AnimatePresence mode="wait">
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-xl text-destructive text-sm font-medium"
                    >
                      {error}
                    </motion.div>
                  )}
                </AnimatePresence>

                <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
                  <AnimatePresence mode="wait">
                    {isRegister && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-3 sm:space-y-4"
                      >
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="text-sm font-medium text-foreground mb-1.5 block">First Name</label>
                            <div className="relative">
                              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                              <input
                                type="text"
                                value={form.firstName}
                                onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                                className="w-full pl-10 pr-4 py-2.5 sm:py-3 rounded-xl border border-border bg-card focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm"
                                placeholder="John"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-foreground mb-1.5 block">Last Name</label>
                            <div className="relative">
                              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                              <input
                                type="text"
                                value={form.lastName}
                                onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                                className="w-full pl-10 pr-4 py-2.5 sm:py-3 rounded-xl border border-border bg-card focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm"
                                placeholder="Doe"
                              />
                            </div>
                          </div>
                        </div>

                        <div>
                          <label className="text-sm font-medium text-foreground mb-1.5 block">Mobile Number</label>
                          <div className="relative">
                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <span className="absolute left-9 top-1/2 -translate-y-1/2 text-sm text-muted-foreground font-medium">+91</span>
                            <input
                              type="tel"
                              value={form.phone}
                              onChange={(e) => setForm({ ...form, phone: e.target.value.replace(/\D/g, "").slice(0, 10) })}
                              className="w-full pl-[4.5rem] pr-4 py-2.5 sm:py-3 rounded-xl border border-border bg-card focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm"
                              placeholder="9876543210"
                              data-testid="input-phone"
                            />
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">Optional — used for account verification</p>
                        </div>

                        <div>
                          <label className="text-sm font-medium text-foreground mb-2 block">Select Your Role</label>
                          <div className="grid grid-cols-2 sm:grid-cols-2 gap-2">
                            {roles.map((r) => (
                              <button
                                key={r.value}
                                type="button"
                                onClick={() => {
                                  setForm({ ...form, role: r.value });
                                  if (r.value === "patient") {
                                    setRegHospitalId(null);
                                    setRegHospitalLabel("");
                                    setRegHospitalSearch("");
                                  }
                                }}
                                className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all text-center ${
                                  form.role === r.value
                                    ? "border-primary bg-primary/5 text-primary"
                                    : "border-border hover:border-muted-foreground/30 text-muted-foreground"
                                }`}
                              >
                                <r.icon className="h-5 w-5" />
                                <span className="text-xs font-semibold">{r.label}</span>
                              </button>
                            ))}
                          </div>
                        </div>

                        {(form.role === "doctor" || form.role === "admin") && (
                          <div ref={hospitalRef} className="relative">
                            <label className="text-sm font-medium text-foreground mb-1.5 block">
                              Your Hospital <span className="text-destructive">*</span>
                            </label>
                            <div className="relative">
                              <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                              <input
                                type="text"
                                value={regHospitalId ? regHospitalLabel : regHospitalSearch}
                                onChange={(e) => {
                                  if (regHospitalId) {
                                    setRegHospitalId(null);
                                    setRegHospitalLabel("");
                                  }
                                  setRegHospitalSearch(e.target.value);
                                  setRegHospitalOpen(true);
                                }}
                                onFocus={() => setRegHospitalOpen(true)}
                                className="w-full pl-10 pr-8 py-2.5 sm:py-3 rounded-xl border border-border bg-card focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm"
                                placeholder="Search hospital by name or city…"
                                autoComplete="off"
                              />
                              <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                            </div>
                            {regHospitalId && (
                              <p className="text-xs text-emerald-600 mt-1 flex items-center gap-1">
                                <CheckCircle2 className="h-3 w-3" /> Hospital selected
                              </p>
                            )}
                            {!regHospitalId && !regHospitalLabel && (
                              <p className="text-xs text-muted-foreground mt-1">Click to browse or type to search all hospitals</p>
                            )}
                            {regHospitalOpen && regHospitalOptions.length > 0 && !regHospitalId && (
                              <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-card border border-border rounded-xl shadow-lg max-h-48 overflow-y-auto">
                                {regHospitalOptions.map((h) => (
                                  <button
                                    key={h.id}
                                    type="button"
                                    onClick={() => {
                                      setRegHospitalId(h.id);
                                      setRegHospitalLabel(`${h.name} — ${h.city}, ${h.state}`);
                                      setRegHospitalSearch("");
                                      setRegHospitalOpen(false);
                                      setRegHospitalOptions([]);
                                    }}
                                    className="w-full text-left px-4 py-2.5 hover:bg-muted transition-colors text-sm"
                                  >
                                    <div className="font-medium text-foreground">{h.name}</div>
                                    <div className="text-xs text-muted-foreground">{h.city}, {h.state}</div>
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">Email</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <input
                        type="email"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        className="w-full pl-10 pr-4 py-2.5 sm:py-3 rounded-xl border border-border bg-card focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm"
                        placeholder="doctor@hospital.com"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-sm font-medium text-foreground">Password</label>
                      {!isRegister && (
                        <button
                          type="button"
                          onClick={() => { setPageView("forgot"); setError(""); setForgotEmail(form.email); }}
                          className="text-xs text-primary font-semibold hover:underline"
                        >
                          Forgot Password?
                        </button>
                      )}
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <input
                        type={showPassword ? "text" : "password"}
                        value={form.password}
                        onChange={(e) => setForm({ ...form, password: e.target.value })}
                        className="w-full pl-10 pr-12 py-2.5 sm:py-3 rounded-xl border border-border bg-card focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm"
                        placeholder="Enter your password"
                        required
                        minLength={6}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex items-center justify-center gap-2 py-2.5 sm:py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-primary/20"
                  >
                    {isSubmitting ? (
                      <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    ) : (
                      <>
                        {isRegister ? "Create Account" : "Sign In"}
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </button>
                </form>

                <div className="mt-4 sm:mt-6 text-center">
                  <p className="text-sm text-muted-foreground">
                    {isRegister ? "Already have an account?" : "Don't have an account?"}{" "}
                    <button
                      onClick={() => { setIsRegister(!isRegister); setError(""); }}
                      className="text-primary font-semibold hover:underline"
                    >
                      {isRegister ? "Sign In" : "Register"}
                    </button>
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-6 sm:mt-8 p-3 sm:p-4 bg-muted/50 rounded-xl border border-border">
            <p className="text-xs text-muted-foreground text-center">
              <Shield className="h-3 w-3 inline mr-1" />
              Secured with bcrypt password hashing. Your data is encrypted and HIPAA compliant.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
