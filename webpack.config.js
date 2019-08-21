module.exports = {
    output: {
        filename: 'bundle.js'
    },
    mode: 'production',
    module: {
        rules: [
            {
                test: /\.shadow\.css$/,
                use: 'raw-loader'
            },
            {
                test: /\.(js|jsx)$/,
                use: 'babel-loader'
            }]
    },
    devtool: 'source-map',
}