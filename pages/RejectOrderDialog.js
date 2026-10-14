const { BasePage } = require('./BasePage');

class RejectOrderDialog extends BasePage {
  constructor(page) {
    super(page);
    this.dialog = page.getByRole('dialog');
    this.reason = this.dialog.getByRole('textbox', { name: 'Reason for the buyer' });
    this.rejectButton = this.dialog.getByRole('button', { name: 'Reject order' });
    this.minimumReasonMessage = this.dialog.getByText('Explain the rejection (10+ characters)', { exact: true });
  }

  title(poNumber) {
    return this.dialog.getByRole('heading', { name: `Reject ${poNumber}?` });
  }
}

module.exports = { RejectOrderDialog };