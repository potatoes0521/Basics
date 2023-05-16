/*
 * @LastEditors: liu yang
 * @Description: 不需要菜单控制但是需要登录才能进入的界面 游离页面
 * @Date: 2021-09-28 14:51:48
 * @LastEditTime: 2023-05-16 10:34:54
 * @Author: liu yang
 */
import Layout from '@/layout/index.vue';

export const hideInMenuRouter = [
  {
    path: '/hideMenu',
    component: Layout,
    name: 'hideMenu',
    meta: {
      title: '隐藏页面',
      keepAlive: true,
      hideInMenu: true,
      hideInBread: true
    },
    children: [
      {
        path: '/editperm',
        name: 'EditPerm',
        meta: {
          hideInMenu: true,
          icon: '',
          keepAlive: true,
          title: '分配权限'
        },
        component: () => import('@/views/EditPermission/EditPerm.vue')
      }
    ]
  }
];
