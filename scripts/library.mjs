import { readFile, readdir, stat } from 'node:fs/promises';
import path from 'node:path';

export const readJson = async file => JSON.parse(await readFile(file, 'utf8'));
export const componentId = number => `C${String(number).padStart(3, '0')}`;
export const today = () => new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Shanghai', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
export async function componentFolders(root) {
  return (await readdir(path.join(root, 'components'), { withFileTypes: true })).filter(entry => entry.isDirectory() && /^C\d{3,}$/.test(entry.name)).map(entry => entry.name);
}

export async function validateLibrary(root) {
  const ledger = await readJson(path.join(root, 'components/ids.json'));
  if (!Array.isArray(ledger.allocated) || !Array.isArray(ledger.retired)) throw new Error('编号登记格式无效');
  if (new Set(ledger.allocated).size !== ledger.allocated.length || new Set(ledger.retired).size !== ledger.retired.length) throw new Error('编号登记存在重复');
  for (const id of ledger.allocated) if (!/^C\d{3,}$/.test(id) || componentId(Number(id.slice(1))) !== id || Number(id.slice(1)) < 1) throw new Error(`无效编号：${id}`);
  for (const id of ledger.retired) if (!ledger.allocated.includes(id)) throw new Error(`注销编号未分配：${id}`);
  const folders = await componentFolders(root);
  for (const id of folders) {
    if (!ledger.allocated.includes(id) || ledger.retired.includes(id)) throw new Error(`组件编号未登记或已注销：${id}`);
    const dir = path.join(root, 'components', id);
    const meta = await readJson(path.join(dir, 'meta.json'));
    if (meta.id !== id) throw new Error(`目录与编号不一致：${id}`);
    for (const field of ['name', 'category', 'description', 'createdAt', 'source', 'license']) if (typeof meta[field] !== 'string' || !meta[field].trim()) throw new Error(`${id} 缺少 ${field}`);
    if (!Array.isArray(meta.tags) || !meta.tags.every(tag => typeof tag === 'string' && tag.trim())) throw new Error(`${id} 标签格式无效`);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(meta.createdAt)) throw new Error(`${id} 日期格式无效`);
    await stat(path.join(dir, 'index.tsx'));
    await stat(path.join(dir, 'Preview.tsx'));
    for (const file of await readdir(dir, { recursive: true })) {
      if (!/\.(tsx?|jsx?|css)$/.test(file)) continue;
      const filename = path.join(dir, file);
      const source = await readFile(filename, 'utf8');
      const relativeImports = source.matchAll(/(?:from\s*|import\s*\(\s*|import\s*|@import\s*)['"](\.[^'"]+)['"]/g);
      for (const match of relativeImports) {
        const target = path.resolve(path.dirname(filename), match[1]);
        if (target !== dir && !target.startsWith(dir + path.sep)) throw new Error(`${id} 引用了组件目录外的文件：${match[1]}`);
      }
    }
  }
  return folders;
}
