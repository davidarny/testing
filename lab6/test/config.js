const faker = require("faker");

module.exports = {
    get: [[Array]],
    post: [
        [
            {
                category_id: "1",
                title: faker.lorem.words(5),
                content: faker.lorem.lines(5),
                price: `${faker.random.number(1000)}`,
                old_price: `${faker.random.number(1000)}`,
                status: "0",
                keywords: faker.lorem
                    .words(5)
                    .split(" ")
                    .join(","),
                description: faker.lorem.lines(1),
            },
        ],
        [
            {
                category_id: "1",
                title: faker.lorem.words(5),
                content: faker.lorem.lines(5),
                price: "13.37",
                old_price: "3.22",
                status: "0",
                keywords: faker.lorem
                    .words(5)
                    .split(" ")
                    .join(","),
                description: faker.lorem.lines(1),
            },
        ],
        [
            {
                category_id: "1",
                title: "",
                content: "",
                price: "0",
                old_price: "0",
                status: "0",
                keywords: "",
                description: "",
            },
        ],
        [
            {
                category_id: "14",
                title: faker.lorem.words(5),
                content: faker.lorem.lines(5),
                price: "-1",
                old_price: "-1",
                status: "0",
                keywords: faker.lorem
                    .words(5)
                    .split(" ")
                    .join(","),
                description: faker.lorem.lines(1),
            },
        ],
    ],
    delete: [
        [
            {
                category_id: "1",
                title: faker.lorem.words(5),
                content: faker.lorem.lines(5),
                price: `${faker.random.number(1000)}`,
                old_price: `${faker.random.number(1000)}`,
                status: "0",
                keywords: faker.lorem
                    .words(5)
                    .split(" ")
                    .join(","),
                description: faker.lorem.lines(1),
            },
        ],
    ],
    put: [
        [
            {
                category_id: "1",
                title: faker.lorem.words(5),
                content: faker.lorem.lines(5),
                price: `${faker.random.number(1000)}`,
                old_price: `${faker.random.number(1000)}`,
                status: "0",
                keywords: faker.lorem
                    .words(5)
                    .split(" ")
                    .join(","),
                description: faker.lorem.lines(1),
            },
            {
                category_id: "1",
                title: faker.lorem.words(5),
                content: faker.lorem.lines(5),
                price: `${faker.random.number(1000)}`,
                old_price: `${faker.random.number(1000)}`,
                status: "0",
                keywords: faker.lorem
                    .words(5)
                    .split(" ")
                    .join(","),
                description: faker.lorem.lines(1),
            },
        ],
    ],
};
