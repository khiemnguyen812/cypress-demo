import loginPage from "../support/elements/loginPage";
require('cypress-xpath');

Cypress.Commands.add('login', (username, password) => {
    cy.visit(Cypress.config("baseUrl"));
    loginPage.typeUsername(username);
    loginPage.typePassword(password);
    loginPage.clickLogin();
  });