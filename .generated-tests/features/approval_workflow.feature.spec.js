// Generated from: features\approval_workflow.feature
import { test } from "playwright-bdd";

test.describe('CoreERP approval workflow', () => {

  test('Buyer submits and manager approves a purchase order', { tag: ['@TC-P13', '@WF-1', '@positive', '@validation'] }, async ({ Given, When, Then, And, browser, page }) => { 
    await Given('the buyer starts WF-1 with dashboard baselines', null, { page }); 
    await When('the buyer submits the WF-1 sample order', null, { page }); 
    await Then('the buyer dashboard shows the submission deltas', null, { page }); 
    await When('the manager reviews and approves the WF-1 order in a separate context', null, { browser, page }); 
    await Then('the approval queue and dashboard return to the expected deltas', null, { page }); 
    await And('the buyer can see the WF-1 order as approved', null, { page }); 
  });

  test('Dashboard deltas reflect submission and approval', { tag: ['@TC-P14', '@positive', '@validation'] }, async ({ Given, When, Then, browser, page }) => { 
    await Given('the buyer starts WF-1 with dashboard baselines', null, { page }); 
    await When('the buyer submits the WF-1 sample order', null, { page }); 
    await Then('the buyer dashboard shows the submission deltas', null, { page }); 
    await When('the manager reviews and approves the WF-1 order in a separate context', null, { browser, page }); 
    await Then('the approval queue and dashboard return to the expected deltas', null, { page }); 
  });

  test('Buyer sees the final approved status in the list and order detail', { tag: ['@TC-P16', '@positive', '@validation'] }, async ({ Given, When, Then, And, browser, page }) => { 
    await Given('the buyer starts WF-1 with dashboard baselines', null, { page }); 
    await When('the buyer submits the WF-1 sample order', null, { page }); 
    await Then('the buyer dashboard shows the submission deltas', null, { page }); 
    await When('the manager reviews and approves the WF-1 order in a separate context', null, { browser, page }); 
    await Then('the approval queue and dashboard return to the expected deltas', null, { page }); 
    await And('the buyer can see the WF-1 order as approved', null, { page }); 
  });

  test('Buyer order is rejected after a valid reason is provided', { tag: ['@TC-P15', '@WF-2', '@positive', '@validation'] }, async ({ Given, When, Then, And, browser, page }) => { 
    await Given('the buyer starts WF-2 with dashboard baselines', null, { page }); 
    await When('the buyer submits the WF-2 sample order', null, { page }); 
    await Then('the buyer dashboard shows the submission deltas', null, { page }); 
    await When('the manager reviews and rejects the WF-2 order in a separate context', null, { browser, page }); 
    await Then('the rejection queue and dashboard return to the expected deltas', null, { page }); 
    await And('the buyer can see the WF-2 order as rejected', null, { page }); 
  });

  test('A short rejection reason is refused before a valid reason succeeds', { tag: ['@TC-N12', '@negative', '@validation'] }, async ({ Given, When, Then, And, browser, page }) => { 
    await Given('the buyer starts WF-2 with dashboard baselines', null, { page }); 
    await When('the buyer submits the WF-2 sample order', null, { page }); 
    await Then('the buyer dashboard shows the submission deltas', null, { page }); 
    await When('the manager reviews and rejects the WF-2 order in a separate context', null, { browser, page }); 
    await Then('the rejection queue and dashboard return to the expected deltas', null, { page }); 
    await And('the buyer can see the WF-2 order as rejected', null, { page }); 
  });

  test('Buyer submits a multi-line price override order and manager approves it', { tag: ['@TC-P12', '@WF-3', '@positive', '@validation'] }, async ({ Given, When, Then, And, browser, page }) => { 
    await Given('the buyer starts WF-3 with dashboard baselines', null, { page }); 
    await When('the buyer submits the WF-3 multi-line sample order', null, { page }); 
    await Then('the buyer dashboard shows the submission deltas', null, { page }); 
    await When('the manager reviews and approves the WF-3 order in a separate context', null, { browser, page }); 
    await Then('the approval queue and dashboard return to the expected deltas', null, { page }); 
    await And('the buyer can see the WF-3 order as approved', null, { page }); 
  });

  test('Buyer is denied access to Approvals', { tag: ['@TC-N04', '@negative', '@validation', '@WF-5'] }, async ({ Given, When, Then, page }) => { 
    await Given('the buyer is logged in', null, { page }); 
    await When('the buyer opens the Approvals page', null, { page }); 
    await Then('Approvals access is denied to the buyer', null, { page }); 
  });

  test('A saved draft is not available in the manager approval queue', { tag: ['@TC-N10', '@negative', '@validation', '@WF-4'] }, async ({ Given, When, Then, browser, page }) => { 
    await Given('the buyer starts the draft access check with dashboard baselines', null, { page }); 
    await When('the buyer saves the draft used for TC-N10', null, { page }); 
    await Then('the buyer dashboard reflects the saved draft delta', null, { page }); 
    await When('the manager checks the TC-N10 draft in a separate context', null, { browser, page }); 
    await Then('the manager cannot see the draft in Approvals', null, { page }); 
  });

  test('Logging out blocks direct access to Approvals', { tag: ['@TC-N11', '@negative', '@validation', '@WF-5'] }, async ({ Given, When, Then, And, page }) => { 
    await Given('the buyer is logged in', null, { page }); 
    await When('the buyer logs out', null, { page }); 
    await And('the buyer opens the protected Approvals URL directly', null, { page }); 
    await Then('the login page is shown without protected approval content', null, { page }); 
  });

  test('Two pending requests remain independent when one is approved', { tag: ['@TC-E12', '@edge', '@validation', '@WF-1'] }, async ({ Given, When, Then, browser, page }) => { 
    await Given('the buyer starts TC-E12 with dashboard baselines', null, { page }); 
    await When('the buyer submits two TC-E12 sample orders', null, { page }); 
    await Then('the buyer dashboard shows two additional open and pending orders', null, { page }); 
    await When('the manager approves the first TC-E12 order in a separate context', null, { browser, page }); 
    await Then('one TC-E12 order remains pending and dashboard deltas reflect one decision', null, { page }); 
  });

  test('Buyer submits a saved draft for approval later', { tag: ['@TC-P18', '@positive', '@validation', '@WF-4'] }, async ({ Given, When, Then, And, page }) => { 
    await Given('the buyer is logged in', null, { page }); 
    await And('the buyer captures the pending approval baseline for TC-P18', null, { page }); 
    await When('the buyer saves and opens a TC-P18 draft', null, { page }); 
    await Then('the draft order page offers Submit for approval', null, { page }); 
    await When('the buyer submits the saved TC-P18 draft', null, { page }); 
    await Then('the saved draft becomes pending with a submission activity entry', null, { page }); 
    await And('the Pending approval KPI increases by one', null, { page }); 
  });

});

