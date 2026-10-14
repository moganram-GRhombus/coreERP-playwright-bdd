const { expect } = require('@playwright/test');
const { createBdd } = require('playwright-bdd');
const { ApprovalsPage } = require('../pages/ApprovalsPage');
const { DashboardPage } = require('../pages/DashboardPage');
const { LoginPage } = require('../pages/LoginPage');
const { NewPurchaseOrderPage } = require('../pages/NewPurchaseOrderPage');
const { PurchaseOrderDetailPage } = require('../pages/PurchaseOrderDetailPage');
const { PurchaseOrderListPage } = require('../pages/PurchaseOrderListPage');
const { RejectOrderDialog } = require('../pages/RejectOrderDialog');

const { Given, When, Then, After } = createBdd();
const flows = new WeakMap();

function flowFor(page) {
  const flow = flows.get(page);
  if (!flow) throw new Error('WF-1 state was not initialized for this scenario');
  return flow;
}

async function signInAsManagerFromCopiedState(page) {
  const dashboardPage = new DashboardPage(page);
  const loginPage = new LoginPage(page);
  await page.goto('/apps/erp/dashboard', { waitUntil: 'domcontentloaded' });
  await dashboardPage.welcomeName.waitFor({ state: 'visible' });
  await loginPage.logout();
  await loginPage.form.waitFor({ state: 'visible' });
  await loginPage.login('manager', 'Erp@123');
  return loginPage;
}

Given('the buyer starts WF-1 with dashboard baselines', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.open();
  await loginPage.login('buyer', 'Erp@123');
  await expect(page).toHaveURL(/\/dashboard$/);

  const dashboardPage = new DashboardPage(page);
  await dashboardPage.open();
  flows.set(page, { baseline: await dashboardPage.readMetrics() });
});

When('the buyer submits the WF-1 sample order', async ({ page }) => {
  const flow = flowFor(page);
  const purchaseOrderPage = new NewPurchaseOrderPage(page);
  await purchaseOrderPage.open();
  await purchaseOrderPage.selectVendor('SafeGuard PPE Co.');
  await purchaseOrderPage.selectDeliveryWindow(14);
  await purchaseOrderPage.addLine();
  await purchaseOrderPage.selectItem(0, 'SKU-1012');
  await purchaseOrderPage.fillQuantity(0, 10);
  await purchaseOrderPage.fillUnitPrice(0, 200);
  await purchaseOrderPage.submitButton.click();

  const detailPage = new PurchaseOrderDetailPage(page);
  await expect(page).toHaveURL(/\/apps\/erp\/po\/PO-/);
  flow.poNumber = await detailPage.heading.innerText();
  flow.poTotal = Number((await detailPage.total.innerText()).replace(/[^\d.]/g, ''));
  flow.vendor = 'SafeGuard PPE Co.';
  flow.poTotalText = '₹2,360.00';
  await expect(detailPage.pendingApprovalStatus).toBeVisible();
  await expect(detailPage.itemRows.nth(1)).toContainText('SKU-1012');
  await expect(detailPage.itemRows.nth(1)).toContainText('₹2,000.00');

  const dashboardPage = new DashboardPage(page);
  await dashboardPage.open();
  flow.afterSubmit = await dashboardPage.readMetrics();
});

Then('the buyer dashboard shows the submission deltas', async ({ page }) => {
  const { baseline, afterSubmit } = flowFor(page);
  expect(afterSubmit.openPurchaseOrders).toBe(baseline.openPurchaseOrders + 1);
  expect(afterSubmit.pendingApproval).toBe(baseline.pendingApproval + 1);
  expect(afterSubmit.approvedSpend).toBe(baseline.approvedSpend);
});

