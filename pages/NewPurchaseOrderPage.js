const { BasePage } = require('./BasePage');

class NewPurchaseOrderPage extends BasePage {
  constructor(page) {
    super(page);
    this.heading = page.getByRole('heading', { name: 'New purchase order' });
    this.vendor = page.getByRole('combobox', { name: 'Vendor' });
    this.addLineButton = page.getByRole('button', { name: '+ Add line' });
    this.lines = page.locator('[data-testid="po-lines"] > [data-testid^="line-"]');
    this.notes = page.getByRole('textbox', { name: 'Notes to vendor (optional)' });
    this.subtotal = page.getByTestId('po-subtotal');
    this.gst = page.getByTestId('po-tax');
    this.total = page.getByTestId('po-total');
    this.submitButton = page.getByRole('button', { name: 'Submit for approval' });
    this.saveDraftButton = page.getByRole('button', { name: 'Save as draft' });
    this.validationBanner = page.getByRole('alert').filter({ hasText: /^Fix \d+ problems? before saving\.$/ }).first();
  }

  async open() {
    await this.page.goto('/apps/erp/purchase-orders/new');
    await this.heading.waitFor({ state: 'visible' });
  }

  async selectVendor(vendor) {
    await this.vendor.selectOption({ label: vendor });
  }

  async selectDeliveryWindow(days) {
    await this.page.getByRole('button', { name: `${days} days` }).click();
  }

  async addLine() {
    await this.addLineButton.click();
  }

  async selectItem(lineIndex, sku) {
    await this.lines.nth(lineIndex).getByRole('combobox', { name: 'Item' }).selectOption(sku);
  }

  async fillQuantity(lineIndex, quantity) {
    await this.lines.nth(lineIndex).getByRole('textbox', { name: 'Qty' }).fill(String(quantity));
  }

  async fillUnitPrice(lineIndex, price) {
    await this.lines.nth(lineIndex).getByRole('textbox', { name: 'Unit price' }).fill(String(price));
  }

  quantity(lineIndex) {
    return this.lines.nth(lineIndex).getByRole('textbox', { name: 'Qty' });
  }

  unitPrice(lineIndex) {
    return this.lines.nth(lineIndex).getByRole('textbox', { name: 'Unit price' });
  }

  deliveryWindowButton(days) {
    return this.page.getByRole('button', { name: `${days} days` });
  }

  removeLineButton(lineNumber) {
    return this.page.getByRole('button', { name: `Remove line ${lineNumber}` });
  }

  async lineTotal(lineIndex) {
    return this.lines.nth(lineIndex).getByText('Line total', { exact: true }).locator('..').locator('p').nth(1);
  }

  validationMessage(message) {
    return this.page.getByText(message, { exact: true });
  }
}

module.exports = { NewPurchaseOrderPage };
