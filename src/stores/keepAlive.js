/*
 * @LastEditors: liu yang
 * @Description: keepAlive状态
 * @Date: 2023-05-16 09:39:46
 * @LastEditTime: 2023-05-16 09:42:35
 * @Author: liu yang
 */

import { defineStore } from 'pinia';

export const useKeepAliveStore = defineStore({
  id: 'KeepAliveStore',
  state: () => ({
    keepAliveName: []
  }),
  actions: {
    // addKeepAliveName
    async addKeepAliveName(name) {
      !this.keepAliveName.includes(name) && this.keepAliveName.push(name);
    },
    // removeKeepAliveName
    async removeKeepAliveName(name) {
      this.keepAliveName = this.keepAliveName.filter((item) => item !== name);
    },
    // setKeepAliveName
    async setKeepAliveName(keepAliveName = []) {
      this.keepAliveName = keepAliveName;
    }
  }
});
