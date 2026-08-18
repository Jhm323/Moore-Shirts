import { chromium } from "playwright";

const shotDir = "/private/tmp/claude-502/-Users-jamesmoore-Projects-Moore-Shirts/7d199a41-766b-4d6f-8066-b3ce6e50fc09/scratchpad";
const TEST_EMAIL = "james.holden.moore@gmail.com";
const TEST_PASSWORD = "ClaudeVerify2026!";

const errors = [];
const browser = await chromium.launch({ args: ["--no-sandbox"] });
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
page.on("console", (msg) => { if (msg.type() === "error") errors.push(msg.text()); });
page.on("pageerror", (err) => errors.push(String(err)));

const log = (label, val) => console.log(`${label}: ${val}`);

await page.goto("http://localhost:5173");
await page.waitForSelector("text=Common Thread");
await page.click("header >> text=Sign in");
await page.waitForSelector('h2:has-text("Sign in")');
await page.click("text=Create an account");
await page.waitForSelector('h2:has-text("Create account")');

await page.fill('input[type="email"]', TEST_EMAIL);
await page.fill('input[type="password"]', TEST_PASSWORD);
await page.click('button:has-text("Create account")');
await page.waitForTimeout(2000);

const isShopPage = await page.locator("text=Shop all").count();
const infoVisible = await page.locator(".auth-panel__info").count();
const infoText = infoVisible ? await page.locator(".auth-panel__info").textContent() : null;
const errorVisible = await page.locator(".auth-panel__error").count();
const errorText = errorVisible ? await page.locator(".auth-panel__error").textContent() : null;

log("IMMEDIATE_LOGIN", isShopPage > 0);
log("INFO_MESSAGE", infoText);
log("ERROR_MESSAGE", errorText);
await page.screenshot({ path: `${shotDir}/full-1-after-signup.png` });

console.log("CONSOLE_ERRORS:", JSON.stringify(errors));
await browser.close();
