/*
 * @LastEditors: liu yang
 * @Description: ...
 * @Date: 2022-03-10 14:18:08
 * @LastEditTime: 2023-05-16 09:48:34
 * @Author: liu yang
 */
import Cookies from 'js-cookie';
import { isOtherSystemIframeOpen } from '@/utils/cas';
import { aesDecrypt, aesEncrypt } from './encryption';
import { isNullOrUnDef } from './typeOf';

import { getConfig } from '@/config';

const projectCode = `${getConfig('storagePrefix')}_`;
//  ----------------------------------------------- cookie start --------------------------------------------------

/**
 * @Author: liu yang
 * @Date: 2022-03-10 14:34:42
 * @description: 设置一个cookie
 * @param {String} name cookie名字
 * @param {String || Object} value 值
 * @param {Number} time 存储时长
 * @param {String} aes 加密解密的标识 不传就不加密
 * @return {void}
 */
export function setCookie({ name, value, time, aes = false }) {
  if (isNullOrUnDef(value)) return;
  value = JSON.stringify(value);
  aes && (value = aesEncrypt(value));
  Cookies.set(projectCode + name, value, {
    expires: time ?? 1,
    sameSite: isOtherSystemIframeOpen() ? 'None' : 'Lax',
    secure: !!isOtherSystemIframeOpen()
  });
}

/**
 * @Author: liu yang
 * @Date: 2022-03-10 14:31:20
 * @description: 获取一个cookie
 * @param {String} name cookie名字
 * @param {String} aes 加密解密的标识 不传就不解密
 * @return {Object} 获取到的cookie
 */
export function getCookie(name, aes = false) {
  const data = Cookies.get(projectCode + name) || false;
  if (isNullOrUnDef(data)) {
    return false;
  }
  try {
    return JSON.parse(aes ? aesDecrypt(data) : data);
  } catch (error) {
    return aes ? aesDecrypt(data) : data;
  }
}

/**
 * @Author: liu yang
 * @Date: 2022-03-10 14:52:44
 * @description: 移除一个cookie
 * @param {*} name
 * @return {*}
 */
export function removeCookie(name) {
  Cookies.remove(projectCode + name);
}

/**
 * @Author: liu yang
 * @Date: 2022-07-22 11:02:26
 * @description: 获取一个全名的cookie
 * @param {String} name
 * @param {Boolean} aes
 * @return {String} 获取到的cookie
 */
export function getAllNameCookie(name, aes = false) {
  const data = Cookies.get(name) || false;
  if (isNullOrUnDef(data)) {
    return false;
  }
  try {
    return JSON.parse(aes ? aesDecrypt(data) : data);
  } catch (err) {
    return aes ? aesDecrypt(data) : data;
  }
}

//  ----------------------------------------------- cookie end --------------------------------------------------

//  ----------------------------------------------- sessionStorage start --------------------------------------------------

/**
 * @Author: liu yang
 * @Date: 2022-03-10 14:40:57
 * @description: 设置sessionStorage
 * @param {String} name sessionStorage名字
 * @param {String || Object} value 值
 * @param {String} aes 加密解密的标识 不传就不加密
 * @return {void}
 */
export function setSession(name, value, aes = false) {
  if (isNullOrUnDef(value)) return;
  value = JSON.stringify(value);
  aes && (value = aesEncrypt(value));
  window.sessionStorage.setItem(projectCode + name, value);
}

/**
 * @Author: liu yang
 * @Date: 2022-03-10 14:41:00
 * @description: 获取sessionStorage
 * @param {String} name sessionStorage名字
 * @param {String} aes 加密解密的标识 不传就不解密
 * @return {Object} 获取到的sessionStorage
 */
export function getSession(name, aes = false) {
  const data = window.sessionStorage.getItem(projectCode + name) || false;
  if (isNullOrUnDef(data)) {
    return false;
  }
  try {
    return JSON.parse(aes ? aesDecrypt(data) : data);
  } catch (err) {
    return aes ? aesDecrypt(data) : data;
  }
}

/**
 * @Author: liu yang
 * @Date: 2022-03-10 14:53:23
 * @description: 移除指定的sessionStorage
 * @param {String} name sessionStorage名字
 * @return {void}
 */
export function removeSession(name) {
  window.sessionStorage.removeItem(projectCode + name);
}