When('the manager reviews and approves the WF-1 order in a separate context', async ({ browser, page }) => {
  const flow = flowFor(page);
  const buyerStorageState = await page.context().storageState();
  flow.managerContext = await browser.newContext({ storageState: buyerStorageState });
  flow.managerPage = await flow.managerContext.newPage();

  const loginPage = await signInAsManagerFromCopiedState(flow.managerPage);

  const approvalsPage = new ApprovalsPage(flow.managerPage);
  await approvalsPage.open();
  const orderCard = approvalsPage.orderCard(flow.poNumber);
  await expect(orderCard).toContainText('SafeGuard PPE Co.');
  await expect(orderCard).toContainText('1 line');
  await expect(orderCard).toContainText('Neha Sharma');
  await expect(orderCard).toContainText('₹2,360.00');
  await approvalsPage.reviewLink(flow.poNumber).click();

  const detailPage = new PurchaseOrderDetailPage(flow.managerPage);
  await expect(detailPage.heading).toHaveText(flow.poNumber);
  await expect(detailPage.pendingApprovalStatus).toBeVisible();
  await expect(detailPage.itemRows.nth(1)).toContainText('SKU-1012');
  await expect(detailPage.itemRows.nth(1)).toContainText('₹2,000.00');
  await detailPage.approveButton.click();
  await expect(detailPage.approvedStatus).toBeVisible();

  await approvalsPage.open();
  await expect(approvalsPage.orderCard(flow.poNumber)).toHaveCount(0);
  await expect(approvalsPage.awaitingCount).toHaveText('0 awaiting your decision');
  await expect(approvalsPage.allCaughtUp).toBeVisible();

  const purchaseOrderListPage = new PurchaseOrderListPage(flow.managerPage);
  await purchaseOrderListPage.open();
  const orderRow = purchaseOrderListPage.orderRow(flow.poNumber);
  await expect(orderRow).toContainText('Approved');
  await expect(orderRow).toContainText(flow.vendor);
  await expect(orderRow).toContainText(flow.poTotalText);

  const dashboardPage = new DashboardPage(flow.managerPage);
  await dashboardPage.open();
  flow.afterApproval = await dashboardPage.readMetrics();

  await loginPage.logout();
  await loginPage.form.waitFor({ state: 'visible' });
  await loginPage.login('buyer', 'Erp@123');
  const approvedBuyerState = await flow.managerContext.storageState();
  flow.finalBuyerContext = await browser.newContext({ storageState: approvedBuyerState });
  flow.finalBuyerPage = await flow.finalBuyerContext.newPage();
});

Then('the approval queue and dashboard return to the expected deltas', async ({ page }) => {
  const { baseline, afterSubmit, afterApproval, poTotal } = flowFor(page);
  expect(afterSubmit.openPurchaseOrders).toBe(baseline.openPurchaseOrders + 1);
  expect(afterSubmit.pendingApproval).toBe(baseline.pendingApproval + 1);
  expect(afterApproval.openPurchaseOrders).toBe(baseline.openPurchaseOrders);
  expect(afterApproval.pendingApproval).toBe(baseline.pendingApproval);
  expect(afterApproval.approvedSpend - baseline.approvedSpend).toBeCloseTo(poTotal, 2);
});

Then('the buyer can see the WF-{int} order as approved', async ({ page }, workflowNumber) => {
  const flow = flowFor(page);
  expect(workflowNumber).toBeGreaterThan(0);
  const purchaseOrderListPage = new PurchaseOrderListPage(flow.finalBuyerPage);
  await purchaseOrderListPage.open();
  const orderRow = purchaseOrderListPage.orderRow(flow.poNumber);
  await expect(orderRow).toContainText('Approved');
  await expect(orderRow).toContainText(flow.vendor);
  await expect(orderRow).toContainText(flow.poTotalText);
  await flow.finalBuyerPage.goto(`/apps/erp/po/${flow.poNumber}`);
  const detailPage = new PurchaseOrderDetailPage(flow.finalBuyerPage);
  await expect(detailPage.heading).toHaveText(flow.poNumber);
  await expect(detailPage.approvedStatus).toBeVisible();
});

Given('the buyer starts WF-2 with dashboard baselines', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.open();
  await loginPage.login('buyer', 'Erp@123');
  await expect(page).toHaveURL(/\/dashboard$/);

  const dashboardPage = new DashboardPage(page);
  await dashboardPage.open();
  flows.set(page, { baseline: await dashboardPage.readMetrics() });
});

