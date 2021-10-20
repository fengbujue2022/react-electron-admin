import { createDevServer } from '@react-electron-admin/esbuild-devserver';
import path from 'path';
import { BuildIncremental, build, default as esbuild } from 'esbuild';
import chokidar from 'chokidar';
import {
  esbuildRenderConfig,
  esbuildMainConfig,
  commonConfig,
} from '../configs';
import { getDeps } from '../utils/deps';
import { debounce } from '../utils/debounce';
import ElectronProcess from './electron-process';

async function startRenderer() {
  const { port, html, entryDir } = commonConfig.renderer;

  const builder: BuildIncremental = await build({
    ...esbuildRenderConfig,
    incremental: true,
    plugins: [
      createDevServer({
        port,
        watchDir: entryDir,
        htmlPath: html,
        onload: async () => {
          if (builder) {
            await builder.rebuild();
          }
        },
      }),
    ],
  });
}

const electronProcess = new ElectronProcess();

async function startMain() {
  const { entryDir } = commonConfig.main;

  const builder: BuildIncremental = await build({
    ...esbuildMainConfig,
    incremental: true,
  });

  electronProcess.start();

  const sources = path.join(
    path.resolve(path.dirname(entryDir)),
    '**',
    '*.{js,ts,tsx}'
  );
  let watcher = chokidar.watch([sources, ...getDeps(path.resolve(entryDir))]);

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
