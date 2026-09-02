import { test } from '@playwright/test'

// test is a function and require the argument
// first argument is the name of test 
// the second argument is the callback function which will be the actual body of test
// test suites with test.describe

// test.describe('test suites', () => {
//     test("test case", () => {

//     })
// })

// callback function can be page fixture, browser fixture, context figture and some other

test.beforeEach(async ({ page }) => {
    await page.goto('http://playground.bondaracademy.com/')
})

test.describe('test suites 1', () => {
    test.beforeEach(async ({ page }) => {
        await page.getByText('Forms').click()
    })
    test("this is the first page", async ({ page }) => {
        await page.getByText('Form Layouts').click()
    })

    test("this is the first page ti date picker", async ({ page }) => {
        await page.getByText('Datepicker').click()
    })
})

test.describe('test suites 2', () => {
    test.beforeEach(async ({ page }) => {
        await page.getByText('Auth').click()
    })
    test("this is the first page", async ({ page }) => {
        await page.getByText('Login').click()
    })

})


