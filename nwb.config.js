const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
  type: 'react-app',
  babel: {
    runtime: 'helpers',
    plugins: ['transform-decorators-legacy'],
    config(config) {
      // Change config as you wish

      console.log(config);
      // You MUST return the edited config object
      return config
    }
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
        new BundleAnalyzerPlugin({
          /*generateStatsFile: true,
          analyzerMode: 'disabled',*/
        }),
      ],
    },
  },
};