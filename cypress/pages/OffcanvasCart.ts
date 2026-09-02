import { SEL } from './selectors';

/** The slide-in cart panel that opens after adding a product. */
export class OffcanvasCart {
  expectContains(productTitle: string): void {
    cy.get(SEL.offcanvas.panel).should('be.visible');
    cy.get(SEL.offcanvas.lineItem).should('have.length', 1);
    cy.get(SEL.offcanvas.panel).should('contain.text', productTitle.split(' ')[0]);
  }

  proceedToCheckout(): void {
    cy.get(SEL.offcanvas.checkoutLink).first().click();
  }
}