When('the buyer submits the WF-2 sample order', async ({ page }) => {
  const flow = flowFor(page);
  const purchaseOrderPage = new NewPurchaseOrderPage(page);
  await purchaseOrderPage.open();
  await purchaseOrderPage.selectVendor('Apex Industrial Supplies');
  await purchaseOrderPage.selectDeliveryWindow(7);
  await purchaseOrderPage.addLine();
  await purchaseOrderPage.selectItem(0, 'SKU-1003');
  await purchaseOrderPage.fillQuantity(0, 5);
  await purchaseOrderPage.submitButton.click();

  const detailPage = new PurchaseOrderDetailPage(page);
  await expect(page).toHaveURL(/\/apps\/erp\/po\/PO-/);
  flow.poNumber = await detailPage.heading.innerText();
  flow.poTotal = Number((await detailPage.total.innerText()).replace(/[^\d.]/g, ''));
  flow.vendor = 'Apex Industrial Supplies';
  flow.poTotalText = '₹1,410.10';
  await expect(detailPage.pendingApprovalStatus).toBeVisible();
  await expect(detailPage.itemRows.nth(1)).toContainText('SKU-1003');

  const dashboardPage = new DashboardPage(page);
  await dashboardPage.open();
  flow.afterSubmit = await dashboardPage.readMetrics();
});

When('the manager reviews and rejects the WF-2 order in a separate context', async ({ browser, page }) => {
  const flow = flowFor(page);
  const buyerStorageState = await page.context().storageState();
  flow.managerContext = await browser.newContext({ storageState: buyerStorageState });
  flow.managerPage = await flow.managerContext.newPage();

  const loginPage = await signInAsManagerFromCopiedState(flow.managerPage);

  const approvalsPage = new ApprovalsPage(flow.managerPage);
  await approvalsPage.open();
  const orderCard = approvalsPage.orderCard(flow.poNumber);
  await expect(orderCard).toContainText('Apex Industrial Supplies');
  await expect(orderCard).toContainText('1 line');
  await expect(orderCard).toContainText('Neha Sharma');
  await expect(orderCard).toContainText('₹1,410.10');
  await approvalsPage.reviewLink(flow.poNumber).click();

  const detailPage = new PurchaseOrderDetailPage(flow.managerPage);
  await expect(detailPage.heading).toHaveText(flow.poNumber);
  await expect(detailPage.pendingApprovalStatus).toBeVisible();
  await detailPage.rejectButton.click();

  const rejectDialog = new RejectOrderDialog(flow.managerPage);
  await expect(rejectDialog.title(flow.poNumber)).toBeVisible();
  await expect(rejectDialog.reason).toBeVisible();
  await expect(rejectDialog.rejectButton).toBeVisible();
  await rejectDialog.reason.fill('none');
  await rejectDialog.rejectButton.click();
  await expect(rejectDialog.minimumReasonMessage).toBeVisible();
  await expect(detailPage.pendingApprovalStatus).toBeVisible();

  await rejectDialog.reason.fill('Price is higher than the agreed rate');
  await rejectDialog.rejectButton.click();
  await expect(detailPage.rejectedStatus).toBeVisible();
  await expect(detailPage.activityTimeline).toContainText('Rejected by Rahul Mehta');
  await expect(detailPage.activityTimeline).toContainText('“Price is higher than the agreed rate”');

  await approvalsPage.open();
  await expect(approvalsPage.orderCard(flow.poNumber)).toHaveCount(0);

  const dashboardPage = new DashboardPage(flow.managerPage);
  await dashboardPage.open();
  flow.afterDecision = await dashboardPage.readMetrics();

  await loginPage.logout();
  await loginPage.form.waitFor({ state: 'visible' });
  await loginPage.login('buyer', 'Erp@123');
  const rejectedBuyerState = await flow.managerContext.storageState();
  flow.finalBuyerContext = await browser.newContext({ storageState: rejectedBuyerState });
  flow.finalBuyerPage = await flow.finalBuyerContext.newPage();
});

Then('the rejection queue and dashboard return to the expected deltas', async ({ page }) => {
  const { baseline, afterSubmit, afterDecision, poTotal } = flowFor(page);
  expect(afterSubmit.openPurchaseOrders).toBe(baseline.openPurchaseOrders + 1);
  expect(afterSubmit.pendingApproval).toBe(baseline.pendingApproval + 1);
  expect(afterDecision.openPurchaseOrders).toBe(baseline.openPurchaseOrders);
  expect(afterDecision.pendingApproval).toBe(baseline.pendingApproval);
  expect(afterDecision.approvedSpend).toBe(baseline.approvedSpend);
  expect(poTotal).toBe(1410.1);
});

