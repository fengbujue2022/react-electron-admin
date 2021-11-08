import { BuildOptions } from 'esbuild';
import path from 'path';
import { commonConfig } from '.';
import nodeModule from 'module';

console.log(
  commonConfig.main.dir,
  path.resolve(commonConfig.main.dir, 'tsconfig.json')
);

export default {
  platform: 'node',
  entryPoints: [
    path.resolve(commonConfig.main.srcDir, 'main.ts'),
    path.resolve(commonConfig.main.srcDir, 'preload.ts'),
  ],
  define: {
    'process.env.NODE_ENV': `'${process.env.NODE_ENV}'`,
  },
  outdir: commonConfig.main.outputDir,
  bundle: true,
  external: ['electron', nodeModule.builtinModules],
  target: 'node16.5.0', // electron version target
} as BuildOptions;
