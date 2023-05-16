/*
 * @LastEditors: liu yang
 * @Description: ...
 * @Date: 2022-03-22 10:55:02
 * @LastEditTime: 2022-03-22 10:55:03
 * @Author: liu yang
 */

import { request } from '../request';

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
