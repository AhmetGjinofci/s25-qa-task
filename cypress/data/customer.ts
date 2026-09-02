export interface Customer {
  salutation: string;
  firstName: string;
  lastName: string;
  email: string;
  street: string;
  zipcode: string;
  city: string;
  country: string;
}

/**
 * A unique email per run keeps the guest checkout from colliding with an
 * existing customer record on the shared demo store.
 */
export function buildGuestCustomer(overrides: Partial<Customer> = {}): Customer {
  const unique = `${Date.now()}-${Math.floor(Math.random() * 1000)}`;

  return {
    salutation: 'Mr.',
    firstName: 'Ahmet',
    lastName: 'Tester',
    email: `qa.guest.${unique}@example.com`,
    street: 'Teststrasse 12',
    zipcode: '28195',
    city: 'Bremen',
    country: 'Germany',
    ...overrides,
  };
}
