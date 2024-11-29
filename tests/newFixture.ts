import { APIRequestContext, test as base, expect, request } from '@playwright/test';
 
// Define the fixture types
type ApiFixtures = {
  apiContext: APIRequestContext;
  student: { id: string; age: string; name: string; grade: string };
};
 
// Extend the base test with the `apiContext` fixture
export const test = base.extend<ApiFixtures>({
  apiContext: async ({}, use) => {
    const apiContext = await request.newContext({
      baseURL: 'https://test-379574553568.us-central1.run.app',
      extraHTTPHeaders: {
        'api_key': 'jovanafixture',
        'content-type': 'application/json',
      },
    });
 
    // Provide the `apiContext` to the test
    await use(apiContext);
 
    // Clean up if needed
    await apiContext.dispose();
  },
  student: async ({ apiContext }, use) => {
    // Add a student before the test
    const newStudent = { age: "20", name: "Test Student", grade: "A" };
    const response = await apiContext.post('/student', { data: newStudent });
    const studentStatus = await response.json();
    const responseGet = await apiContext.get(`/student/${studentStatus.student_id}`);
    const student = await responseGet.json();
 
    // Provide the `student` to the test
    await use(student);
 
    // Clean up by deleting all students after the test
    await apiContext.delete('/student');
  }
});
 
export { expect };
