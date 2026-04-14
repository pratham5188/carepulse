const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

const outputPath = path.join(__dirname, "../public/datasets/CarePulse_Database_Guide.pdf");
const doc = new PDFDocument({ margin: 50, size: "A4", bufferPages: true, autoFirstPage: true });
const stream = fs.createWriteStream(outputPath);
doc.pipe(stream);

const BLUE = "#1e40af";
const DARK = "#111827";
const GRAY = "#6b7280";
const GREEN = "#166534";
const RED = "#991b1b";
const ORANGE = "#92400e";
const PURPLE = "#5b21b6";

function heading(text) {
  doc.fontSize(18).fillColor(BLUE).font("Helvetica-Bold").text(text).moveDown(0.3);
  doc.moveTo(50, doc.y).lineTo(545, doc.y).strokeColor(BLUE).lineWidth(1).stroke().moveDown(0.5);
}

function sub(text, color) {
  doc.fontSize(13).fillColor(color || DARK).font("Helvetica-Bold").text(text).moveDown(0.2);
}

function body(text) {
  doc.fontSize(10.5).fillColor(DARK).font("Helvetica").text(text, { lineGap: 3, width: 495 }).moveDown(0.3);
}

function bullet(text) {
  doc.fontSize(10.5).fillColor(DARK).font("Helvetica").text("  •  " + text, { lineGap: 3, indent: 10, width: 485 }).moveDown(0.15);
}

function note(text, color) {
  const c = color || "#1e40af";
  const bg = c === "#1e40af" ? "#eff6ff" : c === "#166534" ? "#f0fdf4" : c === "#92400e" ? "#fffbeb" : c === "#5b21b6" ? "#f5f3ff" : "#fef2f2";
  const startY = doc.y;
  doc.rect(50, startY, 495, 36).fill(bg);
  doc.fontSize(9.5).fillColor(c).font("Helvetica").text(text, 60, startY + 6, { width: 475, lineGap: 2 });
  doc.moveDown(0.8);
}

function tblHead(cols, widths) {
  let x = 50;
  const y = doc.y;
  widths.forEach((w, i) => {
    doc.rect(x, y, w, 18).fill(BLUE);
    doc.fontSize(9).fillColor("white").font("Helvetica-Bold").text(cols[i], x + 3, y + 4, { width: w - 6, lineBreak: false });
    x += w;
  });
  doc.y = y + 18;
}

function tblRow(cols, widths, even) {
  let x = 50;
  const y = doc.y;
  const h = 16;
  widths.forEach((w, i) => {
    doc.rect(x, y, w, h).fill(even ? "#f0f4ff" : "white").rect(x, y, w, h).strokeColor("#d1d5db").lineWidth(0.5).stroke();
    doc.fontSize(8.5).fillColor(DARK).font("Helvetica").text(cols[i] || "", x + 3, y + 3, { width: w - 6, lineBreak: false });
    x += w;
  });
  doc.y = y + h;
}

function newSection(title) {
  doc.addPage();
  heading(title);
}

// ─── COVER PAGE ───────────────────────────────────────────────────────────────
doc.rect(0, 0, doc.page.width, 190).fill(BLUE);
doc.fontSize(10).fillColor("#bfdbfe").font("Helvetica").text("CarePulse Healthcare Analytics Platform", 50, 55, { align: "center", width: 495 });
doc.fontSize(28).fillColor("white").font("Helvetica-Bold").text("Database Architecture Guide", 50, 80, { align: "center", width: 495 });
doc.fontSize(13).fillColor("#bfdbfe").font("Helvetica").text("How Data Is Stored & How the Database Works", 50, 128, { align: "center", width: 495 });

doc.moveDown(2.5);
doc.fontSize(12).fillColor(DARK).font("Helvetica-Bold").text("Contents of This Guide:", { align: "center" }).moveDown(0.4);
[
  "What database CarePulse uses and why (PostgreSQL)",
  "All 12 database tables — every column explained",
  "Foreign keys and table relationships",
  "Data flow: User click → Server → Database → Response",
  "Data types: SERIAL, TEXT, JSONB, TIMESTAMP, TEXT[]",
  "How Drizzle ORM converts TypeScript to SQL",
  "Security: password hashing, sessions, OTP protection",
  "20+ Viva Q&As with detailed answers",
].forEach(t => bullet(t));

doc.moveDown(1).fontSize(9).fillColor(GRAY).font("Helvetica")
  .text("Generated: " + new Date().toDateString() + "  |  CarePulse v1.0  |  For Academic & Learning Use", { align: "center", width: 495 });

