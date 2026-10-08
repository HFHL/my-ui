import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readFile, stat } from 'node:fs/promises';
import { defaultItems, filterNavigation } from '../components/C008/model.ts';

test('侧栏按多关键词过滤、忽略大小写，保留源顺序且不修改原数据', () => {
  assert.deepEqual(filterNavigation(defaultItems, '  DASH  ' ).map(item => item.id), ['dashboard']);
  assert.deepEqual(filterNavigation(defaultItems, 'ANALYTICS analytics').map(item => item.id), ['analytics']);
  assert.deepEqual(filterNavigation(defaultItems, 'dashboard inventory'), []);
  assert.equal(filterNavigation(defaultItems, '').length, 5);
  assert.deepEqual(defaultItems.map(item => item.id), ['dashboard', 'revenue', 'notifications', 'analytics', 'inventory']);
});

test('侧栏所有本地资产非空，代码不依赖临时 Figma URL', async () => {
  const source = await readFile(new URL('../components/C008/assets.ts', import.meta.url), 'utf8');
  const imports = [...source.matchAll(/from ['"]\.\/assets\/([^'"]+)['"]/g)];
  assert.equal(imports.length, 20);
  for (const [, filename] of imports) {
    assert.ok((await stat(new URL(`../components/C008/assets/${filename}`, import.meta.url))).size > 0, filename);
  }
  assert.ok(!source.includes('figma.com/api/mcp/asset'));
});
