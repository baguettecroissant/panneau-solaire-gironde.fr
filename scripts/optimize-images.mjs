import { readdir, rename } from 'node:fs/promises';
import { resolve } from 'node:path';
import sharp from 'sharp';

const directory = resolve('public/images');
const files = (await readdir(directory)).filter((file) => file.endsWith('.png'));

for (const file of files) {
	const input = resolve(directory, file);
	const temporary = resolve(directory, `${file}.optimized`);
	await sharp(input)
		.resize({ width: 1600, withoutEnlargement: true })
		.png({
			compressionLevel: 9,
			palette: true,
			quality: 88,
			colours: 256,
			adaptiveFiltering: true,
		})
		.toFile(temporary);
	await rename(temporary, input);
	await sharp(input)
		.webp({ quality: 82, effort: 6, smartSubsample: true })
		.toFile(input.replace(/\.png$/, '.webp'));
	console.log(`Optimisé : ${file}`);
}
