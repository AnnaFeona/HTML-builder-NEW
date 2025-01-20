const fs = require('fs/promises');
const path = require('path');

const folder = path.join(__dirname, 'files');
const newFolder = path.join(__dirname, 'files-copy');

copyDir(folder, newFolder);

async function copyDir(folder, newFolder) {
  await fs.mkdir(newFolder, { recursive: true });

  const files = await fs.readdir(folder, { withFileTypes: true });
  const newFiles = await fs.readdir(newFolder, { withFileTypes: true });

  if (newFiles.length) {
    await Promise.all(
      newFiles.map((item) => {
        return fs.rm(path.join(newFolder, item.name), { recursive: true });
      }),
    );
  }

  await Promise.all(
    files.map((item) => {
      if (item.isDirectory()) {
        return copyDir(
          path.join(folder, item.name),
          path.join(newFolder, item.name),
        );
      } else {
        return fs.copyFile(
          path.join(folder, item.name),
          path.join(newFolder, item.name),
        );
      }
    }),
  );
  console.log('Folder have been sucsessfully copied.');
}

exports.copyDir = copyDir;
