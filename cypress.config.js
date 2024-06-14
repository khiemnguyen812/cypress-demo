const { defineConfig } = require("cypress");
const cucumber = require("cypress-cucumber-preprocessor").default;

module.exports = defineConfig({
  reporter: "cypress-mochawesome-reporter",
  e2e: {
    baseUrl:
      "https://opensource-demo.orangehrmlive.com/web/index.php/auth/login",
      defaultCommandTimeout: 15000,
      // testIsolation: false,
  },

});
