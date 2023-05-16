/*
 * @LastEditors: liu yang
 * @Description: 路由拦截
 * @Date: 2022-02-25 11:17:04
 * @LastEditTime: 2023-05-16 09:53:52
 * @Author: liu yang
 */
import router from './index';
import getPageTitle from '@/utils/get-page-title';
import { getCookie } from '@/utils/storage';
import { useUserStore } from '@/stores/user';
import { checkHeartBeat } from '@/utils/cas';
import { whiteList } from './defaultRouter';

const title = useTitle();

router.beforeEach(async (to, from, next) => {
  // console.log('🚀 > file: permission.js  > to, from www', to, from);
  title.value = getPageTitle(to?.meta?.menuName || to.meta.title);
  // NProgress.start();
  const userStore = useUserStore();
  // const tabsStore = useCachesTabsStore();

  const token = getCookie('acToken', true);
  if (from.path === to.path && to.path !== '/') {
    next(false);
    return;
  }
  if (token) {
    // 不得不加这个  是因为如果单点登录过来  子系统退出 这个时候本地有token 但是token都失效了   必须重新登录
    const res = await checkHeartBeat();
    // 判断心跳失败
    if (!res) {
      next(false);
      // console.log('🚀 > file: permission.js > line 32 > router.beforeEach > 判断心跳失败', res);
      userStore.logout();
      return;
    }
    // console.log('🚀 > file: permission.js  > to, from', to);
    // 有无菜单权限
    if (userStore.menuList.length) {
      // console.log('🚀 > file: permission.js  > 有菜单');
      if (!['/login', '/', ''].includes(to.path)) {
        next();
      } else {
        next(userStore.defaultRouter);
      }
    } else {
      // 无菜单 去请求菜单
      // console.log('🚀 > file: permission.js  > 无菜单 去请求菜单');
      next(false);
      userStore.setUserInfo(to);
    }
  } else if (whiteList.includes(to.path)) {
    // 免登陆白名单 直接进入
    // console.log('🚀 > file: permission.js  > 免登陆白名单 直接进入');
    next();
  } else {
    // 没有登录 去登录
    // console.log('🚀 > file: permission.js  > 没有登录 去登录');
    next('/login');
  }
});
