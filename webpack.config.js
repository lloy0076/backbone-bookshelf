const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    mode: 'development',
    entry: './src/app.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'app.js',
    },
    plugins: [
        new HtmlWebpackPlugin({ template: 'src/index.html' }),
    ],
    devServer: {
        compress: true,
        port: 9000,
        open: true,
    },
    devtool: 'inline-source-map',
    node: {
        fs: 'empty',
    }
};
