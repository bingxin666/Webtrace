<template>
  <div class="tool-panel">
    <h2>
      关于 WebTrace
    </h2>
    <el-divider />
    <p>WebTrace 是一款网络诊断工具，旨在帮助用户快速诊断网络连接问题。</p>
    <p>本工具基于 Vue 3 和 Element Plus 开发，提供了 traceroute、ping 和 mtr 等功能。</p>
    <h3 style="margin-top: 20px">特性</h3>
    <ul style="padding-left: 20px">
      <li>支持 IPv4 和 IPv6 地址</li>
      <li>实时展示命令执行结果</li>
      <li>响应式设计，支持移动设备</li>
    </ul>
    <p style="margin-top: 20px; color: #909399">版本: 1.0.0</p>
  </div>
</template>

<script>
export default {
  name: 'AboutView'
}
</script>
