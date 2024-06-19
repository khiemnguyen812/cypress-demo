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
      cy.get("input[name='username']", { timeout: 30000 }).type(data.loginInfo.username);
      cy.get("input[name='password']", { timeout: 30000 }).type(data.loginInfo.password);
      cy.get("button[type='submit']").click();

      // Check login success
      cy.url().should("eq", "https://opensource-demo.orangehrmlive.com/web/index.php/dashboard/index");
   });

   before("Env - using english and open all module", () => {
      cy.visit("https://opensource-demo.orangehrmlive.com");

      // Login
      cy.get("input[name='username']", { timeout: 30000 }).type(data.loginInfo.username);
      cy.get("input[name='password']", { timeout: 30000 }).type(data.loginInfo.password);
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

      cy.get("input[name='firstName']").type(data.employeeData.firstName);
      cy.get("input[name='middleName']").type(data.employeeData.middleName);
      cy.get("input[name='lastName']").type(data.employeeData.lastName);
      cy.get(
         "div[class='oxd-input-group oxd-input-field-bottom-space'] div input[class='oxd-input oxd-input--active']"
      ).type(data.employeeData.id);

      cy.get("button[type='submit']").click();

      // Validate
      cy.contains("Personal Details").should("be.visible");
   });

   before("Precondition - create a job title", () => {
      cy.visit("https://opensource-demo.orangehrmlive.com/web/index.php/admin/viewJobTitleList");
      cy.get("button[class='oxd-button oxd-button--medium oxd-button--secondary']").click();
      cy.get(
         "div[class='oxd-input-group oxd-input-field-bottom-space'] div input[class='oxd-input oxd-input--active']"
      ).type(data.jobData.jobTitle);
      cy.get("button[type='submit']").click();

      // Validate
      cy.contains("Success").should("be.visible");
   });

   before("Precondition - create a vacancy", () => {
      cy.get(
         "body > div:nth-child(3) > div:nth-child(1) > div:nth-child(1) > aside:nth-child(1) > nav:nth-child(1) > div:nth-child(2) > ul:nth-child(2) > li:nth-child(5) > a:nth-child(1) > span:nth-child(2)"
      ).click();

      cy.contains("Vacancies").click();
      cy.get("button[class='oxd-button oxd-button--medium oxd-button--secondary']").click();

      cy.get(
         "body > div:nth-child(3) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > form:nth-child(3) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > input:nth-child(1)"
      ).type(data.jobData.vacancy);

      cy.get(".oxd-select-text--after").click();
      cy.contains(data.jobData.jobTitle).click();
      cy.get("input[placeholder='Type for hints...']").type(data.employeeData.firstName);
      cy.contains(
         `${data.employeeData.firstName} ${data.employeeData.middleName} ${data.employeeData.lastName}`
      ).click();

      cy.get("button[type='submit']").click();

      // Validate
      cy.contains("Edit Vacancy").should("be.visible");
   });

   it("Test successful workflow", () => {
      cy.get("a[href='/web/index.php/recruitment/viewRecruitmentModule']").click();
      // Create a candidate
      cy.get("button[class='oxd-button oxd-button--medium oxd-button--secondary']").click();

      // Fill the form
      const validDataset = data.validCandidateDataset;

      cy.fillCandidateForm(
         validDataset.firstName,
         validDataset.middleName,
         validDataset.lastName,
         validDataset.vacancy,
         validDataset.email,
         validDataset.contactNumber,
         validDataset.resume
      );

      //Process for approving a candidate
      cy.get("button[class='oxd-button oxd-button--medium oxd-button--success']", { timeout: 30000 }).click(); // Click to shortlist
      cy.get("button[type='submit']", { timeout: 30000 }).click(); // Click to save button
      cy.get("button[class='oxd-button oxd-button--medium oxd-button--success']", { timeout: 30000 }).click(); //Click to schedule interview

      //Fill form
      const validInterviewDataset = data.validScheduleInterviewDataset;

      cy.fillScheduleInterviewForm(
         validInterviewDataset.title,
         validInterviewDataset.interviewer,
         validInterviewDataset.date
      );

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
      //Input the candidate name
      cy.get(
         "body > div:nth-child(3) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(3) > form:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > input:nth-child(2)"
      ).type(
         `${data.validCandidateDataset.firstName} ${data.validCandidateDataset.middleName} ${data.validCandidateDataset.lastName}`
      );
      //Search
      cy.get("button[type='submit']").click();
      cy.wait(5000);

      //Look at the data in the first row
      cy.get("div[class='oxd-table-body'] > div:first-child > div > div:nth-child(3)", { timeout: 30000 }).should(
         "have.text",
         `${data.validCandidateDataset.firstName} ${data.validCandidateDataset.middleName}`
      );
      cy.get("div[class='oxd-table-body'] > div:first-child > div > div:nth-child(4)", { timeout: 30000 }).should(
         "have.text",
         data.validCandidateDataset.lastName
      );
   });

   it("Test reject process", () => {
      cy.get("a[href='/web/index.php/recruitment/viewRecruitmentModule']").click();
      // Create a candidate
      cy.get("button[class='oxd-button oxd-button--medium oxd-button--secondary']").click();

      // Fill the form
      const validDataset = data.validCandidateDataset;

      cy.fillCandidateForm(
         validDataset.firstName,
         validDataset.middleName,
         validDataset.lastName,
         validDataset.vacancy,
         validDataset.email,
         validDataset.contactNumber,
         validDataset.resume
      );

      //Process for approving a candidate
      cy.get("button[class='oxd-button oxd-button--medium oxd-button--success']", { timeout: 30000 }).click(); // Click to shortlist
      cy.get("button[type='submit']", { timeout: 30000 }).click(); // Click to save button
      cy.get("button[class='oxd-button oxd-button--medium oxd-button--danger']", { timeout: 30000 }).click(); //Click to reject the candidate
      cy.get("button[type='submit']").click();

      //Validate
      cy.get(".oxd-table-body > div:nth-child(1) >div:nth-child(1) > div:nth-child(2) > div")
         .invoke("text")
         .should("include", "rejected")
         .and(
            "include",
            `${data.validCandidateDataset.firstName} ${data.validCandidateDataset.middleName} ${data.validCandidateDataset.lastName}`
         );
   });

   it("Verify raise error when input blank firstname in candidate creation", () => {
      cy.get("a[href='/web/index.php/recruitment/viewRecruitmentModule']").click();
      // Create a candidate
      cy.get("button[class='oxd-button oxd-button--medium oxd-button--secondary']").click();

      // Fill the form
      const invalidData = data.blankFirstNameCandidateDataset;

      cy.fillCandidateForm(
         invalidData.firstName,
         invalidData.middleName,
         invalidData.lastName,
         invalidData.vacancy,
         invalidData.email,
         invalidData.contactNumber,
         invalidData.resume
      );

      //Validate
      cy.get("input[name='firstName']").parent().next().should("have.text", "Required");
      // cy.get("input[name='lastName']").parent().next().should("have.text", "Required");
      // cy.get("input[placeholder='Type here']").parent().next().should("have.text", "Required");
      // cy.get(
      //    "div[class='orangehrm-file-input'] span[class='oxd-text oxd-text--span oxd-input-field-error-message oxd-input-group__message']"
      // ).should("have.text", "File type not allowed");
   });

   it("Verify raise error when exceed length firstname in candidate creation", () => {
      cy.get("a[href='/web/index.php/recruitment/viewRecruitmentModule']").click();
      // Create a candidate
      cy.get("button[class='oxd-button oxd-button--medium oxd-button--secondary']").click();

      // Fill the form
      const invalidData = data.oversizedFirstNameDataset;

      cy.fillCandidateForm(
         invalidData.firstName,
         invalidData.middleName,
         invalidData.lastName,
         invalidData.vacancy,
         invalidData.email,
         invalidData.contactNumber,
         invalidData.resume
      );

      //Validate
      cy.get("input[name='firstName']").parent().next().should("have.text", "Should not exceed 30 characters");
      // cy.get("input[name='lastName']").parent().next().should("have.text", "Required");
      // cy.get("input[placeholder='Type here']").parent().next().should("have.text", "Required");
      // cy.get(
      //    "div[class='orangehrm-file-input'] span[class='oxd-text oxd-text--span oxd-input-field-error-message oxd-input-group__message']"
      // ).should("have.text", "File type not allowed");
   });

   it("Verify raise error when exceed length last name in candidate creation", () => {
      cy.get("a[href='/web/index.php/recruitment/viewRecruitmentModule']").click();
      // Create a candidate
      cy.get("button[class='oxd-button oxd-button--medium oxd-button--secondary']").click();

      // Fill the form
      const invalidData = data.oversizedLastNameDataset;

      cy.fillCandidateForm(
         invalidData.firstName,
         invalidData.middleName,
         invalidData.lastName,
         invalidData.vacancy,
         invalidData.email,
         invalidData.contactNumber,
         invalidData.resume
      );

      //Validate
      // cy.get("input[name='firstName']").parent().next().should("have.text", "Should not exceed 30 characters");
      // cy.get("input[name='lastName']").parent().next().should("have.text", "Required");
      cy.get("input[name='lastName']").parent().next().should("have.text", "Should not exceed 30 characters");
      // cy.get("input[placeholder='Type here']").parent().next().should("have.text", "Required");
      // cy.get(
      //    "div[class='orangehrm-file-input'] span[class='oxd-text oxd-text--span oxd-input-field-error-message oxd-input-group__message']"
      // ).should("have.text", "File type not allowed");
   });

   it("Verify raise error when exceed length middle name in candidate creation", () => {
      cy.get("a[href='/web/index.php/recruitment/viewRecruitmentModule']").click();
      // Create a candidate
      cy.get("button[class='oxd-button oxd-button--medium oxd-button--secondary']").click();

      // Fill the form
      const invalidData = data.oversizedMiddleNameDataset;

      cy.fillCandidateForm(
         invalidData.firstName,
         invalidData.middleName,
         invalidData.lastName,
         invalidData.vacancy,
         invalidData.email,
         invalidData.contactNumber,
         invalidData.resume
      );

      //Validate
      // cy.get("input[name='firstName']").parent().next().should("have.text", "Should not exceed 30 characters");
      // cy.get("input[name='lastName']").parent().next().should("have.text", "Required");
      cy.get("input[name='middleName']").parent().next().should("have.text", "Should not exceed 30 characters");
      // cy.get("input[placeholder='Type here']").parent().next().should("have.text", "Required");
      // cy.get(
      //    "div[class='orangehrm-file-input'] span[class='oxd-text oxd-text--span oxd-input-field-error-message oxd-input-group__message']"
      // ).should("have.text", "File type not allowed");
   });

   it("Verify raise error when input invalid email in candidate creation", () => {
      cy.get("a[href='/web/index.php/recruitment/viewRecruitmentModule']").click();
      // Create a candidate
      cy.get("button[class='oxd-button oxd-button--medium oxd-button--secondary']").click();

      // Fill the form
      const invalidData = data.invalidEmailDataset;

      cy.fillCandidateForm(
         invalidData.firstName,
         invalidData.middleName,
         invalidData.lastName,
         invalidData.vacancy,
         invalidData.email,
         invalidData.contactNumber,
         invalidData.resume
      );

      //Validate
      // cy.get("input[name='firstName']").parent().next().should("have.text", "Should not exceed 30 characters");
      // cy.get("input[name='lastName']").parent().next().should("have.text", "Required");
      cy.get(
         "body > div:nth-child(3) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > form:nth-child(3) > div:nth-child(3) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > input:nth-child(1)"
      )
         .parent()
         .next()
         .should("have.text", "Expected format: admin@example.com");
      // cy.get("input[placeholder='Type here']").parent().next().should("have.text", "Required");
      // cy.get(
      //    "div[class='orangehrm-file-input'] span[class='oxd-text oxd-text--span oxd-input-field-error-message oxd-input-group__message']"
      // ).should("have.text", "File type not allowed");
   });

   it("Verify raise error when exceed length email in candidate creation", () => {
      cy.get("a[href='/web/index.php/recruitment/viewRecruitmentModule']").click();
      // Create a candidate
      cy.get("button[class='oxd-button oxd-button--medium oxd-button--secondary']").click();

      // Fill the form
      const invalidData = data.oversizedEmailDataset;

      cy.fillCandidateForm(
         invalidData.firstName,
         invalidData.middleName,
         invalidData.lastName,
         invalidData.vacancy,
         invalidData.email,
         invalidData.contactNumber,
         invalidData.resume
      );

      //Validate
      // cy.get("input[name='firstName']").parent().next().should("have.text", "Should not exceed 30 characters");
      // cy.get("input[name='lastName']").parent().next().should("have.text", "Required");
      cy.get(
         "body > div:nth-child(3) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > form:nth-child(3) > div:nth-child(3) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > input:nth-child(1)"
      )
         .parent()
         .next()
         .should("have.text", "Should not exceed 50 characters");
      // cy.get("input[placeholder='Type here']").parent().next().should("have.text", "Required");
      // cy.get(
      //    "div[class='orangehrm-file-input'] span[class='oxd-text oxd-text--span oxd-input-field-error-message oxd-input-group__message']"
      // ).should("have.text", "File type not allowed");
   });

   it("Verify raise error when input invalid file type in resume in candidate creation", () => {
      cy.get("a[href='/web/index.php/recruitment/viewRecruitmentModule']").click();
      // Create a candidate
      cy.get("button[class='oxd-button oxd-button--medium oxd-button--secondary']").click();

      // Fill the form
      const invalidData = data.invalidResumeDataset;

      cy.fillCandidateForm(
         invalidData.firstName,
         invalidData.middleName,
         invalidData.lastName,
         invalidData.vacancy,
         invalidData.email,
         invalidData.contactNumber,
         invalidData.resume
      );

      //Validate
      // cy.get("input[name='firstName']").parent().next().should("have.text", "Should not exceed 30 characters");
      // cy.get("input[name='lastName']").parent().next().should("have.text", "Required");
      // cy.get("input[placeholder='Type here']").parent().next().should("have.text", "Required");
      cy.get(
         "div[class='orangehrm-file-input'] span[class='oxd-text oxd-text--span oxd-input-field-error-message oxd-input-group__message']"
      ).should("have.text", "File type not allowed");
   });

   it("Verify raise error when input invalid contact number in candidate creation", () => {
      cy.get("a[href='/web/index.php/recruitment/viewRecruitmentModule']").click();
      // Create a candidate
      cy.get("button[class='oxd-button oxd-button--medium oxd-button--secondary']").click();

      // Fill the form
      const invalidData = data.invalidContactNumberDataset;

      cy.fillCandidateForm(
         invalidData.firstName,
         invalidData.middleName,
         invalidData.lastName,
         invalidData.vacancy,
         invalidData.email,
         invalidData.contactNumber,
         invalidData.resume
      );

      //Validate
      // cy.get("input[name='firstName']").parent().next().should("have.text", "Should not exceed 30 characters");
      // cy.get("input[name='lastName']").parent().next().should("have.text", "Required");
      // cy.get("input[placeholder='Type here']").parent().next().should("have.text", "Required");
      cy.get(
         "body > div:nth-child(3) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > form:nth-child(3) > div:nth-child(3) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > input:nth-child(1)"
      )
         .parent()
         .next()
         .should("have.text", "Allows numbers and only + - / ( )");
   });

   it("Verify raise error when exceed length keywords in candidate creation", () => {
      cy.get("a[href='/web/index.php/recruitment/viewRecruitmentModule']").click();
      // Create a candidate
      cy.get("button[class='oxd-button oxd-button--medium oxd-button--secondary']").click();

      // Fill the form
      const invalidData = data.oversizedKeywordsDataset;

      cy.fillCandidateForm(
         invalidData.firstName,
         invalidData.middleName,
         invalidData.lastName,
         invalidData.vacancy,
         invalidData.email,
         invalidData.contactNumber,
         invalidData.resume,
         invalidData.keywords
      );

      //Validate
      // cy.get("input[name='firstName']").parent().next().should("have.text", "Should not exceed 30 characters");
      // cy.get("input[name='lastName']").parent().next().should("have.text", "Required");
      // cy.get("input[placeholder='Type here']").parent().next().should("have.text", "Required");
      cy.get("input[placeholder='Enter comma seperated words...']")
         .parent()
         .next()
         .should("have.text", "Should not exceed 250 characters");
   });

   it("Verify raise error when exceed length notes in candidate creation", () => {
      cy.get("a[href='/web/index.php/recruitment/viewRecruitmentModule']").click();
      // Create a candidate
      cy.get("button[class='oxd-button oxd-button--medium oxd-button--secondary']").click();

      // Fill the form
      const invalidData = data.oversizedKeywordsDataset;

      cy.fillCandidateForm(
         invalidData.firstName,
         invalidData.middleName,
         invalidData.lastName,
         invalidData.vacancy,
         invalidData.email,
         invalidData.contactNumber,
         invalidData.resume,
         invalidData.keywords
      );

      //Validate
      // cy.get("input[name='firstName']").parent().next().should("have.text", "Should not exceed 30 characters");
      // cy.get("input[name='lastName']").parent().next().should("have.text", "Required");
      // cy.get("input[placeholder='Type here']").parent().next().should("have.text", "Required");
      cy.contains("Should not exceed 250 characters").should("be.visible");
   });

   it("Verify raise error when input blank title in schedule interview", () => {
      const candidate = data.validCandidateDataset;
      const interviewInfo = data.blankTitleScheduleInterviewDataset;
      cy.executeToScheduleInterview(candidate, interviewInfo);

      // Validate
      cy.get(
         "body div[id='app'] div[class='oxd-layout'] div[class='oxd-layout-container'] div[class='oxd-layout-context'] div[class='orangehrm-background-container'] div[class='orangehrm-card-container'] form[class='oxd-form'] div:nth-child(2) div:nth-child(1) div:nth-child(1) div:nth-child(1) div:nth-child(2) input:nth-child(1)"
      )
         .parent()
         .next()
         .should("have.text", "Required");
   });

   it("Verify raise error when input blank interviewer in schedule interview", () => {
      const candidate = data.validCandidateDataset;
      const interviewInfo = data.blankInterviewerScheduleInterviewDataset;

      cy.executeToScheduleInterview(candidate, interviewInfo);

      // Validate
      cy.get("input[placeholder='Type for hints...']")
         .parent()
         .parent()
         .parent()
         .next()
         .should("have.text", "Required");
   });

   it("Verify raise error when input non exists interviewer in schedule interview", () => {
      const candidate = data.validCandidateDataset;
      const interviewInfo = data.nonExistInterviewerScheduleInterviewDataset;

      cy.executeToScheduleInterview(candidate, interviewInfo, false);

      // Validate
      cy.get("input[placeholder='Type for hints...']").parent().parent().parent().next().should("have.text", "Invalid");
   });

   it("Verify raise error when input blank date in schedule interview", () => {
      const candidate = data.validCandidateDataset;
      const interviewInfo = data.blankDateScheduleInterviewDataset;

      cy.executeToScheduleInterview(candidate, interviewInfo);

      // Validate
      cy.get("input[placeholder='yyyy-dd-mm']").parent().parent().parent().next().should("have.text", "Required");
   });

   it("Verify raise error when input invalid date in schedule interview", () => {
      const candidate = data.validCandidateDataset;
      const interviewInfo = data.invalidFormatDateScheduleInterviewDataset;

      cy.executeToScheduleInterview(candidate, interviewInfo);

      // Validate
      cy.get("input[placeholder='yyyy-dd-mm']")
         .parent()
         .parent()
         .parent()
         .next()
         .should("have.text", "Should be a valid date in yyyy-dd-mm format");
   });
});
