import { defineConfig } from 'cypress';

/**
 * baseUrl comes from the environment so the same suite runs against the public
 * demo store or a local DDEV instance without editing code:
 *   CYPRESS_BASE_URL=http://localhost npx cypress run
 */
export default defineConfig({
  e2e: {
    baseUrl:
      process.env.CYPRESS_BASE_URL ??
      'https://www.shopware6-demo.development-s25.com',

    specPattern: 'cypress/e2e/**/*.cy.ts',
    supportFile: 'cypress/support/e2e.ts',

    viewportWidth: 1440,
    viewportHeight: 900,

    defaultCommandTimeout: 10_000,
    pageLoadTimeout: 60_000,

    // The demo store is a third-party site we do not control. Cypress fails a
    // test on any uncaught app exception by default, which would report the
    // store's own JS errors as failures of our checkout test. See support/e2e.ts.
    video: true,
    screenshotOnRunFailure: true,

    // One retry on run, none in open mode: the public demo is occasionally slow
    // and a network blip should not be reported as a product defect.
    retries: { runMode: 1, openMode: 0 },
  },
});
