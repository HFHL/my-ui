import { cp, mkdir, rename, rm, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { today, validateLibrary } from './library.mjs';

const [slug, ...requested] = process.argv.slice(2);
const root = process.cwd();
let temporary;
let lock;
try {
  const namedSlug = slug && /^[a-z][a-z0-9-]{0,63}$/.test(slug);
  const numberedSlug = slug && /^P(?:\d{3}|[1-9]\d{3,})$/.test(slug) && Number(slug.slice(1)) > 0;
  if ((!namedSlug && !numberedSlug) || !requested.length) throw new Error('用法：npm run prototype:new -- P001 C008（也支持小写字母、数字和连字符的项目名）');
  const ids = [...new Set(requested)];
  const available = await validateLibrary(root);
  for (const id of ids) if (!available.includes(id)) throw new Error(`组件不存在：${id}`);
  const target = path.join(root, 'prototypes', slug);
  try { await stat(target); throw new Error(`原型已存在：${slug}`); } catch (error) { if (error.code !== 'ENOENT') throw error; }
  await mkdir(path.join(root, 'prototypes'), { recursive: true });
  const lockPath = path.join(root, 'prototypes', `.${slug}.lock`);
  await mkdir(lockPath); // One writer per prototype slug.
  lock = lockPath;
  try { await stat(target); throw new Error(`原型已存在：${slug}`); } catch (error) { if (error.code !== 'ENOENT') throw error; }
  temporary = path.join(root, 'prototypes', `.${slug}-${process.pid}`);
  await mkdir(path.join(temporary, 'components'), { recursive: true });
  for (const id of ids) await cp(path.join(root, 'components', id), path.join(temporary, 'components', id), { recursive: true });
  const meta = { slug, name: slug, description: '从收藏库复制的独立原型，可在 App.tsx 中继续组装。', createdAt: today(), components: ids.map(id => ({ id, copiedAt: today(), source: `components/${id}/`, modified: false })) };
  await writeFile(path.join(temporary, 'meta.json'), JSON.stringify(meta, null, 2) + '\n');
  const imports = ids.map(id => `import ${id} from './components/${id}/Preview';`).join('\n');
  const body = ids.map(id => `<section style={{ padding: 24, background: '#fff', borderRadius: 12 }}><p style={{ fontSize: 12, color: '#68786c' }}>${id}</p><${id} /></section>`).join('\n');
  await writeFile(path.join(temporary, 'App.tsx'), `${imports}\nexport default function App() { return <main style={{ minHeight: '100dvh', background: '#f4f7f5', padding: 32 }}><h1>${slug}</h1><div style={{ display: 'grid', gap: 24 }}>${body}</div></main>; }\n`);
  await rename(temporary, target);
  temporary = undefined;
  console.log(`已创建 prototypes/${slug}/；组件已复制，收藏库更新不会改变它。`);
} catch (error) { console.error(error.message); process.exitCode = 1; }
finally {
  if (temporary) await rm(temporary, { recursive: true, force: true });
  if (lock) await rm(lock, { recursive: true, force: true });
}
