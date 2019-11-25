const axios = require("axios").default;

const SUCCESS = 1;
const FAIL = 0;

const client = axios.create({
    baseURL: process.env.BASE_URL,
    timeout: process.env.TIMEOUT,
});

const createProductStore = createProductStoreFactory(client);

describe("Product API test", () => {
    const payload = addTimestampToTitleAndAlias({
        category_id: "7",
        title: "Test Watches",
        alias: "test-watches",
        content: "Content about Test Watches",
        price: "1000",
        old_price: "500",
        status: "1",
        keywords: "Test, Watches",
        description: "Description about Test Watches",
        img: "no_image.jpg", // always same on POST
        hit: "1",
        cat: "Citizen", // always same on POST
    });

    describe("GET /api/products", () => {
        const store = createProductStore();

        // should be at most one product so test can be truthy
        beforeAll(async () => await store.addProduct());

        afterAll(async () => await store.removeAddedProducts());

        it("should get list of products", async () => {
            const response = await client.get("products");
            const actual = response.data;
            expect(actual).toBeInstanceOf(Array);
        });

        it("all elements should have same shape", async () => {
            const response = await client.get("products");
            const actual = response.data;
            for (const el of actual) {
                expect(el).toContainAllKeys(["id", ...Object.keys(payload)]);
            }
        });
    });

    describe("POST /api/addproduct", () => {
        const store = createProductStore(payload);

        afterAll(async () => await store.removeAddedProducts());

        it("should create new product", async () => {
            const actual = await store.addProduct();
            expect(actual).toContainAllKeys(["status", "id"]);
            expect(actual.status).toEqual(SUCCESS);
            expect(typeof actual.id === "number").toBeTrue();
        });

        it(`should contain added product in list`, async () => {
            const inserted = await store.addProduct();
            const response = await client.get("products");
            const actual = response.data.find(product => Number(product.id) === inserted.id);
            expect(actual).toEqual({ ...payload, id: `${inserted.id}` });
        });

        it("should fail if passing no payload", async () => {
            const response = await client.post("addproduct");
            const actual = response.data;
            expect(actual.status).toEqual(FAIL);
        });
    });

    describe("DELETE /api/deleteproduct", () => {
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
});
