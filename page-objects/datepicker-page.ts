import { Page, expect } from "@playwright/test";

export class DatePickerPage {

    private readonly page: Page

    constructor(page: Page) {
        this.page = page

    }

    async selectCommonDatePickerDateFromToday(daysFromToday: number) {
        const calendarInputField = this.page.getByPlaceholder('Form Picker')
        await calendarInputField.click()
        //case expected month is not currently in date picker
        const expectedDate = await this.selectDateInTheCalendar(daysFromToday)
        await expect(calendarInputField).toHaveValue(expectedDate)
    }

    async selectDatePicketWithRangeFromToday(daysFromTodayStart: number, daysFromTodayEnd: number){
        const calendarInputField = this.page.getByPlaceholder('Range Picker')
        await calendarInputField.click()
        const expectedDateDtart = await this.selectDateInTheCalendar(daysFromTodayStart)
        const expectedDateEnd = await this.selectDateInTheCalendar(daysFromTodayEnd)
        await expect(calendarInputField).toHaveValue(`${expectedDateDtart} - ${expectedDateEnd}`)

    }

    private async selectDateInTheCalendar(daysFromToday: number){
        const date = new Date();
        date.setDate(date.getDate() + daysFromToday)
        const expectedDay = date.getDate().toString()
        const expectedMonth = date.toLocaleString('En-Us', { month: 'short' })
        const expectedMonthLong = date.toLocaleString('En-Us', { month: 'long' })
        const expectedYear = date.getFullYear()
        const expectedDate = `${expectedMonth} ${expectedDay}, ${expectedYear}`
        console.log(expectedDate)

        let currentMonthAndYear = await this.page.locator('nb-calendar-view-mode').textContent()
        const expectedMonthAndYear = `${expectedMonthLong} ${expectedYear}`
        while (!currentMonthAndYear?.includes(expectedMonthAndYear)) {
            await this.page.locator('.next-month').click()
            currentMonthAndYear = await this.page.locator('nb-calendar-view-mode').textContent()
        }
        await this.page.locator('.day-cell:not(.bounding-month)').getByText(expectedDay, { exact: true }).click()
        return expectedDate
    }

}