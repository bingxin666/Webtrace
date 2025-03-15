<template>
  <div class="tool-panel">
    <h2>
      使用帮助
    </h2>
    <el-divider />
    <h3>Traceroute</h3>
    <p>Traceroute 命令用于显示数据包到达目标所经过的路由器。</p>
    <p>使用方法：选择命令"Traceroute"，输入目标IP地址或域名，点击"执行"按钮。</p>
    
    <h3 style="margin-top: 15px">Ping</h3>
    <p>Ping 命令用于测试与目标主机的连通性。</p>
    <p>使用方法：选择命令"Ping"，输入目标IP地址或域名，点击"执行"按钮。</p>
    
    <h3 style="margin-top: 15px">MTR</h3>
    <p>MTR 命令结合了 traceroute 和 ping 的功能，可以实时显示网络连接情况。</p>
    <p>使用方法：选择命令"MTR"，输入目标IP地址或域名，点击"执行"按钮。</p>
    
    <h3 style="margin-top: 15px">常见问题</h3>
    <p style="font-weight: bold">问：为什么命令执行时间较长？</p>
    <p>答：网络诊断工具需要等待网络响应，根据网络状况和目标距离，可能需要3-60秒不等。</p>
    <p style="font-weight: bold; margin-top: 10px">问：为什么有些IP地址无法访问？</p>
    <p>答：这可能是由于防火墙策略、路由问题或目标主机不响应ICMP包所致。</p>
  </div>
</template>

<script>
export default {
  name: 'HelpView'
}
</script>
