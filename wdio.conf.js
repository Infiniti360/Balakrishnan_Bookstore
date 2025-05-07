exports.config = {
  specs: [
    './test/**/*.e2e.js'
  ],
  exclude: [],
  maxInstances: 10,
  capabilities: [{
    maxInstances: 5,
    browserName: 'chrome',
    acceptInsecureCerts: true,
    'goog:chromeOptions': {
      args: ['--headless', '--disable-gpu']
    }
  }],
  logLevel: 'info',
  bail: 0,
  baseUrl: 'http://localhost',
  waitforTimeout: 10000,
  connectionRetryTimeout: 120000,
  connectionRetryCount: 3,
  services: ['appium'],
  framework: 'mocha',
  reporters: ['spec'],
  mochaOpts: {
    ui: 'bdd',
    timeout: 60000
  },
  appium: {
    command: 'appium',
    args: {
      address: '127.0.0.1',
      port: 4723,
      log: './appium.log'
    }
  }
}; 