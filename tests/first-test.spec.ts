import { expect, test } from '@playwright/test'

// test is a function and require the argument
// first argument is the name of test 
// the second argument is the callback function which will be the actual body of test
// test suites with test.describe

// test.describe('test suites', () => {
//     test("test case", () => {

//     })
// })

// test.describe('test suites 1', () => {
//     test.beforeEach(async ({ page }) => {
//         await page.getByText('Forms').click()
//     })
//     test("this is the first page", async ({ page }) => {
//         await page.getByText('Form Layouts').click()
//     })

//     test("this is the first page ti date picker", async ({ page }) => {
//         await page.getByText('Datepicker').click()
//     })
// })

// test.describe('test suites 2', () => {
//     test.beforeEach(async ({ page }) => {
//         await page.getByText('Auth').click()
//     })
//     test("this is the first page", async ({ page }) => {
//         await page.getByText('Login').click()
//     })

// })

// callback function can be page fixture, browser fixture, context figture and some other

test.beforeEach(async ({ page }) => {
    await page.goto('https://playground.bondaracademy.com/')
    await page.getByText('Forms').click()
    await page.getByText('Form Layouts').click()
})

test("Locator Syntax Rules", async ({ page }) => {
    //find by Tag
    page.locator('input')

    //find by id
    page.locator('#inputEmail')

    //find by class value 
    page.locator('.shape-rectangle')

    //find by any attribute
    page.locator('[placeholder="Email"]')

    //find by full class value
    page.locator('[class="input-full-width size-medium status-basic shape-rectangle nb-transition"]')

    //find by serveral selector
    page.locator('input[placeholder="Email"][nbinput]')

    //find by xPath (NOT RECOMMEND)
    page.locator('//*[@id="inputEmail"]')

    //find by partial text match
    page.locator(':text("Using")')

    //find by exact text match
    page.locator(':text-is("Using the Grid")')

})

test('User-visible locators', async ({ page }) => {
    await page.getByRole('button', { name: 'Sign in' }).first().click()
    await page.getByRole('textbox', { name: "Email" }).first().fill('test@test.com')

    // getByLabel => get the element which related to label by finding the element maybe first element
    await page.getByLabel('Email').first().fill('test@test.com')

    // getByPlaceholder => it's a visible text within the input filed
    await page.getByPlaceholder('Jane Doe').fill('Artem Bondar')

    // getByText => using text value to locate the web elements and need to match exactly 
    await page.getByText('Submit').first().click()

    await page.getByTestId('inputEmail1').fill('test@test.com')

    // getByTitle 
    await page.getByTitle('IoT Dashboard').click()
})

test('Locating child elements', async ({ page }) => {
    await page.locator('nb-card').locator('nb-radio-group').locator(':text-is("Option 1")').click()
    await page.locator('nb-card nb-radio-group :text-is("Option 2")').click()

    await page.locator('nb-card').getByRole('button', { name: 'Sign in' }).first().click()

    //Using index in the locator is not recommended 
    await page.locator('nb-card').nth(3).getByRole('button').click()
})

test('Locating parent elements', async ({ page }) => {
    await page.locator('nb-card', { hasText: 'Using the Grid' }).getByRole('button').click()

    await page.locator('nb-card', { has: page.locator('#inputEmail1') }).getByRole('button').click()

    await page.locator('nb-card').filter({ hasText: 'Using the Grid' }).getByRole('button').click()

    // first find the nb-casd 
    // => filter which have checkbox
    // => filter one of all which has sign in text 
    // => find the field by label email
    await page.locator('nb-card')
        .filter({ has: page.locator('nb-checkbox') })
        .filter({ hasText: 'Sign in' })
        .getByLabel('Email')
        .fill('test@test.com')

    await page.getByText('Using the Grid').locator('..').getByRole('button').click()
})

test('Reusing Locators', async ({ page }) => {
    const basicFormSection = page.locator('nb-card', { hasText: 'Basic Form' })
    const emailInputFoeld = basicFormSection.getByLabel('Email')

    await emailInputFoeld.fill('test@test.com')
    await basicFormSection.getByLabel('Password').fill('playwright')
    await basicFormSection.locator('nb-checkbox').click()
    await basicFormSection.getByRole('button').click()

    await expect(emailInputFoeld).toHaveValue('test@test.com')
})

test('Extracting Values', async ({ page }) => {
    //extract text
    const basicFormSection = page.locator('nb-card', { hasText: 'Basic form' })
    const submitButtonText = await basicFormSection.getByRole('button').textContent()
    expect(submitButtonText).toEqual('Submit')

    //extract multiple text value
    const allRadioButtonValue = await page.locator('nb-radio').allTextContents()
    expect(allRadioButtonValue).toContain('Option 1')

    //extract input field values
    const emailField = basicFormSection.getByRole('textbox', { name: "Email" })
    await emailField.fill('test@test.com')
    const emailFiledValue = await emailField.inputValue()
    console.log(emailFiledValue)

    //extract attribute value
    const emailPlaceHolder = await emailField.getAttribute('placeholder')
    console.log(emailPlaceHolder)

    // extract single value from HTML, using method textContent
    // extract multiple value, using allTextContents 
    // extract value from input field, using inputValue because the value inside input field is not the HTML
    // extract value for any attribut by using getAttribute 

})

test('Assertions', async ({ page }) => {
    const basicFormSectionButton = page.locator('nb-card', { hasText: 'Basic form' }).getByRole('button')

    //Generic assertion
    // validate whatever you provide as an argument
    const value = 5
    expect(value).toEqual(5)

    const submitButtonText = await basicFormSectionButton.textContent()
    expect(submitButtonText).toEqual('Submit')

    //Locator assertion
    await expect(basicFormSectionButton).toHaveText('Submit')

    //Soft aseertion
    // allow you to continue test execution if validation is failed
    await expect.soft(basicFormSectionButton).toHaveText('Submit')
    await basicFormSectionButton.click()

})

// Promise is a type of function in javascript that waits for expected condition to be executed
// Promise can be resolved or rejected | the default of test timeout is 30 seconds


