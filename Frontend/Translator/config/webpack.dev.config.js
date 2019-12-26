const paths = require('./paths');
const webpack = require('webpack');
const merge = require('webpack-merge');
const common = require('./webpack.common.config.js');

module.exports = merge(common, {

    /**
     * Mode: Set the mode to development or production.
     */
    mode: 'development',

    /**
     * Devtool: Control how source maps are generated.
     */
    devtool: 'inline-source-map',

    /**
     * DevServer: Development Server config
     */
    devServer: {
        historyApiFallback: {
            index: '/home.html',
        },
        //contentBase: paths.static,
        //contentBase: paths.static+'/../',
        contentBase: paths.build,
        open: true,
        compress: true,
        hot: true,
        port: 3010,
        //index: 'home.html'
    },

    /**
     * Modules: Determine how modules within the project are treated.
     */
    module: {
        rules: [
             /**
             * React Hot Loader
             * Commenting as this is being used from .babelrc
             */         
            /* {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: ['react-hot-loader/webpack', 'babel-loader', 'eslint-loader'],
            }, */
        ]
    },

    /**
     * Plugins
     */
    plugins: [
        /**
         * HotModuleReplacementPlugin: Only update what has changed.
         */
        new webpack.HotModuleReplacementPlugin(),
    ],
       
})