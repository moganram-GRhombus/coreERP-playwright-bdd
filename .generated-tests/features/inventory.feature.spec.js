// Generated from: features\inventory.feature
import { test } from "playwright-bdd";

test.describe('CoreERP inventory', () => {

  test('Buyer can view the inventory controls', { tag: ['@TC-P04', '@positive', '@validation'] }, async ({ Given, Then, And, page }) => { 
    await Given('the buyer is logged in', null, { page }); 
    await And('the buyer is on the inventory page', null, { page }); 
    await Then('the inventory search field is visible', null, { page }); 
    await And('the warehouse filter defaults to "All warehouses"', null, { page }); 
  });

  test('Buyer can search inventory by SKU or product name', { tag: ['@TC-P05', '@positive', '@validation'] }, async ({ Given, When, Then, And, page }) => { 
    await Given('the buyer is logged in', null, { page }); 
    await And('the buyer is on the inventory page', null, { page }); 
    await When('the buyer searches inventory for "SKU-1009"', null, { page }); 
    await Then('the inventory search results are limited to matching rows', null, { page }); 
  });

  test('Buyer can filter inventory by warehouse', { tag: ['@TC-P06', '@positive', '@validation'] }, async ({ Given, When, Then, And, page }) => { 
    await Given('the buyer is logged in', null, { page }); 
    await And('the buyer is on the inventory page', null, { page }); 
    await When('the buyer filters inventory to warehouse "Pune"', null, { page }); 
    await Then('only rows from warehouse "Pune" are visible', null, { page }); 
  });

  test('Buyer can filter inventory to low stock only', { tag: ['@TC-P07', '@positive', '@validation'] }, async ({ Given, When, Then, And, page }) => { 
    await Given('the buyer is logged in', null, { page }); 
    await And('the buyer is on the inventory page', null, { page }); 
    await When('the buyer filters inventory to low stock only', null, { page }); 
    await Then('the low stock rows show the low-stock badge', null, { page }); 
  });

  test('Buyer can change the inventory page size', { tag: ['@TC-P08', '@positive', '@validation'] }, async ({ Given, When, Then, And, page }) => { 
    await Given('the buyer is logged in', null, { page }); 
    await And('the buyer is on the inventory page', null, { page }); 
    await When('the buyer changes rows per page to "25 / page"', null, { page }); 
    await Then('the inventory grid shows a valid page size selection', null, { page }); 
  });

});

// == technical section ==

test.afterEach('AfterEach Hooks', ({ $runScenarioHooks, page }) => $runScenarioHooks('after', { page }));

test.use({
  $test: [({}, use) => use(test), { scope: 'test', box: true }],
  $uri: [({}, use) => use('features\\inventory.feature'), { scope: 'test', box: true }],
  $bddFileData: [({}, use) => use(bddFileData), { scope: "test", box: true }],
});

const bddFileData = [ // bdd-data-start
  {"pwTestLine":6,"pickleLine":4,"tags":["@TC-P04","@positive","@validation"],"steps":[{"pwStepLine":7,"gherkinStepLine":5,"keywordType":"Context","textWithKeyword":"Given the buyer is logged in","stepMatchArguments":[]},{"pwStepLine":8,"gherkinStepLine":6,"keywordType":"Context","textWithKeyword":"And the buyer is on the inventory page","stepMatchArguments":[]},{"pwStepLine":9,"gherkinStepLine":7,"keywordType":"Outcome","textWithKeyword":"Then the inventory search field is visible","stepMatchArguments":[]},{"pwStepLine":10,"gherkinStepLine":8,"keywordType":"Outcome","textWithKeyword":"And the warehouse filter defaults to \"All warehouses\"","stepMatchArguments":[{"group":{"start":33,"value":"\"All warehouses\"","children":[{"start":34,"value":"All warehouses","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]}]},
  {"pwTestLine":13,"pickleLine":11,"tags":["@TC-P05","@positive","@validation"],"steps":[{"pwStepLine":14,"gherkinStepLine":12,"keywordType":"Context","textWithKeyword":"Given the buyer is logged in","stepMatchArguments":[]},{"pwStepLine":15,"gherkinStepLine":13,"keywordType":"Context","textWithKeyword":"And the buyer is on the inventory page","stepMatchArguments":[]},{"pwStepLine":16,"gherkinStepLine":14,"keywordType":"Action","textWithKeyword":"When the buyer searches inventory for \"SKU-1009\"","stepMatchArguments":[{"group":{"start":33,"value":"\"SKU-1009\"","children":[{"start":34,"value":"SKU-1009","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":17,"gherkinStepLine":15,"keywordType":"Outcome","textWithKeyword":"Then the inventory search results are limited to matching rows","stepMatchArguments":[]}]},
  {"pwTestLine":20,"pickleLine":18,"tags":["@TC-P06","@positive","@validation"],"steps":[{"pwStepLine":21,"gherkinStepLine":19,"keywordType":"Context","textWithKeyword":"Given the buyer is logged in","stepMatchArguments":[]},{"pwStepLine":22,"gherkinStepLine":20,"keywordType":"Context","textWithKeyword":"And the buyer is on the inventory page","stepMatchArguments":[]},{"pwStepLine":23,"gherkinStepLine":21,"keywordType":"Action","textWithKeyword":"When the buyer filters inventory to warehouse \"Pune\"","stepMatchArguments":[{"group":{"start":41,"value":"\"Pune\"","children":[{"start":42,"value":"Pune","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":24,"gherkinStepLine":22,"keywordType":"Outcome","textWithKeyword":"Then only rows from warehouse \"Pune\" are visible","stepMatchArguments":[{"group":{"start":25,"value":"\"Pune\"","children":[{"start":26,"value":"Pune","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]}]},
  {"pwTestLine":27,"pickleLine":25,"tags":["@TC-P07","@positive","@validation"],"steps":[{"pwStepLine":28,"gherkinStepLine":26,"keywordType":"Context","textWithKeyword":"Given the buyer is logged in","stepMatchArguments":[]},{"pwStepLine":29,"gherkinStepLine":27,"keywordType":"Context","textWithKeyword":"And the buyer is on the inventory page","stepMatchArguments":[]},{"pwStepLine":30,"gherkinStepLine":28,"keywordType":"Action","textWithKeyword":"When the buyer filters inventory to low stock only","stepMatchArguments":[]},{"pwStepLine":31,"gherkinStepLine":29,"keywordType":"Outcome","textWithKeyword":"Then the low stock rows show the low-stock badge","stepMatchArguments":[]}]},
  {"pwTestLine":34,"pickleLine":32,"tags":["@TC-P08","@positive","@validation"],"steps":[{"pwStepLine":35,"gherkinStepLine":33,"keywordType":"Context","textWithKeyword":"Given the buyer is logged in","stepMatchArguments":[]},{"pwStepLine":36,"gherkinStepLine":34,"keywordType":"Context","textWithKeyword":"And the buyer is on the inventory page","stepMatchArguments":[]},{"pwStepLine":37,"gherkinStepLine":35,"keywordType":"Action","textWithKeyword":"When the buyer changes rows per page to \"25 / page\"","stepMatchArguments":[{"group":{"start":35,"value":"\"25 / page\"","children":[{"start":36,"value":"25 / page","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":38,"gherkinStepLine":36,"keywordType":"Outcome","textWithKeyword":"Then the inventory grid shows a valid page size selection","stepMatchArguments":[]}]},
]; // bdd-data-end