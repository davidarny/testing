const jsdom = require("jsdom");
const request = require("request-promise-native");

const { JSDOM } = jsdom;

const BASE_URL = "http://52.136.215.164"
const URL = `${BASE_URL}/broken-links`;

const processed = new Set();

async function main() {
    await testHtmlLinks(URL + "/");
}

async function testHtmlLinks(url) {
    try  {
        const content = await request(url, { encoding: "utf8", timeout: 5000 });
        console.log(`\t✅  ${url}`)
        await runTestsDeep(content);
    } catch {
        console.log(`\t❌  ${url}`)
    }
}

async function runTestsDeep(content) {
    const { window } = new JSDOM(content);
    const { document } = window;
    const nodes = document.getElementsByTagName("a");
    const links = getLinksFromNodes(nodes);
    for (let link of links) {
        link = getNormalizedUrl(link);
        const url = getNormalizedUrl(`${URL}/${link}`);
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
            console.log(`Processing ${link}`)
            await testHtmlLinks(link);
        } else if (url.startsWith("http")) {
            // skip any third-party URL
            if (isThirdPartyUrl(url)) {
                return;
            }
            console.log(`Processing ${url}`)
            await testHtmlLinks(url);
        }
    }
}

function getLinksFromNodes(nodes) {
    return Array
        .from(nodes)
        .map(node => (node.href.trim()))
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

function getNormalizedUrl(url) {
    const regex = /(?<!(http:|https:))\/\//g;
    return url.replace(regex, "/");
}

main();
