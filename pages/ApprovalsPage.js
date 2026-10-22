const { BasePage } = require('./BasePage');

class ApprovalsPage extends BasePage {
  constructor(page) {
    super(page);
    this.heading = page.getByRole('heading', { name: 'Approvals' });
    this.pageHeading = page.getByRole('heading', { name: /^(Approvals|Access denied)$/ });
    this.queueItems = page.getByRole('listitem');
    this.awaitingCount = page.getByText(/^\d+ awaiting your decision$/);
    this.allCaughtUp = page.getByText("You're all caught up.", { exact: true });
    this.accessDeniedHeading = page.getByRole('heading', { name: 'Access denied' });
    this.accessDeniedMessage = page.getByText('This page needs the manager role. You are signed in as a buyer.');
    this.reviewLinks = page.getByRole('link', { name: 'Review' });
    this.approveButtons = page.getByRole('button', { name: 'Approve' });
  }

  async open() {
    await this.page.goto('/apps/erp/approvals');
    await this.pageHeading.waitFor({ state: 'visible' });
  }

  orderCard(poNumber) {
    return this.queueItems.filter({ hasText: poNumber });
  }

  reviewLink(poNumber) {
    return this.orderCard(poNumber).getByRole('link', { name: 'Review' });
  }
  async readAwaitingCount() {
    const text = await this.awaitingCount.innerText();
    return Number(text.match(/\d+/)[0]);
  }
}

module.exports = { ApprovalsPage };