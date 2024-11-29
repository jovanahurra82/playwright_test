import { Page, Locator } from '@playwright/test';
 
export class StudentPage {
    readonly page: Page;
    readonly apiKeyInput: Locator;
    readonly nameInput: Locator;
    readonly ageInput: Locator;
    readonly gradeInput: Locator;
    readonly submitStudentButton: Locator;
 
    constructor(page: Page) {
        this.page = page;
        this.apiKeyInput = page.getByTestId('api_key_input');
        this.nameInput = page.getByTestId('name_input');
        this.ageInput = page.getByTestId('age_input');
        this.gradeInput = page.getByTestId('grade_input');
        this.submitStudentButton = page.getByTestId('submit_student');
    }
 
    async navigateToPageAndSetApiKey(apiKey: string): Promise<void> {
        await this.page.goto('https://test-379574553568.us-central1.run.app/');        
        await this.apiKeyInput.fill(apiKey);
    }
 
    async addStudent(name: string, age: string, grade: string): Promise<void> {        
        await this.nameInput.fill(name);        
        await this.ageInput.fill(age);        
        await this.gradeInput.fill(grade);
        await this.submitStudentButton.click();
    }
 
    async editStudent(studentId: string, newName: string, newAge: string, newGrade: string): Promise<void> {
        const editButton = this.page.getByTestId(`student_${studentId}_edit_button`);
        await editButton.click();        
        await this.nameInput.fill(newName);        
        await this.ageInput.fill(newAge);        
        await this.gradeInput.fill(newGrade);
        await this.submitStudentButton.click();
    }
 
    async deleteStudent(studentId: string): Promise<void> {
        const deleteButton = this.page.getByTestId(`student_${studentId}_delete_button`);
        await deleteButton.click();
    }
}