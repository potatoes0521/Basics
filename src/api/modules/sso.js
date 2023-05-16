/*
 * @Author: liuYang
 * @description: 单点登陆相关接口
 * 接口文档地址 http: //192.168.200.212:8080/doc.html#/qishi/01%E7%BB%9F%E4%B8%80%E8%AE%A4%E8%AF%81%E6%9C%8D%E5%8A%A1.09%E5%8D%95%E7%82%B9%E7%99%BB%E5%BD%95./loginUsingPOST
 * @Path:  引入路径
 * @Date: 2021-03-10 14:33:51
 * @LastEditors: liu yang
 * @LastEditTime: 2022-03-19 10:26:42
 * @MustParam:  必传参数
 * @OptionalParam:  选传参数
 * @EmitFunction:  函数
 */

import { request } from '../request';

/**
 * 根据账号密码登录
 * @param {Object} data 参数描述
 * @return void
 */
export const login = (data) => {
  return request({
    url: '/sso/login',
    method: 'post',
    data
  });
};

/**
 * 用ticket登录
 * @param {Object} data ticket
 *  ticket 登录票据
 *  fp   浏览器唯一标识
 * @return void
 */
export const ticketLogin = (data) => {
  return request({
    url: `/login?ticket=${data.ticket}&fp=${data.fp}`,
    method: 'post',
    data
  });
};

/**
 * 获取图形验证码
 * @param {Object} data ticket
 * @return void
 */
export const getCaptcha = (data) => {
  return request({
    url: '/sso/get-captcha',
    method: 'post',
    data
  });
};
