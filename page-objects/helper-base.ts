import { Page } from "@playwright/test";

export class HelperBase {

    private readonly page: Page

    constructor(page: Page) {
    
        this.page = page

    }

    async getToastMessage(){
        //this method validates toaster and get its message

        return "I'm cool toaster"
    }
}