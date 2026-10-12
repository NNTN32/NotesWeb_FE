import test from 'node:test';
import assert from 'node:assert/strict';
import { deploy } from '../scripts/ci/deploy.mjs';

const config = { endpoint: 'https://deploy.example.test', publicUrl: 'https://fe.example.test',
  apiKey: 'test-only', applicationId: 'fe', image: `nntn/notesweb-fe@sha256:${'a'.repeat(64)}`,
  revision: 'b'.repeat(40), releaseId: 'FE-test' };
function fixture(status = 'done', smokeError = false) {
  const calls = [];
  let started = false;
  let smoked = 0;
  return { calls, deps: { pause: async () => {}, smokeCheck: async () => {
    smoked++; if (smokeError) throw new Error('Wrong revision');
  }, fetcher: async (url, options) => {
    calls.push({ path: url.pathname, body: options.body && JSON.parse(options.body) });
    let data = {};
    if (url.pathname.endsWith('application.one')) data = { sourceType: 'docker', dockerImage: config.image };
    if (url.pathname.endsWith('application.deploy')) started = true;
    if (url.pathname.endsWith('deployment.all')) data = started
      ? [{ title: config.releaseId, status, deploymentId: 'new' }]
      : [{ title: 'unrelated old success', status: 'done', deploymentId: 'old' }];
    return { ok: true, json: async () => data };
  } }, smoked: () => smoked };
}
test('deploy pins digest, waits for this deployment and observes smoke for 120 seconds', async () => {
  const f = fixture();
  const result = await deploy(config, f.deps);
  assert.equal(result.deploymentId, 'new');
  assert.equal(result.observedSeconds, 120);
  assert.equal(f.smoked(), 13);
  assert.deepEqual(f.calls.find(c => c.path.endsWith('application.update')).body,
    { applicationId: 'fe', sourceType: 'docker', dockerImage: config.image, autoDeploy: false });
});
test('failed deployment never reports success', async () => {
  const f = fixture('error');
  await assert.rejects(deploy(config, f.deps), /failed/);
  assert.equal(f.smoked(), 0);
});
test('Dokploy done with wrong live revision fails', async () => {
  const f = fixture('done', true);
  await assert.rejects(deploy(config, f.deps), /public smoke/);
});
test('mutable tag is rejected before network access', async () => {
  const f = fixture();
  await assert.rejects(deploy({ ...config, image: 'nntn/notesweb-fe:latest' }, f.deps));
  assert.equal(f.calls.length, 0);
});
