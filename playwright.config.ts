import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: './tests/browser',
  // Visual checks are opt-in; the default suite checks DOM and events only.
  testIgnore: process.env.UI_VISUAL_CHECK === '1' ? [] : ['**/catalog.spec.ts'],
  use: {
    baseURL: process.env.UI_TEST_URL ?? 'http://127.0.0.1:5178',
    viewport: { width: 1440, height: 1080 }, browserName: 'chromium', channel: 'chromium',
    launchOptions: process.env.UI_TEST_RESOLVE_IP && process.env.UI_TEST_URL ? {
      args: [`--host-resolver-rules=MAP ${new URL(process.env.UI_TEST_URL).hostname} ${process.env.UI_TEST_RESOLVE_IP}`],
    } : undefined,
  },
  workers: 1,
  reporter: 'list',
});
