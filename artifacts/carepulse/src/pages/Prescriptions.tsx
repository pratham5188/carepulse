import { useState, useMemo } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import {
  Pill,
  Plus,
  Search,
  FileText,
  Printer,
  Trash2,
  Clock,
  User,
  Stethoscope,
  CalendarDays,
  X,
  ChevronDown,
  ChevronUp,
  Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

interface Medication {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
}

interface Prescription {
  id: number;
  patientId: number | null;
  patientName: string;
  doctorId: string | null;
  doctorName: string;
  diagnosis: string;
  medications: Medication[];
  notes: string | null;
  createdAt: string | null;
}

function usePrescriptions() {
  return useQuery<Prescription[]>({
    queryKey: ["/api/prescriptions"],
    queryFn: async () => {
      const res = await fetch("/api/prescriptions", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch prescriptions");
      return res.json();
    },
  });
}

function usePatientsList() {
  return useQuery<any[]>({
    queryKey: ["/api/patients"],
    queryFn: async () => {
      const res = await fetch("/api/patients", { credentials: "include" });
      if (!res.ok) return [];
      return res.json();
    },
  });
}

const emptyMedication: Medication = {
  name: "",
  dosage: "",
  frequency: "",
  duration: "",
};

function CreatePrescriptionDialog({ onCreated }: { onCreated: () => void }) {
  const [open, setOpen] = useState(false);
  const [patientName, setPatientName] = useState("");
  const [patientId, setPatientId] = useState<number | null>(null);
  const [diagnosis, setDiagnosis] = useState("");
  const [notes, setNotes] = useState("");
  const [medications, setMedications] = useState<Medication[]>([
    { ...emptyMedication },
  ]);
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();
  const { data: patients } = usePatientsList();

  const addMedication = () => {
    setMedications([...medications, { ...emptyMedication }]);
  };

  const removeMedication = (index: number) => {
    if (medications.length <= 1) return;
    setMedications(medications.filter((_, i) => i !== index));
  };

  const updateMedication = (
    index: number,
    field: keyof Medication,
    value: string
  ) => {
    const updated = [...medications];
    updated[index] = { ...updated[index], [field]: value };
    setMedications(updated);
  };

  const resetForm = () => {
    setPatientName("");
    setPatientId(null);
    setDiagnosis("");
    setNotes("");
    setMedications([{ ...emptyMedication }]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validMeds = medications.filter(
      (m) => m.name.trim() && m.dosage.trim()
    );
    if (!patientName.trim() || !diagnosis.trim() || validMeds.length === 0) {
      toast({
        title: "Missing fields",
        description:
          "Please fill in patient name, diagnosis, and at least one medication.",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);
    try {
      await apiRequest("POST", "/api/prescriptions", {
        patientName: patientName.trim(),
        patientId: patientId,
        diagnosis: diagnosis.trim(),
        medications: validMeds,
        notes: notes.trim() || null,
      });
      toast({ title: "Prescription created successfully" });
      resetForm();
      setOpen(false);
      onCreated();
    } catch (error: any) {
      toast({
        title: "Error creating prescription",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          New Prescription
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Create New Prescription
          </DialogTitle>
          <DialogDescription>
            Fill in the patient details, diagnosis, and medications below.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="patientName">Patient Name *</Label>
              {patients && patients.length > 0 ? (
                <select
                  className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={patientName}
                  onChange={(e) => {
                    const selected = patients.find(
                      (p: any) => p.name === e.target.value
                    );
                    setPatientName(e.target.value);
                    setPatientId(selected?.id || null);
                  }}
                >
                  <option value="">Select patient...</option>
                  {patients.map((p: any) => (
                    <option key={p.id} value={p.name}>
                      {p.name} (Age: {p.age})
                    </option>
                  ))}
                </select>
              ) : (
                <Input
                  id="patientName"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  placeholder="Enter patient name"
                />
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="diagnosis">Diagnosis *</Label>
              <Input
                id="diagnosis"
                value={diagnosis}
                onChange={(e) => setDiagnosis(e.target.value)}
                placeholder="e.g. Hypertension Stage 2"
              />
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-base font-semibold">Medications *</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addMedication}
                className="gap-1"
              >
                <Plus className="h-3 w-3" />
                Add
              </Button>
            </div>
            {medications.map((med, index) => (
              <div
                key={index}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_1fr_auto] gap-2 items-end bg-muted/30 p-3 rounded-lg border border-border"
              >
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">
                    Medication
                  </Label>
                  <Input
                    value={med.name}
                    onChange={(e) =>
                      updateMedication(index, "name", e.target.value)
                    }
                    placeholder="Name"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">
                    Dosage
                  </Label>
                  <Input
                    value={med.dosage}
                    onChange={(e) =>
                      updateMedication(index, "dosage", e.target.value)
                    }
                    placeholder="e.g. 500mg"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">
                    Frequency
                  </Label>
                  <Input
                    value={med.frequency}
                    onChange={(e) =>
                      updateMedication(index, "frequency", e.target.value)
                    }
                    placeholder="e.g. Twice daily"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">
                    Duration
                  </Label>
                  <Input
                    value={med.duration}
                    onChange={(e) =>
                      updateMedication(index, "duration", e.target.value)
                    }
                    placeholder="e.g. 7 days"
                  />
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeMedication(index)}
                  disabled={medications.length <= 1}
                  className="text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes (optional)</Label>
            <textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm min-h-[80px] resize-y"
              placeholder="Additional instructions, dietary advice, follow-up notes..."
            />
          </div>

          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? "Creating..." : "Create Prescription"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function PrescriptionCard({
  prescription,
  isDoctor,
}: {
  prescription: Prescription;
  isDoctor: boolean;
}) {
  const [expanded, setExpanded] = useState(false);
  const meds: Medication[] = Array.isArray(prescription.medications)
    ? prescription.medications
    : [];
  const createdDate = prescription.createdAt
    ? new Date(prescription.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Unknown date";

  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;
    const medsHtml = meds
      .map(
        (m, i) => `
      <tr>
        <td style="padding:8px;border:1px solid #e5e7eb;">${i + 1}</td>
        <td style="padding:8px;border:1px solid #e5e7eb;font-weight:600;">${m.name}</td>
        <td style="padding:8px;border:1px solid #e5e7eb;">${m.dosage}</td>
        <td style="padding:8px;border:1px solid #e5e7eb;">${m.frequency}</td>
        <td style="padding:8px;border:1px solid #e5e7eb;">${m.duration}</td>
      </tr>`
      )
      .join("");

    printWindow.document.write(`
      <html>
      <head><title>Prescription - ${prescription.patientName}</title></head>
      <body style="font-family:system-ui,sans-serif;max-width:700px;margin:40px auto;padding:20px;">
        <div style="border-bottom:3px solid #2563eb;padding-bottom:16px;margin-bottom:24px;">
          <h1 style="margin:0;color:#2563eb;font-size:24px;">CarePulse Prescription</h1>
          <p style="margin:4px 0 0;color:#6b7280;font-size:14px;">Date: ${createdDate}</p>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:24px;">
          <div><strong>Patient:</strong> ${prescription.patientName}</div>
          <div><strong>Doctor:</strong> Dr. ${prescription.doctorName}</div>
          <div style="grid-column:1/-1;"><strong>Diagnosis:</strong> ${prescription.diagnosis}</div>
        </div>
        <h3 style="margin:0 0 8px;">Medications</h3>
        <table style="width:100%;border-collapse:collapse;margin-bottom:24px;">
          <thead><tr style="background:#f3f4f6;">
            <th style="padding:8px;border:1px solid #e5e7eb;text-align:left;">#</th>
            <th style="padding:8px;border:1px solid #e5e7eb;text-align:left;">Medication</th>
            <th style="padding:8px;border:1px solid #e5e7eb;text-align:left;">Dosage</th>
            <th style="padding:8px;border:1px solid #e5e7eb;text-align:left;">Frequency</th>
            <th style="padding:8px;border:1px solid #e5e7eb;text-align:left;">Duration</th>
          </tr></thead>
          <tbody>${medsHtml}</tbody>
        </table>
        ${prescription.notes ? `<div style="background:#f9fafb;padding:12px;border-radius:8px;border:1px solid #e5e7eb;"><strong>Notes:</strong> ${prescription.notes}</div>` : ""}
        <div style="margin-top:40px;padding-top:16px;border-top:1px solid #e5e7eb;">
          <p style="color:#6b7280;font-size:12px;">This prescription is generated by CarePulse Healthcare Platform. Always consult your healthcare provider before making any changes to your medication.</p>
        </div>
      </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="print-prescription"
    >
      <Card className="overflow-hidden hover:shadow-md transition-shadow">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-base">
                  {isDoctor ? prescription.patientName : `Dr. ${prescription.doctorName}`}
                </CardTitle>
                <CardDescription className="flex items-center gap-2 mt-0.5">
                  <CalendarDays className="h-3 w-3" />
                  {createdDate}
                </CardDescription>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={handlePrint}
                title="Print prescription"
              >
                <Printer className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setExpanded(!expanded)}
              >
                {expanded ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0 space-y-3">
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary" className="gap-1">
              <Stethoscope className="h-3 w-3" />
              {prescription.diagnosis}
            </Badge>
            <Badge variant="outline" className="gap-1">
              <Pill className="h-3 w-3" />
              {meds.length} medication{meds.length !== 1 ? "s" : ""}
            </Badge>
          </div>

          {!expanded && meds.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {meds.map((m, i) => (
                <span
                  key={i}
                  className="text-xs bg-muted px-2 py-1 rounded-md text-muted-foreground"
                >
                  {m.name} {m.dosage}
                </span>
              ))}
            </div>
          )}

          {expanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="space-y-3"
            >
              <div className="grid gap-2">
                {!isDoctor && (
                  <div className="flex items-center gap-2 text-sm">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Doctor:</span>
                    <span className="font-medium">
                      Dr. {prescription.doctorName}
                    </span>
                  </div>
                )}
                {isDoctor && (
                  <div className="flex items-center gap-2 text-sm">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Patient:</span>
                    <span className="font-medium">
                      {prescription.patientName}
                    </span>
                  </div>
                )}
              </div>

              <div className="border border-border rounded-lg overflow-x-auto">
                <table className="w-full text-sm min-w-[400px]">
                  <thead>
                    <tr className="bg-muted/50">
                      <th className="text-left p-2.5 font-medium text-muted-foreground">
                        Medication
                      </th>
                      <th className="text-left p-2.5 font-medium text-muted-foreground">
                        Dosage
                      </th>
                      <th className="text-left p-2.5 font-medium text-muted-foreground">
                        Frequency
                      </th>
                      <th className="text-left p-2.5 font-medium text-muted-foreground">
                        Duration
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {meds.map((med, i) => (
                      <tr key={i} className="border-t border-border">
                        <td className="p-2.5 font-medium">{med.name}</td>
                        <td className="p-2.5">{med.dosage}</td>
                        <td className="p-2.5">{med.frequency}</td>
                        <td className="p-2.5">{med.duration}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {prescription.notes && (
                <div className="bg-muted/30 rounded-lg p-3 border border-border">
                  <p className="text-xs font-medium text-muted-foreground mb-1">
                    Notes
                  </p>
                  <p className="text-sm">{prescription.notes}</p>
                </div>
              )}
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default function Prescriptions() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { data: prescriptions, isLoading } = usePrescriptions();
  const [searchQuery, setSearchQuery] = useState("");

  const isDoctor = user?.role === "doctor" || user?.role === "admin";

  const filtered = useMemo(() => {
    if (!prescriptions) return [];
    if (!searchQuery.trim()) return prescriptions;
    const q = searchQuery.toLowerCase();
    return prescriptions.filter(
      (p) =>
        p.patientName.toLowerCase().includes(q) ||
        p.doctorName.toLowerCase().includes(q) ||
        p.diagnosis.toLowerCase().includes(q) ||
        (Array.isArray(p.medications) &&
          p.medications.some((m: Medication) =>
            m.name.toLowerCase().includes(q)
          ))
    );
  }, [prescriptions, searchQuery]);

  if (isLoading) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6 animate-pulse max-w-7xl mx-auto">
        <div className="h-8 w-48 bg-muted rounded-lg" />
        <div className="grid gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-muted rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-4 sm:space-y-6">
      <header className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-foreground flex items-center gap-3">
            <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <Pill className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
            </div>
            Prescriptions
          </h1>
          <p className="text-muted-foreground mt-1">
            {isDoctor
              ? "Create and manage patient prescriptions"
              : "View your prescribed medications and treatment plans"}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {isDoctor && (
            <CreatePrescriptionDialog
              onCreated={() =>
                queryClient.invalidateQueries({
                  queryKey: ["/api/prescriptions"],
                })
              }
            />
          )}
        </div>
      </header>

      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by patient, doctor, diagnosis, or medication..."
            className="pl-10"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        <div className="text-sm text-muted-foreground">
          {filtered.length} prescription{filtered.length !== 1 ? "s" : ""}
        </div>
      </div>

      {filtered.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16"
        >
          <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
            <FileText className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-1">No prescriptions found</h3>
          <p className="text-muted-foreground text-sm max-w-md mx-auto">
            {searchQuery
              ? "Try adjusting your search terms."
              : isDoctor
              ? 'Click "New Prescription" to create one.'
              : "Your prescriptions will appear here once your doctor creates them."}
          </p>
        </motion.div>
      ) : (
        <div className="grid gap-4">
          {filtered.map((prescription) => (
            <PrescriptionCard
              key={prescription.id}
              prescription={prescription}
              isDoctor={isDoctor}
            />
          ))}
        </div>
      )}

      <div className="p-3 bg-muted/50 rounded-xl border border-border">
        <p className="text-xs text-center text-muted-foreground">
          <Shield className="h-3 w-3 inline mr-1" />
          All prescription data is securely stored and managed in compliance with
          healthcare privacy standards. Always follow your healthcare provider's
          instructions.
        </p>
      </div>
    </div>
  );
}
