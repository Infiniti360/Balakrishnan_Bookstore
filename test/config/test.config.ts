import { devices } from '@playwright/test';

export const testConfig = {
    // Base URL for the app
    baseURL: 'exp://192.168.1.6:19000',

    // Appium configuration
    appium: {
        host: '127.0.0.1',
        port: 4723,
        path: '/wd/hub',
        capabilities: {
            platformName: 'Android',
            automationName: 'UiAutomator2',
            deviceName: 'Android Emulator',
            appPackage: 'host.exp.exponent',
            appActivity: 'host.exp.exponent.MainActivity',
            noReset: true,
            newCommandTimeout: 60,
            autoGrantPermissions: true,
            systemPort: 8200,
            // Add these capabilities for better stability
            skipDeviceInitialization: true,
            skipServerInstallation: true,
            disableWindowAnimation: true
        }
    },

    // Test timeout
    timeout: 30000,

    // Retry failed tests
    retries: 2,

    // Test data
    testData: {
        validUser: {
            email: 'test@example.com',
            password: 'password123'
        },
        newBook: {
            name: 'Test Book',
            author: 'Test Author',
            published_year: 2024,
            book_summary: 'This is a test book summary'
        }
    },

    // Accessibility IDs for elements
    testIDs: {
        // Login screen
        emailInput: '~email-input',
        passwordInput: '~password-input',
        loginButton: '~login-button',
        errorText: '~errorText',
        loginScreen: '~loginScreen',

        // Book list screen
        bookList: '~bookList',
        addBookButton: '~addBook',
        bookItem: '~bookItem',
        logoutButton: '~logout',

        // Book form
        titleInput: '~title',
        authorInput: '~author',
        yearInput: '~year',
        summaryInput: '~summary',
        saveButton: '~save',
        deleteButton: '~delete',
        confirmButton: '~confirm'
    }
}; 