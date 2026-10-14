const { expect } = require('@playwright/test');
const { createBdd } = require('playwright-bdd');
const { DashboardPage } = require('../pages/DashboardPage');

const { Given, When, Then } = createBdd();

Given('the buyer is on the dashboard', async ({ page }) => {
  const dashboardPage = new DashboardPage(page);
  await dashboardPage.open();
});

Then('the dashboard shows open purchase orders {string}, pending approval {string}, low-stock items {string}, inventory value {string} and approved spend {string}', async ({ page }, openPos, pending, lowStock, inventoryValue, approvedSpend) => {
  const dashboardPage = new DashboardPage(page);
  await expect(dashboardPage.openPurchaseOrders).toHaveText(openPos);
  await expect(dashboardPage.pendingApproval).toHaveText(pending);
  await expect(dashboardPage.lowStockItems).toHaveText(lowStock);
  await expect(dashboardPage.inventoryValue).toHaveText(inventoryValue);
  await expect(dashboardPage.approvedSpend).toHaveText(approvedSpend);
});
