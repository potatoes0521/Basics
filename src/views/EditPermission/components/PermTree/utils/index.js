/*
 * @LastEditors: liu yang
 * @Description: ...
 * @Date: 2022-07-28 18:33:25
 * @LastEditTime: 2022-07-29 16:56:52
 * @Author: liu yang
 */
/**
 * @Author: liu yang
 * @Date: 2022-07-28 18:33:57
 * @description: 查找两个纯数字数组之间的不同值
 * @param {*} arr1
 * @param {*} arr2
 * @return {*}
 */
export const difference = (arr1, arr2) => {
  const arr = [...new Set([...arr1, ...arr2])];
  const newArr = arr.filter((item) => {
    return !(arr1.includes(item) && arr2.includes(item));
  });
  return newArr;
};
