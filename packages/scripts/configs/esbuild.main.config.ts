import { BuildOptions } from 'esbuild';
import path from 'path';
import { commonConfig } from '.';
import nodeModule from 'module';

const { srcDir, outputDir } = commonConfig.main;

export default {
  platform: 'node',
  entryPoints: [
    path.resolve(srcDir, 'main.ts'),
    path.resolve(srcDir, 'preload.ts'),
  ],
  define: {
    'process.env.NODE_ENV': `'${process.env.NODE_ENV}'`,
  },
  outdir: outputDir,
  bundle: true,
  external: ['electron', nodeModule.builtinModules],
  target: 'node16.5.0', // electron version target
} as BuildOptions;
