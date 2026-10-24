import assert from 'node:assert/strict';
import { writeFileSync } from 'node:fs';
import { setTimeout as delay } from 'node:timers/promises';
import { pathToFileURL } from 'node:url';
import { smoke, userAgent } from './smoke-http.mjs';

// The only production target. A leaked workflow cannot point the app token elsewhere.
export const target = Object.freeze({
  captain: 'https://captain.nhannotes.id.vn', app: 'notesweb-fe', publicUrl: 'https://nhannotes.id.vn',
});
export const imagePattern = /^ghcr\.io\/nntn32\/notesweb-fe@sha256:[a-f0-9]{64}$/;

const servedRevision = async (publicUrl, fetcher) => {
  const response = await fetcher(new URL('/version.json', publicUrl), { redirect: 'error', signal: AbortSignal.timeout(15_000),
    headers: { 'User-Agent': userAgent } });
  assert.equal(response.status, 200, 'version.json');
  return (await response.json()).revision;
};

export async function deploy(config, {
  fetcher = fetch, pause = delay, smokeCheck = smoke, checkpoint = () => {}, attempts = 30, observationSamples = 12,
  log = console.warn,
} = {}) {
  const { appToken, image, revision, previousImage } = config;
  assert.ok(appToken, 'Missing CapRover app token');
  assert.match(image, imagePattern, 'Deploy requires an immutable FE digest');
  assert.match(revision, /^[a-f0-9]{40}$/);
  assert.ok(!previousImage || imagePattern.test(previousImage), 'Previous image must be a pinned digest');

  // App tokens can only start a deploy of this one app; detached so Cloudflare's 100 s limit never cuts it.
  const startDeploy = async imageName => {
    let response;
    try {
      response = await fetcher(new URL(`/api/v2/user/apps/appData/${target.app}?detached=1`, target.captain), {
        method: 'POST', redirect: 'error', signal: AbortSignal.timeout(30_000),
        // Cloudflare 403s some default client user agents (e.g. Python-urllib); send a fixed one.
        headers: { 'x-captain-app-token': appToken, 'x-namespace': 'captain', 'Content-Type': 'application/json',
          'User-Agent': 'NotesWeb-Actions-Deploy/1.0' },
        body: JSON.stringify({ captainDefinitionContent: JSON.stringify({ schemaVersion: 2, imageName }) }),
      });
    } catch { throw new Error('CapRover deploy request failed'); }
    // Do not print server responses: they can contain configuration.
    assert.ok(response.ok, `CapRover deploy HTTP ${response.status}`);
    let status;
    try { status = (await response.json()).status; } catch { throw new Error('Invalid CapRover response'); }
    assert.ok([100, 101].includes(status), `CapRover deploy status ${status}`);
  };
  // `expected` undefined (rollback): accept whatever revision is served unless it is the failed one.
  const waitFor = async expected => {
    for (let attempt = 0; attempt < attempts; attempt++) {
      try {
        const live = expected ?? await servedRevision(target.publicUrl, fetcher);
        assert.ok(expected || live !== revision, 'failed revision still served');
        await smokeCheck(target.publicUrl, live);
        for (let sample = 0; sample < observationSamples; sample++) {
          await pause(10_000);
          await smokeCheck(target.publicUrl, live);
        }
        return live;
      } catch (error) {
        // First line of the check that failed (assert text or network code), never a response body.
        const code = error?.cause?.code ? ` (${error.cause.code})` : '';
        log(`Public smoke attempt ${attempt + 1}/${attempts} failed: ${String(error?.message).split('\n')[0]}${code}`);
        await pause(10_000);
      }
    }
    throw new Error(`Revision did not pass public smoke within ${attempts * 10} seconds`);
  };

  const record = { revision, image, previousImage: previousImage ?? null, app: target.app, status: 'starting' };
  checkpoint(record);
  try {
    await startDeploy(image);
    await waitFor(revision);
    return { ...record, status: 'passed', observedSeconds: observationSamples * 10 };
  } catch (error) {
    Object.assign(record, { status: 'failed', rollback: previousImage ? 'running' : 'no_previous_release' });
    if (/^CapRover deploy (HTTP \d{3}|status -?\d+|request failed)$/.test(error?.message)) record.failure = error.message;
    checkpoint(record);
    if (previousImage) {
      try { await startDeploy(previousImage); await waitFor(undefined); record.rollback = 'passed'; }
      catch { record.rollback = 'manual_required'; }
    }
    checkpoint(record);
    throw new Error(`Deployment failed; rollback ${record.rollback}`);
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const config = { appToken: process.env.CAPROVER_APP_TOKEN, image: process.env.RELEASE_IMAGE,
    revision: process.env.GITHUB_SHA, previousImage: process.env.PREVIOUS_IMAGE || undefined };
  let evidence = { revision: config.revision, image: config.image, status: 'starting' };
  const checkpoint = record => {
    evidence = { ...record };
    writeFileSync('deployment.json', JSON.stringify(evidence, null, 2));
  };
  try {
    checkpoint(await deploy(config, { checkpoint }));
    console.log(`Deployed ${config.image}: public smoke passed for ${config.revision}`);
  } catch (error) {
    // No raw request/response or secret-bearing configuration in reports.
    if (evidence.status !== 'failed') checkpoint({ ...evidence, status: 'failed' });
    console.error(error.message);
    process.exitCode = 1;
  }
}
