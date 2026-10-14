const { expect } = require('@playwright/test');
const { createBdd } = require('playwright-bdd');
const { InventoryPage } = require('../pages/InventoryPage');

const { Given, When, Then } = createBdd();

Given('the buyer is on the inventory page', async ({ page }) => {
  const inventoryPage = new InventoryPage(page);
  await inventoryPage.open();
});

When('the buyer searches inventory for {string}', async ({ page }, searchText) => {
  const inventoryPage = new InventoryPage(page);
  await inventoryPage.filterBySearch(searchText);
});

When('the buyer filters inventory to low stock only', async ({ page }) => {
  const inventoryPage = new InventoryPage(page);
  await inventoryPage.toggleLowStockOnly();
});

When('the buyer filters inventory to warehouse {string}', async ({ page }, warehouse) => {
  const inventoryPage = new InventoryPage(page);
  await inventoryPage.selectWarehouse(warehouse);
});

When('the buyer changes rows per page to {string}', async ({ page }, rowsPerPage) => {
  const inventoryPage = new InventoryPage(page);
  await inventoryPage.selectPageSize(rowsPerPage);
});

Then('the inventory search field is visible', async ({ page }) => {
  const inventoryPage = new InventoryPage(page);
  await expect(inventoryPage.searchInput).toBeVisible();
});

Then('the warehouse filter defaults to {string}', async ({ page }, warehouse) => {
  const inventoryPage = new InventoryPage(page);
  await expect(inventoryPage.warehouseSelect).toHaveValue('all');
  await expect(inventoryPage.warehouseSelect).toContainText(warehouse);
});

Then('the inventory search results are limited to matching rows', async ({ page }) => {
  const inventoryPage = new InventoryPage(page);
  const count = await inventoryPage.rows.count();
  expect(count).toBeGreaterThan(0);
  const rows = await inventoryPage.getVisibleRowTexts();
  for (const row of rows) {
    expect(row.toLowerCase()).toContain('sku-1009');
  }
});

Then('only rows from warehouse {string} are visible', async ({ page }, warehouse) => {
  const inventoryPage = new InventoryPage(page);
  const count = await inventoryPage.rows.count();
  expect(count).toBeGreaterThan(0);
  const rows = await inventoryPage.getVisibleRowTexts();
  for (const row of rows) {
    expect(row).toContain(warehouse);
  }
});

Then('the row count is {int}', async ({ page }, rowCount) => {
  const inventoryPage = new InventoryPage(page);
  await expect(inventoryPage.rows).toHaveCount(rowCount);
});

Then('the low stock rows show the low-stock badge', async ({ page }) => {
  const inventoryPage = new InventoryPage(page);
  await expect(inventoryPage.lowBadges.first()).toBeVisible();
  const count = await inventoryPage.rows.count();
  const lowBadgeCount = await inventoryPage.lowBadges.count();
  expect(count).toBeGreaterThan(0);
  expect(lowBadgeCount).toBeGreaterThan(0);
});

Then('the inventory grid shows a valid page size selection', async ({ page }) => {
  const inventoryPage = new InventoryPage(page);
  const count = await inventoryPage.rows.count();
  expect(count).toBeGreaterThan(0);
  expect(count).toBeLessThanOrEqual(25);
  await expect(inventoryPage.rows.first()).toBeVisible();
});
