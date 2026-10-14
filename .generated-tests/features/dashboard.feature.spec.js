// Generated from: features\dashboard.feature
import { test } from "playwright-bdd";

test.describe('CoreERP dashboard', () => {

  test('Buyer sees the dashboard KPI summary', { tag: ['@TC-P03', '@positive', '@validation'] }, async ({ Given, Then, page }) => { 
    await Given('the buyer is logged in', null, { page }); 
    await Then('the dashboard shows open purchase orders "1", pending approval "0", low-stock items "5", inventory value "₹20,44,184.00" and approved spend "₹2,655.00"', null, { page }); 
  });

});

// == technical section ==

test.afterEach('AfterEach Hooks', ({ $runScenarioHooks, page }) => $runScenarioHooks('after', { page }));

test.use({
  $test: [({}, use) => use(test), { scope: 'test', box: true }],
  $uri: [({}, use) => use('features\\dashboard.feature'), { scope: 'test', box: true }],
  $bddFileData: [({}, use) => use(bddFileData), { scope: "test", box: true }],
});

const bddFileData = [ // bdd-data-start
  {"pwTestLine":6,"pickleLine":4,"tags":["@TC-P03","@positive","@validation"],"steps":[{"pwStepLine":7,"gherkinStepLine":5,"keywordType":"Context","textWithKeyword":"Given the buyer is logged in","stepMatchArguments":[]},{"pwStepLine":8,"gherkinStepLine":6,"keywordType":"Outcome","textWithKeyword":"Then the dashboard shows open purchase orders \"1\", pending approval \"0\", low-stock items \"5\", inventory value \"₹20,44,184.00\" and approved spend \"₹2,655.00\"","stepMatchArguments":[{"group":{"start":41,"value":"\"1\"","children":[{"start":42,"value":"1","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"},{"group":{"start":63,"value":"\"0\"","children":[{"start":64,"value":"0","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"},{"group":{"start":84,"value":"\"5\"","children":[{"start":85,"value":"5","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"},{"group":{"start":105,"value":"\"₹20,44,184.00\"","children":[{"start":106,"value":"₹20,44,184.00","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"},{"group":{"start":140,"value":"\"₹2,655.00\"","children":[{"start":141,"value":"₹2,655.00","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]}]},
]; // bdd-data-end