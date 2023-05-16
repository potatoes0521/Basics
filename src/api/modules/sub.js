/*
 * @LastEditors: liu yang
 * @Description: ...
 * @Date: 2022-11-30 19:00:03
 * @LastEditTime: 2022-12-01 18:46:33
 * @Author: liu yang
 */

import { request } from '../request';

/**
 * 修改密码
 * @param {Object} data 参数描述
 * @return void
 */
export const getSubsystemList = (data) => {
  return request({
    url: '/cas/sub/condition-search-subsystem',
    method: 'post',
    data
  });
};

/**
 * 获取子系统页面  这个接口不对客户暴露  如果业务中使用了就是写错了
 * 前端页面注册到后端   以便于后端可以生成菜单
 * @param {Object} data 参数描述
 * @return void
 */
export const getSubsystemPageListFe = (data) => {
  return request({
    url: '/cas/sub/condition-search-subsystem-page',
    method: 'post',
    data
  });
};

export const getSubsystemPageDetailsFe = (data) => {
  return request({
    url: '/cas/sub/subsystem-page-detail',
    method: 'post',
    data
  });
};

export const registerSubsystemPageFe = (data) => {
  return request({
    url: '/cas/sub/register-subsystem-page',
    method: 'post',
    data
  });
};

export const updateSubsystemPageFe = (data) => {
  return request({
    url: '/cas/sub/update-subsystem-page-info',
    method: 'post',
    data
  });
};

export const deleteSubsystemPageFe = (data) => {
  return request({
    url: '/cas/sub/delete-subsystem-page',
    method: 'post',
    data
  });
};

export const getSubsystemPageList = (data) => {
  return request({
    url: '/cas/sub/condition-search-subsystem-page',
    method: 'post',
    data
  });
};
