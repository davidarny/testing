const fs = require("fs");
const { execSync: exec } = require("child_process");

function main() {
    /**
     * Program arguments
     *
     * @type {[string, string]}
     */
    const args = process.argv.slice(2);

    const input = fs.readFileSync(args[0]);
    const output = fs.createWriteStream("output.txt", { encoding: "UTF-8" });

    /**
     * Array of pairs of test data and expected results
     *
     * @type {Array<[string, string]>}
     */
    const tests = input.toString().split("\n").map(string => string.trim().split(", "));


    for (const test of tests) {
        const data = test[0];
        const expected = test[1];
        const buffer = exec(`node main.js ${data}`);
        const actual = buffer.toString().trim();

        if (expected === actual) {
            output.write("success\n");
        } else {
            output.write("error\n");
        }
    }

    output.close();
}

try {
    main();
} catch(e) {
    console.log(e);
}