// ─── SECTION 1 ────────────────────────────────────────────────────────────────
newSection("1. What Is a Database?");
body("A database is an organised collection of data that a computer program can read and write. Think of it like a huge, structured Excel workbook — but much faster, more reliable, and usable by thousands of people at the same time.");
sub("Real-Life Analogy");
body("Imagine a hospital with paper files for 10,000 patients. To find one patient, a nurse reads every file — that could take hours. A database is a digital filing cabinet that finds ANY record in under a millisecond.");
sub("CarePulse Uses PostgreSQL");
bullet("PostgreSQL is a powerful, open-source Relational Database Management System (RDBMS).");
bullet("Data is stored in tables (like Excel sheets) with rows (records) and columns (fields).");
bullet("It is ACID-compliant — data is never lost or corrupted, even during a server crash.");
bullet("Hosted on Replit's cloud PostgreSQL infrastructure. Connection via DATABASE_URL secret.");
doc.moveDown(0.3);
note("ACID = Atomicity (all-or-nothing), Consistency (always valid), Isolation (no interference between transactions), Durability (survives crashes). PostgreSQL guarantees all four — essential for healthcare data.", GREEN);
sub("What Is Drizzle ORM?");
body("ORM = Object-Relational Mapper. Developers write TypeScript code, and Drizzle converts it into SQL automatically. This is type-safe — errors are caught before the app even runs.");
tblHead(["Approach", "Example"], [110, 385]);
tblRow(["Raw SQL", "SELECT * FROM users WHERE email = 'test@carepulse.com'"], [110, 385], true);
tblRow(["Drizzle ORM", "db.select().from(users).where(eq(users.email, email))"], [110, 385], false);
doc.moveDown(0.5);
sub("What Is Zod?");
body("Zod is a validation library. Before data is saved to the database, Zod checks: Is the age a number? Is the email valid? If not, it rejects the data and returns an error — keeping the database clean.");

// ─── SECTION 2 ────────────────────────────────────────────────────────────────
newSection("2. Database Tables — Users, Sessions & Auth");
note("Primary Key (PK) = unique ID for each row.   Foreign Key (FK) = column pointing to another table's PK, linking the two tables.", BLUE);

sub("Table 1: users", BLUE);
body("Stores all registered users — patients, doctors, and admins.");
tblHead(["Column", "Type", "Req", "Description"], [130, 85, 35, 245]);
[
  ["id", "VARCHAR(UUID)", "PK", "Auto-generated UUID. Globally unique — no two users share an ID."],
  ["email", "VARCHAR", "Uniq", "Login email. Unique constraint — one email per account."],
  ["password", "VARCHAR", "No", "bcrypt-hashed password. Never stored as plain text."],
  ["first_name", "VARCHAR", "No", "User's first name shown on dashboard."],
  ["last_name", "VARCHAR", "No", "User's last name."],
  ["phone", "VARCHAR", "No", "Mobile number."],
  ["role", "VARCHAR", "No", "'patient', 'doctor', or 'admin'. Controls access permissions."],
  ["hospital_id", "INTEGER", "No", "For doctors: which hospital they work at (FK → hospitals.id)."],
  ["profile_image_url", "VARCHAR", "No", "URL to profile photo in cloud storage."],
  ["created_at", "TIMESTAMP", "Auto", "Account creation date and time."],
  ["updated_at", "TIMESTAMP", "Auto", "Last profile update timestamp."],
].forEach((r, i) => tblRow(r, [130, 85, 35, 245], i % 2 === 0));

doc.moveDown(0.6);
sub("Table 2: sessions", GREEN);
body("Stores login sessions. When a user logs in, a session row is created here.");
tblHead(["Column", "Type", "Req", "Description"], [130, 85, 35, 245]);
[
  ["sid", "VARCHAR", "PK", "Random session ID string. Sent as an HTTP-only cookie to the browser."],
  ["sess", "JSONB", "Yes", "Session data as JSON: {userId, role, email, loginTime}."],
  ["expire", "TIMESTAMP", "Yes", "Session expiry time. After this, the user is automatically logged out."],
].forEach((r, i) => tblRow(r, [130, 85, 35, 245], i % 2 === 0));
doc.moveDown(0.3);
note("Login flow: User enters email+password → Server creates sessions row → Sends session ID cookie to browser → Browser sends cookie on every request → Server looks up sessions table to identify user.", GREEN);

doc.moveDown(0.3);
sub("Table 3: password_reset_otps", ORANGE);
body("Stores One-Time Passwords used for 'Forgot Password' email verification.");
tblHead(["Column", "Type", "Req", "Description"], [130, 85, 35, 245]);
[
  ["id", "VARCHAR(UUID)", "PK", "Unique OTP record ID."],
  ["email", "VARCHAR", "Yes", "Email address the OTP was sent to."],
  ["otp", "VARCHAR(6)", "Yes", "6-digit code e.g. '847291'. Sent via Gmail SMTP."],
  ["expires_at", "TIMESTAMP", "Yes", "OTP expires 10 minutes after creation."],
  ["used", "VARCHAR", "No", "'true' or 'false'. Once used, the OTP is invalidated (prevents reuse)."],
  ["created_at", "TIMESTAMP", "Auto", "When the OTP was generated."],
].forEach((r, i) => tblRow(r, [130, 85, 35, 245], i % 2 === 0));

