<template>
  <router-link :to="to" class="news-card flex items-center p-2 mb-1 border-b border-gray-200">
    <!-- 左侧图片区域 -->
    <div class="w-1/4 h-full overflow-hidden mr-4 flex-shrink-0">
      <img :src="imgSrc" alt="News Image" class="w-full h-full object-cover" @error="handleImgError"/>
    </div>
    <!-- 右侧文字区域 -->
    <div class="flex-1">
      <h2 class="font-bold text-lg mb-1">{{ title }}</h2>
      <p class="text-gray-500 text-sm">{{ source }} • {{ time }}</p>
    </div>
  </router-link>
</template>

<script setup>
defineProps({
  imgSrc: String,
  title: String,
  source: String,
  time: String,
  to: String
});

// 图片加载失败时，替换为默认图
const handleImgError = (e) => {
  e.target.src = 'newsflow_logo.jpeg';
};

</script>


