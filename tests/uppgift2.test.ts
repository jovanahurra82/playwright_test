import { expect, request, test } from '@playwright/test';
import { LoginPage } from '../pages/loginpage';
import { StorePage } from '../pages/storepage';
import AxeBuilder from '@axe-core/playwright';

/*let password: string;

test.beforeAll(async () => {
  if (process.env.PASSWORD !== undefined) {
    password = process.env.PASSWORD;
  } else {
    throw new Error('Environment variable PASSWORD is not defined');
  }
});*/

// Login before tests
test.beforeEach('Login with Jovana', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const storePage = new StorePage(page);

  // Navigate to the login page
  await page.goto("http://hoff.is/login");

  // Perform login
  await loginPage.login("Jovana", "sup3rs3cr3t", 'consumer');

  // Verify successful login
  const header = await storePage.header.textContent();
  expect(header).toBe("Store");
});

//  Verify Product Selection and Cart Update
test('Add product to cart newone', async ({ page }) => {

    const apiContext = await request.newContext({
        baseURL: 'https://hoff.is/store2/api/v1',
    });
    
    let randomOption = Math.floor(Math.random() * 10); 
    let randomAmount = Math.floor(Math.random() * 10) +1;

    // Convert to strings for initial usage
    const option = randomOption.toString();
    const amount = randomAmount.toString();
    

    // Convert back to integers when needed
    let optionInt = parseInt(option, 10);
    //optionInt = optionInt - 1; // Example adjustment

    let amountInt = parseInt(amount, 10);
    let productPrice;
    let totalPrice;
    console.log(`Random option as string: ${option}, as integer: ${optionInt}`);
    console.log(`Random amount as string: ${amount}, as integer: ${amountInt}`);
  
    //await page.goto('https://hoff.is/store2/?username=Jovana&role=consumer');
    await page.getByTestId('select-product').selectOption(option);
    
    await page.getByLabel('Amount').fill(amount);
    await page.getByTestId('add-to-cart-button').click();  
    
    const receiptProductName = await page.locator('#cartItems').textContent();
    const receiptPorductQuantity = await page.locator('#cartItems').textContent();

    const responseGetProductList = await apiContext.get('https://hoff.is/store2/api/v1/product/list')
    const responseProductListJson = await responseGetProductList.json()
    const responseGetProduct = await apiContext.get(`https://hoff.is/store2/api/v1/price/${optionInt}`)
    const responseProductJson = await responseGetProduct.json()
    optionInt = optionInt-1
    const product = responseProductListJson.products[optionInt];
    const chosenProduct = responseProductJson;  
    productPrice = chosenProduct.price;
    productPrice = parseInt(productPrice, 10)
    totalPrice = productPrice * amountInt;
    if (totalPrice > 10000) {
      console.log("Insufficient funds!");
      test.skip(); // Skip the test if the condition is met
    }
    totalPrice = totalPrice.toString()
    /*console.log(productPrice);
    console.log(totalPrice);*/
    const grandTotal = page.locator('#grandTotal'); 
             
    //Verify correct product has been added to cart and total price
    expect(responseGetProductList.status()).toBe(200) 
    expect(responseProductListJson.products[optionInt].id, 'Product Id should be ').toBe(chosenProduct.id)
    expect(responseProductListJson.products[optionInt].name.toLowerCase(), 'Product name should be ').toBe(chosenProduct.name.toLowerCase())
    expect(grandTotal, 'Total price should be ').toContainText(totalPrice)
    expect(receiptProductName?.trim()).toContain(product.name)
    expect(receiptPorductQuantity?.trim()).toContain(amount)
  });

  // Verify Cart Item Removal
  test('Remove product from cart', async ({ page }) => {
    const option = '1';
    const amount = '2';
    let optionInt = parseInt(option, 10)
    optionInt = optionInt-1;
  
    //await page.goto('https://hoff.is/store2/?username=Jovana&role=consumer');
    await page.getByTestId('select-product').selectOption(option);  
    await page.getByLabel('Amount').fill(amount);
    await page.getByTestId('add-to-cart-button').click(); 
    await page.getByTestId('Apple-remove-button').click();
  
    const cartItems = await page.locator('#cartItems');      
    await expect(cartItems).toBeHidden();   
  
    // Verify there are no rows in the tbody (cartItems)
    const rowsCount = await cartItems.locator('tr').count();
    expect(rowsCount).toBe(0);
  });

  //make a purchase
  test('Buy a product', async ({ page }) => { 
    const option = '1';
    const amount = '2';
    let optionInt = parseInt(option, 10)
    optionInt = optionInt-1;
  
    //await page.goto('https://hoff.is/store2/?username=Jovana&role=consumer');
    await page.getByTestId('select-product').selectOption(option);    
    await page.getByLabel('Amount').fill(amount);
    await page.getByTestId('add-to-cart-button').click();   
    
    await page.getByRole('button', { name: 'Buy' }).click();
    const modalHeader = await page.locator('.modal-header');    
    await expect(modalHeader).toContainText('Finalize Purchase');

    await page.getByLabel('Name:').fill('Jovana');
    await page.getByLabel('Address:').fill('Adress1');
    await page.getByRole('button', { name: 'Confirm Purchase' }).click();
    const receiptHeader = page.locator('h5', { hasText: 'Receipt' });    
    await expect(receiptHeader).toContainText('Receipt');

    await page.getByText('Close').click();
    const header = page.locator('h1.header');   
    await expect(header).toHaveText('Store');
    const cartItems = await page.locator('#cartItems');      
    await expect(cartItems).toBeHidden();
  
    // Verify there are no rows in the tbody (cartItems)
    const rowsCount = await cartItems.locator('tr').count();
    expect(rowsCount).toBe(0);
  });  

  //Accessibility test
  test.describe('Accessibility Testing for Hoff Store', () => {
    test('should not have any automatically detectable accessibility issues', async ({ page }, testInfo) => {
      // Navigate to the URL
      //await page.goto('https://hoff.is/store2/?username=Jovana&role=consumer');
      await page.locator(".user-info-box");
  
      // Perform the accessibility scan      
      const axeBuilder = await new AxeBuilder({ page })
      //.include(".user-info-box")
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();
      // Add testInfo for better debugging and analysis of the report
      await testInfo.attach("accessibility-scan-results",{
        body: JSON.stringify(axeBuilder, null, 2),
        contentType: "application/json"
      });
  
      // Log the violations for debugging
      console.log('Accessibility Violations:', axeBuilder.violations);
  
      // Assert that there are no violations
      expect(axeBuilder.violations).toEqual([]);
    });
  });

  test('Failed inlog', async ({ page }) => {  
  
    //await page.goto('https://hoff.is/store2/?username=Jovana&role=consumer');
    await page.getByRole('button', { name: 'Log Out' }).click();
    await page.getByLabel('Username').fill('Jovana');    
    await page.getByLabel('Password').fill('password');
    await page.getByRole('button', { name: 'Login' }).click();

    const title = await page.title();  
    expect(title).toBe('Login Page');

    const errorMessage = page.getByTestId('error-message');  
    await expect(errorMessage).toContainText('Incorrect password');   
    
  });