// ─── SECTION 3 ────────────────────────────────────────────────────────────────
newSection("3. Database Tables — Medical & Clinical Data");

sub("Table 4: hospitals", PURPLE);
body("CarePulse stores 70,000 hospitals across all Indian states — the largest table in the system.");
tblHead(["Column", "Type", "Req", "Description"], [130, 95, 30, 240]);
[
  ["id", "SERIAL", "PK", "Auto-incrementing integer. First hospital = 1, second = 2, etc."],
  ["name", "TEXT", "Yes", "Hospital name e.g. 'All India Institute of Medical Sciences (AIIMS)'."],
  ["country", "TEXT", "Yes", "Country. Default: 'India'."],
  ["state", "TEXT", "Yes", "Indian state e.g. 'Maharashtra', 'Tamil Nadu'."],
  ["city", "TEXT", "Yes", "City e.g. 'Mumbai', 'Chennai'."],
  ["area", "TEXT", "Yes", "Locality within the city."],
  ["location", "TEXT", "Yes", "Full street address."],
  ["latitude", "DOUBLE PRECISION", "Yes", "GPS latitude for map display e.g. 28.6139."],
  ["longitude", "DOUBLE PRECISION", "Yes", "GPS longitude for map display e.g. 77.2090."],
  ["specialized_departments", "TEXT[]", "No", "Array: ['Cardiology', 'Oncology', 'Neurology']."],
  ["bed_capacity", "INTEGER", "Yes", "Total beds in the hospital."],
  ["icu_capacity", "INTEGER", "Yes", "Number of ICU (Intensive Care Unit) beds."],
  ["current_occupancy", "INTEGER", "Yes", "Currently occupied beds. Used for capacity alerts."],
  ["contact_number", "TEXT", "No", "Hospital phone number."],
  ["email", "TEXT", "No", "Hospital email."],
].forEach((r, i) => tblRow(r, [130, 95, 30, 240], i % 2 === 0));
doc.moveDown(0.4);

sub("Table 5: patients");
body("Stores admitted patient records with medical status and history.");
tblHead(["Column", "Type", "Req", "Description"], [130, 95, 30, 240]);
[
  ["id", "SERIAL", "PK", "Auto-incrementing patient ID."],
  ["name", "TEXT", "Yes", "Full name of the patient."],
  ["age", "INTEGER", "Yes", "Patient age in years."],
  ["gender", "TEXT", "Yes", "'Male', 'Female', or 'Other'."],
  ["condition", "TEXT", "Yes", "Current condition: 'Stable', 'Critical', or 'Recovering'."],
  ["risk_level", "TEXT", "Yes", "Risk level: 'Low', 'Medium', or 'High'."],
  ["admission_date", "TIMESTAMP", "Auto", "Date and time of hospital admission."],
  ["hospital_id", "INTEGER", "No", "Which hospital (FK → hospitals.id)."],
  ["medical_history", "JSONB", "No", "Array of past conditions: [{condition, year}]."],
].forEach((r, i) => tblRow(r, [130, 95, 30, 240], i % 2 === 0));
doc.moveDown(0.4);

sub("Table 6: vitals", RED);
body("Stores vital sign readings for each patient. One patient has many readings over time.");
tblHead(["Column", "Type", "Req", "Description"], [130, 95, 30, 240]);
[
  ["id", "SERIAL", "PK", "Auto-incrementing ID."],
  ["patient_id", "INTEGER", "FK", "Links vitals to a patient (FK → patients.id)."],
  ["heart_rate", "INTEGER", "No", "BPM. Normal range: 60–100 BPM."],
  ["blood_pressure", "TEXT", "No", "'120/80' format (systolic/diastolic)."],
  ["oxygen_level", "INTEGER", "No", "SpO2 percentage. Normal: 95–100%."],
  ["temperature", "DOUBLE PRECISION", "No", "Body temperature in Celsius e.g. 37.2."],
  ["timestamp", "TIMESTAMP", "Auto", "When these vitals were recorded."],
].forEach((r, i) => tblRow(r, [130, 95, 30, 240], i % 2 === 0));

// ─── SECTION 4 ────────────────────────────────────────────────────────────────
newSection("4. Database Tables — Appointments, Prescriptions & AI");

