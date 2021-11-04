import chalk from 'chalk';
import { BuildOptions, Plugin, PluginBuild } from 'esbuild';
import { Server } from 'http';
import Koa, { DefaultContext, DefaultState } from 'koa';
import { promisify } from 'util';
import { logger } from './logger';
import * as middleware from './middleware';
import chokidar from 'chokidar';

export interface DevServerOptions {
  port: number;
  watchDir: string;
  onload: () => void | Promise<void>;
}

export const createDevServer = (options: DevServerOptions) => {
  return {
    name: 'esbuild-devserver',
    setup: async (build: PluginBuild) => {
      const { port, watchDir, onload } = options;

      let server = new Server();
      var app = createDevApp(build.initialOptions);
      server.on('request', app.callback());

      await promisify(server.listen.bind(server) as any)(port);

      logger.log(
        `Listening on ${chalk.cyan.underline(`http://localhost:${port}`)}`
      );

      const sources = `${watchDir}/**/*.{js,jsx,ts,tsx,css,scss}`;
      const watcher = chokidar.watch(sources);
      watcher.on('ready', () => {
        watcher.on('all', async (eventName, file) => {
          onload();
        });
      });

      process.on('exit', async () => {
        server.close();
        watcher.close();
      });
    },
  } as Plugin;
};

export const createDevApp = function (options: BuildOptions) {
  const app = new Koa<DefaultState, DefaultContext>();
  app.use(middleware.staticServeMiddleware({ root: options.outdir }));
  return app;
};
