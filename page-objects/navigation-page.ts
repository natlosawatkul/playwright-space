import { Locator, Page } from '@playwright/test'
import { step } from '../helpers/test-step-decorator.page'

// navigation page is a class that created 

//need to export this class to be able to use inside of the spec files.
export class NavigationPage {
    // class anme always start with capital case (uppercase)

    readonly formLayoutsMenu: Locator
    readonly smartTableMenu: Locator
    readonly datePickerMenu: Locator
    readonly dialogMenu: Locator
    readonly tosterMenu: Locator
    readonly tooltipMenu: Locator
    readonly dragAndDropMenu: Locator
    private readonly page: Page
    // this page instance only need within this class

    constructor(page: Page) {
        this.page = page
        this.formLayoutsMenu = page.getByText('Form Layouts')
        this.smartTableMenu =  page.getByText('Smart Table')
        this.datePickerMenu = page.getByText('Datepicker')
        this.dialogMenu = page.getByText('Dialog')
        this.tosterMenu = page.getByText('Toastr')
        this.tooltipMenu = page.getByText('Tooltip')
        this.dragAndDropMenu = page.getByText('Drag & Drop')


        //constructor is a block of code or function that is executed as a very first 
        //everything you put in constructor, will be executed just to prepare your page object for future operations
    }
    @step
    async formLayoutPage() {
        await this.selectGroupMenuItem('Forms')
        await this.formLayoutsMenu.click()
    }

    @step
    async smartTablePage() {
        await this.selectGroupMenuItem('Tables & Data')
        await this.smartTableMenu.click()
    }

    async datePickerPage() {
        await this.selectGroupMenuItem('Forms')
        await this.datePickerMenu.click()
    }

    async dialogPage() {
        await this.selectGroupMenuItem('Modal & Overlays')
        await this.dialogMenu.click()
    }

    async dragAndDropPage() {
        await this.selectGroupMenuItem('Extra Components')
        await this.dragAndDropMenu.click()
    }

    async toasterPage() {
        await this.selectGroupMenuItem('Modal & Overlays')
        await this.tooltipMenu.click()
    }

    async tooltipPage() {
        await this.selectGroupMenuItem('Modal & Overlays')
        await this.tooltipMenu.click()
    }

    private async selectGroupMenuItem(groupMenuTitle: string) {
        const groupMenuItem = this.page.getByTitle(groupMenuTitle)
        const expandedState = await groupMenuItem.getAttribute('aria-expanded')
        if (expandedState == 'false') {
            await groupMenuItem.click()
        }
    }

}