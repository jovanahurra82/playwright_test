import { APIRequestContext, test as base, expect, request } from '@playwright/test';
 
// Define the fixture types
type ApiFixtures = {
  apiContext: APIRequestContext;
};
 
// Extend the base test with the `apiContext` fixture
export const test = base.extend<ApiFixtures>({
  apiContext: async ({}, use) => {
    const apiContext = await request.newContext({
      baseURL: 'https://test-379574553568.us-central1.run.app',
      extraHTTPHeaders: {
        'api_key': 'dsadsadsadsadsa',
        'content-type': 'application/json',
      },
    });
 
    // Provide the `apiContext` to the test
    await use(apiContext);
 
    // Clean up if needed
    await apiContext.dispose();
  },
});
 
export { expect };
 
