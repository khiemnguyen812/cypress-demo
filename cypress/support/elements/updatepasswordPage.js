class updatePasswordPage {
  elements = {
    currentPwdField: () =>
      cy.get(
        ":nth-child(1) > .oxd-grid-2 > :nth-child(2) > .oxd-input-group > :nth-child(2) > .oxd-input"
      ),
    newPwdField: () =>
      cy.get(
        ".user-password-cell > .oxd-input-group > :nth-child(2) > .oxd-input"
      ),
    confirmPwdField: () =>
      cy.get(
        ".user-password-row > .oxd-grid-2 > :nth-child(2) > .oxd-input-group > :nth-child(2) > .oxd-input"
      ),
    submitBtn: () => cy.contains("Save"),
    alertTxt: () => cy.get('[class="screenshot-helper-pixels"]'),
    FieldMsg: () => cy.get(".oxd-input-group > .oxd-text")
  };

  typeCurrentPassword(currentPassword) {
    if (currentPassword) {
      this.elements.currentPwdField().type(currentPassword);
    }
  }

  typeNewPassword(newPassword) {
    if (newPassword) {
      this.elements.newPwdField().type(newPassword);
    }
  }

  typeConfirmPassword(confirmPassword) {
    if (confirmPassword) {
      this.elements.confirmPwdField().type(confirmPassword);
    }
  }

  clickSubmit() {
    this.elements.submitBtn().click();
  }
}

module.exports = new updatePasswordPage();