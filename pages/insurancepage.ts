import { expect, Page, Locator } from '@playwright/test';

export class InsurancePage {
    readonly page: Page;
    readonly firstNameInput: Locator;
    readonly lastNameInput: Locator;
    readonly addressInput: Locator;
    readonly apartmentSizeInput: Locator;
    readonly adultsInput: Locator;
    readonly kidsInput: Locator;
    readonly calculateButton: Locator;
    readonly monthlyPrice: Locator;
    readonly yearlyPrice: Locator;


    constructor(page: Page) {
        this.page = page;
        this.firstNameInput = page.getByPlaceholder('First name');
        this.lastNameInput = page.getByPlaceholder('Last name');
        this.addressInput = page.getByPlaceholder('Main St');
        this.apartmentSizeInput = page.getByPlaceholder('Apartment size');
        this.adultsInput = page.getByLabel('Adults');
        this.kidsInput = page.getByLabel('Kids');
        this.calculateButton = page.getByRole('button', { name: 'Calculate price' });
        this.monthlyPrice = page.locator('#monthly');
        this.yearlyPrice = page.locator('#yearly');
    }

    async goToPage() {
        await this.page.goto('https://hoff.is/insurance');
    }

    async fillInsuranceForm(firstName: string, lastName: string, address: string, apartmentSize: string, adults: string, kids: string) {
        await this.firstNameInput.fill(firstName)
        await this.lastNameInput.fill(lastName)
        await this.addressInput.fill(address)
        await this.apartmentSizeInput.fill(apartmentSize)
        await this.adultsInput.fill(adults)
        await this.kidsInput.fill(kids)
    }   

    async clickCalculate() {
        await this.calculateButton.click();
    }

    async verifyPrice(monthly: string, yearly: string) {
        await expect(this.monthlyPrice).toContainText(monthly);
        await expect(this.yearlyPrice).toContainText(yearly);
    }

    async verifySummaryContains(text: string) {
        const summaryList = this.page.getByLabel('Summary').getByRole('list');
        await expect(summaryList).toContainText(text);
    }
}