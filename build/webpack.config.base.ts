import path from 'path'
import webpack, { Configuration } from 'webpack'

import TerserPlugin from 'terser-webpack-plugin'

const { NODE_ENV } = process.env

const webpackConfig: Configuration = {
  mode: NODE_ENV as 'development' | 'production',

  node: {
    __dirname: false,
    __filename: false,
  },

  resolve: {
    alias: {
      '@': path.resolve(__dirname, '../app'),
      '@root': path.resolve(__dirname, '../'),
    },
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
  },

  plugins: [],
}

if (NODE_ENV === 'development') {
  webpackConfig.devtool = 'source-map'
} else if (NODE_ENV === 'production') {
  webpackConfig.optimization?.minimizer?.push(
    // https://github.com/terser-js/terser
    (new TerserPlugin({
      terserOptions: {
        compress: {
          // 生产环境移除 log
          pure_funcs: ['console.log'],
        },
      },
      extractComments: false, // 不提取任何注释
    }) as unknown) as webpack.WebpackPluginInstance
  )
}

export default webpackConfig
