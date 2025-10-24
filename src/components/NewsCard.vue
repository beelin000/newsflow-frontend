<template>
  <router-link :to="to" class="news-card flex items-center p-2 mb-1 border-b border-gray-200">
    <!-- 左侧图片区域 -->
    <div class="w-1/4 h-full overflow-hidden mr-4 flex-shrink-0">
      <img :src="imgSrc" alt="News Image" class="w-full h-full object-cover" />
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
</script>


  <router-link :to="to" class="news-card flex items-center p-3 border-b border-gray-200">
    <!-- 左侧图片区域 -->
    <div class="w-32 h-24 overflow-hidden mr-4 flex-shrink-0">
      <img :src="imgSrc" alt="News Image" class="w-full h-full object-cover" />
    </div>
    <!-- 右侧文字区域 -->
    <div class="flex-1">
      <h2 class="font-bold text-lg mb-1">{{ title }}</h2>
      <p class="text-gray-500 text-sm">{{ source }} • {{ time }}</p>
    </div>
  </router-link>


  原布局：
    <router-link :to="to" class="news-card bg-white rounded-lg overflow-hidden shadow-md">
    <img :src="imgSrc" alt="News Image" class="w-full h-40 object-cover" />
    <div class="p-3">
      <h2 class="font-bold text-lg mb-2">{{ title }}</h2>
      <p class="text-gray-500 text-sm">{{ source }} • {{ time }}</p>
    </div>
  </router-link>