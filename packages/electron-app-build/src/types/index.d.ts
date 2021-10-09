export type BuilderTarget = 'renderer' | 'main';
export type BuilderType = 'esbuild';

export interface BuildConfig {
  target: BuilderTarget;
  type: BuilderType;
  configPath: string;
  src: string;
  html: string;
  output: string;
  port: number;
  host: string;
}
