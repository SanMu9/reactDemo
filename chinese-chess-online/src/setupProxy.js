const { createProxyMiddleware } = require('http-proxy-middleware')
// const proxy = require('http-proxy-middleware')

module.exports = function (app) {
    app.use(createProxyMiddleware('/api', {
        target: 'http://localhost:3001',
        secure: false,
        changeOrigin: true,
        pathRewrite: {
            "^/api": "/"
        }
    }));
    // app.use(createProxyMiddleware('/ws', {
    //     target: 'ws://localhost:8088',
    //     ws:true,
    //     secure: false,
    //     // changeOrigin: true,
    //     // pathRewrite: {
    //     //     "^/ws": "/"
    //     // }
    // }))
}