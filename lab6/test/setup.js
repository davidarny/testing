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

global.addTimestampToTitleAndAlias = payload => {
    const timestamp = new Date().valueOf();
    return {
        ...payload,
        title: `${payload.title} ${timestamp}`,
        alias: `${payload.alias}-${timestamp}-0`,
    };
};
