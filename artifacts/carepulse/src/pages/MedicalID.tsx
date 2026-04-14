import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { IdCard, Heart, Phone, AlertTriangle, Pill } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

const STORAGE_KEY = "carepulse-medical-id";

interface MedicalData {
  fullName: string;
  bloodType: string;
  allergies: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  medicalConditions: string;
  currentMedications: string;
}

const defaultData: MedicalData = {
  fullName: "",
  bloodType: "",
  allergies: "",
  emergencyContactName: "",
  emergencyContactPhone: "",
  medicalConditions: "",
  currentMedications: "",
};

export default function MedicalID() {
  const { user } = useAuth();
  const [formData, setFormData] = useState<MedicalData>(defaultData);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (!parsed.fullName && user) {
          parsed.fullName = [user.firstName, user.lastName].filter(Boolean).join(" ");
        }
        setFormData(parsed);
      } catch {}
    } else if (user) {
      setFormData(prev => ({
        ...prev,
        fullName: [user.firstName, user.lastName].filter(Boolean).join(" "),
      }));
    }
  }, [user]);

  const [errors, setErrors] = useState<Partial<Record<keyof MedicalData, string>>>({});

  const handleSave = () => {
    const newErrors: Partial<Record<keyof MedicalData, string>> = {};
    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!formData.bloodType) newErrors.bloodType = "Blood type is required";
    if (!formData.allergies.trim()) newErrors.allergies = "Allergies info is required (enter 'None' if none)";
    if (!formData.emergencyContactName.trim()) newErrors.emergencyContactName = "Emergency contact name is required";
    if (!formData.emergencyContactPhone.trim()) newErrors.emergencyContactPhone = "Emergency contact phone is required";
    if (!formData.medicalConditions.trim()) newErrors.medicalConditions = "Medical conditions info is required (enter 'None' if none)";
    if (!formData.currentMedications.trim()) newErrors.currentMedications = "Current medications info is required (enter 'None' if none)";

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const updateField = (field: keyof MedicalData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => { const next = { ...prev }; delete next[field]; return next; });
    }
  };

  const userName = formData.fullName.trim() || [user?.firstName, user?.lastName].filter(Boolean).join(" ") || "Patient";

  const medicalPayload = btoa(JSON.stringify({
    name: userName,
    bloodType: formData.bloodType,
    allergies: formData.allergies,
    conditions: formData.medicalConditions,
    medications: formData.currentMedications,
    emergencyContact: {
      name: formData.emergencyContactName,
      phone: formData.emergencyContactPhone,
    },
  }));

  const qrValue = `${window.location.origin}/id?d=${medicalPayload}`;

  const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8">
      <div className="flex items-center gap-3">
        <IdCard className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">Medical ID</h1>
          <p className="text-muted-foreground">Your digital emergency medical identification card</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Edit Medical Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name (as you want it on your ID) <span className="text-red-500">*</span></Label>
            <Input
              id="fullName"
              placeholder="e.g., Pratham Marathe or PRATHAM MARATHE"
              value={formData.fullName}
              onChange={(e) => updateField("fullName", e.target.value)}
              className={errors.fullName ? "border-red-500" : ""}
              data-testid="input-fullName"
            />
            <p className="text-xs text-muted-foreground">Your name will appear exactly as you type it</p>
            {errors.fullName && <p className="text-xs text-red-500">{errors.fullName}</p>}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="bloodType">Blood Type <span className="text-red-500">*</span></Label>
              <Select value={formData.bloodType} onValueChange={(v) => updateField("bloodType", v)}>
                <SelectTrigger className={errors.bloodType ? "border-red-500" : ""}>
                  <SelectValue placeholder="Select blood type" />
                </SelectTrigger>
                <SelectContent>
                  {bloodTypes.map((bt) => (
                    <SelectItem key={bt} value={bt}>{bt}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.bloodType && <p className="text-xs text-red-500">{errors.bloodType}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="allergies">Allergies <span className="text-red-500">*</span></Label>
              <Input
                id="allergies"
                placeholder="e.g., Penicillin, Peanuts (or 'None')"
                value={formData.allergies}
                onChange={(e) => updateField("allergies", e.target.value)}
                className={errors.allergies ? "border-red-500" : ""}
              />
              {errors.allergies && <p className="text-xs text-red-500">{errors.allergies}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="emergencyContactName">Emergency Contact Name <span className="text-red-500">*</span></Label>
              <Input
                id="emergencyContactName"
                placeholder="Full name"
                value={formData.emergencyContactName}
                onChange={(e) => updateField("emergencyContactName", e.target.value)}
                className={errors.emergencyContactName ? "border-red-500" : ""}
              />
              {errors.emergencyContactName && <p className="text-xs text-red-500">{errors.emergencyContactName}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="emergencyContactPhone">Emergency Contact Phone <span className="text-red-500">*</span></Label>
              <Input
                id="emergencyContactPhone"
                placeholder="+91 98765 43210"
                value={formData.emergencyContactPhone}
                onChange={(e) => updateField("emergencyContactPhone", e.target.value)}
                className={errors.emergencyContactPhone ? "border-red-500" : ""}
              />
              {errors.emergencyContactPhone && <p className="text-xs text-red-500">{errors.emergencyContactPhone}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="medicalConditions">Medical Conditions <span className="text-red-500">*</span></Label>
              <Input
                id="medicalConditions"
                placeholder="e.g., Diabetes, Asthma (or 'None')"
                value={formData.medicalConditions}
                onChange={(e) => updateField("medicalConditions", e.target.value)}
                className={errors.medicalConditions ? "border-red-500" : ""}
              />
              {errors.medicalConditions && <p className="text-xs text-red-500">{errors.medicalConditions}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="currentMedications">Current Medications <span className="text-red-500">*</span></Label>
              <Input
                id="currentMedications"
                placeholder="e.g., Metformin 500mg, Inhaler (or 'None')"
                value={formData.currentMedications}
                onChange={(e) => updateField("currentMedications", e.target.value)}
                className={errors.currentMedications ? "border-red-500" : ""}
              />
              {errors.currentMedications && <p className="text-xs text-red-500">{errors.currentMedications}</p>}
            </div>
          </div>

          <Button onClick={handleSave} className="w-full md:w-auto">
            {saved ? "✓ Saved!" : "Save Medical ID"}
          </Button>
        </CardContent>
      </Card>

      <div className="rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 p-6 md:p-8 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <IdCard className="h-6 w-6" />
              <span className="text-sm font-semibold uppercase tracking-wider opacity-80">Medical ID Card</span>
            </div>
            <div className="text-xs opacity-60">CarePulse</div>
          </div>

          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1 space-y-4">
              <div>
                <p className="text-sm opacity-70">Name</p>
                <p className="text-2xl font-bold">{userName}</p>
              </div>

              {formData.bloodType && (
                <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur rounded-lg px-4 py-2">
                  <Heart className="h-5 w-5 text-red-300" />
                  <span className="text-xl font-bold">{formData.bloodType}</span>
                </div>
              )}

              {formData.allergies && (
                <div>
                  <div className="flex items-center gap-1.5 mb-1">
                    <AlertTriangle className="h-4 w-4 text-yellow-300" />
                    <p className="text-sm opacity-70">Allergies</p>
                  </div>
                  <p className="text-sm font-medium">{formData.allergies}</p>
                </div>
              )}

              {formData.medicalConditions && (
                <div>
                  <p className="text-sm opacity-70">Medical Conditions</p>
                  <p className="text-sm font-medium">{formData.medicalConditions}</p>
                </div>
              )}

              {formData.currentMedications && (
                <div>
                  <div className="flex items-center gap-1.5 mb-1">
                    <Pill className="h-4 w-4 text-green-300" />
                    <p className="text-sm opacity-70">Medications</p>
                  </div>
                  <p className="text-sm font-medium">{formData.currentMedications}</p>
                </div>
              )}

              {(formData.emergencyContactName || formData.emergencyContactPhone) && (
                <div className="border-t border-white/20 pt-3">
                  <div className="flex items-center gap-1.5 mb-1">
                    <Phone className="h-4 w-4 text-blue-300" />
                    <p className="text-sm opacity-70">Emergency Contact</p>
                  </div>
                  {formData.emergencyContactName && (
                    <p className="text-sm font-medium">{formData.emergencyContactName}</p>
                  )}
                  {formData.emergencyContactPhone && (
                    <p className="text-sm font-medium">{formData.emergencyContactPhone}</p>
                  )}
                </div>
              )}
            </div>

            <div className="flex-shrink-0 self-start">
              <div className="bg-white rounded-lg p-2" data-testid="qr-code-container">
                <QRCodeSVG
                  value={qrValue}
                  size={120}
                  bgColor="#ffffff"
                  fgColor="#1e293b"
                  level="M"
                />
              </div>
              <p className="text-xs text-center mt-1 opacity-60">Scan for details</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}