# CoreERP Known Limitations

## Phase 2 inventory checks confirmed live

### TC-P05: Search is a free-text filter over SKU, product name and category
The live app accepts text in the inventory search box and narrows the table to rows that match the entered value. The search is not limited to the SKU column alone; it also matches product names and categories. For example, entering `SKU-1009` leaves only the matching row in the resulting inventory grid, and the row count drops to the matching entries rather than the full dataset.

This behavior is locked in by the automation assertion that every visible row still contains the searched value after the filter is applied.

### TC-P06: Warehouse filtering narrows the grid by location
The Inventory page opens with the warehouse filter set to `All warehouses`. Selecting a specific warehouse such as `Pune` updates the grid to show only rows for that location; the app applies the warehouse selection as a real filter, not just a display value. Once a warehouse is selected, each visible row contains the selected city name.

This behavior is locked in by the automation assertion that every visible row contains the chosen warehouse name after the filter is applied.

### TC-P07: Low stock only reduces the grid and highlights low-stock rows
When the `Low stock only` checkbox is checked, the inventory grid is reduced and the red `Low` badge remains visible on the matching rows. In the live app this is a low-stock subset, not a strict one-to-one filter: the exact row count and badge count can vary across the visible set, but the low-stock rows remain clearly flagged and the list is visibly narrowed.

This behavior is locked in by the automation assertion that the low-stock badge is visible on at least one row and that the filtered grid still contains visible inventory rows.

## Phase 3 purchase order behavior confirmed live

### Required fields and draft behavior
Submitting a form without a vendor, delivery window, or any line is blocked in place. The inline errors are `Choose a vendor`, `Choose a delivery window`, and `Add at least one line item`; the banner reports the number of problems. A selected line with no quantity shows `Qty must be > 0`. Saving a completely empty form as a draft applies the same required checks and does not create a PO. A valid draft saves and navigates to its PO detail page with status `Draft`.

These behaviors are covered by TC-P10 and TC-N05 to TC-N09.

### Quantity input boundaries
The quantity control is a text input with numeric input mode, not a native number input. Entering `0` leaves zero visible and produces a zero line total, but submit is blocked with `Qty must be > 0`. Entering `-2` results in `2`; entering `1.5` results in `15`; alphabetic input such as `abc` is cleared. Very large values are accepted with no observed upper bound and are included in the calculated totals.

The assertions for TC-E01 to TC-E05 lock these observed results. The lack of an upper quantity limit remains a business-rule risk rather than an assumed product rule.

### Price, repeated lines, notes and delivery
Zero or blank unit price can be entered and displays a zero line total, but submitting is blocked with `Price must be > 0`. A price of `1.239` is retained in the input; displayed line value and GST calculations round to two decimal places. Repeating an SKU on another line is allowed, and each line contributes separately to totals. Removing a line recalculates the totals immediately.

Text entered in Notes is retained in the form, including apostrophes, ampersands, angle brackets, quotes and hash marks. The 7-, 14- and 30-day delivery controls are mutually exclusive; selecting one clears the pressed state from the other two.

These behaviors are covered by TC-E06 to TC-E11. Single-line and multi-line calculations are covered by TC-P09, TC-P11 and TC-P12.

## Phase 4 approval and access behavior confirmed live

### Approval and rejection
The manager sees pending POs in Approvals with a Review link and can decide them from PO detail. Approving removes that PO from the queue, changes its status to `Approved`, and increases approved spend by the PO total. Rejecting removes it from the queue, changes its status to `Rejected`, and leaves approved spend unchanged. A completed PO is also visible in the manager's Purchase orders list with its final status.

The Reject dialog title is `Reject <PO number>?`. Its reason control is labeled `Reason for the buyer` and the action is `Reject order`. An empty or fewer-than-10-character reason is refused with `Explain the rejection (10+ characters)`; a valid reason can be submitted. WF-2 covers both refusal and successful rejection.

### Role and session access
A signed-in buyer can open the Approvals route but receives an `Access denied` page stating `This page needs the manager role. You are signed in as a buyer.` No Review or Approve controls are exposed. After logout, directly opening Approvals redirects to the ERP sign-in page and displays no approval content.

### Draft and multiple-pending behavior
A saved Draft is not listed in the manager's Approvals queue. Saving it increments Open purchase orders by one while Pending approval and approved spend remain unchanged. With two pending POs, approving one removes only that PO; the other remains in the queue and the dashboard deltas reflect one completed decision.

### Browser-context data boundary
The sandbox stores the signed-in user and PO records together in origin-scoped browser local storage (`pa-erp`). Separate Playwright browser contexts do not see each other's changes automatically. End-to-end scenarios capture the buyer context using `browserContext.storageState()` and pass that snapshot to `browser.newContext({ storageState })` for the manager. This copies the origin's local-storage data (including POs and the sequence) and cookies into a separate context; the manager logs out of the copied buyer session and signs in as manager. After the decision, the manager logs out, signs in as buyer, and the updated state snapshot is copied into a fresh buyer verification context. This is a Playwright storage transfer, not a server-side persistence check.

The full 43-case suite passed locally on Chromium, Firefox and WebKit when run with one worker. A four-worker three-browser run produced intermittent cross-context navigation timeouts in Firefox and WebKit; serial browser runs passed. The GitHub Actions workflow runs each browser serially and uploads reports, but a hosted CI run has not yet been observed. CI also requires access to the public practice app.

## Additional project notes
- Step files use page objects for interactions and assertions; there are no hard-coded selectors embedded directly in the Gherkin step files.
- The project does not use any `waitForTimeout` calls.
