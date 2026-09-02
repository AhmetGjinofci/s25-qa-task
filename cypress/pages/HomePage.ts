import { SEL } from './selectors';

export class HomePage {
  open(): void {
    cy.visit('/');
    cy.acceptCookiesIfPresent();
    cy.get(SEL.search.input).should('be.visible');
  }

  searchFor(term: string): void {
    cy.get(SEL.search.input).clear().type(`${term}{enter}`);
    cy.url().should('include', '/search');
    cy.get(SEL.listing.productBox).should('have.length.greaterThan', 0);
  }

  /**
   * Opens the first product on the current listing and yields its title, so the
   * test can assert the detail page and the cart show the same product rather
   * than trusting that the click landed somewhere sensible.
   */
  openFirstProduct(): Cypress.Chainable<string> {
    return cy
      .get(SEL.listing.productName)
      .first()
      .then(($el) => {
        const title = $el.text().trim();
        cy.wrap($el).click();
        return cy.wrap(title);
      });
  }
}
