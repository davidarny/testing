const mb = require("mountebank");
const config = require("./config");
const rate = require("./services/rate");

const mock = mb.create({
    port: config.ports.main,
    pidfile: ".mock/mb.pid",
    logfile: ".mock/mb.log",
    protofile: ".mock/protofile.json",
    ipWhitelist: ["*"],
});

mock.then(() => rate()).catch(console.error);
