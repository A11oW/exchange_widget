const EnvironmentPlugin = require('webpack').EnvironmentPlugin;
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
  .BundleAnalyzerPlugin;

module.exports = {
  type: 'react-app',
  babel: {
    runtime: 'helpers',
    plugins: ['transform-decorators-legacy'],
  },
  webpack: {
    config(config) {
      // console.log(config);
      return config;
    },
    rules: {
      svg: {
        loader: 'svg-inline-loader',
        options: { classPrefix: true, idPrefix: true },
      },
    },
    extra: {
      plugins: [
        /*new BundleAnalyzerPlugin({
          /!*generateStatsFile: true,
          analyzerMode: 'disabled',*!/
        }),*/
        new EnvironmentPlugin(['NODE_ENV']),
      ],
    },
  },
};
