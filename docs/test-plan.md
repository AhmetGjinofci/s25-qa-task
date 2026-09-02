# Test Plan: Guest Checkout with Cash on Delivery

**Author:** Ahmet Gjinofci
**Date:** [date]
**Application under test:** Shopware 6 storefront
**Environment:** https://www.shopware6-demo.development-s25.com/
**Browser:** Chrome [version] on [OS]

## Scope

This plan covers the core purchase flow for a visitor who is not logged in:
finding a product, adding it to the cart, and completing checkout using
"Cash on delivery" as the payment method.

In scope: product discovery, cart, guest registration form, payment method
selection, order confirmation.

Out of scope: registered customer accounts, other payment methods, shipping
cost calculation rules, order confirmation emails (no mailbox access on the
shared demo instance), admin panel.

## Assumptions

- The demo store is shared and its data can change between runs. Test cases
  refer to "any available product" rather than a fixed product name, except
  where the case is specifically about search.
- "Cash on delivery" is enabled as a payment method for the guest checkout.
  This was verified manually before writing the plan. If it is disabled, cases
  TC-P-01, TC-P-04 and TC-P-05 cannot run as written.

## Priority definitions

| Priority | Meaning |
| --- | --- |
| High | Blocks purchase. A failure here means no revenue. |
| Medium | Degrades the flow but a determined user can still complete an order. |
| Low | Cosmetic or rare-path issue. |

---

## Positive test cases

### TC-P-01 — Complete guest checkout with Cash on delivery

| Field | Value |
| --- | --- |
| **Priority** | High |
| **Preconditions** | Browser open, no active session, cart empty |

| # | Step | Expected result |
| --- | --- | --- |
| 1 | Open the storefront home page | Home page loads, HTTP 200, no console errors |
| 2 | Open any product detail page | Product name, price and buy button are visible |
| 3 | Click "Add to shopping cart" | Off-canvas cart opens showing the product, quantity 1 |
| 4 | Click "Go to checkout" | Checkout login/register page loads at `/checkout/register` |
| 5 | Choose to continue as guest and fill salutation, first name, last name, email, street, postcode, city, country with valid data | Form accepts the input, no validation errors shown |
| 6 | Submit the form | Confirmation page loads at `/checkout/confirm` |
| 7 | Select "Cash on delivery" as the payment method | Cash on delivery is shown as the selected method in the order summary |
| 8 | Accept the terms and conditions and submit the order | Finish page loads at `/checkout/finish`, a confirmation message and an order number are displayed |

**Expected result:** An order is placed and the customer receives an order number on screen.

---

### TC-P-02 — Find a product through the search bar

| Field | Value |
| --- | --- |
| **Priority** | High |
| **Preconditions** | Home page open |

| # | Step | Expected result |
| --- | --- | --- |
| 1 | Click the search field in the header | Search input is focused |
| 2 | Type a term that matches an existing product | A suggestion dropdown appears with matching products |
| 3 | Press Enter | Search results page loads showing at least one result, and the search term is shown on the page |
| 4 | Click the first result | The correct product detail page opens, matching the clicked title |

**Expected result:** Search returns relevant products and leads to the correct detail page.

---

### TC-P-03 — Find a product through category navigation

| Field | Value |
| --- | --- |
| **Priority** | Medium |
| **Preconditions** | Home page open |

| # | Step | Expected result |
| --- | --- | --- |
| 1 | Open a category from the main navigation | Category listing page loads with a product grid |
| 2 | Apply a sort option, for example price ascending | Products reorder and the first price is lower than or equal to the last |
| 3 | Open a product from the listing | Product detail page opens for the selected product |
| 4 | Add it to the cart | Off-canvas cart shows the product |

**Expected result:** A product can be reached and purchased without using search.

---

### TC-P-04 — Change quantity in the cart before checkout

| Field | Value |
| --- | --- |
| **Priority** | High |
| **Preconditions** | One product already in the cart |

| # | Step | Expected result |
| --- | --- | --- |
| 1 | Open the cart page | Cart shows one line item, quantity 1, with a line total equal to the unit price |
| 2 | Change the quantity to 3 | Page updates, quantity shows 3 |
| 3 | Check the line total and the grand total | Line total equals unit price x 3, grand total updates accordingly |
| 4 | Proceed to checkout and complete the guest flow with Cash on delivery | Order is placed and the confirmation shows quantity 3 |

**Expected result:** Quantity changes are reflected correctly in totals and carried into the order.

---

### TC-P-05 — Cart contents survive navigation

| Field | Value |
| --- | --- |
| **Priority** | Medium |
| **Preconditions** | Cart empty |

