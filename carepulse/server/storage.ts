import { db } from "./db";
import {
  hospitals, patients, vitals, diseaseTrends,
  appointments, prescriptions, auditLogs, locations,
  type Hospital, type Patient, type Vital, type DiseaseTrend, type Location,
  type Appointment, type Prescription, type AuditLog,
  type InsertHospital, type InsertPatient, type InsertVital, type InsertDiseaseTrend, type InsertLocation,
  type InsertAppointment, type InsertPrescription, type InsertAuditLog,
} from "../shared/schema";
import { users } from "../shared/models/auth";
import { eq, desc, sql, and } from "drizzle-orm";

export interface IStorage {
  getHospitals(): Promise<Hospital[]>;
  getHospital(id: number): Promise<Hospital | undefined>;
  createHospital(hospital: InsertHospital): Promise<Hospital>;
  getLocations(): Promise<Location[]>;
  createLocation(location: InsertLocation): Promise<Location>;
  getPatients(): Promise<Patient[]>;
  getPatient(id: number): Promise<Patient | undefined>;
  createPatient(patient: InsertPatient): Promise<Patient>;
  getPatientVitals(patientId: number): Promise<Vital[]>;
  addVital(vital: InsertVital): Promise<Vital>;
  getDiseaseTrends(): Promise<DiseaseTrend[]>;
  createDiseaseTrend(trend: InsertDiseaseTrend): Promise<DiseaseTrend>;
  getSystemStats(): Promise<{ totalPatients: number; criticalPatients: number; totalHospitals: number; activeAlerts: number }>;
  getAppointments(): Promise<Appointment[]>;
  getAppointmentsByEmail(email: string): Promise<Appointment[]>;
  getAppointmentsByDoctor(doctorId: string): Promise<Appointment[]>;
  getAppointmentsByHospital(hospitalId: number): Promise<Appointment[]>;
  findConflictingAppointment(hospitalId: number, date: string, time: string): Promise<Appointment | undefined>;
  getPatientsbyHospital(hospitalId: number): Promise<Patient[]>;
  createAppointment(appointment: InsertAppointment): Promise<Appointment>;
  getAppointment(id: number): Promise<Appointment | undefined>;
  updateAppointment(id: number, data: Partial<InsertAppointment>): Promise<Appointment | undefined>;
  getPrescriptions(): Promise<Prescription[]>;
  getPrescriptionsByPatient(patientId: number): Promise<Prescription[]>;
  getPrescriptionsByPatientName(name: string): Promise<Prescription[]>;
  getPrescriptionsByPatientEmail(email: string): Promise<Prescription[]>;
  getPrescriptionsByDoctor(doctorId: string): Promise<Prescription[]>;
  createPrescription(prescription: InsertPrescription): Promise<Prescription>;
  getAuditLogs(): Promise<AuditLog[]>;
  createAuditLog(log: InsertAuditLog): Promise<AuditLog>;
  getAllUsers(): Promise<any[]>;
  updateUserRole(id: string, role: string): Promise<any>;
  getPlatformStats(): Promise<any>;
}

export class DatabaseStorage implements IStorage {
  async getHospitals(): Promise<Hospital[]> {
    return await db.select().from(hospitals);
  }

  async getHospital(id: number): Promise<Hospital | undefined> {
    const [hospital] = await db.select().from(hospitals).where(eq(hospitals.id, id));
    return hospital;
  }

  async createHospital(hospital: InsertHospital): Promise<Hospital> {
    const [newHospital] = await db.insert(hospitals).values(hospital).returning();
    return newHospital;
  }

  async getLocations(): Promise<Location[]> {
    return await db.select().from(locations);
  }

  async createLocation(location: InsertLocation): Promise<Location> {
    const [newLocation] = await db.insert(locations).values(location).returning();
    return newLocation;
  }

  async getPatients(): Promise<Patient[]> {
    return await db.select().from(patients);
  }

  async getPatient(id: number): Promise<Patient | undefined> {
    const [patient] = await db.select().from(patients).where(eq(patients.id, id));
    return patient;
  }

  async createPatient(patient: InsertPatient): Promise<Patient> {
    const [newPatient] = await db.insert(patients).values(patient).returning();
    return newPatient;
  }

  async getPatientVitals(patientId: number): Promise<Vital[]> {
    return await db.select()
      .from(vitals)
      .where(eq(vitals.patientId, patientId))
      .orderBy(desc(vitals.timestamp));
  }

  async addVital(vital: InsertVital): Promise<Vital> {
    const [newVital] = await db.insert(vitals).values(vital).returning();
    return newVital;
  }

  async getDiseaseTrends(): Promise<DiseaseTrend[]> {
    return await db.select().from(diseaseTrends);
  }

  async createDiseaseTrend(trend: InsertDiseaseTrend): Promise<DiseaseTrend> {
    const [newTrend] = await db.insert(diseaseTrends).values(trend).returning();
    return newTrend;
  }

  async getSystemStats() {
    const allPatients = await this.getPatients();
    const allHospitals = await this.getHospitals();
    return {
      totalPatients: allPatients.length,
      criticalPatients: allPatients.filter(p => p.condition === "Critical").length,
      totalHospitals: allHospitals.length,
      activeAlerts: allPatients.filter(p => p.riskLevel === "High").length,
    };
  }

