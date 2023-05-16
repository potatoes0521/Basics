/*
 * @Author: liuYang
 * @description: 用户接口
 * http://192.168.200.212:10001/doc.html#/qishi/01%E7%BB%9F%E4%B8%80%E8%AE%A4%E8%AF%81%E6%9C%8D%E5%8A%A1.07%E7%94%A8%E6%88%B7./conditionSearchUserUsingPOST
 * @Path: import {xx} from '@/api/modules/users'
 * @Date: 2021-03-11 15:59:14
 * @LastEditors: NiuNiu
 * @LastEditTime: 2022-12-13 11:15:05
 * @MustParam:  必传参数
 * @OptionalParam:  选传参数
 * @EmitFunction:  函数
 */
import { request } from '../request';

// 接口  --------------------------------------------------------------------------

/**
 * 搜索人员
 * @param {Object} data 参数描述
 * @return void
 */
export const searchUser = (data) => {
  // return axios.post(userPermList.searchUser, data);
  return request({
    url: '/cas/user/condition-search-user',
    method: 'post',
    data
  });
};

/**
 * 注册人员
 * @param {Object} data 参数描述
 * @return void
 */
export const addUser = (data) => {
  // return axios.post(userPermList.addUser, data);
  return request({
    url: '/cas/user/register-user',
    method: 'post',
    data
  });
};

/**
 * 编辑人员
 * @param {Object} data 参数描述
 * @return void
 */
export const editUser = (data) => {
  // return axios.post(userPermList.editUser, data);
  return request({
    url: '/cas/user/update-user-base-info',
    method: 'post',
    data
  });
};

/**
 * 获取人员详情
 * @param {Object} data 参数描述
 * @return void
 */
export const userDetail = (data) => {
  // return axios.post(userPermList.userDetail, data);
  return request({
    url: '/cas/user/user-detail',
    method: 'post',
    data
  });
};

/**
 * 获取人员详情
 * @param {Object} data 参数描述
 * @return void
 */
export const changeUserStatus = (data) => {
  // return axios.post(userPermList.changeUserStatus, data);
  return request({
    url: '/cas/user/set-user-status',
    method: 'post',
    data
  });
};

/**
 * 分配角色
 * @param {Object} data 参数描述
 * @return void
 */
export const allotRole = (data) => {
  // return axios.post(userPermList.allotRole, data);
  return request({
    url: '/cas/user/set-role-for-user',
    method: 'post',
    data
  });
};

/**
 * 分配技能
 * @param {Object} data 参数描述
 * @return void
 */
export const allotPermGroup = (data) => {
  // return axios.post(userPermList.allotPermGroup, data);
  return request({
    url: '/cas/user/set-pg-for-user',
    method: 'post',
    data
  });
};

/**
 * 分配权限组
 * @param {Object} data 参数描述
 * @return void
 */
export const allotPermG = (data) => {
  // return axios.post(userPermList.allotPermG, data);
  return request({
    url: '/cas/user/set-permg-for-user',
    method: 'post',
    data
  });
};

/**
 * 分配权限
 * @param {Object} data 参数描述
 * @return void
 */
export const allotPerm = (data) => {
  // return axios.post(userPermList.allotPerm, data);
  return request({
    url: '/cas/user/set-perm-for-user',
    method: 'post',
    data
  });
};

/**
 * 获取用户的权限
 * @param {Object} data 参数描述
 * @return void
 */
export const getUserSettingPerm = (data) => {
  // return axios.post(userPermList.getUserSettingPerm, data);
  return request({
    url: '/cas/user/user-setted',
    method: 'post',
    data
  });
};

/**
 * 软电话班长模式修改
 * @param {Object} userId 参数描述
 * @return void
 */
export const upSoftphoneMonitor = ({ userId, range, bindDepts, unbindDepts }) => {
  // return axios.post('/cas/user/monitor-range', { userId, range, bindDepts, unbindDepts });
  return request({
    url: '/cas/user/monitor-range',
    method: 'post',
    data: {
      userId,
      range,
      bindDepts,
      unbindDepts
    }
  });
};

// 解锁
export const unlockLoginTry = ({ userId }) => {
  // return axios.post('/cas/user/unlock-login-try', {
  //   userId
  // });
  return request({
    url: '/cas/user/unlock-login-try',
    method: 'post',
    data: {
      userId
    }
  });
};
// 11 账户登录失败记录(授权)
export const loginTryList = ({ userId }) => {
  // return axios.post('/cas/user/login-try-list', {
  //   userId
  // });
  return request({
    url: '/cas/user/login-try-list',
    method: 'post',
    data: {
      userId
    }
  });
};

// 01启禁在线客服(授权)
export const ableserv = ({ userId, optType }) => {
  // return axios.post('/online/leader/ableserv', {
  //   userId,
  //   optType
  // });
  return request({
    url: '/online/leader/ableserv',
    method: 'post',
    data: {
      userId,
      optType
    }
  });
};
