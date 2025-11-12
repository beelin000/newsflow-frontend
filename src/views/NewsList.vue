<template>
  <div class="news-list">
    <!-- 顶部导航栏 -->
    <header class="bg-black text-white p-4 flex items-center justify-between">
      <h1 class="text-xl font-bold">NewsFlow</h1>
      <button @click="refreshNews" class="text-white">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 13a5 5 0 0 1 5 5m0 0a5 5 0 0 1-5 5m5-5a5 5 0 0 0-5-5m0 0a5 5 0 0 0-5 5" />
        </svg>
      </button>
    </header>

        <!-- 分类标签 -->
    <div class="px-4 py-2 bg-gray-50 border-b border-gray-200">
      <div class="flex gap-2 overflow-x-auto pb-1">
        <button 
          v-for="category in categories" 
          :key="category.id"
          @click="changeCategory(category.id)"
          :class="[
            'px-3 py-1 text-sm whitespace-nowrap rounded-sm',
            activeCategory === category.id 
              ? 'bg-black text-white' 
              : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
          ]"
        >
          {{ category.name }}
        </button>
      </div>
    </div>

    <!-- 搜索框（已隐藏） -->
    <div class="p-4" style="display: none;">
      <div class="relative flex gap-2">
        <input 
          type="text" 
          v-model="searchQuery" 
          placeholder="搜索新闻关键词..." 
          class="flex-1 py-1 pl-10 pr-4 rounded-sm border border-gray-300 focus:outline-none focus:ring-1 focus:ring-black"
          @keyup.enter="fetchNews()"
        />
        <div>
          <!-- 搜索图标 - 调整left值实现左对齐 -->
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            class="h-5 w-5 text-gray-400 absolute top-1/2 left-3 -translate-y-1/2"
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <button 
          @click="fetchNews()" 
          class="bg-black text-white px-2 py-1 rounded-sm hover:bg-gray-900"
        >
          搜索
        </button>
      </div>

    </div>
    <!-- 加载状态 -->
    <div v-if="loading && page === 1" class="text-center p-6 text-gray-500">
      正在加载新闻...
    </div>

    <!-- 新闻列表 -->
    <div v-else-if="newsList.length > 0" class="max-w-6xl mx-auto px-4">
      <NewsCard 
        v-for="article in newsList"
        :key="article.articleId"
        :imgSrc="article.image"
        :title="article.title"
        :source="article.source.name"
        :time="formatTime(article.publishedAt)"
        :to="`/news/${article.articleId}`"
      />
    </div>

    <!-- 加载更多状态提示 -->
    <div v-if="loadingMore" class="text-center p-4 text-gray-500 text-sm">
      加载更多中...
    </div>
    <!-- 无更多新数据提示 -->
    <div v-else-if="!hasMore && newsList.length > 0" class="text-center p-4 text-gray-400 text-sm">
      已显示全部内容
    </div>

    <!-- 错误状态 -->
    <div v-else-if="error" class="text-center p-6 text-red-500">
      {{ error }}
    </div>

    <!-- 空状态 -->
    <div v-else-if="!loading && newsList.length === 0" class="text-center p-6 text-gray-500">
      暂无新闻数据
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import axios from 'axios';  // 引入axios
import NewsCard from '../components/NewsCard.vue';

import { useNewsStore } from '../stores/newsStore'; // 引入store

const newsStore = useNewsStore();

// 1. 响应式数据（API请求参数、返回数据、状态）
const newsList = ref([]);  // 新闻列表（API返回的articles）
const loading = ref(false);  // 加载状态
const error = ref('');  // 错误信息
const page = ref(1);  // 当前页码（默认1）
const pageSize = ref(20);  // 每页条数（默认10，下拉每次新加载10条）
const searchQuery = ref('');  // 搜索关键词（对应API的q参数）
const totalResults = ref(0);  // 符合条件的新闻总条数（API返回）
const loadingMore = ref(false); // 加载更多状态
const hasMore = ref(true); // 是否有更多数据可加载

// 1. 响应式数据：从全局状态读取分类，无值则默认 'general'
const activeCategory = ref(newsStore.activeCategory || 'general'); 
const categories = ref([
  { id: 'general', name: '全部' },
  { id: 'business', name: '财经' },
  { id: 'technology', name: '科技' }
]); // 分类列表

  // 从环境变量获取配置
  const baseUrl = process.env.VUE_APP_BASE_URL; // API基础地址（注意：实际需确认是否为HTTPS）
  const headlinesApiUrl = `${baseUrl}${process.env.VUE_APP_HEADLINES_API}`;
  const searchApiUrl = `${baseUrl}${process.env.VUE_APP_SEARCH_API}`;

