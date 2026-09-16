import { expect, test } from '@playwright/test'

test.beforeEach(async ({ page }, testInfo) => {
    await page.goto('https://playground.bondaracademy.com/')
    await page.getByText('Modal & Overlays').click()
    await page.getByText('Dialog').click()
    testInfo.setTimeout(testInfo.timeout  + 3000)
})

test('Auto-waiting', async ({ page }) => {
    //playwright is not waiting for the locator but the method is waiting for all condition
    const dialogWidthDelayForm = page.locator('nb-card', { hasText: 'Open Dialog With Delay' })
    await dialogWidthDelayForm.getByRole('button', { name: '3 seconds'}).click()

    const dialogContainer = page.locator('nb-dialog-container')
    //await dialogContainer.getByRole('button', {name: 'Ok'}).click()
    //const dialogHeader = await dialogContainer.locator('nb-card-header').textContent()

    const dialogHeaderText = await dialogContainer.locator('nb-card-header').allTextContents()
    expect(dialogHeaderText).toContain('Friendly reminder')
})

test('Alternative waits', async ({ page }) => {
    const dialogWidthDelayForm = page.locator('nb-card', { hasText: 'Open Dialog With Delay' })
    await dialogWidthDelayForm.getByRole('button', { name: '3 seconds'}).click()
    const dialogContainer = page.locator('nb-dialog-container')

    //--wait for the element
    //await dialogContainer.waitFor()
    //await page.waitForSelector('nb-dialog-container')

    //--wait for API response
    //await page.waitForResponse('**/delay/*')

    //--wait for load stat (NOT RECOMMEND)
    //await page.waitForLoadState('networkidle')

    //--hardcoded wait (NEVER EVERY USE IT. JUST NEVER)
    //await page.waitForTimeout(35000)

    //const dialogHeaderText = await dialogContainer.locator('nb-card-header').allTextContents()
    //expect(dialogHeaderText).toContain('Friendly reminder')

    await expect(dialogContainer.locator('nb-card-header')).toHaveText('Friendly reminder')
}) 

//Playwright has a built-in waiting which related to the specific methods and the method waiting for the specific condition on the locator

 test('Timeouts', async ({ page })=> {
    test.setTimeout(120000)
    // Slow will increase the default test timeout in three times
    test.slow()
    const dialogWidthDelayForm = page.locator('nb-card', { hasText: 'Open Dialog With Delay'})
    await dialogWidthDelayForm.getByRole('button', {name: '3 seconds'}).click()
    const dialogContainer = page.locator('nb-dialog-container')

    await dialogContainer.getByRole('button', {name: 'Ok'}).click({timeout: 4000})
 }) 