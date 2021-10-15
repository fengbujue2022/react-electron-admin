import { Plugin, PluginBuild } from 'esbuild';
import connect from 'connect';
import compression from 'compression';
import { promises as fs } from 'fs';
import { createServer } from 'http';
import chokidar from 'chokidar';

export interface DevServerOptions {
  port: number;
  htmlPath: string;
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
  // TODO : feature: support hot reload
  const { port, htmlPath, watchDir, onload } = options;
  const html = (await fs.readFile(htmlPath)).toString();

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
