const request = require("supertest");
const app = require("../server");

describe("API", () => {
    beforeAll(async () => app.ready());

    afterAll(async () => app.close());

    describe("GET /healthcheck", () => {
        it("should return OK response", () =>
            request(app.server)
                .get("/healthcheck")
                .expect(200)
                .then(response => expect(response.text).toBe("OK")));
    });

    describe("GET /calculate", () => {
        it("should return 400 BadRequest if no query passed", () =>
            request(app.server)
                .get("/calculate")
                .expect(400)
                .then(response =>
                    expect(response.body).toStrictEqual({
                        error: "BadRequest",
                        code: 400,
                        message: "No money provided",
                        statusCode: 400,
                    }),
                ));

        it("should return 400 BadRequest if no money query passed", () =>
            request(app.server)
                .get("/calculate?query=test")
                .expect(400)
                .then(response =>
                    expect(response.body).toStrictEqual({
                        error: "BadRequest",
                        code: 400,
                        message: "No money provided",
                        statusCode: 400,
                    }),
                ));

        it("should return 400 BadRequest if money is negative", () =>
            request(app.server)
                .get("/calculate?money=-1")
                .expect(400)
                .then(response =>
                    expect(response.body).toStrictEqual({
                        error: "BadRequest",
                        code: 400,
                        message: "Money cannot be negative",
                        statusCode: 400,
                    }),
                ));

        it("should return 400 BadRequest if money is not a number", () =>
            request(app.server)
                .get("/calculate?money=dollar")
                .expect(400)
                .then(response =>
                    expect(response.body).toStrictEqual({
                        error: "BadRequest",
                        code: 400,
                        message: "Money is not a number",
                        statusCode: 400,
                    }),
                ));

        it("should return 0.00 dollars and 0.00 for money = 0", () =>
            request(app.server)
                .get("/calculate?money=0")
                .expect(200)
                .then(response =>
                    expect(response.body).toStrictEqual({
                        dollars: "0.00",
                        euros: "0.00",
                    }),
                ));

        it("should return 63.77 dollars and 72.96 for money = 1", () =>
            request(app.server)
                .get("/calculate?money=1")
                .expect(200)
                .then(response =>
                    expect(response.body).toStrictEqual({
                        dollars: "63.77",
                        euros: "72.96",
                    }),
                ));

        it("should return 637.70 dollars and 729.60 for money = 10", () =>
            request(app.server)
                .get("/calculate?money=10")
                .expect(200)
                .then(response =>
                    expect(response.body).toStrictEqual({
                        dollars: "637.70",
                        euros: "729.60",
                    }),
                ));

        it("should return 6377.00 dollars and 7296.00 for money = 100", () =>
            request(app.server)
                .get("/calculate?money=100")
                .expect(200)
                .then(response =>
                    expect(response.body).toStrictEqual({
                        dollars: "6377.00",
                        euros: "7296.00",
                    }),
                ));
    });
});
