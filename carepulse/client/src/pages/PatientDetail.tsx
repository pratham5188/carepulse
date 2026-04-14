import { usePatient, usePatientVitals } from "@/hooks/use-medical-data";
import { Link } from "wouter";
import { ArrowLeft, Heart, Thermometer, Wind, Activity, User, Calendar, Building2 } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { motion } from "framer-motion";
import { format } from "date-fns";

interface PatientDetailProps {
  id: number;
}

export default function PatientDetail({ id }: PatientDetailProps) {
  const { data: patient, isLoading: patientLoading } = usePatient(id);
  const { data: vitals, isLoading: vitalsLoading } = usePatientVitals(id);

  if (patientLoading) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-6 animate-pulse">
        <div className="h-8 w-32 bg-muted rounded-lg" />
        <div className="h-48 bg-muted rounded-2xl" />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[1,2,3,4].map(i => <div key={i} className="h-28 bg-muted rounded-2xl" />)}
        </div>
        <div className="h-64 bg-muted rounded-2xl" />
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="p-8 max-w-5xl mx-auto text-center space-y-4">
        <User className="h-16 w-16 text-muted-foreground mx-auto" />
        <h2 className="text-2xl font-bold">Patient Not Found</h2>
        <Link href="/patients" className="text-primary hover:underline">Back to Patients</Link>
      </div>
    );
  }

  const latestVital = vitals?.[0];
  const medicalHistory = (patient.medicalHistory as string[]) || [];

  const vitalCards = [
    {
      label: "Heart Rate",
      value: latestVital?.heartRate ? `${latestVital.heartRate} bpm` : "N/A",
      icon: Heart,
      color: "text-red-500 bg-red-50",
      alert: latestVital?.heartRate && (latestVital.heartRate > 100 || latestVital.heartRate < 60),
    },
    {
      label: "Blood Pressure",
      value: latestVital?.bloodPressure || "N/A",
      icon: Activity,
      color: "text-blue-500 bg-blue-50",
      alert: false,
    },
    {
      label: "Oxygen Level",
      value: latestVital?.oxygenLevel ? `${latestVital.oxygenLevel}%` : "N/A",
      icon: Wind,
      color: "text-emerald-500 bg-emerald-50",
      alert: latestVital?.oxygenLevel && latestVital.oxygenLevel < 95,
    },
    {
      label: "Temperature",
      value: latestVital?.temperature ? `${latestVital.temperature}°C` : "N/A",
      icon: Thermometer,
      color: "text-orange-500 bg-orange-50",
      alert: latestVital?.temperature && latestVital.temperature > 37.5,
    },
  ];

  const heartRateData = vitals?.map((v, i) => ({
    time: v.timestamp ? format(new Date(v.timestamp), "HH:mm") : `T${i}`,
    heartRate: v.heartRate,
    oxygenLevel: v.oxygenLevel,
  })).reverse() || [];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-8">
      <Link href="/patients" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="h-4 w-4" />
        Back to Patients
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card border border-border rounded-2xl p-8 shadow-sm"
      >
        <div className="flex items-start gap-6">
          <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
            <User className="h-8 w-8 text-primary" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-4 flex-wrap">
              <h1 className="text-3xl font-display font-bold">{patient.name}</h1>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                patient.condition === 'Critical' ? 'bg-red-100 text-red-800' :
                patient.condition === 'Recovering' ? 'bg-amber-100 text-amber-800' :
                'bg-emerald-100 text-emerald-800'
              }`}>
                {patient.condition}
              </span>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                patient.riskLevel === 'High' ? 'bg-red-100 text-red-700' :
                patient.riskLevel === 'Medium' ? 'bg-orange-100 text-orange-700' :
                'bg-green-100 text-green-700'
              }`}>
                Risk: {patient.riskLevel}
              </span>
            </div>
            <div className="flex items-center gap-6 mt-3 text-sm text-muted-foreground flex-wrap">
              <span>{patient.age} years old</span>
              <span>{patient.gender}</span>
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                Admitted: {patient.admissionDate ? format(new Date(patient.admissionDate), "MMM dd, yyyy") : "N/A"}
              </span>
              {patient.hospitalId && (
                <span className="flex items-center gap-1">
                  <Building2 className="h-3.5 w-3.5" />
                  Hospital #{patient.hospitalId}
                </span>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {vitalCards.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * (i + 1) }}
            className={`bg-card border rounded-2xl p-5 shadow-sm ${card.alert ? 'border-red-300 ring-2 ring-red-100' : 'border-border'}`}
          >
            <div className="flex items-center gap-3 mb-3">
              <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${card.color}`}>
                <card.icon className="h-5 w-5" />
              </div>
              {card.alert && (
                <span className="text-[10px] font-bold uppercase text-red-500 animate-pulse">Alert</span>
              )}
            </div>
            <p className="text-xs text-muted-foreground font-medium">{card.label}</p>
            <p className="text-2xl font-bold font-display mt-1">{card.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="lg:col-span-2 bg-card border border-border rounded-2xl p-6 shadow-sm"
        >
          <h3 className="text-lg font-bold font-display mb-4">Vitals History</h3>
          {heartRateData.length > 0 ? (
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={heartRateData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: '8px', border: '1px solid hsl(var(--border))' }}
                    itemStyle={{ color: 'hsl(var(--foreground))' }}
                  />
                  <Line type="monotone" dataKey="heartRate" stroke="hsl(0 84% 60%)" strokeWidth={2} dot={{ r: 4 }} name="Heart Rate" />
                  <Line type="monotone" dataKey="oxygenLevel" stroke="hsl(160 84% 40%)" strokeWidth={2} dot={{ r: 4 }} name="O2 Level" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-[250px] flex items-center justify-center text-muted-foreground">
              <p>No vitals history available</p>
            </div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-card border border-border rounded-2xl p-6 shadow-sm"
        >
          <h3 className="text-lg font-bold font-display mb-4">Medical History</h3>
          {medicalHistory.length > 0 ? (
            <div className="space-y-3">
              {medicalHistory.map((item, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-muted/50 border border-border/50">
                  <div className="h-2 w-2 rounded-full bg-primary shrink-0" />
                  <span className="text-sm font-medium">{item}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No medical history recorded</p>
          )}
        </motion.div>
      </div>
    </div>
  );
}
