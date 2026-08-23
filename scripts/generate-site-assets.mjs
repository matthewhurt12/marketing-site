import sharp from "sharp";
import { fileURLToPath } from "node:url";
import path from "node:path";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const publicDir = path.join(projectRoot, "public");
const logoPath = path.join(publicDir, "logo.png");

const iconSizes = [16, 32, 180, 192, 512];
const iconNames = new Map([
  [16, "favicon-16.png"],
  [32, "favicon-32.png"],
  [180, "apple-touch-icon.png"],
  [192, "icon-192.png"],
  [512, "icon-512.png"],
]);

await Promise.all(
  iconSizes.map((size) =>
    sharp(logoPath)
      .resize(size, size, { fit: "cover" })
      .flatten({ background: "#120c29" })
      .png({ compressionLevel: 9, palette: size <= 32 })
      .toFile(path.join(publicDir, iconNames.get(size))),
  ),
);

await sharp(logoPath)
  .resize(192, 192, { fit: "cover" })
  .png({ compressionLevel: 9 })
  .toFile(path.join(publicDir, "brand-mark-192.png"));

const shareBackground = Buffer.from(`
  <svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="1200" y2="630" gradientUnits="userSpaceOnUse">
        <stop stop-color="#17103A"/>
        <stop offset="0.52" stop-color="#291A57"/>
        <stop offset="1" stop-color="#5B244F"/>
      </linearGradient>
      <radialGradient id="pink" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(1070 70) rotate(137) scale(510 420)">
        <stop stop-color="#F581B7" stop-opacity="0.54"/>
        <stop offset="1" stop-color="#F581B7" stop-opacity="0"/>
      </radialGradient>
      <radialGradient id="blue" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(210 610) rotate(-58) scale(520 420)">
        <stop stop-color="#6EC8F2" stop-opacity="0.42"/>
        <stop offset="1" stop-color="#6EC8F2" stop-opacity="0"/>
      </radialGradient>
      <filter id="blur" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="54"/>
      </filter>
    </defs>
    <rect width="1200" height="630" rx="0" fill="url(#bg)"/>
    <rect width="1200" height="630" fill="url(#pink)"/>
    <rect width="1200" height="630" fill="url(#blue)"/>
    <circle cx="235" cy="315" r="175" fill="#C69BFF" fill-opacity="0.12" filter="url(#blur)"/>
    <rect x="54" y="54" width="1092" height="522" rx="40" fill="none" stroke="#FFFFFF" stroke-opacity="0.13" stroke-width="2"/>
    <text x="405" y="190" fill="#F3B9D7" font-family="Arial, Helvetica, sans-serif" font-size="18" font-weight="700" letter-spacing="5">IN PERSON · AI MATCHMAKING</text>
    <text x="402" y="285" fill="#F8F5FF" font-family="Georgia, 'Times New Roman', serif" font-size="61" font-weight="700" letter-spacing="-1.5">Less swiping.</text>
    <text x="402" y="352" fill="#F8F5FF" font-family="Georgia, 'Times New Roman', serif" font-size="61" font-weight="700" font-style="italic" letter-spacing="-1.5">More actual dates.</text>
    <text x="408" y="430" fill="#D7D0E8" font-family="Arial, Helvetica, sans-serif" font-size="24">Meet your AI matchmaker.</text>
    <text x="410" y="510" fill="#CDB6FF" font-family="Arial, Helvetica, sans-serif" font-size="19" font-weight="700" letter-spacing="3">TRYINPERSON.COM</text>
  </svg>
`);

const shareLogo = await sharp(logoPath)
  .resize(248, 248, { fit: "cover" })
  .png()
  .toBuffer();

await sharp(shareBackground)
  .composite([{ input: shareLogo, left: 111, top: 191 }])
  .png({ compressionLevel: 9 })
  .toFile(path.join(publicDir, "inperson-share-v3-2026.png"));

console.log("Generated In Person social preview and install icon assets.");
