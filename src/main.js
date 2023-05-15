/*
 * @LastEditors: liu yang
 * @Description: ...
 * @Date: 2023-05-15 14:21:20
 * @LastEditTime: 2023-05-15 16:44:50
 * @Author: liu yang
 */
import 'virtual:windi.css';
import 'element-plus/dist/index.css';
import '@/styles/index.scss';

import { createApp } from 'vue';
import { createPinia } from 'pinia';

import App from './App.vue';
import router from './router';

const app = createApp(App);

app.use(createPinia());
app.use(router);

app.mount('#app');
