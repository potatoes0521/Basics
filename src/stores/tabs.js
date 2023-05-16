/*
 * @LastEditors: liu yang
 * @Description: 多页签store
 * @Date: 2023-05-16 09:39:46
 * @LastEditTime: 2023-05-16 09:40:54
 * @Author: liu yang
 */
import { defineStore } from 'pinia';
import router from '@/router/index';

export const TabsStore = defineStore({
  id: 'TabsState',
  state: () => ({
    tabsMenuList: []
  }),
  actions: {
    // Add Tabs
    async addTabs(tabItem) {
      const index = this.tabsMenuList.findIndex((item) => item.path === tabItem.path);
      if (index === -1) {
        // 添加tabsMenuList
        this.tabsMenuList.push(tabItem);
      } else if (index > -1) {
        // 更新tabsMenuList
        this.tabsMenuList[index] = tabItem;
      }
    },
    // Remove Tabs
    async removeTabs(tabPath, isCurrent = true) {
      const { tabsMenuList } = this;
      if (isCurrent) {
        tabsMenuList.forEach((item, index) => {
          if (item.path !== tabPath) return;
          const nextTab = tabsMenuList[index + 1] || tabsMenuList[index - 1];
          if (!nextTab) return;
          router.push(nextTab.path);
        });
      }
      this.tabsMenuList = tabsMenuList.filter((item) => item.path !== tabPath);
    },
    // Close MultipleTab
    async closeMultipleTab(tabsMenuValue) {
      this.tabsMenuList = this.tabsMenuList.filter((item) => {
        return item.path === tabsMenuValue || !item.close;
      });
    },
    // Set Tabs
    async setTabs(tabsMenuList) {
      this.tabsMenuList = tabsMenuList;
    },
    // Set Tabs Title
    async setTabsTitle(title) {
      // eslint-disable-next-line no-restricted-globals
      const nowFullPath = location.hash.substring(1);
      this.tabsMenuList.forEach((item) => {
        if (item.path === nowFullPath) item.title = title;
      });
    }
  },
  persist: {
    enabled: true,
    storage: window.localStorage,
    paths: ['tabsMenuList']
  }
});
