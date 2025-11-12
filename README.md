# newsflow-vue-project

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

newsflow-vue-project/
├── public/
│   │── index.html // HTML模板文件
│   │── newsflow_favicon.png // favicon图片
│   └── newsflow_logo.jpeg // logo图片
├── src/
│   ├── components/
│   │   └── NewsCard.vue        // 新闻卡片组件
│   ├── router/
│   │   └── index.js            // 路由配置
│   ├── stores/
│   │   └── newsStore.js        // 新闻状态管理
│   ├── views/
│   │   ├── FastNewsList.vue    // 快讯列表页面
│   │   ├── NewsDetail.vue      // 新闻详情页面
│   │   └── NewsList.vue        // 新闻列表页面
│   ├── App.vue                 // 根组件
│   └── main.js                 // 应用入口文件
├── README.md                   // 项目说明文档
├── .env.development            // 开发环境配置
├── .env.production             // 生产环境配置
└── package.json                // 项目依赖配置

开发环境运行时（npm run serve），会自动加载 .env.development
生产环境构建时（npm run build），会自动加载 .env.production
如需新增环境（如测试环境），可创建 .env.test 并在运行时通过 --mode test 指定环境