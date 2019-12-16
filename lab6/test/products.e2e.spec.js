const axios = require("axios").default;
const faker = require("faker");

const SUCCESS = 1;
const FAIL = 0;

const client = axios.create({
    baseURL: process.env.BASE_URL,
    timeout: process.env.TIMEOUT,
});

const config = require("./config");

describe("Product API test", () => {
    describe.each(config.get)("GET /api/products", expected => {
        it("should get list of products", async () => {
            const response = await client.get("products");
            const actual = response.data;
            expect(actual).toBeInstanceOf(expected);
        });
    });

    describe.each(config.post)("POST /api/addproduct", expected => {
        let id;
        let alias;

        afterAll(async () => {
            await client.delete(`deleteproduct?id=${id}`);
        });

        it("should create new product", async () => {
            const response = await client.post("addproduct", expected);
            const actual = response.data;
            expect(actual).toContainAllKeys(["status", "id"]);
            expect(actual.status).toEqual(SUCCESS);
            expect(typeof actual.id === "number").toBeTrue();
            id = actual.id;
        });

        it(`should contain added product in list`, async () => {
            const response = await client.get("products");
            const actual = response.data.find(product => Number(product.id) === id);
            expect(actual).toMatchObject({ ...expected, id: `${id}` });
            alias = actual.alias;
        });

        it("should fail if passing no payload", async () => {
            const response = await client.post("addproduct");
            const actual = response.data;
            expect(actual.status).toEqual(FAIL);
        });

        describe("should create product with same payload and get alias like `alias-0`", () => {
            let id;

            beforeAll(async () => {
                const response = await client.post("addproduct", expected);
                id = response.data.id;
            });

            afterAll(async () => {
                await client.delete(`deleteproduct?id=${id}`);
            });

            it("should find created product with alias like `alias-0`", async () => {
                const response = await client.get("products");
                const actual = response.data.find(product => Number(product.id) === id);
                expect(actual.alias).toBe(`${alias}-0`);
            });
        });
    });

    describe.each(config.delete)("DELETE /api/deleteproduct", expected => {
        let id;

        beforeAll(async () => {
            const response = await client.post("addproduct", expected);
            id = response.data.id;
        });

        afterAll(async () => {
            await client.delete(`deleteproduct?id=${id}`);
        });

        afterAll(async () => await store.removeAddedProducts());

        it("should delete product", async () => {
            const response = await client.delete(`deleteproduct?id=${id}`);
            const actual = response.data;
            expect(actual.status).toBe(SUCCESS);
        });

        it("should not contain deleted product in list", async () => {
            const response = await client.get("products");
            const actual = response.data.find(product => Number(product.id) === Number(id));
            expect(actual).toBe(undefined);
        });

        it("should fail if deleting by non-existing id", async () => {
            const response = await client.delete(`deleteproduct?id=${id}`);
            const actual = response.data;
            expect(actual.status).toBe(FAIL);
        });
    });

    describe.each(config.put)("PUT /api/editproduct", (expected, update) => {
        let id;

        beforeAll(async () => {
            const response = await client.post("addproduct", expected);
            id = response.data.id;
        });

        afterAll(async () => {
            await client.delete(`deleteproduct?id=${id}`);
        });

        it("should fail to update without id", async () => {
            const response = await client.put("editproduct", expected);
            const actual = response.data;
            expect(actual.status).toBe(FAIL);
        });

        it("should modify title and get success status", async () => {
            const response = await client.put("editproduct", {
                id,
                ...expected,
                ...update,
            });
            const actual = response.data;
            expect(actual.status).toBe(SUCCESS);
        });

        it("should get product with modified title & alias", async () => {
            const response = await client.get("products");
            const actual = response.data.find(product => Number(product.id) === Number(id));
            expect(actual.title).toBe(update.title);
            expect(actual.content).toBe(update.content);
            expect(actual.price).toBe(update.price);
            expect(actual.old_price).toBe(update.old_price);
            expect(actual.keywords).toBe(update.keywords);
            expect(actual.description).toBe(update.description);
            expect(actual.alias).toBe(toKebabCase(update.title));
        });
    });
});
