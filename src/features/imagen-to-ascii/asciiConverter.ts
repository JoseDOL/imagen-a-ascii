// asciiConverter.ts
const DEFAULT_CHARS = '@%#*+=-:. '.split('').reverse().join(''); // caracteres de más oscuro → más claro

export function imageToAscii(
    img: HTMLImageElement,
    config: {
        width: number;
        height?: number;        // si no se pasa → se calcula por ratio
        chars?: string;
        invert?: boolean;
    } = {
            width: 80,
            chars: DEFAULT_CHARS,
            invert: false,
        }
): string {
    const chars = config.chars || DEFAULT_CHARS;
    const charArray = config.invert ? chars.split('').reverse() : chars.split('');

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;

    let w = config.width;
    let h = config.height || Math.round((img.height / img.width) * w * 0.55); // ratio ~0.55 para monospaced

    canvas.width = w;
    canvas.height = h;
    ctx.drawImage(img, 0, 0, w, h);

    const imageData = ctx.getImageData(0, 0, w, h).data;
    let ascii = '';

    for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
            const idx = (y * w + x) * 4;
            const r = imageData[idx];
            const g = imageData[idx + 1];
            const b = imageData[idx + 2];
            // luminancia simple (0-255)
            const brightness = 0.299 * r + 0.587 * g + 0.114 * b;
            // mapear a 0 .. length-1
            const index = Math.floor((brightness / 255) * (charArray.length - 1));
            ascii += charArray[index];
        }
        ascii += '\n';
    }

    return ascii;
}