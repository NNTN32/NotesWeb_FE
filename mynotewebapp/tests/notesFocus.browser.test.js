import test from "node:test";
import assert from "node:assert/strict";
import { fileURLToPath } from "node:url";
import { createServer } from "vite";

// Focus mode on the Notes page: the list folds into the notebook bubble, the
// sheet reaches the sidebar, the bubble shows/hides the list and can be dragged.
// Runs in the Firefox CI job (AUTH_TEST_BROWSER=firefox); locally set CHROME_BIN.
// Skipped in other CI jobs: runners set CHROME_BIN, and running this beside the
// headless-Chrome auth test there starves it past its 35 s budget.
test("browser: notes focus mode bubble", { timeout: 60000 }, async (t) => {
  const firefox = process.env.AUTH_TEST_BROWSER === "firefox";
  if (!firefox && (process.env.CI || !process.env.CHROME_BIN))
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

    // Drag the bubble to the top right: it follows the pointer, the drag does
    // not toggle the list, the list opens below-left, and the spot survives a reload.
    const start = await toggle.boundingBox();
    await page.mouse.move(start.x + 20, start.y + 20);
    await page.mouse.down();
    await page.mouse.move(900, 150, { steps: 8 });
    await page.mouse.up();
    await page.waitForTimeout(300); // hover scale settles
    // Centres, because the hovered bubble is slightly scaled.
    const centre = (box) => ({ x: box.x + box.width / 2, y: box.y + box.height / 2 });
    const moved = await toggle.boundingBox();
    const grabbed = { x: 900 - 20 + start.width / 2, y: 150 - 20 + start.height / 2 };
    assert.ok(Math.abs(centre(moved).x - grabbed.x) <= 3 && Math.abs(centre(moved).y - grabbed.y) <= 3, "bubble follows the pointer");
    assert.equal(await panel.getAttribute("data-open"), null, "ending a drag does not open the list");
    await toggle.click();
    await page.waitForTimeout(400);
    const list = await panel.boundingBox();
    assert.ok(list.y > moved.y + moved.height, "list opens below a bubble in the top half");
    assert.ok(list.x + list.width <= moved.x + moved.width + 1, "list opens leftward on the right side");
    await page.keyboard.press("Escape");
    await page.reload();
    await page.getByRole("button", { name: "Focus mode" }).click();
    await toggle.waitFor({ timeout: 5000 });
    await page.waitForTimeout(600);
    const restored = centre(await toggle.boundingBox());
    assert.ok(Math.abs(restored.x - grabbed.x) <= 3 && Math.abs(restored.y - grabbed.y) <= 3, "position is remembered");

    await page.keyboard.press("Escape");
    await page.locator(".notes-layout > .note-list").waitFor({ timeout: 5000 });
    t.diagnostic(`${firefox ? "Firefox" : "Chromium"} ${browser.version()}: focus bubble OK`);
  } finally {
    await browser?.close();
    await server.close();
  }
});
