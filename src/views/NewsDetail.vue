<template>
  <div class="news-detail">
    <!-- 顶部导航栏（返回+分享） -->
    <header class="bg-black text-white p-4 flex items-center justify-between">
      <router-link to="/" class="text-white">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
      </router-link>
      <button class="text-white">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
        </svg>
      </button>
    </header>

    <!-- 加载状态 -->
    <div v-if="loading" class="text-center p-6 text-gray-500">
      正在加载新闻详情...
    </div>

    <!-- 错误状态 -->
    <div v-else-if="error" class="text-center p-6 text-red-500">
      {{ error }}
    </div>

    <!-- 新闻详情（动态渲染API数据） -->
    <div v-else class="max-w-6xl mx-auto px-4">
      <h1 class="text-2xl font-bold mb-4 line-clamp-3">{{ newsDetail.title }}</h1>
      <!-- 新闻来源+发布时间 -->
      <p class="text-gray-500 text-sm mb-4">
        {{ newsDetail.source?.name }}  •  {{ formatTime(newsDetail.publishedAt) }}
      </p>
      <!-- 新闻配图 -->
      <img 
        v-if="newsDetail.image" 
        :src="newsDetail.image" 
        alt="News Detail Image" 
        class="w-full object-cover rounded-lg mb-4"
      />
      <!-- 新闻摘要 -->
      <div v-if="newsDetail.description" class="text-gray-700 mb-4 p-3 bg-gray-50 rounded-lg">
        <strong>摘要：</strong>{{ newsDetail.description }}
      </div>
      <!-- 新闻内容（API返回content为null时提示） -->
      <div class="text-gray-700 leading-relaxed">
        <p v-if="newsDetail.content" v-html="newsDetail.content"></p>  <!-- 用v-html渲染富文本（需确保内容安全） -->
        <p v-else class="text-gray-500">暂无完整内容，点击原文查看 →</p>
      </div>
      <!-- 原文链接 -->
      <a 
        v-if="newsDetail.url" 
        :href="newsDetail.url" 
        target="_blank" 
        class="inline-block mt-6 text-blue-500 hover:underline"
      >
        查看原文
      </a>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';  // 用于获取路由参数
import axios from 'axios';
import { useNewsStore } from '../stores/newsStore';

const newsStore = useNewsStore(); // 引入store

// 1. 获取路由参数（articleId）
const route = useRoute();
const articleId = route.params.articleId;  // 对应列表页路由的`:articleId`

// 2. 响应式数据
const newsDetail = ref({});  // 单条新闻详情
const loading = ref(false);
const error = ref('');

// 3. 复用时间格式化函数（同NewsList.vue，可抽为工具函数）
const formatTime = (isoTime) => {
  if (!isoTime) return '';
  return new Date(isoTime).toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// 4. 请求单条新闻详情（假设API支持通过articleId筛选，或替换为独立详情接口）
const fetchNewsDetail = async () => {
  loading.value = true;
  error.value = '';
  
  // 从环境变量获取配置
  const baseUrl = process.env.VUE_APP_BASE_URL;
  const apiUrl = `${baseUrl}${process.env.VUE_APP_ARTICLE_API}`;

  try {
    // 1. 先从Pinia中查找
    const cachedNews = newsStore.getNewsById(articleId);
    if (cachedNews) {
      newsDetail.value = cachedNews;
      loading.value = false;
      return; // 找到则直接返回，无需请求接口
    }

    // 2. 若缓存中没有，再请求接口（避免直接访问详情页时无数据）
    const response = await axios.get(apiUrl, {
      params: { articleId }
    });

    const { data } = response;
    if (data.status !== 'ok' || data.resultCode !== '000000') {
      throw new Error(`API错误：${data.resultMsg || '获取新闻详情失败'}`);
    }

    // 赋值数据, data.data 结构包含 articles 和 totalResults
    // 从articles数组中取第一条（因筛选了articleId，数组长度应为1）
    newsDetail.value = data.newsdata.articles?.[0] || {};
    if (Object.keys(newsDetail.value).length === 0) {
      throw new Error('未找到该新闻详情');
    }

  } catch (err) {
    error.value = err.message || '网络异常，请稍后重试';
  } finally {
    loading.value = false;
  }
};

// 5. 组件挂载时请求详情
onMounted(() => {
  if (articleId) {
    fetchNewsDetail();
  } else {
    error.value = '无效的新闻ID';
  }
});
</script>

<style scoped>
.news-detail {
  height: 100vh;
  display: flex;
  flex-direction: column;
}
</style>