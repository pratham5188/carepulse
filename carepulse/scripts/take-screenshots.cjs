const { execSync, spawn } = require("child_process");
const puppeteer = require("puppeteer-core");
const fs = require("fs");
const path = require("path");

const BASE = "http://localhost:5000";
const SDIR = path.join(__dirname, "../public/datasets/screenshots");
if (!fs.existsSync(SDIR)) fs.mkdirSync(SDIR, { recursive: true });

const CHROMIUM = "/home/runner/.nix-profile/bin/chromium";

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function shot(page, name, extra) {
  await sleep(extra || 1800);
  const file = path.join(SDIR, name + ".png");
  await page.screenshot({ path: file, type: "png" });
  const kb = Math.round(fs.statSync(file).size / 1024);
  console.log(`  ✓ ${name}.png  ${kb}KB  [${page.url().replace(BASE, "") || "/"}]`);
}

async function go(page, route, wait) {
  await page.goto(BASE + route, { waitUntil: "networkidle2", timeout: 30000 });
  await sleep(wait || 2000);
}

async function loginForm(page, email, pass) {
  await page.goto(BASE + "/login", { waitUntil: "networkidle2", timeout: 30000 });
  await sleep(1500);
  try {
    await page.waitForSelector('input[type="email"]', { timeout: 8000 });
    await page.click('input[type="email"]', { clickCount: 3 });
    await page.type('input[type="email"]', email, { delay: 40 });
    await page.click('input[type="password"]', { clickCount: 3 });
    await page.type('input[type="password"]', pass, { delay: 40 });
    await page.click('button[type="submit"]');
    await sleep(4000);
    const url = page.url();
    const ok = !url.includes("/login");
    console.log(`  Login: ${email} → ${url.replace(BASE, "")} ${ok ? "✓" : "✗ FAILED"}`);
    return ok;
  } catch(e) {
    console.log("  Login error:", e.message.split("\n")[0]);
    return false;
  }
}

(async () => {
  console.log("Starting Chromium...");
  const cp = spawn(CHROMIUM, [
    "--headless", "--no-sandbox", "--disable-setuid-sandbox",
    "--disable-gpu", "--no-zygote",
    "--remote-debugging-port=9223",
    "--window-size=1280,720",
    "about:blank"
  ], { stdio: "pipe", detached: false });

  cp.stderr.on("data", d => {
    const s = d.toString();
    if (s.includes("DevTools")) console.log("  DevTools ready");
  });

  await sleep(4000);

  const browser = await puppeteer.connect({ browserURL: "http://localhost:9223" });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 720 });
  console.log("Connected to browser");

  // ── PUBLIC PAGES ──
  console.log("\n[ PUBLIC ]");
  await go(page, "/", 3000);
  await shot(page, "01_home", 500);

  await go(page, "/login", 2000);
  await shot(page, "02_login", 500);

  // ── PATIENT ──
  console.log("\n[ PATIENT: test@carepulse.com ]");
  const pOk = await loginForm(page, "test@carepulse.com", "Test@1234");
  if (pOk) {
    for (const [name, route, wait] of [
      ["03_patient_dashboard",       "/my-health",         2500],
      ["04_patient_appointments",    "/appointments",      2500],
      ["05_patient_prescriptions",   "/prescriptions",     2000],
      ["06_patient_medassist",       "/medassist",         2000],
      ["07_patient_drug_checker",    "/drug-checker",      2000],
      ["08_patient_hospitals",       "/hospitals",         3000],
      ["09_patient_symptom_checker", "/symptom-checker",   2000],
      ["10_patient_health_tools",    "/health-tools",      2000],
    ]) {
      try { await go(page, route, wait); await shot(page, name, 300); }
      catch(e) { console.log(`  SKIP ${name}: ${e.message.split("\n")[0]}`); }
    }
  }

  // Logout
  try { await page.goto(BASE + "/api/auth/logout", { waitUntil: "load", timeout: 8000 }); } catch(e) {}
  await sleep(2000);

  // ── ADMIN ──
  console.log("\n[ ADMIN: admin@carepulse.com ]");
  const aOk = await loginForm(page, "admin@carepulse.com", "Admin@1234");
  if (aOk) {
    for (const [name, route, wait] of [
      ["11_admin_dashboard",    "/my-health",            2500],
      ["12_admin_patients",     "/patients",             2500],
      ["13_admin_appt_mgmt",    "/admin/appointments",   2500],
      ["14_admin_users",        "/admin/users",          2500],
      ["15_admin_analytics",    "/admin/analytics",      3000],
      ["16_admin_compliance",   "/admin/compliance",     2500],
      ["17_admin_alerts",       "/alerts",               2500],
      ["18_admin_ml_insights",  "/ml-insights",          2500],
      ["19_admin_predictive",   "/predictive-analytics", 3000],
      ["20_admin_medassist",    "/medassist",            2000],
      ["21_admin_drug_checker", "/drug-checker",         2000],
      ["22_admin_hospitals",    "/hospitals",            3000],
    ]) {
      try { await go(page, route, wait); await shot(page, name, 300); }
      catch(e) { console.log(`  SKIP ${name}: ${e.message.split("\n")[0]}`); }
    }
  }

  await browser.disconnect();
  cp.kill();
  const files = fs.readdirSync(SDIR).filter(f => f.endsWith(".png"));
  console.log(`\nDone. Screenshots: ${files.length}`);
})().catch(e => { console.error("Fatal:", e.message); process.exit(1); });
