/*
 * @Author: liuYang
 * @Description: 权限模块
 * http: //192.168.200.212:10001/doc.html#/qishi/01%E7%BB%9F%E4%B8%80%E8%AE%A4%E8%AF%81%E6%9C%8D%E5%8A%A1.03%E6%9D%83%E9%99%90./conditionSearchPermUsingPOST
 * @Path: 引入路径
 * @Date: 2021-03-23 14:50:13
 * @LastEditors: liu yang
 * @LastEditTime: 2022-12-04 16:48:22
 * @MustParam: 必传参数
 * @OptionalParam: 选传参数
 * @EmitFunction: 函数
 * @Slot/Props.children: 提供的插槽或render
 * @Examples: 使用示例
 */

import { request } from '../request';

/**
 * 按条件检索系统权限
 * @param {Object} data 参数描述
 * @return void
 */
export const searchPerm = (data) => {
  return request({
    url: '/cas/perm/condition-search-perm',
    method: 'post',
    data
  });
};

/**
 * 菜单视角权限树
 * @param {Object} data 参数描述
 * @return void
 */
export const getPermWithMenu = () => {
  return request({
    url: '/cas/perm/perm-tree-with-menu-mode',
    method: 'get'
  });
};

/**
 * 模块视角权限树
 * @param {Object} data 参数描述
 * @return void
 */
export const getPermWithModule = (data) => {
  return request({
    url: '/cas/perm/perm-tree-with-module-mode',
    method: 'get',
    data
  });
};

/**
 * 权限详情
 * @param {Object} data 参数描述
 * @return void
 */
export const getPermDetails = (data) => {
  return request({
    url: '/cas/perm/perm-detail',
    method: 'post',
    data
  });
};

/**
 * 按条件检索权限组
 * @param {Object} data 参数描述
 * @return void
 */
export const searchPremGroup = (data) => {
  return request({
    url: '/cas/perm-group/search-perm-group',
    method: 'post',
    data
  });
};

/**
 * 配置权限组
 * @param {Object} data 参数描述
 * @return void
 */
export const addPermGroup = (data) => {
  return request({
    url: '/cas/perm-group/put-perm-group',
    method: 'post',
    data
  });
};

/**
 * 权限组详情
 * @param {Object} data 参数描述
 * @return void
 */
export const getPermGroupDetails = (data) => {
  return request({
    url: '/cas/perm-group/perm-group-info',
    method: 'post',
    data
  });
};

/**
 * 删除权限组
 * @param {Object} data 参数描述
 * @return void
 */
export const deletePermGroup = (data) => {
  return request({
    url: '/cas/perm-group/del-perm-group',
    method: 'post',
    data
  });
};

/**
 * 获取功能单元权限列表
 * @param {Object} data 参数描述
 * @return void
 */
export const getPermFuncList = () => {
  return request({
    url: '/this/session/user-func-list',
    method: 'get'
  });
};
