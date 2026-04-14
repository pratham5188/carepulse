const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");

const BASE = "http://localhost:5000";
const OUT = path.join(__dirname, "../public/datasets/screenshots");
if (!fs.existsSync(OUT)) fs.mkdirSync(OUT, { recursive: true });

const ACCOUNTS = {
  patient: { email: "test@carepulse.com", password: "Test@1234" },
  admin:   { email: "admin@carepulse.com", password: "Admin@1234" },
};

async function shot(page, name, url, waitMs = 2500) {
  try {
    await page.goto(BASE + url, { waitUntil: "domcontentloaded", timeout: 20000 });
    await new Promise(r => setTimeout(r, waitMs));
    const file = path.join(OUT, name + ".png");
    await page.screenshot({ path: file, clip: { x: 0, y: 0, width: 1280, height: 720 } });
    console.log("  ok: " + name);
    return file;
  } catch (e) {
    console.log("  FAIL: " + name + " - " + e.message.split("\n")[0]);
    return null;
  }
}

async function login(page, email, password) {
  await page.goto(BASE + "/login", { waitUntil: "domcontentloaded", timeout: 20000 });
  await new Promise(r => setTimeout(r, 1500));
  // Clear and type email
  const emailSel = 'input[placeholder*="email"], input[placeholder*="doctor"], input[type="email"]';
  await page.waitForSelector(emailSel, { timeout: 5000 });
  await page.click(emailSel, { clickCount: 3 });
  await page.type(emailSel, email, { delay: 40 });
  // Type password
  const pwSel = 'input[type="password"]';
  await page.click(pwSel, { clickCount: 3 });
  await page.type(pwSel, password, { delay: 40 });
  // Click login button
  await page.click('button[type="submit"]');
  await new Promise(r => setTimeout(r, 4000));
  const url = page.url();
  console.log("  Logged in as: " + email + " → " + url);
}

async function main() {
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: "/home/runner/.nix-profile/bin/chromium",
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-gpu",
      "--no-first-run",
      "--no-zygote",
      "--single-process",
    ],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 720 });

  console.log("\n=== PUBLIC PAGES ===");
  await shot(page, "01_home_landing", "/", 2000);
  await shot(page, "02_login_page", "/login", 1500);

  console.log("\n=== PATIENT ROLE (test@carepulse.com) ===");
  await login(page, ACCOUNTS.patient.email, ACCOUNTS.patient.password);
  await shot(page, "03_patient_dashboard", "/my-health", 2500);
  await shot(page, "04_patient_appointments", "/appointments", 2500);
  await shot(page, "05_patient_prescriptions", "/prescriptions", 2000);
  await shot(page, "06_patient_medassist", "/medassist", 2000);
  await shot(page, "07_patient_drug_checker", "/drug-checker", 2000);
  await shot(page, "08_patient_hospitals", "/hospitals", 2500);
  await shot(page, "09_patient_symptom_checker", "/symptom-checker", 2000);
  await shot(page, "10_patient_health_tools", "/health-tools", 2000);
  // Holiday blocking test
  await page.goto(BASE + "/appointments", { waitUntil: "domcontentloaded", timeout: 15000 });
  await new Promise(r => setTimeout(r, 2000));
  // Open booking dialog
  try {
    const bookBtn = await page.$('[data-testid="book-appointment"], button');
    if (bookBtn) await bookBtn.click();
    await new Promise(r => setTimeout(r, 1000));
  } catch (e) {}
  await shot(page, "11_patient_appointments_book_dialog", "/appointments", 1500);

  // Logout
  await page.goto(BASE + "/api/auth/logout", { timeout: 8000 }).catch(() => {});
  await new Promise(r => setTimeout(r, 1500));
  await page.goto(BASE + "/", { waitUntil: "domcontentloaded", timeout: 10000 });
  await new Promise(r => setTimeout(r, 1000));

  console.log("\n=== ADMIN ROLE (admin@carepulse.com) ===");
  await login(page, ACCOUNTS.admin.email, ACCOUNTS.admin.password);
  await shot(page, "12_admin_dashboard", "/my-health", 2500);
  await shot(page, "13_admin_patients_list", "/patients", 2500);
  await shot(page, "14_admin_appointments", "/admin/appointments", 2500);
  await shot(page, "15_admin_users", "/admin/users", 2500);
  await shot(page, "16_admin_analytics", "/admin/analytics", 2500);
  await shot(page, "17_admin_compliance", "/admin/compliance", 2500);
  await shot(page, "18_admin_alerts", "/alerts", 2000);
  await shot(page, "19_admin_ml_insights", "/ml-insights", 2500);
  await shot(page, "20_admin_predictive", "/predictive-analytics", 2500);
  await shot(page, "21_admin_medassist", "/medassist", 2000);
  await shot(page, "22_admin_drug_checker", "/drug-checker", 2000);
  await shot(page, "23_admin_hospitals", "/hospitals", 2500);

  await browser.close();
  const files = fs.readdirSync(OUT).filter(f => f.endsWith(".png"));
  console.log("\nDone! " + files.length + " screenshots in: " + OUT);
}

main().catch(e => { console.error(e); process.exit(1); });
