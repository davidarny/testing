const helper = require("../helper");
const settings = require("../config");

module.exports = function() {
    const response = {
        dollar: 63.77,
        euro: 72.96,
    };
    const stubs = [
        {
            predicates: [
                {
                    equals: {
                        method: "GET",
                        path: "/rate",
                    },
                },
            ],
            responses: [
                {
                    is: {
                        statusCode: 200,
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(response),
                    },
                },
            ],
        },
    ];
    const imposter = {
        port: settings.ports.math,
        protocol: "http",
        stubs: stubs,
    };
    return helper(imposter);
};