sub("Table 7: appointments", BLUE);
body("Core table — stores all patient appointment bookings with validation.");
tblHead(["Column", "Type", "Req", "Description"], [120, 95, 30, 250]);
[
  ["id", "SERIAL", "PK", "Auto-incrementing appointment ID."],
  ["patient_name", "TEXT", "Yes", "Patient's full name."],
  ["patient_email", "TEXT", "Yes", "Patient's email. Used to filter their own appointments."],
  ["doctor_id", "VARCHAR", "No", "Assigned doctor (FK → users.id)."],
  ["doctor_name", "TEXT", "No", "Doctor's display name (stored for speed, avoids join)."],
  ["hospital_id", "INTEGER", "No", "Which hospital (FK → hospitals.id)."],
  ["date", "TEXT", "Yes", "Date as 'YYYY-MM-DD' e.g. '2026-04-15'. Stored as TEXT to avoid UTC timezone shift."],
  ["time", "TEXT", "Yes", "Time as 'HH:MM' e.g. '10:30'."],
  ["status", "TEXT", "Yes", "'scheduled', 'completed', or 'cancelled'. Default: 'scheduled'."],
  ["reason", "TEXT", "Yes", "Reason for visit e.g. 'Chest pain checkup'."],
  ["notes", "TEXT", "No", "Doctor's notes after the appointment."],
  ["created_at", "TIMESTAMP", "Auto", "When the booking was made."],
].forEach((r, i) => tblRow(r, [120, 95, 30, 250], i % 2 === 0));
note("Validations: (1) Date must be today or future in IST (UTC+5:30).  (2) Date must not be an Indian public holiday (2025–2027).  (3) Time slot must not already be booked at the same hospital.", ORANGE);

doc.moveDown(0.4);
sub("Table 8: prescriptions", GREEN);
body("Stores prescriptions written by doctors. The medications column uses JSONB for flexibility.");
tblHead(["Column", "Type", "Req", "Description"], [120, 95, 30, 250]);
[
  ["id", "SERIAL", "PK", "Auto-incrementing prescription ID."],
  ["patient_id", "INTEGER", "No", "Links to patient (FK → patients.id)."],
  ["patient_name", "TEXT", "Yes", "Patient name."],
  ["patient_email", "TEXT", "No", "Patient email."],
  ["doctor_id", "VARCHAR", "No", "Doctor who wrote it (FK → users.id)."],
  ["doctor_name", "TEXT", "Yes", "Doctor name."],
  ["diagnosis", "TEXT", "Yes", "Diagnosed condition e.g. 'Type 2 Diabetes'."],
  ["medications", "JSONB", "Yes", "JSON array: [{name, dose, frequency}] for each drug."],
  ["notes", "TEXT", "No", "Extra instructions e.g. 'Avoid sugar. Take with food.'"],
  ["created_at", "TIMESTAMP", "Auto", "When the prescription was created."],
].forEach((r, i) => tblRow(r, [120, 95, 30, 250], i % 2 === 0));

doc.moveDown(0.4);
sub("Table 9: disease_trends", RED);
body("Tracks disease outbreaks across India. Powers the analytics dashboard.");
tblHead(["Column", "Type", "Req", "Description"], [120, 95, 30, 250]);
[
  ["id", "SERIAL", "PK", "Auto-incrementing ID."],
  ["disease_name", "TEXT", "Yes", "e.g. 'Dengue', 'Tuberculosis', 'COVID-19'."],
  ["location", "TEXT", "Yes", "City or state where cases are recorded."],
  ["case_count", "INTEGER", "Yes", "Number of reported cases at this location."],
  ["timestamp", "TIMESTAMP", "Auto", "When this data was recorded."],
].forEach((r, i) => tblRow(r, [120, 95, 30, 250], i % 2 === 0));

doc.moveDown(0.4);
sub("Tables 10 & 11: conversations + messages (AI Chat)", PURPLE);
body("Stores MedAssist AI chat history using a one-to-many relationship.");
tblHead(["Column", "Type", "Req", "Description"], [135, 95, 30, 235]);
[
  ["conversations.id", "SERIAL", "PK", "Unique conversation ID."],
  ["conversations.title", "TEXT", "Yes", "Chat title e.g. 'Headache and Fever Query'."],
  ["conversations.created_at", "TIMESTAMP", "Auto", "When conversation started."],
  ["messages.id", "SERIAL", "PK", "Unique message ID."],
  ["messages.conversation_id", "INTEGER", "FK", "Links to conversation. ON DELETE CASCADE — deleting conversation deletes all messages."],
  ["messages.role", "TEXT", "Yes", "'user' (human) or 'assistant' (Gemini AI response)."],
  ["messages.content", "TEXT", "Yes", "The actual message text."],
  ["messages.created_at", "TIMESTAMP", "Auto", "Message sent time."],
].forEach((r, i) => tblRow(r, [135, 95, 30, 235], i % 2 === 0));

