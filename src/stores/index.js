/*
 * @LastEditors: liu yang
 * @Description: pinia状态管理
 * @Date: 2023-05-16 09:39:46
 * @LastEditTime: 2023-05-16 09:42:48
 * @Author: liu yang
 */

// import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';

const pinia = createPinia();

pinia.use(piniaPluginPersistedstate);

export default pinia;
