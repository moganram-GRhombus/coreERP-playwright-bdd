Feature: CoreERP new purchase order totals

  @TC-P09 @positive @validation
  Scenario: Buyer submits a single-line purchase order with calculated totals
    Given the buyer is logged in
    Given the buyer is on the new purchase order form
    When the buyer creates the SafeGuard sample purchase order
    Then the purchase order totals are subtotal "₹2,000.00", GST "₹360.00" and total "₹2,360.00"
    When the buyer submits the purchase order
    Then the purchase order is submitted for approval

  @TC-P10 @positive @validation @WF-4
  Scenario: Buyer saves a valid purchase order as a draft
    Given the buyer is logged in
    And the buyer is on the new purchase order form
    When the buyer creates the PackRight draft sample
    And the buyer saves the purchase order as a draft
    Then the purchase order is saved as a draft

  @TC-P11 @positive @validation @WF-3
  Scenario: Buyer enters a multi-line purchase order with correct line totals
    Given the buyer is logged in
    Given the buyer is on the new purchase order form
    When the buyer creates the Apex multi-line sample purchase order
    Then the purchase order line totals are "₹225.00" and "₹3,000.00"

  @TC-N05 @negative @validation
  Scenario: Submit is blocked when vendor is missing
    Given the buyer is logged in
    And the buyer is on the new purchase order form
    When the buyer completes the purchase order without a vendor
    And the buyer submits the purchase order
    Then the purchase order form shows validation error "Choose a vendor"

  @TC-N06 @negative @validation
  Scenario: Submit is blocked when delivery window is missing
    Given the buyer is logged in
    And the buyer is on the new purchase order form
    When the buyer completes the purchase order without a delivery window
    And the buyer submits the purchase order
    Then the purchase order form shows validation error "Choose a delivery window"

  @TC-N07 @negative @validation
  Scenario: Submit is blocked when the purchase order has no lines
    Given the buyer is logged in
    And the buyer is on the new purchase order form
    When the buyer selects a vendor and delivery window without adding a line
    And the buyer submits the purchase order
    Then the purchase order form shows validation error "Add at least one line item"

  @TC-N08 @negative @validation
  Scenario: Submit is blocked when line quantity is missing
    Given the buyer is logged in
    And the buyer is on the new purchase order form
    When the buyer adds a purchase order line without quantity
    And the buyer submits the purchase order
    Then the purchase order form shows validation error "Qty must be > 0"

  @TC-N09 @negative @validation @WF-4
  Scenario: Saving an empty purchase order as a draft is blocked
    Given the buyer is logged in
    And the buyer is on the new purchase order form
    When the buyer saves the purchase order as a draft
    Then the empty draft is blocked by the required form validations

  @TC-E01 @edge @validation
  Scenario: Zero quantity remains visible but cannot be submitted
    Given the buyer is logged in
    And the buyer is on the new purchase order form
    When the buyer starts a standard purchase order line for "SKU-1001"
    And the buyer enters quantity "0" on line 0
    Then the quantity on line 0 is "0"
    And the line total on line 0 is "₹0.00"
    When the buyer submits the purchase order
    Then the purchase order form shows validation error "Qty must be > 0"

  @TC-E02 @edge @validation
  Scenario: Negative quantity is sanitized to a positive quantity
    Given the buyer is logged in
    And the buyer is on the new purchase order form
    When the buyer starts a standard purchase order line for "SKU-1001"
    And the buyer enters quantity "-2" on line 0
    Then the quantity on line 0 is "2"
    And the line total on line 0 is "₹90.00"

  @TC-E03 @edge @validation
  Scenario: Decimal quantity has its decimal point removed
    Given the buyer is logged in
    And the buyer is on the new purchase order form
    When the buyer starts a standard purchase order line for "SKU-1001"
    And the buyer enters quantity "1.5" on line 0
    Then the quantity on line 0 is "15"
    And the line total on line 0 is "₹675.00"

  @TC-E04 @edge @validation
  Scenario: Text quantity is cleared and cannot be submitted
    Given the buyer is logged in
    And the buyer is on the new purchase order form
    When the buyer starts a standard purchase order line for "SKU-1001"
    And the buyer enters quantity "abc" on line 0
    Then the quantity on line 0 is ""
    When the buyer submits the purchase order
    Then the purchase order form shows validation error "Qty must be > 0"

  @TC-E05 @edge @validation
  Scenario: Very large quantity is accepted and included in the totals
    Given the buyer is logged in
    And the buyer is on the new purchase order form
    When the buyer starts a standard purchase order line for "SKU-1001"
    And the buyer enters quantity "999999" on line 0
    Then the quantity on line 0 is "999999"
    And the line total on line 0 is "₹4,49,99,955.00"

  @TC-E06 @edge @validation
  Scenario: Zero unit price cannot be submitted
    Given the buyer is logged in
    And the buyer is on the new purchase order form
    When the buyer starts a standard purchase order line for "SKU-1001"
    And the buyer enters quantity "2" on line 0
    And the buyer enters unit price "0" on line 0
    Then the line total on line 0 is "₹0.00"
    When the buyer submits the purchase order
    Then the purchase order form shows validation error "Price must be > 0"
    When the buyer enters unit price "" on line 0
    Then the unit price on line 0 is ""
    And the line total on line 0 is "₹0.00"
    When the buyer submits the purchase order
    Then the purchase order form shows validation error "Price must be > 0"

  @TC-E07 @edge @validation
  Scenario: Unit price with three decimals is displayed and taxed to two decimals
    Given the buyer is logged in
    And the buyer is on the new purchase order form
    When the buyer starts a standard purchase order line for "SKU-1001"
    And the buyer enters quantity "1" on line 0
    And the buyer enters unit price "1.239" on line 0
    Then the line total on line 0 is "₹1.24"
    And the purchase order totals are subtotal "₹1.24", GST "₹0.22" and total "₹1.46"

  @TC-E08 @edge @validation
  Scenario: Removing a purchase order line recalculates totals
    Given the buyer is logged in
    And the buyer is on the new purchase order form
    When the buyer starts a standard purchase order line for "SKU-1001"
    And the buyer enters quantity "1" on line 0
    And the buyer adds another line for "SKU-1002"
    And the buyer enters quantity "2" on line 1
    And the buyer removes line 2
    Then the purchase order has 1 lines
    And the purchase order totals are subtotal "₹45.00", GST "₹8.10" and total "₹53.10"

  @TC-E09 @edge @validation
  Scenario: Duplicate items are allowed and calculated independently
    Given the buyer is logged in
    And the buyer is on the new purchase order form
    When the buyer starts a standard purchase order line for "SKU-1001"
    And the buyer enters quantity "1" on line 0
    And the buyer adds another line for "SKU-1001"
    And the buyer enters quantity "2" on line 1
    Then the purchase order has 2 lines
    And the purchase order line totals are "₹45.00" and "₹90.00"

  @TC-E10 @edge @validation
  Scenario: Notes preserve special characters
    Given the buyer is logged in
    And the buyer is on the new purchase order form
    When the buyer enters notes "O'Reilly & Sons <urgent> #PO-1"
    Then the notes field contains "O'Reilly & Sons <urgent> #PO-1"

  @TC-E11 @edge @validation
  Scenario: Delivery windows are exclusive selectable options
    Given the buyer is logged in
    And the buyer is on the new purchase order form
    When the buyer selects delivery window 7 days
    Then only the 7 days delivery window is selected
    When the buyer selects delivery window 14 days
    Then only the 14 days delivery window is selected
    When the buyer selects delivery window 30 days
    Then only the 30 days delivery window is selected
