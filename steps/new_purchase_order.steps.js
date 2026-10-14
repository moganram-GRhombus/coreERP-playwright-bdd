const { expect } = require('@playwright/test');
const { createBdd } = require('playwright-bdd');
const { NewPurchaseOrderPage } = require('../pages/NewPurchaseOrderPage');
const { PurchaseOrderDetailPage } = require('../pages/PurchaseOrderDetailPage');

const { Given, When, Then } = createBdd();

Given('the buyer is on the new purchase order form', async ({ page }) => {
  const purchaseOrderPage = new NewPurchaseOrderPage(page);
  await purchaseOrderPage.open();
});

When('the buyer creates the SafeGuard sample purchase order', async ({ page }) => {
  const purchaseOrderPage = new NewPurchaseOrderPage(page);
  await purchaseOrderPage.selectVendor('SafeGuard PPE Co.');
  await purchaseOrderPage.selectDeliveryWindow(14);
  await purchaseOrderPage.addLine();
  await purchaseOrderPage.selectItem(0, 'SKU-1012');
  await purchaseOrderPage.fillQuantity(0, 10);
  await purchaseOrderPage.fillUnitPrice(0, 200);
});

When('the buyer creates the Apex multi-line sample purchase order', async ({ page }) => {
  const purchaseOrderPage = new NewPurchaseOrderPage(page);
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
});

When('the buyer creates the PackRight draft sample', async ({ page }) => {
  const purchaseOrderPage = new NewPurchaseOrderPage(page);
  await purchaseOrderPage.selectVendor('PackRight Solutions');
  await purchaseOrderPage.selectDeliveryWindow(7);
  await purchaseOrderPage.addLine();
  await purchaseOrderPage.selectItem(0, 'SKU-1010');
  await purchaseOrderPage.fillQuantity(0, 100);
});

When('the buyer completes the purchase order without a vendor', async ({ page }) => {
  const purchaseOrderPage = new NewPurchaseOrderPage(page);
  await purchaseOrderPage.selectDeliveryWindow(14);
  await purchaseOrderPage.addLine();
  await purchaseOrderPage.selectItem(0, 'SKU-1001');
  await purchaseOrderPage.fillQuantity(0, 2);
  await purchaseOrderPage.fillUnitPrice(0, 45);
});

When('the buyer completes the purchase order without a delivery window', async ({ page }) => {
  const purchaseOrderPage = new NewPurchaseOrderPage(page);
  await purchaseOrderPage.selectVendor('Apex Industrial Supplies');
  await purchaseOrderPage.addLine();
  await purchaseOrderPage.selectItem(0, 'SKU-1001');
  await purchaseOrderPage.fillQuantity(0, 2);
  await purchaseOrderPage.fillUnitPrice(0, 45);
});

When('the buyer selects a vendor and delivery window without adding a line', async ({ page }) => {
  const purchaseOrderPage = new NewPurchaseOrderPage(page);
  await purchaseOrderPage.selectVendor('Apex Industrial Supplies');
  await purchaseOrderPage.selectDeliveryWindow(14);
});

When('the buyer adds a purchase order line without quantity', async ({ page }) => {
  const purchaseOrderPage = new NewPurchaseOrderPage(page);
  await purchaseOrderPage.selectVendor('Apex Industrial Supplies');
  await purchaseOrderPage.selectDeliveryWindow(14);
  await purchaseOrderPage.addLine();
  await purchaseOrderPage.selectItem(0, 'SKU-1001');
});

Then('the purchase order totals are subtotal {string}, GST {string} and total {string}', async ({ page }, subtotal, gst, total) => {
  const purchaseOrderPage = new NewPurchaseOrderPage(page);
  await expect(purchaseOrderPage.subtotal).toHaveText(subtotal);
  await expect(purchaseOrderPage.gst).toHaveText(gst);
  await expect(purchaseOrderPage.total).toHaveText(total);
});

Then('the purchase order line totals are {string} and {string}', async ({ page }, firstTotal, secondTotal) => {
  const purchaseOrderPage = new NewPurchaseOrderPage(page);
  await expect(await purchaseOrderPage.lineTotal(0)).toHaveText(firstTotal);
  await expect(await purchaseOrderPage.lineTotal(1)).toHaveText(secondTotal);
});

When('the buyer submits the purchase order', async ({ page }) => {
  const purchaseOrderPage = new NewPurchaseOrderPage(page);
  await purchaseOrderPage.submitButton.click();
});

When('the buyer saves the purchase order as a draft', async ({ page }) => {
  const purchaseOrderPage = new NewPurchaseOrderPage(page);
  await purchaseOrderPage.saveDraftButton.click();
});

Then('the purchase order is saved as a draft', async ({ page }) => {
  const purchaseOrderDetailPage = new PurchaseOrderDetailPage(page);
  await expect(page).toHaveURL(/\/apps\/erp\/po\/PO-/);
  await expect(purchaseOrderDetailPage.draftStatus).toBeVisible();
});

