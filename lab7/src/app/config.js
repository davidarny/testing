module.exports = {
    ports: {
        main: 3000,
        rate: 5050,
    },
    paths: {
        rate: "http://localhost:{port}/rate",
    },
    log:
        process.env.NODE_ENV !== "testing"
            ? {
                  level: "debug",
                  prettyPrint: true,
              }
            : false,
};
