const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");

const BASE = "http://localhost:5000";
const SDIR = path.join(__dirname, "../public/datasets/screenshots");

async function goShot(page, name, route, waitMs) {
  try {
    await page.goto(BASE + route, { waitUntil: "load", timeout: 18000 });
    await new Promise(r => setTimeout(r, waitMs || 2500));
    const file = path.join(SDIR, name + ".png");
    await page.screenshot({ path: file, clip: { x: 0, y: 0, width: 1280, height: 720 } });
    console.log("  ok: " + name + " [" + page.url().replace(BASE, "") + "]");
  } catch (e) {
    console.log("  FAIL: " + name + " — " + e.message.split("\n")[0]);
  }
}

async function loginViaForm(page, email, pass) {
  await page.goto(BASE + "/login", { waitUntil: "load", timeout: 18000 });
  await new Promise(r => setTimeout(r, 2000));

  // Fill in the form using keyboard
  await page.focus('input[placeholder*="doctor"], input[placeholder*="email"], input[type="email"]');
  await page.keyboard.type(email, { delay: 40 });
  await page.focus('input[type="password"]');
  await page.keyboard.type(pass, { delay: 40 });
  await page.click('button[type="submit"]');
  // Wait for navigation away from /login
  await new Promise(r => setTimeout(r, 4000));
  const url = page.url();
  const loggedIn = !url.includes("/login");
  console.log("  Login: " + email + " → " + url + (loggedIn ? " ✓" : " ✗ STILL ON LOGIN"));
  return loggedIn;
}

(async () => {
  const browser = await puppeteer.connect({ browserURL: "http://localhost:9222" });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 720 });
  console.log("Connected to browser");

  // === PATIENT ===
  console.log("\n[PATIENT: test@carepulse.com]");
  const pOk = await loginViaForm(page, "test@carepulse.com", "Test@1234");
  if (pOk) {
    await goShot(page, "03_patient_dashboard", "/my-health", 3000);
    await goShot(page, "04_patient_appointments", "/appointments", 3000);
    await goShot(page, "05_patient_prescriptions", "/prescriptions", 2500);
    await goShot(page, "06_patient_medassist", "/medassist", 2500);
    await goShot(page, "07_patient_drug_checker", "/drug-checker", 2500);
    await goShot(page, "08_patient_hospitals", "/hospitals", 3000);
    await goShot(page, "09_patient_symptom_checker", "/symptom-checker", 2500);
    await goShot(page, "10_patient_health_tools", "/health-tools", 2500);
  }

  // Logout
  await page.goto(BASE + "/api/auth/logout", { waitUntil: "load", timeout: 10000 }).catch(() => {});
  await new Promise(r => setTimeout(r, 2000));

  // === ADMIN ===
  console.log("\n[ADMIN: admin@carepulse.com]");
  const aOk = await loginViaForm(page, "admin@carepulse.com", "Admin@1234");
  if (aOk) {
    await goShot(page, "11_admin_dashboard", "/my-health", 3000);
    await goShot(page, "12_admin_patients", "/patients", 3000);
    await goShot(page, "13_admin_appt_mgmt", "/admin/appointments", 3000);
    await goShot(page, "14_admin_users", "/admin/users", 3000);
    await goShot(page, "15_admin_analytics", "/admin/analytics", 3000);
    await goShot(page, "16_admin_compliance", "/admin/compliance", 3000);
    await goShot(page, "17_admin_alerts", "/alerts", 3000);
    await goShot(page, "18_admin_ml_insights", "/ml-insights", 3000);
    await goShot(page, "19_admin_predictive", "/predictive-analytics", 3000);
    await goShot(page, "20_admin_medassist", "/medassist", 2500);
    await goShot(page, "21_admin_drug_checker", "/drug-checker", 2500);
    await goShot(page, "22_admin_hospitals", "/hospitals", 3000);
  }

  browser.disconnect();
  const files = fs.readdirSync(SDIR).filter(f => f.endsWith(".png"));
  console.log("\nTotal screenshots: " + files.length);
})().catch(e => { console.error("Error:", e.message); process.exit(1); });
