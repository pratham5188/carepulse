import { pgTable, text, serial, integer, boolean, timestamp, jsonb, doublePrecision, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";
import { users } from "./models/auth";

// Export Auth Models
export * from "./models/auth";
export * from "./models/chat";

// === Medical Schema ===

export const hospitals = pgTable("hospitals", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  country: text("country").notNull().default("India"),
  state: text("state").notNull().default("Delhi"),
  city: text("city").notNull().default("New Delhi"),
  area: text("area").notNull().default("Ansari Nagar"),
  location: text("location").notNull(), // "Full Address"
  latitude: doublePrecision("latitude").notNull(),
  longitude: doublePrecision("longitude").notNull(),
  specializedDepartments: text("specialized_departments").array(),
  bedCapacity: integer("bed_capacity").notNull(),
  icuCapacity: integer("icu_capacity").notNull(),
  currentOccupancy: integer("current_occupancy").notNull(),
  contactNumber: text("contact_number"),
  email: text("email"),
});

export const patients = pgTable("patients", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  age: integer("age").notNull(),
  gender: text("gender").notNull(),
  condition: text("condition").notNull(), // Stable, Critical, Recovering
  riskLevel: text("risk_level").notNull(), // Low, Medium, High
  admissionDate: timestamp("admission_date").defaultNow(),
  hospitalId: integer("hospital_id").references(() => hospitals.id),
  medicalHistory: jsonb("medical_history"), // Array of past conditions
});

export const vitals = pgTable("vitals", {
  id: serial("id").primaryKey(),
  patientId: integer("patient_id").notNull().references(() => patients.id),
  heartRate: integer("heart_rate"),
  bloodPressure: text("blood_pressure"), // "120/80"
  oxygenLevel: integer("oxygen_level"),
  temperature: doublePrecision("temperature"),
  timestamp: timestamp("timestamp").defaultNow(),
});

export const diseaseTrends = pgTable("disease_trends", {
  id: serial("id").primaryKey(),
  diseaseName: text("disease_name").notNull(),
  location: text("location").notNull(),
  caseCount: integer("case_count").notNull(),
  timestamp: timestamp("timestamp").defaultNow(),
});

// === Appointments ===
export const appointments = pgTable("appointments", {
  id: serial("id").primaryKey(),
  patientName: text("patient_name").notNull(),
  patientEmail: text("patient_email").notNull(),
  doctorId: varchar("doctor_id").references(() => users.id),
  doctorName: text("doctor_name"),
  hospitalId: integer("hospital_id").references(() => hospitals.id),
  date: text("date").notNull(),
  time: text("time").notNull(),
  status: text("status").notNull().default("scheduled"),
  reason: text("reason").notNull(),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

// === Prescriptions ===
export const prescriptions = pgTable("prescriptions", {
  id: serial("id").primaryKey(),
  patientId: integer("patient_id").references(() => patients.id),
  patientName: text("patient_name").notNull(),
  patientEmail: text("patient_email"),
  doctorId: varchar("doctor_id").references(() => users.id),
  doctorName: text("doctor_name").notNull(),
  diagnosis: text("diagnosis").notNull(),
  medications: jsonb("medications").notNull(),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

// === Audit Logs ===
export const auditLogs = pgTable("audit_logs", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id"),
  userEmail: text("user_email"),
  action: text("action").notNull(),
  details: text("details"),
  createdAt: timestamp("created_at").defaultNow(),
});

// === RELATIONS ===
export const hospitalsRelations = relations(hospitals, ({ many }) => ({
  patients: many(patients),
  appointments: many(appointments),
}));

export const locations = pgTable("locations", {
  id: serial("id").primaryKey(),
  state: text("state").notNull(),
  city: text("city").notNull(),
});

export const patientsRelations = relations(patients, ({ one, many }) => ({
  hospital: one(hospitals, {
    fields: [patients.hospitalId],
    references: [hospitals.id],
  }),
  vitals: many(vitals),
  prescriptions: many(prescriptions),
}));

export const vitalsRelations = relations(vitals, ({ one }) => ({
  patient: one(patients, {
    fields: [vitals.patientId],
    references: [patients.id],
  }),
}));

export const appointmentsRelations = relations(appointments, ({ one }) => ({
  hospital: one(hospitals, {
    fields: [appointments.hospitalId],
    references: [hospitals.id],
  }),
}));

export const prescriptionsRelations = relations(prescriptions, ({ one }) => ({
  patient: one(patients, {
    fields: [prescriptions.patientId],
    references: [patients.id],
  }),
}));

// === INSERTS ===
export const insertHospitalSchema = createInsertSchema(hospitals).omit({ id: true });
export const insertLocationSchema = createInsertSchema(locations).omit({ id: true });
export const insertPatientSchema = createInsertSchema(patients).omit({ id: true, admissionDate: true });
export const insertVitalSchema = createInsertSchema(vitals).omit({ id: true, timestamp: true });
export const insertDiseaseTrendSchema = createInsertSchema(diseaseTrends).omit({ id: true, timestamp: true });
export const insertAppointmentSchema = createInsertSchema(appointments).omit({ id: true, createdAt: true });
export const insertPrescriptionSchema = createInsertSchema(prescriptions).omit({ id: true, createdAt: true });
export const insertAuditLogSchema = createInsertSchema(auditLogs).omit({ id: true, createdAt: true });

// === TYPES ===
export type Hospital = typeof hospitals.$inferSelect;
export type InsertHospital = z.infer<typeof insertHospitalSchema>;

export type Location = typeof locations.$inferSelect;
export type InsertLocation = z.infer<typeof insertLocationSchema>;

export type Patient = typeof patients.$inferSelect;
export type InsertPatient = z.infer<typeof insertPatientSchema>;

export type Vital = typeof vitals.$inferSelect;
export type InsertVital = z.infer<typeof insertVitalSchema>;

export type DiseaseTrend = typeof diseaseTrends.$inferSelect;
export type InsertDiseaseTrend = z.infer<typeof insertDiseaseTrendSchema>;

export type Appointment = typeof appointments.$inferSelect;
export type InsertAppointment = z.infer<typeof insertAppointmentSchema>;

export type Prescription = typeof prescriptions.$inferSelect;
export type InsertPrescription = z.infer<typeof insertPrescriptionSchema>;

export type AuditLog = typeof auditLogs.$inferSelect;
export type InsertAuditLog = z.infer<typeof insertAuditLogSchema>;