Then('the buyer can see the WF-2 order as rejected', async ({ page }) => {
  const flow = flowFor(page);
  const purchaseOrderListPage = new PurchaseOrderListPage(flow.finalBuyerPage);
  await purchaseOrderListPage.open();
  await expect(purchaseOrderListPage.orderRow(flow.poNumber)).toContainText('Rejected');
  await flow.finalBuyerPage.goto(`/apps/erp/po/${flow.poNumber}`);
  const detailPage = new PurchaseOrderDetailPage(flow.finalBuyerPage);
  await expect(detailPage.heading).toHaveText(flow.poNumber);
  await expect(detailPage.rejectedStatus).toBeVisible();
});

Given('the buyer starts WF-3 with dashboard baselines', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.open();
  await loginPage.login('buyer', 'Erp@123');
  await expect(page).toHaveURL(/\/dashboard$/);

  const dashboardPage = new DashboardPage(page);
  await dashboardPage.open();
  flows.set(page, { baseline: await dashboardPage.readMetrics() });
});

When('the buyer submits the WF-3 multi-line sample order', async ({ page }) => {
  const flow = flowFor(page);
  const purchaseOrderPage = new NewPurchaseOrderPage(page);
  await purchaseOrderPage.open();
  await purchaseOrderPage.selectVendor('Apex Industrial Supplies');
  await purchaseOrderPage.selectDeliveryWindow(30);
  await purchaseOrderPage.addLine();
  await purchaseOrderPage.selectItem(0, 'SKU-1001');
  await purchaseOrderPage.fillQuantity(0, 5);
  await purchaseOrderPage.fillUnitPrice(0, 45);
  await purchaseOrderPage.addLine();
  await purchaseOrderPage.selectItem(1, 'SKU-1002');
  await purchaseOrderPage.fillQuantity(1, 20);
  await purchaseOrderPage.fillUnitPrice(1, 150);
  await expect(await purchaseOrderPage.lineTotal(0)).toHaveText('₹225.00');
  await expect(await purchaseOrderPage.lineTotal(1)).toHaveText('₹3,000.00');
  await expect(purchaseOrderPage.subtotal).toHaveText('₹3,225.00');
  await expect(purchaseOrderPage.gst).toHaveText('₹580.50');
  await expect(purchaseOrderPage.total).toHaveText('₹3,805.50');
  await purchaseOrderPage.submitButton.click();

  const detailPage = new PurchaseOrderDetailPage(page);
  await expect(page).toHaveURL(/\/apps\/erp\/po\/PO-/);
  flow.poNumber = await detailPage.heading.innerText();
  flow.poTotal = Number((await detailPage.total.innerText()).replace(/[^\d.]/g, ''));
  flow.vendor = 'Apex Industrial Supplies';
  flow.poTotalText = '₹3,805.50';
  await expect(detailPage.pendingApprovalStatus).toBeVisible();
  await expect(detailPage.itemRows.nth(1)).toContainText('SKU-1001');
  await expect(detailPage.itemRows.nth(1)).toContainText('₹225.00');
  await expect(detailPage.itemRows.nth(2)).toContainText('SKU-1002');
  await expect(detailPage.itemRows.nth(2)).toContainText('₹3,000.00');
  await expect(detailPage.total).toHaveText('₹3,805.50');

  const dashboardPage = new DashboardPage(page);
  await dashboardPage.open();
  flow.afterSubmit = await dashboardPage.readMetrics();
});

