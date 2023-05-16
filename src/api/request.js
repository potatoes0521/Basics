/*
 * @LastEditors: isboyjc
 * @Description: 请求实例方法
 * @Date: 2022-03-14 17:17:56
 * @LastEditTime: 2022-04-15 11:43:49
 * @Author: isboyjc
 */
import Http from '../utils/http';
import { getConfig } from '@/config';

export const request = Http(
  {
    baseURL: getConfig('baseUrl')
  },
  {
    cancelRepeatRequest: false, // 是否开启取消重复请求, 默认为 false
    reductDataformat: true, // 是否开启简洁的数据结构响应, 默认为true
    showErrorMessage: true, // 是否开启接口错误信息展示,默认为true
    showCodeMessage: true, // 是否开启自定义code模式信息提示, 默认为true
    requestRetryCount: 0 // 请求重试次数, 默认为0
  }
);

export const mockRequest = Http(
  {
    baseURL: getConfig('mockBaseUrl')
  },
  {
    cancelRepeatRequest: true, // 是否开启取消重复请求, 默认为 false
    reductDataformat: true, // 是否开启简洁的数据结构响应, 默认为true
    showErrorMessage: true, // 是否开启接口错误信息展示,默认为true
    showCodeMessage: true, // 是否开启自定义code模式信息提示, 默认为true
    requestRetryCount: 0 // 请求重试次数, 默认为0
  }
);

// 使用
// requset({
//   url: '/api/user/login',
//   method: 'post',
//   data: {},
//   params: {},
//   headers: {},
//   cancelRepeatRequest: true,
//   reductDataformat: true,
//   showErrorMessage: true,
//   showCodeMessage: true,
//   requestRetryCount: 0
//   ...
// })
