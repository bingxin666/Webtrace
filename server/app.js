const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { exec } = require('child_process');

const app = express();

app.use(cors());
app.use(bodyParser.json());

const isValidIP = (ip) => {
    const ipv4Pattern = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    const ipv6Pattern = /^([0-9a-fA-F]{1,4}:){7}([0-9a-fA-F]{1,4}|:)$/;
    return ipv4Pattern.test(ip) || ipv6Pattern.test(ip);
};

app.post('/execute', (req, res) => {
    const { command, target } = req.body;

    if (!target) {
        return res.status(400).json({ result: '目标地址不能为空' });
    }

    if (!isValidIP(target)) {
        return res.status(403).json({ result: '未经授权的尝试' });
    }

    const executeCommand = (cmd) => {
        exec(cmd, (error, stdout, stderr) => {
            if (error) {
                res.json({ result: stderr });
            } else {
                res.json({ result: stdout });
            }
        });
    };

    if (command === 'traceroute') {
        executeCommand(`traceroute ${target}`);
    } else if (command === 'ping') {
        executeCommand(`ping -c 4 ${target}`);
    } else if (command === 'mtr') {
        executeCommand(`mtr --report ${target}`);
    } else {
        res.status(400).json({ result: '无效的命令' });
    }
});

app.listen(5004, () => {
    console.log('服务器正在运行在 http://localhost:5004');
});