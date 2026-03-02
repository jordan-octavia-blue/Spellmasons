import * as fs from 'fs';
import * as path from 'path';
import { Jimp } from 'jimp';

interface Color {
    r: number;
    g: number;
    b: number;
}

interface ColorPair {
    from: Color;
    to: Color;
    minY?: number;
    maxY?: number;
}

/**
 * Swaps colors in PNG file(s) based on the provided color pairs
 * @param pathOrFilename - Path to a directory or a specific PNG file
 * @param pairs - Array of color pairs to swap (from -> to)
 */
async function colorSwap(pathOrFilename: string, pairs: ColorPair[]): Promise<void> {
    const stats = fs.statSync(pathOrFilename);

    if (stats.isDirectory()) {
        // Process all PNG files in directory
        const files = fs.readdirSync(pathOrFilename);
        const pngFiles = files.filter(file => path.extname(file).toLowerCase() === '.png');

        for (const file of pngFiles) {
            const fullPath = path.join(pathOrFilename, file);
            try {
                await processImage(fullPath, pairs);
            } catch (e) {
                console.error(`Error in file ${file}:`, e);
            }
        }

        console.log(`Processed ${pngFiles.length} PNG file(s) in directory: ${pathOrFilename}`);
    } else if (stats.isFile() && path.extname(pathOrFilename).toLowerCase() === '.png') {
        // Process single PNG file
        await processImage(pathOrFilename, pairs);
        console.log(`Processed PNG file: ${pathOrFilename}`);
    } else {
        throw new Error('Path must be a directory or a PNG file');
    }
}

/**
 * Process a single PNG image and swap colors
 */
async function processImage(filePath: string, pairs: ColorPair[]): Promise<void> {
    const image = await Jimp.read(filePath);

    image.scan(0, 0, image.bitmap.width, image.bitmap.height, function (x, y, idx) {
        const currentColor = {
            // @ts-ignore
            r: this.bitmap.data[idx],
            // @ts-ignore
            g: this.bitmap.data[idx + 1],
            // @ts-ignore
            b: this.bitmap.data[idx + 2]
        };

        // Check if current pixel matches any "from" color
        for (const pair of pairs) {
            if (colorsMatch(currentColor, pair.from)
                && (pair.minY === undefined || y >= pair.minY)
                && (pair.maxY === undefined || y <= pair.maxY)) {
                // @ts-ignore
                this.bitmap.data[idx] = pair.to.r;
                // @ts-ignore
                this.bitmap.data[idx + 1] = pair.to.g;
                // @ts-ignore
                this.bitmap.data[idx + 2] = pair.to.b;
                // Alpha channel (idx + 3) remains unchanged
                break; // Stop after first match
            }
        }
    });

    // @ts-ignore
    await image.write(filePath);
}

/**
 * Check if two colors match
 */
function colorsMatch(color1: Color, color2: Color): boolean {
    return color1.r === color2.r &&
        color1.g === color2.g &&
        color1.b === color2.b;
}



async function doSwap(name: string, pairs: ColorPair[]) {
    // await colorSwap(`./palettes/${name}.png`, pairs);
    await colorSwap(`.`, pairs)
}

async function main() {

    await doSwap('warden', [
        // cowl: fcffc8 -> 8c3b3b (only y >= 51 to distinguish from face)
        { from: { r: 0xfc, g: 0xff, b: 0xc8 }, to: { r: 0x8c, g: 0x3b, b: 0x3b }, minY: 51 },
        // face: fcffc8 -> 8fd69c (y < 51)
        { from: { r: 0xfc, g: 0xff, b: 0xc8 }, to: { r: 0x8f, g: 0xd6, b: 0x9c }, maxY: 50 },
        // arms: a6b671 -> 42b657
        { from: { r: 0xa6, g: 0xb6, b: 0x71 }, to: { r: 0x42, g: 0xb6, b: 0x57 } },
        // thigh: bfc280 -> 4ebf63
        { from: { r: 0xbf, g: 0xc2, b: 0x80 }, to: { r: 0x4e, g: 0xbf, b: 0x63 } },
        // leg: a1a466 -> 3ca74f
        { from: { r: 0xa1, g: 0xa4, b: 0x66 }, to: { r: 0x3c, g: 0xa7, b: 0x4f } },
        // back leg: 808344 -> 30843f
        { from: { r: 0x80, g: 0x83, b: 0x44 }, to: { r: 0x30, g: 0x84, b: 0x3f } },
    ]);


}
main();

export { colorSwap, Color, ColorPair };