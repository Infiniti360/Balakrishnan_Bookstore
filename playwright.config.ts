import { PlaywrightTestConfig } from '@playwright/test';

const config: PlaywrightTestConfig = {
    testDir: './src/tests',
    timeout: 60000,
    retries: 2,
    workers: 1,
    reporter: [
        ['list'],
        ['html', {
            outputFolder: 'test-results',
            port: 58763  // Set a specific port for the HTML reporter
        }]
    ],
    use: {
        baseURL: 'http://localhost:8000',
        extraHTTPHeaders: {
            'Content-Type': 'application/json',
        },
        trace: 'on-first-retry',
        ignoreHTTPSErrors: true,
    },
    projects: [
        {
            name: 'Health Checks',
            testMatch: '**/health.test.ts',
            timeout: 120000,
        },
        {
            name: 'API Tests',
            testMatch: '**/*.api.test.ts',
        },
    ],
};

export default config; 