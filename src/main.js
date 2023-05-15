/*
 * @LastEditors: liu yang
 * @Description: ...
 * @Date: 2023-05-15 14:21:20
 * @LastEditTime: 2023-05-15 14:46:43
 * @Author: liu yang
 */
import './assets/main.css'
import 'virtual:windi.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
