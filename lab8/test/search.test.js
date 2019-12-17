const puppeteer = require("puppeteer");
const config = require("./config");

describe("Search Suite", () => {
    /** @type {puppeteer.Browser} */
    let browser;
    /** @type {puppeteer.Page} */
    let page;

    beforeAll(async () => {
        browser = await puppeteer.launch();
        page = await browser.newPage();
        await page.goto(config.url);
    });

    afterAll(async () => browser.close());

    it("should have search form with input", async () => {
        await page.waitForSelector(config.search.form);
        await page.waitForSelector(config.search.input);
    });

    it(`should show autocomplete if "${config.search.inputText}" typed`, async () => {
        await page.type(config.search.input, config.search.inputText);
        await page.waitForSelector(config.search.autocomplete);
    });

    it(`should go to search page with "${config.search.breadcrumbText}" text`, async () => {
        const submitHandle = await page.$(config.search.submit);
        await submitHandle.click();
        await submitHandle.dispose();
        await page.waitForSelector(config.search.searchBreadcrumb);
        const breadcrumbText = await page.$eval(
            config.search.searchBreadcrumb,
            el => el.textContent,
        );
        expect(breadcrumbText).toBe(config.search.breadcrumbText);
    });
});
