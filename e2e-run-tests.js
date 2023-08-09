const cypress = require('cypress');

cypress.run({
    spec: './cypress/e2e/**.cy.jsx',    
    config: {
        video: false
    }
})