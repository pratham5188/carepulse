import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  Video, CalendarCheck, Clock, Stethoscope, User, CheckCircle2, Copy,
  ExternalLink, Loader2, AlertCircle, Wifi, Shield, X, Phone, MessageSquare
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";

const STORAGE_KEY = "carepulse-telemedicine-sessions";

const SPECIALTIES = [
  { value: "general", label: "General Physician", wait: "< 30 min" },
  { value: "cardiology", label: "Cardiologist", wait: "1–2 hours" },
  { value: "dermatology", label: "Dermatologist", wait: "< 1 hour" },
  { value: "psychiatry", label: "Psychiatrist / Mental Health", wait: "2–4 hours" },
  { value: "pediatrics", label: "Paediatrician", wait: "< 45 min" },
  { value: "neurology", label: "Neurologist", wait: "2–3 hours" },
  { value: "orthopedics", label: "Orthopaedic Surgeon", wait: "1–3 hours" },
  { value: "gynecology", label: "Gynaecologist / Obstetrician", wait: "1–2 hours" },
  { value: "endocrinology", label: "Endocrinologist (Diabetes/Thyroid)", wait: "2–4 hours" },
];

const TIME_SLOTS = [
  "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
  "12:00 PM", "02:00 PM", "02:30 PM", "03:00 PM", "03:30 PM", "04:00 PM",
  "04:30 PM", "05:00 PM", "06:00 PM", "06:30 PM", "07:00 PM",
];

interface TeleSession {
  id: string;
  specialty: string;
  specialtyLabel: string;
  date: string;
  time: string;
  reason: string;
  meetingLink: string;
  meetingId: string;
  status: "upcoming" | "completed" | "cancelled";
  bookedAt: string;
}

function generateMeetingId(): string {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  const seg = (n: number) => Array.from({ length: n }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
  // Use a format that works as a Jitsi Meet room name (no hyphens between parts — Jitsi rooms are single strings)
  return `CarePulse-${seg(4)}-${seg(4)}-${seg(4)}`;
}

function loadSessions(): TeleSession[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const sessions: TeleSession[] = JSON.parse(raw);
    // Migrate any old fake links to real Jitsi Meet links
    const migrated = sessions.map((s) =>
      s.meetingLink.includes("meet.carepulse.app")
        ? { ...s, meetingLink: `https://meet.jit.si/${s.meetingId}` }
        : s
    );
    return migrated;
  } catch { return []; }
}

