const { createProxyMiddleware } = require('http-proxy-middleware')

module.exports = function (app) {
    app.use(createProxyMiddleware('/api', {
        target: 'http://172.26.1.200:3001',
        secure: false,
        changeOrigin: true,
        pathRewrite: {
            "^/api": "/"
        }
    }))
}