'use strict'

const path = require('path')
const HtmlWebPackPlugin = require('html-webpack-plugin')
const CopyWebPackPlugin = require('copy-webpack-plugin')

module.exports = {
    mode: 'development',
    entry: './src/website/index.ts',
    target: 'node',

    output: {
        filename: 'index.js',
        path: path.resolve(__dirname, 'out/website')
    },

    module: {
        rules: [
            {
                test: /\.ts?$/,
                loader: 'ts-loader'
            },

            {
                test: /\.css$/,
                loaders: ['style-loader', 'css-loader', 'postcss-loader']
            },
            {
                test: /\.scss$/,
                loaders: ['style-loader', 'css-loader', 'postcss-loader', 'sass-loader']
            },

            { test: /\.jpe?g$|\.svg$|\.gif$|\.png$/i, loader: 'url-loader' },
            { test: /\.otf$|\.woff$|\.woff2$|\.eot$|\.ttf$/, loader: 'url-loader' },
            { test: /\.ico$|_icon\.png$/i, loader: 'url-loader' }
        ]
    },

    resolve: {
        extensions: ['.ts', '.tsx', '.js']
    },

    plugins: [
        new HtmlWebPackPlugin({
            template: 'src/website/index.html'
        }),
        new CopyWebPackPlugin([
            { from: 'src/website/html', to: 'html' },
            { from: 'src/css', to: 'css' }
        ])
    ]
}