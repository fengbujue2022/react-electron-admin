import webpack, { Configuration } from 'webpack'

import buildConfig from '../config'

interface BuildConfig {
  webpackConfig: Configuration
  type: 'main' | 'renderer'
}

function build({ webpackConfig }: BuildConfig): Promise<void> {
  return new Promise((resolve, reject) => {
    webpack(webpackConfig, (err, stats) => {
      if (err) throw err
      if (!stats) throw 'Webpack states error!'

      process.stdout.write(
        stats.toString({
          colors: true,
          hash: true,
          version: true,
          timings: true,
          assets: true,
          chunks: false,
          children: false,
          modules: false,
        }) + '\n\n'
      )

      if (stats.hasErrors()) {
        reject(stats)
      } else {
        resolve()
      }
    })
  })
}

export default build
