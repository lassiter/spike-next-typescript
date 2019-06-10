// next.config.js

  const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
  const path = require('path');
  const glob = require('glob');
  const webpack = require('webpack');
  const CompressionPlugin = require('compression-webpack-plugin');
  const withTypescript = require('@zeit/next-typescript');
  const getRoutes = require('./routes');
  
  const { ANALYZE } = process.env;
  
  module.exports = withTypescript({
    webpack: (config, { isServer }) => {
      if (ANALYZE === 'true') {
        config.plugins.push(
          new BundleAnalyzerPlugin({
            analyzerMode: 'static',
            analyzerPort: 8888,
            openAnalyzer: true,
            generateStatsFile: true,
          })
        );
      }
  
  
      if (
        process.env.NODE_ENV === 'production' ||
        process.env.NODE_ENV === 'qa' ||
        process.env.NODE_ENV === 'staging'
      ) {
        const Terser = require('terser-webpack-plugin');
        config.plugins.push(
          new Terser({
            parallel: false,
            terserOptions: {
              ecma: 6,
              sourceMap: true,
            },
          })
        );
      }
  
      config.module.rules.push(
        {
          test: /\.(css|scss)/,
          loader: 'emit-file-loader',
          options: {
            name: 'dist/[path][name].[ext]',
          },
        },
        {
          test: /\.css$/,
          use: ['babel-loader', 'raw-loader', 'postcss-loader'],
        },
        {
          test: /\.s(a|c)ss$/,
          use: [
            'babel-loader',
            'raw-loader',
            'postcss-loader',
            {
              loader: 'sass-loader',
              options: {
                includePaths: ['styles', 'node_modules']
                  .map(d => path.join(__dirname, d))
                  .map(g => glob.sync(g))
                  .reduce((a, c) => a.concat(c), []),
              },
            },
          ],
        }
      );
  
      return config;
    },
    exportPathMap: getRoutes,
    onDemandEntries: {
      // period (in ms) where the server will keep pages in the buffer
      maxInactiveAge: 120 * 1000,
      // number of pages that should be kept simultaneously without being disposed
      pagesBufferLength: 2,
    },
  });
  