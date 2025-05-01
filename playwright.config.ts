import { PlaywrightTestConfig } from '@playwright/test';

const config: PlaywrightTestConfig = {
    testDir: './src/tests',
    timeout: 30000,
    retries: 1,
    workers: 1,
    reporter: [
        ['list'],
        ['html', { outputFolder: 'test-results' }]
    ],
    use: {
        baseURL: 'http://localhost:8000',
        extraHTTPHeaders: {
            'Content-Type': 'application/json',
        },
        trace: 'on-first-retry',
    },
    projects: [
        {
            name: 'Health Checks',
            testMatch: '**/health.test.ts',
        },
        {
            name: 'API Tests',
            testMatch: '**/*.api.test.ts',
        },
    ],
};

export default config; 