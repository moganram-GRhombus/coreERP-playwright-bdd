const { BasePage } = require('./BasePage');

class HeaderNav extends BasePage {
  constructor(page) {
    super(page);
    this.dashboardLink = page.getByRole('link', { name: 'Dashboard' });
    this.inventoryLink = page.getByRole('link', { name: 'Inventory' });
    this.purchaseOrdersLink = page.getByRole('link', { name: 'Purchase orders' });
    this.approvalsLink = page.getByRole('link', { name: 'Approvals' });
    this.logoutButton = page.getByTestId('erp-logout');
  }

  async goToDashboard() {
    await this.dashboardLink.click();
  }

  async goToInventory() {
    await this.inventoryLink.click();
  }

  async goToPurchaseOrders() {
    await this.purchaseOrdersLink.click();
  }
}

module.exports = { HeaderNav };
