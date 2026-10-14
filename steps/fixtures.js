const base = require('@playwright/test');

exports.test = base.test.extend({
  app: async ({ page }, use) => {
    await use(page);
  },
});
