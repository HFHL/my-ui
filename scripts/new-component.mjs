import { mkdir, open, rename, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { componentFolders, componentId, readJson, today, validateLibrary } from './library.mjs';

const root = process.cwd();
const [name, category = '未分类'] = process.argv.slice(2);
let lock;
let temporary;
try {
  if (!name?.trim()) throw new Error('用法：npm run component:new -- "组件名称" "分类"');
  const lockPath = path.join(root, 'components/.allocation.lock');
  lock = await open(lockPath, 'wx');
  await validateLibrary(root);
  const ledgerPath = path.join(root, 'components/ids.json');
  const ledger = await readJson(ledgerPath);
  const used = [...ledger.allocated, ...await componentFolders(root)];
  const id = componentId(Math.max(0, ...used.map(value => Number(value.slice(1)))) + 1);
  // Reserve first: interrupted creation must never reuse an assigned ID.
  ledger.allocated.push(id);
  await writeFile(ledgerPath + '.tmp', JSON.stringify(ledger, null, 2) + '\n');
  await rename(ledgerPath + '.tmp', ledgerPath);
  temporary = path.join(root, 'components', `.${id}-${process.pid}`);
  await mkdir(temporary);
  const meta = { id, name, category, tags: [], description: `${name}的独立组件示例。`, createdAt: today(), source: '待填写来源', license: '待确认许可' };
  await writeFile(path.join(temporary, 'meta.json'), JSON.stringify(meta, null, 2) + '\n');
  await writeFile(path.join(temporary, 'index.tsx'), `import styles from './styles.module.css';\nexport default function Component() {\n  return <div className={styles.root}>${name.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('{', '&#123;').replaceAll('}', '&#125;')}</div>;\n}\n`);
  await writeFile(path.join(temporary, 'Preview.tsx'), "import Component from './index';\nexport default function Preview() { return <Component />; }\n");
  await writeFile(path.join(temporary, 'styles.module.css'), '.root { padding: 24px; border: 1px solid #dce5df; border-radius: 8px; color: #28573d; }\n');
  await rename(temporary, path.join(root, 'components', id));
  temporary = undefined;
  console.log(`已创建 ${id}：components/${id}/。填写实现、来源和许可后即可浏览。`);
} catch (error) { console.error(error.code === 'EEXIST' ? '编号分配正在进行；若上次中断，请先核对 components/.allocation.lock。' : error.message); process.exitCode = 1; }
finally {
  if (temporary) await rm(temporary, { recursive: true, force: true });
  if (lock) { await lock.close(); await rm(path.join(root, 'components/.allocation.lock')); }
}
