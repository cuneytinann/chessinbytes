**[English](#chessinbytes)** · **[Türkçe](#turkce)**

# chessinbytes

Two-player chess in bytes. Three builds, each a single HTML file under 1 KB: no libraries, no build step, no server. Download one, double-click, play.

| file | size | how it plays |
| ---- | ---- | ------------ |
| `index.html` | **911 B** | click the board; piece glyphs, the board turns after every move, promotion picker, drawn at three times its size |
| `minimal.html` | **722 B** | click the board; pieces shown as hexadecimal digits, promotion piece typed into a box |
| `Lowest.html` | **650 B** | type moves as numbers into a dialog; no board at all |

All three enforce the same rules: full legality, castling with every condition, en passant, promotion to any piece. They run on the 0x88 rule code of the `L1` builds of [FideLite](https://github.com/cuneytinann/FideLite).

Part of the [Golfstack](https://www.fidelite.art/) project.

## Play

- [cuneytinann.github.io/chessinbytes](https://cuneytinann.github.io/chessinbytes/) — `index.html`
- [cuneytinann.github.io/chessinbytes/minimal.html](https://cuneytinann.github.io/chessinbytes/minimal.html) — `minimal.html`
- [cuneytinann.github.io/chessinbytes/Lowest.html](https://cuneytinann.github.io/chessinbytes/Lowest.html) — `Lowest.html`
- The same files are mirrored on the project site, among the [special builds](https://www.fidelite.art/#special).

The budget is 1,024 bytes. `index.html` stays 113 bytes under it.

---

## The rules

The rules are the same in all three files.

- **Full legality.** Every move is played on a copy of the board, and it is refused if it leaves the mover's own king attacked.
- **Castling, with every condition.** The king and the rook have never moved, the squares between them are empty, the king is not in check, and it neither passes through nor lands on an attacked square. "Never moved" is kept as a ledger of touched squares: every move marks the two squares it touches, and castling needs both the king's square and the rook's square untouched. An untouched corner still holds its original rook, so the rook is not checked separately. The pawn's double step reads the same ledger: an untouched pawn is still on its starting rank.
- **En passant**, on the move straight after the double step and only then.
- **Promotion** to queen, rook, bishop or knight.

**Not in it:** no clock, no 50- or 75-move rule, no repetition, no dead-position test, no draw offers, no result codes, no bot. Checkmate and stalemate are not told apart. For the full FIDE arbiter with all of that, see [fidelite.art](https://www.fidelite.art/).

---

## `index.html`

- **Click a piece, then its target.** A click that is not a legal move selects the square that was clicked instead. A wrong click therefore drops the selection, and the piece has to be clicked again.
- **Piece glyphs**, Unicode `U+2654`–`U+265F`. The source writes them as `\u` escapes, so the file is pure ASCII and displays correctly whatever character encoding the browser assumes.
- **The board turns** after every move to the side to move.
- **Promotion with a picker.** When a pawn reaches the last rank, four buttons (queen, rook, bishop, knight) appear above the board. The move is completed by clicking one of them, and clicks on the board are ignored until then.
- **Game-over indicator.** When the side to move has no legal move, the board loses its colouring and every square turns white. One test covers checkmate and stalemate alike.
- **Zoomed in by itself.** The table carries `style=zoom:3`, so every cell is drawn at three times its size: 72×72 px on screen. The browser's own zoom still works on top of it. `zoom` has been part of CSS for some time, and Firefox supports it from version 126. An older browser ignores it and shows the board at its original size.

## `minimal.html`

The same rules, with the interface cut back to what is needed to play.

- **Click a piece, then its target**, with the same selection rule.
- **No glyphs.** Each cell shows the piece code as a hexadecimal digit. `0` is an empty square. The side that moves first has `1` pawn, `2` king, `3` queen, `4` knight, `5` rook and `6` bishop; the other side has `9` pawn, `a` king, `b` queen, `c` knight, `d` rook and `e` bishop.
- **Fixed orientation.** The side that moves first is at the bottom, and the board does not turn.
- **Promotion without a picker.** The piece is read from the text box above the board at the moment the move is made, as the digit taken modulo 4: `1` knight, `2` rook, `3` bishop. `0`, an empty box or anything that is not a digit gives a queen. The move completes at once.
- **No indicators.** When the side to move has no legal move, clicks simply do nothing.

The text box is the cheapest control for the promotion piece. A `<select>` holding the four codes makes the file 771 bytes, and four buttons make it 804.

## `Lowest.html`

The same rules, with no board at all. The whole interface is one `prompt()` dialog.

- **No board.** Nothing is drawn. The dialog shows the last accepted move exactly as it was typed, and nothing else; before the first move it shows `63`, the value the loop that lays out the board leaves in `j`. Keeping the position in mind is up to the players.
- **Moves as numbers.** Four digits give the from-square and then the to-square, each written as its rank and then its file, both counted from 0: a1 is `00`, h1 `07`, a8 `70`, h8 `77`. `e2e4` is `1434`. Castling is written as the king's move: `0406` and `0402` for White, `7476` and `7472` for Black. En passant uses the square the pawn actually lands on.
- **Promotion from a fifth character**, taken modulo 4 as in the box of `minimal.html`: `1` knight, `2` rook, `3` bishop; anything else, or nothing, gives a queen. Characters after the fifth are ignored.
- **How input is read.** A missing character, or one that is not a digit, counts as `0`. So `1` is read as `1000` (a2 to a1) and is played if that move happens to be legal. `8` and `9` point off the board, so a square written with them never makes a legal move.
- **Nothing is ever rejected loudly.** A move for the wrong side, an illegal move, an empty line or Cancel: in every case the dialog comes back with the same text.
- **No ending.** When the side to move has no legal move (checkmate or stalemate), every input is refused and the dialog keeps showing the last move. The loop never exits; close the tab to stop.
- **Not packed, and no separate source.** The file is the program itself inside a `<script>` element; there is nothing to unpack. At this size packing does not pay for itself. RegPack does find repeats: with 16 tokens its encoded string comes to 585 bytes, 48 fewer than the 633-byte source. But the loop that unpacks it, `for(_='…';G=/[…]/.exec(_);)with(_.split(G))_=join(shift());eval(_)`, costs 67 bytes on its own, so the shortest packed form over all 2,673 settings listed under *Packing*, with 5.0.1 and 5.0.4 alike, is 652 bytes: 19 more than the source. RegPack therefore hands the source back unchanged. In Kolmogorov's terms: a self-extracting file is a description of the program that has to carry its own decoder, and here the plain source is the shorter description.

---

## Files

| file | size | what |
| ---- | ---- | ---- |
| `index.html` | 911 B | the game, packed and playable |
| `chess.js` | 1,099 B | its plain source, one line, unpacked |
| `minimal.html` | 722 B | the reduced build, packed and playable |
| `minimal.js` | 760 B | its plain source, one line, unpacked |
| `Lowest.html` | 650 B | the smallest build: the source itself, in a `<script>` element |
| `pack.js` | 1,728 B | rebuilds both packed files from their sources and checks them byte for byte |

## The engine

**The board** is a 0x88 array: square = 16 × rank + file, with a1 = 0 and h8 = 119. Every index with bit 3 set lies off the board and is never written, so the array is sparse and `map` skips the holes when the board is drawn. The start position is one string, `` `dcebaecd${10n**40n-10n**32n}1111111154632645` ``. The BigInt expression writes eight 9s and thirty-two 0s, which are the White pawns and the empty middle. `b[j*2-j%8]` then spreads its 64 hexadecimal digits onto the 0x88 squares.

**Piece codes** are `1` pawn, `2` king, `3` queen, `4` knight, `5` rook and `6` bishop, plus 8 for the other colour. In `index.html`, +8 is White. In `minimal.html` the side that moves first is the one without +8. The array is drawn from index 0 at the top-left, which is why that side starts at the bottom.

**Four pieces of code:**

- `G(i,f,m)` asks whether the piece on `i` can reach `f`, with `m` switching to attack mode. The direction comes from arithmetic on `f−i`: a step of 1, 15, 16 or 17, and a recursive ray walker `S`. A knight's move is recognised by `d*d%765%128==68`.
- `T(x)` asks whether square `x` is attacked by the opponent. By default `x` is the mover's king.
- `U(i,f)` plays a move on the board. It moves the rook when castling, removes the pawn taken en passant, and returns the new en passant square.
- The legality test plays the move on a copy and refuses it if `T()` answers yes.

The legality test is never a function of its own: it is written out where it is used. In `index.html` that is twice, in the click handler and in the game-over test, and the glyph string is likewise written out at both its uses. In `minimal.html`, `T` is written out at all three of its uses. The source grows each time, but RegPack stores the repeated text once, so the packed file comes out shorter than with an alias, which has to be paid for in its name and its calls.

**The touched-squares ledger** is kept on an object the file already has. In the two DOM builds it is the table element `u`, and in `Lowest.html` it is the function `G`.

The names above are those of `Lowest.html`. In `chess.js` and `minimal.js` the letters have been moved for the packer, so the same functions and parameters go by other names there; the table under *Packing* gives them.

This rule code is that of FideLite's `L1` builds; [fidelite.art](https://www.fidelite.art/#levels) walks through it line by line.

## Unpacking

`index.html` and `minimal.html` are self-extracting. Each script is a RegPack decompression loop ending in `eval(_)`. To recover the plain source, replace that call:

```js
eval(_)   →   console.log(_)
```

The loop itself runs no game code, so this is safe to do in Node. `chess.js` and `minimal.js` in this repo are exactly what comes out. The token characters RegPack uses are control characters (`0x01`–`0x1B`), and they are part of the files.

## Packing

[RegPack 5.0.1](https://github.com/Siorki/RegPack). These settings reproduce both packed files **byte for byte** from their sources; RegPack 5.0.4 gives the same output.

| option | `index.html` | `minimal.html` |
| ------ | ------------ | -------------- |
| `reassignVars` | `false` | `false` |
| `crushGainFactor` | `0.125` | `0` |
| `crushLengthFactor` | `0.25` | `0.25` |
| `crushCopiesFactor` | `0` | `0.125` |
| `crushTiebreakerFactor` | `-1` | `-1` |
| `withMath` | `false` | `false` |
| `wrapInSetInterval` | `false` | `false` |
| `useES6` | `true` | `true` |

In both files the winning stage is stage 2, the regexp character class. Byte layout:

```
41 B  <center><table id=u style=zoom:3><script>     32 B  <input id=x><table id=u><script>     8 B  <script>
861 B  packed payload                               681 B  packed payload                      633 B  source, not packed
 9 B  </script>                                      9 B  </script>                            9 B  </script>
----                                                ----                                       ----
 911 B                                              722 B                                      650 B
```

To rebuild:

```
npm install regpack@5.0.1
node pack.js --check    # compare with the committed files
node pack.js            # rewrite index.html and minimal.html
```

With the `regpack` command line, pass `--no-reassignVars`. Written as `--reassignVars false`, the value arrives as the string `"false"`, which counts as true, and the variables get renamed.

**How the sources were chosen.** Each source won a search over equivalent spellings: variable names, the order of definitions and of operands, the escape style of the glyph string, the order of a cell's attributes, functions kept or written out at every use, and more. Every candidate was packed under up to 2,673 crush settings: gain 0 to 1 in eighths, length −1 to 1.5 in quarters, copies 0 to 1 in eighths, and a tiebreaker of −1, 0 or 1.

**October 2026: names moved by search.** With the October engine update the names in `chess.js` and `minimal.js` were searched again, this time by machine. Every global and every parameter was tried on every lower-case letter, `_` and `$`. A move was kept only if the file packed smaller and every identifier still pointed to the same variable as before, which was checked by parsing the source again after every move; single moves and pairwise swaps took turns until neither found anything. Names the markup reaches stay where they are: `u` and `x`, the ids of the table and the text box, and `b`, `Y`, `F` and `K`, which the generated `onclick` attributes call by name. `Lowest.html` is not packed, so its names cost the same anywhere and were left alone. What moved:

| file | before | now | what |
| ---- | ------ | --- | ---- |
| `chess.js` | `r` | `p` | the rook's square while castling |
| `chess.js` | `z` | `d` | whether the side to move has a legal move; the board is coloured only then |
| `chess.js` | `S` (`G`) | `d` | the ray walker |
| `chess.js` | `d` (`G`) | `w` | `f−i` |
| `chess.js` | `j` (start position) | `w` | the digit's index in the start string |
| `minimal.js` | `D` | `s` | the new en passant square, held while the move is checked |
| `minimal.js` | `P`, `d` (`G`) | `d`, `j` | piece type, `f−i` |
| `minimal.js` | `p`, `P` (`U`) | `m`, `s` | promotion piece, piece type |
| `minimal.js` | `_`, `w` (`F`) | `f`, `j` | unused parameter, the square being drawn |

A shorter source does not reliably pack shorter, because the packer pays for repeated substrings. The figures in this paragraph and the next were measured on the sources as they stood before the October update. The glyph string of `index.html` shows this most clearly. Written as raw UTF-8 characters it makes the source 72 bytes shorter (1,034 instead of 1,106), yet the file comes out 5 bytes longer (929 instead of 924), because the `\u265` prefixes of the escaped form compress into one token. Writing out the legality test and the glyph string at both their uses took `index.html` from 931 to 924 bytes. Writing out `T` in `minimal.html` makes its source 53 bytes longer and the file 1 byte shorter. The same move does not pay everywhere: `T` written out in `index.html` gains nothing, and in `Lowest.html` it lets RegPack beat the source for the first time, but only down to 669 bytes.

**Tried and dropped: the en passant ghost.** The previous version kept the en passant square on the board itself, as a ghost piece code, and had no `e` variable. The same idea works here, with the ghost written as `-8`: it passes for empty to the ray walker and for a capturable piece to the pawn, and `-0.5` would not do because the bitwise `m|b[f]` truncates it to 0. It costs bytes in all three files, though: `Lowest.html` 687 (+22), `minimal.html` 753 (+13), `index.html` 936 (+12). This rule code already handles en passant cheaply through `e`, and a ghost has to be cleared from the board after every move.

## Verification

- **Perft from the starting position** on the engine of each of the three files gives 20, 400, 8,902, 197,281 and 4,865,609 (depth 1–5), the published values.
- **Every file was driven through its real inputs:** cell click handlers, the promotion row, the text box and `prompt()` answers, both in Node and in Chromium. At every ply the set of moves the interface accepts was compared with an independent reference move generator.
- **The positions covered** were 402 targeted ones and several hundred random games. The targeted positions include castling through, into and out of check; castling rights already lost; en passant, including an expired one and a pinned one; promotions, including captures and underpromotions; and checkmate and stalemate. Not one move differed.
- **The 650-byte `Lowest.html`** was checked against the 654-byte one through its `prompt()`: 20 games, 1,513 answers, 1,258 of them legal moves, with empty lines, Cancel and junk among them. The board, the side to move, the en passant square and the touched-squares ledger never differed; the dialog text differed only before the first move, `63` instead of an empty line.
- **The October 2026 update** was checked against the files before it, through their real inputs, with castling, en passant and promotion favoured: `Lowest.html` 120 games and 24,890 `prompt()` answers, empty lines, Cancel, junk and fifth characters among them; `index.html` 60 games and 12,335 clicks on cells and promotion buttons; `minimal.html` 60 games and 13,376 clicks, with the text box set to a new value before each. After every input the dialog text or the drawn table, the board and the touched-squares ledger were compared: no difference. Perft from the starting position to depth 4 gives 197,281 on all three engines. `node pack.js --check` rebuilds all three files byte for byte, with RegPack 5.0.1 and 5.0.4 alike.

---

## Deprecated on purpose

The markup is legacy throughout, because legacy is shorter: `<center>`, `bgcolor`, `width` and `height` on the cell, unquoted attribute values, no closing tags, and no `<html>`, `<head>` or `<body>` at all. The one piece of CSS is `style=zoom:3` on the table in `index.html`: a single attribute that scales cells and glyphs together.

There is no doctype either, which puts the page in **quirks mode**, deliberately. That is what keeps the presentational attributes rendering.

- **The cells of `index.html` are `<td>`, each holding a `<center>`.** In quirks mode a table does not inherit `text-align` from its ancestors, so the outer `<center>` alone would not centre the glyphs. `<th>` would centre them for free but draws them bold. `minimal.html` uses `<th>`, where bold digits do no harm.
- **A light square** gets `bgcolor` with an empty value (`bgcolor=>`), which draws no colour.
- **The promotion picker** of `index.html` is a `<caption>` holding four `<button>`s, none of them closed; each new `<button>` closes the one before it.
- **The `<table>` is never closed**, and the `<script>` sits inside it. The script fills the table and replaces itself.

`minimal.html` adds an unclosed `<input id=x>`. `Lowest.html` goes to the end of that road: the file is a single `<script>` element and the page itself stays empty.

`id=u` and `id=x` are enough to reach the table and the text box from script; the browser exposes them as globals.

---

## The previous version

**October 2026, third pass:** `Lowest.html` 650 bytes, down from 654. The dialog's text no longer has a variable of its own: `j`, which the loop laying out the board already leaves behind, holds the last accepted move, so `for(y='';;` becomes `for(;;`. Rules and moves are unchanged; the one visible difference is that before the first move the dialog shows `63`, the last index of the start string, instead of an empty line.

**October 2026, second pass:** 911, 722 and 654 bytes, down from 924, 740 and 665. Rules, input and output are unchanged; the bytes come from the rule optimizations of FideLite's new engine, as far as each pays in its own file, and from the name search described under *Packing*. All three close the pawn branch with `?…:0` and `>b[f]` instead of `&&(…)` and `&!b[f]`. All three now make the rook hop from `U`'s return value, `d-8?d-1024?8:Q:U(r,Q)`. Only `Lowest.html` lays out the starting position with `for(j in s=…)` instead of a `.map()` and writes the castling test as `…?0:S()` instead of `!(…)&S()`: in the packed files both cost bytes, because `.map((p,` and `!(` are repeats the packer was already compressing. In `Lowest.html` and `minimal.html` the `+3` that turns the promotion digit into a piece code moved from the driver into `U`: `p+3|t` there and `k&3` in the call (`x.value&3` in `minimal.html`), instead of `p|t` and `(k&3)+3`. In `index.html` the legality test copies the board as `b=[...q=b]` instead of `q=b,b=[...b]`. `Lowest.html` also lost two bytes in its driver: the move is played in the update clause of the `for`, which saves a comma, and the mover's-piece test reads `b[i]&8^t||…` instead of `…&&~b[i]&8^t&&…`.

Until October 2026 the three builds ran on a 64-square engine of their own, at 996, 791 and 709 bytes; the 0x88 rewrite brought them to 924, 740 and 665. The 0x88 rule code of FideLite's `L1` builds turned out shorter, and the old files remain in the git history. Besides the sizes, a few things changed on the way:

- **`index.html`:** the game-over board turns white instead of tan. A click that is not a move selects the clicked square.
- **`minimal.html`:** the promotion digits are now `1` knight, `2` rook, `3` bishop (they were `1` rook, `2` bishop, `3` knight). The en passant square is a variable now, so no ghost code appears on the board.
- **`Lowest.html`:** squares are written as rank and file (`1434`) instead of 00–63 (`1228`). The promotion digit follows the same modulo-4 reading as `minimal.html` (it used to be `0` bishop, `1` rook, `2` knight).

## More

The engine's design, the full rule coverage and a line-by-line walkthrough of the larger builds are at **[fidelite.art](https://www.fidelite.art/)**.

---
---

<a id="turkce"></a>

# chessinbytes (Türkçe)

Baytlar içinde iki kişilik satranç. Üç sürüm, her biri 1 KB'nin altında tek bir HTML dosyası: kütüphane yok, derleme adımı yok, sunucu yok. Birini indirin, çift tıklayın, oynayın.

| dosya | boyut | nasıl oynanır |
| ----- | ----- | ------------- |
| `index.html` | **911 B** | tahtaya tıklanarak; taş karakterleri, tahta her hamleden sonra döner, terfi seçici, üç kat büyük çizilir |
| `minimal.html` | **722 B** | tahtaya tıklanarak; taşlar onaltılık rakamlarla gösterilir, terfi taşı bir kutuya yazılır |
| `Lowest.html` | **650 B** | hamleler bir pencereye sayı olarak yazılır; tahta hiç yok |

Üçü de aynı kuralları uygular: tam yasallık kontrolü, tüm koşullarıyla rok, geçerken alma, her taşa terfi. Üçü de [FideLite](https://github.com/cuneytinann/FideLite)'ın `L1` sürümlerinin 0x88 kural koduyla çalışır.

[Golfstack](https://www.fidelite.art/) projesinin bir parçasıdır.

## Oyna

- [cuneytinann.github.io/chessinbytes](https://cuneytinann.github.io/chessinbytes/) — `index.html`
- [cuneytinann.github.io/chessinbytes/minimal.html](https://cuneytinann.github.io/chessinbytes/minimal.html) — `minimal.html`
- [cuneytinann.github.io/chessinbytes/Lowest.html](https://cuneytinann.github.io/chessinbytes/Lowest.html) — `Lowest.html`
- Aynı dosyalar proje sitesinde, [özel sürümler](https://www.fidelite.art/tr#special) arasında da duruyor.

Hedeflenen sınır 1.024 bayt. `index.html` onun 113 bayt altında kalıyor.

---

## Kurallar

Kurallar üç dosyada da aynıdır.

- **Tam yasallık kontrolü.** Her hamle tahtanın bir kopyasında oynanır; hamleyi yapanın kendi şahını tehdit altında bırakıyorsa reddedilir.
- **Rok, tüm koşullarıyla.** Şah da kale de hiç oynamamış olmalı, aralarındaki kareler boş olmalı. Şah şah altında olmamalı, saldırı altındaki bir kareden geçmemeli ve böyle bir kareye inmemeli. "Hiç oynamamış" bilgisi dokunulan karelerin defterinde tutulur: her hamle dokunduğu iki kareyi işaretler, rok için hem şahın hem kalenin karesine hiç dokunulmamış olmalıdır. Dokunulmamış bir köşede hâlâ ilk kale durur, bu yüzden kale ayrıca denetlenmez. Piyonun çift adımı da aynı deftere bakar: dokunulmamış bir piyon hâlâ başlangıç yatayındadır.
- **Geçerken alma**, yalnızca çift adımın hemen ardından gelen hamlede.
- **Terfi** vezire, kaleye, file ya da ata.

**İçinde olmayanlar:** saat yok, 50 ya da 75 hamle kuralı yok, tekrar sayımı yok, ölü pozisyon testi yok, beraberlik teklifi yok, sonuç kodları yok, bot yok. Mat ile pat birbirinden ayırt edilmez. Tüm bunları içeren eksiksiz FIDE hakemi için [fidelite.art](https://www.fidelite.art/tr) adresine bakın.

---

## `index.html`

- **Önce taşa, sonra hedef kareye tıklayın.** Yasal bir hamle olmayan tıklama, bunun yerine tıklanan kareyi seçer. Bu yüzden yanlış bir tıklama seçimi düşürür; taşa yeniden tıklamak gerekir.
- **Taş karakterleri**, Unicode `U+2654`–`U+265F`. Kaynakta `\u` kaçışlarıyla yazıldıkları için dosya saf ASCII'dir; tarayıcı hangi karakter kodlamasını varsayarsa varsaysın doğru görünür.
- **Tahta döner:** her hamleden sonra sırası gelen tarafın bakış açısına geçer.
- **Seçicili terfi.** Bir piyon son yataya ulaştığında tahtanın üstünde dört düğme belirir: vezir, kale, fil, at. Hamle bunlardan birine tıklanınca tamamlanır; o zamana kadar tahtaya yapılan tıklamalar yok sayılır.
- **Oyun sonu göstergesi.** Sırası gelen tarafın yasal hamlesi kalmadığında tahta rengini kaybeder ve bütün kareler beyaza döner. Tek bir test hem matı hem patı kapsar.
- **Kendiliğinden büyük.** Tabloda `style=zoom:3` var; her kare üç kat büyük, ekranda 72×72 piksel çizilir. Tarayıcının kendi yakınlaştırması da bunun üstüne çalışır. `zoom` bir süredir CSS'in parçası; Firefox 126. sürümden beri destekliyor. Daha eski bir tarayıcı onu yok sayar ve tahtayı özgün boyutunda gösterir.

## `minimal.html`

Aynı kurallar; arayüz, oynamak için gerekene kadar kısılmış.

- **Önce taşa, sonra hedef kareye tıklayın**, seçim kuralı aynı.
- **Taş karakteri yok.** Her kare taş kodunu onaltılık bir rakam olarak gösterir. `0` boş karedir. Önce oynayan tarafta `1` piyon, `2` şah, `3` vezir, `4` at, `5` kale ve `6` fil; diğer tarafta `9` piyon, `a` şah, `b` vezir, `c` at, `d` kale ve `e` fil.
- **Sabit yön.** Önce oynayan taraf alttadır, tahta dönmez.
- **Seçicisiz terfi.** Taş, hamle yapıldığı anda tahtanın üstündeki metin kutusundan okunur; rakamın 4'e bölümünden kalan alınır: `1` at, `2` kale, `3` fil. `0`, boş kutu ya da rakam olmayan her şey vezir verir. Hamle hemen tamamlanır.
- **Gösterge yok.** Sırası gelen tarafın yasal hamlesi kalmadığında tıklamalar yalnızca bir şey yapmaz.

Terfi taşı için en ucuz denetim metin kutusu. Dört kodu tutan bir `<select>` dosyayı 771 bayta, dört düğme de 804 bayta çıkarıyor.

## `Lowest.html`

Aynı kurallar, tahtasız. Arayüzün tamamı tek bir `prompt()` penceresi.

- **Tahta yok.** Hiçbir şey çizilmez. Pencere son kabul edilen hamleyi yazıldığı gibi gösterir, başka bir şey göstermez; ilk hamleden önce, tahtayı yerleştiren döngünün `j`'de bıraktığı `63`'ü gösterir. Pozisyonu akılda tutmak oyunculara kalır.
- **Hamleler sayıyla.** Dört rakam önce çıkış karesini, sonra varış karesini verir. Her kare önce yatay, sonra dikey olarak yazılır, ikisi de 0'dan sayılır: a1 `00`, h1 `07`, a8 `70`, h8 `77`. `e2e4`, `1434` olur. Rok şahın hamlesiyle yazılır: beyaz için `0406` ve `0402`, siyah için `7476` ve `7472`. Geçerken almada piyonun gerçekten vardığı kare yazılır.
- **Terfi beşinci karakterden**, `minimal.html`'in kutusundaki gibi 4'e bölümünden kalanla okunur: `1` at, `2` kale, `3` fil; başka herhangi bir şey ya da hiçbir şey vezir verir. Beşinci karakterden sonrası yok sayılır.
- **Girdi nasıl okunur.** Eksik bir karakter ya da rakam olmayan bir karakter `0` sayılır. Bu yüzden `1`, `1000` (a2'den a1'e) diye okunur ve o hamle yasalsa oynanır. `8` ile `9` tahtanın dışını gösterir; bu rakamlarla yazılan bir kareden yasal hamle çıkmaz.
- **Hiçbir şey sesli reddedilmez.** Yanlış tarafın hamlesi, kurala aykırı bir hamle, boş satır ya da İptal: her durumda pencere aynı metinle geri gelir.
- **Bitiş yok.** Sırası gelen tarafın yasal hamlesi kalmadığında, yani mat ya da patta, her girdi reddedilir ve pencere son hamleyi göstermeye devam eder. Döngü hiç sona ermez; durdurmak için sekmeyi kapatın.
- **Paketlenmemiş, ayrı bir kaynağı da yok.** Dosya, bir `<script>` öğesinin içindeki programın kendisi; açılacak bir şey yok. Bu boyda paketleme kendini ödemiyor. RegPack tekrarları buluyor: 16 tokenle kodlanmış dizesi 585 bayt, 633 baytlık kaynaktan 48 bayt kısa. Ama onu açan döngü, `for(_='…';G=/[…]/.exec(_);)with(_.split(G))_=join(shift());eval(_)`, tek başına 67 bayt tutuyor; bu yüzden *Paketleme* bölümünde sayılan 2.673 ayarın hepsinde, 5.0.1'de de 5.0.4'te de, paketlenmiş en kısa hâl 652 bayt: kaynaktan 19 bayt uzun. RegPack da kaynağı olduğu gibi geri veriyor. Kolmogorov'un diliyle: kendini açan dosya, programın kendi çözücüsünü de taşımak zorunda olan bir tarifi; burada daha kısa tarif düz kaynağın kendisi.

---

## Dosyalar

| dosya | boyut | ne |
| ----- | ----- | -- |
| `index.html` | 911 B | oyun, paketlenmiş ve oynanabilir |
| `chess.js` | 1.099 B | paketlenmemiş kaynak kodu, tek satır |
| `minimal.html` | 722 B | sadeleştirilmiş sürüm, paketlenmiş ve oynanabilir |
| `minimal.js` | 760 B | paketlenmemiş kaynak kodu, tek satır |
| `Lowest.html` | 650 B | en küçük sürüm: kaynağın kendisi, bir `<script>` öğesinde |
| `pack.js` | 1.728 B | iki paketli dosyayı kaynaklarından yeniden üretir ve bayt bayt karşılaştırır |

## Motor

**Tahta** bir 0x88 dizisidir: kare = 16 × yatay + dikey; a1 = 0, h8 = 119. 3. biti 1 olan her indis tahtanın dışındadır ve hiç yazılmaz. Bu yüzden dizi seyrektir ve tahta çizilirken `map` boşlukları atlar. Başlangıç pozisyonu tek bir dizedir: `` `dcebaecd${10n**40n-10n**32n}1111111154632645` ``. BigInt ifadesi sekiz tane 9 ve otuz iki tane 0 yazar; bunlar beyaz piyonlar ve boş orta alandır. `b[j*2-j%8]` ardından 64 onaltılık rakamı 0x88 karelerine dağıtır.

**Taş kodları** `1` piyon, `2` şah, `3` vezir, `4` at, `5` kale ve `6` fildir; diğer renk için 8 eklenir. `index.html`'de +8 beyazdır. `minimal.html`'de önce oynayan taraf +8'siz olandır. Dizi 0 numaralı indisten başlayarak sol üstten çizildiği için o taraf altta başlar.

**Dört parça kod:**

- `G(i,f,m)`, `i`'deki taşın `f`'ye ulaşıp ulaşamayacağına bakar; `m` saldırı kipine geçirir. Yön `f−i` üzerindeki aritmetikten çıkar: 1, 15, 16 ya da 17'lik bir adım ve özyinelemeli bir ışın tarayıcı `S`. Atın hamlesi `d*d%765%128==68` ile tanınır.
- `T(x)`, `x` karesinin rakip tarafından tehdit edilip edilmediğine bakar. Varsayılan `x`, hamleyi yapanın şahıdır.
- `U(i,f)`, hamleyi tahtada oynar. Rokta kaleyi taşır, geçerken alınan piyonu kaldırır ve yeni geçerken alma karesini döndürür.
- Yasallık testi hamleyi bir kopyada oynar ve `T()` evet derse reddeder.

Yasallık testi hiçbir dosyada ayrı bir fonksiyon değildir; kullanıldığı yerde açık yazılır. `index.html`'de bu iki yer: tıklama işleyicisi ve oyun sonu testi. Taş dizesi de iki kullanımında açık yazılıdır. `minimal.html`'de `T` üç kullanımında da açık yazılıdır. Kaynak her seferinde büyür, ama RegPack tekrar eden metni bir kez saklar; bu yüzden paketli dosya, adına ve çağrılarına ayrıca ödeme gerektiren bir takma ada göre kısa çıkar.

**Dokunulan kareler defteri** dosyanın zaten sahip olduğu bir nesnede tutulur. İki DOM sürümünde bu nesne `u` tablo öğesidir, `Lowest.html`'de ise `G` fonksiyonunun kendisi.

Yukarıdaki adlar `Lowest.html`'inkiler. `chess.js` ve `minimal.js`'te harfler paketleyici için taşındı; aynı fonksiyonlar ve parametreler orada başka adlar taşıyor. Hangi adın neye dönüştüğü *Paketleme* bölümündeki tabloda.

Bu kural kodu FideLite'ın `L1` sürümlerininkidir; [fidelite.art](https://www.fidelite.art/tr#levels) onu satır satır anlatır.

## Paketi açma

`index.html` ve `minimal.html` kendi kendini açar. Her betik, `eval(_)` ile biten bir RegPack açma döngüsüdür. Paketlenmemiş kaynak kodu elde etmek için bu çağrıyı değiştirin:

```js
eval(_)   →   console.log(_)
```

Döngünün kendisi hiçbir oyun kodu çalıştırmaz, bu yüzden bunu Node'da yapmak güvenlidir. Bu depodaki `chess.js` ve `minimal.js` tam olarak bu işlemin çıktısıdır. RegPack'in kullandığı simge karakterleri denetim karakterleridir (`0x01`–`0x1B`); dosyaların parçasıdırlar.

## Paketleme

[RegPack 5.0.1](https://github.com/Siorki/RegPack). Aşağıdaki ayarlar iki paketli dosyayı da kaynaklarından **bayt bayt aynı** şekilde yeniden üretir; RegPack 5.0.4 de aynı çıktıyı verir.

| seçenek | `index.html` | `minimal.html` |
| ------- | ------------ | -------------- |
| `reassignVars` | `false` | `false` |
| `crushGainFactor` | `0.125` | `0` |
| `crushLengthFactor` | `0.25` | `0.25` |
| `crushCopiesFactor` | `0` | `0.125` |
| `crushTiebreakerFactor` | `-1` | `-1` |
| `withMath` | `false` | `false` |
| `wrapInSetInterval` | `false` | `false` |
| `useES6` | `true` | `true` |

İkisinde de kazanan aşama 2, yani regexp karakter sınıfı aşamasıdır. Bayt düzeni:

```
41 B  <center><table id=u style=zoom:3><script>     32 B  <input id=x><table id=u><script>     8 B  <script>
861 B  paketlenmiş yük                              681 B  paketlenmiş yük                     633 B  kaynak, paketsiz
 9 B  </script>                                      9 B  </script>                            9 B  </script>
----                                                ----                                       ----
 911 B                                              722 B                                      650 B
```

Yeniden üretmek için:

```
npm install regpack@5.0.1
node pack.js --check    # depodaki dosyalarla karşılaştırır
node pack.js            # index.html ve minimal.html dosyalarını yeniden yazar
```

`regpack` komut satırını kullanıyorsanız `--no-reassignVars` yazın. `--reassignVars false` biçiminde yazılan değer `"false"` metni olarak gelir, doğru sayılır ve değişkenler yeniden adlandırılır.

**Kaynaklar nasıl seçildi.** Her kaynak, eşdeğer yazılışlar üzerinde yapılan bir taramanın kazananıdır: değişken adları, tanımların ve işlenenlerin sırası, taş dizesinin kaçış biçimi, bir karenin özniteliklerinin sırası, fonksiyonların tutulması ya da her kullanımda açık yazılması ve daha fazlası. Her aday 2.673'e varan crush ayarıyla paketlendi: gain 0–1 sekizde birlik adımlarla, length −1–1,5 çeyreklik adımlarla, copies 0–1 sekizde birlik adımlarla, tiebreaker −1, 0 ya da 1.

**Ekim 2026: adlar aramayla taşındı.** Ekim motor güncellemesiyle `chess.js` ve `minimal.js`'teki adlar bir kez daha, bu sefer makineyle arandı. Her global ve her parametre her küçük harfte, `_` ve `$`'da denendi. Bir taşıma ancak dosya daha küçük paketleniyorsa ve her tanımlayıcı hâlâ öncekiyle aynı değişkene işaret ediyorsa tutuldu; bu, her taşımadan sonra kaynak yeniden ayrıştırılarak denetlendi. Tekli taşımalar ve ikili takaslar, ikisi de bir şey bulamayana dek sırayla döndü. İşaretlemenin eriştiği adlar yerinde kaldı: tablonun ve metin kutusunun kimlikleri `u` ve `x`, bir de üretilen `onclick` özniteliklerinin adıyla çağırdığı `b`, `Y`, `F` ve `K`. `Lowest.html` paketlenmediği için adları nerede olursa olsun aynı bayta mal oluyor; ona dokunulmadı. Taşınanlar:

| dosya | önce | şimdi | ne |
| ----- | ---- | ----- | -- |
| `chess.js` | `r` | `p` | rokta kalenin karesi |
| `chess.js` | `z` | `d` | sıradaki tarafın yasal hamlesi var mı; tahta yalnız o zaman renkli |
| `chess.js` | `S` (`G`) | `d` | ışın tarayıcı |
| `chess.js` | `d` (`G`) | `w` | `f−i` |
| `chess.js` | `j` (başlangıç dizesi) | `w` | başlangıç dizesindeki rakamın sırası |
| `minimal.js` | `D` | `s` | hamle denetlenirken tutulan yeni geçerken alma karesi |
| `minimal.js` | `P`, `d` (`G`) | `d`, `j` | taş türü, `f−i` |
| `minimal.js` | `p`, `P` (`U`) | `m`, `s` | terfi taşı, taş türü |
| `minimal.js` | `_`, `w` (`F`) | `f`, `j` | kullanılmayan parametre, çizilen kare |

Kaynağı kısaltmak paketi güvenilir biçimde kısaltmaz, çünkü paketleyici kazancını tekrar eden alt dizelerden elde eder. Bu paragraftaki ve bir sonrakindeki rakamlar, kaynakların Ekim güncellemesinden önceki hâlinde ölçüldü. Bunun en açık örneği `index.html`'in taş dizesi. Ham UTF-8 karakterlerle yazıldığında kaynak 72 bayt kısalıyor (1.106 yerine 1.034), ama dosya 5 bayt uzuyor (924 yerine 929). Sebebi, kaçışlı biçimdeki `\u265` öneklerinin tek bir simgeye sıkışması. Yasallık testini ve taş dizesini iki kullanımlarında da açık yazmak `index.html`'i 931'den 924 bayta indirdi. `minimal.html`'de `T`'yi açık yazmak kaynağı 53 bayt uzatıyor, dosyayı 1 bayt kısaltıyor. Aynı hamle her yerde kazandırmıyor: `index.html`'de `T`'yi açmak bir şey kazandırmıyor; `Lowest.html`'de ise RegPack'in kaynağı ilk kez geçmesini sağlıyor, ama ancak 669 bayta kadar.

**Denenip bırakılan: geçerken alma hayaleti.** Önceki sürüm geçerken alma karesini tahtanın kendisinde, bir hayalet taş kodu olarak tutuyordu ve `e` değişkeni yoktu. Aynı fikir burada da çalışıyor; hayalet `-8` olarak yazılıyor. Işın tarayıcı onu boş, piyon alınabilir bir taş sayıyor. `-0.5` olmuyor, çünkü bit işlemi `m|b[f]` onu 0'a kırpıyor. Ama üç dosyada da bayta mal oluyor: `Lowest.html` 687 (+22), `minimal.html` 753 (+13), `index.html` 936 (+12). Bu kural kodu geçerken almayı `e` ile zaten ucuza çözüyor, hayaletin ise her hamleden sonra tahtadan silinmesi gerekiyor.

## Doğrulama

- **Başlangıç pozisyonundan perft**, üç dosyanın motorunda da yayımlanmış değerleri veriyor: 20, 400, 8.902, 197.281 ve 4.865.609 (derinlik 1–5).
- **Her dosya gerçek girişleriyle sürüldü:** kare tıklama işleyicileri, terfi satırı, metin kutusu ve `prompt()` cevapları, hem Node'da hem Chromium'da. Her yarım hamlede arayüzün kabul ettiği hamle kümesi bağımsız bir referans hamle üreticisiyle karşılaştırıldı.
- **Kapsanan pozisyonlar** 402 hedefli pozisyon ve birkaç yüz rastgele oyun. Hedefli pozisyonlar arasında şahı şah altından geçiren, şah altına sokan ve şah altındayken yapılan roklar; daha önce kaybedilmiş rok hakları; süresi geçmiş ve açmaza düşmüş olanlar dahil geçerken almalar; alışlı terfiler ve alt terfiler dahil terfiler; mat ve pat var. Tek bir hamle bile farklı çıkmadı.
- **650 baytlık `Lowest.html`** 654 baytlık sürümle kendi `prompt()`'u üzerinden karşılaştırıldı: 20 oyun, aralarında boş satır, İptal ve anlamsız girdi bulunan 1.513 cevap, bunların 1.258'i yasal hamle. Tahta, sıradaki taraf, geçerken alma karesi ve dokunulan kareler defteri hiç ayrışmadı; pencere metni yalnız ilk hamleden önce farklıydı, boş satır yerine `63`.
- **Ekim 2026 güncellemesi** önceki dosyalarla, kendi gerçek girişleri üzerinden, rok, geçerken alma ve terfi öne çıkarılarak karşılaştırıldı: `Lowest.html` 120 oyun ve aralarında boş satır, İptal, anlamsız girdi ve beşinci karakter bulunan 24.890 `prompt()` cevabı; `index.html` 60 oyun ve karelere ve terfi düğmelerine 12.335 tıklama; `minimal.html` 60 oyun ve her birinden önce metin kutusuna yeni bir değer yazılarak 13.376 tıklama. Her girdiden sonra pencere metni ya da çizilen tablo, tahta ve dokunulan kareler defteri karşılaştırıldı: fark yok. Başlangıç pozisyonundan 4. derinliğe perft üç motorda da 197.281 veriyor. `node pack.js --check` üç dosyayı da bayt bayt yeniden kuruyor; RegPack 5.0.1 ile 5.0.4 aynı sonucu veriyor.

---

## Bilinçli olarak eski usul

İşaretleme baştan sona eski usul yazılmıştır, çünkü eski usul daha kısadır: `<center>`, karede `bgcolor`, `width` ve `height`, tırnaksız öznitelik değerleri, kapanış etiketi yok, `<html>`, `<head>` ya da `<body>` hiç yok. Tek CSS parçası `index.html`'deki tablonun `style=zoom:3`'ü: kareleri ve taşları birlikte ölçekleyen tek bir öznitelik.

Doctype da yok; bu da sayfayı bilerek **quirks mode**'a sokar. Görünümle ilgili özniteliklerin hâlâ işlemesini sağlayan budur.

- **`index.html`'in kareleri `<td>`, her birinde bir `<center>`.** Quirks mode'da bir tablo `text-align` değerini üst öğelerinden devralmaz, bu yüzden dıştaki `<center>` tek başına taşları ortalamaya yetmez. `<th>` onları bedavaya ortalardı ama kalın çizer. `minimal.html` `<th>` kullanır; orada kalın rakamların zararı yok.
- **Açık renkli bir kare** boş değerli bir `bgcolor` alır (`bgcolor=>`), bu da renk çizmez.
- **`index.html`'in terfi seçicisi**, dört `<button>` tutan bir `<caption>`'dır; hiçbiri kapatılmaz, her yeni `<button>` bir öncekini kapatır.
- **`<table>` hiç kapatılmaz** ve `<script>` onun içinde durur. Betik tabloyu doldurur ve kendini onunla değiştirir.

`minimal.html` buna kapatılmamış bir `<input id=x>` ekler. `Lowest.html` bu yolun sonuna gider: dosya tek bir `<script>` öğesinden ibarettir ve sayfanın kendisi boş kalır.

Tabloya ve metin kutusuna betikten ulaşmak için `id=u` ve `id=x` yeterlidir; tarayıcı onları global değişken olarak sunar.

---

## Önceki sürüm

**Ekim 2026, üçüncü geçiş:** `Lowest.html` 654 bayttan 650 bayta. Pencerenin metni artık kendi değişkeninde tutulmuyor: son kabul edilen hamleyi, tahtayı yerleştiren döngünün zaten geride bıraktığı `j` tutuyor; böylece `for(y='';;` `for(;;` oluyor. Kurallar ve hamleler aynı; görünen tek fark, ilk hamleden önce pencerenin boş satır yerine başlangıç dizesinin son indisi olan `63`'ü göstermesi.

**Ekim 2026, ikinci geçiş:** 924, 740 ve 665 bayttan 911, 722 ve 654 bayta. Kurallar, girdi ve çıktı aynı; baytlar FideLite'ın yeni motorunun kural optimizasyonlarından, her birinin kendi dosyasında kazandırdığı ölçüde, ve *Paketleme* bölümünde anlatılan ad aramasından geliyor. Üçü de piyon dalını `&&(…)` ve `&!b[f]` yerine `?…:0` ve `>b[f]` ile kapatıyor. Kale sıçraması üçünde de artık `U`'nun dönüş değerinde duruyor: `d-8?d-1024?8:Q:U(r,Q)`. Başlangıç konumunu `.map()` yerine `for(j in s=…)` ile yerleştirmek ve rok testini `!(…)&S()` yerine `…?0:S()` diye yazmak yalnız `Lowest.html`'de var: paketli dosyalarda ikisi de bayta mal oluyor, çünkü `.map((p,` ile `!(` paketleyicinin zaten sıkıştırdığı tekrarlar. `Lowest.html` ve `minimal.html`'de terfi rakamını taş koduna çeviren `+3` sürücüden `U`'ya taşındı: `(k&3)+3` ve `p|t` yerine çağrıda `k&3` (`minimal.html`'de `x.value&3`), orada `p+3|t`. `index.html`'de yasallık testi tahtayı `q=b,b=[...b]` yerine `b=[...q=b]` diye kopyalıyor. `Lowest.html` sürücüsünde de iki bayt kaybetti: hamle `for`'un güncelleme kısmında oynanıyor, bu bir virgülü düşürüyor; hamleyi yapanın taşı testi de `…&&~b[i]&8^t&&…` yerine `b[i]&8^t||…` diye okunuyor.

Ekim 2026'ya kadar üç sürüm kendilerine ait 64 karelik bir motorla çalışıyordu: 996, 791 ve 709 bayt; 0x88'e geçiş onları 924, 740 ve 665'e indirdi. FideLite'ın `L1` sürümlerinin 0x88 kural kodu daha kısa çıktı; eski dosyalar git geçmişinde duruyor. Boyutların yanında yolda birkaç şey değişti:

- **`index.html`:** Oyun sonunda tahta tan yerine beyaza dönüyor. Hamle olmayan bir tıklama tıklanan kareyi seçiyor.
- **`minimal.html`:** Terfi rakamları artık `1` at, `2` kale, `3` fil (önceden `1` kale, `2` fil, `3` at). Geçerken alma karesi artık bir değişken, bu yüzden tahtada hayalet kodu görünmüyor.
- **`Lowest.html`:** Kareler 00–63 (`1228`) yerine yatay ve dikey olarak (`1434`) yazılıyor. Terfi rakamı `minimal.html`'deki 4'e bölümünden kalan okumasını izliyor (önceden `0` fil, `1` kale, `2` at).

## Daha fazlası

Motorun tasarımı, kuralların eksiksiz kapsamı ve daha büyük sürümlerin satır satır açıklaması **[fidelite.art](https://www.fidelite.art/tr)** adresinde.
