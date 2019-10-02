function main() {
    let a = 0;
    let b = 0;
    let c = 0;

    /**
     * Program arguments
     *
     * @type {[string, string, string]}
     */
    const args = process.argv.slice(2);

    if (args.length !== 3) {
        console.log("not a triangle");
        return;
    }

    /**
     * Number regex
     *
     *  @type {string}
     */
    const regex = "\\d+";

    // check if all three arguments are numeric
    // parse to int if matches
    if (args[0].match(regex) && args[1].match(regex) && args[2].match(regex)) {
        a = parseInt(args[0]);
        b = parseInt(args[1]);
        c = parseInt(args[2]);
    } else {
        console.log("not a triangle");
        return;
    }

    if (a <= 0 || b <= 0 || c <= 0) {
        console.log("not a triangle");
        return;
    }

    if (a === b && a === c) {
        console.log("equilateral");
    } else if (a === b || b === c || c === a) {
        console.log("isosceles");
    } else {
        console.log("normal");
    }
}

try {
    main()
} catch(e) {
    console.log(e)
}
