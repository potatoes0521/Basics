/*
 * @LastEditors: liu yang
 * @Description: ...
 * @Date: 2022-02-21 11:48:28
 * @LastEditTime: 2023-05-16 09:58:35
 * @Author: liu yang
 */
import { createRouter, createWebHistory } from 'vue-router';
import { getConfig } from '@/config/index';
import { StaticRouterMap } from './modules/static';

export const routes = [...StaticRouterMap];

const router = createRouter({
  history: createWebHistory(getConfig('base')),
  routes,
  strict: false,
  scrollBehavior: () => ({ left: 0, top: 0 })
});

export default router;
