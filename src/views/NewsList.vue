<template>
  <div class="news-list">
    <!-- 顶部导航栏 -->
    <header class="bg-black text-white p-4 flex items-center justify-between">
      <h1 class="text-xl font-bold">NewsFlow</h1>
      <button class="text-white">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 13a5 5 0 0 1 5 5m0 0a5 5 0 0 1-5 5m5-5a5 5 0 0 0-5-5m0 0a5 5 0 0 0-5 5" />
        </svg>
      </button>
    </header>

    <!-- 搜索框 -->
    <div class="p-4">
      <div class="relative">
        <input type="text" placeholder="Search..." class="w-full py-2 pl-10 pr-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500" />
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400 absolute top-1/2 left-3 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
    </div>

    <!-- 新闻卡片网格 -->
    <div class="grid grid-cols-1 gap-4 p-4">
      <NewsCard 
        imgSrc="https://picsum.photos/seed/news1/300/200" 
        title="Jon Prosser Provides Update on Apple Lawsuit Over iOS 26 Leaks" 
        source="BBC News" 
        time="1h ago" 
        to="/news/1"
      />
      <NewsCard 
        imgSrc="https://picsum.photos/seed/news2/300/200" 
        title="Rowarnton Headlins" 
        source="TechCrunch" 
        time="56m ago" 
        to="/news/2"
      />
      <NewsCard 
        imgSrc="https://picsum.photos/seed/news3/300/200" 
        title="Sond Frus Headline" 
        source="BBC News" 
        time="5h ago" 
        to="/news/3"
      />
      <NewsCard 
        imgSrc="https://picsum.photos/seed/news4/300/200" 
        title="Thr Oiruth Headlins" 
        source="TechCrunch" 
        time="56m ago" 
        to="/news/4"
      />

      <NewsCard 
        imgSrc="https://picsum.photos/seed/news1/300/200" 
        title="Bod File Headline" 
        source="BBC News" 
        time="1h ago" 
        to="/news/1"
      />
      <NewsCard 
        imgSrc="https://picsum.photos/seed/news2/300/200" 
        title="Rowarnton Headlins" 
        source="TechCrunch" 
        time="56m ago" 
        to="/news/2"
      />
      <NewsCard 
        imgSrc="https://picsum.photos/seed/news3/300/200" 
        title="Sond Frus Headline" 
        source="BBC News" 
        time="5h ago" 
        to="/news/3"
      />
      <NewsCard 
        imgSrc="https://picsum.photos/seed/news4/300/200" 
        title="Thr Oiruth Headlins" 
        source="TechCrunch" 
        time="56m ago" 
        to="/news/4"
      />

      <NewsCard 
        imgSrc="https://picsum.photos/seed/news1/300/200" 
        title="Bod File Headline" 
        source="BBC News" 
        time="1h ago" 
        to="/news/1"
      />
      <NewsCard 
        imgSrc="https://picsum.photos/seed/news2/300/200" 
        title="Rowarnton Headlins" 
        source="TechCrunch" 
        time="56m ago" 
        to="/news/2"
      />
      <NewsCard 
        imgSrc="https://picsum.photos/seed/news3/300/200" 
        title="Sond Frus Headline" 
        source="BBC News" 
        time="5h ago" 
        to="/news/3"
      />
      <NewsCard 
        imgSrc="https://picsum.photos/seed/news4/300/200" 
        title="Thr Oiruth Headlins" 
        source="TechCrunch" 
        time="56m ago" 
        to="/news/4"
      />
    </div>
  </div>
</template>

<script setup>
import NewsCard from '../components/NewsCard.vue';
</script>

<style scoped>
.news-list {
  height: 100vh;
  display: flex;
  flex-direction: column;
}
</style>