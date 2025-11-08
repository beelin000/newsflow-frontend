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
        class="inline-block mt-6 text-black hover:underline float-right"
      >
        原文链接
      </a>


      <!-- AI解读区域 -->
      <div class="mt-8 px-4 max-w-6xl mx-auto">
        <button 
          @click="fetchAiInterpretation" 
          :disabled="isAiLoading"
          class="bg-black text-white px-5 py-2.5 rounded-lg mb-4 disabled:bg-gray-500 transition-all duration-200 transform active:scale-95 flex items-center gap-2 shadow-md hover:shadow-lg disabled:shadow-none hover:bg-gray-800 active:bg-gray-900"
        >
          <svg v-if="!isAiLoading" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707-.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
          <span v-if="!isAiLoading">AI解读</span>
          <span v-if="isAiLoading" class="flex items-center gap-1">
            <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            解读中...
          </span>
        </button>
        
        <div v-if="aiError" class="text-red-500 mb-4 p-3 bg-red-50 rounded-lg border border-red-100">{{ aiError }}</div>
        
        <div v-if="aiContent" class="bg-gray-50 p-5 rounded-xl border border-gray-200 shadow-sm transition-all duration-300 hover:shadow-md">
          <h3 class="font-bold text-lg mb-3 flex items-center gap-2 text-gray-800">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707-.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </h3>
          <div class="text-gray-700 leading-relaxed whitespace-pre-line">
            {{ displayedAiContent }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
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

// AI解读相关
const aiContent = ref('');         // 完整的AI解读内容
const displayedAiContent = ref('');// 逐字显示的内容
const isAiLoading = ref(false);    // AI解读加载状态
const aiError = ref('');           // AI解读错误信息
let typewriterTimer = null;        // 逐字输出定时器

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
    const cachedNews = newsStore.getFullNewsById(articleId);
    if (cachedNews) {
      console.log("Found news in cache: " + articleId);
      newsDetail.value = cachedNews;
      loading.value = false;
      return; // 找到则直接返回，无需请求接口
    }

    // 2. 若缓存中没有，再请求接口（避免直接访问详情页时无数据）
    console.log("Fetching news from API: " + articleId);
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
    // 将详情存入Pinia缓存
    newsStore.setFullNews(newsDetail.value);

  } catch (err) {
    error.value = err.message || '网络异常，请稍后重试';
  } finally {
    loading.value = false;
  }
};


// 请求AI解读
const fetchAiInterpretation = async () => {
  console.log("button clicked:", articleId);
  if (!articleId || !newsDetail.value.title) {
    aiError.value = '缺少新闻信息，无法获取解读';
    return;
  }

  isAiLoading.value = true;
  aiError.value = '';
  aiContent.value = '';
  displayedAiContent.value = '';
  
  // 清除可能存在的定时器
  if (typewriterTimer) {
    clearInterval(typewriterTimer);
  }

  try {
    const baseUrl = process.env.VUE_APP_BASE_URL;
    const apiUrl = `${baseUrl}${process.env.VUE_APP_AI_INTERPRET_API}`;

    const response = await axios.get(apiUrl, {
      params: {
        articleId: articleId
      }
    });

    const { data } = response;
    if (data.status !== 'ok' || data.resultCode !== '000000') {
      throw new Error(`AI解读失败：${data.resultMsg || '获取解读内容失败'}`);
    }

    // 存储完整AI解读内容
    aiContent.value = data.result || '暂无有效解读内容';
    
    // 启动逐字输出效果
    startTypewriterEffect();

  } catch (err) {
    aiError.value = err.message || 'AI解读请求失败，请稍后重试';
  } finally {
    isAiLoading.value = false;
  }
};

// 逐字输出效果
const startTypewriterEffect = () => {
  let index = 0;
  displayedAiContent.value = '';
  
  // 清除可能存在的定时器
  if (typewriterTimer) {
    clearInterval(typewriterTimer);
  }
  
  // 每50ms输出一个字符，实现打字机效果
  const typingSpeed = `${process.env.VUE_APP_TYPE_SPEED}`;
  typewriterTimer = setInterval(() => {
    if (index < aiContent.value.length) {
      displayedAiContent.value += aiContent.value.charAt(index);
      index++;
    } else {
      clearInterval(typewriterTimer);
      typewriterTimer = null;
    }
  }, typingSpeed);
};

// 组件卸载时清除定时器
onUnmounted(() => {
  if (typewriterTimer) {
    clearInterval(typewriterTimer);
  }
});

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