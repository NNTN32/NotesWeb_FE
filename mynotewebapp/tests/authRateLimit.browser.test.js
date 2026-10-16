import test from "node:test";
import assert from "node:assert/strict";
import { access, mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { createServer } from "vite";

test("browser: auth countdown, remount and manual-only retry", { timeout: 45000 }, async (t) => {
  const firefox = process.env.AUTH_TEST_BROWSER === "firefox";
  const candidates = [process.env.CHROME_BIN, "/usr/bin/google-chrome", "/usr/bin/chromium", "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"].filter(Boolean);
  let chrome;
  for (const candidate of candidates) {
    try { await access(candidate);chrome = candidate;break; } catch { /* Try the next installed browser. */ }
  }
  if (!firefox && !chrome && !process.env.CI) return t.skip("Install Chrome or set CHROME_BIN for browser regression tests");
  assert.ok(firefox || chrome, "CI requires a browser; browser coverage must not silently skip");
  const profile = await mkdtemp(join(tmpdir(), "notes-fe-rate-"));
  let browser;
  const server = await createServer({ root: fileURLToPath(new URL("..", import.meta.url)),
    server: { host: "127.0.0.1", port: 0 },
    plugins: [{ name: "auth-test-page", configureServer(vite) {
      vite.middlewares.use(async (request, response, next) => {
        if (request.url !== "/__test-rate-limit") return next();
        response.setHeader("Content-Type", "text/html");
        response.end(await vite.transformIndexHtml(request.url, '<!doctype html><html><body><script type="module" src="/tests/fixtures/authRateLimit.jsx"></script></body></html>'));
      });
    } }],
  });
  try {
    await server.listen();
    const port = server.httpServer.address().port;
    if (firefox) {
      const { firefox } = await import("playwright");
      browser = await firefox.launch({
        timeout: 10000,
        // macOS 27 protects Firefox's shared app data; keep test data isolated (playwright#42768).
        ...(process.platform === "darwin" ? { env: { ...process.env, CFFIXED_USER_HOME: profile } } : {}),
      });
      const page = await browser.newPage();
      await page.goto(`http://127.0.0.1:${port}/__test-rate-limit`, { timeout: 10000 });
      await page.waitForSelector("#rate-test-result", { timeout: 20000 });
      const report = JSON.parse(await page.locator("#rate-test-result").textContent());
      assert.equal(report.passed, true, JSON.stringify(report));
      assert.ok(report.checks.length >= 20);
      t.diagnostic(`Firefox ${browser.version()}: ${report.checks.length} auth assertions passed`);
      return;
    }
    const { stdout } = await promisify(execFile)(chrome, ["--headless=new", "--no-first-run", "--no-default-browser-check",
      "--disable-background-networking", "--disable-extensions", `--user-data-dir=${profile}`,
      "--virtual-time-budget=30000", "--dump-dom", `http://127.0.0.1:${port}/__test-rate-limit`], { timeout: 35000, maxBuffer: 2 * 1024 * 1024 });
    const result = stdout.match(/<pre id="rate-test-result">([^<]+)<\/pre>/)?.[1];
    assert.ok(result, "Browser fixture did not complete: " + stdout.slice(-3000));
    const report = JSON.parse(result.replaceAll("&quot;", '"').replaceAll("&amp;", "&"));
    assert.equal(report.passed, true, JSON.stringify(report));
    assert.ok(report.checks.length >= 20);
  } finally {
    await browser?.close();
    await server.close();
    // CoreFoundation adds deny-delete ACLs to folders inside this temporary macOS test home.
    if (firefox && process.platform === "darwin") await promisify(execFile)("chmod", ["-RN", profile]);
    await rm(profile, { recursive: true, force: true, maxRetries: 5, retryDelay: 100 });
  }
});
