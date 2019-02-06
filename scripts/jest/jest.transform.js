module.exports = require('babel-jest').createTransformer({
  'presets': ['@babel/preset-env', '@babel/preset-react'],
  'plugins': [
    ['@babel/plugin-proposal-decorators', { 'legacy': true }],
    ['@babel/plugin-proposal-class-properties'],
    ['@babel/plugin-proposal-export-default-from']
  ],
});