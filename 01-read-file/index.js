const fs = require('fs');
const path = require('path');
const fileName = path.join(__dirname, 'text.txt');
const inputStream = fs.createReadStream(fileName);

inputStream.on('data', (chunk) => {
  process.stdout.write(chunk);
});

inputStream.on('error', (err) => {
  console.error('Error reading the file:', err.message);
});
