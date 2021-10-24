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
  target: 'node16.5.0', // electron version target
} as BuildOptions;
