import { test } from "@playwright/test"
import { PageManager } from "../page-objects/page-manager.page"
import { faker } from "@faker-js/faker"

test.beforeEach(async ({ page }) => {
    await page.goto('/')
})

test('Navigate to form layouts page', async ({ page }) => {
    const pageManager = new PageManager(page)
    await pageManager.navigateTo.formLayoutPage()
    await pageManager.navigateTo.datePickerPage()
    await pageManager.navigateTo.toasterPage()
    await pageManager.navigateTo.smartTablePage()
})

test('Parametrized page object methods', async ({ page }) => {
    const pageManager = new PageManager(page)

    const randomFullName = faker.person.fullName()
    const randomEmail = faker.internet.email({ provider: 'test.com' })

    await pageManager.navigateTo.formLayoutPage()
    await pageManager.formLayoutsPage.submitUsingTheGridForm('test@test.com', 'Password', 'Option 2')
    await pageManager.formLayoutsPage.submitInlineForm(randomFullName, randomEmail, false)
    //capture screenshot and defined path location
    await page.screenshot({path: 'screenshot/formlayoutPage.png'})

    await pageManager.navigateTo.datePickerPage()
    await pageManager.datePickerPage.selectCommonDatePickerDateFromToday(5)
    await pageManager.datePickerPage.selectDatePicketWithRangeFromToday(0,5)
})