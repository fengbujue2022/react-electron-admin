import { BuildOptions } from 'esbuild';
import path from 'path';

const mainDir = path.resolve(process.cwd(), 'src');

export default {
  platform: 'node',
  entryPoints: [
    path.resolve(mainDir, 'main.ts'),
    path.resolve(mainDir, 'preload.ts'),
  ],
  bundle: true,
  target: 'node14.16.0', // electron version target
  loader: {
    '.ts': 'ts',
  },
} as BuildOptions;
