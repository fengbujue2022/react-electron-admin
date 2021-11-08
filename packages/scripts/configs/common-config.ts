import path from 'path';

const popToParentDir = (dir: string, deep: number) => {
  deep = deep < 0 ? 0 : deep;
  const dirArr = dir.split(path.sep);
  return dirArr.slice(0, dirArr.length - deep).join(path.sep);
};

const packagesDir = popToParentDir(process.cwd(), 1);

const mainDir = path.resolve(packagesDir, 'main');
const rendererDir = path.resolve(packagesDir, 'renderer');

export const commonConfig = {
  main: {
    dir: mainDir,
    srcDir: path.resolve(mainDir, 'src'),
    outputDir: path.resolve(mainDir, 'dist'),
  },
  renderer: {
    host: 'localhost',
    port: 2233,
    dir: rendererDir,
    srcDir: path.resolve(rendererDir, 'src'),
    outputDir: path.resolve(rendererDir, 'dist'),
    html: path.resolve(rendererDir, 'src/index.html'),
  },
};
