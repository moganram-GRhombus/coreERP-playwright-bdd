const { expect } = require('@playwright/test');
const { createBdd } = require('playwright-bdd');
const { PurchaseOrderListPage } = require('../pages/PurchaseOrderListPage');

const { Given, When, Then } = createBdd();

Given('the buyer is on the purchase orders page', async ({ page }) => {
  const purchaseOrderListPage = new PurchaseOrderListPage(page);
  await purchaseOrderListPage.open();
});

Then('the seeded purchase orders are listed', async ({ page }) => {
  const purchaseOrderListPage = new PurchaseOrderListPage(page);
  await expect(purchaseOrderListPage.pageTitle).toBeVisible();
  await purchaseOrderListPage.expectOrderVisible('PO-2026-0103');
  await purchaseOrderListPage.expectOrderVisible('PO-2026-0102');
  await purchaseOrderListPage.expectOrderVisible('PO-2026-0101');
});
