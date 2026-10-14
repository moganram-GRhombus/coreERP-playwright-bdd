# CoreERP Playwright BDD

## Run tests

```powershell
npm ci
npx playwright install chromium firefox webkit
npx bddgen
npx playwright test --workers=1
```

The command above runs all configured browser projects serially. To run only Chromium, use `npx playwright test --project=chromium --workers=1`.

The app stores the active user and purchase orders in origin-scoped browser local storage (`pa-erp`), rather than on a shared backend. Browser contexts are isolated, so a manager context cannot see the buyer's submitted PO unless that state is copied.

For an end-to-end workflow, the buyer submits the order and the test captures its PO number from the detail-page heading. The test then snapshots the buyer context with Playwright `browserContext.storageState()` and seeds a separate manager context with `browser.newContext({ storageState })`. This copies the origin's local-storage state (and cookies), including the PO list and its sequence, while keeping the manager context isolated. The manager logs out of the copied buyer session and signs in as manager.

After a decision, the manager context logs out, signs in as buyer, and its updated storage state is copied into a fresh buyer verification context. The buyer checks the same captured PO number in the order list and detail page. The tests do not directly edit local storage or use application internals to change order status.

The full 43-scenario suite passed locally on Chromium, Firefox and WebKit with one worker. The serial execution avoids intermittent navigation timeouts observed when several workflows run concurrently against the public practice app.

## CI status

The [Playwright BDD workflow](.github/workflows/playwright.yml) runs the 43-scenario suite in Chromium, Firefox, and WebKit, one worker at a time to reduce contention against the public practice app. Each browser job uploads the HTML report and `test-results` artifacts, including JUnit output and failure diagnostics. A hosted GitHub Actions run has not yet been observed.