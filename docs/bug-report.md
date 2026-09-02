# Bug Report

## BUG-001 — Checkout accepts an invalid German postcode and creates an undeliverable order

**Found by:** TC-E-01 in the [test plan](test-plan.md).

The billing address form performs no format validation on the postcode field.
A six-digit value is accepted for a German address and the order completes
successfully, producing an order that cannot be delivered.

### Environment

|                    |                                                                  |
| ------------------ | ---------------------------------------------------------------- |
| **URL**            | https://www.shopware6-demo.development-s25.com/checkout/register |
| **Browser**        | Chrome 152                                                       |
| **OS**             | macOS Tahoe 26.6.2                                               |
| **Viewport**       | 1440 x 900                                                       |
| **Date**           | 02.09.2026                                                       |
| **Order produced** | 10903                                                            |

### Steps to reproduce

1. Open the storefront and add any product to the cart.
2. Click "Zur Kasse" to reach the checkout.
3. Untick "Kundenkonto anlegen" to continue as a guest.
4. Fill the form with valid data except the postcode:
   - Vorname: Ahmet, Nachname: Test
   - E-Mail: a unique address
   - Straße und Hausnummer: Teststrasse 12
   - **PLZ: 321231**
   - Ort: Bremen
   - Land: Germany
5. Click "Weiter".
6. Accept the AGB and submit the order.

**Reproducibility:** Always, 3 out of 3 attempts.

### Expected result

The postcode field should validate against the format of the selected country.
Germany uses exactly five digits, so `321231` should be rejected inline with a
message before the form advances, in the same way the empty-field validation
already works.

### Actual result

The value is accepted without any warning. The form advances to
`/checkout/confirm`, the confirmation page displays "321231 Bremen" as both the
delivery and billing address, and submitting produces order number 10903 with
that address stored.

The same lack of validation was confirmed with `doqwndlqwd` entered as the city
(order 10902), which suggests address fields are validated for presence only,
never for format.

### Severity: Medium

It does not block a purchase, and that is precisely the problem: nothing is
blocked. Every order placed with a malformed address enters the system looking
valid and only fails at fulfilment, where it needs manual correction or a
customer contact. There is no workaround for the customer, since a typo is
silently accepted. It is not Critical because it requires bad input rather than
occurring on the happy path, and because the order data can be corrected in the
back office.

### Attachments

![Order 10903 created with postcode 321231](screenshots/order-10903-invalid-postcode.png)

![Order 10902 created with postcode 321231 and city doqwndlqwd](screenshots/order-10902-invalid-city.png)

---

## Additional finding

## BUG-002 — Cart quantity validation messages render in the browser's language, not the storefront's

**Found by:** TC-E-02 in the [test plan](test-plan.md).

The quantity field on the cart page relies on the HTML `min` and `max`
attributes with no custom validation message, so the browser generates the error
text in its own UI language rather than the storefront's.

### Environment

|              |                                                              |
| ------------ | ------------------------------------------------------------ |
| **URL**      | https://www.shopware6-demo.development-s25.com/checkout/cart |
| **Browser**  | Chrome 152                                                   |
| **OS**       | macOS Tahoe 26.6.2                                           |
| **Viewport** | 1440 x 900                                                   |
| **Date**     | 02.09.2026                                                   |

### Steps to reproduce

1. Add any product to the cart and open `/checkout/cart`.
2. Set the Anzahl field to `0` and commit the change.
3. Repeat with `9999999`.

**Reproducibility:** Always.

### Expected result

Validation messages should appear in the storefront's language, consistent with
the rest of the page.

### Actual result

The tooltips read "Value must be greater than or equal to 1." and "Value must be
less than or equal to 100." in English, on a page where every other label is
German (Warenkorb, Anzahl, Stückpreis, Zusammenfassung).

The cause is visible in the markup:

```html
<input
  type="number"
  name="quantity"
  min="1"
  max="100"
  step="1"
  aria-label="Anzahl von Demo Produkt"
  ...
/>
```

The `aria-label` is translated, but there is no `title` attribute and no custom
constraint message, so the text falls back to the browser locale and sits
entirely outside the store's translation system.

### Severity: Low

The validation itself works correctly and no invalid quantity reaches an order.
The impact is limited to inconsistent presentation, though it affects any
customer whose browser language differs from the storefront's, in either
direction.

### Attachments

![Quantity 0 rejected with an English message on a German page](screenshots/quantity-zero-english-message.png)

![Quantity 9999999 rejected with an English message on a German page](screenshots/quantity-max-english-message.png)
