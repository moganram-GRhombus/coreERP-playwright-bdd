Feature: CoreERP purchase orders

  @TC-P19 @positive @validation
  Scenario: Buyer can see the seeded purchase orders
    Given the buyer is logged in
    And the buyer is on the purchase orders page
    Then the seeded purchase orders are listed
