<template>
  <header class="header">
    <div class="logo">
      <span> Bingxin WebTrace</span>
    </div>
    <div class="theme-switch" @click="toggleDarkMode" style="display: flex; align-items: center; margin: auto 0;">
      <el-icon v-if="isDarkMode" style="font-size: 150%;"><Sunny /></el-icon>
      <el-icon v-else style="font-size: 150%;"><Moon /></el-icon>
    </div>
  </header>
</template>

<script>
import { Sunny, Moon } from '@element-plus/icons-vue'

export default {
  name: 'AppHeader',
  components: {
    Sunny,
    Moon
  },
  props: {
    isDarkMode: {
      type: Boolean,
      required: true
    }
  },
  emits: ['toggleDarkMode'],
  setup(props, { emit }) {
    const toggleDarkMode = () => {
      emit('toggleDarkMode')
      console.log('Current mode:', props.isDarkMode)
    }
    
    return {
      toggleDarkMode
    }
  }
}
</script>