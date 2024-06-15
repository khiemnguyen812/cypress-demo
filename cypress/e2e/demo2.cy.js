// Before each run:
//    Change vacancy and jobTitle and idEmployee in orangehrmdata.json
// Cause it cannot create duplicate vacancy and jobtitle

describe("Recruit employee workflow", () => {
   let data;

   before("Read data", () => {
      cy.fixture("orangehrmdata.json").then((fileData) => {
         data = fileData;
      });
   });

   beforeEach("Precondition - Login", () => {
      cy.clearCookies();
      cy.viewport(1920, 1080);

      cy.visit("https://opensource-demo.orangehrmlive.com");

      // Login
      cy.get("input[name='username']", { timeout: 30000 }).type(data.username);
      cy.get("input[name='password']", { timeout: 30000 }).type(data.password);
      cy.get("button[type='submit']").click();

      // Check login success
      cy.url().should("eq", "https://opensource-demo.orangehrmlive.com/web/index.php/dashboard/index");
   });

   before("Env - using english and open all module", () => {
      cy.visit("https://opensource-demo.orangehrmlive.com");

      // Login
      cy.get("input[name='username']", { timeout: 30000 }).type(data.username);
      cy.get("input[name='password']", { timeout: 30000 }).type(data.password);
      cy.get("button[type='submit']").click();

      // Check login success
      cy.url().should("eq", "https://opensource-demo.orangehrmlive.com/web/index.php/dashboard/index");

      cy.viewport(1920, 1080);
      cy.get("a[href='/web/index.php/admin/viewAdminModule']").click();
      cy.get("nav[aria-label='Topbar Menu'] > ul > li:nth-child(7)").click();
      cy.get("ul[class='oxd-dropdown-menu'] > li:nth-child(3)").click();
      cy.get(
         "form > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1)"
      ).click();
      cy.contains("English (United States)").click();
      cy.get(
         "form > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1)"
      ).click();
      cy.contains("yyyy-dd-mm").click();

      cy.get("button[type='submit']").click();

      // Validation
      cy.contains("Localization").should("be.visible");

      //Set module
      cy.visit("https://opensource-demo.orangehrmlive.com/web/index.php/admin/viewModules");
      cy.get('input[type="checkbox"]').each(($el) => {
         cy.wrap($el).check({ force: true }); // Wrap and check, force if needed
       });
      cy.get("button[type='submit']").click();

      //Validation
      cy.contains("Success").should("be.visible");
   });

   before("Precondition - create a employee", () => {
      // Read orangehrmLoginAccount to get username/password
      cy.get(
         "body > div:nth-child(3) > div:nth-child(1) > div:nth-child(1) > aside:nth-child(1) > nav:nth-child(1) > div:nth-child(2) > ul:nth-child(2) > li:nth-child(2) > a:nth-child(1)"
      ).click();

      cy.get("button[class='oxd-button oxd-button--medium oxd-button--secondary']").click();

      cy.get("input[name='firstName']").type(data.firstNameEmployee);
      cy.get("input[name='middleName']").type(data.middleNameEmployee);
      cy.get("input[name='lastName']").type(data.lastNameEmployee);
      cy.get("div[class='oxd-input-group oxd-input-field-bottom-space'] div input[class='oxd-input oxd-input--active']").type(data.idEmployee)

      cy.get("button[type='submit']").click();

      // Validate
      cy.contains("Personal Details").should("be.visible");
   });

   before("Precondition - create a job title", () => {
      cy.visit("https://opensource-demo.orangehrmlive.com/web/index.php/admin/viewJobTitleList");
      cy.get("button[class='oxd-button oxd-button--medium oxd-button--secondary']").click();
      cy.get(
         "div[class='oxd-input-group oxd-input-field-bottom-space'] div input[class='oxd-input oxd-input--active']"
      ).type(data.jobTitle);
      cy.get("button[type='submit']").click();

      // Validate
      cy.contains("Success").should("be.visible");
   });

   before("Precondition - create a vacancies", () => {
      cy.get(
         "body > div:nth-child(3) > div:nth-child(1) > div:nth-child(1) > aside:nth-child(1) > nav:nth-child(1) > div:nth-child(2) > ul:nth-child(2) > li:nth-child(5) > a:nth-child(1) > span:nth-child(2)"
      ).click();

      cy.contains("Vacancies").click();
      cy.get("button[class='oxd-button oxd-button--medium oxd-button--secondary']").click();

      cy.get(
         "body > div:nth-child(3) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > form:nth-child(3) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > input:nth-child(1)"
      ).type(data.vacancy);

      cy.get(".oxd-select-text--after").click();
      cy.contains("Testing manager").click();
      cy.get("input[placeholder='Type for hints...']").type(data.firstNameEmployee);
      cy.contains("Dinh Van Luong").click();

      cy.get("button[type='submit']").click();

      // Validate
      cy.contains("Edit Vacancy").should("be.visible");
   });

   it("Test successful workflow", () => {
      cy.get("a[href='/web/index.php/recruitment/viewRecruitmentModule']").click();
      // Create a candidate
      cy.get("button[class='oxd-button oxd-button--medium oxd-button--secondary']").click();

      // Fill the form
      cy.get("input[name='firstName']").type(data.firstNameCandidate);
      cy.get("input[name='middleName']").type(data.middleNameCandidate);
      cy.get("input[name='lastName']").type(data.lastNameCandidate);

      cy.get(".oxd-select-text--after").click();
      cy.contains(data.vacancy).click();

      cy.get(
         "body > div:nth-child(3) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > form:nth-child(3) > div:nth-child(3) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > input:nth-child(1)"
      ).type(data.email);
      cy.get(
         "body > div:nth-child(3) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > form:nth-child(3) > div:nth-child(3) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > input:nth-child(1)"
      ).type(data.contactNumber);

      cy.get('input[type="file"]').selectFile(data.resume, { force: true });

      cy.get("button[type='submit']").click();

      //Process for approving a candidate
      cy.get("button[class='oxd-button oxd-button--medium oxd-button--success']", { timeout: 30000 }).click(); // Click to shortlist
      cy.get("button[type='submit']", { timeout: 30000 }).click(); // Click to save button
      cy.get("button[class='oxd-button oxd-button--medium oxd-button--success']", { timeout: 30000 }).click(); //Click to schedule interview

      //Fill form
      cy.get(
         "body div[id='app'] div[class='oxd-layout'] div[class='oxd-layout-container'] div[class='oxd-layout-context'] div[class='orangehrm-background-container'] div[class='orangehrm-card-container'] form[class='oxd-form'] div:nth-child(2) div:nth-child(1) div:nth-child(1) div:nth-child(1) div:nth-child(2) input:nth-child(1)"
      ).type("Technical interview");
      cy.get("input[placeholder='Type for hints...']").type("Dinh");
      cy.contains("Dinh Van Luong").click();
      cy.get("input[placeholder='yyyy-dd-mm']").type("2024-30-08");
      cy.get("input[placeholder='hh:mm']").click();
      cy.get("button[type='submit']").click(); //Click to save button

      cy.get("button[class='oxd-button oxd-button--medium oxd-button--success']", { timeout: 30000 }).click(); // Click to Mark Interview Passed
      cy.get("button[type='submit']", { timeout: 30000 }).click();

      cy.contains("Offer Job").click(); // Click offer job
      cy.get("button[type='submit']", { timeout: 30000 }).click();

      cy.get("button[class='oxd-button oxd-button--medium oxd-button--success']").click();
      cy.get("button[type='submit']", { timeout: 30000 }).click();

      cy.contains("Success").should("be.visible");

      //Validate
      //Go to PIM
      cy.get(
         "body > div:nth-child(3) > div:nth-child(1) > div:nth-child(1) > aside:nth-child(1) > nav:nth-child(1) > div:nth-child(2) > ul:nth-child(2) > li:nth-child(2) > a:nth-child(1)"
      ).click();
      //Input the employee name
      cy.get(
         "body > div:nth-child(3) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(3) > form:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > input:nth-child(2)"
      ).type(`${data.firstNameCandidate} ${data.middleNameCandidate} ${data.lastNameCandidate}`);
      //Search
      cy.get("button[type='submit']").click();

      //Look at the data in the first row
      cy.get("div[class='oxd-table-body'] > div:first-child > div > div:nth-child(3)", { timeout: 30000 }).should(
         "have.text",
         `${data.firstNameCandidate} ${data.middleNameCandidate}`
      );
      cy.get("div[class='oxd-table-body'] > div:first-child > div > div:nth-child(4)", { timeout: 30000 }).should(
         "have.text",
         data.lastNameCandidate
      );
   });

   it("Test reject process", () => {
      cy.get("a[href='/web/index.php/recruitment/viewRecruitmentModule']").click();
      // Create a candidate
      cy.get("button[class='oxd-button oxd-button--medium oxd-button--secondary']").click();

      // Fill the form
      cy.get("input[name='firstName']").type(data.firstNameCandidate);
      cy.get("input[name='middleName']").type(data.middleNameCandidate);
      cy.get("input[name='lastName']").type(data.lastNameCandidate);

      cy.get(".oxd-select-text--after").click();
      cy.contains(data.vacancy).click();

      cy.get(
         "body > div:nth-child(3) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > form:nth-child(3) > div:nth-child(3) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > input:nth-child(1)"
      ).type(data.email);
      cy.get(
         "body > div:nth-child(3) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > form:nth-child(3) > div:nth-child(3) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > input:nth-child(1)"
      ).type(data.contactNumber);

      cy.get('input[type="file"]').selectFile(data.resume, { force: true });

      cy.get("button[type='submit']").click();

      //Process for approving a candidate
      cy.get("button[class='oxd-button oxd-button--medium oxd-button--success']", { timeout: 30000 }).click(); // Click to shortlist
      cy.get("button[type='submit']", { timeout: 30000 }).click(); // Click to save button
      cy.get("button[class='oxd-button oxd-button--medium oxd-button--danger']", { timeout: 30000 }).click(); //Click to reject the candidate
      cy.get("button[type='submit']").click();

      //Validate
      cy.get(".oxd-table-body > div:nth-child(1) >div:nth-child(1) > div:nth-child(2) > div")
         .invoke("text")
         .should("include", "rejected")
         .and("include", `${data.firstNameCandidate} ${data.middleNameCandidate} ${data.lastNameCandidate}`);
   });

   it("Test raise error for invalid input in candidate creation", () => {
      cy.get("a[href='/web/index.php/recruitment/viewRecruitmentModule']").click();
      // Create a candidate
      cy.get("button[class='oxd-button oxd-button--medium oxd-button--secondary']").click();
      cy.get('input[type="file"]').selectFile("./cypress/fixtures/cv.xlsx", { force: true });
      cy.get("button[type='submit']").click();

      //Validate
      cy.get("input[name='firstName']").parent().next().should("have.text", "Required");
      cy.get("input[name='lastName']").parent().next().should("have.text", "Required");
      cy.get("input[placeholder='Type here']").parent().next().should("have.text", "Required");
      cy.get(
         "div[class='orangehrm-file-input'] span[class='oxd-text oxd-text--span oxd-input-field-error-message oxd-input-group__message']"
      ).should("have.text", "File type not allowed");
   });
});
