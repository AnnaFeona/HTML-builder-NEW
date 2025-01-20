const fs = require('fs/promises');
const path = require('path');
const { stdout } = process;

const folder = path.join(__dirname, 'styles');
const newFolder = path.join(__dirname, 'project-dist');

mergeCSS(folder, newFolder, 'bundle.css');

async function mergeCSS(folder, newFolder, fileName) {
  try {
    const files = await fs.readdir(folder, { withFileTypes: true });
    const cssFiles = files.filter(
      (item) => path.extname(item.name) === '.css' && !item.isDirectory(),
    );

    const content = await Promise.all(
      cssFiles.map((item) => fs.readFile(path.join(folder, item.name))),
    );

    await fs.writeFile(path.join(newFolder, fileName), content.join('\n'));

    stdout.write('File bundle.css has been successfully created.\n');
  } catch (err) {
    throw new Error(`Error merging CSS: ${err.message}`);
  }
}

exports.mergeCSS = mergeCSS;
