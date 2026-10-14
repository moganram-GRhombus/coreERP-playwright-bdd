Feature: CoreERP inventory

  @TC-P04 @positive @validation
  Scenario: Buyer can view the inventory controls
    Given the buyer is logged in
    And the buyer is on the inventory page
    Then the inventory search field is visible
    And the warehouse filter defaults to "All warehouses"

  @TC-P05 @positive @validation
  Scenario: Buyer can search inventory by SKU or product name
    Given the buyer is logged in
    And the buyer is on the inventory page
    When the buyer searches inventory for "SKU-1009"
    Then the inventory search results are limited to matching rows

  @TC-P06 @positive @validation
  Scenario: Buyer can filter inventory by warehouse
    Given the buyer is logged in
    And the buyer is on the inventory page
    When the buyer filters inventory to warehouse "Pune"
    Then only rows from warehouse "Pune" are visible

  @TC-P07 @positive @validation
  Scenario: Buyer can filter inventory to low stock only
    Given the buyer is logged in
    And the buyer is on the inventory page
    When the buyer filters inventory to low stock only
    Then the low stock rows show the low-stock badge

  @TC-P08 @positive @validation
  Scenario: Buyer can change the inventory page size
    Given the buyer is logged in
    And the buyer is on the inventory page
    When the buyer changes rows per page to "25 / page"
    Then the inventory grid shows a valid page size selection
