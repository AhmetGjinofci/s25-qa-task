# Shopware 6 Guest Checkout — QA Exercise

QA exercise for solution25: a manual test plan, one automated end-to-end test,
and a bug report for the guest checkout flow of a Shopware 6 storefront.

- **Manual test plan:** [`docs/test-plan.md`](docs/test-plan.md) — 11 cases, all executed
- **Bug report:** [`docs/bug-report.md`](docs/bug-report.md) — 2 defects found
- **Automated test:** [`cypress/e2e/guest-checkout.cy.ts`](cypress/e2e/guest-checkout.cy.ts)

Written with Cypress and TypeScript.

## Target environment

```
https://www.shopware6-demo.development-s25.com
```

The base URL comes from an environment variable, so the same suite runs against
a local instance without touching the code:

```bash
CYPRESS_BASE_URL=http://localhost npx cypress run
```

## Setup

Requires Node.js 18 or newer.

```bash
npm install
```

## Running

```bash
npm run cy:open   # interactive runner, best for developing and debugging
npm run cy:run    # headless, full run
npm test          # headless in Chrome
npm run typecheck # TypeScript check, no test execution
```

Videos land in `cypress/videos/`, failure screenshots in `cypress/screenshots/`.

## What is automated

| Test    | Test plan case | What it does                                                                                            |
| ------- | -------------- | ------------------------------------------------------------------------------------------------------- |
| TC-P-01 | Positive, High | Full happy path: search, product page, add to cart, guest details, cash on delivery, order confirmation |
| TC-N-01 | Negative, High | Confirms an empty required form does not advance to the confirmation step                               |

The other nine cases in the test plan were executed manually. Results and
screenshot evidence for all eleven are in the test plan.

## Structure

```
cypress/pages/              Page Objects, one per screen
cypress/pages/selectors.ts  Every selector in the suite, in one file
cypress/data/               Test data builders
cypress/e2e/                Specs
cypress/support/            Custom commands and global setup
docs/                       Test plan, bug report, screenshots
```

## Decisions worth explaining

**Why Cypress.** I have used it before, and with a limited window I would rather
submit code I can defend line by line than code written in a framework I met
yesterday. The interactive runner's time-travel debugger was also genuinely
useful for stabilising selectors against a store I do not control.

**One selector file.** Every selector lives in `cypress/pages/selectors.ts`.
Shopware's default storefront ships without `data-test-id` attributes, so the
fallback order is: form field IDs bound to the form model (`#personalMail`,
`#billingAddressAddressZipcode`), then semantic Shopware core classes, then
accessible roles and visible text via `@testing-library/cypress`. No long CSS
descendant chains anywhere.

Centralising them was not theoretical. Shopware's own field naming is
inconsistent — `#billingAddress-AddressStreet` has a capital A and a hyphen,
`#billingAddressAddressZipcode` has neither — and several selectors had to be
corrected against the live store. Keeping them in one file made each correction
a one-line change rather than a hunt through six files.

If this were a real project, my first request to the dev team would be
`data-test-id` attributes on the checkout controls. Small change for them,
removes a whole class of flakiness for QA.

**Assertions.** Each step asserts something a user would notice: the cart holds
exactly one line item matching the product that was clicked, the payment radio
is genuinely `:checked` after selecting it, and the confirmation page yields an
order number matching `\d{4,}` rather than merely existing. Asserting that a
page loaded proves nothing.

**The product title is carried through the flow.** `openFirstProduct()` yields
the title of whatever it clicked, and that value is asserted again on the detail
page and in the cart. Hardcoding a product name would break as soon as the demo
catalogue changes.

**Unique email per run.** The store is shared, so a fixed address would
eventually collide with an existing customer and turn a test-data problem into
a false product failure.

**`uncaught:exception` handler.** The demo store throws occasional exceptions
from third-party scripts, and Cypress fails a test on any uncaught app exception
by default. Those are logged and ignored in `cypress/support/e2e.ts`. This is
deliberate and scoped: anything that actually breaks the checkout still fails an
assertion.

**Retries: one in run mode, none in open mode.** A slow public demo should not be
reported as a defect, but the run output still shows which tests were retried, so
genuine instability stays visible.

## Honest notes on what works and what does not

- Two of eleven cases are automated. The other nine were executed manually, with
  a screenshot for each.
- **The storefront serves German content despite declaring `lang="en-GB"`**, and
  the language is inconsistent between pages and sessions. This cost me time
  early on: with Chrome's auto-translation active, partially translated pages
  looked like defects. I discarded two findings for this reason before checking
  in a clean browser. Disable translation before running anything here.
- I removed an assertion that checked the product name appears in the
  confirmation page summary. The product is rendered in a separate table rather
  than the summary aside, and I could not pin down a stable container for it in
  the time available. With more time I would locate it and restore the check.
- `continueAsGuest()` and `acceptTerms()` check whether their element exists
  before acting, because the register page differs between Shopware versions.
  This is defensive rather than elegant. I would replace it with a hard
  assertion once the target version is pinned.
- Chrome 152 only, desktop width. No cross-browser or mobile runs.
- Order confirmation emails are not verified. No mailbox access on the shared
  instance.
- The suite creates real orders on a shared demo store. In a real project this
  would run against a dedicated environment with a cleanup step.

## What I would improve with more time

1. **API-level setup.** Seed the cart through the Store API instead of clicking
   through search and the product page. Cuts runtime and stops an unrelated
   search bug from failing a checkout test.
2. **Automate the remaining cases**, starting with TC-E-01, the postcode
   validation gap, so the defect is covered by a regression test rather than
   only a written report.
3. **Cross-browser and mobile viewports**, since mobile checkout is where most
   real e-commerce revenue is lost.
4. **CI.** A GitHub Actions workflow running the suite on push and nightly,
   publishing videos and screenshots as artifacts.
5. **Accessibility checks** with `cypress-axe` across the checkout steps. The
   `lang="en-GB"` mismatch found during testing is exactly the kind of thing an
   automated accessibility check catches.
6. **A custom `cy.addProductToCart()` command** once more specs exist, so setup
   stops being repeated across tests.
