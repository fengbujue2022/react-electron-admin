import { createDevServer } from '@react-electron-admin/esbuild-devserver';
import path from 'path';
import { promises as fs } from 'fs';
import { BuildIncremental, default as esbuild } from 'esbuild';
import chokidar from 'chokidar';
import {
  esbuildRenderConfig,
  esbuildMainConfig,
  commonConfig,
} from '../configs';
import { getDeps } from '../utils/deps';
import { debounce } from '../utils/debounce';

async function startRenderer() {
  const _copyHtml = async function (output: string, html: string) {
    if (html) {
      const outPath = path.resolve(process.cwd(), output);
      const htmlPath = path.resolve(process.cwd(), html);
      await fs.copyFile(htmlPath, path.join(outPath, path.basename(html)));
    }
  };

  const builder: BuildIncremental = await esbuild.build({
    ...esbuildRenderConfig,
    incremental: true,
    plugins: [
      createDevServer({
        port: 2233,
        watchDir: '',
        htmlPath: '',
        onload: async () => {
          if (builder) {
            await builder.rebuild();
          }
        },
      }),
    ],
  });
  await _copyHtml(commonConfig.renderer.outputDir, commonConfig.renderer.html);
}

async function startMain() {
  const sources = path.join(
    path.resolve(path.dirname(commonConfig.main.entryDir)),
    '**',
    '*.{js,ts,tsx}'
  );
  let watcher = chokidar.watch([
    sources,
    ...getDeps(path.resolve(commonConfig.main.entryDir)),
  ]);

  watcher.on('ready', () => {
    watcher.on('all', () => {
      debounce(() => {
        watcher.close();
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
