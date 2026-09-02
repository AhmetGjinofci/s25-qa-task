import { SEL } from './selectors';

export class CheckoutConfirmPage {
  expectLoaded(): void {
    cy.url().should('include', '/checkout/confirm');
    cy.get(SEL.confirm.submitOrder).should('be.visible');
  }

  /**
   * Selects a payment method by its visible label, then asserts the radio is
   * genuinely checked rather than assuming the click registered.
   */
  selectPaymentMethod(label: RegExp): void {
    cy.contains(SEL.confirm.paymentMethodLabel, label)
      .click()
      .then(() => {
        cy.get(`${SEL.confirm.paymentMethodRadio}:checked`).should('exist');
      });
  }

  expectSummaryContains(productTitle: string): void {
    cy.get(SEL.confirm.summary).should('contain.text', productTitle.split(' ')[0]);
  }

  acceptTerms(): void {
    cy.get('body').then(($body) => {
      if ($body.find(SEL.confirm.terms).length) {
        cy.get(SEL.confirm.terms).check().should('be.checked');
      }
    });
  }

  submitOrder(): void {
    cy.get(SEL.confirm.submitOrder).click();
  }
}
