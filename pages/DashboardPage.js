const { BasePage } = require('./BasePage');

class DashboardPage extends BasePage {
  constructor(page) {
    super(page);
    this.openPurchaseOrders = page.getByTestId('kpi-open-pos');
    this.pendingApproval = page.getByTestId('kpi-pending-approval');
    this.lowStockItems = page.getByTestId('kpi-low-stock');
    this.inventoryValue = page.getByTestId('kpi-inventory-value');
    this.approvedSpend = page.getByTestId('approved-spend');
    this.quickNewPo = page.getByTestId('quick-new-po');
    this.welcomeName = page.getByTestId('welcome-name');
    this.userName = page.getByTestId('erp-user');
    this.role = page.getByTestId('erp-role');
  }

  async open() {
    if (!/\/apps\/erp\/dashboard(?:\?|$)/.test(this.page.url())) {
      await this.page.goto('/apps/erp/dashboard', { waitUntil: 'domcontentloaded' });
    }
    await this.welcomeName.waitFor({ state: 'visible' });
  }

  async readMetrics() {
    const [openPurchaseOrders, pendingApproval, approvedSpend] = await Promise.all([
      this.openPurchaseOrders.innerText(),
      this.pendingApproval.innerText(),
      this.approvedSpend.innerText(),
    ]);

    return {
      openPurchaseOrders: Number(openPurchaseOrders),
      pendingApproval: Number(pendingApproval),
      approvedSpend: Number(approvedSpend.replace(/[^\d.]/g, '')),
    };
  }
}

module.exports = { DashboardPage };