When('the manager reviews and approves the WF-3 order in a separate context', async ({ browser, page }) => {
  const flow = flowFor(page);
  const buyerStorageState = await page.context().storageState();
  flow.managerContext = await browser.newContext({ storageState: buyerStorageState });
  flow.managerPage = await flow.managerContext.newPage();

  const loginPage = await signInAsManagerFromCopiedState(flow.managerPage);

  const approvalsPage = new ApprovalsPage(flow.managerPage);
  await approvalsPage.open();
  const orderCard = approvalsPage.orderCard(flow.poNumber);
  await expect(orderCard).toContainText('Apex Industrial Supplies');
  await expect(orderCard).toContainText('2 lines');
  await expect(orderCard).toContainText('Neha Sharma');
  await expect(orderCard).toContainText('₹3,805.50');
  await approvalsPage.reviewLink(flow.poNumber).click();

  const detailPage = new PurchaseOrderDetailPage(flow.managerPage);
  await expect(detailPage.heading).toHaveText(flow.poNumber);
  await expect(detailPage.pendingApprovalStatus).toBeVisible();
  await expect(detailPage.itemRows.nth(1)).toContainText('SKU-1001');
  await expect(detailPage.itemRows.nth(1)).toContainText('₹225.00');
  await expect(detailPage.itemRows.nth(2)).toContainText('SKU-1002');
  await expect(detailPage.itemRows.nth(2)).toContainText('₹3,000.00');
  await expect(detailPage.total).toHaveText('₹3,805.50');
  await detailPage.approveButton.click();
  await expect(detailPage.approvedStatus).toBeVisible();

  await approvalsPage.open();
  await expect(approvalsPage.orderCard(flow.poNumber)).toHaveCount(0);
  await expect(approvalsPage.awaitingCount).toHaveText('0 awaiting your decision');
  await expect(approvalsPage.allCaughtUp).toBeVisible();

  const dashboardPage = new DashboardPage(flow.managerPage);
  await dashboardPage.open();
  flow.afterApproval = await dashboardPage.readMetrics();

  await loginPage.logout();
  await loginPage.form.waitFor({ state: 'visible' });
  await loginPage.login('buyer', 'Erp@123');
  const approvedBuyerState = await flow.managerContext.storageState();
  flow.finalBuyerContext = await browser.newContext({ storageState: approvedBuyerState });
  flow.finalBuyerPage = await flow.finalBuyerContext.newPage();
});

When('the buyer opens the Approvals page', async ({ page }) => {
  const approvalsPage = new ApprovalsPage(page);
  await approvalsPage.open();
});

Then('Approvals access is denied to the buyer', async ({ page }) => {
  const approvalsPage = new ApprovalsPage(page);
  await expect(approvalsPage.accessDeniedHeading).toBeVisible();
  await expect(approvalsPage.accessDeniedMessage).toBeVisible();
  await expect(approvalsPage.reviewLinks).toHaveCount(0);
  await expect(approvalsPage.approveButtons).toHaveCount(0);
});

Given('the buyer starts the draft access check with dashboard baselines', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.open();
  await loginPage.login('buyer', 'Erp@123');
  await expect(page).toHaveURL(/\/dashboard$/);
  const dashboardPage = new DashboardPage(page);
  await dashboardPage.open();
  flows.set(page, { baseline: await dashboardPage.readMetrics() });
});

When('the buyer saves the draft used for TC-N10', async ({ page }) => {
  const flow = flowFor(page);
  const form = new NewPurchaseOrderPage(page);
  await form.open();
  await form.selectVendor('PackRight Solutions');
  await form.selectDeliveryWindow(7);
  await form.addLine();
  await form.selectItem(0, 'SKU-1010');
  await form.fillQuantity(0, 100);
  await form.saveDraftButton.click();

  const detailPage = new PurchaseOrderDetailPage(page);
  await expect(page).toHaveURL(/\/apps\/erp\/po\/PO-/);
  flow.poNumber = await detailPage.heading.innerText();
  await expect(detailPage.draftStatus).toBeVisible();

  const dashboardPage = new DashboardPage(page);
  await dashboardPage.open();
  flow.afterDraft = await dashboardPage.readMetrics();
});

Then('the buyer dashboard reflects the saved draft delta', async ({ page }) => {
  const { baseline, afterDraft } = flowFor(page);
  expect(afterDraft.openPurchaseOrders).toBe(baseline.openPurchaseOrders + 1);
  expect(afterDraft.pendingApproval).toBe(baseline.pendingApproval);
  expect(afterDraft.approvedSpend).toBe(baseline.approvedSpend);
});

When('the manager checks the TC-N10 draft in a separate context', async ({ browser, page }) => {
  const flow = flowFor(page);
  const buyerStorageState = await page.context().storageState();
  flow.managerContext = await browser.newContext({ storageState: buyerStorageState });
  flow.managerPage = await flow.managerContext.newPage();

  await signInAsManagerFromCopiedState(flow.managerPage);

  const approvalsPage = new ApprovalsPage(flow.managerPage);
  await approvalsPage.open();
  flow.draftCardCount = await approvalsPage.orderCard(flow.poNumber).count();
  const dashboardPage = new DashboardPage(flow.managerPage);
  await dashboardPage.open();
  flow.managerDraftMetrics = await dashboardPage.readMetrics();
});

