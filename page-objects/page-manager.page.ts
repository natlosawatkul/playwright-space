import { Page } from "@playwright/test"
import { NavigationPage } from "../page-objects/navigation-page"
import { FormLayoutsPage } from "../page-objects/form-layouts-page"
import { DatePickerPage } from "../page-objects/datepicker-page"

export class PageManager{
    navigateTo: NavigationPage
    formLayoutsPage: FormLayoutsPage
    datePickerPage: DatePickerPage


    constructor(page: Page){
        this.navigateTo = new NavigationPage(page)
        this.formLayoutsPage = new FormLayoutsPage(page)
        this.datePickerPage = new DatePickerPage(page)
    }
}