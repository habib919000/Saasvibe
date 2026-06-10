const defaultConfig = require( '@wordpress/scripts/config/webpack.config' );
const path = require( 'path' );

module.exports = {
    ...defaultConfig,
    entry: {
        saasmenu: path.resolve( __dirname, 'views/assets/src/index.jsx' ),
    },
    output: {
        path: path.resolve( __dirname, 'views/assets/dist' ),
        filename: '[name].js',
    },
    optimization: {
        ...defaultConfig.optimization,
        splitChunks: {
            cacheGroups: {
                default: false,
            },
        },
    },
    resolve: {
        ...defaultConfig.resolve,
        alias: {
            ...defaultConfig.resolve?.alias,
            '@': path.resolve( __dirname, 'views/assets/src' ),
            '@components': path.resolve( __dirname, 'views/assets/src/components' ),
            '@hooks': path.resolve( __dirname, 'views/assets/src/hooks' ),
            '@lib': path.resolve( __dirname, 'views/assets/src/lib' ),
        },
        extensions: [ '.js', '.jsx', '.json' ],
    },
};
