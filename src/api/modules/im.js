/*
 * @LastEditTime: 2023-01-05 17:38:42
 * @Description: ...
 * @Date: 2023-01-05 17:38:05
 * @Author: isboyjc
 * @LastEditors: isboyjc
 */
import { request } from '../request';

/**
 * 06获取聊天记录(授权)
 * @param {Object} data 参数描述
 * @return void
 */
export const getmsgs = (data) => {
  return request({
    url: '/ws/im/getmsgs',
    method: 'post',
    data
  });
};
