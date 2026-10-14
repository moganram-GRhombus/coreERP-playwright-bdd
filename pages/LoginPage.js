const { BasePage } = require('./BasePage');

class LoginPage extends BasePage {
  constructor(page) {
    super(page);
    this.username = page.getByTestId('erp-username');
    this.password = page.getByTestId('erp-password');
    this.submit = page.getByTestId('erp-login');
    this.error = page.getByTestId('erp-login-error');
    this.form = page.getByTestId('erp-login-form');
    this.welcomeName = page.getByTestId('welcome-name');
    this.userName = page.getByTestId('erp-user');
    this.role = page.getByTestId('erp-role');
    this.logoutButton = page.getByTestId('erp-logout');
  }

  async open() {
    await this.page.goto('/apps/erp', { waitUntil: 'domcontentloaded' });
    await this.form.waitFor({ state: 'visible' });
  }

  async login(username, password) {
    await this.username.fill(username);
    await this.password.fill(password);
    await this.submit.click();
  }

  async logout() {
    await this.logoutButton.click();
  }
}

module.exports = { LoginPage };
