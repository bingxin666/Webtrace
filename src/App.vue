<template>
  <div class="app-container">
    <!-- 页面头部 -->
    <AppHeader 
      :is-dark-mode="isDarkMode" 
      @toggle-dark-mode="toggleDarkMode"
    />
    
    <!-- 导航栏 -->
    <AppNavigation />
    
    <!-- 主内容区 -->
    <main class="main-content">
      <router-view />
    </main>
    
    <!-- 页面底部 -->
    <AppFooter />
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import AppHeader from '@/components/AppHeader.vue'
import AppNavigation from '@/components/AppNavigation.vue'
import AppFooter from '@/components/AppFooter.vue'

export default {
  name: 'App',
  components: {
    AppHeader,
    AppNavigation,
    AppFooter
  },
  setup() {
    const isDarkMode = ref(localStorage.getItem('darkMode') === 'true')
    
    // 更新文档主题
    const updateTheme = () => {
      if (isDarkMode.value) {
        document.body.classList.add('dark-mode')
      } else {
        document.body.classList.remove('dark-mode')
      }
    }
    
    // 切换主题
    const toggleDarkMode = () => {
      isDarkMode.value = !isDarkMode.value
      localStorage.setItem('darkMode', isDarkMode.value)
      updateTheme()
    }
    
    onMounted(() => {
      updateTheme()
    })
    
    return {
      isDarkMode,
      toggleDarkMode
    }
  }
}
</script>
