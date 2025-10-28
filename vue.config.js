const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true
})

// module.exports = {
//   devServer: {
//     allowedHosts: ['localhost', '192.168.1.233'], // 允许局域网IP访问
//     proxy: {
//       // 匹配所有以'/api'开头的请求
//       '/api': {
//         target: 'http://192.168.1.233:5000',  // 后端接口的实际域名+端口（目标服务器地址）
//         changeOrigin: true,  // 开启代理，会将请求头中的host改为target
//         pathRewrite: {
//           '^/api': ''  // 如果后端接口没有'/api'前缀，这里需要去掉（如后端接口是'/v1/data'，则请求'/api/v1/data'会被转发为'http://localhost:3000/v1/data'）
//         }
//       }
//     }
//   }
// };
