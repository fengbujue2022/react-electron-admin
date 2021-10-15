import { BuildOptions } from 'esbuild';
import path from 'path';
import { commonConfig } from '.';

export default {
  platform: 'browser',
  entryPoints: [path.resolve(commonConfig.renderer.entryDir, 'index.tsx')],
  bundle: true,
  target: 'chrome89', // electron version target
} as BuildOptions;
