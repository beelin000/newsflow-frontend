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
    path: '/news/:id',
    name: 'NewsDetail',
    component: NewsDetail
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;