import assert from 'node:assert/strict';
import { writeFileSync } from 'node:fs';
import { setTimeout as delay } from 'node:timers/promises';
import { pathToFileURL } from 'node:url';
import { smoke } from './smoke-http.mjs';

export async function deploy(config, { fetcher = fetch, pause = delay, smokeCheck = smoke, checkpoint = () => {} } = {}) {
  const { endpoint, apiKey, applicationId, image, revision, publicUrl, releaseId } = config;
  assert.match(image, /^[a-z0-9][a-z0-9._/-]*@sha256:[a-f0-9]{64}$/);
  assert.match(revision, /^[a-f0-9]{40}$/);
  assert.ok(apiKey && applicationId && releaseId, 'Missing deployment configuration');
  assert.equal(new URL(endpoint).protocol, 'https:');
  assert.equal(new URL(publicUrl).protocol, 'https:');
  const api = async (route, body) => {
    const response = await fetcher(new URL(`/api/${route}`, endpoint), {
      method: body ? 'POST' : 'GET', redirect: 'error', signal: AbortSignal.timeout(30_000),
      headers: { 'x-api-key': apiKey, 'Content-Type': 'application/json' },
      ...(body ? { body: JSON.stringify(body) } : {}),
    });
    // Do not print server responses: they can contain credentials or environment values.
    assert.ok(response.ok, `Dokploy ${route.split('?')[0]}: HTTP ${response.status}`);
    // Mutation endpoints may return 200/204 without a JSON body.
    if (body) {
      await response.body?.cancel();
      return;
    }
    return response.json();
  };
  const query = `applicationId=${encodeURIComponent(applicationId)}`;
  const previous = await api(`application.one?${query}`);
  const existing = await api(`deployment.all?${query}`);
  assert.ok(Array.isArray(existing), 'Unexpected deployment response');
  assert.ok(!existing.some(d => ['queued', 'running'].includes(d.status)), 'Another deployment is active');
  const record = { revision, image, applicationId, releaseId,
    previousImage: previous.sourceType === 'docker' ? previous.dockerImage : null,
    previousSourceType: previous.sourceType, status: 'starting' };
  checkpoint(record);
  // Preserve environment, networking, registry credentials and Swarm settings.
  await api('application.update', { applicationId, sourceType: 'docker', dockerImage: image, autoDeploy: false });
  await api('application.deploy', { applicationId, title: releaseId, description: `FE ${revision}` });
  const deadline = Date.now() + 10 * 60_000;
  while (Date.now() < deadline) {
    const deployments = await api(`deployment.all?${query}`);
    assert.ok(Array.isArray(deployments), 'Unexpected deployment response');
    const current = deployments.find(d => d.title === releaseId && !existing.some(old => old.deploymentId === d.deploymentId));
    if (current) {
      record.deploymentId = current.deploymentId;
      checkpoint(record);
      assert.ok(!['error', 'failed', 'cancelled'].includes(current.status), `Deployment ${current.deploymentId} failed`);
      if (current.status === 'done') {
        // Dokploy Done is only the first gate. Require new revision and sustained HTTP smoke.
        let ready = false;
        for (let attempt = 0; attempt < 30; attempt++) {
          try { await smokeCheck(publicUrl, revision); ready = true; break; }
          catch { await pause(5_000); }
        }
        assert.ok(ready, 'New revision did not pass public smoke within 150 seconds');
        for (let attempt = 0; attempt < 12; attempt++) {
          await pause(10_000);
          await smokeCheck(publicUrl, revision);
        }
        const desired = await api(`application.one?${query}`);
        assert.equal(desired.dockerImage, image, 'Deployment image changed concurrently');
        return { ...record, status: 'passed', observedSeconds: 120 };
      }
    }
    await pause(5_000);
  }
  throw new Error('Deployment timed out; inspect Dokploy before retrying or rolling back');
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const config = {
    endpoint: process.env.DOKPLOY_URL, apiKey: process.env.DOKPLOY_API_KEY,
    applicationId: process.env.DOKPLOY_APPLICATION_ID, image: process.env.RELEASE_IMAGE,
    revision: process.env.GITHUB_SHA, publicUrl: process.env.FE_PUBLIC_URL,
    releaseId: `FE-${process.env.GITHUB_RUN_ID}-${process.env.GITHUB_RUN_ATTEMPT}`,
  };
  let evidence = { revision: config.revision, image: config.image, status: 'starting' };
  const checkpoint = record => {
    evidence = { ...record };
    writeFileSync('deployment.json', JSON.stringify(evidence, null, 2));
  };
  try {
    const record = await deploy(config, { checkpoint });
    checkpoint(record);
    console.log(`Deployment ${record.deploymentId}: public smoke passed for ${record.revision}`);
  } catch (error) {
    // No raw request/response or secret-bearing configuration in reports.
    checkpoint({ ...evidence, status: 'failed' });
    console.error(error.message);
    process.exitCode = 1;
  }
}
