module.exports = {
    output: {
        filename: 'bundle.js'
    },
    mode: 'production',
    module: {
        rules: [{ test: /.field\.css$/, use: 'raw-loader' }]
    }
}