require('dotenv').config();

import webpack from 'webpack';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import WebpackNotifierPlugin from 'webpack-notifier';
import {resolve} from 'path';
import {env} from 'process';

const isProduction = env.WP_ENV === 'production';

module.exports = {
  entry: {
    app: [
      './src/themes/__/resources/scripts/index.js',
      './src/themes/__/resources/styles/index.scss'
    ]
  },

  output: {
    path: resolve(__dirname, './src/themes/__/dist'),
    filename: '[name].js'
  },

  resolve: {
    alias: { vue: 'vue/dist/vue.js' }
  },

  module: {
    rules: [
      {
        test: /\.s[ac]ss$/,
        use: ExtractTextPlugin.extract({
          use: ['css-loader', 'sass-loader'],
          fallback: 'style-loader'
        })
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader",
      }
    ]
  },

  plugins: [
    new WebpackNotifierPlugin({ excludeWarnings: true }),
    new ExtractTextPlugin('../style.css'),
    new webpack.LoaderOptionsPlugin({
      minimize: isProduction
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor'
    })
  ],

  // pretty terminal output
  stats: { colors: true }
};


// if prod minify the code
if (isProduction) 
{
  module.exports.plugins.push(
    new webpack.optimize.UglifyJsPlugin()
  );
}
