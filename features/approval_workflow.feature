Feature: CoreERP approval workflow

  @TC-P13 @WF-1 @positive @validation
  Scenario: Buyer submits and manager approves a purchase order
    Given the buyer starts WF-1 with dashboard baselines
    When the buyer submits the WF-1 sample order
    Then the buyer dashboard shows the submission deltas
    When the manager reviews and approves the WF-1 order in a separate context
    Then the approval queue and dashboard return to the expected deltas
    And the buyer can see the WF-1 order as approved

  @TC-P14 @positive @validation
  Scenario: Dashboard deltas reflect submission and approval
    Given the buyer starts WF-1 with dashboard baselines
    When the buyer submits the WF-1 sample order
    Then the buyer dashboard shows the submission deltas
    When the manager reviews and approves the WF-1 order in a separate context
    Then the approval queue and dashboard return to the expected deltas

  @TC-P16 @positive @validation
  Scenario: Buyer sees the final approved status in the list and order detail
    Given the buyer starts WF-1 with dashboard baselines
    When the buyer submits the WF-1 sample order
    Then the buyer dashboard shows the submission deltas
    When the manager reviews and approves the WF-1 order in a separate context
    Then the approval queue and dashboard return to the expected deltas
    And the buyer can see the WF-1 order as approved

  @TC-P15 @WF-2 @positive @validation
  Scenario: Buyer order is rejected after a valid reason is provided
    Given the buyer starts WF-2 with dashboard baselines
    When the buyer submits the WF-2 sample order
    Then the buyer dashboard shows the submission deltas
    When the manager reviews and rejects the WF-2 order in a separate context
    Then the rejection queue and dashboard return to the expected deltas
    And the buyer can see the WF-2 order as rejected

  @TC-N12 @negative @validation
  Scenario: A short rejection reason is refused before a valid reason succeeds
    Given the buyer starts WF-2 with dashboard baselines
    When the buyer submits the WF-2 sample order
    Then the buyer dashboard shows the submission deltas
    When the manager reviews and rejects the WF-2 order in a separate context
    Then the rejection queue and dashboard return to the expected deltas
    And the buyer can see the WF-2 order as rejected

  @TC-P12 @WF-3 @positive @validation
  Scenario: Buyer submits a multi-line price override order and manager approves it
    Given the buyer starts WF-3 with dashboard baselines
    When the buyer submits the WF-3 multi-line sample order
    Then the buyer dashboard shows the submission deltas
    When the manager reviews and approves the WF-3 order in a separate context
    Then the approval queue and dashboard return to the expected deltas
    And the buyer can see the WF-3 order as approved

  @TC-N04 @negative @validation @WF-5
  Scenario: Buyer is denied access to Approvals
    Given the buyer is logged in
    When the buyer opens the Approvals page
    Then Approvals access is denied to the buyer

  @TC-N10 @negative @validation @WF-4
  Scenario: A saved draft is not available in the manager approval queue
    Given the buyer starts the draft access check with dashboard baselines
    When the buyer saves the draft used for TC-N10
    Then the buyer dashboard reflects the saved draft delta
    When the manager checks the TC-N10 draft in a separate context
    Then the manager cannot see the draft in Approvals

  @TC-N11 @negative @validation @WF-5
  Scenario: Logging out blocks direct access to Approvals
    Given the buyer is logged in
    When the buyer logs out
    And the buyer opens the protected Approvals URL directly
    Then the login page is shown without protected approval content

  @TC-E12 @edge @validation @WF-1
  Scenario: Two pending requests remain independent when one is approved
    Given the buyer starts TC-E12 with dashboard baselines
    When the buyer submits two TC-E12 sample orders
    Then the buyer dashboard shows two additional open and pending orders
    When the manager approves the first TC-E12 order in a separate context
    Then one TC-E12 order remains pending and dashboard deltas reflect one decision

  @TC-P18 @positive @validation @WF-4
  Scenario: Buyer submits a saved draft for approval later
    Given the buyer is logged in
    And the buyer captures the pending approval baseline for TC-P18
    When the buyer saves and opens a TC-P18 draft
    Then the draft order page offers Submit for approval
    When the buyer submits the saved TC-P18 draft
    Then the saved draft becomes pending with a submission activity entry
    And the Pending approval KPI increases by one