import {  test, request, APIRequestContext, expect } from '@playwright/test';
import { StudentPage } from '../pages/studentpage';

let apiContext: APIRequestContext;
const api_key = "jovanatestinteraction"

test.beforeAll('Setup api context', async () => {
    apiContext = await request.newContext({
        baseURL: 'https://test-379574553568.us-central1.run.app',
        extraHTTPHeaders: {
            'api_key': api_key,
            'Content-type': 'application/json'
        }
    })
    await apiContext.delete("/student_delete_all")
})

test.only('Student page interactions', async ({ page }) => {
    const studentPage = new StudentPage(page);
 
    // Navigate to the page and set API key
    await studentPage.navigateToPageAndSetApiKey(api_key);
 
    // Add a new student
    await studentPage.addStudent('Jovana Hurra', '18', 'A+');
 
    // Edit the student
    await studentPage.editStudent('1', 'Jovana Hurra', '20', 'A-');
    await page.waitForTimeout(1000);
    // Delete the student
    //await studentPage.deleteStudent('1');

    const responseGet = await apiContext.get(`/student/1`)
    const responseGetJson = await responseGet.json();
 
    //Verify student that is created has the expected age
    expect(responseGetJson.age).toBe('20')
    expect(responseGetJson.name).toBe('Jovana Hurra')
    expect(responseGetJson.grade).toBe('A-')
});