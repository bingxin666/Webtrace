<template>
  <div class="navigation">
    <el-button
      class="nav-button"
      :type="$route.path === '/' ? 'primary' : 'default'"
      plain
      @click="$router.push('/')"
    >
      首页
    </el-button>
    
    <el-button
      class="nav-button"
      :type="$route.path === '/about' ? 'primary' : 'info'"
      plain
      @click="$router.push('/about')"
    >
      关于
    </el-button>
    
    <el-button
      class="nav-button"
      :type="$route.path === '/help' ? 'primary' : 'success'"
      plain
      @click="$router.push('/help')"
    >
      帮助
    </el-button>
  </div>
</template>

<script>
export default {
  name: 'AppNavigation'
}
</script>
