/*
 * @LastEditors: liu yang
 * @Description: ...
 * @Date: 2022-12-01 17:59:10
 * @LastEditTime: 2022-12-04 15:33:40
 * @Author: liu yang
 */
import { request } from '../request';

/**
 * 添加角色
 * @param {Object} data 参数描述
 * @return void
 */
export const addRole = (data) => {
  return request({
    url: '/cas/role/set-role',
    method: 'post',
    data
  });
};

/**
 * 按照条件检索角色
 * @param {Object} data 参数描述
 * @return void
 */
export const getRoleList = (data) => {
  return request({
    url: '/cas/role/condition-search-role',
    method: 'post',
    data
  });
};

/**
 * 获取角色详情
 * @param {Object} data 参数描述
 * @return void
 */
export const getRoleDetails = (data) => {
  return request({
    url: '/cas/role/role-detail',
    method: 'post',
    data
  });
};

/**
 * 删除角色
 * @param {Object} data 参数描述
 * @return void
 */
export const deleteRole = (data) => {
  return request({
    url: '/cas/role/delete-role',
    method: 'post',
    data
  });
};
