/*
 * @LastEditors: liu yang
 * @Description: 点击或者tabs事件相关处理
 * @Date: 2022-07-28 18:59:03
 * @LastEditTime: 2023-05-16 10:17:42
 * @Author: liu yang
 */
import { nextTick } from 'vue';

export default function useTabs({ halfCheckedList, treeRefList, checkedList, tabsActiveName, eventBus, systemList }) {
  /**
   * @Author: liu yang
   * @Date: 2022-07-13 18:38:00
   * @description: 获取当前系统半选的权限
   * @param {*} systemId
   * @return {*}
   */
  function getHalfCheckedList() {
    // eslint-disable-next-line no-restricted-syntax
    for (let key of systemList.value) {
      const node = treeRefList.value[key.id];
      if (!node) {
        // eslint-disable-next-line no-continue
        continue;
      }
      halfCheckedList.value[key.id] =
        node?.getHalfCheckedNodes().map((i) => {
          const v = { ...i };
          delete v.children;
          return { ...v };
        }) || [];
    }
  }

  /**
   * @Author: liu yang
   * @Date: 2022-07-13 18:37:48
   * @description: 获取当前页选中的权限
   * @param {*} systemId
   * @return {*}
   */
  function getCheckedList() {
    // eslint-disable-next-line no-restricted-syntax
    for (let key of systemList.value) {
      const node = treeRefList.value[key.id];
      if (!node) {
        // eslint-disable-next-line no-continue
        continue;
      }
      checkedList.value[key.id] =
        node?.getCheckedNodes().map((i) => {
          const v = { ...i };
          delete v.children;
          return { ...v };
        }) || [];
    }
  }

  /**
   * @Author: liu yang
   * @Date: 2022-07-14 17:59:22
   * @description: 处理tab栏切换
   * @return {*}
   */
  function tabClick() {
    nextTick(() => {
      getCheckedList(tabsActiveName.value);
      getHalfCheckedList(tabsActiveName.value);
    });
  }

  /**
   * @Author: liu yang
   * @Date: 2022-07-14 18:00:08
   * @description: 处理已选择权限里tab切换
   * @return {*}
   */
  eventBus.on('tabsClick', () => {
    tabClick();
  });

  return {
    tabClick,
    getCheckedList,
    getHalfCheckedList
  };
}
