import { createDevServer } from '@react-electron-admin/esbuild-devserver';
import path from 'path';
import { BuildIncremental, build } from 'esbuild';
import chokidar from 'chokidar';
import {
  esbuildRenderConfig,
  esbuildMainConfig,
  commonConfig,
} from '../configs';
import { getDeps } from '../utils/deps';
import { debounce } from '../utils/debounce';
import ElectronProcess from './electron-process';
import { promises as fs } from 'fs';
import { delay } from '../utils/promise';

async function startRenderer() {
  const { port, html, outputDir, srcDir } = commonConfig.renderer;
  const _copyHtml = async function (entryPath: string, outputDir: string) {
    await fs.copyFile(
      entryPath,
      path.join(outputDir, path.basename(entryPath))
    );
  };

  const builder: BuildIncremental = await build({
    ...esbuildRenderConfig,
    incremental: true,
    plugins: [
      createDevServer({
        port,
        watchDir: srcDir,
        onload: async () => {
          if (builder) {
            await builder.rebuild();
          }
        },
      }),
    ],
  });
  _copyHtml(html, outputDir);
}

const electronProcess = new ElectronProcess();

async function startMain() {
  const { srcDir } = commonConfig.main;

  await delay(500);
  const builder: BuildIncremental = await build({
    ...esbuildMainConfig,
    incremental: true,
  });

  electronProcess.start();

  const sources = path.join(
    path.resolve(path.dirname(srcDir)),
    '**',
    '*.{js,ts,tsx}'
  );
  let watcher = chokidar.watch([sources, ...getDeps(path.resolve(srcDir))]);

  watcher.on('ready', () => {
    watcher.on('all', () => {
      debounce(() => {
        builder.rebuild();
      }, 200);
    });
  });

  process.on('exit', async () => {
    await watcher.close();
  });
}

function launchDevServer() {
  startRenderer();
  startMain();
}

launchDevServer();
