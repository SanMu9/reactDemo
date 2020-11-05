const { createProxyMiddleware } = require('http-proxy-middleware')
// const proxy = require('http-proxy-middleware')

module.exports = function (app) {
    // app.use(createProxyMiddleware('/socket.io', {
    //     target: 'ws://localhost:8088',
    //     ws:true,
    //     secure: false,
    //     changeOrigin: true,
    //     pathRewrite: {
    //         "^/socket.io": "/"
    //     }
    // }));
    app.use(createProxyMiddleware('/api', {
        target: 'http://localhost:3001',
        secure: false,
        ws:true,
        changeOrigin: true,
        pathRewrite: {
            "^/api": "/"
        }
    }));
  
}