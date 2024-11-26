
# TRANS

A simple util library for bypassing whatsapp verifications. Very useful on massive sending cases. (specifically made to use with [whatsapp-web.js](https://wwebjs.dev/))



## Why?

Whatsapp uses End-To-End encryption which makes them "unable"(not very sure about this) to see what you are sending. What they can see is a hash (cryptographic one way function that creates a unique set of characters based on a value) which will be the same if you use the same content everytime. 

#### Demonstration

```js
import crypto from 'node:crypto';
import TRANS from '.';

const baseString = "Hello! I'm an example!";
const transString = TRANS.$TEXT(baseString);

const baseHash = crypto.createHash('sha512').update(baseString).digest("hex");
const untransHash = crypto.createHash('sha512').update(baseString).digest("hex");
const transHash = crypto.createHash('sha512').update(transString).digest("hex");

console.log(baseHash == untransHash); //True
console.log(baseHash == transHash); //False

```
This reduces the probability of being banned/blocked when making massive sendings via [WWeb.js](https://wwebjs.dev/)
## Methods

#### $TEXT

```js
import TRANS from './trans.js';

TRANS.$TEXT("This is a test");
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `text` | `string` | **Required**. Basic string with text |

The $TEXT method transforms a basic string to a random mix of different types of UTF-8 spaces. This makes the string look the same at the human eye but computers (and specially Whatsapp) will see it as a completely different strings. 

#### $PDF

```js
import TRANS from './trans.js';
import fs from 'node:fs';
const data = fs.readFileSync("./myPDF.pdf");

TRANS.$PDF(data);
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `data`    | `Buffer` | **Required**. PDF Data Buffer     |

The $PDF method adds an invisible random uuid to a PDF file that a person cannot see. I've tried using the PDF with chatgpt and it couldn't find the "secret id" unless I mention it.
Also adds trashy metadata to ensure Whatsapp does not recognizes it.

#### $MP4

```js
import TRANS from './trans.js';
import fs from 'node:fs';
const data = fs.readFileSync("./myVideo.mp4");
const myTempFolder = fs.mkdirSync('temp')

TRANS.$MP4(data, 'temp');
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `data`    | `Buffer` | **Required**. MP4 Data Buffer     |
| `temp`    | `string` | **Required**. Path to folder used to save temporal files     |

The $MP4 method changes the brightness of the video in a very low range (between -0.01 and 0.01). Also adds trashy metadata to ensure Whatsapp does not recognizes it.

#### $IMG

```js
import TRANS from './trans.js';
import fs from 'node:fs';
const data = fs.readFileSync("./myImg.jpg");
const myTempFolder = fs.mkdirSync('temp')

TRANS.$IMG(data, 'temp', 'image/jpeg');
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `data`    | `Buffer` | **Required**. MP4 Data Buffer     |
| `temp`    | `string` | **Required**. Path to folder used to save temporal files     |
| `type`    | `string` | **Required**. MIME type (supports "image/jpeg" and "image/png")  |


The $IMG method changes the brightness of a random pixel. Also adds trashy metadata to ensure Whatsapp does not recognizes it.

## Dependencies

- [pdf-lib](https://www.npmjs.com/search?q=pdf-lib)
- [fluent-ffmpeg](https://www.npmjs.com/package/fluent-ffmpeg)
- [exiftool-vendored](https://www.npmjs.com/package/exiftool-vendored)
- [sharp](https://www.npmjs.com/package/sharp)