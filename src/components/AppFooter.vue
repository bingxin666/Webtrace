<template>
  <footer class="footer">
    <div>
      <span>{{ quote }}</span>
      <span style="margin-left: 15px; opacity: 0.6">{{ currentTime }}</span>
    </div>
  </footer>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue'

export default {
  name: 'AppFooter',
  setup() {
    const currentTime = ref(new Date().toLocaleTimeString())
    const quote = ref('青，取之于蓝而青于蓝。')
    
    // 计时器
    let timer
    
    onMounted(() => {
      // 定时更新时间
      timer = setInterval(() => {
        currentTime.value = new Date().toLocaleTimeString()
      }, 1000)
      
      // 获取一言
      fetchQuote()
    })
    
    onUnmounted(() => {
      clearInterval(timer)
    })
    
    // 获取一言
    const fetchQuote = async () => {
      try {
        const response = await fetch('https://v1.hitokoto.cn')
        const data = await response.json()
        quote.value = data.hitokoto
      } catch (error) {
        console.error('获取一言失败:', error)
      }
    }
    
    return {
      currentTime,
      quote
    }
  }
}
</script>

<style>
.footer {
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  padding: 10px 20px;
  background-color: #fff;
  border-top: 1px solid #ebeef5;
  text-align: center;
  font-size: 14px;
  color: #606266;
  z-index: 1000;
}
</style>
