import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
    await page.goto('https://playground.bondaracademy.com')
})

test.describe('Form Layouts page', () => {

    test.beforeEach(async ({ page }) => {
        await page.getByText('Forms').click()
        await page.getByText('Form Layouts').click()
    })

    test('input fields', async ({ page }) => {
        const usingTheGridEmailInput = page.locator('nb-card', { hasText: 'Using the Grid' }).getByRole('textbox', { name: 'Email' })
        await usingTheGridEmailInput.fill('test@test.com')
        // if need to remove text in input field, using clear()
        await usingTheGridEmailInput.clear()
        // simulate the keystrokes
        await usingTheGridEmailInput.pressSequentially('test2@test.com', { delay: 500 })

        //extract the value from input field
        //visible text inside the input fields is not the text but it's a value 
        const inputValue = await usingTheGridEmailInput.inputValue()

        //assertions
        // If you want to validate a partial match for the input field
        await expect(usingTheGridEmailInput).toHaveValue('test2@test.com')
        await expect(usingTheGridEmailInput).toHaveValue(/test.com/)
    })


    test('Radio button', async ({ page }) => {
        const usingTheGridForm = page.locator('nb-card', { hasText: 'Using the Grid' })

        //For click on radio button, recommend to using check() instead
        await usingTheGridForm.getByLabel('Option 1 ').check({ force: true })
        await usingTheGridForm.getByRole('radio', { name: 'Option 2' }).check({ force: true })

        const radioButton = await usingTheGridForm.getByRole('radio', { name: 'Option 2' }).isChecked()
        expect(radioButton).toBeTruthy()

        await expect(usingTheGridForm.getByRole('radio', { name: 'Option 2' })).toBeChecked()
        await expect(usingTheGridForm.getByRole('radio', { name: 'Option 1' })).not.toBeChecked()

    })

    test('Checkbox', async ({ page }) => {
        await page.getByText('Modal & Overlays').click()
        await page.getByText('Toastr').click()

        //using method check or uncheck to interact with the checkboxes

        await page.getByRole('checkbox', { name: 'Hide on click' }).uncheck({ force: true })

        const allBoxes = page.getByRole('checkbox')
        for (const box of await allBoxes.all()) {
            await box.uncheck({ force: true })
            // validate checkbox is uncehcked
            await expect(box).not.toBeChecked()
        }
    })

    test('List and Dropdown', async ({ page }) => {
        await page.getByText('Modal & Overlays').click()
        await page.getByText('Toastr').click()

        //Standard dropdown
        // the role for the standard dropdown will be combobox
        await page.locator('.form-group', { hasText: 'Toast type' }).getByRole('combobox').selectOption('info')
        //validate combocox 
        await expect(page.getByRole('combobox')).toHaveValue('info')


        //Custom dropdowm
        await page.locator('.form-group', { hasText: 'Position:' }).locator('nb-select').click()
        //option 1 
        // await page.getByRole('list').getByText('bottom-end').click()
        //option 2
        await page.locator('nb-option', { hasText: 'bottom-end' }).click()

        //validate expected data
        await expect(page.locator('.form-group', { hasText: 'Position:' }).locator('nb-select')).toHaveText('bottom-end')

        //looping through the list
        const positionDropdownField = page.locator('.form-group', { hasText: 'Position:' }).locator('nb-select')
        await positionDropdownField.click()

        const allListValues = await page.locator('nb-option').allTextContents()
        for (const listValue of allListValues) {
            await page.locator('nb-option', { hasText: listValue }).click()
            await expect(positionDropdownField).toHaveText(listValue)
            await positionDropdownField.click()
        }
    })

    test('Tooltip', async ({ page }) => {
        await page.getByText('Modal & Overlays').click()
        await page.getByText('Tooltip').click()

        //using cmd+\ to freeze DOM to find the locator for your tooltip 
        // using the method hover to trigger the tooltip on the hover
        await page.getByRole('button', { name: 'Top' }).hover()
        await expect(page.getByRole('tooltip')).toHaveText('This is a tooltip')
    })
})