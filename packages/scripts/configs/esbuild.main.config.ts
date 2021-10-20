import { BuildOptions } from 'esbuild';
import path from 'path';
import { commonConfig } from '.';

export default {
  platform: 'node',
  entryPoints: [
    path.resolve(commonConfig.main.entryDir, 'main.ts'),
    path.resolve(commonConfig.main.entryDir, 'preload.ts'),
  ],
  outdir: commonConfig.main.outputDir,
  bundle: true,
  target: 'node14.16.0', // electron version target
  loader: {
    '.ts': 'ts',
  },
} as BuildOptions;
