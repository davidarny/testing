const jsdom = require("jsdom");
const request = require("request-promise-native");

const { JSDOM } = jsdom;

const BASE_URL = "http://52.136.215.164";
const URL = `${BASE_URL}/broken-links`;

const processed = new Set();

const counters = {
    err: 0,
    ok: 0,
};

async function main() {
    await testHtmlLinks(URL + "/");

    const now = new Date().toISOString();

    console.log(`\n${counters.ok}\n${now}`);
    console.error(`\n${counters.err}\n${now}`);
}

async function testHtmlLinks(url) {
    const options = {
        encoding: "utf8",
        timeout: 5000,
        resolveWithFullResponse: true,
    };
    try {
        const response = await request(url, options);
        counters.ok++;
        console.log(`${response.statusCode}\t${url}`);
        await runTestsDeep(response.body);
    } catch (error) {
        counters.err++;
        console.error(`${error.statusCode}\t${url}`);
    }
}

async function runTestsDeep(content) {
    const { window } = new JSDOM(content);
    const { document } = window;
    const nodes = document.getElementsByTagName("a");
    const links = getLinksFromNodes(nodes);
    for (const link of links) {
        const url = `${URL}/${link}`;
        // check if links already processed
        if (isLinkProcessed(url) || isLinkProcessed(link)) {
            continue;
        }
        // mark as processed
        markLinkProcessed(link);
        markLinkProcessed(url);
        // recursion starts here
        if (link.startsWith("http")) {
            // skip any third-party URL
            if (isThirdPartyUrl(link)) {
                continue;
            }
            await testHtmlLinks(link);
        } else if (url.startsWith("http")) {
            await testHtmlLinks(url);
        }
    }
}

function getLinksFromNodes(nodes) {
    return Array.from(nodes)
        .map(node => node.href.trim())
        .filter(Boolean);
}

function isLinkProcessed(link) {
    return processed.has(link);
}

function markLinkProcessed(url) {
    processed.add(url);
}

function isThirdPartyUrl(url) {
    return !url.startsWith(BASE_URL);
}

main();
