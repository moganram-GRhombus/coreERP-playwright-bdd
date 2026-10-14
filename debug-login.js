const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  try {
    await page.goto('https://www.practiceqaautomation.com/apps/erp');
    await page.getByTestId('erp-username').fill('buyer');
    await page.getByTestId('erp-password').fill('Erp@123');
    await page.getByTestId('erp-login').click();
    await page.waitForURL(/\/dashboard$/);
    console.log('URL=' + page.url());
    console.log('WELCOME=' + await page.getByTestId('welcome-name').textContent());
    console.log('USER=' + await page.getByTestId('erp-user').textContent());
    console.log('ROLE=' + await page.getByTestId('erp-role').textContent());
  } catch (error) {
    console.error(error);
    process.exitCode = 1;
  } finally {
    await browser.close();
  }
})();
