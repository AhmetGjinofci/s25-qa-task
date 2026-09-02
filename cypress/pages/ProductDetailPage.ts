import { SEL } from './selectors';

export class ProductDetailPage {
  expectLoadedFor(expectedTitle: string): void {
    cy.get(SEL.product.title).should('be.visible').and('contain.text', expectedTitle.split(' ')[0]);
    cy.get(SEL.product.price).should('be.visible');
  }

  addToCart(): void {
    cy.get(SEL.product.buyForm)
      .findByRole('button', { name: /add to (shopping )?cart|in den warenkorb/i })
      .should('be.enabled')
      .click();
  }
}
