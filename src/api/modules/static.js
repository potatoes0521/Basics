/*
 * @LastEditors: liu yang
 * @Description: ...
 * @Date: 2022-04-11 13:57:49
 * @LastEditTime: 2022-04-11 14:41:26
 * @Author: liu yang
 */
import { request } from '../request';

/**
 * 获取公钥
 * @param {Object} data 参数对象
 * @return {Object} list
 */
export const getRsaPub = (data) => {
  return request({
    url: '/static/get-rsa-pub',
    method: 'get',
    data
  });
};
