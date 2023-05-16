/*
 * @LastEditors: liu yang
 * @Description: ...
 * @Date: 2022-12-01 17:59:10
 * @LastEditTime: 2022-12-02 18:08:34
 * @Author: liu yang
 */
import { request } from '../request';

/**
 * 获取子系统菜单
 * @param {Object} data 参数描述
 * @return void
 */
export const getSubsystemMenuTree = (data) => {
  return request({
    url: '/cas/menu/menu-tree',
    method: 'post',
    data
  });
};

/**
 * 新增菜单
 * @param {Object} data 参数描述
 * @return void
 */
export const addMenu = (data) => {
  return request({
    url: '/cas/menu/add-menu',
    method: 'post',
    data
  });
};

/**
 * 更新菜单
 * @param {Object} data 参数描述
 * @return void
 */
export const updateMenu = (data) => {
  return request({
    url: '/cas/menu/update-menu',
    method: 'post',
    data
  });
};

/**
 * 删除菜单
 * @param {Object} data 参数描述
 * @return void
 */
export const deleteMenu = (data) => {
  return request({
    url: '/cas/menu/delete-menu',
    method: 'post',
    data
  });
};

/**
 * 绑定页面
 * @param {Object} data 参数描述
 * @return void
 */
export const bindingMenu = (data) => {
  return request({
    url: '/cas/menu/binding-page',
    method: 'post',
    data
  });
};
