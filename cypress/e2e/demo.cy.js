import { describe } from "mocha";
import dashboardPage from "../support/elements/dashboardPage";
import loginPage from "../support/elements/loginPage";
import updatepasswordPage from "../support/elements/updatepasswordPage";

const loginUsers = require("../fixtures/loginUsers.json");
const changePassword = require("../fixtures/changePassword.json");
/* 
describe("POM implementation for Dashboard page", () => {
  beforeEach(() => {
    cy.visit(Cypress.config("baseUrl"));
  });

  describe("By using dropdown the user", () => {
    it("should log out", () => {
      cy.login("Admin", "admin123");
      dashboardPage.navigateToUserDropdown();
      cy.get('ul[class="oxd-dropdown-menu"]').children("li").last().click();
      loginPage.elements.loginTitle().should("have.text", "Login");
    });

    it("should display About alert", () => {
      cy.login("Admin", "admin123");
      dashboardPage.navigateToUserDropdown();
      cy.get('ul[class="oxd-dropdown-menu"]').children("li").eq(0).click();

      loginPage.elements.dropdownAboutAlert().should("have.text", "About");
    });

    it("should change password", () => {
      cy.login("Admin", "admin123");
      dashboardPage.navigateToUserDropdown();
      cy.get('ul[class="oxd-dropdown-menu"]').children("li").eq(2).click();

      // Type current & new passwords
      updatepasswordPage.elements.currentPwdField().type("admin123");
      updatepasswordPage.elements.newPwdField().type("NewPassword123!");
      updatepasswordPage.elements.confirmPwdField().type("NewPassword123!");
      updatepasswordPage.elements.submitBtn().click();

      // Verify confirm pop-up - saved successfully
      cy.on("window:alert", (str) => {
        expect(str).to.equal("Success");
      });
    });
  });
});
 */

describe("Test login and change password", () => {
  beforeEach(() => {
    const baseUrl = "https://opensource-demo.orangehrmlive.com/web/index.php/auth/login";
    cy.visit(baseUrl);
  });
  
  describe("Test login in many cases", () => {
    loginUsers.forEach(user => {
      it(user.name, () => {
        cy.login(user.username, user.password);
        if(user.access) dashboardPage.elements.dashboardSpan().should("have.text", "Dashboard");
        else if (user.expected=="Invalid credentials")loginPage.elements.errorMsg().should("have.text", "Invalid credentials");
        else if (user.expected=="Required") loginPage.elements.emptyUsernameFieldMsg().should("have.text", "Required") || loginPage.elements.emptyPasswordFieldMsg().should("have.text", "Required"); 
        else if (user.expected == "RequiredRequired") loginPage.elements.emptyUsernameFieldMsg().should("have.text", "RequiredRequired") && loginPage.elements.emptyPasswordFieldMsg().should("have.text", "RequiredRequired");
      });
    });
  });

  describe("Test change password", () => {
    changePassword.forEach((test) => {
      it(test.name, () => {
        cy.login("Admin", "admin123");
        dashboardPage.navigateToChangePasswordPage();

        updatepasswordPage.typeCurrentPassword(test.currentPassword);
        updatepasswordPage.typeNewPassword(test.newPassword);
        updatepasswordPage.typeConfirmPassword(test.confirmPassword);
        
        if (test.submit && test.alert) {
          updatepasswordPage.clickSubmit();
          cy.on("window:alert", (str) => {
            expect(str).to.equal(test.expected);
          });
        }
        else if (test.submit && !test.alert) {
          updatepasswordPage.clickSubmit();
          updatepasswordPage.elements.FieldMsg().should("have.text", test.expected);
        }
        else if (!test.submit) {
          updatepasswordPage.elements.FieldMsg().should("have.text", test.expected);
        }
      });
    });
  });

});