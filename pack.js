// pack.js — rebuilds index.html, minimal.html and Lowest.html from chess.js, minimal.js and
// Lowest.js, using the settings documented in README.md.
//
//   npm install regpack@5.0.1
//   node pack.js --check    compare with the committed HTML files
//   node pack.js            rewrite the HTML files
//
// Lowest.html is not packed: RegPack's output is longer than the source, so the file is the
// source in a <script> element.
const fs = require('fs');
const { cmdRegPack } = require('regpack');

const BUILDS = [
  { src: 'chess.js',   out: 'index.html',   head: '<center><table id=u style=zoom:3><script>', crush: [0.125, 0.25, 0, -1] },
  { src: 'minimal.js', out: 'minimal.html', head: '<input id=x><table id=u><script>',          crush: [0, 0.25, 0.125, -1] },
  { src: 'Lowest.js',  out: 'Lowest.html',  head: '<script>',                                  crush: null },
];

const check = process.argv.includes('--check');
let ok = true;

for (const { src, out, head, crush } of BUILDS) {
  const source = fs.readFileSync(src, 'utf8');
  let payload = source;
  if (crush) {
    const [gain, length, copies, tiebreaker] = crush;
    const options = {
      reassignVars: false, withMath: false, wrapInSetInterval: false, useES6: true,
      crushGainFactor: gain, crushLengthFactor: length, crushCopiesFactor: copies, crushTiebreakerFactor: tiebreaker,
    };
    const warn = console.warn;
    console.warn = () => {};                      // RegPack reports its stats on stderr
    payload = cmdRegPack(source, options);
    console.warn = warn;
  }
  const html = head + payload + '</script>';
  const size = Buffer.byteLength(html);
  if (check) {
    const same = fs.existsSync(out) && fs.readFileSync(out, 'utf8') === html;
    ok = ok && same;
    console.log(`${out}: ${size} B, ${same ? 'identical' : 'DIFFERENT'}`);
  } else {
    fs.writeFileSync(out, html);
    console.log(`${out}: ${size} B written`);
  }
}
process.exit(ok ? 0 : 1);