/**
 * @Author: liu yang
 * @Date: 2022-03-10 14:55:10
 * @description: 检查sessionStorage是否存在
 * @param {String} name sessionStorage名字
 * @return {Boolean} 存在返回true 不存在返回false
 */
export function checkSession(name) {
  const val = window.sessionStorage.getItem(projectCode + name);
  if (val && val !== JSON.stringify({})) {
    return true;
  }
  return false;
}

//  ----------------------------------------------- sessionStorage end --------------------------------------------------

//  ----------------------------------------------- localStorage start --------------------------------------------------

/**
 * @Author: liu yang
 * @Date: 2022-03-10 14:59:00
 * @description: 设置指定的localStorage
 * @param {String} name localStorage名字
 * @param {String || Object} value 值
 * @param {String} aes 加密解密的标识 不传就不加密
 * @return {void}
 */
export function setLocal(name, value, aes = false) {
  if (isNullOrUnDef(value)) return;
  value = JSON.stringify(value);
  aes && (value = aesEncrypt(value));
  window.localStorage.setItem(projectCode + name, value);
}

/**
 * @Author: liu yang
 * @Date: 2022-03-10 15:00:54
 * @description: 获取指定的localStorage
 * @param {String} name localStorage名字
 * @param {String} aes 加密解密的标识 不传就不加密
 * @return {Object} 获取到的localStorage
 */
export function getLocal(name, aes = false) {
  const data = window.localStorage.getItem(projectCode + name) || false;
  if (isNullOrUnDef(data)) {
    return false;
  }
  try {
    return JSON.parse(aes ? aesDecrypt(data) : data);
  } catch (err) {
    return aes ? aesDecrypt(data) : data;
  }
}

/**
 * @Author: liu yang
 * @Date: 2022-03-10 15:08:08
 * @description: 移除指定的localStorage
 * @param {String} name localStorage名字
 * @return {void}
 */
export function removeLocal(name) {
  window.localStorage.removeItem(projectCode + name);
}

/**
 * @Author: liu yang
 * @Date: 2022-03-10 15:09:49
 * @description: 检查指定的localStorage
 * @param {*} name localStorage名字
 * @return {*}
 */
export function checkLocal(name) {
  const val = window.localStorage.getItem(projectCode + name);
  if (val && val !== JSON.stringify({})) {
    return true;
  }
  return false;
}

//  ----------------------------------------------- localStorage end --------------------------------------------------

/**
 * 清除全部cookie sessionStorage localStorage
 * @param {Array} exceptCookieArr 除了key为XXX的Cookie全部删除
 * @param {Array} exceptSessionArr 除了key为XXX的全部删除
 * @param {Array} exceptLocalArr 除了key为XXX的全部删除
 * @return void
 */
export function clearAllStorage({ exceptCookieArr = [], exceptSessionArr = [], exceptLocalArr = [] }) {
  exceptCookieArr = exceptCookieArr.map((item) => item);

  const keys = document.cookie.match(/[^ =;]+(?==)/g);
  if (keys) {
    keys.forEach((item) => {
      if (!exceptCookieArr.includes(item)) {
        Cookies.remove(item);
        Cookies.remove(item, {
          path: ''
        });
      }
    });
  }

  exceptSessionArr = exceptSessionArr.map((item) => item);
  if (exceptSessionArr.length) {
    Object.keys(sessionStorage).forEach((item) => {
      const has = exceptSessionArr.some((i) => item === i || item.indexOf(i) !== -1);
      if (!has) {
        sessionStorage.removeItem(item);
      }
    });
  } else {
    sessionStorage.clear();
  }

  exceptLocalArr = exceptLocalArr.map((item) => item);
  if (exceptLocalArr.length) {
    Object.keys(localStorage).forEach((item) => {
      const has = exceptLocalArr.some((i) => item === i || item.indexOf(i) !== -1);
      if (!has) {
        localStorage.removeItem(item);
      }
    });
  } else {
    localStorage.clear();
  }
  // console.log('🚀 > file: storage.js > line 244 > clearAllStorage');
}

export default {
  setCookie,
  getCookie,
  removeCookie,
  setSession,
  getSession,
  removeSession,
  checkSession,
  setLocal,
  getLocal,
  removeLocal,
  checkLocal,
  clearAllStorage
};
