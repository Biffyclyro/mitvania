const path = require('path');
const ESLintPlugin = require('eslint-webpack-plugin');
const CopyPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
	entry: './src/main.ts',
	mode: 'development',
	devtool: 'eval-source-map',
	//target: 'electron-main',
	module: {
		rules: [
			{
				test: /\.ts$/,
				use: 'ts-loader',
				exclude: /node-modules/
			}
		]
	},
	resolve: {
		extensions: ['.ts', '.js']
	},
	output: {
		filename: 'main.js',
		publicPath: './',
		path: path.resolve(__dirname, 'dist')
	},
	plugins: [
		new HtmlWebpackPlugin({
      filename:  'index.html',
      template: 'index.html'
    }),
		new ESLintPlugin(),
		new CopyPlugin({
      patterns: [
        {
          from: './assets',
          to: './assets',
          force: true
        },
        {
          from: './app.css',
          to: './app.css',
          force: true
        },
				{
					from: './src/electron',
					to: './electron',
					force: true
				}
      ]
    })
	]
}