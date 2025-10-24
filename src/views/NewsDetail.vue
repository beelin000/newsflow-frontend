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

    <!-- 新闻内容 -->
    <div class="p-4">
      <img src="https://picsum.photos/seed/newsdetail/800/400" alt="News Detail Image" class="w-full h-64 object-cover rounded-lg mb-4" />
      <h1 class="text-2xl font-bold mb-2">Major Global Summit Concludes with Landmark Climate Accord</h1>
      <p class="text-gray-500 text-sm mb-4">BBC News • Jane Smith • 1h ago</p>
      <p class="text-gray-700 leading-relaxed">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse hendrerit pharetra semper. Integer at nisl. Fusce iniste elit. Donec eget turpis pretium lectus. I read the retrospective climate, climate. Climates and now agreed upon endeavors. Lorem ipsum impetus find around the front during review. Global summit soon the greater. Surplus side laumont is slated for treatment, or check and the endangered fire, honor while. IO be me if and climate, sandreenenol the midwives sunlit and teeuples of in schoring the she brung publishes not premored hoe verrnicus sh temretor the the sensdiog sdnt ue cenes are articulate, heris spued...
      </p>
    </div>
  </div>
</template>

<script setup>
// 实际项目中可通过路由参数获取新闻数据，此处为示例写死内容
</script>

<style scoped>
.news-detail {
  height: 100vh;
  display: flex;
  flex-direction: column;
}
</style>