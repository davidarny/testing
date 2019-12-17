const fetch = require("node-fetch");
const settings = require("./config");

module.exports = function(body) {
    const url = `http://127.0.0.1:${settings.ports.main}/imposters`;
    return fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
    });
};
