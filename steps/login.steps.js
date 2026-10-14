const { expect } = require('@playwright/test');
const { createBdd } = require('playwright-bdd');
const { LoginPage } = require('../pages/LoginPage');

const { Given, When, Then } = createBdd();

Given('the buyer opens the login page', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.open();
});

Given('the manager opens the login page', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.open();
});

Given('the buyer is logged in', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.open();
  await loginPage.login('buyer', 'Erp@123');
  await expect(page).toHaveURL(/\/dashboard$/);
});

When('the buyer enters username {string} and password {string}', async ({ page }, username, password) => {
  const loginPage = new LoginPage(page);
  await loginPage.username.fill(username);
  await loginPage.password.fill(password);
});

When('the manager enters username {string} and password {string}', async ({ page }, username, password) => {
  const loginPage = new LoginPage(page);
  await loginPage.username.fill(username);
  await loginPage.password.fill(password);
});

When('the buyer clicks the sign in button', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.submit.click();
});

When('the manager clicks the sign in button', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.submit.click();
});

When('the buyer logs out', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.logout();
});

Then('the dashboard is displayed for {string} with role {string}', async ({ page }, displayName, role) => {
  const loginPage = new LoginPage(page);
  await expect(page).toHaveURL(/\/dashboard$/);
  await expect(loginPage.welcomeName).toHaveText(displayName.split(' ')[0]);
  await expect(loginPage.userName).toHaveText(displayName);
  await expect(loginPage.role).toHaveText(role);
});

Then('the login page is displayed', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await expect(page).toHaveURL(/\/apps\/erp(?:\/)?$/);
  await expect(loginPage.submit).toBeVisible();
});

Then('the login error message is {string}', async ({ page }, message) => {
  const loginPage = new LoginPage(page);
  await expect(loginPage.error).toHaveText(message);
});
