// stores/newsStore.js
import { defineStore } from 'pinia';

export const useNewsStore = defineStore('news', {
  state: () => ({
    // 原有字段
    newsList: [],
    // 新增需要持久化的状态
    activeCategory: 'general', // 当前选中的分类, 初始值为'general'
    page: 1, // 当前页码
    totalResults: 0, // 总条数
    hasMore: true // 是否有更多数据
  }),

  actions: {
    // 根据articleId获取单条新闻
    getNewsById(articleId) {
      return this.newsList.find(article => article.articleId === articleId) || null;
    },
    // 获取新闻列表
    getNewsList() {
      return this.newsList;
    },

    // 获取当前选中的分类
    getActiveCategory() {
      return this.activeCategory;
    },

    // 原有方法
    setNewsList(list) {
      this.newsList = list;
    },
    // 新增状态更新方法
    setActiveCategory(category) {
      this.activeCategory = category;
    },
    setPage(pageNum) {
      this.page = pageNum;
    },
    setTotalResults(total) {
      this.totalResults = total;
    },
    setHasMore(hasMore) {
      this.hasMore = hasMore;
    }
  },
  // 开启持久化（可选，用于页面刷新后仍保持状态）
  persist: {
    enabled: true,
    strategies: [{ storage: localStorage }] // 存储到localStorage
  }
});