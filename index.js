
import { PDFDocument, rgb } from 'pdf-lib';
import ffmpeg from 'fluent-ffmpeg';
import fs from 'node:fs/promises'
import { exiftool } from 'exiftool-vendored'
import path from 'node:path';
import crypto from 'node:crypto';
import sharp from 'sharp';


export default class TRANS {

	/**
	 * 
	 * @param {String} text 
	 * @returns {String}
	 */
	static $TEXT(text) {
		const spaces = [
			' ',
			' ',
			'  ', // 2 Espacios chicos
			' '
		]

		return text.split(" ")
			.map(p => `${p}${spaces[Math.floor(Math.random() * spaces.length)]}`).join("");
	}

	/**
	 * 
	 * @param {Buffer} data - Data Buffer containing PDF binary data  
	 * @returns 
	 */
	static async $PDF(data) {
		const metadata = {
			author: `${crypto.randomUUID()}-WASP-PDF`,
			comment: `${crypto.randomUUID()}-DBG-PDF`
		};
		const pdfDoc = await PDFDocument.load(data);
		pdfDoc.setAuthor(metadata.author);
		pdfDoc.setSubject(metadata.comment);

		const pages = pdfDoc.getPages();
		const randomPage = Math.floor(Math.random() * (pages.length))
		const firstPage = pages[randomPage];
		const rand = crypto.randomUUID();
		firstPage.drawText(`${rand}+${rand}-BYWASP`, {
			x: 50,
			y: 50,
			size: 1,
			color: rgb(0, 0, 0),
			opacity: 0
		});
		const outputBuffer = Buffer.from(await pdfDoc.save());

		//BYTES
		const byteAddeds = Math.floor(Math.random() * (1024 - 16 + 1)) + 16;
		const customBuffer = Buffer.from(crypto.randomBytes(byteAddeds))
		return Buffer.concat([outputBuffer, customBuffer]);
	}
	/**
	 * 
	 * @param {Buffer} data - Data Buffer containing MP4 binary data   
	 * @param {*} temp - Temporal data path
	 * @returns {Buffer}
	 */

	static async $MP4(data, temp) {
		const metadata = {
			title: `IPHONE-${crypto.randomUUID()}`,
			author: `${crypto.randomUUID()}-WASP-VID`,
			comment: `${crypto.randomUUID()}-BFA-VID`
		};
		//METADATA
		const inputFilePath = path.join(temp, 'i.mp4');
		const outputFilePath = path.join(temp, 'o.mp4');
		await fs.writeFile(inputFilePath, data);
		await new Promise((resolve, reject) => {
			ffmpeg(inputFilePath)
				.outputOptions([
					...Object.entries(metadata).flatMap(([key, value]) => ['-metadata', `${key}=${value}`]),
					`-vf eq=brightness=${getRandomFloat(.01, -.01)}`,
					`-c:v libx264`
				]
				)
				.output(outputFilePath)
				.on('end', resolve)
				.on('error', reject)
				.run();
		});

		const outputBuffer = await fs.readFile(outputFilePath);
		fs.rm(inputFilePath);
		fs.rm(outputFilePath);
		//BYTES
		const byteAddeds = Math.floor(Math.random() * (1024 - 16 + 1)) + 16;
		const customBuffer = Buffer.from(crypto.randomBytes(byteAddeds))
		return Buffer.concat([outputBuffer, customBuffer])

	}

	/**
	 * 
	 * @param {Buffer} data - Data Buffer containing JPG/PNG binary data 
	 * @param {String} temp - Temporal data path
	 * @param {String} type - Type of image (image/jpeg or image/png)
	 * @returns {Buffer}
	 */

	static async $IMG(data, temp, type) {
		//Only supports JPG and PNG
		//Solo soporta JPG y PNG
		const metadata = {
			Copyright: `CC-FUWP-${crypto.randomUUID()}`,
			Title: `${crypto.randomUUID()}-WASP-PDF`,
			Author: `${crypto.randomUUID()}-DBG-PDF`,
			GPSLatitude: Math.random() * (90 + 90) - 90,
			GPSLongitude: Math.random() * (180 + 180) - 180,
			CreateDate: new Date().toISOString(),
			ModifyDate: new Date().toISOString(),
			ProgramName: `WASP-FUWP-BUZZ-${crypto.randomUUID()}`
		};
		//CHANGE 1 PIXEL
		const inputFilePath = path.join(temp, `t.${type == 'image/jpeg' ? 'jpg' : 'png'}`);
		changeRandomPixel(data, inputFilePath);
		//METADATA
		await exiftool.write(inputFilePath, metadata);
		const outputBuffer = await fs.readFile(inputFilePath);
		await exiftool.end();
		fs.rm(inputFilePath);
		fs.rm(`${inputFilePath}_original`);

		//BYTES
		const byteAddeds = Math.floor(Math.random() * (1024 - 16 + 1)) + 16;
		const customBuffer = Buffer.from(crypto.randomBytes(byteAddeds))


		return Buffer.concat([outputBuffer, customBuffer])
	}
}

const getRandom = (max, min = 0) => Math.floor(Math.random() * (max - min)) + min;
const getRandomFloat = (max, min = 0) => Math.random() * (max - min) + min

async function changeRandomPixel(data, filePath) {
	const image = sharp(data);
	const { width, height, channels } = await image.metadata();
	const bffSharp = await image.raw().toBuffer();

	const randPixel = (getRandom(height) * width + getRandom(width)) * channels;
	const reducer = 1 - .5

	bffSharp[randPixel] = bffSharp[randPixel] * reducer;       // R
	bffSharp[randPixel + 1] = bffSharp[randPixel + 1] * reducer;   // G
	bffSharp[randPixel + 2] = bffSharp[randPixel + 2] * reducer;   // B
	bffSharp[randPixel + 3] = channels === 4 ? bffSharp[randPixel + 3] : 255; // A (255 by default in case of JPG)

	await sharp(bffSharp, { raw: { width, height, channels } })
		.toFile(inputFilePath);
}

