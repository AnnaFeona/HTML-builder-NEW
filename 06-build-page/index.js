const fs = require('fs/promises');
const path = require('path');
const { copyDir } = require('../04-copy-directory/index');
const { mergeCSS } = require('../05-merge-styles/index');
const { stdout } = process;

const newFolder = path.join(__dirname, 'project-dist');
const assetsFolder = path.join(__dirname, 'assets');
const styleFolder = path.join(__dirname, 'styles');
const componentsFolder = path.join(__dirname, 'components');
const templateFile = path.join(__dirname, 'template.html');

buildHTML();

async function buildHTML() {
  await copyDir(assetsFolder, path.join(newFolder, 'assets'));
  await mergeCSS(styleFolder, newFolder, 'style.css');
  await bundleHtml();
}

async function bundleHtml() {
  try {
    const components = await fs.readdir(componentsFolder, {
      withFileTypes: true,
    });
    const componentsHtml = components.filter(
      (item) => path.extname(item.name) === '.html',
    );
    const componentsNames = componentsHtml.map((item) => item.name);
    const componentsKeys = componentsNames.map((item) =>
      item.replace('.html', ''),
    );

    const componentsContent = await Promise.all(
      componentsKeys.map((item) => {
        return fs.readFile(
          path.join(componentsFolder, item + '.html'),
          'utf-8',
        );
      }),
    );

    const content = componentsKeys.map((key, index) => {
      let obj = {};
      obj[key] = componentsContent[index];
      return obj;
    });
    const templateContent = await fs.readFile(templateFile, 'utf-8');
    let indexHtml = templateContent;

    content.forEach((item) => {
      for (let key in item) {
        indexHtml = indexHtml.replace(`{{${key}}}`, item[key]);
      }
    });

    await fs.writeFile(path.join(newFolder, 'index.html'), indexHtml);

    stdout.write('Html file have been modified');
  } catch (err) {
    throw new Error(`Error bunding: ${err.message}`);
  }
}