Then('the manager cannot see the draft in Approvals', async ({ page }) => {
  const { baseline, poNumber, draftCardCount, managerDraftMetrics } = flowFor(page);
  expect(draftCardCount).toBe(0);
  expect(managerDraftMetrics.openPurchaseOrders).toBe(baseline.openPurchaseOrders + 1);
  expect(managerDraftMetrics.pendingApproval).toBe(baseline.pendingApproval);
  expect(managerDraftMetrics.approvedSpend).toBe(baseline.approvedSpend);
  expect(poNumber).toMatch(/^PO-/);
});

When('the buyer opens the protected Approvals URL directly', async ({ page }) => {
  await page.goto('/apps/erp/approvals');
  await expect(page).toHaveURL(/\/apps\/erp\/?$/);
});

Then('the login page is shown without protected approval content', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const approvalsPage = new ApprovalsPage(page);
  await expect(loginPage.form).toBeVisible();
  await expect(approvalsPage.heading).toHaveCount(0);
  await expect(approvalsPage.reviewLinks).toHaveCount(0);
  await expect(approvalsPage.approveButtons).toHaveCount(0);
});

Given('the buyer starts TC-E12 with dashboard baselines', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.open();
  await loginPage.login('buyer', 'Erp@123');
  await expect(page).toHaveURL(/\/dashboard$/);
  const dashboardPage = new DashboardPage(page);
  await dashboardPage.open();
  flows.set(page, { baseline: await dashboardPage.readMetrics() });
});

When('the buyer submits two TC-E12 sample orders', async ({ page }) => {
  const flow = flowFor(page);
  const form = new NewPurchaseOrderPage(page);

  await form.open();
  await form.selectVendor('SafeGuard PPE Co.');
  await form.selectDeliveryWindow(14);
  await form.addLine();
  await form.selectItem(0, 'SKU-1012');
  await form.fillQuantity(0, 10);
  await form.fillUnitPrice(0, 200);
  await form.submitButton.click();
  const firstDetail = new PurchaseOrderDetailPage(page);
  await expect(page).toHaveURL(/\/apps\/erp\/po\/PO-/);
  flow.firstPoNumber = await firstDetail.heading.innerText();
  flow.firstPoTotal = Number((await firstDetail.total.innerText()).replace(/[^\d.]/g, ''));

  await form.open();
  await form.selectVendor('Apex Industrial Supplies');
  await form.selectDeliveryWindow(7);
  await form.addLine();
  await form.selectItem(0, 'SKU-1003');
  await form.fillQuantity(0, 5);
  await form.submitButton.click();
  const secondDetail = new PurchaseOrderDetailPage(page);
  await expect(page).toHaveURL(/\/apps\/erp\/po\/PO-/);
  flow.secondPoNumber = await secondDetail.heading.innerText();

  const dashboardPage = new DashboardPage(page);
  await dashboardPage.open();
  flow.afterTwoSubmissions = await dashboardPage.readMetrics();
});

Then('the buyer dashboard shows two additional open and pending orders', async ({ page }) => {
  const { baseline, afterTwoSubmissions } = flowFor(page);
  expect(afterTwoSubmissions.openPurchaseOrders).toBe(baseline.openPurchaseOrders + 2);
  expect(afterTwoSubmissions.pendingApproval).toBe(baseline.pendingApproval + 2);
  expect(afterTwoSubmissions.approvedSpend).toBe(baseline.approvedSpend);
});

When('the manager approves the first TC-E12 order in a separate context', async ({ browser, page }) => {
  const flow = flowFor(page);
  const buyerStorageState = await page.context().storageState();
  flow.managerContext = await browser.newContext({ storageState: buyerStorageState });
  flow.managerPage = await flow.managerContext.newPage();

  await signInAsManagerFromCopiedState(flow.managerPage);

  const approvalsPage = new ApprovalsPage(flow.managerPage);
  await approvalsPage.open();
  await expect(approvalsPage.orderCard(flow.firstPoNumber)).toBeVisible();
  await expect(approvalsPage.orderCard(flow.secondPoNumber)).toBeVisible();
  await approvalsPage.reviewLink(flow.firstPoNumber).click();

  const detailPage = new PurchaseOrderDetailPage(flow.managerPage);
  await expect(detailPage.heading).toHaveText(flow.firstPoNumber);
  await detailPage.approveButton.click();
  await expect(detailPage.approvedStatus).toBeVisible();

  await approvalsPage.open();
  await expect(approvalsPage.orderCard(flow.firstPoNumber)).toHaveCount(0);
  await expect(approvalsPage.orderCard(flow.secondPoNumber)).toBeVisible();
  flow.awaitingAfterOneDecision = await approvalsPage.readAwaitingCount();

  const dashboardPage = new DashboardPage(flow.managerPage);
  await dashboardPage.open();
  flow.afterOneDecision = await dashboardPage.readMetrics();
});

