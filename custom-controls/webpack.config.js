// Generated using webpack-cli https://github.com/webpack/webpack-cli
const path = require('path');

const isProduction = process.env.NODE_ENV === 'production';

const stylesHandler = 'style-loader';

const config = {
    entry: { 'custom-richtext': './custom-richtext.tsx','custom-jodit': './custom-jodit.tsx' },
    output: {
        filename: "[name].js",
        path: path.resolve(__dirname, 'dist'),
    },
    devServer: {
        open: true,
        host: 'localhost',
        port: 7070
    },
    plugins: [],
    module: {
        rules: [
            {
                test: /\.(ts|tsx|jsx|js)$/,
                exclude: /node_modules\/(?!(@stackbit\/typewriter)\/).*/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env', '@babel/preset-react', '@babel/preset-typescript']
                    }
                }
            },
            {
                test: /\.s[ac]ss$/i,
                use: [stylesHandler, 'css-loader', 'resolve-url-loader', 'sass-loader']
            },
            {
                test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/i,
                type: 'asset'
            }

            // Add your rules for custom modules here
            // Learn more about loaders from https://webpack.js.org/loaders/
        ]
    },
    resolve: {
        alias: {
            'react': path.resolve(__dirname, 'node_modules/react'),
            'react-dom': path.resolve(__dirname, 'node_modules/react-dom'),
        },
        extensions: ['.tsx', '.ts', '.jsx', '.js', '...']
    }
};

module.exports = () => {
    if (isProduction) {
        config.mode = 'production';
    } else {
        config.mode = 'development';
    }
    return config;
};
