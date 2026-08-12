/**
 * Renders the app icons from the theme tokens in `app/globals.css`, so the
 * installed app's icon always matches the palette the site actually uses.
 *
 *   npm run icons
 *
 * Outputs to `public/icons/`. Re-run after changing --background or --primary.
 */
import { mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

import sharp from 'sharp';

const outDir = path.join(
    path.dirname(fileURLToPath(import.meta.url)),
    '..',
    'public',
    'icons'
);

// --- oklch() -> #rrggbb ----------------------------------------------------
// Same conversion browsers apply, so the PNGs match the CSS exactly.

function oklchToHex(lightness, chroma, hueDegrees) {
    const hue = (hueDegrees * Math.PI) / 180;
    const a = chroma * Math.cos(hue);
    const b = chroma * Math.sin(hue);

    const l = (lightness + 0.3963377774 * a + 0.2158037573 * b) ** 3;
    const m = (lightness - 0.1055613458 * a - 0.0638541728 * b) ** 3;
    const s = (lightness - 0.0894841775 * a - 1.291485548 * b) ** 3;

    const linear = [
        4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
        -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
        -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
    ];

    return `#${linear
        .map((channel) => {
            const encoded =
                channel <= 0.0031308
                    ? 12.92 * channel
                    : 1.055 * channel ** (1 / 2.4) - 0.055;
            const byte = Math.round(Math.min(1, Math.max(0, encoded)) * 255);
            return byte.toString(16).padStart(2, '0');
        })
        .join('')}`;
}

// Mirrors the `.dark` block in app/globals.css.
const background = oklchToHex(0.14, 0.012, 175);
const surface = oklchToHex(0.24, 0.03, 168);
const primary = oklchToHex(0.87, 0.16, 96);

/**
 * @param inset Fraction of the canvas kept clear around the mark. Maskable
 *   icons need the artwork inside the middle 80%, since launchers crop to
 *   whatever shape they like.
 */
function icon({ size, inset, rounded }) {
    const center = size / 2;
    const scale = size * (1 - inset * 2);
    const ringRadius = scale * 0.3;
    const ringWidth = Math.max(2, scale * 0.07);
    const play = scale * 0.17;

    return Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${surface}"/>
      <stop offset="1" stop-color="${background}"/>
    </linearGradient>
    <radialGradient id="glow" cx="0.5" cy="0.42" r="0.5">
      <stop offset="0" stop-color="${primary}" stop-opacity="0.28"/>
      <stop offset="1" stop-color="${primary}" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="${size}" height="${size}" ${rounded ? `rx="${size * 0.22}"` : ''} fill="url(#bg)"/>
  <rect width="${size}" height="${size}" ${rounded ? `rx="${size * 0.22}"` : ''} fill="url(#glow)"/>
  <circle cx="${center}" cy="${center}" r="${ringRadius}" fill="none" stroke="${primary}" stroke-width="${ringWidth}"/>
  <path d="M ${center - play * 0.55} ${center - play} L ${center + play * 0.95} ${center} L ${center - play * 0.55} ${center + play} Z"
        fill="${primary}" stroke="${primary}" stroke-width="${ringWidth * 0.5}" stroke-linejoin="round"/>
</svg>`);
}

const targets = [
    { file: 'icon-192.png', size: 192, inset: 0.16, rounded: true },
    { file: 'icon-512.png', size: 512, inset: 0.16, rounded: true },
    // Maskable: full-bleed square, artwork pulled into the safe zone.
    { file: 'icon-192-maskable.png', size: 192, inset: 0.26, rounded: false },
    { file: 'icon-512-maskable.png', size: 512, inset: 0.26, rounded: false },
    // iOS applies its own mask and does not honour transparency.
    { file: 'apple-touch-icon.png', size: 180, inset: 0.18, rounded: false },
];

await mkdir(outDir, { recursive: true });

for (const { file, size, inset, rounded } of targets) {
    const png = await sharp(icon({ size, inset, rounded })).png().toBuffer();
    await writeFile(path.join(outDir, file), png);
    console.log(`${file.padEnd(26)} ${size}x${size}`);
}

console.log(
    `\nPalette — background ${background}, surface ${surface}, primary ${primary}`
);
