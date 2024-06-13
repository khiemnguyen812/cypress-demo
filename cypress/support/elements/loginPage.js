
class loginPage {
  elements = {
    loginTitle: () => cy.get(".orangehrm-login-title"),
    usernameInput: () => cy.get('input[name="username"]'),
    passwordInput: () => cy.get('input[name="password"]'),
    loginBtn: () => cy.get('button[type="submit"]'),
    errorMsg: () => cy.get('div[role="alert"]'),
    emptyUsernameFieldMsg: () => cy.get(".oxd-input-group > .oxd-text"),
    emptyPasswordFieldMsg: () => cy.get(".oxd-input-group > .oxd-text"),
    forgotPasswordBtn: () => cy.contains("Forgot your password?"),
    dropdownAboutAlert: () => cy.get(".orangehrm-modal-header > .oxd-text"),
  };

  typeUsername(username) {
    if (username) {
      this.elements.usernameInput().type(username);
    }
  }
  
  typePassword(password) {
    if (password) {
      this.elements.passwordInput().type(password);
    }
  }
  
  clickLogin() {
    this.elements.loginBtn().click();
  }

  clickForgotPasswordBtn() {
    this.elements.forgotPasswordBtn().click();
  }

  
}

module.exports = new loginPage();
