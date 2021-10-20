import { Plugin, PluginBuild } from 'esbuild';
import connect from 'connect';
import compression from 'compression';
import { promises as fs } from 'fs';
import { createServer } from 'http';
import chokidar from 'chokidar';
import path from 'path';

export interface DevServerOptions {
  port: number;
  htmlEntryPath: string;
  htmlOutputDir: string;
  watchDir: string;
  onload: () => void | Promise<void>;
}

export const createDevServer = (options: DevServerOptions) => {
  return {
    name: 'esbuild-devserver',
    setup: async (build: PluginBuild) => {
      await bootstrapDevServer(options);
    },
  } as Plugin;
};

const bootstrapDevServer = async (options: DevServerOptions) => {
  const _copyHtml = async function (entryPath: string, outputDir: string) {
    await fs.copyFile(
      entryPath,
      path.join(outputDir, path.basename(entryPath))
    );
  };

  // TODO : feature: support hot reload
  const { port, htmlEntryPath, htmlOutputDir, watchDir, onload } = options;
  const html = (await fs.readFile(htmlEntryPath)).toString();

  await _copyHtml(htmlEntryPath, htmlOutputDir);

  var listener = connect();
  listener.use(compression() as any);
  listener.use((req, res) => {
    res.setHeader('Content-Type', 'text/html');
    res.writeHead(200);
    res.end(html);
  });

  const httpServer = createServer(listener);
  httpServer.listen(port);

  const sources = `${watchDir}/**/*.{js,jsx,ts,tsx,css,scss}`;
  const watcher = chokidar.watch(sources, { disableGlobbing: false });
  watcher.on('ready', () => {
    watcher.on('all', async (eventName, file) => {
      onload();
    });
  });

  process.on('exit', async () => {
    httpServer.close();
    watcher.close();
  });
};
