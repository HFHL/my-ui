import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = { ...loadEnv(mode, process.cwd(), ''), ...process.env };
  const allowedHosts = env.UI_ALLOWED_HOST ? [env.UI_ALLOWED_HOST] : [];
  return {
    plugins: [react()],
    server: { host: '127.0.0.1', port: 5178, strictPort: true, allowedHosts },
    preview: { host: '127.0.0.1', port: 5178, strictPort: true, allowedHosts },
    build: { sourcemap: false },
  };
});
