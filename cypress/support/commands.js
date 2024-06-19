import loginPage from "../support/elements/loginPage";
require("cypress-xpath");

Cypress.Commands.add("login", (username, password) => {
   cy.visit(Cypress.config("baseUrl"));
   loginPage.typeUsername(username);
   loginPage.typePassword(password);
   loginPage.clickLogin();
});

Cypress.Commands.add(
   "fillCandidateForm",
   (firstName, middleName, lastName, vacancy, email, contactNumber, resume, keywords = null, notes = null) => {
      // Fill the form
      if (firstName) cy.get("input[name='firstName']").type(firstName);
      if (middleName) cy.get("input[name='middleName']").type(middleName);
      if (lastName) cy.get("input[name='lastName']").type(lastName);

      cy.get(".oxd-select-text--after").click();
      cy.contains(vacancy).click();

      if (email)
         cy.get(
            "body > div:nth-child(3) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > form:nth-child(3) > div:nth-child(3) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > input:nth-child(1)"
         ).type(email);

      if (contactNumber)
         cy.get(
            "body > div:nth-child(3) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > form:nth-child(3) > div:nth-child(3) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > input:nth-child(1)"
         ).type(contactNumber);

      if (keywords) cy.get("input[placeholder='Enter comma seperated words...']").type(keywords);

      if (notes) cy.get("textarea[placeholder='Type here']").type(notes);

      cy.get('input[type="file"]').selectFile(resume, { force: true });

      cy.get("button[type='submit']").click();
   }
);

Cypress.Commands.add("fillScheduleInterviewForm", (title, interviewer, date, isExists = true) => {
   if (title)
      cy.get(
         "body div[id='app'] div[class='oxd-layout'] div[class='oxd-layout-container'] div[class='oxd-layout-context'] div[class='orangehrm-background-container'] div[class='orangehrm-card-container'] form[class='oxd-form'] div:nth-child(2) div:nth-child(1) div:nth-child(1) div:nth-child(1) div:nth-child(2) input:nth-child(1)"
      ).type(title);

   if (interviewer) {
      cy.get("input[placeholder='Type for hints...']").type(interviewer.split(" ")[0]);

      if (isExists) {
         cy.contains(interviewer).click();
      }
   }

   if (date) cy.get("input[placeholder='yyyy-dd-mm']").type(date);

   cy.get("input[placeholder='hh:mm']").click();
   cy.get("button[type='submit']").click(); //Click to save button
});

Cypress.Commands.add("executeToScheduleInterview", (candidate, interviewInfo, isExists = true) => {
   cy.get("a[href='/web/index.php/recruitment/viewRecruitmentModule']").click();
   // Create a candidate
   cy.get("button[class='oxd-button oxd-button--medium oxd-button--secondary']").click();

   cy.fillCandidateForm(
      candidate.firstName,
      candidate.middleName,
      candidate.lastName,
      candidate.vacancy,
      candidate.email,
      candidate.contactNumber,
      candidate.resume
   );

   // Process for approving a candidate
   cy.get("button[class='oxd-button oxd-button--medium oxd-button--success']", { timeout: 30000 }).click(); // Click to shortlist
   cy.get("button[type='submit']", { timeout: 30000 }).click(); // Click to save button
   cy.get("button[class='oxd-button oxd-button--medium oxd-button--success']", { timeout: 30000 }).click(); //Click to schedule interview

   // Fill form
   cy.fillScheduleInterviewForm(interviewInfo.title, interviewInfo.interviewer, interviewInfo.date, isExists);
});
