const fs = require('fs');
const path = require('path');
const { stdout } = require('process');

const secretFolder = path.join(__dirname, 'secret-folder');

fs.readdir(secretFolder, { withFileTypes: true }, (err, files) => {
  if (err) {
    throw new Error(`Error reading the folder: ${err.message}`);
  }
  files.forEach((file) => {
    if (!file.isDirectory()) {
      fs.stat(path.join(secretFolder, file.name), (err, el) => {
        if (err) {
          throw new Error(`Error reading the file: ${err.message}`);
        }
        const fileExt = path.extname(file.name);
        const fileName = path.basename(file.name, fileExt);
        const fileSize = (el.size / 1000).toFixed(2);

        const output = [
          fileName,
          fileExt.replace('.', ''),
          fileSize + ' kb\n',
        ].join(' - ');

        stdout.write(output);
      });
    }
  });
});
