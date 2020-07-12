const path = require('path');
const webpack = require('webpack');

const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const mode = process.env.NODE_ENV || 'development';

module.exports = {
    mode,
    entry: {
        main: './src/main.js',
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js',
        publicPath: '/',
    },
    plugins: [
        new webpack.DefinePlugin({
            // Replace THIS with the real server URI; keep the same quote style.
            'SERVICE_URL': '"http://laravel-bookshelf.test/api/v1/book"',
        }),
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: 'src/index.html',
            scriptLoading: 'defer',
        }),
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
            'window.jQuery': 'jquery',
            Popper: ['popper.js', 'default'],
            'window.Popper': ['popper.js', 'default'],
        }),
    ],
    devServer: {
        contentBase: './dist',
        hot: true,
        historyApiFallback: true,
        open: true,
        port: 9000,
    },
    devtool: 'inline-source-map',
    node: {
        fs: 'empty',
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
            },
            {
                test: /\.(njk|nunjucks)$/,
                loader: 'nunjucks-loader',
            },
        ],
    },
};
