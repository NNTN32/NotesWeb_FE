import test from "node:test";
import assert from "node:assert/strict";
import { fileURLToPath } from "node:url";
import { createServer } from "vite";

// Focus mode on the Notes page: the list folds into the notebook bubble, the
// sheet reaches the sidebar, and the bubble shows/hides the list.
// Runs in Firefox on CI (AUTH_TEST_BROWSER=firefox); locally set CHROME_BIN.
test("browser: notes focus mode bubble", { timeout: 60000 }, async (t) => {
  const firefox = process.env.AUTH_TEST_BROWSER === "firefox";
  if (!firefox && !process.env.CHROME_BIN)
    return t.skip("Runs in the Firefox CI job, or locally with CHROME_BIN");
  const server = await createServer({
    root: fileURLToPath(new URL("..", import.meta.url)),
    server: { host: "127.0.0.1", port: 0 },
    logLevel: "error",
  });
  let browser;
  try {
    await server.listen();
    const port = server.httpServer.address().port;
    const playwright = await import("playwright");
    browser = firefox
      ? await playwright.firefox.launch({ timeout: 10000 })
      : await playwright.chromium.launch({ executablePath: process.env.CHROME_BIN });
    const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
    await page.route("**/api/**", (route) => route.fulfill({ status: 401, body: "" }));
    await page.goto(`http://127.0.0.1:${port}/notes`, { timeout: 20000 });

    for (const [title, content] of [["Alpha", "One"], ["Beta", "Two words"]]) {
      await page.getByRole("button", { name: "New note" }).click();
      await page.fill("#note-title", title);
      await page.fill("#note-content", content);
    }
    assert.match(await page.textContent("[role=status]"), /· 2 words$/);
    await page.fill("#note-content", "One");
    assert.match(await page.textContent("[role=status]"), /· 1 word$/);

    await page.getByRole("button", { name: "Focus mode" }).click();
    const toggle = page.getByRole("button", { name: "Show notes" });
    await toggle.waitFor({ timeout: 5000 });
    await page.waitForTimeout(600); // let the morph finish
    assert.equal(await page.locator(".notes-layout > .note-list").count(), 0);
    const sidebar = await page.locator(".sidebar").boundingBox();
    const sheet = await page.locator(".note-editor").boundingBox();
    assert.ok(Math.abs(sheet.x - (sidebar.x + sidebar.width)) <= 2, "sheet touches the sidebar");
    const bubble = await toggle.boundingBox();
    assert.ok(800 - (bubble.y + bubble.height) < 48, "bubble is pinned to the viewport bottom");

    const panel = page.locator(".notes-bubble__panel");
    await toggle.click();
    assert.notEqual(await panel.getAttribute("data-open"), null, "bubble opens the list");
    await page.keyboard.press("Escape");
    assert.equal(await panel.getAttribute("data-open"), null);
    assert.equal(await page.locator(".notes-page--focus").count(), 1, "Escape closes only the list");

    await page.getByRole("button", { name: "Show notes" }).click();
    await page.mouse.click(1100, 400);
    assert.equal(await panel.getAttribute("data-open"), null, "click outside closes the list");

    await page.getByRole("button", { name: "Show notes" }).click();
    await panel.getByRole("button", { name: /Alpha/ }).click();
    assert.equal(await page.inputValue("#note-title"), "Alpha");
    assert.equal(await panel.getAttribute("data-open"), null);

    await page.keyboard.press("Escape");
    await page.locator(".notes-layout > .note-list").waitFor({ timeout: 5000 });
    t.diagnostic(`${firefox ? "Firefox" : "Chromium"} ${browser.version()}: focus bubble OK`);
  } finally {
    await browser?.close();
    await server.close();
  }
});
