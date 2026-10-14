**[English](#chessinbytes)** · **[Türkçe](#turkce)**

# chessinbytes

Two-player chess in bytes. Three builds, each a single HTML file under 1 KB: no libraries, no build step, no server. Download one, double-click, play.

| file | size | how it plays |
| ---- | ---- | ------------ |
| `index.html` | **924 B** | click the board; piece glyphs, the board turns after every move, promotion picker, drawn at three times its size |
| `minimal.html` | **740 B** | click the board; pieces shown as hexadecimal digits, promotion piece typed into a box |
| `Lowest.html` | **665 B** | type moves as numbers into a dialog; no board at all |

All three enforce the same rules: full legality, castling with every condition, en passant, promotion to any piece. They run on the 0x88 rule code of the `L1` builds of [FideLite](https://github.com/cuneytinann/FideLite).

Part of the [Golfstack](https://www.fidelite.art/) project.

## Play

- [cuneytinann.github.io/chessinbytes](https://cuneytinann.github.io/chessinbytes/) — `index.html`
- [cuneytinann.github.io/chessinbytes/minimal.html](https://cuneytinann.github.io/chessinbytes/minimal.html) — `minimal.html`
- [cuneytinann.github.io/chessinbytes/Lowest.html](https://cuneytinann.github.io/chessinbytes/Lowest.html) — `Lowest.html`
- The same files are mirrored on the project site, among the [special builds](https://www.fidelite.art/#special).

The budget is 1,024 bytes. `index.html` stays 100 bytes under it.

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

- **No board.** Nothing is drawn. The dialog shows the last accepted move exactly as it was typed, and nothing else. Keeping the position in mind is up to the players.
- **Moves as numbers.** Four digits give the from-square and then the to-square, each written as its rank and then its file, both counted from 0: a1 is `00`, h1 `07`, a8 `70`, h8 `77`. `e2e4` is `1434`. Castling is written as the king's move: `0406` and `0402` for White, `7476` and `7472` for Black. En passant uses the square the pawn actually lands on.
- **Promotion from a fifth character**, taken modulo 4 as in the box of `minimal.html`: `1` knight, `2` rook, `3` bishop; anything else, or nothing, gives a queen. Characters after the fifth are ignored.
- **How input is read.** A missing character, or one that is not a digit, counts as `0`. So `1` is read as `1000` (a2 to a1) and is played if that move happens to be legal. `8` and `9` point off the board, so a square written with them never makes a legal move.
- **Nothing is ever rejected loudly.** A move for the wrong side, an illegal move, an empty line or Cancel: in every case the dialog comes back with the same text.
- **No ending.** When the side to move has no legal move (checkmate or stalemate), every input is refused and the dialog keeps showing the last move. The loop never exits; close the tab to stop.
- **Not packed.** RegPack finds nothing to gain here: its best output is the source itself. The file is therefore the source inside a `<script>` element.

---

## Files

| file | size | what |
| ---- | ---- | ---- |
| `index.html` | 924 B | the game, packed and playable |
| `chess.js` | 1,106 B | its plain source, one line, unpacked |
| `minimal.html` | 740 B | the reduced build, packed and playable |
| `minimal.js` | 765 B | its plain source, one line, unpacked |
| `Lowest.html` | 665 B | the smallest build, its source in a `<script>` element |
| `Lowest.js` | 648 B | that source, one line |
| `pack.js` | 1,961 B | rebuilds all three HTML files from the sources and checks them byte for byte |

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
874 B  packed payload                               699 B  packed payload                      648 B  source, not packed
 9 B  </script>                                      9 B  </script>                            9 B  </script>
----                                                ----                                       ----
 924 B                                              740 B                                      665 B
```

To rebuild:

```
npm install regpack@5.0.1
node pack.js --check    # compare with the committed files
node pack.js            # rewrite index.html, minimal.html and Lowest.html
```

With the `regpack` command line, pass `--no-reassignVars`. Written as `--reassignVars false`, the value arrives as the string `"false"`, which counts as true, and the variables get renamed.

**How the sources were chosen.** Each source won a search over equivalent spellings: variable names, the order of definitions and of operands, the escape style of the glyph string, the order of a cell's attributes, functions kept or written out at every use, and more. Every candidate was packed under up to 2,673 crush settings: gain 0 to 1 in eighths, length −1 to 1.5 in quarters, copies 0 to 1 in eighths, and a tiebreaker of −1, 0 or 1.

A shorter source does not reliably pack shorter, because the packer pays for repeated substrings. The glyph string of `index.html` shows this most clearly. Written as raw UTF-8 characters it makes the source 72 bytes shorter (1,034 instead of 1,106), yet the file comes out 5 bytes longer (929 instead of 924), because the `\u265` prefixes of the escaped form compress into one token. Writing out the legality test and the glyph string at both their uses took `index.html` from 931 to 924 bytes. Writing out `T` in `minimal.html` makes its source 53 bytes longer and the file 1 byte shorter. The same move does not pay everywhere: `T` written out in `index.html` gains nothing, and in `Lowest.html` it lets RegPack beat the source for the first time, but only down to 669 bytes.

**Tried and dropped: the en passant ghost.** The previous version kept the en passant square on the board itself, as a ghost piece code, and had no `e` variable. The same idea works here, with the ghost written as `-8`: it passes for empty to the ray walker and for a capturable piece to the pawn, and `-0.5` would not do because the bitwise `m|b[f]` truncates it to 0. It costs bytes in all three files, though: `Lowest.html` 687 (+22), `minimal.html` 753 (+13), `index.html` 936 (+12). This rule code already handles en passant cheaply through `e`, and a ghost has to be cleared from the board after every move.

## Verification

- **Perft from the starting position** on the engine of each of the three files gives 20, 400, 8,902, 197,281 and 4,865,609 (depth 1–5), the published values.
- **Every file was driven through its real inputs:** cell click handlers, the promotion row, the text box and `prompt()` answers, both in Node and in Chromium. At every ply the set of moves the interface accepts was compared with an independent reference move generator.
- **The positions covered** were 402 targeted ones and several hundred random games. The targeted positions include castling through, into and out of check; castling rights already lost; en passant, including an expired one and a pinned one; promotions, including captures and underpromotions; and checkmate and stalemate. Not one move differed.

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

Until October 2026 the three builds ran on a 64-square engine of their own, at 996, 791 and 709 bytes; now they are 924, 740 and 665. The 0x88 rule code of FideLite's `L1` builds turned out shorter, and the old files remain in the git history. Besides the sizes, a few things changed on the way:

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
| `index.html` | **924 B** | tahtaya tıklanarak; taş karakterleri, tahta her hamleden sonra döner, terfi seçici, üç kat büyük çizilir |
| `minimal.html` | **740 B** | tahtaya tıklanarak; taşlar onaltılık rakamlarla gösterilir, terfi taşı bir kutuya yazılır |
| `Lowest.html` | **665 B** | hamleler bir pencereye sayı olarak yazılır; tahta hiç yok |

Üçü de aynı kuralları uygular: tam yasallık kontrolü, tüm koşullarıyla rok, geçerken alma, her taşa terfi. Üçü de [FideLite](https://github.com/cuneytinann/FideLite)'ın `L1` sürümlerinin 0x88 kural koduyla çalışır.

[Golfstack](https://www.fidelite.art/) projesinin bir parçasıdır.

## Oyna

- [cuneytinann.github.io/chessinbytes](https://cuneytinann.github.io/chessinbytes/) — `index.html`
- [cuneytinann.github.io/chessinbytes/minimal.html](https://cuneytinann.github.io/chessinbytes/minimal.html) — `minimal.html`
- [cuneytinann.github.io/chessinbytes/Lowest.html](https://cuneytinann.github.io/chessinbytes/Lowest.html) — `Lowest.html`
- Aynı dosyalar proje sitesinde, [özel sürümler](https://www.fidelite.art/tr#special) arasında da duruyor.

Hedeflenen sınır 1.024 bayt. `index.html` onun 100 bayt altında kalıyor.

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

- **Tahta yok.** Hiçbir şey çizilmez. Pencere son kabul edilen hamleyi yazıldığı gibi gösterir, başka bir şey göstermez. Pozisyonu akılda tutmak oyunculara kalır.
- **Hamleler sayıyla.** Dört rakam önce çıkış karesini, sonra varış karesini verir. Her kare önce yatay, sonra dikey olarak yazılır, ikisi de 0'dan sayılır: a1 `00`, h1 `07`, a8 `70`, h8 `77`. `e2e4`, `1434` olur. Rok şahın hamlesiyle yazılır: beyaz için `0406` ve `0402`, siyah için `7476` ve `7472`. Geçerken almada piyonun gerçekten vardığı kare yazılır.
- **Terfi beşinci karakterden**, `minimal.html`'in kutusundaki gibi 4'e bölümünden kalanla okunur: `1` at, `2` kale, `3` fil; başka herhangi bir şey ya da hiçbir şey vezir verir. Beşinci karakterden sonrası yok sayılır.
- **Girdi nasıl okunur.** Eksik bir karakter ya da rakam olmayan bir karakter `0` sayılır. Bu yüzden `1`, `1000` (a2'den a1'e) diye okunur ve o hamle yasalsa oynanır. `8` ile `9` tahtanın dışını gösterir; bu rakamlarla yazılan bir kareden yasal hamle çıkmaz.
- **Hiçbir şey sesli reddedilmez.** Yanlış tarafın hamlesi, kurala aykırı bir hamle, boş satır ya da İptal: her durumda pencere aynı metinle geri gelir.
- **Bitiş yok.** Sırası gelen tarafın yasal hamlesi kalmadığında, yani mat ya da patta, her girdi reddedilir ve pencere son hamleyi göstermeye devam eder. Döngü hiç sona ermez; durdurmak için sekmeyi kapatın.
- **Paketlenmemiş.** RegPack burada kazanacak bir şey bulamıyor: en iyi çıktısı kaynağın kendisi. Bu yüzden dosya, bir `<script>` öğesinin içindeki kaynaktan ibaret.

---

## Dosyalar

| dosya | boyut | ne |
| ----- | ----- | -- |
| `index.html` | 924 B | oyun, paketlenmiş ve oynanabilir |
| `chess.js` | 1.106 B | paketlenmemiş kaynak kodu, tek satır |
| `minimal.html` | 740 B | sadeleştirilmiş sürüm, paketlenmiş ve oynanabilir |
| `minimal.js` | 765 B | paketlenmemiş kaynak kodu, tek satır |
| `Lowest.html` | 665 B | en küçük sürüm, kaynağı bir `<script>` öğesinde |
| `Lowest.js` | 648 B | o kaynak, tek satır |
| `pack.js` | 1.961 B | üç HTML dosyasını kaynaklardan yeniden üretir ve bayt bayt karşılaştırır |

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
874 B  paketlenmiş yük                              699 B  paketlenmiş yük                     648 B  kaynak, paketsiz
 9 B  </script>                                      9 B  </script>                            9 B  </script>
----                                                ----                                       ----
 924 B                                              740 B                                      665 B
```

Yeniden üretmek için:

```
npm install regpack@5.0.1
node pack.js --check    # depodaki dosyalarla karşılaştırır
node pack.js            # index.html, minimal.html ve Lowest.html dosyalarını yeniden yazar
```

`regpack` komut satırını kullanıyorsanız `--no-reassignVars` yazın. `--reassignVars false` biçiminde yazılan değer `"false"` metni olarak gelir, doğru sayılır ve değişkenler yeniden adlandırılır.

**Kaynaklar nasıl seçildi.** Her kaynak, eşdeğer yazılışlar üzerinde yapılan bir taramanın kazananıdır: değişken adları, tanımların ve işlenenlerin sırası, taş dizesinin kaçış biçimi, bir karenin özniteliklerinin sırası, fonksiyonların tutulması ya da her kullanımda açık yazılması ve daha fazlası. Her aday 2.673'e varan crush ayarıyla paketlendi: gain 0–1 sekizde birlik adımlarla, length −1–1,5 çeyreklik adımlarla, copies 0–1 sekizde birlik adımlarla, tiebreaker −1, 0 ya da 1.

Kaynağı kısaltmak paketi güvenilir biçimde kısaltmaz, çünkü paketleyici kazancını tekrar eden alt dizelerden elde eder. Bunun en açık örneği `index.html`'in taş dizesi. Ham UTF-8 karakterlerle yazıldığında kaynak 72 bayt kısalıyor (1.106 yerine 1.034), ama dosya 5 bayt uzuyor (924 yerine 929). Sebebi, kaçışlı biçimdeki `\u265` öneklerinin tek bir simgeye sıkışması. Yasallık testini ve taş dizesini iki kullanımlarında da açık yazmak `index.html`'i 931'den 924 bayta indirdi. `minimal.html`'de `T`'yi açık yazmak kaynağı 53 bayt uzatıyor, dosyayı 1 bayt kısaltıyor. Aynı hamle her yerde kazandırmıyor: `index.html`'de `T`'yi açmak bir şey kazandırmıyor; `Lowest.html`'de ise RegPack'in kaynağı ilk kez geçmesini sağlıyor, ama ancak 669 bayta kadar.

**Denenip bırakılan: geçerken alma hayaleti.** Önceki sürüm geçerken alma karesini tahtanın kendisinde, bir hayalet taş kodu olarak tutuyordu ve `e` değişkeni yoktu. Aynı fikir burada da çalışıyor; hayalet `-8` olarak yazılıyor. Işın tarayıcı onu boş, piyon alınabilir bir taş sayıyor. `-0.5` olmuyor, çünkü bit işlemi `m|b[f]` onu 0'a kırpıyor. Ama üç dosyada da bayta mal oluyor: `Lowest.html` 687 (+22), `minimal.html` 753 (+13), `index.html` 936 (+12). Bu kural kodu geçerken almayı `e` ile zaten ucuza çözüyor, hayaletin ise her hamleden sonra tahtadan silinmesi gerekiyor.

## Doğrulama

- **Başlangıç pozisyonundan perft**, üç dosyanın motorunda da yayımlanmış değerleri veriyor: 20, 400, 8.902, 197.281 ve 4.865.609 (derinlik 1–5).
- **Her dosya gerçek girişleriyle sürüldü:** kare tıklama işleyicileri, terfi satırı, metin kutusu ve `prompt()` cevapları, hem Node'da hem Chromium'da. Her yarım hamlede arayüzün kabul ettiği hamle kümesi bağımsız bir referans hamle üreticisiyle karşılaştırıldı.
- **Kapsanan pozisyonlar** 402 hedefli pozisyon ve birkaç yüz rastgele oyun. Hedefli pozisyonlar arasında şahı şah altından geçiren, şah altına sokan ve şah altındayken yapılan roklar; daha önce kaybedilmiş rok hakları; süresi geçmiş ve açmaza düşmüş olanlar dahil geçerken almalar; alışlı terfiler ve alt terfiler dahil terfiler; mat ve pat var. Tek bir hamle bile farklı çıkmadı.

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

Ekim 2026'ya kadar üç sürüm kendilerine ait 64 karelik bir motorla çalışıyordu: 996, 791 ve 709 bayt; şimdi 924, 740 ve 665. FideLite'ın `L1` sürümlerinin 0x88 kural kodu daha kısa çıktı; eski dosyalar git geçmişinde duruyor. Boyutların yanında yolda birkaç şey değişti:

- **`index.html`:** Oyun sonunda tahta tan yerine beyaza dönüyor. Hamle olmayan bir tıklama tıklanan kareyi seçiyor.
- **`minimal.html`:** Terfi rakamları artık `1` at, `2` kale, `3` fil (önceden `1` kale, `2` fil, `3` at). Geçerken alma karesi artık bir değişken, bu yüzden tahtada hayalet kodu görünmüyor.
- **`Lowest.html`:** Kareler 00–63 (`1228`) yerine yatay ve dikey olarak (`1434`) yazılıyor. Terfi rakamı `minimal.html`'deki 4'e bölümünden kalan okumasını izliyor (önceden `0` fil, `1` kale, `2` at).

## Daha fazlası

Motorun tasarımı, kuralların eksiksiz kapsamı ve daha büyük sürümlerin satır satır açıklaması **[fidelite.art](https://www.fidelite.art/tr)** adresinde.
