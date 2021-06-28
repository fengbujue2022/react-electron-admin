import path from 'path'

const rootPath = process.cwd()

const config = {
  host: 'localhost',
  port: 2233,
  mainSource: path.resolve(rootPath, 'app/electron'),
  rendererSource: path.resolve(rootPath, 'app/src'),
  template: path.resolve(rootPath, 'app/src/index.html'),
  dist: path.resolve(rootPath, 'dist'),
  release: path.resolve(rootPath, 'release'),
  proxy: {},
}

export default config
