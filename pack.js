// pack.js — rebuilds index.html and minimum.html from chess.js and minimum.js
// with RegPack 5.0.1, using the settings documented in README.md.
//
//   npm install regpack@5.0.1
//   node pack.js --check    compare with the committed HTML files
//   node pack.js            rewrite the HTML files
const fs = require('fs');
const { cmdRegPack } = require('regpack');

const BUILDS = [
  { src: 'chess.js',   out: 'index.html',   head: '<center><table id=T><script>', crush: [1, 0.5, 1, 0] },
  { src: 'minimum.js', out: 'minimum.html', head: '<input id=p><table id=T><script>', crush: [0.5, 0, 1, 0] },
];

const check = process.argv.includes('--check');
let ok = true;

for (const { src, out, head, crush: [gain, length, copies, tiebreaker] } of BUILDS) {
  const options = {
    reassignVars: false, withMath: false, wrapInSetInterval: false, useES6: true,
    crushGainFactor: gain, crushLengthFactor: length, crushCopiesFactor: copies, crushTiebreakerFactor: tiebreaker,
  };
  const warn = console.warn;
  console.warn = () => {};                      // RegPack reports its stats on stderr
  const payload = cmdRegPack(fs.readFileSync(src, 'utf8'), options);
  console.warn = warn;

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
