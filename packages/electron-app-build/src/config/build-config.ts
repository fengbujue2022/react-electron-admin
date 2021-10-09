import fs from 'fs';
import path from 'path';
import has from 'has';
import yaml from 'js-yaml';
import { buildSync } from 'esbuild';
import { Builder } from '../builder/base';
import { createEsBuildBuilder } from '../builder/esbuild';
import { BuildConfig } from '../types';

export function loadBuildConfig(file: string): BuildConfig {
  let fileContent = '';
  try {
    fileContent = fs.readFileSync(path.resolve(file)).toString();
  } catch (e) {
    console.log(e);
  }
  const config = yaml.load(fileContent);
  return config as BuildConfig;
}

export function toBuilder(config: BuildConfig): Builder {
  const userConfig = _buildUserConfig(_resolve(config.configPath));

  let builder: Builder;
  switch (config.type) {
    case 'esbuild':
      builder = createEsBuildBuilder(userConfig, config);
      break;
    default:
      throw new Error('unsupported builder type!');
  }
  return builder;
}

function _resolve(...paths: string[]) {
  return path.resolve(process.cwd(), ...paths);
}

function _requireUncached(module: string) {
  delete require.cache[require.resolve(module)];
  return require(module);
}

function _buildUserConfig(configPath: string) {
  const out = _resolve('out.js');
  buildSync({
    target: 'node14',
    outfile: out,
    entryPoints: [configPath],
    platform: 'node',
    format: 'cjs',
  });

  const removeOut = () => {
    try {
      fs.unlinkSync(out);
    } catch {
      // Silent error
    }
  };
  try {
    let userConfig = _requireUncached(out);

    if (has(userConfig, 'default')) {
      userConfig = userConfig.default;
    }
    removeOut();
    return userConfig;
  } catch (e) {
    removeOut();
    console.log(e);
  }
}
