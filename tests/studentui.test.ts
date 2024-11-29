import { expect, test } from '@playwright/test';
import { StudentPage } from '../pages/studentpage';
 
test('Student page interactions', async ({ page }) => {
    const studentPage = new StudentPage(page);
 
    // Navigate to the page and set API key
    await studentPage.navigateToPageAndSetApiKey('jovanatestui');
 
    // Add a new student
    await studentPage.addStudent('Jovana Hurra', '18', 'A+');
 
    // Edit the student
    await studentPage.editStudent('1', 'Jovana Hurra', '20', 'A-');
    await page.waitForTimeout(1000);

    await expect(page.getByTestId('student_1_name')).toHaveText('markus_student_name_new')

    // Delete the student
    await studentPage.deleteStudent('1');
});
