const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..', 'scene');
const pngSignature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(fullPath) : [fullPath];
  });
}

function stripCabx(filePath) {
  const input = fs.readFileSync(filePath);
  if (!input.subarray(0, 8).equals(pngSignature)) return false;

  const chunks = [input.subarray(0, 8)];
  let offset = 8;
  let changed = false;

  while (offset + 12 <= input.length) {
    const length = input.readUInt32BE(offset);
    const type = input.toString('ascii', offset + 4, offset + 8);
    const end = offset + 12 + length;

    if (end > input.length) {
      throw new Error(`Invalid PNG chunk length in ${filePath}`);
    }

    if (type === 'caBX') {
      changed = true;
    } else {
      chunks.push(input.subarray(offset, end));
    }

    offset = end;
    if (type === 'IEND') break;
  }

  if (changed) {
    fs.writeFileSync(filePath, Buffer.concat(chunks));
  }

  return changed;
}

const changedFiles = walk(root)
  .filter((filePath) => filePath.toLowerCase().endsWith('.png'))
  .filter(stripCabx);

console.log(`Removed caBX chunks from ${changedFiles.length} PNG files.`);
