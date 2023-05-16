/*
 * @LastEditors: liu yang
 * @Description: RSA 加密 companyName 加盐
 * @Date: 2022-04-11 13:57:30
 * @LastEditTime: 2023-05-16 09:47:56
 * @Author: liu yang
 */
import JSEncrypt from 'jsencrypt/bin/jsencrypt.min';
import { getRsaPub } from '@/api/modules/static';

// 加密
export const desEncrypt = async (data) => {
  let encryptor = new JSEncrypt();
  const rsaPub = await getRsaPubApi();
  // ssl生成的公钥(后台传过来)，复制的时候要小心不要有空格
  let pubKey = `-----BEGIN PUBLIC KEY-----${rsaPub}-----END PUBLIC KEY-----`;
  encryptor.setPublicKey(pubKey); // 设置公钥
  return encryptor.encrypt(data); // 对内容进行加密
};

const getRsaPubApi = async () => {
  const {
    data: { casRsaPub }
  } = await getRsaPub();
  if (!casRsaPub) {
    throw Error('获取公钥失败');
  }
  return casRsaPub;
};