doc.moveDown(0.4);
sub("Table 12: audit_logs", GRAY);
body("Records every important user action for security and compliance tracking.");
tblHead(["Column", "Type", "Req", "Description"], [120, 95, 30, 250]);
[
  ["id", "SERIAL", "PK", "Auto-incrementing log ID."],
  ["user_id", "VARCHAR", "No", "Who did the action (FK → users.id)."],
  ["user_email", "TEXT", "No", "Email stored for easy display without requiring a join."],
  ["action", "TEXT", "Yes", "e.g. 'CREATE_APPOINTMENT', 'LOGIN', 'CANCEL_APPOINTMENT'."],
  ["details", "TEXT", "No", "Extra context e.g. 'Appointment #42 cancelled by admin'."],
  ["created_at", "TIMESTAMP", "Auto", "Exact timestamp of the action."],
].forEach((r, i) => tblRow(r, [120, 95, 30, 250], i % 2 === 0));

// ─── SECTION 5 ────────────────────────────────────────────────────────────────
newSection("5. Table Relationships & Foreign Keys");

body("Tables in a relational database link to each other using Foreign Keys (FK). A FK in one table references the Primary Key of another, establishing a relationship without duplicating data.");
note("Analogy: The 'appointments' table does not copy the full hospital record. It just stores the hospital's ID number. When the hospital name is needed, the server 'joins' the two tables using that ID.", BLUE);

tblHead(["Tables Connected", "Foreign Key Reference", "Relationship Type"], [140, 215, 140]);
[
  ["patients → hospitals", "patients.hospital_id → hospitals.id", "Many patients → One hospital"],
  ["vitals → patients", "vitals.patient_id → patients.id", "Many vitals → One patient"],
  ["appointments → hospitals", "appointments.hospital_id → hospitals.id", "Many appts → One hospital"],
  ["appointments → users", "appointments.doctor_id → users.id", "Many appts → One doctor"],
  ["prescriptions → patients", "prescriptions.patient_id → patients.id", "Many prescriptions → One patient"],
  ["prescriptions → users", "prescriptions.doctor_id → users.id", "Many prescriptions → One doctor"],
  ["messages → conversations", "messages.conversation_id → conversations.id (CASCADE)", "Many messages → One conversation"],
].forEach((r, i) => tblRow(r, [140, 215, 140], i % 2 === 0));

doc.moveDown(0.5);
sub("What is CASCADE DELETE?");
body("The messages table uses ON DELETE CASCADE on conversation_id. When a conversation is deleted, PostgreSQL automatically deletes all its messages. This prevents 'orphan records' — messages that belong to nothing.");

sub("ER Diagram (Text Format)");
body("The entity relationships form this tree structure:");
bullet("hospitals ──< patients ──< vitals  (Hospital has many Patients, each has many Vitals)");
bullet("hospitals ──< appointments >── users (doctors)");
bullet("users (doctors) ──< prescriptions >── patients");
bullet("conversations ──< messages  (CASCADE DELETE)");
bullet("users ──> sessions  (One user, potentially multiple sessions on different devices)");
bullet("users ──> password_reset_otps  (Multiple OTPs over time per user)");

// ─── SECTION 6 ────────────────────────────────────────────────────────────────
newSection("6. Data Flow — Step by Step");

sub("Booking an Appointment (Full Flow)");
tblHead(["Step", "What Happens"], [120, 375]);
[
  ["1. User Clicks", "Patient fills booking form: selects hospital, date, time, enters reason."],
  ["2. Frontend Check", "React validates: Is date selected? Not a holiday? Not in the past (IST)?"],
  ["3. HTTP POST", "React sends POST /api/appointments with JSON body to Express server."],
  ["4. Auth Check", "Server checks session cookie. Not logged in? Returns 401 Unauthorized."],
  ["5. Zod Validation", "Server validates all fields using Zod schema. Invalid data? Returns 400."],
  ["6. IST Date Check", "Is date < today in IST (UTC+5:30)? Returns 400: 'Date cannot be in the past.'"],
  ["7. Holiday Check", "Is date a public holiday? Returns 400 with the holiday name."],
  ["8. Conflict Check", "SELECT from appointments WHERE hospital_id + date + time match. Returns 409 if conflict exists."],
  ["9. DB Insert", "Drizzle executes: INSERT INTO appointments (...) VALUES (...) RETURNING *"],
  ["10. Audit Log", "INSERT INTO audit_logs (action='CREATE_APPOINTMENT', userId, details)"],
  ["11. Response", "Server returns new appointment as JSON with HTTP 201 Created."],
  ["12. UI Update", "React Query refetches appointments. New booking appears instantly."],
].forEach((r, i) => tblRow(r, [120, 375], i % 2 === 0));