Then('the purchase order form shows validation error {string}', async ({ page }, message) => {
  const purchaseOrderPage = new NewPurchaseOrderPage(page);
  await expect(purchaseOrderPage.validationBanner).toBeVisible();
  await expect(purchaseOrderPage.validationMessage(message)).toBeVisible();
  expect(await page.url()).toMatch(/\/apps\/erp\/purchase-orders\/new$/);
});

Then('the empty draft is blocked by the required form validations', async ({ page }) => {
  const purchaseOrderPage = new NewPurchaseOrderPage(page);
  await expect(purchaseOrderPage.validationBanner).toHaveText('Fix 3 problems before saving.');
  await expect(purchaseOrderPage.validationMessage('Choose a vendor')).toBeVisible();
  await expect(purchaseOrderPage.validationMessage('Choose a delivery window')).toBeVisible();
  await expect(purchaseOrderPage.validationMessage('Add at least one line item')).toBeVisible();
  expect(await page.url()).toMatch(/\/apps\/erp\/purchase-orders\/new$/);
});

Then('the purchase order is submitted for approval', async ({ page }) => {
  const purchaseOrderDetailPage = new PurchaseOrderDetailPage(page);
  await expect(page).toHaveURL(/\/apps\/erp\/po\/PO-/);
  await expect(purchaseOrderDetailPage.pendingApprovalStatus).toBeVisible();
});

When('the buyer starts a standard purchase order line for {string}', async ({ page }, sku) => {
  const purchaseOrderPage = new NewPurchaseOrderPage(page);
  await purchaseOrderPage.selectVendor('Apex Industrial Supplies');
  await purchaseOrderPage.selectDeliveryWindow(14);
  await purchaseOrderPage.addLine();
  await purchaseOrderPage.selectItem(0, sku);
});

When('the buyer enters quantity {string} on line {int}', async ({ page }, quantity, lineNumber) => {
  const purchaseOrderPage = new NewPurchaseOrderPage(page);
  await purchaseOrderPage.fillQuantity(lineNumber, quantity);
});

When('the buyer enters unit price {string} on line {int}', async ({ page }, price, lineNumber) => {
  const purchaseOrderPage = new NewPurchaseOrderPage(page);
  await purchaseOrderPage.fillUnitPrice(lineNumber, price);
});

Then('the quantity on line {int} is {string}', async ({ page }, lineNumber, quantity) => {
  const purchaseOrderPage = new NewPurchaseOrderPage(page);
  await expect(purchaseOrderPage.quantity(lineNumber)).toHaveValue(quantity);
});

Then('the unit price on line {int} is {string}', async ({ page }, lineNumber, price) => {
  const purchaseOrderPage = new NewPurchaseOrderPage(page);
  await expect(purchaseOrderPage.unitPrice(lineNumber)).toHaveValue(price);
});

Then('the line total on line {int} is {string}', async ({ page }, lineNumber, total) => {
  const purchaseOrderPage = new NewPurchaseOrderPage(page);
  await expect(await purchaseOrderPage.lineTotal(lineNumber)).toHaveText(total);
});

Then('the purchase order has {int} lines', async ({ page }, count) => {
  const purchaseOrderPage = new NewPurchaseOrderPage(page);
  await expect(purchaseOrderPage.lines).toHaveCount(count);
});

When('the buyer adds another line for {string}', async ({ page }, sku) => {
  const purchaseOrderPage = new NewPurchaseOrderPage(page);
  const lineNumber = await purchaseOrderPage.lines.count();
  await purchaseOrderPage.addLine();
  await purchaseOrderPage.selectItem(lineNumber, sku);
});

When('the buyer removes line {int}', async ({ page }, lineNumber) => {
  const purchaseOrderPage = new NewPurchaseOrderPage(page);
  await purchaseOrderPage.removeLineButton(lineNumber).click();
});

When('the buyer enters notes {string}', async ({ page }, notes) => {
  const purchaseOrderPage = new NewPurchaseOrderPage(page);
  await purchaseOrderPage.notes.fill(notes);
});

Then('the notes field contains {string}', async ({ page }, notes) => {
  const purchaseOrderPage = new NewPurchaseOrderPage(page);
  await expect(purchaseOrderPage.notes).toHaveValue(notes);
});

When('the buyer selects delivery window {int} days', async ({ page }, days) => {
  const purchaseOrderPage = new NewPurchaseOrderPage(page);
  await purchaseOrderPage.selectDeliveryWindow(days);
});

Then('only the {int} days delivery window is selected', async ({ page }, selectedDays) => {
  const purchaseOrderPage = new NewPurchaseOrderPage(page);
  for (const days of [7, 14, 30]) {
    await expect(purchaseOrderPage.deliveryWindowButton(days)).toHaveAttribute('aria-pressed', String(days === selectedDays));
  }
});