| # | Step | Expected result |
| --- | --- | --- |
| 1 | Add a product to the cart | Cart badge in the header shows 1 |
| 2 | Navigate to the home page, then to a category page | Cart badge still shows 1 on every page |
| 3 | Reload the browser | Cart badge still shows 1 |
| 4 | Open the cart page | The same product is listed with the same quantity and price |

**Expected result:** The guest cart persists across navigation and reloads within the session.

---

## Negative test cases

### TC-N-01 — Submit the guest form with required fields empty

| Field | Value |
| --- | --- |
| **Priority** | High |
| **Preconditions** | One product in cart, guest checkout form open |

| # | Step | Expected result |
| --- | --- | --- |
| 1 | Leave all fields blank | Form is empty |
| 2 | Submit the form | Submission is blocked, the page stays on `/checkout/register` |
| 3 | Inspect the messages | Each required field shows a validation message, and focus or scroll moves to the first invalid field |

**Expected result:** The order cannot proceed and the user is told exactly which fields are missing.

---

### TC-N-02 — Submit an invalid email address

| Field | Value |
| --- | --- |
| **Priority** | High |
| **Preconditions** | One product in cart, guest checkout form open, all other fields valid |

| # | Step | Expected result |
| --- | --- | --- |
| 1 | Enter `ahmet.example.com` in the email field (no @ sign) | Value is accepted into the field |
| 2 | Submit the form | Submission is blocked |
| 3 | Read the message | A message identifies the email field as invalid, and previously entered valid fields are preserved |

**Expected result:** Malformed email is rejected and the user does not have to retype the whole form.

---

### TC-N-03 — Attempt to check out with an empty cart

| Field | Value |
| --- | --- |
| **Priority** | Medium |
| **Preconditions** | Cart empty |

| # | Step | Expected result |
| --- | --- | --- |
| 1 | Navigate directly to `/checkout/confirm` | The user is redirected away from the confirmation page |
| 2 | Observe the destination | The cart page or home page is shown with a message that the cart is empty |
| 3 | Confirm no order was created | No order number is generated |

**Expected result:** An empty cart cannot reach the confirmation step, even by direct URL.

---

### TC-N-04 — Submit the order without accepting the terms

| Field | Value |
| --- | --- |
| **Priority** | High |
| **Preconditions** | Guest details submitted, confirmation page open, Cash on delivery selected |

| # | Step | Expected result |
| --- | --- | --- |
| 1 | Leave the terms and conditions checkbox unticked | Checkbox is unchecked |
| 2 | Click the submit order button | Order is not placed, page stays on `/checkout/confirm` |
| 3 | Read the message | A validation message points at the terms checkbox |

**Expected result:** No order is created without explicit acceptance of the terms.

---

## Edge cases

### TC-E-01 — Very long and special-character input in name and address

| Field | Value |
| --- | --- |
| **Priority** | Low |
| **Preconditions** | One product in cart, guest checkout form open |

| # | Step | Expected result |
| --- | --- | --- |
| 1 | Enter a 256-character string as the last name | Field either accepts the value or enforces a visible maximum length |
| 2 | Enter a street containing accented and non-Latin characters, for example `Rruga Ahmet Gjinofci ëç 12/A` | Characters are preserved exactly, no mojibake |
| 3 | Submit the form | Either the order completes with the values shown correctly on the confirmation page, or a clear length validation message appears |
| 4 | Check the rendered confirmation | No layout break, no text overflowing its container, no truncation without an ellipsis |

**Expected result:** The store handles long and non-ASCII input without data corruption or broken layout. A clear limit is acceptable; silent truncation is not.

---

### TC-E-02 — Quantity of zero and a very large quantity

| Field | Value |
| --- | --- |
| **Priority** | Medium |
| **Preconditions** | One product in the cart |

| # | Step | Expected result |
| --- | --- | --- |
| 1 | Set the cart quantity to 0 | Either the line item is removed, or the value is rejected with a message. The cart must not show a line with quantity 0 and a price of 0 |
| 2 | Re-add the product and set the quantity to 999999 | Either the quantity is capped at available stock with a message, or the value is rejected |
| 3 | Check the totals | The total is a valid positive amount, correctly formatted, with no overflow or scientific notation |
| 4 | Attempt to complete checkout | Either the order reflects the capped quantity, or checkout is blocked with an explanation |

**Expected result:** Out-of-range quantities are handled explicitly rather than producing a zero-value or nonsensical order.

---

## Risks and notes

- The demo store is shared, so another tester's actions can change stock levels
  and cause intermittent failures in TC-E-02.
- Order confirmation emails are not verifiable without mailbox access, so email
  delivery is untested.
- Tests were executed on Chrome only. Cross-browser and mobile viewport testing
  would be the first extension of this plan.
