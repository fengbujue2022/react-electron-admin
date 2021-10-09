import { BuildOptions } from 'esbuild';
import path from 'path';

const rendererDir = path.resolve(process.cwd(), 'src');
export default {
  platform: 'browser',
  entryPoints: [path.resolve(rendererDir, 'index.tsx')],
  bundle: true,
  target: 'chrome89', // electron version target
} as BuildOptions;
