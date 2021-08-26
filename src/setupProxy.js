const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = (app) => {
    app.use(
        createProxyMiddleware(['/api', '/socket.io'], {
            target: 'http://openapi.data.go.kr',
            changeOrigin: true,
            ws: true,
            router: {
                '/socket.io': 'ws://openapi.data.go.kr'
            }
        })
    );
};