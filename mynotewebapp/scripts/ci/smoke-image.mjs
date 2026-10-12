import { execFileSync } from 'node:child_process';
import { setTimeout as delay } from 'node:timers/promises';
import assert from 'node:assert/strict';
import { smoke } from './smoke-http.mjs';

const [image, revision = 'local', platform] = process.argv.slice(2);
assert.ok(image, 'usage: smoke-image.mjs IMAGE REVISION [PLATFORM]');
const docker = (...args) => execFileSync('docker', args, { encoding: 'utf8', timeout: 120_000 }).trim();
const name = `fe-smoke-${process.pid}-${Date.now()}`;
const arch = platform ? ['--platform', platform] : [];
try {
  docker('network', 'create', name);
  docker('run', '-d', '--name', `${name}-api`, '--network', name, '--network-alias', 'mock-api',
    'node:22-alpine', 'node', '-e', `require('http').createServer((req,res)=>{res.writeHead(401,{'Content-Type':'application/json','Set-Cookie':'rotation_secret=mock; Path=/'});res.end(JSON.stringify({method:req.method,url:req.url}))}).listen(8081,'0.0.0.0')`);
  docker('run', '-d', ...arch, '--name', name, '--network', name,
    '-e', 'API_UPSTREAM=http://mock-api:8081', '-p', '127.0.0.1::80', image);
  const port = docker('port', name, '80/tcp').split(':').at(-1);
  let result;
  for (let attempt = 0; attempt < 30; attempt++) {
    try { result = await smoke(`http://127.0.0.1:${port}`, revision, { mock: true }); break; }
    catch (error) { if (attempt === 29) throw error; await delay(1_000); }
  }
  console.log(JSON.stringify({ image, platform, ...result }));
  const exit = docker('run', ...arch, '--name', `${name}-invalid`, '-d', image);
  assert.ok(exit);
  assert.notEqual(docker('wait', `${name}-invalid`), '0', 'missing API_UPSTREAM must fail');
} finally {
  for (const container of [name, `${name}-api`, `${name}-invalid`]) {
    try { docker('rm', '-f', container); } catch { /* Already absent. */ }
  }
  try { docker('network', 'rm', name); } catch { /* Already absent. */ }
}
