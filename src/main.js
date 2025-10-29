// src/main.js
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router' // 引入路由配置

// 2. 创建 Pinia 实例
const pinia = createPinia()
// 创建应用实例，使用路由，并挂载到 #app
createApp(App)
  .use(pinia) // 启用 Pinia
  .use(router) // 启用路由
  .mount('#app')