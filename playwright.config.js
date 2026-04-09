import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './test-e2e',
  timeout: 30000,
  fullyParallel: true,
  retries: 0,
  reporter: 'list',
  use: {
    baseURL: 'http://localhost:4174',
    trace: 'on-first-retry',
  },
})