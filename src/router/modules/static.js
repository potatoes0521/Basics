/*
 * @LastEditors: liu yang
 * @Description: 静态路由-无需登录
 * @Date: 2021-09-28 14:51:48
 * @LastEditTime: 2023-05-16 10:31:34
 * @Author: liu yang
 */

export const whiteList = ['/login', '/500', '/403'];

export const StaticRouterMap = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    meta: {},
    component: () => import('@/views/Login/index.vue')
  },
  {
    path: '/layout',
    name: 'layout',
    component: () => import('@/layout/index.vue'),
    redirect: '/login',
    children: []
  }
];
