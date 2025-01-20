const fs = require('fs');
const path = require('path');
const { stdin, stdout, exit } = require('process');

const fileName = path.join(__dirname, 'output.txt');
const outputStream = fs.createWriteStream(fileName);

stdout.write('Hello! Enter your text:\n');
stdin.on('data', (data) => {
  if (data.toString().toLowerCase().match('exit')) {
    Exit();
  }
  outputStream.write(data);
});

process.on('SIGINT', Exit);

function Exit() {
  stdout.write('Thank you! Goodbye!');
  outputStream.end();
  exit();
}
