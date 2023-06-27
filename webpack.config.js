const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerWebpackPlugin = require('css-minimizer-webpack-plugin');
const TerserWebpackPlugin = require ('terser-webpack-plugin');
const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");

const isDev = process.env.NODE_ENV === 'development';
const isProd = !isDev;
const filename = (ext) => isDev ? `[name].${ext}` : `[name].[contenthash].${ext}`

const optimization = () => {
    const configObj = {
        splitChunks: {
            chunks: 'all'
        }
    };
    if(isProd) {
        configObj.minimizer = [
            new CssMinimizerWebpackPlugin(),
            new TerserWebpackPlugin()
        ];
    }
    
    return configObj;
};

const plugins = () => {
    const basePlugins = [
        new HTMLWebpackPlugin({
            template: path.resolve(__dirname, 'src/index.html'),
            // inject: 'body',
            filename: 'index.html',
            minify: {
                collapseWhitespace: isProd
            }
        }),
        new CleanWebpackPlugin(),
        new MiniCssExtractPlugin({
            filename: `./css/${filename('css')}`,
        }),
    ];

    if (isProd) {
        basePlugins.push(
            new ImageMinimizerPlugin({
                minimizer: {
                  implementation: ImageMinimizerPlugin.imageminMinify,
                  options: {
                    plugins: [
                      ["gifsicle", { interlaced: true }],
                      ["jpegtran", { progressive: true }],
                      ["optipng", { optimizationLevel: 5 }],
                      [
                        "svgo",
                        {
                          plugins: [
                            {
                              name: "preset-default",
                              params: {
                                overrides: {
                                  removeViewBox: false,
                                  addAttributesToSVGElement: {
                                    params: {
                                      attributes: [
                                        { xmlns: "http://www.w3.org/2000/svg" },
                                      ],
                                    },
                                  },
                                },
                              },
                            },
                          ],
                        },
                      ],
                    ],
                  },
                },
              }),
        )
    }

    return basePlugins;
};

module.exports = {
    context: path.resolve(__dirname, 'src'),
    mode: 'development',
    entry: './js/main.js',
    output: {
        filename: `./js/${filename('js')}`,
        path: path.resolve(__dirname, 'app'),
        publicPath: ''
    },
    devServer: {
        static: {
          directory: path.join(__dirname, 'app'),
        },
        historyApiFallback: true,
        compress: true,
        port: 3000,
        open: true,
        hot: true,
      },
    optimization: optimization(),  
    plugins: plugins(),
    devtool: isProd ? false : 'source-map',
    module: {
        rules: [
            {
                test: /\.html$/i,
                loader: 'html-loader'
            },
            {
                test: /\.css$/i,
                use: [
                    MiniCssExtractPlugin.loader, "css-loader"
                ],
            },
            {
                test: /\.m?js$/,
                exclude: /node_modules/,
                use: {
                  loader: 'babel-loader',
                  options: {
                    presets: [
                      ['@babel/preset-env', { targets: "defaults" }]
                    ],
                    plugins: ['@babel/plugin-proposal-class-properties']
                  }
                }
            },
            {
                test: /\.s[ac]ss$/i,
                use: [
                    {
                      loader: MiniCssExtractPlugin.loader,
                      options: {
                        publicPath: (resourcePath, context) => {
                            return path.relative(path.dirname(resourcePath), context) + '/';
                        },
                      }  
                    },
                    "css-loader", 
                    "sass-loader"
                ],
            },
            {
                test: /\.(jpe?g|png|gif|svg)$/i,
                type: "asset",
                use: [{
                            loader: 'file-loader',
                            options: {
                                name: `./img/${filename('[ext]')}`
                            }
                        }],
            },
            {
                test: /\.(?:|woff2|woff)$/i,
                use: [{
                    loader: 'file-loader',
                    options: {
                        name: `./fonts/${filename('[ext]')}`,
                    }
                }],
            },
        ]
    }
}