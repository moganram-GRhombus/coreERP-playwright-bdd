// Generated from: features\purchase_order.feature
import { test } from "playwright-bdd";

test.describe('CoreERP purchase orders', () => {

  test('Buyer can see the seeded purchase orders', { tag: ['@TC-P19', '@positive', '@validation'] }, async ({ Given, Then, And, page }) => { 
    await Given('the buyer is logged in', null, { page }); 
    await And('the buyer is on the purchase orders page', null, { page }); 
    await Then('the seeded purchase orders are listed', null, { page }); 
  });

});

// == technical section ==

test.afterEach('AfterEach Hooks', ({ $runScenarioHooks, page }) => $runScenarioHooks('after', { page }));

test.use({
  $test: [({}, use) => use(test), { scope: 'test', box: true }],
  $uri: [({}, use) => use('features\\purchase_order.feature'), { scope: 'test', box: true }],
  $bddFileData: [({}, use) => use(bddFileData), { scope: "test", box: true }],
});

const bddFileData = [ // bdd-data-start
  {"pwTestLine":6,"pickleLine":4,"tags":["@TC-P19","@positive","@validation"],"steps":[{"pwStepLine":7,"gherkinStepLine":5,"keywordType":"Context","textWithKeyword":"Given the buyer is logged in","stepMatchArguments":[]},{"pwStepLine":8,"gherkinStepLine":6,"keywordType":"Context","textWithKeyword":"And the buyer is on the purchase orders page","stepMatchArguments":[]},{"pwStepLine":9,"gherkinStepLine":7,"keywordType":"Outcome","textWithKeyword":"Then the seeded purchase orders are listed","stepMatchArguments":[]}]},
]; // bdd-data-end