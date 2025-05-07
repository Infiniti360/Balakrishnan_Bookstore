import { defineConfig, devices } from '@playwright/test';
import { testConfig } from './test/config/test.config';

export default defineConfig({
    testDir: './test',
    timeout: testConfig.timeout,
    retries: testConfig.retries,
    use: {
        viewport: { width: 360, height: 640 },
        deviceScaleFactor: 2,
        isMobile: true,
        hasTouch: true,
    },
    projects: [
        {
            name: 'android',
            use: {
                ...devices['Pixel 5'],
                connectOptions: {
                    wsEndpoint: `http://${testConfig.appium.host}:${testConfig.appium.port}/wd/hub`,
                },
                launchOptions: {
                    args: ['--remote-debugging-port=9222'],
                },
                userAgent: 'Mozilla/5.0 (Linux; Android 11; Pixel 5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.91 Mobile Safari/537.36',
            },
        },
    ],
    reporter: [
        ['html'],
        ['list']
    ],
}); 