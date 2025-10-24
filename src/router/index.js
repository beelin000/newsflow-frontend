import { createRouter, createWebHistory } from 'vue-router';
import NewsList from '../views/NewsList.vue';
import NewsDetail from '../views/NewsDetail.vue';

const routes = [
  {
    path: '/',
    name: 'NewsList',
    component: NewsList
  },
  {
    path: '/news/:articleId',  // 路由参数为 articleId（关键）
    name: 'NewsDetail',
    component: NewsDetail
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;