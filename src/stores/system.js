/*
 * @LastEditors: liu yang
 * @Description: 系统状态
 * @Date: 2023-05-16 09:39:46
 * @LastEditTime: 2023-05-16 09:42:08
 * @Author: liu yang
 */

import { getConfig } from '@/config';

const defaultColor = getConfig('DEFAULT_PRIMARY');

export const useSystemStore = defineStore({
  // id 必填，且需唯一
  id: 'systemStore',
  // 状态
  state: () => {
    return {
      // element组件大小
      assemblySize: 'default',
      themeConfig: {
        // 当前页面是否全屏
        maximize: false,
        // 布局切换 ==>  纵向：vertical | 经典：classic | 横向：transverse | 分栏：columns
        layout: 'vertical',
        primary: defaultColor,
        // 深色模式
        // isDark: false,
        // 跟随系统
        isFollow: false,
        // 灰色模式
        // isGrey: false,
        // // 色弱模式
        // isWeak: false,
        // 折叠菜单
        isCollapse: false,
        // 面包屑导航
        breadcrumb: true,
        // 面包屑导航图标
        breadcrumbIcon: true,
        // 标签页
        tabs: true,
        // 标签页图标
        tabsIcon: true
      }
    };
  },
  // 获取
  getters: {
    getTheme: (state) => {
      return state.themeConfig.primary;
    }
  },
  // 修改
  actions: {
    setAssemblySizeSize(assemblySize) {
      this.assemblySize = assemblySize;
    },
    setThemeConfig(themeConfig) {
      this.themeConfig = themeConfig;
    }
  },
  // 持久化
  persist: {
    enabled: false,
    storage: window.localStorage,
    paths: ['assemblySize', 'themeConfig']
  }
});
