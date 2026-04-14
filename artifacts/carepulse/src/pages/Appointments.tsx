import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { motion, AnimatePresence } from "framer-motion";
import {
  CalendarDays, Clock, Plus, CheckCircle2, XCircle, Calendar,
  Building2, User, FileText, Filter, ChevronDown, Search, MapPin, X, RefreshCw,
  AlertTriangle
} from "lucide-react";
import { getHolidayInfo, isHoliday, getHolidayEmoji, getTodayIST } from "@/lib/india-holidays";
import type { Appointment } from "@shared/schema";

type HospitalOption = { id: number; name: string; city: string; state: string };

const statusColors: Record<string, string> = {
  scheduled: "bg-blue-100 text-blue-700 border-blue-200",
  completed: "bg-emerald-100 text-emerald-700 border-emerald-200",
  cancelled: "bg-red-100 text-red-700 border-red-200",
};

const statusIcons: Record<string, typeof CalendarDays> = {
  scheduled: CalendarDays,
  completed: CheckCircle2,
  cancelled: XCircle,
};

export default function Appointments() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showBooking, setShowBooking] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editNotes, setEditNotes] = useState("");
  const [rescheduleAppt, setRescheduleAppt] = useState<Appointment | null>(null);
  const [rescheduleDate, setRescheduleDate] = useState("");
  const [rescheduleTime, setRescheduleTime] = useState("");
  const [hospitalSearch, setHospitalSearch] = useState("");
  const [hospitalDropdownOpen, setHospitalDropdownOpen] = useState(false);
  const hospitalInputRef = useRef<HTMLInputElement>(null);
  const hospitalDropdownRef = useRef<HTMLDivElement>(null);

  const isDoctor = user?.role === "doctor";
  const isPatient = user?.role === "patient";

  const { data: appointments = [], isLoading } = useQuery<Appointment[]>({
    queryKey: ["/api/appointments"],
    queryFn: async () => {
      const res = await fetch("/api/appointments", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch appointments");
      return res.json();
    },
  });

  const [hospitalSearchDebounced, setHospitalSearchDebounced] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setHospitalSearchDebounced(hospitalSearch);
    }, 300);
    return () => clearTimeout(timer);
  }, [hospitalSearch]);

  const { data: hospitals = [] } = useQuery<HospitalOption[]>({
    queryKey: ["/api/hospitals-list", hospitalSearchDebounced],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (hospitalSearchDebounced) params.set("search", hospitalSearchDebounced);
      params.set("limit", "50");
      const res = await fetch(`/api/hospitals-list?${params}`, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch hospitals");
      return res.json();
    },
  });

  const [form, setForm] = useState({
    hospitalId: "",
    doctorName: "",
    date: "",
    time: "",
    reason: "",
    patientEmail: "",
    patientName: "",
  });

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiRequest("POST", "/api/appointments", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/appointments"] });
      setShowBooking(false);
      setForm({ hospitalId: "", doctorName: "", date: "", time: "", reason: "", patientEmail: "", patientName: "" });
      toast({ title: "Appointment booked successfully!" });
    },
    onError: (err: Error) => {
      toast({ title: "Failed to book appointment", description: err.message, variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      const res = await apiRequest("PATCH", `/api/appointments/${id}`, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/appointments"] });
      setEditingId(null);
      setEditNotes("");
      toast({ title: "Appointment updated!" });
    },
    onError: (err: Error) => {
      toast({ title: "Failed to update", description: err.message, variant: "destructive" });
    },
  });

  const handleBook = () => {
    if (!form.date || !form.time || !form.reason) {
      toast({ title: "Please fill in all required fields", variant: "destructive" });
      return;
    }
    if (form.date < today) {
      toast({ title: "Cannot book for a past date", description: "Please select today or a future date.", variant: "destructive" });
      return;
    }
    if (selectedDateHoliday) {
      toast({
        title: `Holiday: ${selectedDateHoliday.name}`,
        description: "Appointments are not available on public holidays. Please select a different date.",
        variant: "destructive"
      });
      return;
    }
    if (!isPatient && !form.patientEmail) {
      toast({ title: "Please enter patient email", variant: "destructive" });
      return;
    }
    createMutation.mutate({
      hospitalId: form.hospitalId ? Number(form.hospitalId) : null,
      doctorName: form.doctorName || null,
      date: form.date,
      time: form.time,
      reason: form.reason,
      ...((!isPatient && form.patientEmail) ? { patientEmail: form.patientEmail, patientName: form.patientName || form.patientEmail } : {}),
    });
  };

  const filtered = statusFilter === "all"
    ? appointments
    : appointments.filter((a) => a.status === statusFilter);

  const upcoming = filtered.filter((a) => a.status === "scheduled");
  const past = filtered.filter((a) => a.status !== "scheduled");

  const filteredHospitals = hospitals;

  const [selectedHospitalCache, setSelectedHospitalCache] = useState<HospitalOption | null>(null);
  const selectedHospital = selectedHospitalCache || hospitals.find((h) => String(h.id) === form.hospitalId) || null;

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        hospitalDropdownRef.current &&
        !hospitalDropdownRef.current.contains(e.target as Node) &&
        hospitalInputRef.current &&
        !hospitalInputRef.current.contains(e.target as Node)
      ) {
        setHospitalDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const today = getTodayIST();

  const selectedDateHoliday = form.date ? getHolidayInfo(form.date) : null;
  const rescheduleHoliday = rescheduleDate ? getHolidayInfo(rescheduleDate) : null;

  if (isLoading) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6 animate-pulse max-w-7xl mx-auto">
        <div className="h-8 w-56 bg-muted rounded-lg" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => <div key={i} className="h-24 bg-muted rounded-2xl" />)}
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => <div key={i} className="h-32 bg-muted rounded-2xl" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 lg:space-y-8 max-w-7xl mx-auto">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-foreground flex items-center gap-3">
            <Calendar className="h-6 w-6 sm:h-8 sm:w-8 text-primary shrink-0" />
            Appointments
          </h1>
          <p className="text-muted-foreground mt-1">
            {isDoctor ? "Manage your patient appointments" : "Book and manage your appointments"}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[140px]">
              <Filter className="h-4 w-4 mr-1" />
              <SelectValue placeholder="Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="scheduled">Scheduled</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
          <Dialog open={showBooking && !isDoctor} onOpenChange={(open) => {
              if (!isDoctor) {
                setShowBooking(open);
                if (!open) {
                  setHospitalSearch("");
                  setHospitalDropdownOpen(false);
                }
              }
            }}>
            {!isDoctor && (
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  Book Appointment
                </Button>
              </DialogTrigger>
            )}
            <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <CalendarDays className="h-5 w-5 text-primary" />
                  Book New Appointment
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-2">
                {!isPatient && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label>Patient Name *</Label>
                      <Input
                        placeholder="Patient full name"
                        value={form.patientName}
                        onChange={(e) => setForm({ ...form, patientName: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label>Patient Email *</Label>
                      <Input
                        type="email"
                        placeholder="patient@email.com"
                        value={form.patientEmail}
                        onChange={(e) => setForm({ ...form, patientEmail: e.target.value })}
                      />
                    </div>
                  </div>
                )}
                <div className="relative">
                  <Label>Hospital</Label>
                  {selectedHospital && !hospitalDropdownOpen ? (
                    <div className="flex items-center gap-2 mt-1.5 p-2.5 rounded-md border border-input bg-background">
                      <Building2 className="h-4 w-4 text-primary shrink-0" />
                      <span className="text-sm truncate flex-1">
                        {selectedHospital.name} — {selectedHospital.city}, {selectedHospital.state}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          setForm({ ...form, hospitalId: "" });
                          setSelectedHospitalCache(null);
                          setHospitalSearch("");
                          setHospitalDropdownOpen(true);
                          setTimeout(() => hospitalInputRef.current?.focus(), 50);
                        }}
                        className="p-0.5 rounded hover:bg-muted"
                      >
                        <X className="h-4 w-4 text-muted-foreground" />
                      </button>
                    </div>
                  ) : (
                    <div className="relative mt-1.5">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <input
                        ref={hospitalInputRef}
                        type="text"
                        placeholder="Search hospital by name, city, or state..."
                        value={hospitalSearch}
                        onChange={(e) => {
                          setHospitalSearch(e.target.value);
                          setHospitalDropdownOpen(true);
                        }}
                        onFocus={() => setHospitalDropdownOpen(true)}
                        onKeyDown={(e) => {
                          if (e.key === "Escape") setHospitalDropdownOpen(false);
                        }}
                        className="w-full pl-9 pr-3 py-2 rounded-md border border-input bg-background text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                      />
                    </div>
                  )}
                  <AnimatePresence>
                    {hospitalDropdownOpen && (
                      <motion.div
                        ref={hospitalDropdownRef}
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        transition={{ duration: 0.15 }}
                        className="absolute z-50 mt-1 w-full max-h-52 overflow-y-auto rounded-lg border border-border bg-popover shadow-lg"
                      >
                        {filteredHospitals.length === 0 ? (
                          <div className="p-3 text-sm text-muted-foreground text-center">No hospitals found</div>
                        ) : (
                          filteredHospitals.slice(0, 50).map((h) => (
                            <button
                              key={h.id}
                              type="button"
                              onClick={() => {
                                setForm({ ...form, hospitalId: String(h.id) });
                                setSelectedHospitalCache(h);
                                setHospitalSearch("");
                                setHospitalDropdownOpen(false);
                              }}
                              className={`w-full text-left px-3 py-2.5 text-sm hover:bg-accent/50 transition-colors flex items-start gap-2 border-b border-border/50 last:border-0 ${
                                form.hospitalId === String(h.id) ? "bg-primary/10 text-primary" : ""
                              }`}
                            >
                              <Building2 className="h-4 w-4 mt-0.5 shrink-0 text-primary/70" />
                              <div className="min-w-0">
                                <p className="font-medium truncate">{h.name}</p>
                                <p className="text-xs text-muted-foreground flex items-center gap-1">
                                  <MapPin className="h-3 w-3" />
                                  {h.city}, {h.state}
                                </p>
                              </div>
                            </button>
                          ))
                        )}
                        {filteredHospitals.length > 50 && (
                          <div className="p-2 text-xs text-center text-muted-foreground border-t">
                            Showing 50 of {filteredHospitals.length} results — type more to narrow down
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                {isPatient && (
                  <div>
                    <Label>Doctor Name (optional)</Label>
                    <Input
                      placeholder="Dr. Smith"
                      value={form.doctorName}
                      onChange={(e) => setForm({ ...form, doctorName: e.target.value })}
                    />
                  </div>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label>Date *</Label>
                    <Input
                      type="date"
                      min={today}
                      value={form.date}
                      onChange={(e) => setForm({ ...form, date: e.target.value })}
                      className={selectedDateHoliday ? "border-red-400 focus-visible:ring-red-400" : ""}
                    />
                  </div>
                  <div>
                    <Label>Time *</Label>
                    <Input
                      type="time"
                      value={form.time}
                      onChange={(e) => setForm({ ...form, time: e.target.value })}
                      disabled={!!selectedDateHoliday}
                    />
                  </div>
                </div>
                {selectedDateHoliday && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-start gap-3 p-3 rounded-xl bg-red-50 border border-red-200 text-sm"
                  >
                    <AlertTriangle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-red-700">
                        {getHolidayEmoji(selectedDateHoliday.type)} {selectedDateHoliday.name} — Public Holiday
                      </p>
                      <p className="text-red-600 mt-0.5">
                        Appointments are not available on this day. Please select a different date.
                      </p>
                    </div>
                  </motion.div>
                )}
                <div>
                  <Label>Reason *</Label>
                  <Textarea
                    placeholder="Describe the reason for your visit..."
                    value={form.reason}
                    onChange={(e) => setForm({ ...form, reason: e.target.value })}
                    rows={3}
                  />
                </div>
                <Button
                  className="w-full"
                  onClick={handleBook}
                  disabled={createMutation.isPending || !!selectedDateHoliday}
                >
                  {createMutation.isPending ? "Booking..." : selectedDateHoliday ? "Holiday — Select Another Date" : "Confirm Booking"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card>
            <CardContent className="p-5 flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-blue-100 flex items-center justify-center">
                <CalendarDays className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{appointments.filter((a) => a.status === "scheduled").length}</p>
                <p className="text-sm text-muted-foreground">Upcoming</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card>
            <CardContent className="p-5 flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-emerald-100 flex items-center justify-center">
                <CheckCircle2 className="h-6 w-6 text-emerald-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{appointments.filter((a) => a.status === "completed").length}</p>
                <p className="text-sm text-muted-foreground">Completed</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card>
            <CardContent className="p-5 flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-red-100 flex items-center justify-center">
                <XCircle className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{appointments.filter((a) => a.status === "cancelled").length}</p>
                <p className="text-sm text-muted-foreground">Cancelled</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {upcoming.length > 0 && (
        <section>
          <h2 className="text-xl font-bold font-display mb-4 flex items-center gap-2">
            <Clock className="h-5 w-5 text-blue-500" />
            Upcoming Appointments
          </h2>
          <div className="space-y-3">
            {upcoming.map((appt, i) => {
              const StatusIcon = statusIcons[appt.status] || CalendarDays;
              return (
                <motion.div
                  key={appt.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="p-5">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-start gap-4">
                          <div className="h-12 w-12 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                            <StatusIcon className="h-6 w-6 text-blue-600" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <p className="font-semibold text-base">{appt.reason}</p>
                              <Badge className={`text-xs border ${statusColors[appt.status]}`}>
                                {appt.status}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground flex-wrap">
                              <span className="flex items-center gap-1">
                                <CalendarDays className="h-3.5 w-3.5" />
                                {appt.date}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="h-3.5 w-3.5" />
                                {appt.time}
                              </span>
                              {appt.doctorName && (
                                <span className="flex items-center gap-1">
                                  <User className="h-3.5 w-3.5" />
                                  {appt.doctorName}
                                </span>
                              )}
                              {isDoctor && (
                                <span className="flex items-center gap-1">
                                  <User className="h-3.5 w-3.5" />
                                  Patient: {appt.patientName}
                                </span>
                              )}
                            </div>
                            {appt.notes && (
                              <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1">
                                <FileText className="h-3.5 w-3.5" />
                                {appt.notes}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          {(isDoctor || user?.role === "admin") && (
                            <>
                              {editingId === appt.id ? (
                                <div className="flex flex-col gap-2">
                                  <Input
                                    placeholder="Add notes..."
                                    value={editNotes}
                                    onChange={(e) => setEditNotes(e.target.value)}
                                    className="w-48"
                                    data-testid={`notes-input-${appt.id}`}
                                  />
                                  <div className="flex gap-2">
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => { setEditingId(null); setEditNotes(""); }}
                                    >
                                      Cancel
                                    </Button>
                                    <Button
                                      size="sm"
                                      onClick={() => updateMutation.mutate({ id: appt.id, data: { notes: editNotes } })}
                                      disabled={updateMutation.isPending}
                                    >
                                      Save
                                    </Button>
                                  </div>
                                </div>
                              ) : (
                                <>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => { setEditingId(appt.id); setEditNotes(appt.notes || ""); }}
                                    data-testid={`notes-button-${appt.id}`}
                                  >
                                    <FileText className="h-3.5 w-3.5 mr-1" /> Notes
                                  </Button>
                                  <Button
                                    size="sm"
                                    className="bg-emerald-600 hover:bg-emerald-700 text-white"
                                    onClick={() => updateMutation.mutate({ id: appt.id, data: { status: "completed" } })}
                                    disabled={updateMutation.isPending}
                                    data-testid={`complete-button-${appt.id}`}
                                  >
                                    <CheckCircle2 className="h-3.5 w-3.5 mr-1" /> Complete
                                  </Button>
                                </>
                              )}
                            </>
                          )}
                          {appt.status === "scheduled" && (
                            <>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  setRescheduleAppt(appt);
                                  setRescheduleDate(appt.date);
                                  setRescheduleTime(appt.time);
                                }}
                                disabled={updateMutation.isPending}
                                data-testid={`reschedule-button-${appt.id}`}
                              >
                                <RefreshCw className="h-3.5 w-3.5 mr-1" /> Reschedule
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => updateMutation.mutate({ id: appt.id, data: { status: "cancelled" } })}
                                disabled={updateMutation.isPending}
                                data-testid={`cancel-button-${appt.id}`}
                              >
                                <XCircle className="h-3.5 w-3.5 mr-1" /> Cancel
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </section>
      )}

      {past.length > 0 && (
        <section>
          <h2 className="text-xl font-bold font-display mb-4 flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-emerald-500" />
            Past Appointments
          </h2>
          <div className="space-y-3">
            {past.map((appt, i) => {
              const StatusIcon = statusIcons[appt.status] || CalendarDays;
              return (
                <motion.div
                  key={appt.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Card className="opacity-80 hover:opacity-100 transition-opacity">
                    <CardContent className="p-5">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-start gap-4">
                          <div className={`h-12 w-12 rounded-xl flex items-center justify-center shrink-0 ${
                            appt.status === "completed" ? "bg-emerald-50" : "bg-red-50"
                          }`}>
                            <StatusIcon className={`h-6 w-6 ${
                              appt.status === "completed" ? "text-emerald-600" : "text-red-600"
                            }`} />
                          </div>
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <p className="font-semibold text-base">{appt.reason}</p>
                              <Badge className={`text-xs border ${statusColors[appt.status]}`}>
                                {appt.status}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground flex-wrap">
                              <span className="flex items-center gap-1">
                                <CalendarDays className="h-3.5 w-3.5" />
                                {appt.date}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="h-3.5 w-3.5" />
                                {appt.time}
                              </span>
                              {appt.doctorName && (
                                <span className="flex items-center gap-1">
                                  <User className="h-3.5 w-3.5" />
                                  {appt.doctorName}
                                </span>
                              )}
                              {isDoctor && (
                                <span className="flex items-center gap-1">
                                  <User className="h-3.5 w-3.5" />
                                  Patient: {appt.patientName}
                                </span>
                              )}
                            </div>
                            {appt.notes && (
                              <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1">
                                <FileText className="h-3.5 w-3.5" />
                                {appt.notes}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </section>
      )}

      {filtered.length === 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-16"
        >
          <Calendar className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-muted-foreground">No appointments found</h3>
          <p className="text-sm text-muted-foreground mt-1">
            {isPatient
              ? "Book your first appointment to get started"
              : "No appointments yet. Book one for a patient."}
          </p>
          {!isDoctor && (
            <Button className="mt-4 gap-2" onClick={() => setShowBooking(true)}>
              <Plus className="h-4 w-4" />
              Book Appointment
            </Button>
          )}
        </motion.div>
      )}

      <Dialog open={!!rescheduleAppt} onOpenChange={(open) => { if (!open) setRescheduleAppt(null); }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <RefreshCw className="h-5 w-5 text-primary" />
              Reschedule Appointment
            </DialogTitle>
          </DialogHeader>
          {rescheduleAppt && (
            <div className="space-y-4 mt-2">
              <div className="p-3 bg-muted/50 rounded-xl text-sm">
                <p className="font-medium">{rescheduleAppt.reason}</p>
                <p className="text-muted-foreground mt-1">
                  Currently: {rescheduleAppt.date} at {rescheduleAppt.time}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>New Date *</Label>
                  <Input
                    type="date"
                    min={today}
                    value={rescheduleDate}
                    onChange={(e) => setRescheduleDate(e.target.value)}
                    className={rescheduleHoliday ? "border-red-400 focus-visible:ring-red-400" : ""}
                    data-testid="reschedule-date"
                  />
                </div>
                <div>
                  <Label>New Time *</Label>
                  <Input
                    type="time"
                    value={rescheduleTime}
                    onChange={(e) => setRescheduleTime(e.target.value)}
                    disabled={!!rescheduleHoliday}
                    data-testid="reschedule-time"
                  />
                </div>
              </div>
              {rescheduleHoliday && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-start gap-3 p-3 rounded-xl bg-red-50 border border-red-200 text-sm"
                >
                  <AlertTriangle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-red-700">
                      {getHolidayEmoji(rescheduleHoliday.type)} {rescheduleHoliday.name} — Public Holiday
                    </p>
                    <p className="text-red-600 mt-0.5">
                      Appointments are not available on this day. Please select a different date.
                    </p>
                  </div>
                </motion.div>
              )}
              <Button
                className="w-full"
                onClick={() => {
                  if (!rescheduleDate || !rescheduleTime) {
                    toast({ title: "Please select both date and time", variant: "destructive" });
                    return;
                  }
                  if (rescheduleHoliday) {
                    toast({ title: `Holiday: ${rescheduleHoliday.name}`, description: "Please select a non-holiday date.", variant: "destructive" });
                    return;
                  }
                  if (rescheduleDate < today) {
                    toast({ title: "Cannot reschedule to a past date", variant: "destructive" });
                    return;
                  }
                  if (rescheduleDate === rescheduleAppt.date && rescheduleTime === rescheduleAppt.time) {
                    toast({ title: "Please pick a different date or time", variant: "destructive" });
                    return;
                  }
                  updateMutation.mutate(
                    { id: rescheduleAppt.id, data: { date: rescheduleDate, time: rescheduleTime } },
                    {
                      onSuccess: () => {
                        setRescheduleAppt(null);
                        toast({ title: "Appointment rescheduled!" });
                      },
                    }
                  );
                }}
                disabled={updateMutation.isPending || !!rescheduleHoliday}
                data-testid="confirm-reschedule"
              >
                {updateMutation.isPending ? "Rescheduling..." : rescheduleHoliday ? "Holiday — Select Another Date" : "Confirm Reschedule"}
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
