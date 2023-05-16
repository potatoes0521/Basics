/*
 * @LastEditors: liu yang
 * @Description: 纯数组类型数据   线性数据对线性数据的处理  不存在树形结构
 * @Date: 2022-03-10 11:14:23
 * @LastEditTime: 2022-11-29 11:42:10
 * @Author: liu yang
 */
/**
 * @Author: liu yang
 * @Date: 2022-03-10 11:15:12
 * @description: 线性数据换成hashmap结构
 * @param {Array} arrayData 要处理的数组
 * @param {String} [idKey = 'id'] 关键字
 * @return {Object}
 */
import { PermissionRouter } from '@/router/modules/asyncRouter';
import _differenceBy from 'lodash/differenceBy';

export function arrayToMapBy({ arrayData, idKey = 'id' }) {
  const mapData = arrayData.reduce(
    (res, item) => ({
      ...res,
      [item[idKey]]: item
    }),
    {}
  );
  return mapData;
}

export const handleStorageSyncServe = (serveRouter) => {
  // 先找出来所有的子路由
  const childrenRouter = serveRouter.filter((item) => item.menuHref).map((item) => ({ ...item, path: item.menuHref }));

  const urlOpenSystem = serveRouter.filter((item) => item.menuHref && item.menuHref.startsWith('http'));
  // 找到子路由合并本地出来不同路由
  const diffRouter = _differenceBy(childrenRouter, PermissionRouter, 'path');
  const needSaveDiffRouter = _differenceBy(serveRouter, diffRouter, 'menuId');

  // for循环
  return [...needSaveDiffRouter, ...urlOpenSystem];
};
