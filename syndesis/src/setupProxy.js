/* tslint:disable */
const proxy = require('http-proxy-middleware');

module.exports = function(app) {
  if (app.BACKEND) {
    app.use(
      proxy('/api', {
        target: process.env.BACKEND,
        secure: false,
        changeOrigin: true,
        ws: !process.env.PROXY_NO_WS,
        headers: {
          'X-Forwarded-Origin': 'for=127.0.0.1;host=localhost:3000;proto=https',
          'X-Forwarded-Access-Token': 'supersecret',
          Cookie: process.env.BACKEND_COOKIE || '',
        },
      })
    );
  }
};