function saveSessions(sessions: TeleSession[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
}

function statusBadge(status: string) {
  if (status === "upcoming") return <Badge className="bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400">Upcoming</Badge>;
  if (status === "completed") return <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400">Completed</Badge>;
  return <Badge className="bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400">Cancelled</Badge>;
}

export default function Telemedicine() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [sessions, setSessions] = useState<TeleSession[]>(loadSessions);
  const [specialty, setSpecialty] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [reason, setReason] = useState("");
  const [booking, setBooking] = useState(false);
  const [newSession, setNewSession] = useState<TeleSession | null>(null);
  const [copied, setCopied] = useState(false);
  const dateRef = useRef<HTMLInputElement>(null);

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split("T")[0];

  const handleBook = async () => {
    const effectiveDate = date || dateRef.current?.value || "";
    if (!specialty || !effectiveDate || !time || reason.trim().length < 5) return;
    if (!date && effectiveDate) setDate(effectiveDate);
    setBooking(true);

    await new Promise((r) => setTimeout(r, 1200));

    const meetingId = generateMeetingId();
    const session: TeleSession = {
      id: Date.now().toString(),
      specialty,
      specialtyLabel: SPECIALTIES.find((s) => s.value === specialty)?.label || specialty,
      date: effectiveDate,
      time,
      reason: reason.trim(),
      meetingLink: `https://meet.jit.si/${meetingId}`,
      meetingId,
      status: "upcoming",
      bookedAt: new Date().toISOString(),
    };

    const updated = [session, ...sessions];
    setSessions(updated);
    saveSessions(updated);
    setNewSession(session);
    setBooking(false);
    setSpecialty(""); setDate(""); setTime(""); setReason("");

    toast({ title: "Virtual consultation booked!", description: `Your session with ${session.specialtyLabel} is confirmed.`, duration: 3000 });
  };

  const cancelSession = (id: string) => {
    const updated = sessions.map((s) => s.id === id ? { ...s, status: "cancelled" as const } : s);
    setSessions(updated);
    saveSessions(updated);
    if (newSession?.id === id) setNewSession({ ...newSession, status: "cancelled" });
    toast({ title: "Session cancelled", duration: 2000 });
  };

  const copyLink = (link: string) => {
    navigator.clipboard.writeText(link).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast({ title: "Meeting link copied", duration: 1500 });
    });
  };

  const upcoming = sessions.filter((s) => s.status === "upcoming");
  const past = sessions.filter((s) => s.status !== "upcoming");

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-1">
          <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-blue-500 to-violet-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Video className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Telemedicine</h1>
            <p className="text-sm text-muted-foreground">Virtual consultations from the comfort of your home</p>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { icon: Shield, label: "Secure & Private", desc: "End-to-end encrypted video", color: "text-emerald-500", bg: "bg-emerald-500/10" },
          { icon: Clock, label: "Quick Booking", desc: "Confirmed in seconds", color: "text-blue-500", bg: "bg-blue-500/10" },
          { icon: Wifi, label: "Works Anywhere", desc: "Desktop, mobile or tablet", color: "text-violet-500", bg: "bg-violet-500/10" },
        ].map((f, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}>
            <Card className="border-border/60">
              <CardContent className="pt-4 pb-4 flex items-center gap-3">
                <div className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 ${f.bg}`}>
                  <f.icon className={`h-5 w-5 ${f.color}`} />
                </div>
                <div>
                  <p className="font-semibold text-sm">{f.label}</p>
                  <p className="text-xs text-muted-foreground">{f.desc}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {newSession && newSession.status === "upcoming" && (
        <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}>
          <Card className="border-emerald-500/30 bg-gradient-to-br from-emerald-500/5 to-blue-500/5">
            <CardContent className="pt-5 pb-4">
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                <span className="font-semibold text-emerald-700 dark:text-emerald-400">Consultation Confirmed!</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                <div className="p-3 rounded-lg bg-background/60 border">
                  <p className="text-xs text-muted-foreground">Doctor / Specialty</p>
                  <p className="font-semibold">{newSession.specialtyLabel}</p>
                </div>
                <div className="p-3 rounded-lg bg-background/60 border">
                  <p className="text-xs text-muted-foreground">Scheduled</p>
                  <p className="font-semibold">{new Date(newSession.date).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" })} at {newSession.time}</p>
                </div>
              </div>
              <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                <p className="text-xs font-semibold text-muted-foreground mb-1 flex items-center gap-1"><Video className="h-3 w-3" /> Your Meeting Link</p>
                <div className="flex items-center gap-2 flex-wrap">
                  <code className="text-sm font-mono text-primary flex-1 min-w-0 truncate">{newSession.meetingLink}</code>
                  <div className="flex gap-2 shrink-0">
                    <Button size="sm" variant="outline" className="gap-1.5 text-xs" onClick={() => copyLink(newSession.meetingLink)}>
                      <Copy className="h-3.5 w-3.5" />{copied ? "Copied!" : "Copy"}
                    </Button>
                    <Button size="sm" className="gap-1.5 text-xs" onClick={() => window.open(newSession.meetingLink, "_blank")}>
                      <ExternalLink className="h-3.5 w-3.5" />Join
                    </Button>
                  </div>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-3">
                Powered by <strong>Jitsi Meet</strong> — free, open-source, encrypted video conferencing. No account needed. Share the link with your doctor and click "Join" at your scheduled time.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <CalendarCheck className="h-5 w-5 text-blue-500" />
                Book Virtual Consultation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Medical Specialty</Label>
                <Select value={specialty} onValueChange={setSpecialty}>
                  <SelectTrigger><SelectValue placeholder="Choose a specialty" /></SelectTrigger>
                  <SelectContent>
                    {SPECIALTIES.map((s) => (
                      <SelectItem key={s.value} value={s.value}>
                        <div className="flex items-center justify-between gap-4 w-full">
                          <span>{s.label}</span>
                          <span className="text-xs text-muted-foreground ml-2">Wait: {s.wait}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {specialty && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Estimated wait: {SPECIALTIES.find((s) => s.value === specialty)?.wait}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Date</Label>
                  <Input
                    type="date"
                    value={date}
                    min={minDate}
                    data-testid="date-input"
                    ref={dateRef}
                    onChange={(e) => setDate(e.target.value)}
                    onInput={(e) => setDate((e.target as HTMLInputElement).value)}
                  />
                </div>
                <div>
                  <Label>Time Slot</Label>
                  <Select value={time} onValueChange={setTime}>
                    <SelectTrigger><SelectValue placeholder="Select time" /></SelectTrigger>
                    <SelectContent>
                      {TIME_SLOTS.map((t) => (
                        <SelectItem key={t} value={t}>{t}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label>Reason for Consultation</Label>
                <Textarea
                  placeholder="Briefly describe your symptoms or reason for the visit (e.g., 'I have been experiencing chest pain and shortness of breath for 3 days')"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  rows={3}
                />
              </div>

              <Button
                className="w-full gap-2"
                disabled={!specialty || !date || !time || reason.trim().length < 5 || booking}
                onClick={handleBook}
              >
                {booking ? <><Loader2 className="h-4 w-4 animate-spin" />Booking...</> : <><Video className="h-4 w-4" />Book Virtual Consultation</>}
              </Button>

              <div className="flex items-start gap-2 p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700/40">
                <AlertCircle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                <p className="text-xs text-amber-700 dark:text-amber-400">
                  For emergencies, call <strong>112</strong> (All Emergency) or <strong>108</strong> (Ambulance). Telemedicine is not a substitute for emergency care.
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }} className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Clock className="h-5 w-5 text-primary" />
                Upcoming Sessions ({upcoming.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {upcoming.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Video className="h-10 w-10 mx-auto mb-3 opacity-30" />
                  <p className="text-sm">No upcoming consultations. Book your first session!</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-80 overflow-y-auto">
                  {upcoming.map((s) => (
                    <div key={s.id} className="p-3 rounded-lg border bg-muted/30">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div>
                          <p className="font-semibold text-sm">{s.specialtyLabel}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(s.date).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" })} at {s.time}
                          </p>
                        </div>
                        <div className="flex gap-1.5 shrink-0">
                          {statusBadge(s.status)}
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground mb-2 line-clamp-1">{s.reason}</p>
                      <div className="flex gap-2">
                        <Button size="sm" className="text-xs h-7 gap-1" onClick={() => window.open(s.meetingLink, "_blank")}>
                          <Video className="h-3 w-3" />Join
                        </Button>
                        <Button size="sm" variant="outline" className="text-xs h-7 gap-1" onClick={() => copyLink(s.meetingLink)}>
                          <Copy className="h-3 w-3" />Copy Link
                        </Button>
                        <Button size="sm" variant="ghost" className="text-xs h-7 text-red-500 hover:text-red-600 gap-1 ml-auto" onClick={() => cancelSession(s.id)}>
                          <X className="h-3 w-3" />Cancel
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {past.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-muted-foreground">Past Sessions ({past.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {past.map((s) => (
                    <div key={s.id} className="flex items-center justify-between p-2.5 rounded-lg bg-muted/20 border border-border/50">
                      <div>
                        <p className="text-sm font-medium">{s.specialtyLabel}</p>
                        <p className="text-xs text-muted-foreground">{new Date(s.date).toLocaleDateString("en-IN")} at {s.time}</p>
                      </div>
                      {statusBadge(s.status)}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          <Card className="border-border/50 bg-muted/20">
            <CardContent className="pt-4 pb-4">
              <p className="text-xs font-semibold text-muted-foreground mb-2 flex items-center gap-1.5">
                <Shield className="h-3.5 w-3.5" /> How Telemedicine Works
              </p>
              <ol className="space-y-1.5 text-xs text-muted-foreground">
                <li className="flex gap-2"><span className="text-primary font-bold">1.</span>Select specialty, date, and time slot</li>
                <li className="flex gap-2"><span className="text-primary font-bold">2.</span>Describe your symptoms or concern</li>
                <li className="flex gap-2"><span className="text-primary font-bold">3.</span>Receive a real Jitsi Meet video room link</li>
                <li className="flex gap-2"><span className="text-primary font-bold">4.</span>Join at your scheduled time for a video consultation</li>
                <li className="flex gap-2"><span className="text-primary font-bold">5.</span>Receive e-prescription and follow-up plan</li>
              </ol>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
