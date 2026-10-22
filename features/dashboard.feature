Feature: CoreERP dashboard


  @TC-P03 @positive @validation
  Scenario: Buyer sees the dashboard KPI summary
    Given the buyer is logged in
    Then the dashboard shows open purchase orders "1", pending approval "0", low-stock items "5", inventory value "₹20,44,184.00" and approved spend "₹2,655.00"
