import { BuildOptions } from 'esbuild';
import path from 'path';
import { commonConfig } from '.';

export default {
  platform: 'browser',
  entryPoints: [path.resolve(commonConfig.renderer.entryDir, 'index.tsx')],
  outdir: commonConfig.renderer.outputDir,
  bundle: true,
  target: 'chrome94', // electron version target
} as BuildOptions;
