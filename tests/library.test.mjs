import assert from 'node:assert/strict';
import { test } from 'node:test';
import { mkdtemp, mkdir, cp, readFile, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { componentId, validateLibrary } from '../scripts/library.mjs';

const repo = fileURLToPath(new URL('../', import.meta.url));
async function fixture(fn) {
  const root = await mkdtemp(path.join(os.tmpdir(), 'my-ui-test-'));
  try { await cp(path.join(repo, 'components'), path.join(root, 'components'), { recursive: true }); await fn(root); }
  finally { await rm(root, { recursive: true, force: true }); }
}
const run = (file, args, root) => spawnSync(process.execPath, [path.join(repo, 'scripts', file), ...args], { cwd: root, encoding: 'utf8' });

test('编号自然扩展并跳过所有已分配编号，包括注销编号', async () => fixture(async root => {
  assert.equal(componentId(1000), 'C1000');
  const ledger = JSON.parse(await readFile(path.join(root, 'components/ids.json'), 'utf8'));
  ledger.allocated.push('C999'); ledger.retired.push('C999');
  await writeFile(path.join(root, 'components/ids.json'), JSON.stringify(ledger));
  const result = run('new-component.mjs', ['新卡片', '数据展示'], root);
  assert.equal(result.status, 0, result.stderr);
  assert.equal(JSON.parse(await readFile(path.join(root, 'components/C1000/meta.json'), 'utf8')).name, '新卡片');
  await validateLibrary(root);
}));
test('创建原型复制组件，修改原库不会影响副本，重复创建被拒绝', async () => fixture(async root => {
  const result = run('new-prototype.mjs', ['sample', 'C001', 'C002'], root);
  assert.equal(result.status, 0, result.stderr);
  const copied = path.join(root, 'prototypes/sample/components/C001/index.tsx');
  const before = await readFile(copied, 'utf8');
  await writeFile(path.join(root, 'components/C001/index.tsx'), 'export default function Changed() { return null; }');
  assert.equal(await readFile(copied, 'utf8'), before);
  assert.notEqual(run('new-prototype.mjs', ['sample', 'C001'], root).status, 0);
}));
test('拒绝组件目录外的相对导入和重复编号', async () => fixture(async root => {
  await writeFile(path.join(root, 'components/C001/index.tsx'), "import Other from '../C002'; export default Other;");
  await assert.rejects(validateLibrary(root), /目录外/);
  const ledger = JSON.parse(await readFile(path.join(root, 'components/ids.json'), 'utf8'));
  ledger.allocated.push('C001');
  await writeFile(path.join(root, 'components/ids.json'), JSON.stringify(ledger));
  await assert.rejects(validateLibrary(root), /重复/);
}));
test('拒绝无效原型名称、不存在的组件，保留其他写入者的锁', async () => fixture(async root => {
  assert.notEqual(run('new-prototype.mjs', ['../escape', 'C001'], root).status, 0);
  assert.notEqual(run('new-prototype.mjs', ['sample', 'C777'], root).status, 0);
  await mkdir(path.join(root, 'prototypes/.sample.lock'), { recursive: true });
  assert.notEqual(run('new-prototype.mjs', ['sample', 'C001'], root).status, 0);
  await writeFile(path.join(root, 'prototypes/.sample.lock/owner'), 'other writer');
}));
