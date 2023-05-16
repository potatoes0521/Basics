/*
 * @LastEditors: liu yang
 * @Description: ...
 * @Date: 2022-03-18 11:12:12
 * @LastEditTime: 2023-05-16 10:12:16
 * @Author: liu yang
 */
// import router from '@/router';
import { clearAllStorage, getCookie } from './storage';
import { createUniqueCode } from './uniqueCode';
import { heartBeat } from '@/api/modules/this';

/**
 * CAS心跳检测
 *  成功 => 继续业务
 *  失败 => 去登录
 * 通常两种触发
 *  1.正常登陆C系统
 *  2.url有ticket
 * @param {String} token CAS的assessToken
 * @return {Boolean}
 * 心跳token有效返回  true 无效返回 false
 */
export function checkHeartBeat() {
  const cookieToken = getCookie('acToken', true);
  if (!cookieToken) {
    clearAllStorage({ exceptLocalArr: ['qishi-components', '_table_'] });
    return Promise.resolve(false);
  }
  const fp = createUniqueCode();
  return heartBeat({
    accessToken: cookieToken,
    fp
  })
    .then(async () => {
      return Promise.resolve(true);
    })
    .catch(() => {
      // CAS Token过期 去登录
      return Promise.resolve(false);
    });
}

/**
 * 判断是否是其他系统打开iframe
 * @return {Boolean} 是否是其他系统打开
 */
export function isOtherSystemIframeOpen() {
  // eslint-disable-next-line no-restricted-globals
  if (self.frameElement && self.frameElement.tagName === 'IFRAME') {
    return true;
  }
  // eslint-disable-next-line no-restricted-globals
  if (window.frames.length !== parent.frames.length) {
    return true;
  }
  // eslint-disable-next-line no-restricted-globals
  if (self !== top) {
    return true;
  }
  return false;
}
