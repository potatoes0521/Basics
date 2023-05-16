/*
 * @LastEditors:
 * @Description: 不需要菜单控制但是需要登录才能进入的界面 游离页面
 * @Date: 2021-09-28 14:51:48
 * @LastEditTime: 2023-04-21 16:43:10
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
      },
      {
        path: '/stasalistdetail',
        name: 'StaSaListDetail',
        meta: {
          hideInMenu: true,
          icon: '',
          keepAlive: true,
          title: '服务区列表详情'
        },
        component: () => import('@/views/StaSaListDetail/StaSaListDetail.vue')
      },
      {
        path: '/sareport',
        name: 'SaReport',
        meta: {
          keepAlive: true,
          hideInMenu: false,
          title: '服务区上报'
        },
        component: () => import('@/views/SaReport/SaReport.vue')
      },
      {
        path: '/stasalistadd',
        name: 'StaSaListAdd',
        meta: {
          hideInMenu: true,
          icon: '',
          keepAlive: true,
          title: '服务区新增'
        },
        component: () => import('@/views/StaSaListAdd/StaSaListAdd.vue')
      },
      {
        path: '/sadetail',
        name: 'SaDetail',
        meta: {
          hideInMenu: true,
          icon: '',
          keepAlive: true,
          title: '服务区详情'
        },
        component: () => import('@/views/SaDetail/SaDetail.vue')
      },
      {
        path: '/chargingfacilitiesdetail',
        name: 'ChargingFacilitiesDetail',
        meta: {
          hideInMenu: true,
          icon: '',
          keepAlive: true,
          title: '充/换电站详情'
        },
        component: () => import('@/views/ChargingFacilitiesDetail/ChargingFacilitiesDetail.vue')
      }
    ]
  }
];
