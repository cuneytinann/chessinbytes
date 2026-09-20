**[English](#chess1023byte)** · **[Türkçe](#turkce)**

# chess1023byte

A two-player chess game in **1,023 bytes** of HTML + JavaScript. One file, no libraries, no build step, no server. Download `index.html`, double-click, play.

A reduced build, `minimum.html`, keeps the same rules in **830 bytes** and drops most of the interface.

Part of the [Golfstack](https://www.fidelite.art/) project.

## Play

- [cuneytinann.github.io/chess1023byte](https://cuneytinann.github.io/chess1023byte/) — `index.html`
- [cuneytinann.github.io/chess1023byte/minimum.html](https://cuneytinann.github.io/chess1023byte/minimum.html) — `minimum.html`
- [fidelite.art/special/DOM_1023.html](https://www.fidelite.art/special/DOM_1023.html) — same file as `index.html`, mirrored on the project site as the packed `L1` build
- [fidelite.art/special/DOM_minimum.html](https://www.fidelite.art/special/DOM_minimum.html) — same file as `minimum.html`

The name of the budget: 1,024 bytes. This lands 1 byte under it.

**Zoom in.** In `index.html` cells are 22×24 px, which is tiny on a modern display. Use the browser's zoom — `Ctrl` `+`, or `⌘` `+` on macOS; around **300%** is comfortable. `Ctrl` `0` resets it. Nothing breaks on the way up: the cells are sized in HTML attributes and the pieces are text glyphs, so the whole board scales cleanly at any zoom level.

---

## What's in it

- **All piece movement**, geometry derived from arithmetic — no direction tables, no offset arrays.
- **Full legality.** A move that leaves your own king in check is never accepted. Every candidate is played on a cloned board and the king is queried.
- **Castling**, both sides, with every condition: rights still held, rook path clear, king not in check, king not crossing an attacked square.
- **En passant**, implemented as a *ghost*: the capture square is written into the board array itself as piece code `1`, which renders blank. There is no `e` state variable.
- **Promotion with a picker.** Queen, rook, bishop, knight; the move isn't completed until you choose.
- **Board flip.** After each move the board turns to the perspective of the side to move.
- **Game-over indicator.** When the side to move has no legal move, every square turns brown. That single test covers checkmate and stalemate alike, so no separate mate detection is written.

## What's not in it

No clock, no 50-move rule, no repetition counter, no insufficient-material test, no draw offers, no result codes, no bot. Mate and stalemate are not told apart — both simply end the game. For the full FIDE arbiter with all of that, see [fidelite.art](https://www.fidelite.art/).

---

## `minimum.html`

The same rule set with the interface cut back to what is needed to play.

**Kept:** full legality, castling with every condition, en passant as a ghost, promotion to any piece.

**Changed or dropped:**

- **Promotion without a picker.** The piece is read from the text box above the board when the move is made: `1` rook, `2` bishop, `3` knight; empty or `q` queen. The move completes at once.
- **No glyphs.** Each cell shows the piece code as a hexadecimal digit: `0` empty, `1` the en passant ghost (visible here), `2`–`d` the pieces.
- **Fixed orientation.** The board does not flip. The array is drawn from index 0 at the top-left, so the side to move first starts at the bottom and plays with the even codes (`8` pawn, `4` rook, `c` knight, `2` bishop, `6` queen, `a` king); the other side has the odd ones.
- **No indicators.** No game-over colour, no highlighting. When the side to move has no legal move, clicks simply do nothing; checkmate and stalemate are not told apart.

---

## Files

| file | size | what |
| ---- | ---- | ---- |
| `index.html` | 1,023 B | the game, packed and playable |
| `chess.js` | 1,164 B | its plain source, one line, unpacked |
| `minimum.html` | 830 B | the reduced build, packed and playable |
| `minimum.js` | 867 B | its plain source, one line, unpacked |
| `pack.js` | 1,588 B | rebuilds both HTML files from the sources and checks them byte for byte |

## Unpacking

Both HTML files are self-extracting. Each script is a RegPack decompression loop ending in `eval(_)`. To recover the plain source, replace that call:

```js
eval(_)   →   console.log(_)
```

The loop itself runs no game code, so this is safe to do in Node. `chess.js` and `minimum.js` in this repo are exactly what comes out.

## Packing

[RegPack 5.0.1](https://github.com/Siorki/RegPack). These settings reproduce both files **byte for byte** from their sources (RegPack 5.0.4 gives the same output):

| option | `index.html` | `minimum.html` |
| ------ | ------------ | -------------- |
| `reassignVars` | `false` | `false` |
| `crushGainFactor` | `1` | `0.5` |
| `crushLengthFactor` | `0.5` | `0` |
| `crushCopiesFactor` | `0` | `1` |
| `crushTiebreakerFactor` | `0` | `0` |
| `withMath` | `false` | `false` |
| `wrapInSetInterval` | `false` | `false` |
| `useES6` | `true` | `true` |

In both, the winning stage is 2, the regexp character class. Byte layout:

```
28 B  <center><table id=T><script>        32 B  <input id=p><table id=T><script>
986 B  packed payload                     789 B  packed payload
 9 B  </script>                            9 B  </script>
----                                      ----
1023 B                                    830 B
```

To rebuild:

```
npm install regpack@5.0.1
node pack.js --check    # compare with the committed files
node pack.js            # rewrite index.html and minimum.html
```

With the `regpack` command line, pass `--no-reassignVars`. Written as `--reassignVars false`, the value arrives as the string `"false"`, which counts as true, and the variables get renamed.

Only the script is packed; the HTML shell is not. Note that shortening the source does **not** reliably shorten the output — the packer pays for repeated substrings, so a longer source with more repetition often packs smaller. Several edits in `index.html` are deliberately longer than they need to be for exactly that reason. Of the behaviour-preserving rewrites tried on `chess.js`, none packed smaller and two packed larger, one of them by six bytes. Two later ones say the same thing from both sides. Writing `66>>j` instead of `j%5==1` shortens the source by a byte and lengthens the packed output by one — it only comes back to 1,023 with a different crush tuple, which is why the table above no longer reads `0, 0, 0, 0`. Replacing `p%2^g` with `p&1^g` costs nothing in the source and **two bytes** in the output, and no setting recovers them; it was not taken. In `minimum.js` the same substitution on `b[f]%2^t` went the other way and saved one byte, and `o%5==1` → `66>>o` had saved one before it.

---

## Deprecated on purpose

The markup is legacy throughout, because legacy is shorter: `<center>`, `bgcolor`, `width` and `height` on `<td>`, unquoted attribute values, no closing `</tr>` or `</td>`, and no `<html>`, `<head>` or `<body>` at all.

There is no doctype either, which puts the page in **quirks mode** — deliberately. That is what keeps the presentational attributes rendering, and it is also why every cell carries its own `<center>`: in quirks mode a table does not inherit `text-align` from its ancestors, so the outer `<center>` alone will not centre the glyphs.

`minimum.html` goes further: an unclosed `<input id=p>`, an unclosed `<table id=T>`, and `<th>` cells, which are bold and centred by default, so no `<center>` is needed.

`id=T` and `id=p` are enough to reach the table and the text box from script; the browser exposes them as globals.

Piece glyphs in `index.html` are Unicode `U+2654`–`U+265F`. No image, no font download, no CDN request.

---

## More

The engine's design, the full rule coverage and a line-by-line walkthrough of the larger builds are at **[fidelite.art](https://www.fidelite.art/)**.

---
---

<a id="turkce"></a>

# chess1023byte (Türkçe)

HTML + JavaScript ile **1.023 bayt** içinde yazılmış iki kişilik bir satranç oyunu. Tek dosya, kütüphane yok, derleme adımı yok, sunucu yok. `index.html` dosyasını indirin, çift tıklayın, oynayın.

Sadeleştirilmiş sürüm `minimum.html`, aynı kuralları **830 bayt** içinde tutar ve arayüzün çoğunu çıkarır.

[Golfstack](https://www.fidelite.art/) projesinin bir parçasıdır.

## Oyna

- [cuneytinann.github.io/chess1023byte](https://cuneytinann.github.io/chess1023byte/) — `index.html`
- [cuneytinann.github.io/chess1023byte/minimum.html](https://cuneytinann.github.io/chess1023byte/minimum.html) — `minimum.html`
- [fidelite.art/special/DOM_1023.html](https://www.fidelite.art/special/DOM_1023.html) — `index.html` ile aynı dosya, proje sitesinde paketlenmiş `L1` sürümü olarak yansıtılmış hâli
- [fidelite.art/special/DOM_minimum.html](https://www.fidelite.art/special/DOM_minimum.html) — `minimum.html` ile aynı dosya

Hedeflenen sınır 1.024 bayt; bu sürüm onun 1 bayt altında kalıyor.

**Yakınlaştırın.** `index.html`'de kareler 22×24 piksel; modern bir ekranda çok küçük kalıyor. Tarayıcının yakınlaştırmasını kullanın — `Ctrl` `+`, macOS'ta `⌘` `+`; **%300** civarı rahattır. `Ctrl` `0` sıfırlar. Büyütürken hiçbir şey bozulmaz: kare boyutları HTML özniteliklerinde tanımlı, taşlar da metin karakterleri olduğu için tahta her yakınlaştırma düzeyinde temiz ölçeklenir.

---

## İçinde neler var

- **Tüm taş hareketleri**, geometrisi aritmetikten türetilmiş — yön tablosu yok, ofset dizisi yok.
- **Tam yasallık kontrolü.** Kendi şahınızı şah altında bırakan bir hamle asla kabul edilmez. Her aday hamle kopyalanmış bir tahtada oynanır ve şahın durumu sorgulanır.
- **Rok**, iki yöne de, tüm koşullarıyla: rok hakkı hâlâ duruyor, kale yolu açık, şah şah altında değil, şah saldırı altındaki bir kareden geçmiyor.
- **Geçerken alma (en passant)**, bir *hayalet* olarak uygulanmıştır: alınacak kare, tahta dizisinin içine `1` taş koduyla yazılır ve boş görünür. Ayrı bir `e` durum değişkeni yoktur.
- **Seçicili terfi.** Vezir, kale, fil, at; siz seçim yapana kadar hamle tamamlanmaz.
- **Tahta çevirme.** Her hamleden sonra tahta, sırası gelen tarafın bakış açısına döner.
- **Oyun sonu göstergesi.** Sırası gelen tarafın yasal hamlesi kalmadığında tüm kareler kahverengiye döner. Bu tek test hem şah matı hem de pat durumunu kapsar; bu yüzden ayrı bir mat tespiti yazılmamıştır.

## İçinde neler yok

Saat yok, 50 hamle kuralı yok, tekrar sayacı yok, yetersiz materyal testi yok, beraberlik teklifi yok, sonuç kodları yok, bot yok. Mat ile pat birbirinden ayırt edilmez — ikisi de oyunu bitirir, o kadar. Tüm bunları içeren eksiksiz FIDE hakemi için [fidelite.art](https://www.fidelite.art/) adresine bakın.

---

## `minimum.html`

Aynı kural seti; arayüz, oynamak için gerekene kadar kısılmış.

**Korunanlar:** tam yasallık kontrolü, tüm koşullarıyla rok, hayalet olarak geçerken alma, her taşa terfi.

**Değişen ya da çıkarılanlar:**

- **Seçicisiz terfi.** Taş, hamle yapıldığı anda tahtanın üstündeki metin kutusundan okunur: `1` kale, `2` fil, `3` at; boş ya da `q` vezir. Hamle hemen tamamlanır.
- **Taş karakteri yok.** Her kare taş kodunu onaltılık bir rakam olarak gösterir: `0` boş, `1` geçerken alma hayaleti (burada görünür), `2`–`d` taşlar.
- **Sabit yön.** Tahta dönmez. Dizi, 0 numaralı eleman sol üstte olacak şekilde çizilir; bu yüzden önce oynayan taraf altta başlar ve çift kodlarla oynar (`8` piyon, `4` kale, `c` at, `2` fil, `6` vezir, `a` şah); diğer tarafın kodları tektir.
- **Gösterge yok.** Oyun sonu rengi yok, vurgulama yok. Sırası gelen tarafın yasal hamlesi kalmadığında tıklamalar yalnızca bir şey yapmaz; şah mat ile pat ayırt edilmez.

---

## Dosyalar

| dosya | boyut | ne |
| ----- | ----- | -- |
| `index.html` | 1.023 B | oyun, paketlenmiş ve oynanabilir |
| `chess.js` | 1.164 B | paketlenmemiş kaynak kodu, tek satır |
| `minimum.html` | 830 B | sadeleştirilmiş sürüm, paketlenmiş ve oynanabilir |
| `minimum.js` | 867 B | paketlenmemiş kaynak kodu, tek satır |
| `pack.js` | 1.588 B | iki HTML dosyasını kaynaklardan yeniden üretir ve bayt bayt karşılaştırır |

## Paketi açma

İki HTML dosyası da kendi kendini açar. Her betik, `eval(_)` ile biten bir RegPack açma döngüsüdür. Paketlenmemiş kaynak kodu elde etmek için bu çağrıyı değiştirin:

```js
eval(_)   →   console.log(_)
```

Döngünün kendisi hiçbir oyun kodu çalıştırmaz, bu yüzden bunu Node'da yapmak güvenlidir. Bu depodaki `chess.js` ve `minimum.js` tam olarak bu işlemin çıktısıdır.

## Paketleme

[RegPack 5.0.1](https://github.com/Siorki/RegPack). Aşağıdaki ayarlar iki dosyayı da kaynaklarından **bayt bayt aynı** şekilde yeniden üretir (RegPack 5.0.4 de aynı çıktıyı verir):

| seçenek | `index.html` | `minimum.html` |
| ------- | ------------ | -------------- |
| `reassignVars` | `false` | `false` |
| `crushGainFactor` | `1` | `0.5` |
| `crushLengthFactor` | `0.5` | `0` |
| `crushCopiesFactor` | `0` | `1` |
| `crushTiebreakerFactor` | `0` | `0` |
| `withMath` | `false` | `false` |
| `wrapInSetInterval` | `false` | `false` |
| `useES6` | `true` | `true` |

İkisinde de kazanan aşama 2, yani regexp karakter sınıfı aşamasıdır. Bayt düzeni:

```
28 B  <center><table id=T><script>        32 B  <input id=p><table id=T><script>
986 B  paketlenmiş yük                    789 B  paketlenmiş yük
 9 B  </script>                            9 B  </script>
----                                      ----
1023 B                                    830 B
```

Yeniden üretmek için:

```
npm install regpack@5.0.1
node pack.js --check    # depodaki dosyalarla karşılaştırır
node pack.js            # index.html ve minimum.html dosyalarını yeniden yazar
```

`regpack` komut satırını kullanıyorsanız `--no-reassignVars` yazın. `--reassignVars false` biçiminde yazılan değer `"false"` metni olarak gelir, doğru sayılır ve değişkenler yeniden adlandırılır.

Yalnızca betik paketlenir; HTML kabuğu paketlenmez. Şunu not edin: kaynağı kısaltmak çıktıyı **güvenilir biçimde kısaltmaz** — paketleyici kazancını tekrar eden alt dizelerden elde eder, bu yüzden daha çok tekrar içeren daha uzun bir kaynak çoğu zaman daha küçük paketlenir. `index.html`'deki bazı düzenlemeler tam da bu nedenle, gerekenden bilerek daha uzun tutulmuştur. `chess.js` üzerinde denenen, davranışı değiştirmeyen yeniden yazımların hiçbiri daha küçük paketlenmedi, ikisi büyüttü, biri altı bayt. Sonradan gelen iki tanesi aynı şeyi iki yönden söylüyor. `j%5==1` yerine `66>>j` yazmak kaynağı bir bayt kısaltıp paketi bir bayt uzatıyor — 1.023'e ancak başka bir crush dörtlüsüyle dönüyor, yukarıdaki tablonun artık `0, 0, 0, 0` olmamasının sebebi bu. `p%2^g` yerine `p&1^g` yazmak kaynakta hiçbir şeye mal olmuyor, çıktıda **iki bayta**, ve hiçbir ayar onu geri almıyor; alınmadı. `minimum.js`'te aynı değişiklik `b[f]%2^t` üzerinde ters yönde işledi ve bir bayt kazandırdı, ondan önce de `o%5==1` → `66>>o` bir bayt kazandırmıştı.

---

## Bilinçli olarak eski usul

İşaretleme baştan sona eski usul yazılmıştır, çünkü eski usul daha kısadır: `<center>`, `bgcolor`, `<td>` üzerinde `width` ve `height`, tırnaksız öznitelik değerleri, kapanış `</tr>` veya `</td>` yok, `<html>`, `<head>` ya da `<body>` hiç yok.

Doctype da yok; bu da sayfayı **quirks mode**'a sokar — bilerek. Görünümle ilgili eski özniteliklerin hâlâ işlemesini sağlayan budur; her karenin kendi `<center>` etiketini taşımasının nedeni de budur: quirks mode'da bir tablo `text-align` değerini üst öğelerinden devralmaz, bu yüzden dıştaki `<center>` tek başına taşları ortalamaya yetmez.

`minimum.html` bir adım daha ileri gider: kapatılmamış bir `<input id=p>`, kapatılmamış bir `<table id=T>` ve varsayılan olarak kalın ve ortalanmış gelen `<th>` hücreleri; bu yüzden `<center>` gerekmez.

Tabloya ve metin kutusuna betikten ulaşmak için `id=T` ve `id=p` yeterlidir; tarayıcı onları global değişken olarak sunar.

`index.html`'deki taş karakterleri Unicode `U+2654`–`U+265F` aralığındadır. Görsel yok, yazı tipi indirme yok, CDN isteği yok.

---

## Daha fazlası

Motorun tasarımı, kuralların eksiksiz kapsamı ve daha büyük sürümlerin satır satır açıklaması **[fidelite.art](https://www.fidelite.art/)** adresinde.
