const { spawn } = require("child_process");
const puppeteer = require("puppeteer-core");
const fs = require("fs");
const path = require("path");

const BASE = "http://localhost:5000";
const SDIR = path.join(__dirname, "../public/datasets/screenshots");
if (!fs.existsSync(SDIR)) fs.mkdirSync(SDIR, { recursive: true });

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function shot(page, name) {
  const file = path.join(SDIR, name + ".png");
  await page.screenshot({ path: file, type: "png" });
  const kb = Math.round(fs.statSync(file).size / 1024);
  console.log(`✓ ${name}.png  ${kb}KB  [${page.url().replace(BASE,"")||"/"}]`);
}

async function go(page, route, wait) {
  await page.goto(BASE + route, { waitUntil: "networkidle2", timeout: 20000 });
  await sleep(wait || 1500);
}

async function loginForm(page, email, pass) {
  await page.goto(BASE + "/login", { waitUntil: "networkidle2", timeout: 20000 });
  await sleep(1200);
  await page.waitForSelector('input[type="email"]', { timeout: 6000 });
  await page.click('input[type="email"]', { clickCount: 3 });
  await page.type('input[type="email"]', email, { delay: 30 });
  await page.click('input[type="password"]', { clickCount: 3 });
  await page.type('input[type="password"]', pass, { delay: 30 });
  await page.click('button[type="submit"]');
  await sleep(3500);
  const ok = !page.url().includes("/login");
  console.log(`Login ${email} → ${page.url().replace(BASE,"")} ${ok?"✓":"✗"}`);
  return ok;
}

(async () => {
  const cp = spawn("/home/runner/.nix-profile/bin/chromium", [
    "--headless","--no-sandbox","--disable-setuid-sandbox","--disable-gpu",
    "--no-zygote","--remote-debugging-port=9225","--window-size=1280,720","about:blank"
  ], { stdio: "pipe" });
  await sleep(3500);

  const browser = await puppeteer.connect({ browserURL: "http://localhost:9225" });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 720 });
  console.log("Browser connected");

  const ok = await loginForm(page, "admin@carepulse.com", "Admin@1234");
  if (ok) {
    for (const [n, r, w] of [
      ["11_admin_dashboard","/my-health",2000],
      ["12_admin_patients","/patients",2000],
      ["13_admin_appt_mgmt","/admin/appointments",2000],
      ["14_admin_users","/admin/users",2000],
      ["15_admin_analytics","/admin/analytics",2500],
      ["16_admin_compliance","/admin/compliance",2000],
      ["17_admin_alerts","/alerts",2000],
      ["18_admin_ml_insights","/ml-insights",2000],
      ["19_admin_predictive","/predictive-analytics",2500],
      ["20_admin_medassist","/medassist",1800],
      ["21_admin_drug_checker","/drug-checker",1800],
      ["22_admin_hospitals","/hospitals",2500],
    ]) { try { await go(page,r,w); await shot(page,n); } catch(e){console.log(`SKIP ${n}:`,e.message.split("\n")[0]);} }
  }

  await browser.disconnect(); cp.kill();
  console.log("Admin screenshots done.");
})().catch(e => { console.error("Fatal:", e.message); process.exit(1); });
