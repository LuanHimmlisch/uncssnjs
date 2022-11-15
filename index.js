import { parse } from 'node-html-parser';
import { resolve } from 'path';

import uncss from 'uncss';
import { writeFileSync } from 'fs';

let url;
let output;

if ((url = process.argv[2]) === undefined) {
    throw Error('Parameter URL missing');
}

if ((output = process.argv[3]) === null) {
    throw Error('Parameter OUTPUT missing');
}

console.log('> Fetching HTML...');
fetch(url)
 .then(async res => {
    console.log('> Parsing HTML...');
    const rawData = await res.text();
    let dom = parse(rawData);
    dom.querySelectorAll('script').forEach(x=> x.remove());
    const parsed = dom.toString();

    console.log('> Processing CSS...');
    uncss(parsed, {}, (error, data) => {
        if (error !== null) {
            throw error;
        }
        writeFileSync(resolve(process.cwd(), output).toString(), data);
        console.log('>> Finished!');
    });
 })
 .catch(error => {
   console.error(error)
 })