const paths = require('./paths');
const webpack = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const env = require('../envs/env');


module.exports = {

    /**
     * Entry: The first place Webpack looks to start building the bundle.
     */
    entry: [
        "@babel/polyfill", paths.src + '/views/main/main.js'
    ],

    /**
     * Output: Where Webpack outputs the assets and bundles.
     */
    output: {
        path: paths.build,
        filename: '[name].bundle.js',
        publicPath: '/',
    },

    resolve: { extensions: ["*", ".js", ".jsx"] },

    /**
     * Modules: Determine how modules within the project are treated.
     */
    module: {
        rules: [
            /**
             * Javascript: Use Babel to transpile JavaScript files.
             */         
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: ['babel-loader', 'eslint-loader'],
            },
            /**
             * Styles: Inject CSS into the head with source maps.
             */
            {
                test: /\.(scss|css)$/,
                use: [
                    'style-loader',
                    { loader: 'css-loader', options: { sourceMap: true, importLoaders: 1 } },
                    { loader: 'postcss-loader', options: { sourceMap: true } },
                    { loader: 'sass-loader', options: { sourceMap: true } },
                  ],
            },
            /**
             * Images: Copy image files to build folder.
             */
            {
                test: /\.(?:ico|gif|png|jpg|jpeg|webp|svg)$/i,
                loader: 'file-loader',
                options: {
                    name: '[path][name].[ext]',
                    context: 'static', // prevent display of src/ in filename
                },
            },
            /**
             * Fonts: Inline font files
             */
            {
                test: /\.(woff(2)?|eot|ttf|otf|)$/,
                loader: 'url-loader',
                options: {
                  limit: 8192,
                  name: '[path][name].[ext]',
                  context: 'static', // prevent display of src/ in filename
                },
            }
        ]
    },

    /**
     * Plugins: Customize the Webpack build process.
     */
    plugins: [
        /**
         * CleanWebpackPlugin: Removes/cleans build folders and unused assets when rebuilding.
         */
        new CleanWebpackPlugin(),

        /**
         * CopyWebpackPlugin: Copies files from target to destination folder.
         */
        new CopyWebpackPlugin([
            {
              from: paths.static,
              to: 'static',
              ignore: ['*.DS_Store'],
            },
        ]),     
        
        /**
         * HtmlWebpackPlugin: Generates an HTML file from a template for dynamic data like bundle name.
         */
        new HtmlWebpackPlugin({
            //Favicon.ico not supported
            //favicon: paths.static + '/images/favicon.ico',
            favicon: paths.static + '/images/favicon.png',
            template: paths.static + '/template.html', // template file
            filename: 'home.html', // output file
        }),

        /**
         * DefinePlugin: compile env variables to real time values
         */
        new webpack.DefinePlugin(env.envKeys),

    ],
};
