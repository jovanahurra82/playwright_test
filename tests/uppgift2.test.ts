import { expect, request, test } from '@playwright/test'
import { LoginPage } from '../pages/loginpage'
import { StorePage } from '../pages/storepage'
import AxeBuilder from '@axe-core/playwright'
// Login before tests
test.beforeEach('Login with Jovana', async ({ page }) => {
  const loginPage = new LoginPage(page)
  const storePage = new StorePage(page); 

  // Navigate to the login page
  await loginPage.navigateToLoginPage()

  // Perform login
  await loginPage.login("Jovana", "sup3rs3cr3t", 'consumer')

  // Verify successful login
  const header = await storePage.header.textContent()
  expect(header).toBe("Store")
});

// Verify Product Selection and Cart Update
test('Add product to cart newone', async ({ page }) => {

  const apiContext = await request.newContext({
    baseURL: 'https://hoff.is/store2/api/v1',
});

  const storePage = new StorePage(page) 

  let randomOption = Math.floor(Math.random() * 10)
  let randomAmount = Math.floor(Math.random() * 10) + 1
  let productPrice
  let totalPrice

  // Convert to strings
  const option = randomOption.toString()
  const amount = randomAmount.toString()

  // Convert back to integers
  let optionInt = parseInt(option, 10)
  let amountInt = parseInt(amount, 10)

  // Fetch product list and price via ProductApi
  const responseGetProductList = await apiContext.get('https://hoff.is/store2/api/v1/product/list')
  const responseProductListJson = await responseGetProductList.json()  

  const responseGetProduct = await apiContext.get(`https://hoff.is/store2/api/v1/price/${option}`)
  const responseProductJson = await responseGetProduct.json()

  optionInt = optionInt-1
  //const product = responseProductListJson.products[optionInt]
  const chosenProduct = responseProductJson
  productPrice = chosenProduct.price
  productPrice = parseInt(responseProductJson.price, 10)
  console.log(productPrice)
  console.log(amountInt)

  totalPrice = productPrice * amountInt
  console.log(totalPrice)

  // Skip test if total price exceeds 10000
  if (totalPrice > 10000) {
    console.log("Insufficient funds!")
    test.skip()
  }

  totalPrice = totalPrice.toString()  

  // Add the product to cart and verify the result
  await storePage.addProductToCart(option, amount)

  const grandTotal = await storePage.getGrandTotal();

  expect(responseGetProductList.status()).toBe(200)
  expect(responseProductListJson.products[optionInt].id, 'Product Id should be ').toBe(chosenProduct.id)
  expect(responseProductListJson.products[optionInt].name.toLowerCase(), 'Product name should be ').toContain(chosenProduct.name.toLowerCase())
  expect(grandTotal, 'Total price should be ').toContainText(totalPrice) 
});

// Verify Cart Item Removal
test('Remove product from cart', async ({ page }) => {
  const storePage = new StorePage(page)

  const option = '1'
  const amount = '2'

  await storePage.addProductToCart(option, amount)
  await storePage.removeProductFromCart()

  const cartItems = await storePage.getCartItems()

  await expect(cartItems).toBeHidden()
  const rowsCount = await cartItems.locator('tr').count()
  expect(rowsCount).toBe(0)
});

// Make a purchase
test('Buy a product', async ({ page }) => {
  const storePage = new StorePage(page)

  const option = '1'
  const amount = '2'

  await storePage.addProductToCart(option, amount)

  await page.getByRole('button', { name: 'Buy' }).click()
  const modalHeader = await page.locator('.modal-header')
  await expect(modalHeader).toContainText('Finalize Purchase')

  await page.getByLabel('Name:').fill('Jovana')
  await page.getByLabel('Address:').fill('Adress1')
  await page.getByRole('button', { name: 'Confirm Purchase' }).click()

  const receiptHeader = page.locator('h5', { hasText: 'Receipt' })
  await expect(receiptHeader).toContainText('Receipt')

  await page.getByText('Close').click()
  const header = page.locator('h1.header')
  await expect(header).toHaveText('Store')

  const cartItems = await storePage.getCartItems()
  await expect(cartItems).toBeHidden()

  const rowsCount = await cartItems.locator('tr').count()
  expect(rowsCount).toBe(0)
});

// Failed login test
test('Failed login', async ({ page }) => {
  const loginPage = new LoginPage(page)

  await loginPage.navigateToLoginPage()
  await loginPage.login('Jovana', 'wrongPassword', 'consumer')

  const errorMessage = await loginPage.getErrorMessage()
  expect(errorMessage).toBe('Incorrect password')
});

test.describe('Accessibility Testing for Hoff Store', () => {
  test('should not have any automatically detectable accessibility issues', async ({ page }, testInfo) => {    
    await page.locator(".user-info-box");

    // Perform the accessibility scan      
    const axeBuilder = await new AxeBuilder({ page })
    //.include(".user-info-box")
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
    .analyze()
    // Add testInfo for better debugging and analysis of the report
    await testInfo.attach("accessibility-scan-results",{
      body: JSON.stringify(axeBuilder, null, 2),
      contentType: "application/json"
    });

    // Log the violations for debugging
    console.log('Accessibility Violations:', axeBuilder.violations);

    // Assert that there are no violations
    expect(axeBuilder.violations).toEqual([])
  });
});