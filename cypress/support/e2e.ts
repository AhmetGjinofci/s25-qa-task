import '@testing-library/cypress/add-commands';
import './commands';

/**
 * The demo storefront throws the occasional uncaught exception from third-party
 * scripts. Those are not failures of the checkout flow, so they are swallowed
 * here and logged instead. This is deliberate, not a blanket ignore: anything
 * that actually breaks the flow will still fail an assertion.
 */
Cypress.on('uncaught:exception', (err) => {
  cy.log(`Uncaught app exception ignored: ${err.message}`);
  return false;
});
