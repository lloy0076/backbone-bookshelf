const path = require('path');
const webpack = require('webpack');

const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    mode: 'development',
    entry: {
        app: './src/app.js',
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js',
    },
    plugins: [
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
    // devtool: 'inline-source-map',
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
