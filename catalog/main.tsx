import { createRoot } from 'react-dom/client';
import { StrictMode } from 'react';

async function boot() {
  const isPreview = new URLSearchParams(location.search).has('preview');
  const { default: App } = isPreview ? await import('./PreviewPage') : await import('./App');
  createRoot(document.getElementById('root')!).render(<StrictMode><App /></StrictMode>);
}

boot().catch(() => {
  document.getElementById('root')!.textContent = '页面加载失败，请刷新后重试。';
});
