import test from 'node:test';
import assert from 'node:assert/strict';
import { deploy, target } from '../scripts/ci/deploy.mjs';

const image = `ghcr.io/nntn32/notesweb-fe@sha256:${'a'.repeat(64)}`;
const previousImage = `ghcr.io/nntn32/notesweb-fe@sha256:${'c'.repeat(64)}`;
const revision = 'b'.repeat(40);
const config = { appToken: 'test-only', image, revision, previousImage };

function fixture({ status = 101, smokes = [], served = 'd'.repeat(40) } = {}) {
  const posts = [], records = [];
  let probe = 0;
  return { posts, records, deps: {
    attempts: 3, pause: async () => {}, checkpoint: r => records.push(structuredClone(r)),
    smokeCheck: async (url, expected) => {
      assert.equal(url, target.publicUrl);
      if ((smokes[probe++] ?? 'ok') === 'fail') throw new Error('Wrong revision');
      return expected;
    },
    fetcher: async (url, options) => {
      if (url.pathname === '/version.json') return { status: 200, json: async () => ({ revision: served }) };
      posts.push({ url: String(url), headers: options.headers, body: JSON.parse(options.body) });
      return { ok: true, status: 200, json: async () => ({ status }) };
    },
  } };
}
const deployed = post => JSON.parse(post.body.captainDefinitionContent).imageName;

test('deploy sends the digest with the app token to the fixed app and observes smoke for 120 seconds', async () => {
  const f = fixture();
  const result = await deploy(config, f.deps);
  assert.equal(result.status, 'passed');
  assert.equal(result.observedSeconds, 120);
  assert.equal(f.posts.length, 1);
  assert.equal(f.posts[0].url, `${target.captain}/api/v2/user/apps/appData/notesweb-fe?detached=1`);
  assert.equal(f.posts[0].headers['x-captain-app-token'], 'test-only');
  assert.equal(deployed(f.posts[0]), image);
  assert.ok(!JSON.stringify(f.records).includes('test-only'));
});
test('wrong live revision fails and rolls back to the previous digest', async () => {
  const f = fixture({ smokes: ['fail', 'fail', 'fail'] });
  await assert.rejects(deploy(config, f.deps), /rollback passed/);
  assert.deepEqual(f.posts.map(deployed), [image, previousImage]);
  assert.equal(f.records.at(-1).status, 'failed');
});
test('rollback that still serves the failed revision needs manual recovery', async () => {
  const f = fixture({ smokes: ['fail', 'fail', 'fail'], served: revision });
  await assert.rejects(deploy(config, f.deps), /manual_required/);
});
test('rejected deploy records only the CapRover status', async () => {
  const f = fixture({ status: 1106 });
  await assert.rejects(deploy({ ...config, previousImage: undefined }, f.deps), /no_previous_release/);
  assert.equal(f.records.at(-1).failure, 'CapRover deploy status 1106');
});
test('mutable or foreign images are rejected before network access', async () => {
  for (const bad of ['ghcr.io/nntn32/notesweb-fe:latest', `nntn/notesweb-fe@sha256:${'a'.repeat(64)}`]) {
    const f = fixture();
    await assert.rejects(deploy({ ...config, image: bad }, f.deps));
    assert.equal(f.posts.length, 0);
  }
});
