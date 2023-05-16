/*
 * @LastEditors: liu yang
 * @description: 动态路由添加之前先对后端数据进行处理
 * @Date: 2021-03-09 17:33:57
 * @LastEditTime: 2023-05-15 14:17:43
 * @Author: liuYang
 *
 * meta中额外参数
 * title: 显示在侧边栏、 面包屑和标签栏的文字
 * path: 路由的地址
 * name: 路由的name
 *   icon: (-) 该页面在左侧菜单、 面包屑和标签导航处显示的图标， 如果是自定义图标， 需要在图标名称前加下划线 '_'
 *   hideInBread: (false) 设为true后此级路由将不会出现在面包屑中，
 *   hideInMenu: (false) 设为true后在左侧菜单不会显示该页面选项
 *   keepAlive: (false) true是缓存 false是不缓存
 *   buttons: 页面内哪些模块显示
 *   sort: 2, 排序
 */
/**
 * 生成路由
 * @param {Array} routerList 格式化路由
 * @returns
 */
import router from './index.js';
import Layout from '@/layout/index.vue';
import { listToTree } from '@/utils/treeTool';
import { getThisUserMenuTree, getPermFuncList } from '@/api/modules/this';
import { PermissionRouter } from './modules/asyncRouter.js';
import { hideInMenuRouter } from './modules/hideInMenuRouter.js';
import { setSession } from '@/utils/storage.js';
import { handleStorageSyncServe } from '@/utils/array';
import { useUserStore } from '@/stores/user.js';
import { ElNotification } from 'element-plus';

export const handleMenuData = async (to) => {
  try {
    const {
      data: { funcList }
    } = await getPermFuncList();
    setSession('authList', funcList);
  } catch (err) {
    // console.log('[ err ] >', err);
  }
  // 记录路由获取状态
  getThisUserMenuTree() // 获取动态路由的方法
    .then(({ data: { menus } }) => {
      const userStore = useUserStore();

      // 2.判断当前用户有没有菜单权限
      if (!menus.length) {
        ElNotification({
          title: '无权限访问',
          message: '当前账号无任何菜单权限，请联系系统管理员！',
          type: 'error',
          duration: 3000
        });
        userStore.logout();
        return;
      }
      menus = handleStorageSyncServe(menus);

      const asyncData = listToTree({
        list: menus,
        orderBy: 'menuOrder'
      });
      const asyncRouter = transformRouterData(asyncData); // 进行递归解析
      const lastAsyncRouter = [...asyncRouter, ...hideInMenuRouter];
      lastAsyncRouter.forEach((row) => {
        return router.addRoute(row);
      });
      userStore.setMenuList(asyncRouter);
      if (to && to.path !== '/') {
        router.replace(to);
      } else {
        // 因为是一设备多用户登录出现问题
        router.replace(userStore.defaultRouter);
      }
    })
    .catch((e) => {
      console.error('%c [ getThisUserMenuTree catch ]', 'font-size:13px; background:#F6504D; color:#fff;', e);
      // removeToken();
    });
};

/**
 * 转换树形结构
 * @param {Array} routerList 已经转换成树形结构的数据
 * @return void
 */
export const transformRouterData = (routerList) => {
  // 按照父id分组

  const routers = [];
  routerList.forEach((e) => {
    // console.log(e)
    let menu = {
      path: e.menuHref || `/path${e.menuId}`,
      name: e.menuHref?.replace('/', '') || `path${e.menuId}`
    };
    if (e.children) {
      menu = {
        ...menu,
        ...{
          component: Layout,
          children: transformRouterData(e.children)
        }
      };
    }
    delete e.children;
    // 本系统
    if (e.hrefType === 1 || e.hrefType === 2) {
      const { component, meta, name } = PermissionRouter.find((item) => e.menuHref === item.path);
      menu = {
        ...menu,
        ...{ component, meta, name }
      };
    }
    // 其他子系统全路径 或者  其他外链
    if (e.hrefType === 3) {
      const { component, meta } = PermissionRouter.find((item) => item.path === '/iframepage');
      menu = {
        ...menu,
        ...{ component },
        path: `/iframepage${e.menuId}`,
        name: `/iframepage${e.menuId}`,
        meta: {
          ...meta,
          uri: e.menuHref,
          title: e.menuName || '',
          icon: e.menuIcon || '',
          ...e
        }
      };
      if (e.menuPid === 0) {
        menu = {
          ...{
            ...menu,
            component: Layout,
            children: [
              {
                ...menu
              }
            ]
          }
        };
      }
      // debugger
    }
    if (e.redirect) {
      menu = {
        ...menu,
        ...{
          redirect: e.redirect
        }
      };
    }
    menu = {
      ...menu,
      ...{
        meta: {
          ...e,
          ...menu.meta,
          title: e.menuName || '',
          icon: e.menuIcon || ''
        }
      }
    };

    routers.push(menu);
  });
  return routers;
};
