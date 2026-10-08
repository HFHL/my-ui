import { validateLibrary } from './library.mjs';
try { const items = await validateLibrary(process.cwd()); console.log(`组件登记、元数据与相对导入检查通过：${items.length} 个组件。`); }
catch (error) { console.error(error.message); process.exitCode = 1; }
