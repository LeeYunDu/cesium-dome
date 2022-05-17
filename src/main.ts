import { createApp } from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import directivePlugin from '@/utils/directivePlugin'
import router from './router'
import store from './store'

const app = createApp(App)
/**
 * 引入 element-plus
 */
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import 'dayjs/locale/zh-cn'
import locale from 'element-plus/lib/locale/lang/zh-cn'
app.use(ElementPlus, { locale })

app.use(store)
app.use(router)

app.use(directivePlugin)

app.use(ElementPlus)

import { initGlobalComponents } from '@/components' // 自定义全局公共组件
initGlobalComponents(app)

app.mount('#app')
