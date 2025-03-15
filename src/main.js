import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import App from './App.vue'
import router from './router'
import './assets/css/main.css'

const app = createApp(App)

// 注册Element Plus图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
    // 添加带el-icon-前缀的别名以兼容原代码
    app.component(`el-icon-${kebabCase(key)}`, component)
}

// 注册特定的图标别名
function registerIconAliases() {
    app.component('el-icon-connection', ElementPlusIconsVue.Connection)
    app.component('el-icon-house', ElementPlusIconsVue.House)
    app.component('el-icon-info-filled', ElementPlusIconsVue.InfoFilled)
    app.component('el-icon-question-filled', ElementPlusIconsVue.QuestionFilled)
    app.component('el-icon-monitor', ElementPlusIconsVue.Monitor)
    app.component('el-icon-position', ElementPlusIconsVue.Location)
    app.component('el-icon-video-play', ElementPlusIconsVue.VideoPlay)
    app.component('el-icon-terminal', ElementPlusIconsVue.Terminal)
    app.component('el-icon-loading', ElementPlusIconsVue.Loading)
    app.component('el-icon-sunny', ElementPlusIconsVue.Sunny)
    app.component('el-icon-moon', ElementPlusIconsVue.Moon)
}

// 工具函数：转换驼峰为短横线命名
function kebabCase(str) {
    return str.replace(/([A-Z])/g, '-$1').toLowerCase().substring(1)
}

registerIconAliases()

app.use(ElementPlus)
app.use(router)
app.mount('#app')
