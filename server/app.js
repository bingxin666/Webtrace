// 尽可能早地加载环境变量
require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { exec } = require('child_process');
const { promisify } = require('util');
const execAsync = promisify(exec);

// 创建 Express 应用
const app = express();
const PORT = process.env.PORT || 5004; // 使用环境变量中的端口，或默认值

// 也可以获取其他环境变量
const TIMEOUT = parseInt(process.env.TIMEOUT || 30000);

// 中间件
app.use(cors());
app.use(bodyParser.json());

// 改进的 IP 地址验证函数
const isValidIP = (ip) => {
  // IPv4 验证
  const ipv4Pattern = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  
  // 改进的 IPv6 验证
  const ipv6Pattern = /^(([0-9a-fA-F]{1,4}:){7}([0-9a-fA-F]{1,4}|:))|(([0-9a-fA-F]{1,4}:){6}(:[0-9a-fA-F]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9a-fA-F]{1,4}:){5}(((:[0-9a-fA-F]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9a-fA-F]{1,4}:){4}(((:[0-9a-fA-F]{1,4}){1,3})|((:[0-9a-fA-F]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9a-fA-F]{1,4}:){3}(((:[0-9a-fA-F]{1,4}){1,4})|((:[0-9a-fA-F]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9a-fA-F]{1,4}:){2}(((:[0-9a-fA-F]{1,4}){1,5})|((:[0-9a-fA-F]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9a-fA-F]{1,4}:){1}(((:[0-9a-fA-F]{1,4}){1,6})|((:[0-9a-fA-F]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9a-fA-F]{1,4}){1,7})|((:[0-9a-fA-F]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))/;
  
  // 测试 IP 地址格式
  return ipv4Pattern.test(ip) || ipv6Pattern.test(ip);
};

// 添加安全校验，防止命令注入
const sanitizeTarget = (target) => {
  // 移除可能导致命令注入的字符
  return target.replace(/[;&|`$><\n\r]/g, '');
};

// 健康检查端点
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// 诊断命令执行端点
app.post('/execute', async (req, res) => {
  try {
    const { command, target } = req.body;
    console.log(`收到请求: command=${command}, target=${target}`);
    
    // 参数验证
    if (!target) {
      return res.status(400).json({ result: '目标地址不能为空' });
    }
    
    if (!isValidIP(target)) {
      console.log(`IP 验证失败: ${target}`);
      return res.status(403).json({ result: '请输入有效的 IP 地址' });
    }
    
    // 目标地址安全处理
    const sanitizedTarget = sanitizeTarget(target);
    if (sanitizedTarget !== target) {
      console.log(`目标地址被清理: ${target} -> ${sanitizedTarget}`);
    }
    
    // 命令映射和执行
    let cmd;
    switch (command) {
      case 'traceroute':
        cmd = `traceroute ${sanitizedTarget}`;
        break;
      case 'ping':
        cmd = `ping -c 4 ${sanitizedTarget}`;
        break;
      case 'mtr':
        cmd = `mtr --report ${sanitizedTarget}`;
        break;
      default:
        return res.status(400).json({ result: '无效的命令' });
    }
    
    console.log(`执行命令: ${cmd}`);
    
    // 设置超时
    const timeout = TIMEOUT;
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('命令执行超时')), timeout)
    );
    
    // 执行命令或超时
    try {
      const result = await Promise.race([
        execAsync(cmd),
        timeoutPromise
      ]);
      
      console.log('命令执行成功');
      res.json({ result: result.stdout || result.stderr });
    } catch (cmdError) {
      console.error('命令执行错误:', cmdError.message);
      res.status(500).json({ result: `命令执行错误: ${cmdError.message}` });
    }
  } catch (error) {
    console.error('请求处理错误:', error);
    res.status(500).json({ result: '服务器内部错误' });
  }
});

// 错误处理中间件
app.use((err, req, res, next) => {
  console.error('未捕获的错误:', err);
  res.status(500).json({ result: '服务器内部错误' });
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`服务器正在运行在 http://localhost:${PORT}`);
});