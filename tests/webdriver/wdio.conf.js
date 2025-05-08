exports.config = {
    runner: 'local',
    specs: [
        './specs/**/*.js'
    ],
    exclude: [],
    maxInstances: 1,
    capabilities: [{
        browserName: 'chrome',
        'goog:chromeOptions': {
            args: ['--headless', '--disable-gpu', '--window-size=1280,800']
        }
    }],
    logLevel: 'info',
    bail: 0,
    baseUrl: 'http://localhost:3000',
    waitforTimeout: 10000,
    connectionRetryTimeout: 120000,
    connectionRetryCount: 3,
    services: ['chromedriver'],
    framework: 'mocha',
    reporters: ['spec'],
    mochaOpts: {
        ui: 'bdd',
        timeout: 60000
    },
    
    // Hooks
    before: function (capabilities, specs) {
        // Add commands or setup steps here
    },
    beforeTest: function (test, context) {
        // Pre-test setup
    },
    afterTest: function(test, context, { error, result, duration, passed, retries }) {
        // Post-test cleanup
    }
}; 