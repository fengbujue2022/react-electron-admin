import { BuildOptions } from 'esbuild';
import path from 'path';
import { commonConfig } from '.';

export default {
  platform: 'browser',
  entryPoints: [path.resolve(commonConfig.renderer.srcDir, 'index.tsx')],
  outdir: commonConfig.renderer.outputDir,
  bundle: true,
  external: ['domain'],
  target: 'chrome94', // electron version target
} as BuildOptions;
