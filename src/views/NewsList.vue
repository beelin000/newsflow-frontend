<template>
  <div class="news-list">
    <!-- 顶部导航栏 -->
    <header class="bg-black text-white p-4 flex items-center justify-between">
      <h1 class="text-xl font-bold">NewsFlow</h1>
      <button @click="fetchNews()" class="text-white">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 13a5 5 0 0 1 5 5m0 0a5 5 0 0 1-5 5m5-5a5 5 0 0 0-5-5m0 0a5 5 0 0 0-5 5" />
        </svg>
      </button>
    </header>

    <!-- 搜索框（绑定关键词，支持搜索） -->
    <div class="p-4">
      <div class="relative flex gap-2">
        <input 
          type="text" 
          v-model="searchQuery" 
          placeholder="搜索新闻关键词..." 
          class="flex-1 py-1 pl-10 pr-4 rounded-sm border border-gray-300 focus:outline-none focus:ring-1 focus:ring-black"
        />
        <button 
          @click="fetchNews()" 
          class="bg-black text-white px-2 py-1 rounded-sm hover:bg-gray-900"
        >
          搜索
        </button>
      </div>
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400 absolute top-1/2 left-7 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="text-center p-6 text-gray-500">
      正在加载新闻...
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

    <!-- 新闻列表（动态渲染API数据） -->
    <div v-else class="p-4">
      <NewsCard 
        v-for="article in newsList"
        :key="article.articleId"
        :imgSrc="article.image || 'https://picsum.photos/seed/default/200/150'"
        :title="article.title"
        :source="article.source.name"
        :time="formatTime(article.publishedAt)"
        :to="`/news/${article.articleId}`"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';  // 引入axios
import NewsCard from '../components/NewsCard.vue';

// 1. 响应式数据（API请求参数、返回数据、状态）
const newsList = ref([]);  // 新闻列表（API返回的articles）
const loading = ref(false);  // 加载状态
const error = ref('');  // 错误信息
const page = ref(1);  // 当前页码（默认1）
const pageSize = ref(20);  // 每页条数（默认20，最大100）
const searchQuery = ref('');  // 搜索关键词（对应API的q参数）
const totalResults = ref(0);  // 符合条件的新闻总条数（API返回）
const loadingMore = ref(false); // 加载更多状态
const hasMore = ref(true); // 是否还有更多数据


// 2. 时间格式化函数（ISO 8601 → 友好格式，如“2小时前”“2023-10-15 16:30”）
const formatTime = (isoTime) => {
  if (!isoTime) return '';
  const now = new Date();
  const publishTime = new Date(isoTime);
  const diffMs = now - publishTime;  // 时间差（毫秒）
  
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
const fetchNews = async () => {
  loading.value = true;
  error.value = '';
  const baseUrl = 'http://localhost:8080';  // API基础地址（注意：实际需确认是否为HTTPS）
  const apiUrl = `${baseUrl}/v1/api/top-headlines`;

  try {
    // 拼接请求参数（按API要求）
    const response = await axios.get(apiUrl, {
      params: {
        country: null,  // 默认筛选中国新闻（可改为响应式参数让用户选择）
        lang: 'en',     // 默认英文（可配置）
        category: 'general',   // 默认general（可添加分类下拉框扩展，分类必须为预设值（general/business/technology/entertainment/sports/health/science/world/nation））
        q: searchQuery.value,  // 搜索关键词
        page: page.value,      // 当前页码
        pageSize: pageSize.value  // 每页条数
      }
    });

    const { data } = response;
    // 校验API响应状态
    if (data.status !== 'ok' || data.resultCode !== '000000') {
      throw new Error(`API错误：${data.resultMsg || '获取新闻失败'}`);
    }

    // 赋值数据, data.data 结构包含 articles 和 totalResults
    // console.log('Fetched news data:', data.data);
    newsList.value = data.data.articles || [];
    totalResults.value = data.data.totalResults || 0;

    // 解析 source.name 字段的 JSON 字符串, 再赋值
    for (const article of newsList.value) {
      let source = JSON.parse(article.source.name);
      article.source.name = source.name;
    }

  } catch (err) {
    // 捕获错误（网络错误或API业务错误）
    error.value = err.message || '网络异常，请稍后重试';
    newsList.value = [];
    totalResults.value = 0;
  } finally {
    loading.value = false;
  }
};

// 4. 组件挂载时首次请求数据
onMounted(() => {
  fetchNews();
});
</script>

<style scoped>
.news-list {
  height: 100vh;
  display: flex;
  flex-direction: column;
}
</style>