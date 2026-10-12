import assert from 'node:assert/strict';
import { pathToFileURL } from 'node:url';

export async function smoke(baseUrl, revision, { mock = false } = {}) {
  const request = (path, options = {}) => fetch(new URL(path, baseUrl), {
    ...options, redirect: 'error', signal: AbortSignal.timeout(15_000),
  });
  const health = await request('/healthz');
  assert.equal(health.status, 200, 'FE health');
  assert.equal((await health.text()).trim(), 'ok');
  const version = await request('/version.json');
  assert.equal(version.status, 200);
  assert.match(version.headers.get('cache-control') || '', /no-cache/);
  assert.equal((await version.json()).revision, revision, 'deployed revision');
  let html;
  for (const path of ['/', '/create', '/todo', '/weekly-plan', '/auth/login']) {
    const response = await request(path);
    assert.equal(response.status, 200, path);
    assert.match(response.headers.get('content-type') || '', /text\/html/);
    assert.match(response.headers.get('cache-control') || '', /no-cache/);
    const body = await response.text();
    if (html) assert.equal(body, html, `SPA fallback ${path}`);
    html = body;
  }
  const asset = html.match(/src="(\/assets\/[^" ]+\.js)"/)?.[1];
  assert.ok(asset, 'entry bundle present');
  const bundle = await request(asset);
  assert.equal(bundle.status, 200);
  assert.match(bundle.headers.get('cache-control') || '', /immutable/);
  assert.equal((await request('/assets/ci-missing-file.js')).status, 404);
  const api = await request(mock ? '/api/auth/login?check=1' : '/api/auth/refresh', {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{}',
  });
  assert.equal(api.status, 401, 'anonymous auth must reach the API');
  assert.doesNotMatch(api.headers.get('content-type') || '', /text\/html/);
  if (mock) {
    const data = await api.json();
    assert.equal(data.method, 'POST');
    assert.equal(data.url, '/api/auth/login?check=1');
    const cookie = api.headers.get('set-cookie') || '';
    for (const flag of [/secure/i, /httponly/i, /samesite=lax/i]) assert.match(cookie, flag);
  }
  return { revision, asset, status: 'passed' };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  console.log(JSON.stringify(await smoke(process.argv[2], process.argv[3])));
}
