/**
 * @typescript-eslint 规则参考
 * https://www.npmjs.com/package/@typescript-eslint/eslint-plugin#supported-rules
 */

module.exports = {
  root: true,

  parser: '@typescript-eslint/parser', // 指定ESLint解析器

  extends: ['react-app'],

  settings: {
    react: {
      version: 'detect',
    },
  },

  plugins: ['react', 'prettier'],

  env: {
    browser: true,
    node: true,
    es6: true,
    mocha: true,
  },
}
