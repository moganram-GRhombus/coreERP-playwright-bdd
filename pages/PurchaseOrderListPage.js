const { expect } = require('@playwright/test');

const { BasePage } = require('./BasePage');

class PurchaseOrderListPage extends BasePage {
  constructor(page) {
    super(page);
    this.pageTitle = page.getByRole('heading', { name: 'Purchase orders' });
    this.newPoButton = page.getByRole('button', { name: /\+ New PO/i });
    this.row = page.locator('table tbody tr');
    this.filterButtons = {
      allStatus: page.getByRole('button', { name: 'All statuses' }),
      draft: page.getByRole('button', { name: 'Draft' }),
      pendingApproval: page.getByRole('button', { name: 'Pending approval' }),
      approved: page.getByRole('button', { name: 'Approved' }),
      rejected: page.getByRole('button', { name: 'Rejected' }),
    };
  }

  async open() {
    await this.page.goto('/apps/erp/purchase-orders');
    await this.pageTitle.waitFor({ state: 'visible' });
  }

  async orderVisible(poNumber) {
    return this.page.getByRole('link', { name: new RegExp(poNumber) }).isVisible();
  }

  async expectOrderVisible(poNumber) {
    await expect(this.page.getByRole('link', { name: new RegExp(poNumber) })).toBeVisible();
  }

  orderRow(poNumber) {
    return this.row.filter({ hasText: poNumber });
  }
}

module.exports = { PurchaseOrderListPage };
