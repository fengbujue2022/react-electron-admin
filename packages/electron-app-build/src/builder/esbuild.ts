import chokidar from 'chokidar';
import deepMerge from 'deepmerge';
import compression from 'compression';
import connect from 'connect';
import debounce from 'debounce-fn';
import path from 'path';
import httpProxy from 'http-proxy';
import { createServer } from 'http';
import { promises as fs } from 'fs';
import { BuildIncremental, BuildOptions, build, serve } from 'esbuild';
import { Builder } from './base';
import { getDeps } from '../utils/deps';
import { BuildConfig } from '../types';

export const createEsBuildBuilder = function (
  buildOptions: BuildOptions,
  config: BuildConfig
): Builder {
  let builder: BuildIncremental;
  const hasInitialBuild = true;

  const target = config.target;
  const additionalOptions = _getAdditionalOptions(buildOptions, config);
  buildOptions = deepMerge(buildOptions, additionalOptions, { clone: false });

  const esBuildBuilder = {
    target: target,
    hasInitialBuild,
    build: async () => {
      if (builder) {
        await builder.rebuild();
      } else {
        builder = await build({ ...buildOptions, incremental: true });
        await _copyHtml(config.output, config.html);
      }
    },
    dev: (start: () => void) => {
      if (target === 'main') {
        const sources = path.join(
          path.resolve(path.dirname(config.src)),
          '**',
          '*.{js,ts,tsx}'
        );
        const watcher = chokidar.watch([
          sources,
          ...getDeps(path.resolve(config.src)),
        ]);

        watcher.on('ready', () => {
          watcher.on(
            'all',
            debounce(
              async () => {
                await esBuildBuilder.build();

                start();

                await watcher.close();
                esBuildBuilder.dev(start);
              },
              { wait: 200 }
            )
          );
        });

        process.on('exit', async () => {
          await watcher.close();
        });
      } else if (target === 'renderer') {
        const srcDir = path.resolve(process.cwd(), path.dirname(config.src));

        serve(
          {
            port: 3322,
            host: 'localhost',
          },
          buildOptions
        ).then(async (server) => {
          const htmlPath = path.resolve(process.cwd(), config.html);
          const html = (await fs.readFile(htmlPath)).toString();

          const proxy = httpProxy.createProxy({
            target: 'http://localhost:3322',
          });

          const handler = connect();

          handler.use(compression() as never);
          handler.use((req, res) => {
            if (req.url === '/' || req.url === '') {
              res.setHeader('Content-Type', 'text/html');
              res.writeHead(200);
              res.end(html);
            } else {
              proxy.web(req, res);
            }
          });

          const httpServer = createServer(handler);

          const sources = `${srcDir}/**/*.{js,jsx,ts,tsx,css,scss}`;
          const watcher = chokidar.watch(sources, { disableGlobbing: false });

          watcher.on('ready', () => {
            watcher.on('all', async (eventName, file) => {
              //TODO
            });
          });

          process.on('exit', async () => {
            httpServer.close();
            server.stop();
          });

          httpServer.listen(config.port);
        });
      }
    },
  };

  return esBuildBuilder;
};

const _getAdditionalOptions = function (
  buildOptions: BuildOptions,
  config: BuildConfig
) {
  const out = path.resolve(
    process.cwd(),
    config.output,
    config.target === 'main' ? 'main.js' : 'index.js'
  );

  const options: Partial<BuildOptions> = {};
  if (buildOptions.entryPoints?.length ?? 1 > 1) {
    options.outdir = path.dirname(out);
  } else {
    options.outfile = out;
  }
  options.external = ['electron'];
  options.incremental = true;
  options.define = {
    'process.env.NODE_ENV': `'${process.env.NODE_ENV}'`,
  };

  return options;
};

const _copyHtml = async function (output: string, html: string) {
  if (html) {
    const outPath = path.resolve(process.cwd(), output);
    const htmlPath = path.resolve(process.cwd(), html);

    await fs.copyFile(htmlPath, path.join(outPath, path.basename(html)));
  }
};
