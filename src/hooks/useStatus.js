/*
 * @LastEditors: liu yang
 * @Description: 项目内的公共状态
 * @Date: 2022-12-06 13:52:45
 * @LastEditTime: 2023-05-16 09:56:12
 * @Author: liu yang
 */

export const scopeList = [
  {
    label: '浏览器',
    value: 1
  },
  {
    label: 'H5',
    value: 2
  }
  // {
  //   label: "小程序",
  //   value: 3,
  // },
  // {
  //   label: "APP",
  //   value: 4,
  // },
];

/**
 * @Author: liu yang
 * @Date: 2022-06-16 15:23:18
 * @description: 适用终端转换
 * @param {*} value
 * @return {*}
 */
export const transScope = (value) => {
  return scopeList.find((item) => item.value === +value)?.label || '未知';
};

/**
 * @Author: liu yang
 * @Date: 2022-12-06 13:56:00
 * @description: 组件类型
 * @return {*}
 */
export const compTypeList = [
  {
    label: '预置组件',
    value: 1
  },
  {
    label: '自定义组件',
    value: 2
  },
  {
    label: '基础组件',
    value: 3
  }
];

/**
 * @Author: liu yang
 * @Date: 2022-12-06 13:56:09
 * @description: 转换组件类型
 * @param {*} value
 * @return {*}
 */
export const transCompType = (value) => {
  return compTypeList.find((item) => item.value === +value)?.label || '-';
};

export const isUsedList = [
  { label: '未使用', value: 0 },
  { label: '使用中', value: 1 }
];

export const transIsUsed = (value) => {
  return isUsedList.find((item) => item.value === value)?.label || '-';
};

export const sceneList = [
  { label: '元素模板', value: 1 },
  { label: '上报模板', value: 2 }
];

export const transScene = (value) => {
  return sceneList.find((item) => item.value === value)?.label || '-';
};
