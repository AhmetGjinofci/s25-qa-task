import { SEL } from './selectors';
import type { Customer } from '../data/customer';

/** Guest details step of the checkout: /checkout/register */
export class CheckoutRegisterPage {
  expectLoaded(): void {
    cy.url().should('include', '/checkout/register');
    cy.get(SEL.register.email).should('be.visible');
  }

  /** Selects guest checkout if the storefront presents it as an explicit choice. */
    continueAsGuest(): void {
    cy.get('body').then(($body) => {
      const box = $body.find(SEL.register.guestToggle).filter(':visible');

      if (box.length && (box[0] as unknown as HTMLInputElement).checked) {
        cy.wrap(box).uncheck();
      }
    });
  }

  fillDetails(customer: Customer): void {
    cy.get(SEL.register.salutation).select(customer.salutation);
    cy.get(SEL.register.firstName).clear().type(customer.firstName);
    cy.get(SEL.register.lastName).clear().type(customer.lastName);
    cy.get(SEL.register.email).clear().type(customer.email);
    cy.get(SEL.register.street).clear().type(customer.street);
    cy.get(SEL.register.zipcode).clear().type(customer.zipcode);
    cy.get(SEL.register.city).clear().type(customer.city);
    cy.get(SEL.register.country).select(customer.country);
  }

  submit(): void {
    cy.get(SEL.register.form).findByRole('button', { name: /continue|submit|weiter/i }).click();
  }

  /** Used by the negative case: an incomplete form must not advance the checkout. */
  expectStillOnFormWithErrors(): void {
    cy.url().should('include', '/checkout/register');
    cy.get(SEL.register.invalidField).should('exist');
  }
}
