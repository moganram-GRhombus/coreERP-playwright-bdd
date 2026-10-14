// Generated from: features\login.feature
import { test } from "playwright-bdd";

test.describe('CoreERP login', () => {

  test('Buyer logs in successfully', { tag: ['@TC-P01', '@positive', '@validation', '@smoke'] }, async ({ Given, When, Then, And, page }) => { 
    await Given('the buyer opens the login page', null, { page }); 
    await When('the buyer enters username "buyer" and password "Erp@123"', null, { page }); 
    await And('the buyer clicks the sign in button', null, { page }); 
    await Then('the dashboard is displayed for "Neha Sharma" with role "buyer"', null, { page }); 
  });

  test('Manager logs in successfully', { tag: ['@TC-P02', '@positive', '@validation'] }, async ({ Given, When, Then, And, page }) => { 
    await Given('the manager opens the login page', null, { page }); 
    await When('the manager enters username "manager" and password "Erp@123"', null, { page }); 
    await And('the manager clicks the sign in button', null, { page }); 
    await Then('the dashboard is displayed for "Rahul Mehta" with role "manager"', null, { page }); 
  });

  test('Buyer can log out from the dashboard', { tag: ['@TC-P17', '@positive', '@validation'] }, async ({ Given, When, Then, page }) => { 
    await Given('the buyer is logged in', null, { page }); 
    await When('the buyer logs out', null, { page }); 
    await Then('the login page is displayed', null, { page }); 
  });

  test('Login with wrong password is rejected', { tag: ['@TC-N01', '@negative', '@validation'] }, async ({ Given, When, Then, And, page }) => { 
    await Given('the buyer opens the login page', null, { page }); 
    await When('the buyer enters username "buyer" and password "WrongPass1"', null, { page }); 
    await And('the buyer clicks the sign in button', null, { page }); 
    await Then('the login error message is "Invalid username or password"', null, { page }); 
  });

  test('Login with empty credentials is rejected', { tag: ['@TC-N02', '@negative', '@validation'] }, async ({ Given, When, Then, And, page }) => { 
    await Given('the buyer opens the login page', null, { page }); 
    await When('the buyer enters username "" and password ""', null, { page }); 
    await And('the buyer clicks the sign in button', null, { page }); 
    await Then('the login error message is "Invalid username or password"', null, { page }); 
  });

  test('Login with unknown user is rejected', { tag: ['@TC-N03', '@negative', '@validation'] }, async ({ Given, When, Then, And, page }) => { 
    await Given('the buyer opens the login page', null, { page }); 
    await When('the buyer enters username "unknown.user" and password "Erp@123"', null, { page }); 
    await And('the buyer clicks the sign in button', null, { page }); 
    await Then('the login error message is "Invalid username or password"', null, { page }); 
  });

});

// == technical section ==

test.afterEach('AfterEach Hooks', ({ $runScenarioHooks, page }) => $runScenarioHooks('after', { page }));

test.use({
  $test: [({}, use) => use(test), { scope: 'test', box: true }],
  $uri: [({}, use) => use('features\\login.feature'), { scope: 'test', box: true }],
  $bddFileData: [({}, use) => use(bddFileData), { scope: "test", box: true }],
});

