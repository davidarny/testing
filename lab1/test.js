const fs = require("fs");
const { execSync: exec } = require("child_process");

function main() {
    /**
     * Program arguments
     *
     * @type {[string, string]}
     */
    const args = process.argv.slice(2);

    if (args.length < 2) {
        return;
    }

    const input = fs.readFileSync(args[0]);
    const output = fs.createWriteStream("output.txt", { encoding: "UTF-8" });

    /**
     * Array of pairs of test data and expected results
     *
     * @type {Array<[string, string]>}
     */
    const tests = input
        .toString()
        .split("\n")
        .map(string => string.trim().split(", "));

    for (const test of tests) {
        const data = test[0];
        const expected = test[1];
        // handling last empty line
        if (!data && !expected) {
            continue;
        }
        const buffer = exec(`node ${args[1]} ${data}`);
        const actual = buffer.toString().trim();

        if (expected === actual) {
            output.write(`✔ success test "${data}, ${expected}"\n`);
        } else {
            output.write(`❌ failed test "${data}, ${expected}"\n`);
        }
    }

    output.close();
}

try {
    main();
} catch (e) {
    console.log(e);
}