// == technical section ==

test.afterEach('AfterEach Hooks', ({ $runScenarioHooks, page }) => $runScenarioHooks('after', { page }));

test.use({
  $test: [({}, use) => use(test), { scope: 'test', box: true }],
  $uri: [({}, use) => use('features\\approval_workflow.feature'), { scope: 'test', box: true }],
  $bddFileData: [({}, use) => use(bddFileData), { scope: "test", box: true }],
});

const bddFileData = [ // bdd-data-start
  {"pwTestLine":6,"pickleLine":4,"tags":["@TC-P13","@WF-1","@positive","@validation"],"steps":[{"pwStepLine":7,"gherkinStepLine":5,"keywordType":"Context","textWithKeyword":"Given the buyer starts WF-1 with dashboard baselines","stepMatchArguments":[]},{"pwStepLine":8,"gherkinStepLine":6,"keywordType":"Action","textWithKeyword":"When the buyer submits the WF-1 sample order","stepMatchArguments":[]},{"pwStepLine":9,"gherkinStepLine":7,"keywordType":"Outcome","textWithKeyword":"Then the buyer dashboard shows the submission deltas","stepMatchArguments":[]},{"pwStepLine":10,"gherkinStepLine":8,"keywordType":"Action","textWithKeyword":"When the manager reviews and approves the WF-1 order in a separate context","stepMatchArguments":[]},{"pwStepLine":11,"gherkinStepLine":9,"keywordType":"Outcome","textWithKeyword":"Then the approval queue and dashboard return to the expected deltas","stepMatchArguments":[]},{"pwStepLine":12,"gherkinStepLine":10,"keywordType":"Outcome","textWithKeyword":"And the buyer can see the WF-1 order as approved","stepMatchArguments":[{"group":{"start":25,"value":"1"},"parameterTypeName":"int"}]}]},
  {"pwTestLine":15,"pickleLine":13,"tags":["@TC-P14","@positive","@validation"],"steps":[{"pwStepLine":16,"gherkinStepLine":14,"keywordType":"Context","textWithKeyword":"Given the buyer starts WF-1 with dashboard baselines","stepMatchArguments":[]},{"pwStepLine":17,"gherkinStepLine":15,"keywordType":"Action","textWithKeyword":"When the buyer submits the WF-1 sample order","stepMatchArguments":[]},{"pwStepLine":18,"gherkinStepLine":16,"keywordType":"Outcome","textWithKeyword":"Then the buyer dashboard shows the submission deltas","stepMatchArguments":[]},{"pwStepLine":19,"gherkinStepLine":17,"keywordType":"Action","textWithKeyword":"When the manager reviews and approves the WF-1 order in a separate context","stepMatchArguments":[]},{"pwStepLine":20,"gherkinStepLine":18,"keywordType":"Outcome","textWithKeyword":"Then the approval queue and dashboard return to the expected deltas","stepMatchArguments":[]}]},
  {"pwTestLine":23,"pickleLine":21,"tags":["@TC-P16","@positive","@validation"],"steps":[{"pwStepLine":24,"gherkinStepLine":22,"keywordType":"Context","textWithKeyword":"Given the buyer starts WF-1 with dashboard baselines","stepMatchArguments":[]},{"pwStepLine":25,"gherkinStepLine":23,"keywordType":"Action","textWithKeyword":"When the buyer submits the WF-1 sample order","stepMatchArguments":[]},{"pwStepLine":26,"gherkinStepLine":24,"keywordType":"Outcome","textWithKeyword":"Then the buyer dashboard shows the submission deltas","stepMatchArguments":[]},{"pwStepLine":27,"gherkinStepLine":25,"keywordType":"Action","textWithKeyword":"When the manager reviews and approves the WF-1 order in a separate context","stepMatchArguments":[]},{"pwStepLine":28,"gherkinStepLine":26,"keywordType":"Outcome","textWithKeyword":"Then the approval queue and dashboard return to the expected deltas","stepMatchArguments":[]},{"pwStepLine":29,"gherkinStepLine":27,"keywordType":"Outcome","textWithKeyword":"And the buyer can see the WF-1 order as approved","stepMatchArguments":[{"group":{"start":25,"value":"1"},"parameterTypeName":"int"}]}]},
  {"pwTestLine":32,"pickleLine":30,"tags":["@TC-P15","@WF-2","@positive","@validation"],"steps":[{"pwStepLine":33,"gherkinStepLine":31,"keywordType":"Context","textWithKeyword":"Given the buyer starts WF-2 with dashboard baselines","stepMatchArguments":[]},{"pwStepLine":34,"gherkinStepLine":32,"keywordType":"Action","textWithKeyword":"When the buyer submits the WF-2 sample order","stepMatchArguments":[]},{"pwStepLine":35,"gherkinStepLine":33,"keywordType":"Outcome","textWithKeyword":"Then the buyer dashboard shows the submission deltas","stepMatchArguments":[]},{"pwStepLine":36,"gherkinStepLine":34,"keywordType":"Action","textWithKeyword":"When the manager reviews and rejects the WF-2 order in a separate context","stepMatchArguments":[]},{"pwStepLine":37,"gherkinStepLine":35,"keywordType":"Outcome","textWithKeyword":"Then the rejection queue and dashboard return to the expected deltas","stepMatchArguments":[]},{"pwStepLine":38,"gherkinStepLine":36,"keywordType":"Outcome","textWithKeyword":"And the buyer can see the WF-2 order as rejected","stepMatchArguments":[]}]},
  {"pwTestLine":41,"pickleLine":39,"tags":["@TC-N12","@negative","@validation"],"steps":[{"pwStepLine":42,"gherkinStepLine":40,"keywordType":"Context","textWithKeyword":"Given the buyer starts WF-2 with dashboard baselines","stepMatchArguments":[]},{"pwStepLine":43,"gherkinStepLine":41,"keywordType":"Action","textWithKeyword":"When the buyer submits the WF-2 sample order","stepMatchArguments":[]},{"pwStepLine":44,"gherkinStepLine":42,"keywordType":"Outcome","textWithKeyword":"Then the buyer dashboard shows the submission deltas","stepMatchArguments":[]},{"pwStepLine":45,"gherkinStepLine":43,"keywordType":"Action","textWithKeyword":"When the manager reviews and rejects the WF-2 order in a separate context","stepMatchArguments":[]},{"pwStepLine":46,"gherkinStepLine":44,"keywordType":"Outcome","textWithKeyword":"Then the rejection queue and dashboard return to the expected deltas","stepMatchArguments":[]},{"pwStepLine":47,"gherkinStepLine":45,"keywordType":"Outcome","textWithKeyword":"And the buyer can see the WF-2 order as rejected","stepMatchArguments":[]}]},
  {"pwTestLine":50,"pickleLine":48,"tags":["@TC-P12","@WF-3","@positive","@validation"],"steps":[{"pwStepLine":51,"gherkinStepLine":49,"keywordType":"Context","textWithKeyword":"Given the buyer starts WF-3 with dashboard baselines","stepMatchArguments":[]},{"pwStepLine":52,"gherkinStepLine":50,"keywordType":"Action","textWithKeyword":"When the buyer submits the WF-3 multi-line sample order","stepMatchArguments":[]},{"pwStepLine":53,"gherkinStepLine":51,"keywordType":"Outcome","textWithKeyword":"Then the buyer dashboard shows the submission deltas","stepMatchArguments":[]},{"pwStepLine":54,"gherkinStepLine":52,"keywordType":"Action","textWithKeyword":"When the manager reviews and approves the WF-3 order in a separate context","stepMatchArguments":[]},{"pwStepLine":55,"gherkinStepLine":53,"keywordType":"Outcome","textWithKeyword":"Then the approval queue and dashboard return to the expected deltas","stepMatchArguments":[]},{"pwStepLine":56,"gherkinStepLine":54,"keywordType":"Outcome","textWithKeyword":"And the buyer can see the WF-3 order as approved","stepMatchArguments":[{"group":{"start":25,"value":"3"},"parameterTypeName":"int"}]}]},
  {"pwTestLine":59,"pickleLine":57,"tags":["@TC-N04","@negative","@validation","@WF-5"],"steps":[{"pwStepLine":60,"gherkinStepLine":58,"keywordType":"Context","textWithKeyword":"Given the buyer is logged in","stepMatchArguments":[]},{"pwStepLine":61,"gherkinStepLine":59,"keywordType":"Action","textWithKeyword":"When the buyer opens the Approvals page","stepMatchArguments":[]},{"pwStepLine":62,"gherkinStepLine":60,"keywordType":"Outcome","textWithKeyword":"Then Approvals access is denied to the buyer","stepMatchArguments":[]}]},
  {"pwTestLine":65,"pickleLine":63,"tags":["@TC-N10","@negative","@validation","@WF-4"],"steps":[{"pwStepLine":66,"gherkinStepLine":64,"keywordType":"Context","textWithKeyword":"Given the buyer starts the draft access check with dashboard baselines","stepMatchArguments":[]},{"pwStepLine":67,"gherkinStepLine":65,"keywordType":"Action","textWithKeyword":"When the buyer saves the draft used for TC-N10","stepMatchArguments":[]},{"pwStepLine":68,"gherkinStepLine":66,"keywordType":"Outcome","textWithKeyword":"Then the buyer dashboard reflects the saved draft delta","stepMatchArguments":[]},{"pwStepLine":69,"gherkinStepLine":67,"keywordType":"Action","textWithKeyword":"When the manager checks the TC-N10 draft in a separate context","stepMatchArguments":[]},{"pwStepLine":70,"gherkinStepLine":68,"keywordType":"Outcome","textWithKeyword":"Then the manager cannot see the draft in Approvals","stepMatchArguments":[]}]},
  {"pwTestLine":73,"pickleLine":71,"tags":["@TC-N11","@negative","@validation","@WF-5"],"steps":[{"pwStepLine":74,"gherkinStepLine":72,"keywordType":"Context","textWithKeyword":"Given the buyer is logged in","stepMatchArguments":[]},{"pwStepLine":75,"gherkinStepLine":73,"keywordType":"Action","textWithKeyword":"When the buyer logs out","stepMatchArguments":[]},{"pwStepLine":76,"gherkinStepLine":74,"keywordType":"Action","textWithKeyword":"And the buyer opens the protected Approvals URL directly","stepMatchArguments":[]},{"pwStepLine":77,"gherkinStepLine":75,"keywordType":"Outcome","textWithKeyword":"Then the login page is shown without protected approval content","stepMatchArguments":[]}]},
  {"pwTestLine":80,"pickleLine":78,"tags":["@TC-E12","@edge","@validation","@WF-1"],"steps":[{"pwStepLine":81,"gherkinStepLine":79,"keywordType":"Context","textWithKeyword":"Given the buyer starts TC-E12 with dashboard baselines","stepMatchArguments":[]},{"pwStepLine":82,"gherkinStepLine":80,"keywordType":"Action","textWithKeyword":"When the buyer submits two TC-E12 sample orders","stepMatchArguments":[]},{"pwStepLine":83,"gherkinStepLine":81,"keywordType":"Outcome","textWithKeyword":"Then the buyer dashboard shows two additional open and pending orders","stepMatchArguments":[]},{"pwStepLine":84,"gherkinStepLine":82,"keywordType":"Action","textWithKeyword":"When the manager approves the first TC-E12 order in a separate context","stepMatchArguments":[]},{"pwStepLine":85,"gherkinStepLine":83,"keywordType":"Outcome","textWithKeyword":"Then one TC-E12 order remains pending and dashboard deltas reflect one decision","stepMatchArguments":[]}]},
  {"pwTestLine":88,"pickleLine":86,"tags":["@TC-P18","@positive","@validation","@WF-4"],"steps":[{"pwStepLine":89,"gherkinStepLine":87,"keywordType":"Context","textWithKeyword":"Given the buyer is logged in","stepMatchArguments":[]},{"pwStepLine":90,"gherkinStepLine":88,"keywordType":"Context","textWithKeyword":"And the buyer captures the pending approval baseline for TC-P18","stepMatchArguments":[]},{"pwStepLine":91,"gherkinStepLine":89,"keywordType":"Action","textWithKeyword":"When the buyer saves and opens a TC-P18 draft","stepMatchArguments":[]},{"pwStepLine":92,"gherkinStepLine":90,"keywordType":"Outcome","textWithKeyword":"Then the draft order page offers Submit for approval","stepMatchArguments":[]},{"pwStepLine":93,"gherkinStepLine":91,"keywordType":"Action","textWithKeyword":"When the buyer submits the saved TC-P18 draft","stepMatchArguments":[]},{"pwStepLine":94,"gherkinStepLine":92,"keywordType":"Outcome","textWithKeyword":"Then the saved draft becomes pending with a submission activity entry","stepMatchArguments":[]},{"pwStepLine":95,"gherkinStepLine":93,"keywordType":"Outcome","textWithKeyword":"And the Pending approval KPI increases by one","stepMatchArguments":[]}]},
]; // bdd-data-end