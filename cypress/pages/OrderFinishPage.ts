import { SEL } from './selectors';

export class OrderFinishPage {
  expectOrderPlaced(): void {
    cy.url().should('include', '/checkout/finish');
    cy.get(SEL.finish.header).should('be.visible');
  }

  /** Yields the order number so the test can assert its shape, not just its presence. */
  readOrderNumber(): Cypress.Chainable<string> {
    return cy
      .get(SEL.finish.orderNumber)
      .should('be.visible')
      .invoke('text')
      .then((text) => {
        const match = text.trim().match(/\d{4,}/);
        return cy.wrap(match ? match[0] : text.trim());
      });
  }
}
