const puppeteer = require("puppeteer");
const config = require("./config");

describe("Auth Suite", () => {
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

    it(`should have "${config.auth.expectedMenuText}" in account menu`, async () => {
        await page.waitForSelector(config.auth.menu);
        const text = await page.$eval(config.auth.menu, el => el.textContent.trim());
        expect(text).toMatch(config.auth.expectedMenuText);
    });

    it(`should open menu with "${config.auth.expectedMenuLoginText}" and "${config.auth.expectedMenuRegisterText}"`, async () => {
        await page.click(config.auth.menu);
        const loginText = await page.$eval(config.auth.menuLogin, el => el.textContent);
        const registerText = await page.$eval(config.auth.menuRegister, el => el.textContent);
        expect(loginText).toBe(config.auth.expectedMenuLoginText);
        expect(registerText).toBe(config.auth.expectedMenuRegisterText);
    });

    it(`should go to login page when clicked onto "${config.auth.expectedMenuLoginText}"`, async () => {
        await page.click(config.auth.menuLogin);
        await page.waitForSelector(config.auth.loginForm);
    });

    it(`should see "${config.auth.expectedSuccessAlertText}" alert when login as "${config.auth.login}:${config.auth.password}"`, async () => {
        await page.type(config.auth.loginInput, config.auth.login);
        await page.type(config.auth.passwordInput, config.auth.password);
        const submitHandle = await page.$(config.auth.loginSubmit);
        await submitHandle.click();
        await submitHandle.dispose();
        await page.waitForSelector(config.auth.successLoginAlert);
        const alertText = await page.$eval(config.auth.successLoginAlert, el =>
            el.textContent.trim(),
        );
        expect(alertText).toBe(config.auth.expectedSuccessAlertText);
    });
});
