import 'tdesign-vue-next/es/style/index.css'
import './styles/index.less'

import TDesign from 'tdesign-vue-next'
import { createApp } from 'vue'

import App from './App.vue'
import { router } from './router/index'

const app = createApp(App)

app.use(router)
app.use(TDesign)
app.mount('#app')
