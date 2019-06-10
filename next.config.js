// next.config.js
if (process.env.NODE_ENV !== 'production') {
    require('dotenv-safe').load();
  }
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
  
      config.plugins.push(
        new CompressionPlugin(),
        new webpack.IgnorePlugin(/\.test.js$/),
        new webpack.DefinePlugin({
          'process.env.IS_SERVER': isServer,
          'process.env.IS_CLIENT': !isServer,
          'process.env.BRANCH': JSON.stringify(process.env.BRANCH),
          'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
          'process.env.SEGMENT_KEY_WRITE': JSON.stringify(
            process.env.SEGMENT_KEY_WRITE
          ),
          'process.env.CONTENTFUL_SPACE_ID': JSON.stringify(
            process.env.CONTENTFUL_SPACE_ID
          ),
          'process.env.CONTENTFUL_HOST': JSON.stringify(
            process.env.CONTENTFUL_HOST
          ),
          'process.env.CONTENTFUL_ACCESS_TOKEN': JSON.stringify(
            process.env.CONTENTFUL_ACCESS_TOKEN
          ),
          'process.env.IMGIX_HOST': JSON.stringify(process.env.IMGIX_HOST),
          'process.env.WASABI_API': JSON.stringify(process.env.WASABI_API),
          'process.env.WASABI_APP_NAME': JSON.stringify(
            process.env.WASABI_APP_NAME
          ),
          'process.env.REACT_APP_API': JSON.stringify(process.env.REACT_APP_API),
          'process.env.REACT_APP_SURVEY': JSON.stringify(
            process.env.REACT_APP_SURVEY
          ),
          'process.env.REACT_APP_STUDIO_SPECIFIC_SURVEY_ID': JSON.stringify(
            process.env.REACT_APP_STUDIO_SPECIFIC_SURVEY_ID
          ),
          'process.env.REACT_APP_STRIPE_PK': JSON.stringify(
            process.env.REACT_APP_STRIPE_PK
          ),
          'process.env.SENTRY_KEY': JSON.stringify(process.env.SENTRY_KEY),
          'process.env.CANDID_ENV': JSON.stringify(process.env.CANDID_ENV),
          'process.env.REACT_APP_INSTANTSEARCH_ID': JSON.stringify(
            process.env.REACT_APP_INSTANTSEARCH_ID
          ),
          'process.env.REACT_APP_INSTANTSEARCH_KEY': JSON.stringify(
            process.env.REACT_APP_INSTANTSEARCH_KEY
          ),
          'process.env.REACT_APP_GOOGLE_MAPS_API_KEY': JSON.stringify(
            process.env.REACT_APP_GOOGLE_MAPS_API_KEY
          ),
          'process.env.REACT_APP_IPSTACK_API_KEY': JSON.stringify(
            process.env.REACT_APP_IPSTACK_API_KEY
          ),
          'process.env.AFFIRM_API_KEY': JSON.stringify(
            process.env.AFFIRM_API_KEY
          ),
          'process.env.AFFIRM_SCRIPT_URL': JSON.stringify(
            process.env.AFFIRM_SCRIPT_URL
          ),
          'process.env.LIVE_CHAT_LICENSE_ID': JSON.stringify(
            process.env.LIVE_CHAT_LICENSE_ID
          ),
          'process.env.SIGMUND_ENDPOINT': JSON.stringify(
            process.env.SIGMUND_ENDPOINT
          ),
          'process.env.USE_SIGMUND': JSON.stringify(process.env.USE_SIGMUND),
        })
      );
  
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
  