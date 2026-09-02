# Bug Report

> Template filled with a worked example. Replace the content with the issue you
> actually observe while testing, keeping the structure.

---

## BUG-001 — [Short, specific title: what breaks, where, under what condition]

A good title names the symptom and the location, for example
"Cart accepts quantity 0 and shows a line item with a total of 0.00 EUR".
A bad title is "Cart bug".

### Environment

| | |
| --- | --- |
| **URL** | https://www.shopware6-demo.development-s25.com/checkout/cart |
| **Browser** | Chrome [version] |
| **OS** | [your OS and version] |
| **Viewport** | 1920 x 1080 |
| **Date/time** | [when you observed it] |
| **Shopware version** | [if visible in the footer or page source] |

### Steps to reproduce

1. Open the storefront home page.
2. Search for "[product]" and open the first result.
3. Click "Add to shopping cart".
4. Open the cart page.
5. Set the quantity field to 0 and confirm the change.

**Reproducibility:** [always / intermittent, N out of 5 attempts]

### Expected result

[What should happen, and ideally why. For example: the line item is removed from
the cart, or the input is rejected with a message. A cart line with quantity 0
is not a valid state.]

### Actual result

[What actually happened, precisely. Include the exact error text or the exact
displayed values. Not "it breaks" but "the line item remains with quantity 0 and
a line total of 0.00 EUR, and checkout can still be started".]

### Severity: [Critical / High / Medium / Low]

**Justification:** [Tie it to impact, not to how annoying it looks. Mention
whether it blocks purchase, how many users hit it, whether there is a
workaround, and whether it can produce bad order data. For example: Medium.
It does not block the main purchase flow and requires deliberate input, but it
can create a zero-value order that needs manual cleanup in the back office.]

### Attachments

- [screenshot.png]
- [screen-recording.mp4]

### Notes

[Anything useful for whoever picks this up: does it happen on other browsers,
does it happen with other products, did the console show an error, is there a
failed network request in the Network tab.]
