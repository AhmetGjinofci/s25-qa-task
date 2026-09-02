# Shopware 6 Guest Checkout — QA Exercise

Automated end-to-end coverage of the guest checkout flow on a Shopware 6
storefront, written with Cypress and TypeScript.

- Manual test plan: [`docs/test-plan.md`](docs/test-plan.md)
- Bug report: [`docs/bug-report.md`](docs/bug-report.md)
- Automated test: [`cypress/e2e/guest-checkout.cy.ts`](cypress/e2e/guest-checkout.cy.ts)

## Target environment

By default the suite runs against the public demo store:

```
https://www.shopware6-demo.development-s25.com
```

The base URL is read from an environment variable, so the same suite runs
against a local instance without touching the code:

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

Videos land in `cypress/videos/` and failure screenshots in
`cypress/screenshots/`.

## What is covered

| Test | Test plan case | What it does |
| --- | --- | --- |
| TC-P-01 | Positive, high priority | Full happy path: search, product page, add to cart, guest details, cash on delivery, order confirmation |
| TC-N-01 | Negative, high priority | Confirms an empty required form does not advance to the confirmation step |

## Structure

```
cypress/pages/       Page Objects, one per screen
cypress/pages/selectors.ts   Every selector in the suite, in one file
cypress/data/        Test data builders
cypress/e2e/         Specs. These read as a description of the flow
cypress/support/     Custom commands and global setup
docs/                Test plan and bug report
```

## Decisions worth explaining

**Why Cypress.** I have used it before, and with a 48-hour window I would rather
submit code I can defend line by line than code written in a framework I met
yesterday. The interactive runner also makes the time-travel debugger genuinely
useful while stabilising selectors against a store I do not control.

**One selector file.** `cypress/pages/selectors.ts` holds every selector in the
suite. Shopware's default storefront ships without `data-test-id` attributes, so
the fallback order is: form field IDs bound to the form model
(`#personalMail`, `#billingAddressAddressZipcode`), then semantic Shopware core
classes, then accessible roles and visible text through
`@testing-library/cypress` (`findByRole`). No long CSS descendant chains
anywhere. If the demo store runs a custom theme, one file changes.

If this were a real project, my first request to the dev team would be
`data-test-id` attributes on the checkout controls. That is a small change for
them that removes an entire class of flakiness for QA.

**Assertions.** Each step asserts something a user would notice: the cart holds
exactly one line item matching the product that was clicked, the payment radio
is genuinely `:checked` after selecting it, the order summary lists the product,
and the confirmation page yields an order number matching `\d{4,}` rather than
merely existing. Asserting that a page loaded proves nothing.

**Product title is carried through the flow.** `openFirstProduct()` yields the
title of whatever it clicked, and that value is asserted again on the detail
page, in the cart, and in the order summary. Hardcoding a product name would
break the moment the demo store's catalogue changes.

**Unique email per run.** The demo store is shared, so a fixed address would
eventually collide with an existing customer and turn a test-data problem into a
false product failure.

**`uncaught:exception` handler.** The demo store throws occasional exceptions
from third-party scripts, and Cypress fails a test on any uncaught app exception
by default. Those are logged and ignored in `support/e2e.ts`. This is scoped and
deliberate, not a blanket silencer: anything that actually breaks the flow still
fails an assertion.

**Retries: one in run mode, none in open mode.** A slow public demo should not be
reported as a defect, but the run output still shows which tests were retried, so
genuine instability stays visible rather than hidden.

## Honest notes on what works and what does not

- The happy path and the empty-form negative case are automated. The remaining
  eight cases in the test plan were executed manually and are not automated.
- Selectors were written against the default Shopware 6 storefront. If the demo
  runs a custom theme, some will need adjusting. They are all in
  `cypress/pages/selectors.ts`.
- `continueAsGuest()` and `acceptTerms()` check whether their element exists
  before acting, because the register page differs between Shopware minor
  versions. This is defensive rather than elegant, and I would replace it with a
  hard assertion once the target version is pinned.
- Chrome only. No cross-browser or mobile viewport runs.
- Order confirmation emails are not verified. There is no mailbox access on the
  shared demo instance.

## What I would improve with more time

1. **API-level setup.** Seed the cart through the Store API instead of clicking
   through search and the product page. That cuts runtime and stops an unrelated
   search bug from failing a checkout test.
2. **Automate the rest of the plan**, starting with TC-E-02 (quantity 0 and
   999999), which is where I would expect to find real defects.
3. **Cross-browser and mobile viewports**, since checkout on a phone is where
   most real e-commerce revenue is lost.
4. **CI.** A GitHub Actions workflow running the suite on push and nightly,
   publishing videos and screenshots as artifacts.
5. **Accessibility checks** with `cypress-axe` across the checkout steps, because
   checkout is exactly where an accessibility defect costs real orders.
6. **A custom `cy.addProductToCart()` command** once more specs exist, so setup
   stops being repeated across tests.
