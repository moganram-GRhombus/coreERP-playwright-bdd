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
    await page.goto('https://www.practiceqaautomation.com/apps/erp/inventory');
    await page.waitForLoadState('networkidle');
    const elements = await page.evaluate(() => {
      const all = Array.from(document.querySelectorAll('[data-testid],[placeholder],label,button,th,td,input,select')).map(el => ({
        tag: el.tagName,
        testid: el.getAttribute('data-testid'),
        placeholder: el.getAttribute('placeholder'),
        label: el.getAttribute('aria-label'),
        text: (el.textContent || '').trim().slice(0,80),
        value: el.value || '',
        type: el.getAttribute('type'),
        role: el.getAttribute('role'),
        html: el.outerHTML.slice(0, 220).replace(/\s+/g,' ')
      }));
      return all.filter(x => x.testid || x.placeholder || x.label || x.tag === 'INPUT' || x.tag === 'SELECT' || x.tag === 'BUTTON' || x.tag === 'TH' || x.tag === 'TD');
    });
    console.log(JSON.stringify(elements.slice(0, 200), null, 2));
  } catch (error) {
    console.error(error);
    process.exitCode = 1;
  } finally {
    await browser.close();
  }
})();
