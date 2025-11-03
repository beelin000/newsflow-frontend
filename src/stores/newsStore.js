// stores/newsStore.js
import { defineStore } from 'pinia';

// 自定义带过期时间的localStorage
const expiredLocalStorage = {
  // 存储数据（添加过期时间，单位：秒，默认2小时）
  setItem(key, value, expireSeconds = 7200) {
    const data = {
      value,
      expireTime: Date.now() + expireSeconds * 1000 // 过期时间戳（毫秒）
    };
    localStorage.setItem(key, JSON.stringify(data));
  },
  // 读取数据（校验是否过期）
  getItem(key) {
    const storedData = localStorage.getItem(key);
    if (!storedData) return null;

    const { value, expireTime } = JSON.parse(storedData);
    // 未设置过期时间或未过期，返回数据
    if (!expireTime || Date.now() < expireTime) {
      return JSON.stringify(value); // Pinia需要字符串格式的值
    }

    // 已过期，清除数据并返回null
    localStorage.removeItem(key);
    return null;
  },
  // 移除数据（保持与localStorage接口一致）
  removeItem(key) {
    localStorage.removeItem(key);
  }
};

export const useNewsStore = defineStore('news', {
  state: () => ({
    // 需要持久化的状态字段
    newsList: [],
    fullnewsMap: new Map(),
    activeCategory: 'general',
    page: 1,
    totalResults: 0,
    hasMore: true
  }),

  actions: {
    // 根据articleId获取单条新闻详情
    getFullNewsById(articleId) {
      return this.fullnewsMap.get(articleId) || null;
    },
    // 存储单条新闻详情
    setFullNews(article) {
      this.fullnewsMap.set(article.articleId, article);
    },

    // 新闻title列表和当前分类
    getNewsList() {
      return this.newsList;
    },
    getActiveCategory() {
      return this.activeCategory;
    },
    setNewsList(list) {
      this.newsList = list;
    },
    setActiveCategory(category) {
      this.activeCategory = category;
    },

    // 分页相关
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

  persist: {
    enabled: true,
    strategies: [
      {
        storage: expiredLocalStorage, // 使用自定义存储
        // 自定义存储key（可选，默认是store名称）
        key: 'news_store',
        // 可选：指定需要持久化的状态字段
        paths: ['activeCategory', 'page', 'totalResults', 'hasMore']
      }
    ]
  }
});