import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: 1,
  reporter: 'html',
  use: {
    /* Base URL — use local server to avoid CORS issues with ES Modules */
    baseURL: 'http://localhost:3000',

    /* Record video for visual verification */
    video: 'on',

    /* Screenshot on failure */
    screenshot: 'on',

    /* Collect trace */
    trace: 'on',

    /* Viewport size */
    viewport: { width: 1440, height: 900 },
  },

  /* Run your local dev server before starting the tests */
  webServer: {
    command: 'npm run serve',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
