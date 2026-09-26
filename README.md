**[English](#chessinbytes)** · **[Türkçe](#turkce)**

# chessinbytes

Two-player chess in bytes. Three builds, each a single HTML file under 1 KB: no libraries, no build step, no server. Download one, double-click, play.

| file | size | how it plays |
| ---- | ---- | ------------ |
| `index.html` | **1,021 B** | click the board; piece glyphs, board flip, promotion picker, drawn at three times its size |
| `minimal.html` | **815 B** | click the board; pieces shown as hexadecimal digits |
| `Lowest.html` | **748 B** | type moves as numbers into a dialog; no board at all |

All three enforce the same rules: full legality, castling with every condition, en passant, promotion to any piece.

Part of the [Golfstack](https://www.fidelite.art/) project.

## Play

- [cuneytinann.github.io/chessinbytes](https://cuneytinann.github.io/chessinbytes/) — `index.html`
- [cuneytinann.github.io/chessinbytes/minimal.html](https://cuneytinann.github.io/chessinbytes/minimal.html) — `minimal.html`
- [cuneytinann.github.io/chessinbytes/Lowest.html](https://cuneytinann.github.io/chessinbytes/Lowest.html) — `Lowest.html`
- [fidelite.art/special/DOM_1021.html](https://www.fidelite.art/special/DOM_1021.html) — same file as `index.html`, mirrored on the project site under `special`
- [fidelite.art/special/DOM_minimum.html](https://www.fidelite.art/special/DOM_minimum.html) — same file as `minimal.html`

The name of the budget: 1,024 bytes. `index.html` lands 3 bytes under it; the other two stay well below.

**Zoomed in by itself.** In `index.html` the cells are 22×24 px, which is tiny on a modern display, so the table carries `style=zoom:3` and the board is drawn at three times its size, 66×72 px a cell. That costs **13 bytes**, all of them in the HTML shell outside the packed payload — the packer never sees them, and the payload is byte for byte what it was at 1,008. The browser's own zoom still works on top of it — `Ctrl` `+`, or `⌘` `+` on macOS; `Ctrl` `0` resets it. Nothing breaks on the way up: the cells are sized in HTML attributes and the pieces are text glyphs, so the whole board scales cleanly at any zoom level. `zoom` was a non-standard property for a long time; it is part of CSS today and Firefox supports it from version 126. An older browser simply ignores it and shows the board at its original size.

---

## What's in it

This section describes `index.html`. The two smaller builds are described below by what they change.

- **All piece movement**, geometry derived from arithmetic — no direction tables, no offset arrays.
- **Full legality.** A move that leaves your own king in check is never accepted. Every candidate is played on a cloned board and the king is queried.
- **Castling**, both sides, with every condition: rights still held, rook path clear, king not in check, king not crossing an attacked square.
- **En passant**, implemented as a *ghost*: the capture square is written into the board array itself as piece code `1`, which renders blank. There is no `e` state variable.
- **Promotion with a picker.** Queen, rook, bishop, knight; the move isn't completed until you choose.
- **Board flip.** After each move the board turns to the perspective of the side to move.
- **Game-over indicator.** When the side to move has no legal move, every square turns brown. That single test covers checkmate and stalemate alike, so no separate mate detection is written.

## What's not in it

No clock, no 50-move rule, no repetition counter, no insufficient-material test, no draw offers, no result codes, no bot. Mate and stalemate are not told apart — in `index.html` and `minimal.html` both simply end the game, and in `Lowest.html` the game does not end at all. For the full FIDE arbiter with all of that, see [fidelite.art](https://www.fidelite.art/).

---

## `minimal.html`

The same rule set with the interface cut back to what is needed to play.

**Kept:** full legality, castling with every condition, en passant as a ghost, promotion to any piece.

**Changed or dropped:**

- **Promotion without a picker.** The piece is read from the text box above the board when the move is made: `1` rook, `2` bishop, `3` knight; empty or `q` queen. The move completes at once.
- **No glyphs.** Each cell shows the piece code as a hexadecimal digit: `0` empty, `1` the en passant ghost (visible here), `2`–`d` the pieces.
- **Fixed orientation.** The board does not flip. The array is drawn from index 0 at the top-left, so the side to move first starts at the bottom and plays with the even codes (`8` pawn, `4` rook, `c` knight, `2` bishop, `6` queen, `a` king); the other side has the odd ones.
- **No indicators.** No game-over colour, no highlighting. When the side to move has no legal move, clicks simply do nothing; checkmate and stalemate are not told apart.

---

## `Lowest.html`

The same rule set with no board at all. The whole interface is one `prompt()` dialog.

**Kept:** full legality, castling with every condition, en passant as a ghost, promotion to any piece.

**Changed or dropped:**

- **No board.** Nothing is drawn. The dialog shows the last move, exactly as it was typed, and nothing else; keeping the position in mind is up to the players.
- **Moves as numbers.** Four digits: the from-square, then the to-square, each written as two digits from `00` to `63` — a1 is `00`, h1 `07`, a8 `56`, h8 `63`. `e2e4` is `1228`. Castling is written as the king's move: `0406` and `0402` for White, `6062` and `6058` for Black. En passant uses the square the pawn actually lands on.
- **Promotion from a fifth digit.** `0` bishop, `1` rook, `2` knight; anything else, or nothing, queen. Characters after the fifth are ignored.
- **Nothing is ever rejected loudly.** A move for the wrong side, an illegal move, letters, an empty line, Cancel: the dialog comes back with the same text.
- **No ending.** The game has no finished state. When the side to move has no legal move — checkmate or stalemate — every input is refused and the dialog keeps showing the last move. The loop never exits; close the tab to stop.

---

## Files

| file | size | what |
| ---- | ---- | ---- |
| `index.html` | 1,021 B | the game, packed and playable |
| `chess.js` | 1,151 B | its plain source, one line, unpacked |
| `minimal.html` | 815 B | the reduced build, packed and playable |
| `minimal.js` | 855 B | its plain source, one line, unpacked |
| `Lowest.html` | 748 B | the smallest build, packed and playable |
| `Lowest.js` | 788 B | its plain source, one line, unpacked |
| `pack.js` | 1,761 B | rebuilds all three HTML files from the sources and checks them byte for byte |

## Unpacking

All three HTML files are self-extracting. Each script is a RegPack decompression loop ending in `eval(_)`. To recover the plain source, replace that call:

```js
eval(_)   →   console.log(_)
```

The loop itself runs no game code, so this is safe to do in Node. `chess.js`, `minimal.js` and `Lowest.js` in this repo are exactly what comes out.

## Packing

[RegPack 5.0.1](https://github.com/Siorki/RegPack). These settings reproduce all three files **byte for byte** from their sources (RegPack 5.0.4 gives the same output):

| option | `index.html` | `minimal.html` | `Lowest.html` |
| ------ | ------------ | -------------- | ------------- |
| `reassignVars` | `false` | `false` | `false` |
| `crushGainFactor` | `1` | `1` | `0` |
| `crushLengthFactor` | `0.5` | `-0.5` | `0.5` |
| `crushCopiesFactor` | `1` | `0.75` | `0.5` |
| `crushTiebreakerFactor` | `0` | `-1` | `0` |
| `withMath` | `false` | `false` | `false` |
| `wrapInSetInterval` | `false` | `false` | `false` |
| `useES6` | `true` | `true` | `true` |

In all three, the winning stage is 2, the regexp character class. Byte layout:

```
41 B  <center><table id=T style=zoom:3><script>     32 B  <input id=p><table id=T><script>     8 B  <script>
971 B  packed payload                               774 B  packed payload                      731 B  packed payload
 9 B  </script>                                      9 B  </script>                            9 B  </script>
----                                                ----                                       ----
1021 B                                              815 B                                      748 B
```

To rebuild:

```
npm install regpack@5.0.1
node pack.js --check    # compare with the committed files
node pack.js            # rewrite index.html, minimal.html and Lowest.html
```

With the `regpack` command line, pass `--no-reassignVars`. Written as `--reassignVars false`, the value arrives as the string `"false"`, which counts as true, and the variables get renamed.

Only the script is packed; the HTML shell is not. Note that shortening the source does **not** reliably shorten the output — the packer pays for repeated substrings, so a longer source with more repetition often packs smaller. Several edits in `index.html` are deliberately longer than they need to be for exactly that reason. Of the behaviour-preserving rewrites tried on `chess.js`, none packed smaller and two packed larger, one of them by six bytes. Two later ones say the same thing from both sides. Writing `66>>j` instead of `j%5==1` shortens the source by a byte and lengthens the packed output by one — it only comes back to 1,023 with a different crush tuple, which is why the table above no longer reads `0, 0, 0, 0`. Replacing `p%2^g` with `p&1^g` costs nothing in the source and **two bytes** in the output, and no setting recovers them; it was not taken. In `minimal.js` the same substitution on `b[f]%2^t` went the other way and saved one byte, and `o%5==1` → `66>>o` had saved one before it.

`Lowest.js` is the clearest case. Written as plainly as possible, the script is 787 bytes, and packed as it stands it gives a 785-byte file. Three rewrites, each one longer than or as long as what it replaces, bring that down to 766 (before the round described below):

| rewrite | source | packed, alone |
| ------- | ------ | ------------- |
| the alias `a=Math.abs` removed, `Math.abs(` written out at its three uses | +10 B | −4 B |
| the square parameter of `L` and `V` renamed from `u` to `f`, so that `(i,f`, `G(i,f` and `M(i,f` repeat | ±0 B | −9 B |
| en passant as a ghost instead of an `e` variable | +4 B | −6 B |
| all three together | +14 B | **−19 B** |

The effects do not simply add up; each one changes the repeats the others work with. Replacing `p&1^s` with `p%2^s` made no difference here in either direction.

### A later round: letting the ray walker do more

The ray walker `S` already checks every square between two ends and stops by itself off the board (`undefined<2` is false). Two rules were handed over to it, in all three builds:

- **The pawn's double step.** `a<2|a<3&!b[i+f>>1]&66>>j` became `a<2+(j%5==1)&&S()`: a single push reaches its target on the first step, a double push checks the square in between. The ghost cannot sit there — it only ever stands behind the pawn that has just moved, never in front of the side to move's own start rank.
- **Castling.** `c&C(r=i+3.5*k-.5)&&B(r,i)&&!F(g,i)&!F(g,i+k)` became `c&C(f+=1.5*k-.5)&&!F(g)&!F(g,i+k)&&S()`: the target g1/c1 is turned into the rook's square, the attack test defaults to the king's own square, and `S` walks from king to rook last, because it moves `i` as it goes. The rook no longer has to be checked separately: a right exists only while its rook has never moved and never been captured.

In `Lowest.js` a third one came with it: `G`'s `g` parameter was dropped and `b[i]` read directly. A fourth candidate, naming `T|b[f]` once as `x`, shortens every source by a byte and lengthens every packed file by two to four; it was not taken.

Each rewrite was also tried in several equivalent spellings (`&&S()` or `&S()`, `%5==1` or `66>>`, three forms of the rook formula, `&` or `&&` between the two attack tests), 224 to 672 combinations per build, packed under up to 948 crush settings each — negative weights and a tiebreaker of `-1` included. The winners, and what each file gives back if one rewrite is removed again:

| build | before | after | pawn removed | castling removed | `g` removed |
| ----- | ------ | ----- | ------------ | ---------------- | ----------- |
| `index.html` | 1,023 | **1,008** | 1,015 | 1,017 | — |
| `minimal.html` | 830 | **815** | 824 | 824 | — |
| `Lowest.html` | 766 | **748** | 756 | 756 | 749 |

`Lowest.js` takes the castling line with `&&` between the two attack tests (`!V(t)&&!V(t,i+k)`), one byte longer in the source and one byte shorter packed. `minimal.html` got its last byte from the settings alone: a negative length factor and a tiebreaker of `-1`, which is why its column in the table above looks unlike the other two.

The sizes in this table are from before `style=zoom:3` was added. It sits in the shell, not in the payload, so it changes none of the comparisons above; it only moves `index.html` from 1,008 to 1,021.

All three were checked against the previous files: perft from the starting position, Kiwipete and CPW position 3, a geometry comparison on random boards, and old and new packed files driven side by side through their real inputs — clicks or `prompt()` answers — with the board, the ghost, the side to move, the castling rights and the rendered output compared after every action.

---

## Deprecated on purpose

The markup is legacy throughout, because legacy is shorter: `<center>`, `bgcolor`, `width` and `height` on `<td>`, unquoted attribute values, no closing `</tr>` or `</td>`, and no `<html>`, `<head>` or `<body>` at all. The one piece of CSS is `style=zoom:3` on the table in `index.html`: a single attribute that scales cells and glyphs together, where enlarging them by hand would mean a bigger `width`, `height` and font on every cell.

There is no doctype either, which puts the page in **quirks mode** — deliberately. That is what keeps the presentational attributes rendering, and it is also why every cell carries its own `<center>`: in quirks mode a table does not inherit `text-align` from its ancestors, so the outer `<center>` alone will not centre the glyphs.

`minimal.html` goes further: an unclosed `<input id=p>`, an unclosed `<table id=T>`, and `<th>` cells, which are bold and centred by default, so no `<center>` is needed.

`Lowest.html` goes to the end of that road: the file is a single `<script>` element and the page itself stays empty. There is no markup left to be legacy about.

`id=T` and `id=p` are enough to reach the table and the text box from script; the browser exposes them as globals.

Piece glyphs in `index.html` are Unicode `U+2654`–`U+265F`. No image, no font download, no CDN request.

---

## More

The engine's design, the full rule coverage and a line-by-line walkthrough of the larger builds are at **[fidelite.art](https://www.fidelite.art/)**.

---
---

<a id="turkce"></a>

# chessinbytes (Türkçe)

Baytlar içinde iki kişilik satranç. Üç sürüm, her biri 1 KB'nin altında tek bir HTML dosyası: kütüphane yok, derleme adımı yok, sunucu yok. Birini indirin, çift tıklayın, oynayın.

| dosya | boyut | nasıl oynanır |
| ----- | ----- | ------------- |
| `index.html` | **1.021 B** | tahtaya tıklanarak; taş karakterleri, tahta çevirme, terfi seçici, üç kat büyük çizilir |
| `minimal.html` | **815 B** | tahtaya tıklanarak; taşlar onaltılık rakamlarla gösterilir |
| `Lowest.html` | **748 B** | hamleler bir pencereye sayı olarak yazılır; tahta hiç yok |

Üçü de aynı kuralları uygular: tam yasallık kontrolü, tüm koşullarıyla rok, geçerken alma, her taşa terfi.

[Golfstack](https://www.fidelite.art/) projesinin bir parçasıdır.

## Oyna

- [cuneytinann.github.io/chessinbytes](https://cuneytinann.github.io/chessinbytes/) — `index.html`
- [cuneytinann.github.io/chessinbytes/minimal.html](https://cuneytinann.github.io/chessinbytes/minimal.html) — `minimal.html`
- [cuneytinann.github.io/chessinbytes/Lowest.html](https://cuneytinann.github.io/chessinbytes/Lowest.html) — `Lowest.html`
- [fidelite.art/special/DOM_1021.html](https://www.fidelite.art/special/DOM_1021.html) — `index.html` ile aynı dosya, proje sitesinde `special` altında yansıtılmış hâli
- [fidelite.art/special/DOM_minimum.html](https://www.fidelite.art/special/DOM_minimum.html) — `minimal.html` ile aynı dosya

Hedeflenen sınır 1.024 bayt. `index.html` onun 3 bayt altında kalıyor; öteki ikisi epey aşağıda.

**Kendiliğinden büyük.** `index.html`'de kareler 22×24 piksel; modern bir ekranda çok küçük kalıyor. Bu yüzden tabloda `style=zoom:3` duruyor ve tahta üç kat büyük, kare başına 66×72 piksel çiziliyor. Bedeli **13 bayt** ve hepsi paketlenmiş yükün dışında, HTML kabuğunda — paketleyici onları hiç görmüyor, yük 1.008 bayttaki hâliyle bayt bayt aynı. Tarayıcının kendi yakınlaştırması da bunun üstüne çalışıyor — `Ctrl` `+`, macOS'ta `⌘` `+`; `Ctrl` `0` sıfırlar. Büyütürken hiçbir şey bozulmaz: kare boyutları HTML özniteliklerinde tanımlı, taşlar da metin karakterleri olduğu için tahta her yakınlaştırma düzeyinde temiz ölçeklenir. `zoom` uzun süre standart dışı bir özellikti; bugün CSS'in parçası ve Firefox 126. sürümden beri destekliyor. Daha eski bir tarayıcı onu yok sayar ve tahtayı özgün boyutunda gösterir.

---

## İçinde neler var

Bu bölüm `index.html`'i anlatır. Daha küçük iki sürüm aşağıda, neyi değiştirdikleriyle anlatılıyor.

- **Tüm taş hareketleri**, geometrisi aritmetikten türetilmiş — yön tablosu yok, ofset dizisi yok.
- **Tam yasallık kontrolü.** Kendi şahınızı şah altında bırakan bir hamle asla kabul edilmez. Her aday hamle kopyalanmış bir tahtada oynanır ve şahın durumu sorgulanır.
- **Rok**, iki yöne de, tüm koşullarıyla: rok hakkı hâlâ duruyor, kale yolu açık, şah şah altında değil, şah saldırı altındaki bir kareden geçmiyor.
- **Geçerken alma (en passant)**, bir *hayalet* olarak uygulanmıştır: alınacak kare, tahta dizisinin içine `1` taş koduyla yazılır ve boş görünür. Ayrı bir `e` durum değişkeni yoktur.
- **Seçicili terfi.** Vezir, kale, fil, at; siz seçim yapana kadar hamle tamamlanmaz.
- **Tahta çevirme.** Her hamleden sonra tahta, sırası gelen tarafın bakış açısına döner.
- **Oyun sonu göstergesi.** Sırası gelen tarafın yasal hamlesi kalmadığında tüm kareler kahverengiye döner. Bu tek test hem şah matı hem de pat durumunu kapsar; bu yüzden ayrı bir mat tespiti yazılmamıştır.

## İçinde neler yok

Saat yok, 50 hamle kuralı yok, tekrar sayacı yok, yetersiz materyal testi yok, beraberlik teklifi yok, sonuç kodları yok, bot yok. Mat ile pat birbirinden ayırt edilmez — `index.html` ve `minimal.html`'de ikisi de oyunu bitirir, o kadar; `Lowest.html`'de ise oyun hiç bitmez. Tüm bunları içeren eksiksiz FIDE hakemi için [fidelite.art](https://www.fidelite.art/) adresine bakın.

---

## `minimal.html`

Aynı kural seti; arayüz, oynamak için gerekene kadar kısılmış.

**Korunanlar:** tam yasallık kontrolü, tüm koşullarıyla rok, hayalet olarak geçerken alma, her taşa terfi.

**Değişen ya da çıkarılanlar:**

- **Seçicisiz terfi.** Taş, hamle yapıldığı anda tahtanın üstündeki metin kutusundan okunur: `1` kale, `2` fil, `3` at; boş ya da `q` vezir. Hamle hemen tamamlanır.
- **Taş karakteri yok.** Her kare taş kodunu onaltılık bir rakam olarak gösterir: `0` boş, `1` geçerken alma hayaleti (burada görünür), `2`–`d` taşlar.
- **Sabit yön.** Tahta dönmez. Dizi, 0 numaralı eleman sol üstte olacak şekilde çizilir; bu yüzden önce oynayan taraf altta başlar ve çift kodlarla oynar (`8` piyon, `4` kale, `c` at, `2` fil, `6` vezir, `a` şah); diğer tarafın kodları tektir.
- **Gösterge yok.** Oyun sonu rengi yok, vurgulama yok. Sırası gelen tarafın yasal hamlesi kalmadığında tıklamalar yalnızca bir şey yapmaz; şah mat ile pat ayırt edilmez.

---

## `Lowest.html`

Aynı kural seti, tahtasız. Arayüzün tamamı tek bir `prompt()` penceresi.

**Korunanlar:** tam yasallık kontrolü, tüm koşullarıyla rok, hayalet olarak geçerken alma, her taşa terfi.

**Değişen ya da çıkarılanlar:**

- **Tahta yok.** Hiçbir şey çizilmez. Pencere son hamleyi, yazıldığı gibi gösterir, başka bir şey göstermez; pozisyonu akılda tutmak oyunculara kalır.
- **Hamleler sayıyla.** Dört rakam: önce çıkış karesi, sonra varış karesi, her biri `00` ile `63` arasında iki rakamla yazılır — a1 `00`, h1 `07`, a8 `56`, h8 `63`. `e2e4`, `1228` olur. Rok şahın hamlesiyle yazılır: beyaz için `0406` ve `0402`, siyah için `6062` ve `6058`. Geçerken almada piyonun gerçekten vardığı kare yazılır.
- **Terfi beşinci rakamdan.** `0` fil, `1` kale, `2` at; başka herhangi bir şey ya da hiçbir şey vezir. Beşinci karakterden sonrası yok sayılır.
- **Hiçbir şey sesli reddedilmez.** Yanlış tarafın hamlesi, kurala aykırı bir hamle, harfler, boş satır, İptal: pencere aynı metinle geri gelir.
- **Bitiş yok.** Oyunun bitmiş bir hâli yoktur. Sırası gelen tarafın yasal hamlesi kalmadığında — mat da olsa pat da olsa — her girdi reddedilir ve pencere son hamleyi göstermeye devam eder. Döngü hiç sona ermez; durdurmak için sekmeyi kapatın.

---

## Dosyalar

| dosya | boyut | ne |
| ----- | ----- | -- |
| `index.html` | 1.021 B | oyun, paketlenmiş ve oynanabilir |
| `chess.js` | 1.151 B | paketlenmemiş kaynak kodu, tek satır |
| `minimal.html` | 815 B | sadeleştirilmiş sürüm, paketlenmiş ve oynanabilir |
| `minimal.js` | 855 B | paketlenmemiş kaynak kodu, tek satır |
| `Lowest.html` | 748 B | en küçük sürüm, paketlenmiş ve oynanabilir |
| `Lowest.js` | 788 B | paketlenmemiş kaynak kodu, tek satır |
| `pack.js` | 1.761 B | üç HTML dosyasını kaynaklardan yeniden üretir ve bayt bayt karşılaştırır |

## Paketi açma

Üç HTML dosyası da kendi kendini açar. Her betik, `eval(_)` ile biten bir RegPack açma döngüsüdür. Paketlenmemiş kaynak kodu elde etmek için bu çağrıyı değiştirin:

```js
eval(_)   →   console.log(_)
```

Döngünün kendisi hiçbir oyun kodu çalıştırmaz, bu yüzden bunu Node'da yapmak güvenlidir. Bu depodaki `chess.js`, `minimal.js` ve `Lowest.js` tam olarak bu işlemin çıktısıdır.

## Paketleme

[RegPack 5.0.1](https://github.com/Siorki/RegPack). Aşağıdaki ayarlar üç dosyayı da kaynaklarından **bayt bayt aynı** şekilde yeniden üretir (RegPack 5.0.4 de aynı çıktıyı verir):

| seçenek | `index.html` | `minimal.html` | `Lowest.html` |
| ------- | ------------ | -------------- | ------------- |
| `reassignVars` | `false` | `false` | `false` |
| `crushGainFactor` | `1` | `1` | `0` |
| `crushLengthFactor` | `0.5` | `-0.5` | `0.5` |
| `crushCopiesFactor` | `1` | `0.75` | `0.5` |
| `crushTiebreakerFactor` | `0` | `-1` | `0` |
| `withMath` | `false` | `false` | `false` |
| `wrapInSetInterval` | `false` | `false` | `false` |
| `useES6` | `true` | `true` | `true` |

Üçünde de kazanan aşama 2, yani regexp karakter sınıfı aşamasıdır. Bayt düzeni:

```
41 B  <center><table id=T style=zoom:3><script>     32 B  <input id=p><table id=T><script>     8 B  <script>
971 B  paketlenmiş yük                              774 B  paketlenmiş yük                     731 B  paketlenmiş yük
 9 B  </script>                                      9 B  </script>                            9 B  </script>
----                                                ----                                       ----
1021 B                                              815 B                                      748 B
```

Yeniden üretmek için:

```
npm install regpack@5.0.1
node pack.js --check    # depodaki dosyalarla karşılaştırır
node pack.js            # index.html, minimal.html ve Lowest.html dosyalarını yeniden yazar
```

`regpack` komut satırını kullanıyorsanız `--no-reassignVars` yazın. `--reassignVars false` biçiminde yazılan değer `"false"` metni olarak gelir, doğru sayılır ve değişkenler yeniden adlandırılır.

Yalnızca betik paketlenir; HTML kabuğu paketlenmez. Şunu not edin: kaynağı kısaltmak çıktıyı **güvenilir biçimde kısaltmaz** — paketleyici kazancını tekrar eden alt dizelerden elde eder, bu yüzden daha çok tekrar içeren daha uzun bir kaynak çoğu zaman daha küçük paketlenir. `index.html`'deki bazı düzenlemeler tam da bu nedenle, gerekenden bilerek daha uzun tutulmuştur. `chess.js` üzerinde denenen, davranışı değiştirmeyen yeniden yazımların hiçbiri daha küçük paketlenmedi, ikisi büyüttü, biri altı bayt. Sonradan gelen iki tanesi aynı şeyi iki yönden söylüyor. `j%5==1` yerine `66>>j` yazmak kaynağı bir bayt kısaltıp paketi bir bayt uzatıyor — 1.023'e ancak başka bir crush dörtlüsüyle dönüyor, yukarıdaki tablonun artık `0, 0, 0, 0` olmamasının sebebi bu. `p%2^g` yerine `p&1^g` yazmak kaynakta hiçbir şeye mal olmuyor, çıktıda **iki bayta**, ve hiçbir ayar onu geri almıyor; alınmadı. `minimal.js`'te aynı değişiklik `b[f]%2^t` üzerinde ters yönde işledi ve bir bayt kazandırdı, ondan önce de `o%5==1` → `66>>o` bir bayt kazandırmıştı.

`Lowest.js` bunun en açık örneği. Olabildiğince düz yazıldığında betik 787 bayt ve olduğu gibi paketlenince 785 baytlık bir dosya veriyor. Her biri yerine geçtiği şeyden daha uzun ya da onunla aynı uzunlukta üç yeniden yazım bunu 766'ya indiriyor (aşağıda anlatılan turdan önce):

| yeniden yazım | kaynak | paket, tek başına |
| ------------- | ------ | ----------------- |
| `a=Math.abs` takma adı kaldırıldı, `Math.abs(` üç kullanımda da açık yazıldı | +10 B | −4 B |
| `L` ile `V`'nin kare parametresinin adı `u`'dan `f`'ye çevrildi; böylece `(i,f`, `G(i,f` ve `M(i,f` tekrar ediyor | ±0 B | −9 B |
| geçerken alma, `e` değişkeni yerine hayalet olarak | +4 B | −6 B |
| üçü birlikte | +14 B | **−19 B** |

Etkiler basitçe toplanmıyor; her biri ötekilerin üzerinde çalıştığı tekrarları değiştiriyor. `p&1^s` yerine `p%2^s` yazmak burada iki yönde de fark yaratmadı.

### Sonraki tur: ışın tarayıcıya daha çok iş vermek

Işın tarayıcı `S` iki uç arasındaki her kareye zaten bakıyor ve tahta dışına çıkınca kendiliğinden duruyor (`undefined<2` yanlış). Üç sürümde de iki kural ona devredildi:

- **Piyonun çift adımı.** `a<2|a<3&!b[i+f>>1]&66>>j`, `a<2+(j%5==1)&&S()` oldu: tek adım hedefe ilk adımda varıyor, çift adım aradaki kareye bakıyor. Hayalet oraya düşemez — yalnızca az önce oynayan piyonun arkasında durur, sırası gelen tarafın kendi başlangıç yatayının önünde asla.
- **Rok.** `c&C(r=i+3.5*k-.5)&&B(r,i)&&!F(g,i)&!F(g,i+k)`, `c&C(f+=1.5*k-.5)&&!F(g)&!F(g,i+k)&&S()` oldu: hedef kare (g1/c1) kalenin karesine çevriliyor, saldırı testi varsayılan olarak şahın kendi karesine bakıyor, `S` de şahtan kaleye en sonda yürüyor, çünkü yürürken `i`'yi değiştiriyor. Kalenin ayrıca denetlenmesi gerekmiyor: hak, ancak kalesi hiç oynamamış ve alınmamışsa duruyor.

`Lowest.js`'te bunlara üçüncüsü eklendi: `G`'nin `g` parametresi atılıp `b[i]` doğrudan okundu. Dördüncü aday, `T|b[f]`'i bir kez `x` diye adlandırmak, her kaynağı bir bayt kısaltıp her paketi iki ila dört bayt uzatıyor; alınmadı.

Her yeniden yazım birkaç eşdeğer yazılışla da denendi (`&&S()` ya da `&S()`, `%5==1` ya da `66>>`, kale formülünün üç biçimi, iki saldırı testi arasında `&` ya da `&&`) — sürüm başına 224 ile 672 arası kombinasyon, her biri 948'e varan crush ayarıyla paketlendi; negatif ağırlıklar ve `-1` tiebreaker dahil. Kazananlar ve yeniden yazımlardan biri geri alınınca her dosyanın vardığı boyut:

| sürüm | önce | sonra | piyon geri alınınca | rok geri alınınca | `g` geri alınınca |
| ----- | ---- | ----- | ------------------- | ----------------- | ----------------- |
| `index.html` | 1.023 | **1.008** | 1.015 | 1.017 | — |
| `minimal.html` | 830 | **815** | 824 | 824 | — |
| `Lowest.html` | 766 | **748** | 756 | 756 | 749 |

`Lowest.js`, rok satırını iki saldırı testi arasında `&&` ile alıyor (`!V(t)&&!V(t,i+k)`): kaynakta bir bayt uzun, pakette bir bayt kısa. `minimal.html` son baytını yalnızca ayardan aldı: negatif bir uzunluk çarpanı ve `-1` tiebreaker; yukarıdaki tabloda sütununun ötekilere benzememesinin sebebi bu.

Bu tablodaki boyutlar `style=zoom:3` eklenmeden önceki. O ekleme yükte değil kabukta durduğu için yukarıdaki karşılaştırmaların hiçbirini değiştirmiyor; yalnızca `index.html`'i 1.008'den 1.021'e taşıyor.

Üçü de önceki dosyalarla karşılaştırılarak doğrulandı: başlangıç pozisyonu, Kiwipete ve CPW 3. pozisyondan perft; rastgele tahtalarda geometri karşılaştırması; eski ve yeni paketli dosyalar gerçek girişleriyle — tıklama ya da `prompt()` cevabı — yan yana sürüldü ve her adımdan sonra tahta, hayalet, sıra, rok hakları ve ekrana basılan çıktı karşılaştırıldı.

---

## Bilinçli olarak eski usul

İşaretleme baştan sona eski usul yazılmıştır, çünkü eski usul daha kısadır: `<center>`, `bgcolor`, `<td>` üzerinde `width` ve `height`, tırnaksız öznitelik değerleri, kapanış `</tr>` veya `</td>` yok, `<html>`, `<head>` ya da `<body>` hiç yok. Tek CSS parçası `index.html`'deki tablonun `style=zoom:3`'ü: kareleri ve taşları birlikte ölçekleyen tek bir öznitelik; elle büyütmek her karede daha büyük bir `width`, `height` ve yazı boyu demek olurdu.

Doctype da yok; bu da sayfayı **quirks mode**'a sokar — bilerek. Görünümle ilgili eski özniteliklerin hâlâ işlemesini sağlayan budur; her karenin kendi `<center>` etiketini taşımasının nedeni de budur: quirks mode'da bir tablo `text-align` değerini üst öğelerinden devralmaz, bu yüzden dıştaki `<center>` tek başına taşları ortalamaya yetmez.

`minimal.html` bir adım daha ileri gider: kapatılmamış bir `<input id=p>`, kapatılmamış bir `<table id=T>` ve varsayılan olarak kalın ve ortalanmış gelen `<th>` hücreleri; bu yüzden `<center>` gerekmez.

`Lowest.html` bu yolun sonuna gider: dosya tek bir `<script>` öğesinden ibarettir ve sayfanın kendisi boş kalır. Eski usul yazılacak işaretleme kalmamıştır.

Tabloya ve metin kutusuna betikten ulaşmak için `id=T` ve `id=p` yeterlidir; tarayıcı onları global değişken olarak sunar.

`index.html`'deki taş karakterleri Unicode `U+2654`–`U+265F` aralığındadır. Görsel yok, yazı tipi indirme yok, CDN isteği yok.

---

## Daha fazlası

Motorun tasarımı, kuralların eksiksiz kapsamı ve daha büyük sürümlerin satır satır açıklaması **[fidelite.art](https://www.fidelite.art/)** adresinde.
