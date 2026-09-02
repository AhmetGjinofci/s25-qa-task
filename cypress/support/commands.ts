export {};

declare global {
  namespace Cypress {
    interface Chainable {
      /** Dismisses the cookie banner if one is present. Safe to call anywhere. */
      acceptCookiesIfPresent(): Chainable<void>;
    }
  }
}

Cypress.Commands.add('acceptCookiesIfPresent', () => {
  cy.get('body').then(($body) => {
    const button = $body
      .find('button, a')
      .filter((_, el) =>
        /accept|allow|akzeptieren|zustimmen|einverstanden/i.test(
          el.textContent ?? ''
        )
      )
      .first();

    if (button.length) {
      cy.wrap(button).click({ force: true });
    }
  });
});
