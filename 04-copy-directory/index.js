/* eslint-disable indent */
const fs = require('fs/promises');
const path = require('path');
const { stdout } = require('process');

const folder = path.join(__dirname, 'files');
const newFolder = path.join(__dirname, 'files-copy');

copyDir(folder, newFolder);

async function copyDir(folder, newFolder) {
  try {
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
        item.isDirectory()
          ? copyDir(
              path.join(folder, item.name),
              path.join(newFolder, item.name),
            )
          : fs.copyFile(
              path.join(folder, item.name),
              path.join(newFolder, item.name),
            );
      }),
    );

    stdout.write('Folder have been sucsessfully copied.');
  } catch (err) {
    throw new Error(`Error copying folder: ${err.message}`);
  }
}

exports.copyDir = copyDir;
