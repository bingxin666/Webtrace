<template>
  <div>
    <!-- 工具面板 -->
    <div class="tool-panel">
      <h2>
        网络诊断工具
      </h2>
      <el-divider />
      <el-form :model="form" label-position="top">
        <el-form-item label="选择命令">
          <el-select v-model="form.command" style="width: 100%">
            <el-option
              v-for="cmd in commandOptions"
              :key="cmd.value"
              :label="cmd.label"
              :value="cmd.value"
            >
              <span>{{ cmd.label }}</span>
              <span
                style="
                  float: right;
                  color: #8492a6;
                  font-size: 13px;
                "
              >{{ cmd.description }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <div class="command-description">
          {{ getCommandDescription() }}
        </div>
        <el-form-item label="目标地址 (IPv4/IPv6)" style="margin-top: 15px">
          <div class="action-row">
            <el-input
              v-model="form.target"
              class="target-input"
              placeholder="例如: 10.50.0.41 或 fddd:5050::1:41"
              prefix-icon="el-icon-position"
              :disabled="loading"
            />
            <el-button
              type="primary"
              @click="executeCommand"
              :loading="loading"
              :disabled="!form.target"
            >
              <el-icon-video-play />
              执行
            </el-button>
          </div>
        </el-form-item>
      </el-form>
    </div>
    
    <!-- 结果面板 -->
    <div class="result-panel">
        <div
            v-if="loading"
            style="text-align: center; padding: 40px 0"
        >
            <p style="margin-top: 15px; color: #909399">
                请耐心等待，命令执行中...
                <br>
                <small>可能需要3-60秒</small>
            </p>
        </div>
        <div v-else-if="output">
            <div style="display: flex; justify-content: flex-end; margin-bottom: 10px;">
                <el-button
                    size="small"
                    type="primary"
                    @click="copyToClipboard"
                >
                    复制结果
                </el-button>
            </div>
            <div class="result-content">{{ output }}</div>
        </div>
        <div
            v-else
            class="empty-result"
        >
            <p>在上方填写目标地址并选择命令后点击"执行"</p>
        </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import { ElMessage } from 'element-plus'

export default {
  name: 'HomeView',
  setup() {
    const form = reactive({
      command: 'traceroute',
      target: ''
    })
    const output = ref('')
    const loading = ref(false)
    const currentTime = ref(new Date().toLocaleTimeString())
    
    // 命令选项
    const commandOptions = [
      { value: 'traceroute', label: 'Traceroute', description: '跟踪网络路由' },
      { value: 'ping', label: 'Ping', description: '网络连通性测试' },
      { value: 'mtr', label: 'MTR', description: '实时网络诊断' }
    ]
    
    // 计时器
    let timer
    
    onMounted(() => {
      // 定时更新时间
      timer = setInterval(() => {
        currentTime.value = new Date().toLocaleTimeString()
      }, 1000)
    })
    
    onUnmounted(() => {
      clearInterval(timer)
    })
    
    // 执行命令
    const executeCommand = async () => {
      if (!form.target) {
        ElMessage({
          message: '请输入目标地址',
          type: 'warning'
        })
        return
      }
      
      loading.value = true
      output.value = ''
      
      try {
        const response = await fetch('http://localhost:5004/execute', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            command: form.command,
            target: form.target
          })
        })
        
        const data = await response.json()
        output.value = data.result
      } catch (error) {
        console.error('执行命令出错:', error)
        output.value = `执行命令时出错：${error.message}`
        ElMessage.error('命令执行失败，请检查服务器状态')
      } finally {
        loading.value = false
      }
    }
    
    // 获取命令描述
    const getCommandDescription = () => {
      switch (form.command) {
        case 'traceroute':
          return '追踪数据包从本机到目标主机经过的路由节点'
        case 'ping':
          return '测试本机到目标主机的连通性和响应时间'
        case 'mtr':
          return '结合 ping 和 traceroute 的综合网络诊断工具'
        default:
          return ''
      }
    }
    
    // 复制文本到剪贴板
    const copyToClipboard = () => {
      try {
        if (navigator && navigator.clipboard && navigator.clipboard.writeText) {
          // 使用现代Clipboard API
          navigator.clipboard.writeText(output.value)
            .then(() => ElMessage.success('已复制到剪贴板'))
            .catch(() => {
              fallbackCopyToClipboard(output.value);
            });
        } else {
          // 使用后备方案
          fallbackCopyToClipboard(output.value);
        }
      } catch (error) {
        console.error('复制失败:', error);
        ElMessage.error('复制失败');
      }
    }
    
    // 后备剪贴板复制方法
    const fallbackCopyToClipboard = (text) => {
      try {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';  // 避免滚动到底部
        textArea.style.left = '0';
        textArea.style.top = '0';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        const successful = document.execCommand('copy');
        document.body.removeChild(textArea);
        
        if (successful) {
          ElMessage.success('已复制到剪贴板');
        } else {
          ElMessage.error('复制失败');
        }
      } catch (err) {
        console.error('复制失败:', err);
        ElMessage.error('复制失败');
      }
    }
    
    return {
      form,
      output,
      loading,
      currentTime,
      commandOptions,
      executeCommand,
      getCommandDescription,
      copyToClipboard
    }
  }
}
</script>

<style>
.tool-panel, .result-panel {
  width: 100%;
  position: relative;
  margin-bottom: 20px;
}

.command-description {
  color: #606266;
  font-size: 14px;
  margin-bottom: 10px;
}

.action-row {
  display: flex;
  gap: 10px;
}

.target-input {
  flex: 1;
}

.result-content {
  background-color: #f5f7fa;
  padding: 15px;
  border-radius: 4px;
  font-family: monospace;
  white-space: pre-wrap;
  overflow-x: auto;
  height: auto;
  min-height: 200px;
}

.time-badge {
  position: absolute;
  top: 0;
  right: 0;
  background-color: #909399;
  color: white;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
}

.empty-result {
  text-align: center;
  color: #909399;
  padding: 40px 0;
}
</style>
