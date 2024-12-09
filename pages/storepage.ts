import { Page, Locator } from '@playwright/test';

export class StorePage {
    readonly page: Page;
    readonly header: Locator;
    readonly selectProduct: Locator;
    readonly amountInput: Locator;
    readonly addToCartButton: Locator;
    readonly cartItems: Locator;
    readonly grandTotal: Locator;

    constructor(page: Page) {
        this.page = page;
        this.header = page.locator('h1.header');
        this.selectProduct = page.getByTestId('select-product');
        this.amountInput = page.getByLabel('Amount');
        this.addToCartButton = page.getByTestId('add-to-cart-button');
        this.cartItems = page.locator('#cartItems');
        this.grandTotal = page.locator('#grandTotal');
    }

    async addProductToCart(option: string, amount: string) {
        await this.selectProduct.selectOption(option);
        await this.amountInput.fill(amount);
        await this.addToCartButton.click();
    }

    async removeProductFromCart() {
        await this.page.getByTestId('Apple-remove-button').click();
    }

    async getCartItems() {
        return this.cartItems;
    }

    async getGrandTotal() {
        return this.grandTotal;
    }
}