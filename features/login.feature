Feature: CoreERP login

  @TC-P01 @positive @validation @smoke
  Scenario: Buyer logs in successfully
    Given the buyer opens the login page
    When the buyer enters username "buyer" and password "Erp@123"
    And the buyer clicks the sign in button
    Then the dashboard is displayed for "Neha Sharma" with role "buyer"

  @TC-P02 @positive @validation
  Scenario: Manager logs in successfully
    Given the manager opens the login page
    When the manager enters username "manager" and password "Erp@123"
    And the manager clicks the sign in button
    Then the dashboard is displayed for "Rahul Mehta" with role "manager"

  @TC-P17 @positive @validation
  Scenario: Buyer can log out from the dashboard
    Given the buyer is logged in
    When the buyer logs out
    Then the login page is displayed

  @TC-N01 @negative @validation
  Scenario: Login with wrong password is rejected
    Given the buyer opens the login page
    When the buyer enters username "buyer" and password "WrongPass1"
    And the buyer clicks the sign in button
    Then the login error message is "Invalid username or password"

  @TC-N02 @negative @validation
  Scenario: Login with empty credentials is rejected
    Given the buyer opens the login page
    When the buyer enters username "" and password ""
    And the buyer clicks the sign in button
    Then the login error message is "Invalid username or password"

  @TC-N03 @negative @validation
  Scenario: Login with unknown user is rejected
    Given the buyer opens the login page
    When the buyer enters username "unknown.user" and password "Erp@123"
    And the buyer clicks the sign in button
    Then the login error message is "Invalid username or password"
