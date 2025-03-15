<template>
  <div class="tool-panel">
    <h2>
      关于 WebTrace
    </h2>
    <el-divider />
    <p>WebTrace 是一款网络诊断工具，旨在帮助用户快速诊断网络连接问题。</p>
    <p>本工具基于Vue 3和Element Plus开发，提供了traceroute、ping和mtr等功能。</p>
    <h3 style="margin-top: 20px">特性</h3>
    <ul style="padding-left: 20px">
      <li>支持IPv4和IPv6地址</li>
      <li>实时展示命令执行结果</li>
      <li>响应式设计，支持移动设备</li>
      <li>支持暗色模式</li>
    </ul>
    <p style="margin-top: 20px; color: #909399">版本: 1.0.0</p>
  </div>
</template>

<script>
export default {
  name: 'AboutView'
}
</script>