// 2. 时间格式化函数（ISO 8601 → 友好格式，如“2小时前”“2023-10-15 16:30”）
const formatTime = (isoTime) => {
  if (!isoTime) return '';
  const now = new Date();
  const publishTime = new Date(isoTime);
  const diffMs = now - publishTime;  // 时间差（毫秒）

  // 计算分钟差（一小时内显示分钟级）
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  if (diffMinutes < 60) {
    return `${diffMinutes}分钟前`;
  }
  
  // 计算小时差
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  if (diffHours < 24) {
    return `${diffHours}小时前`;
  }
  
  // 计算天数差（超过24小时则显示日期）
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays < 30) {
    return `${diffDays}天前`;
  }
  
  // 超过30天则显示完整日期（格式：YYYY-MM-DD HH:MM）
  return publishTime.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// 3. 核心：请求API新闻数据

// 切换分类
const changeCategory = (categoryId) => {
  if (activeCategory.value !== categoryId) {
    activeCategory.value = categoryId;
    newsStore.setActiveCategory(categoryId); // 保存到全局状态
    console.log("Changed category to: " + categoryId);
    fetchNews(false, categoryId); // 切换分类后重新获取新闻
  }
};

// 请求新闻数据
// 修改fetchNews函数，根据搜索关键词切换API
const fetchNews = async (isLoadMore = false, category = null) => {
  // 确保使用正确的分类
  const targetCategory = category || activeCategory.value;

  if (isLoadMore) {
    loadingMore.value = true;
  } else {
    loading.value = true;
    newsList.value = [];
    page.value = 1;
    hasMore.value = true;
  }

  error.value = '';

  try {
    const apiUrl = searchQuery.value ? searchApiUrl : headlinesApiUrl;

    const response = await axios.get(apiUrl, {
      params: {
        // 只在非搜索模式下传递 category 参数，且当分类不是 general 时才传递
        ...(searchQuery.value ? {} : (targetCategory !== 'general' ? { category: targetCategory } : {})),
        ...(searchQuery.value ? { q: searchQuery.value } : {}),
        page: page.value,
        pageSize: pageSize.value
      }
    });
    console.log("API params: " + JSON.stringify({
      // 只在非搜索模式下传递 category 参数，且当分类不是 general 时才传递
      ...(searchQuery.value ? {} : (targetCategory !== 'general' ? { category: targetCategory } : {})),
      ...(searchQuery.value ? { q: searchQuery.value } : {}),
      page: page.value,
      pageSize: pageSize.value
    }));

    const { data } = response;
    if (data.status !== 'ok' || data.resultCode !== '000000') {
      throw new Error(`API错误：${data.resultMsg || '获取新闻失败'}`);
    }

    const newArticles = data.newsdata.articles || [];
    
    // 处理source.name解析（保持不变）
    newArticles.forEach(article => {
      try {
        const source = JSON.parse(article.source.name);
        article.source.name = source.name;
      } catch (e) {
        article.source.name = article.source.name || '未知来源';
      }
    });

    // 合并或替换新闻列表（保持不变）
    if (isLoadMore) {
      newsList.value = [...newsList.value, ...newArticles];
    } else {
      newsList.value = newArticles;
    }
    // 保存到全局状态
    newsStore.setNewsList(newsList.value);

    totalResults.value = data.newsdata.totalArticles || 0;
    hasMore.value = newsList.value.length < totalResults.value;

  } catch (err) {
    error.value = err.message || '网络异常，请稍后重试';
    if (isLoadMore) {
      page.value--;
    }
  } finally {
    loading.value = false;
    loadingMore.value = false;
  }
};

// 刷新新闻
const refreshNews = () => {
  fetchNews();
};

// 滚动监听处理函数 - 优化版本
const handleScroll = () => {
  // 如果正在加载或没有更多数据，则不执行加载操作
  if (loading.value || loadingMore.value || !hasMore.value) {
    return;
  }

  // 更精确地检测是否接近底部（距离底部100px以内）
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  const scrollHeight = document.documentElement.scrollHeight;
  const clientHeight = window.innerHeight || document.documentElement.clientHeight;

  // 当距离底部小于100px时才触发加载
  if (scrollTop + clientHeight >= scrollHeight - 100) {
    loadMore();
  }
};

// 在 loadMore 函数中也增加保护措施
const loadMore = () => {
  // 检查是否可以加载更多（增加状态检查）
  if (!loading.value && !loadingMore.value && hasMore.value) {
    page.value++;
    fetchNews(true); // 调用时传递isLoadMore为true
  }
};

// 组件挂载时
onMounted(() => {
  // 同步全局状态到本地（解决刷新后状态不一致问题）
  activeCategory.value = newsStore.activeCategory || 'general';
  console.log("Mounted with category: " + activeCategory.value);
  fetchNews(false, activeCategory.value); // 初始加载新闻
  // 添加滚动监听
  window.addEventListener('scroll', handleScroll);
});

// 组件卸载时移除监听
onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

<style scoped>
.news-list {
  height: 100vh;
  display: flex;
  flex-direction: column;
}
</style>