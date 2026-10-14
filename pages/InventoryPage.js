const { BasePage } = require('./BasePage');

class InventoryPage extends BasePage {
  constructor(page) {
    super(page);
    this.searchInput = page.getByRole('searchbox', { name: 'Search inventory' });
    this.warehouseSelect = page.getByRole('combobox', { name: 'Warehouse' });
    this.rowsSelect = page.getByRole('combobox', { name: 'Rows per page' });
    this.lowStockOnly = page.getByRole('checkbox', { name: 'Low stock only' });
    this.rows = page.locator('[data-testid="inventory-row"]');
    this.lowBadges = page.locator('[data-testid^="low-"]');
  }

  async open() {
    await this.page.goto('/apps/erp/inventory', { waitUntil: 'domcontentloaded' });
    await this.page.getByRole('heading', { name: 'Inventory' }).waitFor({ state: 'visible', timeout: 60000 });
    await this.searchInput.waitFor({ state: 'visible', timeout: 60000 });
  }

  async filterBySearch(text) {
    await this.searchInput.fill(text);
  }

  async getVisibleRowTexts() {
    return this.rows.allTextContents();
  }

  async selectWarehouse(value) {
    await this.warehouseSelect.selectOption({ label: value });
  }

  async selectPageSize(value) {
    await this.rowsSelect.selectOption({ label: value });
  }

  async toggleLowStockOnly() {
    await this.lowStockOnly.check();
  }
}

module.exports = { InventoryPage };
