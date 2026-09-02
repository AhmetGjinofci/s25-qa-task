import { HomePage } from '../pages/HomePage';
import { ProductDetailPage } from '../pages/ProductDetailPage';
import { OffcanvasCart } from '../pages/OffcanvasCart';
import { CheckoutRegisterPage } from '../pages/CheckoutRegisterPage';
import { CheckoutConfirmPage } from '../pages/CheckoutConfirmPage';
import { OrderFinishPage } from '../pages/OrderFinishPage';
import { buildGuestCustomer } from '../data/customer';

const CASH_ON_DELIVERY = /cash on delivery|nachnahme/i;
const SEARCH_TERM = 'Westin';

describe('Guest checkout', () => {
  const home = new HomePage();
  const product = new ProductDetailPage();
  const cart = new OffcanvasCart();
  const register = new CheckoutRegisterPage();
  const confirm = new CheckoutConfirmPage();
  const finish = new OrderFinishPage();

  beforeEach(() => {
    // Cypress 12+ clears cookies and local storage between tests, so every test
    // starts as a genuinely new visitor. That is exactly what a guest flow needs.
    home.open();
  });

  it('TC-P-01: a guest can buy a product paying cash on delivery', () => {
    const customer = buildGuestCustomer();

    home.searchFor(SEARCH_TERM);

    home.openFirstProduct().then((productTitle) => {
      product.expectLoadedFor(productTitle);
      product.addToCart();
      cart.expectContains(productTitle);
      cart.proceedToCheckout();

      register.expectLoaded();
      register.continueAsGuest();
      register.fillDetails(customer);
      register.submit();

      confirm.expectLoaded();
      confirm.selectPaymentMethod(CASH_ON_DELIVERY);
      confirm.acceptTerms();
      confirm.submitOrder();

      finish.expectOrderPlaced();
      finish.readOrderNumber().should('match', /^\d{4,}$/);
    });
  });

  it('TC-N-01: submitting the guest form empty blocks checkout', () => {
    home.searchFor(SEARCH_TERM);

    home.openFirstProduct().then((productTitle) => {
      product.expectLoadedFor(productTitle);
      product.addToCart();
      cart.proceedToCheckout();

      register.expectLoaded();
      register.continueAsGuest();
      register.submit();

      register.expectStillOnFormWithErrors();
      cy.url().should('not.include', '/checkout/confirm');
      cy.url().should('not.include', '/checkout/finish');
    });
  });
});
