/*
 * @LastEditors: liu yang
 * @Description: 用户信息store
 * @Date: 2023-05-16 09:39:46
 * @LastEditTime: 2023-05-16 09:40:25
 * @Author: liu yang
 */

import { defineStore } from 'pinia';
import { clearAllStorage } from '@/utils/storage';
import router from '@/router';
import { getUserInfo } from '@/api/modules/this';
import { handleMenuData } from '@/router/addRouter';
import { getDefaultRouter } from '@/router/defaultRouter.js';

const baseState = {
  userInfo: {},
  menuList: [],
  defaultRouter: '',
  isLogin: false
};

export const useUserStore = defineStore({
  id: 'userStore',
  state: () => ({
    ...baseState
  }),
  getters: {
    getUserInfo: (state) => state.userInfo,
    getMenuList: (state) => state.menuList,
    getDefaultRouter: (state) => state.defaultRouter
  },
  actions: {
    setUserInfo(to) {
      getUserInfo().then(({ data }) => {
        this.isLogin = true;
        this.userInfo = { ...data };
        handleMenuData(to);
      });
    },
    logout() {
      this.$state = { ...baseState };
      clearAllStorage({ exceptLocalArr: ['qishi-components', '_table_'] });
      router.replace('/login');
      window.location.reload();
    },
    setMenuList(routerList) {
      const defaultRouter = getDefaultRouter(routerList);
      this.menuList = [...routerList];
      this.defaultRouter = defaultRouter;
    }
  },
  // 持久化
  persist: {
    enabled: true,
    storage: window.sessionStorage,
    paths: ['userInfo', 'defaultRouter']
  }
});
