import fs from 'fs';
import { ZipArchive } from 'archiver';

const output = fs.createWriteStream('deploy.zip');
const archive = new ZipArchive({
  zlib: { level: 9 }
});

output.on('close', function() {
  console.log(archive.pointer() + ' total bytes');
  console.log('archiver has been finalized and the output file descriptor has closed.');
});

archive.on('error', function(err) {
  throw err;
});

archive.pipe(output);
archive.directory('dist/', false);
archive.finalize();