Then('one TC-E12 order remains pending and dashboard deltas reflect one decision', async ({ page }) => {
  const { baseline, afterTwoSubmissions, afterOneDecision, awaitingAfterOneDecision, firstPoTotal } = flowFor(page);
  expect(afterTwoSubmissions.openPurchaseOrders).toBe(baseline.openPurchaseOrders + 2);
  expect(afterTwoSubmissions.pendingApproval).toBe(baseline.pendingApproval + 2);
  expect(afterOneDecision.openPurchaseOrders).toBe(baseline.openPurchaseOrders + 1);
  expect(afterOneDecision.pendingApproval).toBe(baseline.pendingApproval + 1);
  expect(afterOneDecision.approvedSpend - baseline.approvedSpend).toBeCloseTo(firstPoTotal, 2);
  expect(awaitingAfterOneDecision).toBe(baseline.pendingApproval + 1);
});

After(async ({ page }) => {
  const flow = flows.get(page);
  if (flow?.managerContext) await flow.managerContext.close();
  if (flow?.finalBuyerContext) await flow.finalBuyerContext.close();
  flows.delete(page);
});

Given('the buyer captures the pending approval baseline for TC-P18', async ({ page }) => {
  const dashboardPage = new DashboardPage(page);
  await dashboardPage.open();
  flows.set(page, { baseline: await dashboardPage.readMetrics() });
});

When('the buyer saves and opens a TC-P18 draft', async ({ page }) => {
  const flow = flowFor(page);
  const form = new NewPurchaseOrderPage(page);
  await form.open();
  await form.selectVendor('PackRight Solutions');
  await form.selectDeliveryWindow(7);
  await form.addLine();
  await form.selectItem(0, 'SKU-1010');
  await form.fillQuantity(0, 1);
  await form.saveDraftButton.click();

  const detailPage = new PurchaseOrderDetailPage(page);
  await expect(page).toHaveURL(/\/apps\/erp\/po\/PO-/);
  flow.poNumber = await detailPage.heading.innerText();
  await expect(detailPage.draftStatus).toBeVisible();
});

Then('the draft order page offers Submit for approval', async ({ page }) => {
  const detailPage = new PurchaseOrderDetailPage(page);
  await expect(detailPage.submitForApprovalButton).toBeVisible();
});

When('the buyer submits the saved TC-P18 draft', async ({ page }) => {
  const flow = flowFor(page);
  const detailPage = new PurchaseOrderDetailPage(page);
  await detailPage.submitForApprovalButton.click();
  await expect(detailPage.pendingApprovalStatus).toBeVisible();
  await expect(detailPage.activityTimeline).toContainText('Submitted by Neha Sharma');
  await expect(detailPage.heading).toHaveText(flow.poNumber);

  const dashboardPage = new DashboardPage(page);
  await dashboardPage.open();
  flow.afterDraftSubmission = await dashboardPage.readMetrics();
});

Then('the saved draft becomes pending with a submission activity entry', async ({ page }) => {
  const flow = flowFor(page);
  await page.goto(`/apps/erp/po/${flow.poNumber}`);
  const detailPage = new PurchaseOrderDetailPage(page);
  await expect(detailPage.pendingApprovalStatus).toBeVisible();
  await expect(detailPage.activityTimeline).toContainText('Submitted by Neha Sharma');
});

Then('the Pending approval KPI increases by one', async ({ page }) => {
  const { baseline, afterDraftSubmission } = flowFor(page);
  expect(afterDraftSubmission.pendingApproval).toBe(baseline.pendingApproval + 1);
  expect(afterDraftSubmission.openPurchaseOrders).toBe(baseline.openPurchaseOrders + 1);
  expect(afterDraftSubmission.approvedSpend).toBe(baseline.approvedSpend);
});