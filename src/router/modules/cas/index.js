/*
 * @LastEditors: liu yang
 * @Description: 权限相关
 * @Date: 2022-12-02 16:22:13
 * @LastEditTime: 2023-05-16 09:57:00
 * @Author: liu yang
 */
export const cas = [
  {
    path: '/subsystem',
    name: 'Subsystem',
    meta: {
      keepAlive: true,
      hideInMenu: false
    },
    component: () => import('@/views/Subsystem/Subsystem.vue')
  },
  {
    path: '/pages',
    name: 'Pages',
    meta: {
      keepAlive: true,
      hideInMenu: false
    },
    component: () => import('@/views/Pages/Pages.vue')
  },
  {
    path: '/menus',
    name: 'Menus',
    meta: {
      keepAlive: true,
      hideInMenu: false
    },
    component: () => import('@/views/Menus/Menus.vue')
  },
  {
    path: '/groups',
    name: 'Groups',
    meta: {
      keepAlive: true,
      hideInMenu: false
    },
    component: () => import('@/views/Groups/Groups.vue')
  },
  {
    path: '/role',
    name: 'Role',
    meta: {
      keepAlive: true,
      hideInMenu: false
    },
    component: () => import('@/views/Role/Role.vue')
  },
  {
    path: '/personnel',
    name: 'Personnel',
    meta: {
      keepAlive: true,
      hideInMenu: false
    },
    component: () => import('@/views/Personnel/Personnel.vue')
  }
];
