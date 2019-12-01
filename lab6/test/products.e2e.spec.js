const axios = require("axios").default;
const faker = require("faker");

const SUCCESS = 1;
const FAIL = 0;

const client = axios.create({
    baseURL: process.env.BASE_URL,
    timeout: process.env.TIMEOUT,
});

const createProductStore = createProductStoreFactory(client);

describe("Product API test", () => {
    describe("GET /api/products", () => {
        it("should get list of products", async () => {
            const response = await client.get("products");
            const actual = response.data;
            expect(actual).toBeInstanceOf(Array);
        });
    });

    describe("POST /api/addproduct", () => {
        const payload = createPayload();
        const store = createProductStore(payload);

        let id;
        let alias;

        afterAll(async () => await store.removeAddedProducts());

        it("should create new product", async () => {
            const actual = await store.addProduct();
            expect(actual).toContainAllKeys(["status", "id"]);
            expect(actual.status).toEqual(SUCCESS);
            expect(typeof actual.id === "number").toBeTrue();
            id = actual.id;
        });

        it(`should contain added product in list`, async () => {
            const response = await client.get("products");
            const actual = response.data.find(product => Number(product.id) === id);
            expect(actual).toMatchObject({ ...payload, id: `${id}` });
            alias = actual.alias;
        });

        it("should fail if passing no payload", async () => {
            const response = await client.post("addproduct");
            const actual = response.data;
            expect(actual.status).toEqual(FAIL);
        });

        describe("should create product with same payload and get alias like `alias-0`", () => {
            beforeAll(async () => {
                const actual = await store.addProduct();
                id = actual.id;
            });

            it("should find created product with alias like `alias-0`", async () => {
                const response = await client.get("products");
                const actual = response.data.find(product => Number(product.id) === id);
                expect(actual.alias).toBe(`${alias}-0`);
            });
        });
    });

    describe("DELETE /api/deleteproduct", () => {
        const payload = createPayload();
        const store = createProductStore(payload);

        let id;

        beforeAll(async () => {
            const product = await store.addProduct();
            id = Number(product.id);
        });

        afterAll(async () => await store.removeAddedProducts());

        it("should delete product", async () => {
            const response = await client.delete("deleteproduct", { params: { id } });
            const actual = response.data;
            expect(actual.status).toBe(SUCCESS);
        });

        it("should not contain deleted product in list", async () => {
            const response = await client.get("products");
            const actual = response.data.find(product => Number(product.id) === id);
            expect(actual).toBe(undefined);
        });

        it("should fail if deleting by non-existing id", async () => {
            const response = await client.delete("deleteproduct", { params: { id } });
            const actual = response.data;
            expect(actual.status).toBe(FAIL);
        });
    });

    describe("PUT /api/editproduct", () => {
        const payload = createPayload();
        const store = createProductStore(payload);

        let id;

        const newTitle = faker.lorem.words(5);

        beforeAll(async () => {
            const product = await store.addProduct();
            id = Number(product.id);
        });

        afterAll(async () => await store.removeAddedProducts());

        it("should fail to update without id", async () => {
            const response = await client.put("editproduct", payload);
            const actual = response.data;
            expect(actual.status).toBe(FAIL);
        });

        it("should modify title and get success status", async () => {
            const response = await client.put("editproduct", {
                id,
                ...payload,
                title: newTitle,
            });
            const actual = response.data;
            expect(actual.status).toBe(SUCCESS);
        });

        it("should get product with modified title & alias", async () => {
            const response = await client.get("products");
            const actual = response.data.find(product => Number(product.id) === id);
            expect(actual.title).toBe(newTitle);
            expect(actual.alias).toBe(toKebabCase(newTitle));
        });
    });
});
