const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    // baseUrl: "http://localhost:3000",
    baseUrl: `${process.env.REACT_APP_API_BASE_URL}`, 
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    experimentalRunAllSpecs: true
  },
  retries: {
    openMode: 2, 
    runMode: 2
  }, 
  chromeWebSecurity: false,
});
