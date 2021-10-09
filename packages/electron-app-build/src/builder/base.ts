import { BuilderTarget } from '../types';

export interface Builder {
  target: BuilderTarget;
  hasInitialBuild: boolean;

  build(): Promise<void>;
  dev(start: () => void): void;
}