doc.moveDown(0.5);
sub("Password Reset with OTP (Full Flow)");
tblHead(["Step", "What Happens"], [120, 375]);
[
  ["1. Request OTP", "User enters email on Forgot Password page."],
  ["2. Generate OTP", "Server creates random 6-digit number e.g. '847291'."],
  ["3. DB Insert", "INSERT INTO password_reset_otps (email, otp, expires_at=+10min, used='false')"],
  ["4. Email Sent", "Gmail SMTP (carepulse07@gmail.com) emails the OTP to the user's inbox."],
  ["5. User Enters OTP", "User types the 6-digit code within 10 minutes."],
  ["6. DB Query", "SELECT WHERE email=$1 AND otp=$2 AND used='false' AND expires_at > NOW()"],
  ["7. Password Update", "UPDATE users SET password=bcrypt(newPassword) WHERE email=$1"],
  ["8. OTP Invalidated", "UPDATE password_reset_otps SET used='true' WHERE id=$1 (prevents reuse)"],
].forEach((r, i) => tblRow(r, [120, 375], i % 2 === 0));

// ─── SECTION 7 ────────────────────────────────────────────────────────────────
newSection("7. Data Types & How Drizzle ORM Works");

sub("PostgreSQL Data Types Used in CarePulse");
tblHead(["Data Type", "Explanation & Where Used"], [120, 375]);
[
  ["SERIAL", "Auto-incrementing integer. Each new row gets the next number. Used for all numeric IDs (hospitals, patients, vitals, appointments, etc.)."],
  ["VARCHAR / VARCHAR(n)", "Text up to n characters. Used for emails, UUIDs, OTP codes."],
  ["TEXT", "Unlimited-length text. Used for names, addresses, reasons, notes, messages."],
  ["INTEGER", "Whole numbers only. Used for age, bed count, heart rate, case count."],
  ["DOUBLE PRECISION", "Decimal numbers. Used for GPS coordinates (28.6139) and temperature (37.2°C)."],
  ["TIMESTAMP", "Date + time together. e.g. '2026-03-24 14:30:00'. Used for created_at, expire, admission_date."],
  ["JSONB", "Binary JSON. Stores flexible structured data. Used for sessions.sess, patients.medical_history, prescriptions.medications."],
  ["TEXT[]", "Array of text values. Used for hospitals.specialized_departments e.g. ['Cardiology','ICU']."],
].forEach((r, i) => tblRow(r, [120, 375], i % 2 === 0));

doc.moveDown(0.5);
sub("JSONB — The Flexible Column");
body("JSONB stores structured JSON data efficiently. In CarePulse it is used for:");
bullet("sessions.sess — stores {userId, role, email} as JSON for the login session.");
bullet("patients.medical_history — [{\"condition\":\"Diabetes\",\"year\":2019}, ...]");
bullet("prescriptions.medications — [{\"name\":\"Metformin\",\"dose\":\"500mg\",\"frequency\":\"Twice daily\"}, ...]");
note("Example medications JSON in database: [{\"name\":\"Paracetamol\",\"dose\":\"500mg\",\"frequency\":\"Twice daily\"},{\"name\":\"Amoxicillin\",\"dose\":\"250mg\",\"frequency\":\"Three times daily\"}]", ORANGE);

doc.moveDown(0.3);
sub("How Drizzle ORM Converts Code to SQL");
tblHead(["Operation", "Drizzle TypeScript", "Generated SQL"], [90, 200, 205]);
[
  ["Find user", "db.select().from(users).where(eq(users.email, email))", "SELECT * FROM users WHERE email=$1"],
  ["Insert", "db.insert(appointments).values({...}).returning()", "INSERT INTO appointments (...) VALUES (...) RETURNING *"],
  ["Update", "db.update(appointments).set({status}).where(eq(appointments.id, id))", "UPDATE appointments SET status=$1 WHERE id=$2"],
  ["Delete", "db.delete(appointments).where(eq(appointments.id, id))", "DELETE FROM appointments WHERE id=$1"],
  ["Paginate", "db.select().from(hospitals).limit(100).offset(0)", "SELECT * FROM hospitals LIMIT 100 OFFSET 0"],
  ["Join", "db.select().from(appointments).leftJoin(hospitals,...)", "SELECT * FROM appointments LEFT JOIN hospitals ON ..."],
].forEach((r, i) => tblRow(r, [90, 200, 205], i % 2 === 0));

// ─── SECTION 8 ────────────────────────────────────────────────────────────────
newSection("8. Security — How CarePulse Protects Data");

