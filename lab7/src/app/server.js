const config = require("./config");
const fetch = require("node-fetch");
const app = require("fastify")({ logger: config.log });

const RATE_URL = config.paths.rate.replace("{port}", config.ports.rate);

app.get("/healthcheck", (_req, res) => res.send("OK"));

app.get("/calculate", async (req, res) => {
    req.log.debug("calc params", req.query);

    let { money } = req.query;
    if (!money) {
        res.code(400).send({
            error: "BadRequest",
            code: 400,
            message: "No money provided",
            statusCode: 400,
        });
        return;
    }

    money = parseFloat(money);

    if (isNaN(money)) {
        res.code(400).send({
            error: "BadRequest",
            code: 400,
            message: "Money is not a number",
            statusCode: 400,
        });
        return;
    }

    if (money < 0) {
        res.code(400).send({
            error: "BadRequest",
            code: 400,
            message: "Money cannot be negative",
            statusCode: 400,
        });
        return;
    }

    const response = await fetch(RATE_URL);
    const rate = await response.json();

    req.log.debug("rate", rate);

    res.send({
        dollars: (rate.dollar * money).toFixed(2),
        euros: (rate.euro * money).toFixed(2),
    });
});

module.exports = app;
