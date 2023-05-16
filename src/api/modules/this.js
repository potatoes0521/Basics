/*
 * @Author: liuYang
 * @Description: 请填写描述信息
 * @Path: 引入路径
 * @Date: 2021-03-22 13:30:20
 * @LastEditors: liu yang
 * @LastEditTime: 2022-11-28 12:44:05
 * @MustParam: 必传参数
 * @OptionalParam: 选传参数
 * @EmitFunction: 函数
 * @Slot/Props.children: 提供的插槽或render
 * @Examples: 使用示例
 */
import { request } from '../request';

// 是否为开发模式

/**
 * 获取当前用户菜单列表
 * @return void
 */
export const getThisUserMenuTree = () => {
  return request({
    url: '/this/session/user-menu-tree',
    method: 'get'
  });
};

/**
 * 根据token心跳检测token是否有效
 * @param {Object} data 请求参数
 * @return void
 */
export const heartBeat = (data) => {
  return request({
    url: '/this/session/is-live',
    method: 'get',
    data
  });
};

/**
 * 获取当前用户信息
 * @return void
 */
export const getUserInfo = () => {
  return request({
    url: '/this/session/user-info',
    method: 'get'
  });
};

/**
 * 退出登录
 * @return void
 */
export const loginOut = (data, headers) => {
  return request({
    url: '/logout',
    method: 'get',
    headers: { ...headers }
  });
};

/**
 * 修改密码
 * @param {Object} data 参数描述
 * @return void
 */
export const changePassword = (data) => {
  return request({
    url: '/this/session/change-password',
    method: 'post',
    data
  });
};

export const getPermFuncList = (data) => {
  return request({
    url: '/this/session/user-func-list',
    method: 'get',
    data
  });
};
