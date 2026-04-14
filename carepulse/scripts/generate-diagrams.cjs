"use strict";
const { Document, Packer, Paragraph, TextRun, ImageRun, HeadingLevel, AlignmentType, PageBreak, SectionType, convertInchesToTwip } = require("docx");
const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

// ─── XML escape ──────────────────────────────────────────────────────────────
function x(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// ─── SVG Primitives ───────────────────────────────────────────────────────────

const DEFS = `<defs>
  <marker id="ah" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
    <polygon points="0 0, 10 3.5, 0 7" fill="#333"/>
  </marker>
  <marker id="ahb" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
    <polygon points="0 0, 10 3.5, 0 7" fill="#666"/>
  </marker>
</defs>`;

function svg(w, h, body) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <rect width="${w}" height="${h}" fill="white"/>
  ${DEFS}
  ${body}
</svg>`;
}

// Centered multi-line text inside a box
function textLines(cx, cy, lines, fontSize = 13, color = "#111") {
  if (!Array.isArray(lines)) lines = [lines];
  const lh = fontSize + 5;
  const totalH = lh * lines.length;
  const startY = cy - totalH / 2 + fontSize * 0.8;
  return lines.map((t, i) =>
    `<text x="${cx}" y="${startY + i * lh}" text-anchor="middle" font-family="Arial,sans-serif" font-size="${fontSize}" fill="${color}">${x(t)}</text>`
  ).join("\n  ");
}

// Rectangle box with centered text
function box(x, y, w, h, lines, fill = "#EEF4FF", stroke = "#1a3a6e") {
  const cx = x + w / 2, cy = y + h / 2;
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${fill}" stroke="${stroke}" stroke-width="1.5" rx="4"/>
  ${textLines(cx, cy, lines)}`;
}

// External entity (double-border rectangle)
function entity(x, y, w, h, lines) {
  const cx = x + w / 2, cy = y + h / 2;
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#E8F5E9" stroke="#2e7d32" stroke-width="1.5" rx="3"/>
  <rect x="${x + 3}" y="${y + 3}" width="${w - 6}" height="${h - 6}" fill="none" stroke="#2e7d32" stroke-width="0.8" rx="2"/>
  ${textLines(cx, cy, lines)}`;
}

// Data store (open ends rectangle)
function dataStore(x, y, w, h, lines) {
  const cx = x + w / 2, cy = y + h / 2;
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#FFF8E1" stroke="#f57f17" stroke-width="1.5" rx="0"/>
  <line x1="${x}" y1="${y}" x2="${x + w}" y2="${y}" stroke="#f57f17" stroke-width="2"/>
  <line x1="${x}" y1="${y + h}" x2="${x + w}" y2="${y + h}" stroke="#f57f17" stroke-width="2"/>
  ${textLines(cx, cy, lines, 12, "#333")}`;
}

// Diamond (decision)
function diamond(cx, cy, w, h, lines) {
  const x1 = cx, y1 = cy - h / 2;
  const x2 = cx + w / 2, y2 = cy;
  const x3 = cx, y3 = cy + h / 2;
  const x4 = cx - w / 2, y4 = cy;
  return `<polygon points="${x1},${y1} ${x2},${y2} ${x3},${y3} ${x4},${y4}" fill="#FCE4EC" stroke="#880e4f" stroke-width="1.5"/>
  ${textLines(cx, cy, lines, 12, "#111")}`;
}

// Oval (for use case ellipses)
function oval(cx, cy, rx, ry, lines, fill = "#E3F2FD", stroke = "#1565c0") {
  return `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${fill}" stroke="${stroke}" stroke-width="1.5"/>
  ${textLines(cx, cy, lines, 12)}`;
}

// ─── Arrow helpers ────────────────────────────────────────────────────────────

// Box border intersection from an external point
function borderPt(fromX, fromY, bx, by, bw, bh) {
  const cx = bx + bw / 2, cy = by + bh / 2;
  const dx = cx - fromX, dy = cy - fromY;
  let tMin = Infinity, px = cx, py = cy;
  const check = (t, x, y, minX, maxX, minY, maxY) => {
    if (t > 1e-6 && x >= minX - 0.5 && x <= maxX + 0.5 && y >= minY - 0.5 && y <= maxY + 0.5 && t < tMin) {
      tMin = t; px = x; py = y;
    }
  };
  if (Math.abs(dy) > 0.01) {
    let t = (by - fromY) / dy; check(t, fromX + t * dx, by, bx, bx + bw, by, by);
    t = (by + bh - fromY) / dy; check(t, fromX + t * dx, by + bh, bx, bx + bw, by + bh, by + bh);
  }
  if (Math.abs(dx) > 0.01) {
    let t = (bx - fromX) / dx; check(t, bx, fromY + t * dy, bx, bx, by, by + bh);
    t = (bx + bw - fromX) / dx; check(t, bx + bw, fromY + t * dy, bx + bw, bx + bw, by, by + bh);
  }
  return [px, py];
}

// Straight arrow between two boxes
function arrow(x1, y1, w1, h1, x2, y2, w2, h2, label = "", color = "#333") {
  const c1x = x1 + w1 / 2, c1y = y1 + h1 / 2;
  const c2x = x2 + w2 / 2, c2y = y2 + h2 / 2;
  const [ex1, ey1] = borderPt(c2x, c2y, x1, y1, w1, h1);
  const [ex2, ey2] = borderPt(c1x, c1y, x2, y2, w2, h2);
  const len = Math.hypot(ex2 - ex1, ey2 - ey1);
  const ux = (ex2 - ex1) / len, uy = (ey2 - ey1) / len;
  const endX = (ex2 - ux * 2).toFixed(1), endY = (ey2 - uy * 2).toFixed(1);
  const midX = ((+ex1 + +ex2) / 2).toFixed(1), midY = ((+ey1 + +ey2) / 2 - 8).toFixed(1);
  const labelEl = label ? `<text x="${midX}" y="${midY}" text-anchor="middle" font-family="Arial,sans-serif" font-size="10" fill="#555">${x(label)}</text>` : "";
  return `<line x1="${ex1.toFixed(1)}" y1="${ey1.toFixed(1)}" x2="${endX}" y2="${endY}" stroke="${color}" stroke-width="1.5" marker-end="url(#ah)"/>
  ${labelEl}`;
}

// Horizontal arrow (point-to-point)
function harrow(x1, y1, x2, y2, label = "") {
  const endX = x2 - 2;
  const midX = ((x1 + x2) / 2).toFixed(1), midY = (y1 - 9).toFixed(1);
  const labelEl = label ? `<text x="${midX}" y="${midY}" text-anchor="middle" font-family="Arial,sans-serif" font-size="10" fill="#555">${x(label)}</text>` : "";
  return `<line x1="${x1}" y1="${y1}" x2="${endX}" y2="${y2}" stroke="#333" stroke-width="1.5" marker-end="url(#ah)"/>
  ${labelEl}`;
}

