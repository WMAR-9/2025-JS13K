import fs from 'fs';
import archiver from 'archiver';

const zipPath = "./jumpcat/"
const outputPath = "./zip/distJS.zip"

const output = fs.createWriteStream(outputPath);

console.log(`🔄 Start archiver zip  ${zipPath} → ${outputPath}...`)
const archive = archiver('zip', {
  zlib: { level: 9 }
});

output.on('close', () => {
  console.log(`📦 JS ZIP finish → ${archive.pointer()/1024|0} KB`);
  console.log(`=========`)
});

archive.on('warning', err => {
  if (err.code === 'ENOENT') {
    console.warn('File not found:', err);
  } else {
    throw err;
  }
});

archive.on('error', err => {
  throw err;
});

archive.pipe(output);
archive.directory(zipPath, false);
archive.finalize();