sub("Password Security — bcrypt Hashing");
body("Passwords are NEVER stored as plain text. Before saving, bcrypt converts the password into an irreversible hash:");
note("Input: 'Admin@1234'  →  Stored in DB: '$2b$10$K7L1OJ45/4Y2nIvhRVpCe.FgtD1...'   Even if someone copies the entire database, they cannot recover the original password.", RED);

sub("Session Security");
bullet("Session IDs are long random strings — impossible to guess.");
bullet("Sessions expire automatically. The server checks the expire column in the sessions table.");
bullet("Logging out deletes the sessions row — the cookie becomes invalid immediately.");
bullet("HTTP-only cookies: JavaScript cannot read them — protects against XSS attacks.");

sub("OTP Security");
bullet("OTPs expire after 10 minutes (expires_at column).");
bullet("Each OTP is marked used='true' after use — cannot be reused (prevents replay attacks).");
bullet("6-digit OTP = 1,000,000 possible values. Brute-force is blocked by the 10-minute expiry.");

sub("Role-Based Access Control (RBAC)");
tblHead(["Role", "Access Allowed"], [80, 415]);
[
  ["patient", "Own appointments and prescriptions only. Cannot see other patients' data."],
  ["doctor", "Their patients' records. Can create prescriptions. Cannot access admin features."],
  ["admin", "Full access — all appointments, all patients, all audit logs, user management."],
].forEach((r, i) => tblRow(r, [80, 415], i % 2 === 0));
doc.moveDown(0.3);

sub("Audit Logging for Compliance");
body("Every important action (login, booking, cancellation, prescription) is recorded in audit_logs with who (user_id, user_email), what (action), and when (created_at). This creates an immutable trail required for healthcare compliance (HIPAA) and security investigation.");

sub("Database Migrations");
body("When the TypeScript schema changes (new column, new table), running 'npm run db:push' with Drizzle Kit automatically generates and applies the necessary ALTER TABLE or CREATE TABLE statements — no manual SQL required.");
note("DATABASE_URL is stored as a secure environment variable. It is never hardcoded in source code — so it cannot be leaked even if the code is shared publicly.", BLUE);

// ─── SECTION 9 ────────────────────────────────────────────────────────────────
newSection("9. Viva Questions & Answers");

function qa(q, a) {
  doc.moveDown(0.3);
  doc.fontSize(11).fillColor(BLUE).font("Helvetica-Bold").text("Q: " + q, { width: 495, lineGap: 2 });
  doc.fontSize(10.5).fillColor(DARK).font("Helvetica").text("A: " + a, { width: 495, lineGap: 3 });
}

qa("What type of database does CarePulse use?",
  "PostgreSQL — a powerful open-source Relational Database Management System (RDBMS) that stores data in structured tables with rows and columns.");
qa("What is Drizzle ORM and why is it used?",
  "Drizzle ORM converts TypeScript code into SQL queries automatically. It is used because it is type-safe (catches errors before runtime), reduces SQL boilerplate, and integrates with Zod for validation.");
qa("How are passwords stored in CarePulse's database?",
  "Hashed using bcrypt — a one-way algorithm. The hash cannot be reversed. Even if someone steals the database, original passwords remain safe.");
qa("What is a Primary Key? Give an example from CarePulse.",
  "A Primary Key uniquely identifies every row. hospitals.id is a SERIAL PK (auto-incrementing integer). users.id is a VARCHAR PK storing a UUID string.");
qa("What is a Foreign Key? Give an example.",
  "A Foreign Key links one table to another. patients.hospital_id is a FK referencing hospitals.id — it links each patient to their hospital.");
qa("What is JSONB and where is it used in CarePulse?",
  "JSONB stores JSON data in binary format. Used in: sessions.sess (login session data), patients.medical_history (past conditions array), prescriptions.medications (drug objects array).");
qa("How does session management work?",
  "On login, the server creates a sessions row. The session ID is sent as an HTTP-only cookie. Every request sends this cookie, letting the server identify the user without re-login.");
qa("What is an OTP and how is it stored securely?",
  "OTP = One-Time Password. 6-digit code for password reset. Stored with expiry timestamp (10 minutes) and a 'used' flag. Once used, the flag prevents reuse.");
qa("What is ACID compliance?",
  "ACID = Atomicity, Consistency, Isolation, Durability. PostgreSQL guarantees all four — critical for healthcare data where accuracy and reliability are non-negotiable.");
qa("What is the TEXT[] data type?",
  "An array of text values. Used for hospitals.specialized_departments: ['Cardiology','Oncology'] — stores multiple departments in one column without a separate table.");
