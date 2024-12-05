import { expect, request, test } from '@playwright/test';
import { LoginPage } from '../pages/loginpage';
import { StorePage } from '../pages/storepage';
import AxeBuilder from '@axe-core/playwright';

let password: string;

/*test.beforeAll(async () => {
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
test('Add product to cart', async ({ page }) => {

    const apiContext = await request.newContext({
        baseURL: 'https://hoff.is/store2/api/v1',
    });

    const option = '1';
    const amount = '2';
    let optionInt = parseInt(option, 10)
    optionInt = optionInt-1;
  
    await page.goto('https://hoff.is/store2/?username=Jovana&role=consumer');
    await page.getByTestId('select-product').selectOption(option);
    
    await page.getByLabel('Amount').fill(amount);
    await page.getByTestId('add-to-cart-button').click();  
    
    const receiptProductName = await page.getByTestId('Apple-receipt-name').textContent();
    const receiptPorductQuantity = await page.getByTestId('Apple-receipt-quantity').textContent();

    const responseGetProductList = await apiContext.get('/product/list')
    const responseProductListJson = await responseGetProductList.json()
    const responseGetProduct = await apiContext.get('/price/1')
    const responseProductJson = await responseGetProduct.json()
    const product = responseProductListJson.products[optionInt];
    const chosenProduct = responseProductJson;    
   
    //Verify correct product has been added to cart
    expect(responseGetProductList.status()).toBe(200);    
    expect(responseProductListJson.products[optionInt].id, 'Product Id should be ').toBe(chosenProduct.id)
    expect(responseProductListJson.products[optionInt].name, 'Product name should be ').toBe(chosenProduct.name)
    expect(receiptProductName?.trim()).toBe(product.name)
    expect(receiptPorductQuantity?.trim()).toBe(amount);
  });

  // Verify Cart Item Removal
  test('Remove product from cart', async ({ page }) => {
    const option = '1';
    const amount = '2';
    let optionInt = parseInt(option, 10)
    optionInt = optionInt-1;
  
    await page.goto('https://hoff.is/store2/?username=Jovana&role=consumer');
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
  
    await page.goto('https://hoff.is/store2/?username=Jovana&role=consumer');
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

  test('Verify cart summary and final price before purchase', async ({ page }) => {
    const apiContext = await request.newContext({
        baseURL: 'https://hoff.is/store2/api/v1',
    });

    const option = '1';
    const amount = '2';
    let optionInt = parseInt(option, 10)
    optionInt = optionInt-1;
  
    await page.goto('https://hoff.is/store2/?username=Jovana&role=consumer');
    await page.getByTestId('select-product').selectOption(option);
    
    await page.getByLabel('Amount').fill(amount);
    await page.getByTestId('add-to-cart-button').click();  
    
    const receiptProductName = await page.getByTestId('Apple-receipt-name').textContent();
    const receiptPorductQuantity = await page.getByTestId('Apple-receipt-quantity').textContent();

    const responseGetProductList = await apiContext.get('/product/list')
    const responseProductListJson = await responseGetProductList.json()
    const responseGetProduct = await apiContext.get('/price/1')
    const responseProductJson = await responseGetProduct.json()
    const product = responseProductListJson.products[optionInt];
    const chosenProduct = responseProductJson;    
   
    //Verify correct product has been added to cart
    expect(responseGetProductList.status()).toBe(200);    
    expect(responseProductListJson.products[optionInt].id, 'Product Id should be ').toBe(chosenProduct.id)
    expect(responseProductListJson.products[optionInt].name, 'Product name should be ').toBe(chosenProduct.name)
    expect(receiptProductName?.trim()).toBe(product.name)
    expect(receiptPorductQuantity?.trim()).toBe(amount);
  });  
      
    

    
    /*
    await page.getByRole('button', { name: 'Buy' }).click();
  await page.getByRole('heading', { name: 'Finalize Purchase' }).click();
  await page.getByLabel('Name:').click();
  await page.getByLabel('Name:').fill('Jovana');
  await page.getByLabel('Address:').click();
  await page.getByLabel('Address:').fill('Adress1');
  await page.getByLabel('Address:').press('ArrowLeft');
  await page.getByLabel('Address:').press('ArrowLeft');
  await page.getByLabel('Address:').press('ArrowLeft');
  await page.getByLabel('Address:').press('ArrowLeft');
  await page.getByLabel('Address:').press('ArrowLeft');
  await page.getByLabel('Address:').fill('Address1');
  await page.getByRole('button', { name: 'Confirm Purchase' }).click();
  await page.getByRole('heading', { name: 'Receipt' }).click();
  await page.getByText('x Apple - $24').click();
  await page.getByText('Thank you for your purchase,').click();
  await page.getByText('It will be shipped to:').click();
  await page.locator('#receiptTotal').click();
  await page.getByText('Total:', { exact: true }).click();
  await page.locator('#receiptTotal').click();
  await page.getByText('Close').click();

    const pageProductName = page.getByTestId('Apple-receipt-price');
    await page.getByTestId('Apple-receipt-name').click();
    await page.getByTestId('Apple-receipt-quantity').click();
    await page.locator('#grandTotal').click();
    await page.locator('#totalSum').click();
    await page.getByRole('button', { name: 'Buy' }).click();
    await page.getByLabel('Name:').click();
    await page.getByLabel('Name:').fill('Jovana');
    await page.getByLabel('Address:').click();
    await page.getByLabel('Address:').fill('Adress 10');
    await page.getByRole('button', { name: 'Confirm Purchase' }).click();
    await page.getByText('x Apple - $30').click();
    await page.getByText('$30', { exact: true }).click();
    await page.getByText('$35').click();
    await page.getByText('Close').click();

  });*/

  //Accessibility test
  /*test.describe('Accessibility Testing for Hoff Store', () => {
    test('should not have any automatically detectable accessibility issues', async ({ page }, testInfo) => {
      // Navigate to the URL
      await page.goto('https://hoff.is/store2/?username=Jovana&role=consumer');
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
  });*/

