/*
 * @LastEditors: liu yang
 * @Description: ...
 * @Date: 2022-12-01 17:59:10
 * @LastEditTime: 2022-12-08 14:29:15
 * @Author: liu yang
 */
import { request } from '../request';

/**
 * 获取子系统列表
 * @param {Object} data 参数描述
 * @return void
 */
export const subsystemList = (data) => {
  return request({
    url: '/cas/select/subsystem-list',
    method: 'get',
    data
  });
};

/**
 * 获取角色列表
 * @param {Object} data 参数描述
 * @return void
 */
export const roleSelectList = (data) => {
  return request({
    url: '/cas/select/role-list',
    method: 'get',
    data
  });
};

/**
 * 获取用户等级
 * @param {Object} data 参数描述
 * @return void
 */
export const userLevelList = (data) => {
  return request({
    url: '/cas/select/user-level-list',
    method: 'get',
    data
  });
};

export const subsystemPermList = (data) => {
  return request({
    url: '/cas/select/subsystem-perm-list',
    method: 'post',
    data
  });
};

export const subsystemPageList = (data) => {
  return request({
    url: '/cas/select/subsystem-page-list',
    method: 'post',
    data
  });
};

export const structGradeList = (data) => {
  return request({
    url: '/cas/select/struct-grade-list',
    method: 'post',
    data
  });
};
