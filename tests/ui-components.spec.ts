import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
    await page.goto('https://playground.bondaracademy.com')
})

test.describe.only('Form Layouts page', () => {
    test.describe.configure({ retries: 2 })
    test.beforeEach(async ({ page }) => {
        await page.getByText('Forms').click()
        await page.getByText('Form Layouts').click()
    })

    test('input fields', async ({ page }, testInfo) => {
        if (testInfo.retry) {
            // clean test data
        }
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
        await expect(usingTheGridEmailInput).toHaveValue('test2@test.com1')
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

test('Dialog box', async ({ page }) => {
    await page.getByText('Tables & Data').click()
    await page.getByText('Smart Table').click()
    // When automate with normal dialog box, the regular HTML dialog boxes

    //native dialog boxes, playwright cancels them automatically
    //you need to create a listener like to accept the dialog box before create the action that triggers the dialog box
    // ou can create a regular generic assertion to validate the message in dialog box
    page.on('dialog', dialog => {
        expect(dialog.message()).toEqual('Are you sure you want to delete?')
        dialog.accept()
    })
    await page.locator('tr', { hasText: 'mdo@gmail.com' }).locator('.nb-trash').click()
    await expect(page.locator('tr', { hasText: 'mdo@gmail.com' })).not.toBeVisible()
})


test('Web Table', async ({ page }) => {
    //every table, start with table tag, (tbody => table body), (thead => table header), (tr=> table row), (td => table column)
    await page.getByText('Tables & Data').click()
    await page.getByText('Smart Table').click()

    //1. how to select row by any visible text
    // find the row that you want to interact with and then interact with any elements within this row
    const tableRowByEmail = page.getByRole('row', { name: 'twitter@outlook.com' })
    await tableRowByEmail.locator('.nb-edit').click()
    await tableRowByEmail.getByPlaceholder('Age').fill('35')
    await tableRowByEmail.locator('.nb-checkmark').click()
    await expect(tableRowByEmail.locator('td').last()).toHaveText('35')

    //2. get row by specific column value 
    const tableRowById = page.getByRole('row').filter({ has: page.getByRole('cell').nth(1).getByText('10') })
    await tableRowById.locator('.nb-edit').click()
    await page.locator('tbody').getByPlaceholder('E-mail').fill("test@test.com")
    await page.locator('tbody').locator('.nb-checkmark').click()
    await expect(tableRowById.locator('td').nth(5)).toHaveText('test@test.com')

    //3. loop through table rows
    // filter age in header and then validate result in table
    const ages = ['20', '30', '40', '200']

    for (let age of ages) {
        await page.getByPlaceholder('Age').fill(age)

        if (age == '200') {
            await expect(page.locator('tbody')).toContainText('No data found')
        } else {
            await expect(page.locator('tbody tr').first().locator('td').last()).toHaveText(age)
            const allTableRows = await page.locator('tbody tr').all()
            for (let row of allTableRows) {
                await expect(row.locator('td').last()).toHaveText(age)
            }
        }
    }
})

test('Date Picker', async ({ page }) => {
    await page.getByText('Forms').click()
    await page.getByText('Datepicker').click()

    const calendarInputField = page.getByPlaceholder('Form Picker')
    await calendarInputField.click()

    //case expected month is currently in date picker
    const date = new Date();
    date.setDate(date.getDate() + 10)
    const expectedDay = date.getDate().toString()
    const expectedMonth = date.toLocaleString('En-Us', { month: 'short' })
    const expectedYear = date.getFullYear()
    const expectedDate = `${expectedMonth} ${expectedDay}, ${expectedYear}`

    await page.locator('.day-cell:not(.bounding-month)').getByText(expectedDay, { exact: true }).click()
    await expect(calendarInputField).toHaveValue(expectedDate)

})

test('Date Picker 2', async ({ page }) => {
    await page.getByText('Forms').click()
    await page.getByText('Datepicker').click()

    const calendarInputField = page.getByPlaceholder('Form Picker')
    await calendarInputField.click()
    //case expected month is not currently in date picker
    const date = new Date();
    date.setDate(date.getDate() + 140)
    const expectedDay = date.getDate().toString()
    const expectedMonth = date.toLocaleString('En-Us', { month: 'short' })
    const expectedMonthLong = date.toLocaleString('En-Us', { month: 'long' })
    const expectedYear = date.getFullYear()
    const expectedDate = `${expectedMonth} ${expectedDay}, ${expectedYear}`
    console.log(expectedDate)

    let currentMonthAndYear = await page.locator('nb-calendar-view-mode').textContent()
    const expectedMonthAndYear = `${expectedMonthLong} ${expectedYear}`
    while (!currentMonthAndYear?.includes(expectedMonthAndYear)) {
        await page.locator('.next-month').click()
        currentMonthAndYear = await page.locator('nb-calendar-view-mode').textContent()
    }

    await page.locator('.day-cell:not(.bounding-month)').getByText(expectedDay, { exact: true }).click()
    await expect(calendarInputField).toHaveValue(expectedDate)

})

test('Sliders', async ({ page }) => {

    // #1 kind of shortcut to just set the properties for this attribute value
    const tempGuage = page.locator('[tabtitle="Temperature"] ngx-temperature-dragger circle')
    //using evaluate method to trigger different attributes
    await tempGuage.evaluate(element => {
        //apply to direct value that responsible for the position of the slider
        element.setAttribute('cx', '232.630')
        element.setAttribute('cy', '232.630')
    })
    // trigger the action
    await tempGuage.click()

    // #2 simulate the mouse movement
    // you need to identify the section on the page where you want
    // identify the section where you want to move the mouse 
    const tempBox = page.locator('[tabtitle="Temperature"] ngx-temperature-dragger')
    // make sure that section entire in the browser viewport
    await tempBox.scrollIntoViewIfNeeded()

    //create bounding box the define x and y for locator 
    // bounding box start in the TOP LEFT corner
    const box = await tempBox.boundingBox()
    // setiing the coordinate to the center of the box and move mouse from the center
    // divide by 2 => give the center of the box both x and y
    const x = box?.x + box?.width / 2
    const y = box?.y + box?.height / 2
    // trigger mouse movement to the center of box
    await page.mouse.move(x, y)
    await page.mouse.down()
    // move mouse up and down to simulate mouse movement based on the coordinate
    // move mouse the the right
    await page.mouse.move(x + 100, y)
    // move mouse to down 
    await page.mouse.move(x + 100, y + 100)
    // release the mouse to completed the movement
    await page.mouse.up()

    await expect(tempBox).toContainText('30')

})

test('iFrames', async ({ page }) => {
    await page.getByText('Modal & Overlays').click()
    await page.getByText('Dialog').click()

    // frameLocator will point the entry point to iFrame
    const frameLocator = page.frameLocator('[data-cy="esc-close-iframe"]')
    //and take frame locator, replace page with frame locator
    await frameLocator.getByRole('button', { name: 'Open Dialog with esc close' }).click()

    //if find iFrame, switch this fFrame by using the frame locator method
})

test('Drag and Drop', async ({ page }) => {
    await page.getByText('Extra Components').click()
    await page.getByText('Drag & Drop').click()

    //#1 using dragTo method
    await page.getByText('Clean my room').dragTo(page.locator('#drop-list'))

    //#2 workaround for mouse movement if the first is not working
    await page.getByText('Get groceries').hover()
    await page.mouse.down()
    // define the section where want to moving and using hover method
    await page.locator('#drop-list').hover()
    // release the mouse
    await page.mouse.up()

})

