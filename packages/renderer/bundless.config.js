const { ReactRefreshPlugin } = require('@bundless/plugin-react-refresh');

/**
 * @type { import('@bundless/cli').Config }
 */
module.exports = {
  entries: ['src/index.html'],
  plugins: [ReactRefreshPlugin()],
};
