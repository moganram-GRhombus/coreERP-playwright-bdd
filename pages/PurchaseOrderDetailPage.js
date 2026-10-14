const { BasePage } = require('./BasePage');

class PurchaseOrderDetailPage extends BasePage {
  constructor(page) {
    super(page);
    this.heading = page.getByRole('heading', { level: 1 });
    this.pendingApprovalStatus = page.getByText('Pending approval', { exact: true });
    this.draftStatus = page.getByTestId('po-status').filter({ hasText: 'Draft' });
    this.approvedStatus = page.getByTestId('po-status').filter({ hasText: 'Approved' });
    this.rejectedStatus = page.getByTestId('po-status').filter({ hasText: 'Rejected' });
    this.total = page.getByRole('definition').nth(2);
    this.itemRows = page.getByRole('table').getByRole('row');
    this.activityTimeline = page.getByTestId('po-timeline');
    this.submitForApprovalButton = page.getByRole('button', { name: 'Submit for approval' });
    this.approveButton = page.getByRole('button', { name: 'Approve' });
    this.rejectButton = page.getByRole('button', { name: 'Reject' });
  }
}

module.exports = { PurchaseOrderDetailPage };