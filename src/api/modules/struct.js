/*
 * @Author: liuYang
 * @Description: 组织架构 模块的接口
 * @Path: 引入路径
 * @Date: 2021-03-29 14:34:24
 * @LastEditors: shenjilin
 * @LastEditTime: 2023-05-11 17:41:36
 * @MustParam: 必传参数
 * @OptionalParam: 选传参数
 * @EmitFunction: 函数
 * @Slot/Props.children: 提供的插槽或render
 * @Examples: 使用示例
 */

import { request } from '../request';
import Qs from 'qs';
import { getConfig } from '@/config';
import { getCookie, getLocal } from '@/utils/storage';
import { downloadFile } from '@/utils/index';

/**
 * 获取组织架构
 * @return void
 */
export const getStructTree = (data = {}) => {
  return request({
    url: '/cas/struct/struct-tree',
    method: 'post',
    data
  });
};
/**
 * 新增
 * @return void
 */
export const addStruct = (data) => {
  return request({
    url: '/cas/struct/add-struct',
    method: 'post',
    data
  });
};

/**
 * 新增
 * @return void
 */
export const updateStruct = (data) => {
  return request({
    url: '/cas/struct/update-struct',
    method: 'post',
    data
  });
};

/**
 * 新增
 * @return void
 */
export const deleteStruct = (data) => {
  return request({
    url: '/cas/struct/delete-struct',
    method: 'post',
    data
  });
};

/**
 * 获取组织架构明细
 * @return void
 */
export const structDetails = (data) => {
  return request({
    url: '/cas/struct/struct-detail',
    method: 'post',
    data
  });
};

// 导入
// importStruct
export const importStruct = (data) => {
  return request({
    url: '/cas/struct/import-struct',
    method: 'post',
    data
  });
};

export const batchMove = (data) => {
  return request({
    url: '/cas/struct/batch-move',
    method: 'post',
    data
  });
};

// eslint-disable-next-line default-param-last
export const exportUser = (data = {}, fileName) => {
  let url = `${window.location.origin}${getConfig('baseUrl')}/cas/struct/export-user`;
  const token = getCookie('acToken', true);
  const fp = getLocal('visitorId');
  url += `?accessToken=${token}&fp=${fp}`;
  url += `&${Qs.stringify(data)}`;
  console.log(url, '导出');
  downloadFile(url, fileName);
};

export const importUser = (data) => {
  return request({
    url: '/cas/struct/import-user',
    method: 'post',
    data
  });
};

export const exportStruct = (data, fileName) => {
  let url = `${window.location.origin}${getConfig('baseUrl')}/cas/struct/export-struct`;
  const token = getCookie('acToken', true);
  const fp = getLocal('visitorId');
  url += `?accessToken=${token}&fp=${fp}`;
  url += `&${Qs.stringify(data)}`;
  console.log(url, '导出');
  downloadFile(url, fileName);
};