qa("How does CASCADE DELETE work?",
  "messages.conversation_id has ON DELETE CASCADE. When a conversation is deleted, PostgreSQL automatically deletes all its messages — preventing orphan records.");
qa("How does CarePulse handle 70,000 hospital records efficiently?",
  "Using pagination (LIMIT + OFFSET) — never loading all 70,000 at once. The SERIAL primary key has an automatic index for instant ID lookups.");
qa("What is the audit_logs table for?",
  "Records every important action with who (user), what (action), and when (timestamp). Creates a tamper-evident trail for healthcare compliance and security investigation.");
qa("Why is date stored as TEXT in appointments?",
  "PostgreSQL DATE types are stored in UTC and can shift by a day for Indian users (UTC+5:30). Storing as TEXT ('YYYY-MM-DD') ensures the date always displays exactly as entered.");
qa("How does CarePulse prevent double-booking?",
  "Before inserting, the server queries: SELECT WHERE hospital_id + date + time match. If found, it returns 409 Conflict and suggests the next available slot (30 minutes later).");
qa("What is Zod and how does it protect the database?",
  "Zod validates all incoming data before database write. It enforces correct types, required fields, and rejects unexpected fields — preventing invalid or malicious data.");
qa("What is a database index?",
  "An index speeds up queries by avoiding full table scans. Like a book index — jump directly to the result instead of reading every page. The sessions table has a custom index on expire for fast cleanup.");
qa("How does role-based access control work?",
  "The role column in users ('patient', 'doctor', 'admin') is checked on every API request. Patients see only their own data, admins see everything.");
qa("What happens to messages when a conversation is deleted?",
  "Due to CASCADE DELETE, PostgreSQL automatically deletes all messages with that conversation_id. No orphan records remain.");
qa("How does IST timezone affect date validation?",
  "CarePulse calculates today's date using IST (UTC+5:30) offset: new Date(Date.now() + 5.5*60*60*1000). Without this, users in India would see 'yesterday' as today's date due to UTC being 5.5 hours behind.");

// ─── FINAL PAGE ────────────────────────────────────────────────────────────────
newSection("10. Summary — Database At a Glance");

tblHead(["Feature", "Detail"], [160, 335]);
[
  ["Database System", "PostgreSQL (open-source RDBMS, ACID-compliant)"],
  ["ORM", "Drizzle ORM (TypeScript → SQL, type-safe)"],
  ["Validation", "Zod (validates all inputs before database write)"],
  ["Total Tables", "12 tables covering all CarePulse features"],
  ["Hospital Records", "70,000 hospitals across all Indian states"],
  ["Authentication", "Session-based (stored in PostgreSQL sessions table)"],
  ["Password Storage", "bcrypt hashed (one-way, irreversible)"],
  ["OTP Security", "6-digit code, 10-min expiry, single-use flag"],
  ["AI Chat Storage", "conversations + messages tables (CASCADE DELETE)"],
  ["Audit Trail", "audit_logs records every action with timestamp"],
  ["Date Timezone", "IST (UTC+5:30) for all date validations"],
  ["Holiday Blocking", "Indian public holidays 2025–2027 (client + server)"],
  ["Conflict Detection", "Duplicate time slot checked before insert"],
  ["Schema Sync", "npm run db:push via drizzle-kit"],
  ["DB Connection", "DATABASE_URL secure environment variable"],
].forEach((r, i) => tblRow(r, [160, 335], i % 2 === 0));

doc.moveDown(1.5);
doc.fontSize(11).fillColor(DARK).font("Helvetica-Bold")
  .text("Key Takeaway:", { align: "center" }).moveDown(0.3);
doc.fontSize(11).fillColor(DARK).font("Helvetica")
  .text("CarePulse uses PostgreSQL with Drizzle ORM for type-safe, validated, and secure data storage. Every piece of data flows through validation (Zod), authentication (sessions), and authorization (role checks) before reaching or leaving the database.",
    { align: "center", width: 495, lineGap: 3 });

doc.moveDown(1);
doc.fontSize(9).fillColor(GRAY).font("Helvetica")
  .text("CarePulse Database Architecture Guide  |  Generated: " + new Date().toDateString() + "  |  For Academic & Learning Use",
    { align: "center", width: 495 });

// ─── PAGE NUMBERS ──────────────────────────────────────────────────────────────
const range = doc.bufferedPageRange();
for (let i = 0; i < range.count; i++) {
  doc.switchToPage(range.start + i);
  doc.fontSize(8).fillColor(GRAY).font("Helvetica")
    .text("Page " + (i + 1) + " of " + range.count, 50, doc.page.height - 30,
      { align: "right", width: 495 });
}

doc.end();
stream.on("finish", () => console.log("PDF saved:", outputPath));
stream.on("error", (e) => console.error("Error:", e));
