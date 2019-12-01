const faker = require('faker');

global.createProductStoreFactory = client => payload => {
    const inserted = [];

    async function deleteProductById(id) {
        await client.delete("deleteproduct", { params: id });
    }

    return {
        addProduct: async () => {
            const response = await client.post("addproduct", payload);
            inserted.push(response.data.id);
            return response.data;
        },

        removeAddedProducts: async () => {
            if (inserted.length === 0) {
                return;
            }
            if (inserted.length === 1) {
                return deleteProductById(inserted[0]);
            }
            await Promise.all(inserted.map(deleteProductById));
        },
    };
};

global.toKebabCase = str => {
    return str.replace(/\s+/g, "-").toLowerCase();
};

global.createPayload = () => {
    const title = faker.lorem.words(5);
    return {
        category_id: "1",
        title,
        content: faker.lorem.lines(5),
        price: `${faker.random.number(1000)}`,
        old_price: `${faker.random.number(1000)}`,
        status: "0",
        keywords: title.split(" ").join(","),
        description: faker.lorem.lines(1),
        hit: "0",
    };
};
