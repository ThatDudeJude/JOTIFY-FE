const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: "http://localhost:3000",
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
  retries: {
    openMode: 2, 
    runMode: 2
  }, 
  chromeWebSecurity: false,
});
