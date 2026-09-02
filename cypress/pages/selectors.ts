/**
 * Every selector in the suite lives here.
 *
 * Shopware's default storefront ships without data-test-id attributes, so this
 * uses the strongest alternatives available, in order of preference:
 *   1. form field IDs bound to the form model (rarely renamed)
 *   2. semantic component classes from the Shopware core theme
 * Accessible roles and visible text are used directly in the page objects via
 * findByRole and cy.contains, which is the closest Cypress equivalent to a
 * data-test-id when none exists.
 *
 * If the demo store runs a custom theme, this is the only file that changes.
 */
export const SEL = {
  search: {
    input: '#header-main-search-input',
    submit: 'button.header-search-btn',
  },
  listing: {
    productName: '.product-name',
    productBox: '.product-box',
  },
  product: {
    title: '.product-detail-name',
    price: '.product-detail-price',
    buyForm: '.product-detail-buy',
  },
  offcanvas: {
    panel: '.offcanvas',
    lineItem: '.line-item',
    checkoutLink: 'a[href*="/checkout/confirm"]',
  },
    register: {
    form: 'form.register-form',
    guestToggle: '#createCustomerAccountCheckbox, input[name="createCustomerAccount"][type="checkbox"]',
    salutation: '#personalSalutation',
    firstName: '#billingAddress-personalFirstName',
    lastName: '#billingAddress-personalLastName',
    email: '#personalMail',
    street: '#billingAddress-AddressStreet',
    zipcode: '#billingAddressAddressZipcode',
    city: '#billingAddressAddressCity',
    country: '#billingAddressAddressCountry',
    invalidField: '.is-invalid, [aria-invalid="true"]',
  },
  confirm: {
    paymentMethodRadio: 'input[name="paymentMethodId"]',
    paymentMethodLabel: '.payment-method-label',
    terms: '#tos',
    submitOrder: '#confirmFormSubmit',
    summary: '.checkout-product-table, .checkout-aside-container',
  },
  finish: {
    header: '.finish-header',
    orderNumber: '.finish-ordernumber',
  },
} as const;