  async getAppointments(): Promise<Appointment[]> {
    return await db.select().from(appointments).orderBy(desc(appointments.createdAt));
  }

  async getAppointmentsByEmail(email: string): Promise<Appointment[]> {
    return await db.select().from(appointments).where(eq(appointments.patientEmail, email)).orderBy(desc(appointments.createdAt));
  }

  async getAppointmentsByDoctor(doctorId: string): Promise<Appointment[]> {
    return await db.select().from(appointments).where(eq(appointments.doctorId, doctorId)).orderBy(desc(appointments.createdAt));
  }

  async getAppointmentsByHospital(hospitalId: number): Promise<Appointment[]> {
    return await db.select().from(appointments).where(eq(appointments.hospitalId, hospitalId)).orderBy(desc(appointments.createdAt));
  }

  async findConflictingAppointment(hospitalId: number, date: string, time: string): Promise<Appointment | undefined> {
    const [conflict] = await db.select().from(appointments).where(
      and(
        eq(appointments.hospitalId, hospitalId),
        eq(appointments.date, date),
        eq(appointments.time, time),
        eq(appointments.status, "scheduled")
      )
    );
    return conflict;
  }

  async getPatientsbyHospital(hospitalId: number): Promise<Patient[]> {
    return await db.select().from(patients).where(eq(patients.hospitalId, hospitalId)).orderBy(desc(patients.admissionDate));
  }

  async createAppointment(appointment: InsertAppointment): Promise<Appointment> {
    const [newAppointment] = await db.insert(appointments).values(appointment).returning();
    return newAppointment;
  }

  async getAppointment(id: number): Promise<Appointment | undefined> {
    const [appointment] = await db.select().from(appointments).where(eq(appointments.id, id));
    return appointment;
  }

  async updateAppointment(id: number, data: Partial<InsertAppointment>): Promise<Appointment | undefined> {
    const [updated] = await db.update(appointments).set(data).where(eq(appointments.id, id)).returning();
    return updated;
  }

  async getPrescriptions(): Promise<Prescription[]> {
    return await db.select().from(prescriptions).orderBy(desc(prescriptions.createdAt));
  }

  async getPrescriptionsByPatient(patientId: number): Promise<Prescription[]> {
    return await db.select().from(prescriptions).where(eq(prescriptions.patientId, patientId)).orderBy(desc(prescriptions.createdAt));
  }

  async getPrescriptionsByPatientName(name: string): Promise<Prescription[]> {
    return await db.select().from(prescriptions).where(eq(prescriptions.patientName, name)).orderBy(desc(prescriptions.createdAt));
  }

  async getPrescriptionsByPatientEmail(email: string): Promise<Prescription[]> {
    return await db.select().from(prescriptions).where(eq(prescriptions.patientEmail, email)).orderBy(desc(prescriptions.createdAt));
  }

  async getPrescriptionsByDoctor(doctorId: string): Promise<Prescription[]> {
    return await db.select().from(prescriptions).where(eq(prescriptions.doctorId, doctorId)).orderBy(desc(prescriptions.createdAt));
  }

  async createPrescription(prescription: InsertPrescription): Promise<Prescription> {
    const [newPrescription] = await db.insert(prescriptions).values(prescription).returning();
    return newPrescription;
  }

  async getAuditLogs(): Promise<AuditLog[]> {
    return await db.select().from(auditLogs).orderBy(desc(auditLogs.createdAt)).limit(200);
  }

  async createAuditLog(log: InsertAuditLog): Promise<AuditLog> {
    const [newLog] = await db.insert(auditLogs).values(log).returning();
    return newLog;
  }

  async getAllUsers(): Promise<any[]> {
    const allUsers = await db.select({
      id: users.id,
      email: users.email,
      firstName: users.firstName,
      lastName: users.lastName,
      role: users.role,
      createdAt: users.createdAt,
    }).from(users).orderBy(desc(users.createdAt));
    return allUsers;
  }

  async updateUserRole(id: string, role: string): Promise<any> {
    const [updated] = await db.update(users).set({ role, updatedAt: new Date() }).where(eq(users.id, id)).returning({
      id: users.id,
      email: users.email,
      firstName: users.firstName,
      lastName: users.lastName,
      role: users.role,
    });
    return updated;
  }

  async getPlatformStats(): Promise<any> {
    const allUsers = await db.select().from(users);
    const allAppointments = await db.select().from(appointments);
    const allPrescriptions = await db.select().from(prescriptions);
    const allPatients = await this.getPatients();
    const allHospitals = await this.getHospitals();

    return {
      totalUsers: allUsers.length,
      usersByRole: {
        patients: allUsers.filter(u => u.role === "patient").length,
        doctors: allUsers.filter(u => u.role === "doctor").length,
        admins: allUsers.filter(u => u.role === "admin").length,
      },
      totalAppointments: allAppointments.length,
      appointmentsByStatus: {
        scheduled: allAppointments.filter(a => a.status === "scheduled").length,
        completed: allAppointments.filter(a => a.status === "completed").length,
        cancelled: allAppointments.filter(a => a.status === "cancelled").length,
      },
      totalPrescriptions: allPrescriptions.length,
      totalPatients: allPatients.length,
      totalHospitals: allHospitals.length,
      criticalPatients: allPatients.filter(p => p.condition === "Critical").length,
    };
  }
}

export const storage = new DatabaseStorage();
