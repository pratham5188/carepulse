#!/bin/bash
set -e
BASE="http://localhost:5000"
OUT="/home/runner/workspace/carepulse/public/datasets/screenshots"
mkdir -p "$OUT"

CHROMIUM="/home/runner/.nix-profile/bin/chromium"
CHROMIUM_OPTS="--headless --no-sandbox --disable-gpu --disable-dev-shm-usage --window-size=1280,720 --screenshot"

shot() {
  local name="$1"
  local url="$2"
  local cookie_file="$3"
  local out_file="$OUT/${name}.png"

  if [ -n "$cookie_file" ] && [ -f "$cookie_file" ]; then
    $CHROMIUM $CHROMIUM_OPTS="$out_file" \
      --load-extension="" \
      --user-data-dir="/tmp/chrome_user_$$" \
      "${BASE}${url}" 2>/dev/null || true
  else
    $CHROMIUM $CHROMIUM_OPTS="$out_file" \
      "${BASE}${url}" 2>/dev/null || true
  fi

  if [ -f "$out_file" ]; then
    echo "  ok: $name"
  else
    echo "  FAIL: $name"
  fi
}

echo "=== Capturing screenshots ==="

# PUBLIC PAGES
echo ""
echo "[PUBLIC]"
$CHROMIUM --headless --no-sandbox --disable-gpu --disable-dev-shm-usage --window-size=1280,720 \
  --screenshot="$OUT/01_home.png" "$BASE/" 2>/dev/null && echo "  ok: 01_home" || echo "  fail: 01_home"

sleep 1
$CHROMIUM --headless --no-sandbox --disable-gpu --disable-dev-shm-usage --window-size=1280,720 \
  --screenshot="$OUT/02_login.png" "$BASE/login" 2>/dev/null && echo "  ok: 02_login" || echo "  fail: 02_login"

# LOGIN AS PATIENT
echo ""
echo "[PATIENT LOGIN via API]"
COOKIE_JAR_P="/tmp/cookies_patient_$$.txt"
LOGIN_RESULT=$(curl -s -c "$COOKIE_JAR_P" -b "$COOKIE_JAR_P" \
  -X POST "$BASE/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"test@carepulse.com","password":"Test@1234"}' 2>&1)
echo "  Login result: $(echo $LOGIN_RESULT | cut -c1-80)"

# Extract session cookie value
SESSION_ID=$(grep -i 'connect.sid\|session' "$COOKIE_JAR_P" 2>/dev/null | awk '{print $7}' | head -1)
echo "  Session: ${SESSION_ID:0:20}..."

# Use puppeteer-based approach with cookie injection instead
node - <<'JSEOF'
const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const BASE = "http://localhost:5000";
const OUT = "/home/runner/workspace/carepulse/public/datasets/screenshots";

const CHROMIUM = "/home/runner/.nix-profile/bin/chromium";

async function launchBrowser() {
  return await puppeteer.launch({
    headless: true,
    executablePath: CHROMIUM,
    args: [
      "--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage",
      "--disable-gpu", "--no-first-run", "--single-process",
      "--disable-features=site-per-process",
    ],
    timeout: 60000,
  });
}

async function shot(page, name, waitMs = 2000) {
  await new Promise(r => setTimeout(r, waitMs));
  const file = path.join(OUT, name + ".png");
  await page.screenshot({ path: file, clip: { x: 0, y: 0, width: 1280, height: 720 } });
  console.log("  ok: " + name);
}

async function loginViaForm(page, email, pass) {
  await page.goto(BASE + "/login", { waitUntil: "load", timeout: 30000 });
  await new Promise(r => setTimeout(r, 2000));
  await page.evaluate((e, p) => {
    const inputs = document.querySelectorAll("input");
    inputs[0] && (inputs[0].value = "");
    inputs[1] && (inputs[1].value = "");
  }, email, pass);
  const inputs = await page.$$("input");
  if (inputs[0]) { await inputs[0].click({ clickCount: 3 }); await inputs[0].type(email, { delay: 30 }); }
  if (inputs[1]) { await inputs[1].click({ clickCount: 3 }); await inputs[1].type(pass, { delay: 30 }); }
  const btn = await page.$('button[type="submit"], form button');
  if (btn) await btn.click();
  await new Promise(r => setTimeout(r, 4000));
  console.log("  → " + page.url());
}

async function goShot(page, name, route, wait) {
  try {
    await page.goto(BASE + route, { waitUntil: "load", timeout: 20000 });
    await shot(page, name, wait || 2000);
  } catch(e) {
    console.log("  FAIL " + name + ": " + e.message.split("\n")[0]);
  }
}

async function main() {
  const browser = await launchBrowser();
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 720 });

  // Public
  console.log("\n[PUBLIC]");
  await goShot(page, "01_home", "/", 2500);
  await goShot(page, "02_login", "/login", 1500);

  // Patient
  console.log("\n[PATIENT]");
  await loginViaForm(page, "test@carepulse.com", "Test@1234");
  await goShot(page, "03_patient_my_health", "/my-health", 2500);
  await goShot(page, "04_patient_appointments", "/appointments", 2500);
  await goShot(page, "05_patient_prescriptions", "/prescriptions", 2000);
  await goShot(page, "06_patient_medassist", "/medassist", 2000);
  await goShot(page, "07_patient_drug_checker", "/drug-checker", 2000);
  await goShot(page, "08_patient_hospitals", "/hospitals", 2500);
  await goShot(page, "09_patient_symptom_checker", "/symptom-checker", 2000);
  await goShot(page, "10_patient_health_tools", "/health-tools", 2000);

  // Logout
  await page.goto(BASE + "/api/auth/logout", { timeout: 8000 }).catch(() => {});
  await new Promise(r => setTimeout(r, 2000));

  // Admin
  console.log("\n[ADMIN]");
  await loginViaForm(page, "admin@carepulse.com", "Admin@1234");
  await goShot(page, "11_admin_dashboard", "/my-health", 2500);
  await goShot(page, "12_admin_patients", "/patients", 2500);
  await goShot(page, "13_admin_appointments_mgmt", "/admin/appointments", 2500);
  await goShot(page, "14_admin_users", "/admin/users", 2500);
  await goShot(page, "15_admin_analytics", "/admin/analytics", 2500);
  await goShot(page, "16_admin_compliance", "/admin/compliance", 2500);
  await goShot(page, "17_admin_alerts", "/alerts", 2500);
  await goShot(page, "18_admin_ml_insights", "/ml-insights", 2500);
  await goShot(page, "19_admin_predictive", "/predictive-analytics", 2500);
  await goShot(page, "20_admin_medassist", "/medassist", 2000);
  await goShot(page, "21_admin_drug_checker", "/drug-checker", 2000);
  await goShot(page, "22_admin_hospitals", "/hospitals", 2500);

  await browser.close();
  const files = fs.readdirSync(OUT).filter(f => f.endsWith(".png"));
  console.log("\nTotal screenshots: " + files.length);
}

main().catch(e => { console.error(e.message); process.exit(1); });
JSEOF
