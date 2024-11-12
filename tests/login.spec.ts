import { expect, test } from '@playwright/test';
import { LoginPage } from '../pages/loginpage';
import { StorePage } from '../pages/storepage';

let password: string
test('Login with Markus', async ({ page }) => {    
    const loginPage = new LoginPage(page);
    const storePage = new StorePage(page);
    if (process.env.PASSWORD !== undefined){
        password: string = process.env.PASSWORD
    }
     
    await page.goto("http://hoff.is/login")
    await loginPage.login("Markus", "sup3rs3cr3t", 'consumer');
    const header = await storePage.header.textContent()  

    expect(header).toBe("Store")
});

//Skapa test som failar login och verifierar felmeddelandet

test('Failed login - verify error message', async ({ page }) => {    
    const loginPage = new LoginPage(page);    
    await page.goto("http://hoff.is/login")
    await loginPage.login("Markus", "trololo", 'consumer');  
    const errorMessage = await loginPage.errorMessage.textContent()
    await expect(errorMessage).toBe('Incorrect password');
    //await expect(page.getByTestId('error-message')).toContainText('Incorrect password');
});