const bddFileData = [ // bdd-data-start
  {"pwTestLine":6,"pickleLine":4,"tags":["@TC-P01","@positive","@validation","@smoke"],"steps":[{"pwStepLine":7,"gherkinStepLine":5,"keywordType":"Context","textWithKeyword":"Given the buyer opens the login page","stepMatchArguments":[]},{"pwStepLine":8,"gherkinStepLine":6,"keywordType":"Action","textWithKeyword":"When the buyer enters username \"buyer\" and password \"Erp@123\"","stepMatchArguments":[{"group":{"start":26,"value":"\"buyer\"","children":[{"start":27,"value":"buyer","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"},{"group":{"start":47,"value":"\"Erp@123\"","children":[{"start":48,"value":"Erp@123","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":9,"gherkinStepLine":7,"keywordType":"Action","textWithKeyword":"And the buyer clicks the sign in button","stepMatchArguments":[]},{"pwStepLine":10,"gherkinStepLine":8,"keywordType":"Outcome","textWithKeyword":"Then the dashboard is displayed for \"Neha Sharma\" with role \"buyer\"","stepMatchArguments":[{"group":{"start":31,"value":"\"Neha Sharma\"","children":[{"start":32,"value":"Neha Sharma","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"},{"group":{"start":55,"value":"\"buyer\"","children":[{"start":56,"value":"buyer","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]}]},
  {"pwTestLine":13,"pickleLine":11,"tags":["@TC-P02","@positive","@validation"],"steps":[{"pwStepLine":14,"gherkinStepLine":12,"keywordType":"Context","textWithKeyword":"Given the manager opens the login page","stepMatchArguments":[]},{"pwStepLine":15,"gherkinStepLine":13,"keywordType":"Action","textWithKeyword":"When the manager enters username \"manager\" and password \"Erp@123\"","stepMatchArguments":[{"group":{"start":28,"value":"\"manager\"","children":[{"start":29,"value":"manager","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"},{"group":{"start":51,"value":"\"Erp@123\"","children":[{"start":52,"value":"Erp@123","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":16,"gherkinStepLine":14,"keywordType":"Action","textWithKeyword":"And the manager clicks the sign in button","stepMatchArguments":[]},{"pwStepLine":17,"gherkinStepLine":15,"keywordType":"Outcome","textWithKeyword":"Then the dashboard is displayed for \"Rahul Mehta\" with role \"manager\"","stepMatchArguments":[{"group":{"start":31,"value":"\"Rahul Mehta\"","children":[{"start":32,"value":"Rahul Mehta","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"},{"group":{"start":55,"value":"\"manager\"","children":[{"start":56,"value":"manager","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]}]},
  {"pwTestLine":20,"pickleLine":18,"tags":["@TC-P17","@positive","@validation"],"steps":[{"pwStepLine":21,"gherkinStepLine":19,"keywordType":"Context","textWithKeyword":"Given the buyer is logged in","stepMatchArguments":[]},{"pwStepLine":22,"gherkinStepLine":20,"keywordType":"Action","textWithKeyword":"When the buyer logs out","stepMatchArguments":[]},{"pwStepLine":23,"gherkinStepLine":21,"keywordType":"Outcome","textWithKeyword":"Then the login page is displayed","stepMatchArguments":[]}]},
  {"pwTestLine":26,"pickleLine":24,"tags":["@TC-N01","@negative","@validation"],"steps":[{"pwStepLine":27,"gherkinStepLine":25,"keywordType":"Context","textWithKeyword":"Given the buyer opens the login page","stepMatchArguments":[]},{"pwStepLine":28,"gherkinStepLine":26,"keywordType":"Action","textWithKeyword":"When the buyer enters username \"buyer\" and password \"WrongPass1\"","stepMatchArguments":[{"group":{"start":26,"value":"\"buyer\"","children":[{"start":27,"value":"buyer","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"},{"group":{"start":47,"value":"\"WrongPass1\"","children":[{"start":48,"value":"WrongPass1","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":29,"gherkinStepLine":27,"keywordType":"Action","textWithKeyword":"And the buyer clicks the sign in button","stepMatchArguments":[]},{"pwStepLine":30,"gherkinStepLine":28,"keywordType":"Outcome","textWithKeyword":"Then the login error message is \"Invalid username or password\"","stepMatchArguments":[{"group":{"start":27,"value":"\"Invalid username or password\"","children":[{"start":28,"value":"Invalid username or password","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]}]},
  {"pwTestLine":33,"pickleLine":31,"tags":["@TC-N02","@negative","@validation"],"steps":[{"pwStepLine":34,"gherkinStepLine":32,"keywordType":"Context","textWithKeyword":"Given the buyer opens the login page","stepMatchArguments":[]},{"pwStepLine":35,"gherkinStepLine":33,"keywordType":"Action","textWithKeyword":"When the buyer enters username \"\" and password \"\"","stepMatchArguments":[{"group":{"start":26,"value":"\"\"","children":[{"start":27,"value":"","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"},{"group":{"start":42,"value":"\"\"","children":[{"start":43,"value":"","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":36,"gherkinStepLine":34,"keywordType":"Action","textWithKeyword":"And the buyer clicks the sign in button","stepMatchArguments":[]},{"pwStepLine":37,"gherkinStepLine":35,"keywordType":"Outcome","textWithKeyword":"Then the login error message is \"Invalid username or password\"","stepMatchArguments":[{"group":{"start":27,"value":"\"Invalid username or password\"","children":[{"start":28,"value":"Invalid username or password","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]}]},
  {"pwTestLine":40,"pickleLine":38,"tags":["@TC-N03","@negative","@validation"],"steps":[{"pwStepLine":41,"gherkinStepLine":39,"keywordType":"Context","textWithKeyword":"Given the buyer opens the login page","stepMatchArguments":[]},{"pwStepLine":42,"gherkinStepLine":40,"keywordType":"Action","textWithKeyword":"When the buyer enters username \"unknown.user\" and password \"Erp@123\"","stepMatchArguments":[{"group":{"start":26,"value":"\"unknown.user\"","children":[{"start":27,"value":"unknown.user","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"},{"group":{"start":54,"value":"\"Erp@123\"","children":[{"start":55,"value":"Erp@123","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":43,"gherkinStepLine":41,"keywordType":"Action","textWithKeyword":"And the buyer clicks the sign in button","stepMatchArguments":[]},{"pwStepLine":44,"gherkinStepLine":42,"keywordType":"Outcome","textWithKeyword":"Then the login error message is \"Invalid username or password\"","stepMatchArguments":[{"group":{"start":27,"value":"\"Invalid username or password\"","children":[{"start":28,"value":"Invalid username or password","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]}]},
]; // bdd-data-end