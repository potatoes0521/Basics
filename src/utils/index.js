/*
 * @LastEditors: liu yang
 * @Description: 公共方法
 * @Date: 2022-02-22 13:49:43
 * @LastEditTime: 2023-05-16 10:12:28
 * @Author: liu yang
 */

import { isNullOrUnDef } from './typeOf';

export const isServer = typeof window === 'undefined';

export const isClient = !isServer;

// 获取元素是否在可视区域
export const isElementInViewport = (el, parentEl = document.documentElement) => {
  const rect = el.getBoundingClientRect();
  const parentRect = parentEl.getBoundingClientRect();
  return rect.top >= parentRect.top && rect.left >= parentRect.left && rect.bottom <= parentRect.bottom && rect.right <= parentRect.right;
};

/**
 * 给列表添加一个编号
 * @param {Object} arr 要处理的数据
 * @param {Object} pageNum 页数
 * @return void
 */
export const addNumCode = (arr, pageNum = 0, pageSize = 10) => {
  if (!Array.isArray(arr) || !arr.length) return;
  if (isNullOrUnDef(pageNum) === 'undefined') {
    console.error('pageNum is undefined in @utils/index => addNumCode');
    return;
  }
  return arr.map((item, index) => ({
    ...item,
    numId: index + (pageNum - 1) * pageSize + 1
  }));
};

/**
 * @Author: liu yang
 * @Date: 2021-10-26 14:32:12
 * @description: 从url获取文件名
 * @param {String} url 文件路径/带有后缀的文件
 * @return {String} 文件名
 */
export const getFilenameFromUrl = (url) => {
  const pathname = url.replace(/(.*\/)*([^.]+)/i, '$2');
  return pathname;
};

/**
 * @Author: liu yang
 * @Date: 2021-10-26 14:32:53
 * @description: 下载文件
 * @param {String} url 要下载的文件
 * @return {*}
 */

export const downloadFile = (url) => {
  console.log('🚀 > file: index.js > line 29 > downloadFile > url', url);
  const elt = document.createElement('a');
  elt.setAttribute('href', url);
  const fileName = getFilenameFromUrl(url);
  elt.setAttribute('download', fileName);
  elt.setAttribute('target', '_blank');
  elt.style.display = 'none';
  document.body.appendChild(elt);
  elt.click();
  document.body.removeChild(elt);
};

// 复制到剪切板
export const copyTextToClipboard = (text) => {
  const textArea = document.createElement('textarea');
  textArea.value = text;
  textArea.style.position = 'fixed';
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  let successfulType = false;
  try {
    const successful = document.execCommand('copy');
    const msg = successful ? 'successful' : 'unsuccessful';
    console.log(`Copying text command was ${msg}`);
    successfulType = msg;
  } catch (err) {
    console.error('Oops, unable to copy');
  }
  document.body.removeChild(textArea);
  return successfulType;
};

/**
 * @description 获取浏览器默认语言
 * @return string
 */
export function getBrowserLang() {
  let browserLang = navigator.language ? navigator.language : navigator.browserLanguage;
  let defaultBrowserLang = '';
  if (browserLang.toLowerCase() === 'cn' || browserLang.toLowerCase() === 'zh' || browserLang.toLowerCase() === 'zh-cn') {
    defaultBrowserLang = 'zh';
  } else {
    defaultBrowserLang = 'en';
  }
  return defaultBrowserLang;
}
