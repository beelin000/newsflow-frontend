// stores/newsStore.js
import { defineStore } from 'pinia';

export const useNewsStore = defineStore('news', {
  state: () => ({
    newsList: [], // 存储全局新闻列表
    searchQuery: '' // 搜索框内容
  }),
  actions: {
    // 更新搜索关键词
    setSearchQuery(query) {
      this.searchQuery = query
    },
    // 保存新闻列表到全局状态
    setNewsList(list) {
      this.newsList = list;
    },
    // 根据articleId获取单条新闻
    getNewsById(articleId) {
      return this.newsList.find(article => article.articleId === articleId) || null;
    }
  }
});