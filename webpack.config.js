// @ts-check
'use strict';

const path = require('path');

/** @typedef {import('webpack').Configuration} WebpackConfig */

const extensionConfig = {
  target: 'node',
  mode: 'production',

  entry: './src/extension.ts',
  output: {
    path: path.resolve(__dirname, 'out'),
    filename: 'extension.js',
    libraryTarget: 'commonjs2'
  },

  externals: {
    vscode: 'commonjs vscode',
    '@ragarwal06/sap-cloud-application-generator': 
     'commonjs @ragarwal06/sap-cloud-application-generator'
  },

  resolve: {
    extensions: ['.ts', '.js'],
    alias: {
      'handlebars': 'handlebars/runtime.js'
    }
  },

  resolveLoader: {
    alias: {
      'hbs': 'handlebars-loader'
    }
  },

  module: {
    rules: [
      { test: /\.ts$/, exclude: /node_modules/, use: 'ts-loader' },
      { test: /\.node$/, loader: 'null-loader' }
    ]
  },

  optimization: {
    splitChunks: false,
    runtimeChunk: false
  },
  devtool: 'nosources-source-map'
};

module.exports = [extensionConfig];
