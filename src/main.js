// src/main.js
import { createApp } from 'vue'
import App from './App.vue'
import router from './router' // 引入路由配置

// 创建应用实例，使用路由，并挂载到 #app
createApp(App)
  .use(router) // 启用路由
  .mount('#app')