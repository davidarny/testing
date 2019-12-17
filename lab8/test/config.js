module.exports = {
    timeout: 30000,
    url: "http://52.136.215.164:9000/",
    auth: {
        login: "login",
        password: "password",

        menu: "body > div.top-header > div > div > div:nth-child(1) > div > div.btn-group > a",
        expectedMenuText: "Account",

        menuLogin: "body > div.top-header > div > div > div:nth-child(1) > div > div.btn-group.open > ul > li:nth-child(1) > a",
        expectedMenuLoginText: "Вход",
        menuRegister: "body > div.top-header > div > div > div:nth-child(1) > div > div.btn-group.open > ul > li:nth-child(2) > a",
        expectedMenuRegisterText: "Регистрация",

        loginForm: "body > div.content > div.prdt > div > div > div > div > div.register-main > div > form",
        loginInput: "body > div.content > div.prdt > div > div > div > div > div.register-main > div > form > div:nth-child(1) > input",
        passwordInput: "body > div.content > div.prdt > div > div > div > div > div.register-main > div > form > div:nth-child(2) > input",
        loginSubmit: "body > div.content > div.prdt > div > div > div > div > div.register-main > div > form > button",

        successLoginAlert: "body > div.content > div.container > div > div > div",
        expectedSuccessAlertText: "Вы успешно авторизованы",
    },
    search: {
        form: "body > div.header-bottom > div > div > div.col-md-3.header-right > div > form",

        input: "#typeahead",
        inputText: "casio",

        autocomplete: "body > div.header-bottom > div > div > div.col-md-3.header-right > div > form > span > div",

        submit: "body > div.header-bottom > div > div > div.col-md-3.header-right > div > form > input[type=submit]",

        searchBreadcrumb: "body > div.content > div.breadcrumbs > div > div > ol > li:nth-child(2)",
        get breadcrumbText() {
            return `Поиск по запросу \"${this.inputText}\"`
        }
    }
};
