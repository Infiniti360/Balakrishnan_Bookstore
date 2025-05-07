import type { Options } from '@wdio/types';
import { testConfig } from './test/config/test.config';

export const config: Options.Testrunner = {
    runner: 'local',
    autoCompileOpts: {
        autoCompile: true,
        tsNodeOpts: {
            project: './tsconfig.json',
            transpileOnly: true
        }
    },
    specs: [
        './test/**/*.test.ts'
    ],
    exclude: [],
    maxInstances: 1,
    capabilities: [{
        platformName: 'Android',
        'appium:automationName': 'UiAutomator2',
        'appium:deviceName': 'Android Emulator',
        'appium:appPackage': 'host.exp.exponent',
        'appium:appActivity': 'host.exp.exponent.MainActivity',
        'appium:noReset': true,
        'appium:newCommandTimeout': 60,
        'appium:autoGrantPermissions': true,
        'appium:systemPort': 8200,
        'appium:skipDeviceInitialization': true,
        'appium:skipServerInstallation': true,
        'appium:disableWindowAnimation': true
    }],
    logLevel: 'info',
    bail: 0,
    baseUrl: 'exp://192.168.1.6:19000',
    waitforTimeout: 10000,
    connectionRetryTimeout: 120000,
    connectionRetryCount: 3,
    services: ['appium'],
    framework: 'mocha',
    reporters: ['spec'],
    mochaOpts: {
        ui: 'bdd',
        timeout: 60000
    }
}; 