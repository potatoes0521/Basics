/*
 * @LastEditors: liu yang
 * @Description: AES加密解密
 * @Date: 2022-03-10 14:23:13
 * @LastEditTime: 2022-12-04 17:04:55
 * @Author: liu yang
 */

import { getConfig } from '@/config';
import CryptoJS from 'crypto-js';

import { isString } from './typeOf';

const projectCode = getConfig('storagePrefix');

// 设置数据块长度
const keySize = 128;

/**
 * 加密
 * @param {String} plaintText 要处理的数据
 * @return {void}
 */
export const aesEncrypt = (plaintText, cryptoKey = projectCode) => {
  if (!isString(plaintText)) {
    return false;
  }
  // console.log(fillKey(cryptoKey));
  const encrypted = CryptoJS.AES.encrypt(plaintText, fillKey(cryptoKey), {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7
  });
  const base64Cipher = encrypted.ciphertext.toString(CryptoJS.enc.Base64);
  // 处理 Android 某些低版的BUG
  const resultCipher = base64Cipher.replace(/\+/g, '-').replace(/\//g, '_');
  return resultCipher.toString();
};

/**
 * 解密
 * @param {String} encryptedStr 要处理的数据
 * @return {void}
 */
export const aesDecrypt = (encryptedStr, cryptoKey = projectCode) => {
  if (!isString(encryptedStr)) {
    return encryptedStr;
  }
  const restoreBase64 = encryptedStr.replace(/-/g, '+').replace(/_/g, '/');
  const decrypt = CryptoJS.AES.decrypt(restoreBase64, fillKey(cryptoKey), {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7
  });
  const data = CryptoJS.enc.Utf8.stringify(decrypt).trim();
  try {
    return data;
  } catch (error) {
    return '';
  }
};

/**
 * 生成密钥字节数组, 原始密钥字符串不足128位, 补填0.
 * @param {string} key - 原始 key 值
 * @return Buffer
 */
function fillKey(key) {
  // 这里不用Buffer 是因为Buffer 是node 环境下的   换成ArrayBuffer 兼容性更好
  const filledKey = new ArrayBuffer(keySize / 8);
  const keys = new Uint8Array(key);
  let index = 0;
  while (index < filledKey.length) {
    filledKey[index] = keys[index];
    index += 1;
  }

  return CryptoJS.enc.Utf8.parse(filledKey);
}
