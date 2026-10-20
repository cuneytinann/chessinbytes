// pack.js — rebuilds index.html and minimal.html from chess.js and minimal.js, using the
// settings documented in README.md.
//
//   npm install regpack@5.0.1
//   node pack.js --check    compare with the committed HTML files
//   node pack.js            rewrite the HTML files
//
// Lowest.html is not built: the file is its own source. Packed, it would come out longer;
// README.md has the numbers.
const fs = require('fs');
const { cmdRegPack } = require('regpack');

const BUILDS = [
  { src: 'chess.js',   out: 'index.html',   head: '<center><table id=u style=zoom:3><script>', crush: [0.125, 0.25, 0, -1] },
  { src: 'minimal.js', out: 'minimal.html', head: '<input id=x><table id=u><script>',          crush: [0, 0.25, 0.125, -1] },
];

const check = process.argv.includes('--check');
let ok = true;

for (const { src, out, head, crush: [gain, length, copies, tiebreaker] } of BUILDS) {
  const options = {
    reassignVars: false, withMath: false, wrapInSetInterval: false, useES6: true,
    crushGainFactor: gain, crushLengthFactor: length, crushCopiesFactor: copies, crushTiebreakerFactor: tiebreaker,
  };
  const warn = console.warn;
  console.warn = () => {};                        // RegPack reports its stats on stderr
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
