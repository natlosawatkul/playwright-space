import { Locator, Page } from "@playwright/test";

export class FormLayoutsPage {

    private readonly page: Page

    constructor(page: Page) {
        this.page = page

    }

    async submitUsingTheGridForm(email: string, password: string, optionText: string) {
        const usingTheGrid = this.page.locator('nb-card', { hasText: 'Using the Grid' })
        await usingTheGrid.getByRole('textbox', { name: 'Email' }).fill(email)
        await usingTheGrid.getByRole('textbox', { name: 'Password' }).fill(password)
        await usingTheGrid.getByLabel(optionText).check({ force: true })
        await usingTheGrid.getByRole('button', { name: "Sign in" }).click()
    }

    async submitInlineForm(fullNane: string, email: string, rememberMeCheckBox: boolean) {
        const inlineForm = this.page.locator('nb-card', { hasText: 'Inline form' })
        await inlineForm.getByRole('textbox', { name: 'Jane Doe' }).fill(fullNane)
        await inlineForm.getByRole('textbox', { name: 'Email' }).fill(email)
        if (rememberMeCheckBox) {
            await inlineForm.getByRole('checkbox').check({ force: true })
        }
         await inlineForm.getByRole('button', { name: "Submit" }).click()
    }
}