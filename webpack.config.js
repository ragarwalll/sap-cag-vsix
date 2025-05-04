// @ts-check
'use strict';

const path = require('path');

/** @typedef {import('webpack').Configuration} WebpackConfig */

/** @type WebpackConfig */
const extensionConfig = {
  target: 'node', // VS Code extensions run in a Node.js-context
  mode: 'none',   // set to 'production' for your published build

  entry: './src/extension.ts',
  output: {
    path: path.resolve(__dirname, 'out'),
    filename: 'extension.js',
    libraryTarget: 'commonjs2'
  },

  // exclude built-in vscode & these server-only / native modules
  externals: {
    vscode: 'commonjs vscode',
    handlebars: 'commonjs handlebars',
    chokidar: 'commonjs chokidar',
    metalsmith: 'commonjs metalsmith',
    fsevents: 'commonjs fsevents'
  },

  resolve: {
    extensions: ['.ts', '.js'],
    alias: {
      // swap out Node-only entry for browser-safe runtime build
      'handlebars/lib/index.js': 'handlebars/dist/handlebars.runtime.js'
    }
  },

  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: [{ loader: 'ts-loader' }]
      },
      {
        // ignore any `.node` binary files
        test: /\.node$/,
        loader: 'null-loader'
      }
    ]
  },

  devtool: 'nosources-source-map',
  infrastructureLogging: {
    level: 'log'
  }
};

module.exports = [extensionConfig];
