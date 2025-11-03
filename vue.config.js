const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    // 允许访问的主机列表，'all' 表示允许所有主机访问
    allowedHosts: 'all',
    // 如果你需要指定具体的允许访问的主机（如局域网IP），可以这样配置：
    // allowedHosts: ['localhost', '192.168.1.233'],
    
    // 如果你需要代理功能，可以取消下面的注释并配置
    // proxy: {
    //   '/api': {
    //     target: 'http://192.168.1.233:5000',
    //     changeOrigin: true,
    //     pathRewrite: {
    //       '^/api': ''
    //     }
    //   }
    // }
  }
});