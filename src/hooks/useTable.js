/*
 * @LastEditors: liu yang
 * @Description: 表格相关hooks
 * @Date: 2022-04-25 16:08:14
 * @LastEditTime: 2022-05-24 10:45:22
 * @Author: liu yang
 */
export default function useTable() {
  /**
   * @Author: liu yang
   * @Date: 2022-03-15 14:28:45
   * @description: 表格头部的label
   * @param {String} value
   * @return {String} label
   */
  function handleGetLabel(value) {
    return value?.split('#')[0] ?? '';
  }

  /**
   * @Author: liu yang
   * @Date: 2022-03-15 14:28:45
   * @description: 表格头部的content
   * @param {String} value
   * @return {String} content
   */
  function handleGetContent(value) {
    return value?.split('#')[1] ?? '';
  }

  return {
    handleGetLabel,
    handleGetContent
  };
}

export function handleLabel(arr) {
  return arr.map((i) => ({
    ...i,
    label: i.content ? `${i.label}#${i.content}` : i.label
  }));
}