// Vertical arrow (point-to-point)
function varrow(x1, y1, x2, y2, label = "") {
  const endY = y2 - 2;
  const labelEl = label ? `<text x="${(x1 + 6).toFixed(1)}" y="${((y1 + y2) / 2).toFixed(1)}" font-family="Arial,sans-serif" font-size="10" fill="#555">${x(label)}</text>` : "";
  return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${endY}" stroke="#333" stroke-width="1.5" marker-end="url(#ah)"/>
  ${labelEl}`;
}

// L-shaped arrow: goes horizontal then vertical (or vice versa)
function larrow(x1, y1, x2, y2, bend = "h-then-v") {
  let pts;
  if (bend === "h-then-v") {
    pts = `${x1},${y1} ${x2},${y1} ${x2},${y2}`;
  } else {
    pts = `${x1},${y1} ${x1},${y2} ${x2},${y2}`;
  }
  const endX2 = bend === "h-then-v" ? x2 : x2;
  const endY2 = y2 - 2;
  return `<polyline points="${pts}" fill="none" stroke="#333" stroke-width="1.5"/>
  <line x1="${x2}" y1="${y2 - 15}" x2="${x2}" y2="${endY2}" stroke="#333" stroke-width="1.5" marker-end="url(#ah)"/>`;
}

// Bi-directional arrow
function biarrow(x1, y1, x2, y2, label = "") {
  const endX = x2 - 2;
  const midX = ((x1 + x2) / 2).toFixed(1), midY = (y1 - 9).toFixed(1);
  const labelEl = label ? `<text x="${midX}" y="${midY}" text-anchor="middle" font-family="Arial,sans-serif" font-size="10" fill="#555">${label}</text>` : "";
  return `<line x1="${x1}" y1="${y1}" x2="${endX}" y2="${y2}" stroke="#333" stroke-width="1.5" marker-end="url(#ah)" marker-start="url(#ah)"/>
  ${labelEl}`;
}

// Section label (gray background, centered text)
function sectionLabel(sx, sy, sw, sh, text, fill = "#F5F5F5") {
  return `<rect x="${sx}" y="${sy}" width="${sw}" height="${sh}" fill="${fill}" stroke="#ccc" stroke-width="1"/>
  <text x="${sx + sw / 2}" y="${sy + sh / 2 + 5}" text-anchor="middle" font-family="Arial,sans-serif" font-size="13" font-weight="bold" fill="#333">${x(text)}</text>`;
}

// Title text
function title(cx, ty, text, fontSize = 18) {
  return `<text x="${cx}" y="${ty}" text-anchor="middle" font-family="Arial,sans-serif" font-size="${fontSize}" font-weight="bold" fill="#1a237e">${x(text)}</text>`;
}

// Subtitle / legend text
function legend(lx, ly, text, fontSize = 11) {
  return `<text x="${lx}" y="${ly}" font-family="Arial,sans-serif" font-size="${fontSize}" fill="#555">${x(text)}</text>`;
}

// ─── DIAGRAM 1: Context Diagram (Level 0 DFD) ─────────────────────────────────
function diag1() {
  const W = 900, H = 600;
  // CarePulse center oval
  const cx = 450, cy = 280, rx = 120, ry = 55;
  // External entity boxes  [x, y, w, h, lines]
  const ENT = [
    [40,  245, 140, 55, ["Patient"]],
    [710, 120, 140, 55, ["Doctor"]],
    [710, 360, 140, 55, ["Admin"]],
    [360, 25,  160, 55, ["Gemini AI API"]],
    [40,  450, 150, 55, ["Gmail SMTP"]],
    [700, 455, 155, 55, ["PostgreSQL DB"]],
  ];
  const ovalLeft  = cx - rx, ovalRight = cx + rx;
  const ovalTop   = cy - ry, ovalBot   = cy + ry;

  // Data flows (bidirectional labels)
  const flows = [
    { from: [40,245,140,55],  label: "Login / Health Data" },
    { from: [710,120,140,55], label: "Patient Data" },
    { from: [710,360,140,55], label: "Admin Commands" },
    { from: [360,25,160,55],  label: "AI Queries / Analysis" },
    { from: [40,450,150,55],  label: "OTP Emails" },
    { from: [700,455,155,55], label: "Read / Write Data" },
  ];

  let body = title(W/2, 30, "Context Diagram — Level 0 DFD", 17);

  // Center oval
  body += `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="#E8EAF6" stroke="#283593" stroke-width="2"/>
  ${textLines(cx, cy, ["CarePulse", "Healthcare Platform"], 14, "#1a237e")}`;

  // External entities
  ENT.forEach(([x, y, w, h, lines]) => { body += entity(x, y, w, h, lines); });

  // Arrows: use borderPt for oval (approximate oval border as a box cx±rx, cy±ry)
  // We'll connect to the oval approximated as a box for simplicity
  const oBox = [cx - rx, cy - ry, rx * 2, ry * 2];
  ENT.forEach(([ex, ey, ew, eh, lines]) => {
    body += arrow(ex, ey, ew, eh, oBox[0], oBox[1], oBox[2], oBox[3], "", "#444");
  });

  // Data flow labels on arrows
  body += legend(60, 590, "Legend:  Green double-border = External Entity    Blue oval = System    Arrows = Data Flow");

  return svg(W, H, body);
}

// ─── DIAGRAM 2: Level 1 DFD ───────────────────────────────────────────────────
function diag2() {
  const W = 960, H = 680;
  // External entities (left)
  const patient = [30, 80, 130, 55];
  const doctor  = [30, 270, 130, 55];
  const admin   = [30, 460, 130, 55];
  // External entities (right)
  const gemini  = [790, 110, 140, 55];
  const gmail   = [790, 420, 140, 55];

  // Processes (center-left column)
  const p1 = [240, 80,  160, 55];   // User Authentication
  const p2 = [240, 270, 160, 55];   // Appointment Mgmt
  const p3 = [240, 460, 160, 55];   // Medical Records

  // Processes (center-right column)
  const p4 = [530, 80,  160, 55];   // AI Analysis
  const p5 = [530, 270, 160, 55];   // Analytics Engine
  const p6 = [530, 460, 160, 55];   // Notifications

  // Data stores (bottom row)
  const d1 = [100, 590, 150, 45];   // Users DB
  const d2 = [300, 590, 150, 45];   // Sessions DB
  const d3 = [500, 590, 160, 45];   // Appointments DB
  const d4 = [710, 590, 180, 45];   // Medical Records DB

  let body = title(W/2, 30, "Level 1 Data Flow Diagram", 17);

  // External entities
  body += entity(...patient, ["Patient"]);
  body += entity(...doctor,  ["Doctor"]);
  body += entity(...admin,   ["Admin"]);
  body += entity(...gemini,  ["Gemini AI"]);
  body += entity(...gmail,   ["Gmail SMTP"]);

  // Processes
  body += box(...p1, ["P1: User", "Authentication"], "#DBEAFE", "#1e40af");
  body += box(...p2, ["P2: Appointment", "Management"], "#DBEAFE", "#1e40af");
  body += box(...p3, ["P3: Medical", "Records"], "#DBEAFE", "#1e40af");
  body += box(...p4, ["P4: AI", "Analysis"], "#EDE9FE", "#5b21b6");
  body += box(...p5, ["P5: Analytics", "Engine"], "#EDE9FE", "#5b21b6");
  body += box(...p6, ["P6: Notification", "Service"], "#EDE9FE", "#5b21b6");

  // Data stores
  body += dataStore(...d1, ["D1: Users"]);
  body += dataStore(...d2, ["D2: Sessions"]);
  body += dataStore(...d3, ["D3: Appointments"]);
  body += dataStore(...d4, ["D4: Medical Records"]);

  // Arrows: External → Processes
  body += arrow(...patient, ...p1, "Auth Request");
  body += arrow(...patient, ...p2, "Book Appt");
  body += arrow(...doctor,  ...p2, "Manage Appt");
  body += arrow(...doctor,  ...p3, "Add Records");
  body += arrow(...admin,   ...p3, "View Records");
  body += arrow(...admin,   ...p5, "View Reports");

  // Process ↔ Process
  body += arrow(...p1, ...p4, "User Context");
  body += arrow(...p2, ...p5, "Appt Data");
  body += arrow(...p3, ...p4, "Lab/Vitals Data");
  body += arrow(...p4, ...p6, "AI Response");

  // Processes → Data Stores
  body += arrow(...p1, ...d1, "Store User");
  body += arrow(...p1, ...d2, "Create Session");
  body += arrow(...p2, ...d3, "Save Appointment");
  body += arrow(...p3, ...d4, "Save Records");

  // External APIs
  body += arrow(...p4, ...gemini, "Query");
  body += arrow(...gemini, ...p4, "AI Response");
  body += arrow(...p6, ...gmail, "Send OTP/Alerts");

  body += legend(30, 660, "Legend:  Green = External Entity    Blue = Process    Yellow = Data Store    Arrows = Data Flow");

  return svg(W, H, body);
}

// ─── DIAGRAM 3: System Architecture ──────────────────────────────────────────
function diag3() {
  const W = 860, H = 620;
  let body = title(W/2, 35, "System Architecture Diagram", 17);

  // Layer backgrounds
  const layerX = 30, layerW = 800;
  body += `<rect x="${layerX}" y="60" width="${layerW}" height="145" fill="#EEF4FF" stroke="#3b5bdb" stroke-width="1.5" rx="6"/>`;
  body += `<rect x="${layerX}" y="230" width="${layerW}" height="145" fill="#F0FFF4" stroke="#2f9e44" stroke-width="1.5" rx="6"/>`;
  body += `<rect x="${layerX}" y="400" width="${layerW}" height="145" fill="#FFF8E1" stroke="#f59f00" stroke-width="1.5" rx="6"/>`;

  // Layer titles
  body += legend(45, 82, "PRESENTATION LAYER  (Browser / Client)", 13);
  body += legend(45, 252, "BUSINESS LOGIC LAYER  (Node.js Server)", 13);
  body += legend(45, 422, "DATA LAYER  (PostgreSQL Database)", 13);

  // Layer 1 components
  const l1 = [
    [50,  90, 150, 50, ["React + Vite"]],
    [220, 90, 150, 50, ["Patient Portal"]],
    [390, 90, 150, 50, ["Doctor Dashboard"]],
    [560, 90, 150, 50, ["Admin Panel"]],
    [730, 90, 110, 50, ["Tailwind CSS"]],
    [50, 155, 220, 40, ["Framer Motion (Animations)"]],
    [290, 155, 200, 40, ["Recharts (Charts)"]],
    [510, 155, 200, 40, ["React Query (State)"]],
    [730, 155, 110, 40, ["Wouter (Router)"]],
  ];
  l1.forEach(([x,y,w,h,lines]) => body += box(x, y, w, h, lines, "#C5D8FF", "#1a3a6e"));

  // Layer 2 components
  const l2 = [
    [50,  260, 150, 50, ["Express.js Server"]],
    [220, 260, 160, 50, ["Auth Middleware"]],
    [400, 260, 160, 50, ["REST API Routes"]],
    [580, 260, 150, 50, ["Gemini AI Client"]],
    [750, 260, 100, 50, ["Nodemailer"]],
    [50,  325, 220, 45, ["Session Management"]],
    [290, 325, 200, 45, ["Medical AI Engine"]],
    [510, 325, 200, 45, ["ML Analytics Engine"]],
    [730, 325, 110, 45, ["Drizzle ORM"]],
  ];
  l2.forEach(([x,y,w,h,lines]) => body += box(x, y, w, h, lines, "#BEFACD", "#1a5c3e"));

  // Layer 3 components
  const l3 = [
    [50,  430, 130, 50, ["Users Table"]],
    [200, 430, 130, 50, ["Patients Table"]],
    [350, 430, 140, 50, ["Vitals Table"]],
    [510, 430, 140, 50, ["Appointments"]],
    [670, 430, 140, 50, ["Prescriptions"]],
    [50,  490, 140, 45, ["Hospitals (70K)"]],
    [210, 490, 140, 45, ["Disease Trends"]],
    [370, 490, 140, 45, ["Audit Logs"]],
    [530, 490, 145, 45, ["Conversations"]],
    [695, 490, 115, 45, ["OTP Tokens"]],
  ];
  l3.forEach(([x,y,w,h,lines]) => body += box(x, y, w, h, lines, "#FFE8A1", "#7a4e00"));

  // Layer connector arrows
  body += `<line x1="430" y1="205" x2="430" y2="228" stroke="#555" stroke-width="2" marker-end="url(#ah)"/>`;
  body += `<line x1="430" y1="375" x2="430" y2="398" stroke="#555" stroke-width="2" marker-end="url(#ah)"/>`;
  body += `<line x1="400" y1="228" x2="400" y2="205" stroke="#555" stroke-width="2" marker-end="url(#ah)"/>`;
  body += `<line x1="400" y1="398" x2="400" y2="375" stroke="#555" stroke-width="2" marker-end="url(#ah)"/>`;
  body += legend(180, 218, "HTTP Requests", 10);
  body += legend(430, 218, "HTTP Responses", 10);
  body += legend(160, 393, "SQL Queries", 10);
  body += legend(410, 393, "Result Sets", 10);

  // External services label
  body += `<rect x="30" y="558" width="800" height="48" fill="#FFF0F0" stroke="#e03131" stroke-width="1" rx="4"/>`;
  body += legend(50, 576, "External Services:", 12);
  body += legend(170, 576, "Gemini AI API (Google)    |    Gmail SMTP (OTP Emails)    |    PostgreSQL (Neon / Replit DB)", 12);

  return svg(W, H, body);
}

// ─── DIAGRAM 4: Authentication Flow ──────────────────────────────────────────
function diag4() {
  const W = 820, H = 900;
  const BW = 180, BH = 52, DW = 180, DH = 60;
  const col1 = 70, col2 = 310, col3 = 590;

  let body = title(W/2, 30, "Authentication & Authorization Flow", 17);

  // Start
  body += `<ellipse cx="320" cy="80" rx="60" ry="26" fill="#1a237e" stroke="#1a237e" stroke-width="1.5"/>`;
  body += textLines(320, 80, ["START"], 14, "#fff");

  // Step boxes (col2)
  const steps = [
    [col2 - BW/2, 130, BW, BH, ["Login Page"]],
    [col2 - BW/2, 220, BW, BH, ["Enter Email", "& Password"]],
    [col2 - BW/2, 310, BW, BH, ["Server Validates", "Credentials"]],
  ];
  steps.forEach(([x,y,w,h,lines]) => body += box(x,y,w,h,lines));

  // Decision: Credentials valid?
  body += diamond(320, 420, DW, DH, ["Valid?"]);

  // No path
  body += box(col3 - 80, 395, 140, BH, ["Show Error", "Message"], "#FFEBEE", "#c62828");
  body += box(col3 - 80, 300, 140, BH, ["Back to", "Login Page"], "#FFEBEE", "#c62828");

  // Yes path: determine role
  body += box(col2 - BW/2, 510, BW, BH, ["Determine User", "Role"]);

  // Role boxes
  body += box(col1 - 40, 620, 160, BH, ["Patient Portal", "/my-health"], "#F1FDF4", "#2e7d32");
  body += box(col2 - BW/2, 620, BW, BH, ["Doctor Dashboard", "/dashboard"], "#EFF7FF", "#1565c0");
  body += box(col3 - 30, 620, 160, BH, ["Admin Panel", "/admin"], "#FFF4F2", "#bf360c");

  // End
  body += `<ellipse cx="320" cy="730" rx="60" ry="26" fill="#1a237e" stroke="#1a237e" stroke-width="1.5"/>`;
  body += textLines(320, 730, ["SESSION ACTIVE"], 12, "#fff");

  // ── Forgot Password branch (right side) ──
  body += `<rect x="560" y="200" width="3" height="400" fill="none"/>`;
  body += box(590, 200, 170, BH, ["Forgot Password", "Link Clicked"], "#FFF8E1", "#f57f17");
  body += box(590, 275, 170, BH, ["Enter Registered", "Email"], "#FFF8E1", "#f57f17");
  body += box(590, 350, 170, BH, ["OTP Generated", "& Sent + Shown"], "#FFF8E1", "#f57f17");
  body += box(590, 425, 170, BH, ["User Enters", "6-digit OTP"], "#FFF8E1", "#f57f17");
  body += diamond(680, 515, 160, 55, ["OTP Valid?"]);
  body += box(590, 580, 170, BH, ["Enter New", "Password"], "#FFF8E1", "#f57f17");
  body += box(590, 655, 170, BH, ["Password Reset", "Complete"], "#F1FDF4", "#2e7d32");

  // ─ Main flow arrows ─
  body += varrow(320, 106, 320, 130);
  body += varrow(320, 130+BH, 320, 220);
  body += varrow(320, 220+BH, 320, 310);
  body += varrow(320, 310+BH, 320, 390);
  // Decision yes → role
  body += varrow(320, 450, 320, 510);
  body += legend(327, 482, "Yes", 11);
  // Decision no → error
  body += harrow(410, 420, col3 - 80, 420);
  body += legend(415, 415, "No", 11);
  // Error → back to login
  body += varrow(col3 + 60, 395, col3 + 60, 300 + BH);
  body += harrow(col3 - 80, 326, col2 + BW/2, 326);

  // Role dispatch arrows
  body += varrow(320, 510+BH, 320, 620);
  // Fan out
  body += `<line x1="320" y1="${510+BH+20}" x2="90" y2="${510+BH+20}" stroke="#333" stroke-width="1.5"/>`;
  body += `<line x1="90" y1="${510+BH+20}" x2="90" y2="620" stroke="#333" stroke-width="1.5" marker-end="url(#ah)"/>`;
  body += `<line x1="320" y1="${510+BH+20}" x2="550" y2="${510+BH+20}" stroke="#333" stroke-width="1.5"/>`;
  body += `<line x1="550" y1="${510+BH+20}" x2="550" y2="620" stroke="#333" stroke-width="1.5" marker-end="url(#ah)"/>`;

  // Session arrow
  body += varrow(320, 620+BH, 320, 730-26);

  // Forgot password flow arrows
  body += varrow(675, 200+BH, 675, 275);
  body += varrow(675, 275+BH, 675, 350);
  body += varrow(675, 350+BH, 675, 425);
  body += varrow(675, 425+BH, 675, 487);
  // OTP valid yes
  body += varrow(675, 543, 675, 580);
  body += legend(682, 564, "Yes", 11);
  // OTP valid no
  body += harrow(760, 515, 810, 515);
  body += legend(762, 510, "No", 11);
  body += varrow(675, 580+BH, 675, 655);
  // Loop back
  body += `<text x="812" y="515" font-family="Arial,sans-serif" font-size="10" fill="#c00">Retry</text>`;

  // Divider line
  body += `<line x1="565" y1="60" x2="565" y2="850" stroke="#ccc" stroke-width="1" stroke-dasharray="5,4"/>`;
  body += legend(310, 870, "Main Login Flow", 11);
  body += legend(620, 870, "Password Reset Flow", 11);

  body += legend(30, 895, "Legend:  Blue boxes = Steps    Pink = Error    Orange = OTP Flow    Green = Success");

  return svg(W, H, body);
}

// ─── DIAGRAM 5: Appointment Booking Flow ─────────────────────────────────────
function diag5() {
  const W = 780, H = 960;
  const BW = 200, BH = 52;
  const midX = 290;

  let body = title(W/2, 30, "Appointment Booking Flow", 17);

  // Start
  body += `<ellipse cx="${midX}" cy="80" rx="70" ry="26" fill="#1a237e" stroke="#1a237e"/>`;
  body += textLines(midX, 80, ["Patient Login"], 13, "#fff");

  const steps = [
    [120, 130, BW, BH, ["Open Book", "Appointment Page"]],
    [120, 210, BW, BH, ["Select Doctor", "& Hospital"]],
    [120, 290, BW, BH, ["Choose Date"]],
  ];
  steps.forEach(([x,y,w,h,lines]) => body += box(x,y,w,h,lines));

  // Decision: Date valid?
  body += diamond(midX, 400, 220, 60, ["Date valid?", "(Not past/holiday)"]); // [cx, cy, w, h]

  body += box(120, 490, BW, BH, ["Choose Time Slot"]);

  // Decision: Slot available?
  body += diamond(midX, 600, 220, 60, ["Slot Available?", "(No conflict)"]);

  body += box(120, 690, BW, BH, ["Confirm Booking"]);
  body += box(120, 770, BW, BH, ["Appointment Saved", "to Database"]);
  body += box(120, 850, BW, BH, ["Notify Doctor", "& Admin"]);

  // End
  body += `<ellipse cx="${midX}" cy="940" rx="80" ry="26" fill="#1a237e" stroke="#1a237e"/>`;
  body += textLines(midX, 940, ["Booking Confirmed"], 13, "#fff");

  // Error boxes
  body += box(480, 373, 170, BH, ["Show Error:", "Invalid Date"], "#FFEBEE", "#c62828");
  body += box(480, 573, 170, BH, ["Show Error:", "Slot Taken"], "#FFEBEE", "#c62828");

  // Main flow arrows
  body += varrow(midX, 106, midX, 130);
  body += varrow(midX, 130+BH, midX, 210);
  body += varrow(midX, 210+BH, midX, 290);
  body += varrow(midX, 290+BH, midX, 370);
  // Date valid Yes
  body += varrow(midX, 430, midX, 490);
  body += legend(midX + 5, 462, "Yes", 11);
  // Date valid No
  body += harrow(midX + 110, 400, 480, 400);
  body += legend(midX + 115, 394, "No", 11);
  // Error loop back
  body += `<line x1="565" y1="373" x2="565" y2="310" stroke="#c62828" stroke-width="1.5"/>`;
  body += `<line x1="565" y1="310" x2="320" y2="310" stroke="#c62828" stroke-width="1.5" marker-end="url(#ah)"/>`;
  body += legend(570, 345, "Try again", 10);

  body += varrow(midX, 490+BH, midX, 570);
  // Slot available Yes
  body += varrow(midX, 630, midX, 690);
  body += legend(midX + 5, 662, "Yes", 11);
  // Slot available No
  body += harrow(midX + 110, 600, 480, 600);
  body += legend(midX + 115, 594, "No", 11);
  // Error loop back
  body += `<line x1="565" y1="573" x2="565" y2="510" stroke="#c62828" stroke-width="1.5"/>`;
  body += `<line x1="565" y1="510" x2="320" y2="510" stroke="#c62828" stroke-width="1.5" marker-end="url(#ah)"/>`;
  body += legend(570, 545, "Try again", 10);

  body += varrow(midX, 690+BH, midX, 770);
  body += varrow(midX, 770+BH, midX, 850);
  body += varrow(midX, 850+BH, midX, 914);

  return svg(W, H, body);
}

// ─── DIAGRAM 6: Symptom Checker Flow ─────────────────────────────────────────
function diag6() {
  const W = 820, H = 900;
  const BW = 200, BH = 52;
  const mid = 300;

  let body = title(W/2, 30, "Symptom Checker Flow Diagram", 17);

  // Start
  body += `<ellipse cx="${mid}" cy="78" rx="70" ry="26" fill="#1a237e" stroke="#1a237e"/>`;
  body += textLines(mid, 78, ["Patient Opens"], 13, "#fff");
  body += textLines(mid, 78, ["Symptom Checker"], 13, "#fff");

  const flowSteps = [
    [mid - BW/2, 125, BW, BH, ["Step 1:", "Select Body Area"]],
    [mid - BW/2, 205, BW, BH, ["Step 2:", "Describe Symptoms"]],
    [mid - BW/2, 285, BW, BH, ["Step 3:", "Rate Severity (1-10)"]],
    [mid - BW/2, 365, BW, BH, ["Step 4:", "Select Duration"]],
    [mid - BW/2, 445, BW, BH, ["Submit for Analysis"]],
    [mid - BW/2, 525, BW, BH, ["Medical AI Engine", "Processes Symptoms"]],
  ];
  flowSteps.forEach(([x,y,w,h,lines]) => body += box(x,y,w,h,lines));

  // Decision: Match found?
  body += diamond(mid, 635, 220, 60, ["Conditions", "Found?"]);

  // Yes path
  const resultY = 720;
  body += box(mid - BW/2, resultY,      BW, BH, ["Show Urgency Level", "(Low/Mod/High/Emergency)"], "#DBEAFE", "#1e40af");
  body += box(mid - BW/2, resultY + 70, BW, BH, ["Show Matched", "Conditions"], "#DBEAFE", "#1e40af");
  body += box(mid - BW/2, resultY +140, BW, BH, ["Show Home Remedies", "& Recommendations"], "#DBEAFE", "#1e40af");

  // No path
  body += box(500, 610, 200, BH, ["Show: Consult a", "Doctor (No Match)"], "#FFF8E1", "#f57f17");

  // End
  body += `<ellipse cx="${mid}" cy="${resultY + 230}" rx="80" ry="26" fill="#1a237e" stroke="#1a237e"/>`;
  body += textLines(mid, resultY + 230, ["Check Another / End"], 13, "#fff");

  // Arrows
  body += varrow(mid, 104, mid, 125);
  [125, 205, 285, 365, 445].forEach(y => body += varrow(mid, y + BH, mid, y + BH + 20));
  body += varrow(mid, 525 + BH, mid, 605);
  // Yes
  body += varrow(mid, 665, mid, resultY);
  body += legend(mid + 5, 695, "Yes", 11);
  body += varrow(mid, resultY + BH, mid, resultY + 70);
  body += varrow(mid, resultY + 70 + BH, mid, resultY + 140);
  body += varrow(mid, resultY + 140 + BH, mid, resultY + 230 - 26);
  // No
  body += harrow(mid + 110, 635, 500, 635);
  body += legend(mid + 115, 629, "No", 11);
  body += varrow(600, 610 + BH, 600, resultY + 230 - 26 + 5);
  body += `<line x1="600" y1="${resultY + 230}" x2="${mid + 80}" y2="${resultY + 230}" stroke="#333" stroke-width="1.5" marker-end="url(#ah)"/>`;

  // Sidebar note: 8 body areas
  body += box(580, 125, 195, 130, ["8 Body Areas:", "Head & Neck", "Chest & Heart", "Abdomen", "Arms & Legs", "Back & Spine", "Skin", "Respiratory", "General / Full Body"], "#F5F5F5", "#999");

  body += legend(30, 890, "Powered by CarePulse Medical AI Engine with 50+ condition database");

  return svg(W, H, body);
}

// ─── DIAGRAM 7: ER Diagram ────────────────────────────────────────────────────
function diag7() {
  const W = 1060, H = 820;
  let body = title(W/2, 30, "Entity Relationship Diagram (ERD)", 17);
  body += legend(30, 55, "PK = Primary Key    FK = Foreign Key    ——< = One to Many");

  // ER Table helper: draws a table header + fields
  function erTable(ex, ey, ew, lines, headerFill = "#DBEAFE") {
    const headerH = 38, fieldH = 26;
    const totalH = headerH + lines.length * fieldH;
    let t = `<rect x="${ex}" y="${ey}" width="${ew}" height="${totalH}" fill="white" stroke="#333" stroke-width="1.5"/>`;
    t += `<rect x="${ex}" y="${ey}" width="${ew}" height="${headerH}" fill="${headerFill}" stroke="#333" stroke-width="1.5"/>`;
    t += textLines(ex + ew/2, ey + headerH/2, [lines[0]], 13, "#1a237e");
    for (let i = 1; i < lines.length; i++) {
      const fy = ey + headerH + (i-1) * fieldH;
      t += `<line x1="${ex}" y1="${fy}" x2="${ex+ew}" y2="${fy}" stroke="#ccc" stroke-width="0.8"/>`;
      t += `<text x="${ex+8}" y="${fy + 18}" font-family="Arial,sans-serif" font-size="11" fill="#333">${x(lines[i])}</text>`;
    }
    return { svg: t, x: ex, y: ey, w: ew, h: totalH };
  }

  // Tables
  const users = erTable(40, 75, 200, ["users", "PK  id (UUID)", "email (text)", "password (hash)", "firstName (text)", "lastName (text)", "phone (text)", "role (enum)", "FK  hospitalId"], "#C5D8FF");
  body += users.svg;

  const hospitals = erTable(780, 75, 230, ["hospitals", "PK  id (serial)", "name (text)", "city (text)", "state (text)", "bedCapacity (int)", "icuCapacity (int)", "currentOccupancy (int)", "latitude (decimal)", "longitude (decimal)"], "#C5D8FF");
  body += hospitals.svg;

  const patients = erTable(40, 370, 200, ["patients", "PK  id (serial)", "name (text)", "age (int)", "gender (text)", "condition (enum)", "riskLevel (text)", "FK  hospitalId"], "#BBF7D0");
  body += patients.svg;

  const vitals = erTable(40, 600, 200, ["vitals", "PK  id (serial)", "FK  patientId", "heartRate (int)", "bloodPressure (text)", "oxygenLevel (int)", "temperature (decimal)", "timestamp (datetime)"], "#BBF7D0");
  body += vitals.svg;

  const appointments = erTable(330, 370, 220, ["appointments", "PK  id (serial)", "patientEmail (text)", "FK  doctorId (users)", "FK  hospitalId", "date (date)", "time (text)", "status (enum)"], "#FDE68A");
  body += appointments.svg;

  const prescriptions = erTable(330, 620, 220, ["prescriptions", "PK  id (serial)", "FK  patientId", "FK  doctorId (users)", "diagnosis (text)", "medications (JSONB)", "createdAt (datetime)"], "#FDE68A");
  body += prescriptions.svg;

  const conversations = erTable(620, 370, 200, ["conversations", "PK  id (serial)", "FK  userId (users)", "title (text)", "createdAt (datetime)"], "#E9D5FF");
  body += conversations.svg;

  const messages = erTable(620, 560, 200, ["messages", "PK  id (serial)", "FK  conversationId", "role (enum)", "content (text)", "timestamp (datetime)"], "#E9D5FF");
  body += messages.svg;

  const auditLogs = erTable(840, 400, 190, ["audit_logs", "PK  id (serial)", "FK  userId (users)", "action (text)", "details (text)", "createdAt (datetime)"], "#FED7AA");
  body += auditLogs.svg;

  // Relationship lines (simplified, 1 end at FK table, many end at PK table)
  // users → hospitals
  body += `<line x1="240" y1="165" x2="780" y2="165" stroke="#888" stroke-width="1.5"/>`;
  body += `<text x="460" y="158" text-anchor="middle" font-family="Arial,sans-serif" font-size="10" fill="#555">hospitalId → id</text>`;

  // patients → hospitals
  body += `<line x1="240" y1="430" x2="780" y2="200" stroke="#888" stroke-width="1.5"/>`;
  body += `<text x="530" y="310" font-family="Arial,sans-serif" font-size="10" fill="#555">hospitalId → id</text>`;

  // vitals → patients
  body += `<line x1="140" y1="600" x2="140" y2="${370 + patients.h}" stroke="#888" stroke-width="1.5" marker-end="url(#ahb)"/>`;
  body += `<text x="147" y="550" font-family="Arial,sans-serif" font-size="10" fill="#555">patientId → id</text>`;

  // appointments → users (doctorId)
  body += `<line x1="330" y1="400" x2="240" y2="180" stroke="#888" stroke-width="1.5" marker-end="url(#ahb)"/>`;
  body += `<text x="250" y="280" font-family="Arial,sans-serif" font-size="10" fill="#555">doctorId→id</text>`;

  // prescriptions → patients
  body += `<line x1="390" y1="620" x2="200" y2="500" stroke="#888" stroke-width="1.5" marker-end="url(#ahb)"/>`;
  body += `<text x="255" y="560" font-family="Arial,sans-serif" font-size="10" fill="#555">patientId→id</text>`;

  // conversations → users
  body += `<line x1="620" y1="390" x2="240" y2="200" stroke="#888" stroke-width="1.5" marker-end="url(#ahb)"/>`;
  body += `<text x="390" y="275" font-family="Arial,sans-serif" font-size="10" fill="#555">userId→id</text>`;

  // messages → conversations
  body += `<line x1="720" y1="560" x2="720" y2="${370 + conversations.h}" stroke="#888" stroke-width="1.5" marker-end="url(#ahb)"/>`;
  body += `<text x="728" y="520" font-family="Arial,sans-serif" font-size="10" fill="#555">conversationId→id</text>`;

  // audit_logs → users
  body += `<line x1="840" y1="440" x2="240" y2="200" stroke="#888" stroke-width="1.5" marker-end="url(#ahb)"/>`;
  body += `<text x="570" y="305" font-family="Arial,sans-serif" font-size="10" fill="#555">userId→id</text>`;

  return svg(W, H, body);
}

// ─── DIAGRAM 8: Use Case Diagram ──────────────────────────────────────────────
function diag8() {
  const W = 980, H = 820;
  let body = title(W/2, 30, "Use Case Diagram — Role-Based Access", 17);

  // System boundary
  body += `<rect x="180" y="60" width="650" height="720" fill="#FAFAFA" stroke="#555" stroke-width="1.5" stroke-dasharray="8,4" rx="4"/>`;
  body += legend(460, 80, "CarePulse Healthcare System", 13);

  // Actor (stick figure) helper
  function actor(cx, ay, label, color = "#333") {
    const hy = ay + 15;
    return `<circle cx="${cx}" cy="${ay}" r="14" fill="none" stroke="${color}" stroke-width="1.8"/>
    <line x1="${cx}" y1="${ay+14}" x2="${cx}" y2="${hy+45}" stroke="${color}" stroke-width="1.8"/>
    <line x1="${cx-22}" y1="${hy+20}" x2="${cx+22}" y2="${hy+20}" stroke="${color}" stroke-width="1.8"/>
    <line x1="${cx}" y1="${hy+45}" x2="${cx-18}" y2="${hy+75}" stroke="${color}" stroke-width="1.8"/>
    <line x1="${cx}" y1="${hy+45}" x2="${cx+18}" y2="${hy+75}" stroke="${color}" stroke-width="1.8"/>
    <text x="${cx}" y="${hy+95}" text-anchor="middle" font-family="Arial,sans-serif" font-size="13" font-weight="bold" fill="${color}">${x(label)}</text>`;
  }

  // Actors
  body += actor(70,  120, "Patient", "#2e7d32");
  body += actor(70,  420, "Doctor",  "#1565c0");
  body += actor(70,  680, "Admin",   "#bf360c");

  // Use case ovals - Patient
  const pUC = [
    [330, 95,  "Login / Register"],
    [330, 150, "Book Appointment"],
    [330, 205, "View Prescriptions"],
    [330, 260, "Symptom Checker"],
    [330, 315, "MedAssist AI Chat"],
    [330, 370, "Drug Interaction Check"],
    [330, 425, "View Health Records"],
    [330, 480, "Download Medical ID"],
    [330, 535, "Update Profile"],
  ];
  pUC.forEach(([cx, cy, label]) => {
    body += oval(cx, cy, 140, 22, [label], "#E8F5E9", "#2e7d32");
    body += `<line x1="70" y1="195" x2="${cx - 140}" y2="${cy}" stroke="#2e7d32" stroke-width="1"/>`;
  });

  // Use case ovals - Doctor
  const dUC = [
    [590, 150, "Login / Register"],
    [590, 210, "View Patient List"],
    [590, 270, "Patient Detail View"],
    [590, 330, "Issue Prescription"],
    [590, 390, "Manage Appointments"],
    [590, 450, "View Emergency Alerts"],
    [590, 510, "ML / Risk Insights"],
    [590, 570, "Predictive Analytics"],
  ];
  dUC.forEach(([cx, cy, label]) => {
    body += oval(cx, cy, 145, 22, [label], "#E3F2FD", "#1565c0");
    body += `<line x1="70" y1="490" x2="${cx - 145}" y2="${cy}" stroke="#1565c0" stroke-width="1"/>`;
  });

  // Use case ovals - Admin
  const aUC = [
    [760, 400, "Login / Register"],
    [760, 455, "User Management"],
    [760, 510, "Role Assignment"],
    [760, 565, "System Analytics"],
    [760, 620, "All Appointments"],
    [760, 675, "Audit Logs"],
    [760, 730, "Platform Settings"],
  ];
  aUC.forEach(([cx, cy, label]) => {
    body += oval(cx, cy, 145, 22, [label], "#FFF4F2", "#bf360c");
    body += `<line x1="70" y1="750" x2="${cx - 145}" y2="${cy}" stroke="#bf360c" stroke-width="1"/>`;
  });

  body += legend(30, 800, "Dashed box = System boundary    Actors connected by lines to their available use cases");

  return svg(W, H, body);
}

// ─── DIAGRAM 9: MedAssist AI Flow ─────────────────────────────────────────────
function diag9() {
  const W = 840, H = 720;
  const BW = 210, BH = 52;
  const col1 = 50, col2 = 320, col3 = 590;

  let body = title(W/2, 30, "MedAssist AI Interaction Flow", 17);

  // 3-column layout: User | Server | Gemini AI
  body += sectionLabel(col1, 60, BW, 38, "User (Browser)", "#E8F5E9");
  body += sectionLabel(col2, 60, BW, 38, "CarePulse Server", "#DBEAFE");
  body += sectionLabel(col3, 60, BW, 38, "Gemini AI API", "#EDE9FE");

  // User steps
  const userSteps = [
    [col1, 120, BW, BH, ["Type Question or", "Upload File (PDF/Image)"]],
    [col1, 330, BW, BH, ["Wait for Response"]],
    [col1, 570, BW, BH, ["View AI Analysis", "& Recommendations"]],
  ];
  userSteps.forEach(([x,y,w,h,lines]) => body += box(x,y,w,h,lines, "#E8F5E9", "#2e7d32"));

  // Server steps
  const serverSteps = [
    [col2, 120, BW, BH, ["Receive Input &", "Validate Request"]],
    [col2, 205, BW, BH, ["Parse File Content", "(if uploaded)"]],
    [col2, 290, BW, BH, ["Build Gemini", "API Prompt"]],
    [col2, 450, BW, BH, ["Receive Gemini", "Response (JSON)"]],
    [col2, 535, BW, BH, ["Format Response &", "Save to DB"]],
  ];
  serverSteps.forEach(([x,y,w,h,lines]) => body += box(x,y,w,h,lines, "#DBEAFE", "#1e40af"));

  // Gemini steps
  const geminiSteps = [
    [col3, 290, BW, BH, ["Receive Healthcare", "Query Prompt"]],
    [col3, 370, BW, BH, ["AI Model Processes", "Medical Context"]],
    [col3, 450, BW, BH, ["Return Structured", "JSON Response"]],
  ];
  geminiSteps.forEach(([x,y,w,h,lines]) => body += box(x,y,w,h,lines, "#EDE9FE", "#5b21b6"));

  // DB store
  body += dataStore(col2, 630, BW, 50, ["D: conversations / messages"]);

  // User → Server
  body += harrow(col1 + BW, 146, col2, 146, "HTTPS POST /api/medassist");
  // Server internal flow
  body += varrow(col2 + BW/2, 120 + BH, col2 + BW/2, 205);
  body += varrow(col2 + BW/2, 205 + BH, col2 + BW/2, 290);
  // Server → Gemini
  body += harrow(col2 + BW, 316, col3, 316, "API Call (prompt)");
  // Gemini internal
  body += varrow(col3 + BW/2, 290 + BH, col3 + BW/2, 370);
  body += varrow(col3 + BW/2, 370 + BH, col3 + BW/2, 450);
  // Gemini → Server
  body += harrow(col3, 476, col2 + BW, 476, "JSON response");
  // Server response flow
  body += varrow(col2 + BW/2, 450 + BH, col2 + BW/2, 535);
  // Server → DB
  body += varrow(col2 + BW/2, 535 + BH, col2 + BW/2, 630);
  // Server → User response
  body += `<line x1="${col2}" y1="561" x2="${col1 + BW/2}" y2="561" stroke="#333" stroke-width="1.5"/>`;
  body += `<line x1="${col1 + BW/2}" y1="561" x2="${col1 + BW/2}" y2="570" stroke="#333" stroke-width="1.5" marker-end="url(#ah)"/>`;
  body += legend(col1 + 20, 558, "Response", 10);
  // User view
  body += varrow(col1 + BW/2, 330 + BH, col1 + BW/2, 570);

  body += legend(30, 700, "Gemini AI API processes medical queries with context from uploaded files, lab reports, and prescriptions.");

  return svg(W, H, body);
}

// ─── Convert SVG to PNG ────────────────────────────────────────────────────────
async function svgToPng(svgStr, scale = 1.5) {
  const buf = Buffer.from(svgStr, "utf8");
  return await sharp(buf).png().toBuffer();
}

// ─── Build Word Document ───────────────────────────────────────────────────────
async function buildWord() {
  console.log("Generating diagrams...");
  const diagrams = [
    { title: "Diagram 1: Context Diagram (Level 0 DFD)", fn: diag1,
      desc: [
        "The Context Diagram shows CarePulse as a single system (oval center) with all external entities that interact with it.",
        "External Entities:",
        "  • Patient — Logs in, books appointments, checks symptoms, uses AI chat",
        "  • Doctor — Views patients, issues prescriptions, manages appointments",
        "  • Admin — Manages users, views analytics, controls all system settings",
        "  • Gemini AI API — Google's AI service used by MedAssist and symptom analysis",
        "  • Gmail SMTP — Email server used to send OTP codes for password reset",
        "  • PostgreSQL DB — Main database storing all system data (70,000+ hospitals, users, records)",
        "All data flows pass through the central CarePulse system, which validates, processes, and routes every request."
      ]
    },
    { title: "Diagram 2: Level 1 Data Flow Diagram", fn: diag2,
      desc: [
        "The Level 1 DFD breaks CarePulse into 6 core processes showing how data flows between actors, processes, and data stores.",
        "Processes:",
        "  • P1: User Authentication — Handles login, registration, sessions, OTP reset",
        "  • P2: Appointment Management — Booking, conflict detection, status updates",
        "  • P3: Medical Records — Patient vitals, prescriptions, health history",
        "  • P4: AI Analysis — Integrates with Gemini API for MedAssist and symptom analysis",
        "  • P5: Analytics Engine — ML risk prediction, outbreak detection, platform stats",
        "  • P6: Notification Service — OTP emails, appointment confirmations",
        "Data Stores: Users DB, Sessions DB, Appointments DB, Medical Records DB"
      ]
    },
    { title: "Diagram 3: System Architecture Diagram", fn: diag3,
      desc: [
        "The System Architecture shows CarePulse in 3 horizontal layers:",
        "Layer 1 — Presentation (Browser/Client):",
        "  React + Vite frontend with Patient Portal, Doctor Dashboard, and Admin Panel.",
        "  Uses Tailwind CSS for styling, Framer Motion for animations, Recharts for charts.",
        "Layer 2 — Business Logic (Node.js/Express Server):",
        "  Express.js handles HTTP requests. Modules include Auth Middleware, REST API Routes,",
        "  Medical AI Engine (symptom checker), ML Analytics Engine, and Nodemailer for emails.",
        "Layer 3 — Data (PostgreSQL Database):",
        "  Stores Users, Patients, Vitals, Appointments, Prescriptions, Hospitals (70K+), Audit Logs.",
        "External Services: Gemini AI API for MedAssist, Gmail SMTP for OTP delivery."
      ]
    },
    { title: "Diagram 4: Authentication & Authorization Flow", fn: diag4,
      desc: [
        "This diagram shows two parallel authentication flows:",
        "Main Login Flow (left):",
        "  1. User opens Login Page and enters email + password",
        "  2. Server validates credentials against hashed password in DB",
        "  3. If valid: role is determined (Patient/Doctor/Admin) and user is routed to their portal",
        "  4. If invalid: error is shown and user returns to login",
        "Password Reset Flow (right):",
        "  1. User clicks 'Forgot Password' and enters their registered email",
        "  2. Server generates a 6-digit OTP, saves it, sends via Gmail, and displays it on screen",
        "  3. User enters OTP — if valid, new password is set; if invalid, user retries",
        "Session management uses connect-pg-simple for PostgreSQL-backed sessions."
      ]
    },
    { title: "Diagram 5: Appointment Booking Flow", fn: diag5,
      desc: [
        "The Appointment Booking Flow shows the step-by-step process for scheduling an appointment:",
        "  1. Patient logs in and opens the Appointment Booking page",
        "  2. Patient selects a Doctor and Hospital from the database",
        "  3. Patient picks a Date — system validates: not in the past, not a public holiday (India)",
        "     If date is invalid: error shown, patient picks another date",
        "  4. Patient selects a Time Slot — system checks for appointment conflicts in the database",
        "     If slot is taken: error shown, patient picks a different time",
        "  5. Patient confirms — appointment saved to database",
        "  6. Doctor and Admin receive notifications about the new booking",
        "  7. Patient receives booking confirmation",
        "Holidays are validated using India's official public holiday list (IST timezone)."
      ]
    },
    { title: "Diagram 6: Symptom Checker Flow", fn: diag6,
      desc: [
        "The Symptom Checker is a 4-step wizard followed by AI-powered analysis:",
        "  Step 1 — Select Body Area: 8 options (Head & Neck, Chest & Heart, Abdomen,",
        "            Arms & Legs, Back & Spine, Skin, Respiratory, General / Full Body)",
        "  Step 2 — Describe Symptoms: Free-text input of what the patient is experiencing",
        "  Step 3 — Rate Severity: Slider from 1 (mild) to 10 (severe)",
        "  Step 4 — Select Duration: 6 options from 'Less than 24 hours' to 'Chronic'",
        "Analysis Engine: Scores all 50+ medical conditions against described symptoms using",
        "keyword matching, synonym expansion, and body-area weighting. Symptoms are the",
        "primary scoring factor — body area is only a secondary hint.",
        "Results: Urgency level (Low/Moderate/High/Emergency), matched conditions with",
        "relevance score, home remedies, and recommended actions including emergency numbers."
      ]
    },
    { title: "Diagram 7: Entity Relationship Diagram (ERD)", fn: diag7,
      desc: [
        "The ERD shows all database tables and their relationships:",
        "  • users — Core table for all accounts (patients, doctors, admins). FK to hospitals.",
        "  • hospitals — 70,000+ Indian hospitals with location, bed capacity, and occupancy.",
        "  • patients — Clinical patient records with risk level and condition status. FK to hospitals.",
        "  • vitals — Time-series health readings (heart rate, BP, oxygen, temperature). FK to patients.",
        "  • appointments — Bookings with date, time, and status (scheduled/completed/cancelled).",
        "     FK to doctorId (users) and hospitalId (hospitals).",
        "  • prescriptions — Doctor-issued prescriptions with medications in JSONB format.",
        "     FK to patientId and doctorId (users).",
        "  • conversations + messages — MedAssist AI chat history. FK to userId (users).",
        "  • audit_logs — All admin/doctor actions for compliance tracking. FK to userId.",
        "Key: One User can have many Conversations; one Patient can have many Vitals records."
      ]
    },
    { title: "Diagram 8: Use Case Diagram", fn: diag8,
      desc: [
        "The Use Case Diagram shows which features are accessible by each user role:",
        "Patient (green) — 9 use cases:",
        "  Login/Register, Book Appointment, View Prescriptions, Symptom Checker,",
        "  MedAssist AI Chat, Drug Interaction Check, View Health Records,",
        "  Download Medical ID, Update Profile",
        "Doctor (blue) — 8 use cases:",
        "  Login/Register, View Patient List, Patient Detail View, Issue Prescription,",
        "  Manage Appointments, View Emergency Alerts, ML/Risk Insights, Predictive Analytics",
        "Admin (red) — 7 use cases:",
        "  Login/Register, User Management, Role Assignment, System Analytics,",
        "  Manage All Appointments, Audit Logs, Platform Settings",
        "Note: Admin inherits all Doctor capabilities plus system administration features."
      ]
    },
    { title: "Diagram 9: MedAssist AI Interaction Flow", fn: diag9,
      desc: [
        "The MedAssist AI flow shows how user queries are processed by the Gemini AI API:",
        "Column 1 — User (Browser):",
        "  User types a medical question or uploads a file (PDF, image of lab report or prescription)",
        "Column 2 — CarePulse Server:",
        "  1. Validates the incoming request and checks authentication",
        "  2. If file uploaded: extracts and parses text content from PDF/image",
        "  3. Constructs a detailed medical context prompt for Gemini",
        "  4. Receives JSON response from Gemini and formats it for display",
        "  5. Saves the conversation and messages to the database",
        "Column 3 — Gemini AI API (Google):",
        "  1. Receives the structured healthcare query prompt",
        "  2. Processes with full medical knowledge context",
        "  3. Returns structured JSON with analysis, recommendations, and disclaimers",
        "Every response includes a medical disclaimer reminding users to consult a doctor."
      ]
    },
  ];

  const sections = [];

  for (let i = 0; i < diagrams.length; i++) {
    const d = diagrams[i];
    console.log(`  Rendering: ${d.title}`);
    const svgStr = d.fn();
    const pngBuf = await svgToPng(svgStr);

    // Parse width/height from SVG string
    const wMatch = svgStr.match(/width="(\d+)"/);
    const hMatch = svgStr.match(/height="(\d+)"/);
    const svgW = wMatch ? parseInt(wMatch[1]) : 900;
    const svgH = hMatch ? parseInt(hMatch[1]) : 600;
    const scale = Math.min(550 / svgW, 680 / svgH, 1);
    const imgW = Math.round(svgW * scale);
    const imgH = Math.round(svgH * scale);

    const children = [
      new Paragraph({
        children: [new TextRun({ text: d.title, bold: true, size: 28, color: "1a237e", font: "Arial" })],
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 200, after: 200 },
      }),
      new Paragraph({
        children: [
          new ImageRun({ data: pngBuf, transformation: { width: imgW, height: imgH }, type: "png" })
        ],
        alignment: AlignmentType.CENTER,
        spacing: { after: 240 },
      }),
      new Paragraph({
        children: [new TextRun({ text: "Description & Explanation", bold: true, size: 24, font: "Arial", color: "333333" })],
        spacing: { before: 160, after: 100 },
      }),
    ];

    d.desc.forEach(line => {
      const isBullet = line.startsWith("  •");
      const isSubHead = line.endsWith(":") && !line.startsWith(" ");
      children.push(new Paragraph({
        children: [new TextRun({
          text: isBullet ? line.replace("  •", "•") : line,
          size: 20,
          font: "Arial",
          bold: isSubHead,
          color: isSubHead ? "1a237e" : "222222",
        })],
        indent: isBullet ? { left: 360 } : {},
        spacing: { before: isBullet ? 60 : 80, after: 60 },
      }));
    });

    // Page break between diagrams (except last)
    if (i < diagrams.length - 1) {
      children.push(new Paragraph({ children: [new PageBreak()] }));
    }

    sections.push(...children);
  }

  // Cover page
  const coverPage = [
    new Paragraph({ spacing: { before: 1440 } }),
    new Paragraph({
      children: [new TextRun({ text: "CarePulse Healthcare Platform", bold: true, size: 52, font: "Arial", color: "1a237e" })],
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 },
    }),
    new Paragraph({
      children: [new TextRun({ text: "System Design — Complete Diagram Document", size: 36, font: "Arial", color: "333333" })],
      alignment: AlignmentType.CENTER,
      spacing: { after: 160 },
    }),
    new Paragraph({
      children: [new TextRun({ text: "Diagrams Included", bold: true, size: 26, font: "Arial", color: "444444" })],
      alignment: AlignmentType.CENTER,
      spacing: { before: 400, after: 120 },
    }),
    ...[
      "1.  Context Diagram (Level 0 DFD)",
      "2.  Level 1 Data Flow Diagram (DFD)",
      "3.  System Architecture Diagram",
      "4.  Authentication & Authorization Flow",
      "5.  Appointment Booking Flow",
      "6.  Symptom Checker Flow Diagram",
      "7.  Entity Relationship Diagram (ERD)",
      "8.  Use Case Diagram — Role-Based Access",
      "9.  MedAssist AI Interaction Flow",
    ].map(t => new Paragraph({
      children: [new TextRun({ text: t, size: 22, font: "Arial", color: "333333" })],
      alignment: AlignmentType.CENTER,
      spacing: { after: 80 },
    })),
    new Paragraph({
      children: [new TextRun({ text: "March 2026", size: 22, font: "Arial", color: "888888" })],
      alignment: AlignmentType.CENTER,
      spacing: { before: 400 },
    }),
    new Paragraph({ children: [new PageBreak()] }),
  ];

  const doc = new Document({
    sections: [{
      properties: {
        page: {
          margin: {
            top: convertInchesToTwip(0.8),
            right: convertInchesToTwip(0.8),
            bottom: convertInchesToTwip(0.8),
            left: convertInchesToTwip(0.8),
          }
        }
      },
      children: [...coverPage, ...sections],
    }],
  });

  const buf = await Packer.toBuffer(doc);
  const outPath = path.join(__dirname, "../public/datasets/CarePulse_Diagrams.docx");
  fs.writeFileSync(outPath, buf);
  console.log(`\n✓ Word document saved: ${outPath} (${(buf.length / 1024).toFixed(0)} KB)`);
}

buildWord().catch(err => { console.error("Error:", err); process.exit(1); });
