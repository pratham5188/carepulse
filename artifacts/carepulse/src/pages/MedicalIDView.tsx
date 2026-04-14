import { useEffect, useState } from "react";
import { IdCard, Heart, Phone, AlertTriangle, Pill, Activity } from "lucide-react";

interface MedicalData {
  name: string;
  bloodType: string;
  allergies: string;
  conditions: string;
  medications: string;
  emergencyContact: {
    name: string;
    phone: string;
  };
}

export default function MedicalIDView() {
  const [data, setData] = useState<MedicalData | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const encoded = params.get("d");
      if (!encoded) {
        setError(true);
        return;
      }
      const decoded = JSON.parse(atob(encoded));
      setData(decoded);
    } catch {
      setError(true);
    }
  }, []);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-900 dark:to-slate-800 p-4">
        <div className="text-center space-y-3">
          <IdCard className="h-12 w-12 text-muted-foreground mx-auto" />
          <h1 className="text-xl font-bold">Invalid Medical ID</h1>
          <p className="text-muted-foreground">This QR code is invalid or has expired.</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-900 dark:to-slate-800">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-4">
        <div className="rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 p-6 md:p-8 text-white shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

          <div className="relative z-10">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <IdCard className="h-6 w-6" />
                <span className="text-sm font-semibold uppercase tracking-wider opacity-80">Medical ID Card</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Activity className="h-4 w-4 text-green-300" />
                <span className="text-xs opacity-60">CarePulse</span>
              </div>
            </div>

            <div className="space-y-5">
              <div>
                <p className="text-sm opacity-70">Name</p>
                <p className="text-2xl font-bold">{data.name}</p>
              </div>

              {data.bloodType && (
                <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur rounded-lg px-4 py-2">
                  <Heart className="h-5 w-5 text-red-300" />
                  <span className="text-xl font-bold">{data.bloodType}</span>
                </div>
              )}

              {data.allergies && (
                <div className="bg-white/10 backdrop-blur rounded-lg p-3">
                  <div className="flex items-center gap-1.5 mb-1">
                    <AlertTriangle className="h-4 w-4 text-yellow-300" />
                    <p className="text-sm font-semibold opacity-90">Allergies</p>
                  </div>
                  <p className="text-sm font-medium">{data.allergies}</p>
                </div>
              )}

              {data.conditions && (
                <div className="bg-white/10 backdrop-blur rounded-lg p-3">
                  <div className="flex items-center gap-1.5 mb-1">
                    <Activity className="h-4 w-4 text-blue-300" />
                    <p className="text-sm font-semibold opacity-90">Medical Conditions</p>
                  </div>
                  <p className="text-sm font-medium">{data.conditions}</p>
                </div>
              )}

              {data.medications && (
                <div className="bg-white/10 backdrop-blur rounded-lg p-3">
                  <div className="flex items-center gap-1.5 mb-1">
                    <Pill className="h-4 w-4 text-green-300" />
                    <p className="text-sm font-semibold opacity-90">Current Medications</p>
                  </div>
                  <p className="text-sm font-medium">{data.medications}</p>
                </div>
              )}

              {(data.emergencyContact?.name || data.emergencyContact?.phone) && (
                <div className="border-t border-white/20 pt-4">
                  <div className="flex items-center gap-1.5 mb-2">
                    <Phone className="h-4 w-4 text-blue-300" />
                    <p className="text-sm font-semibold opacity-90">Emergency Contact</p>
                  </div>
                  {data.emergencyContact.name && (
                    <p className="text-sm font-medium">{data.emergencyContact.name}</p>
                  )}
                  {data.emergencyContact.phone && (
                    <a
                      href={`tel:${data.emergencyContact.phone}`}
                      className="text-sm font-medium underline decoration-white/40 hover:decoration-white transition-colors"
                    >
                      {data.emergencyContact.phone}
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-muted-foreground">
          Digital Medical ID powered by CarePulse
        </p>
      </div>
    </div>
  );
}
