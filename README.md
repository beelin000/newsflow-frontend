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

src/
├── components/
│   └── index.html  // 主页 HTML 模板文件
├── components/
│   └── NewsCard.vue  // 新闻卡片组件
├── views/
│   ├── NewsList.vue  // 新闻列表页
│   └── NewsDetail.vue  // 新闻详情页
├── router/
│   └── index.js  // 路由配置
└── App.vue  // 根组件
└── main.js  // 应用入口文件

开发环境运行时（npm run serve），会自动加载 .env.development
生产环境构建时（npm run build），会自动加载 .env.production
如需新增环境（如测试环境），可创建 .env.test 并在运行时通过 --mode test 指定环境