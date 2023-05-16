/*
 * @LastEditors: liu yang
 * @Description: 全局config配置文件
 * @Date: 2022-03-03 14:51:27
 * @LastEditTime: 2023-05-16 09:43:19
 * @Author: liu yang
 */
// import { loadEnv } from 'vite'

// 获取环境变量
const ENV = import.meta.env;
// console.log(ENV);
// 配置文件
let config = {};
// 默认配置文件
const configSource = {
  appCode: ENV.VITE_APP_CODE,
  // 项目标识代码
  projectCode: `qishi_${ENV.VITE_APP_CODE}_${ENV.VITE_APP_ENV}`,
  // 项目名
  projectName: ENV.VITE_APP_NAME || '',
  navProjectName: ENV.VITE_NAV_PROJECT_NAME,
  // 项目描述
  projectDesc: ENV.VITE_APP_DESCRIPTION || '',
  // Token在Cookie中存储的天数，默认1天
  cookieExpires: 30,
  // 资源base地址
  base: ENV.VITE_BASE,
  // 接口代理URL路径
  baseUrl: ENV.VITE_BASE_URL,
  // 模拟数据接口路径
  mockBaseUrl: ENV.VITE_BASE_MOCK_URL,
  // 服务端接口路径
  serverUrl: ENV.VITE_BASE_SERVER_URL,
  // 代理子应用前缀名
  routerPrefix: ENV.VITE_APP_ROUTER_PREFIX,
  messageSocketURL: ENV.VITE_APP_MESSAGE_SOCKET_API, // 常链接
  storagePrefix: 'xiaoshi_qishi',
  navLogo: ENV.VITE_APP_NAV_LOGO,
  loginPageLogo: ENV.VITE_APP_LOGIN_PAGE_LOGO,
  loginPageLogin: ENV.VITE_APP_LOGIN_PAGE_LOGIN,
  h5Preview: ENV.VITE_APP_H5_PREVIEW_FORM_RENDER_URL,
  DEFAULT_PRIMARY: '#4EB2B4'
};

/**
 * @Author liu yang
 * @Date 2022-03-03 16:44:49
 * @description 设置全局配置
 * @param {Object} cfg 配置项
 * @return {Object} 新的全局配置 config
 */
const setConfig = (cfg) => {
  config = Object.assign(config, cfg);
  return config;
};

/**
 * @Author liu yang
 * @Date 2022-03-03 16:45:11
 * @description 重置全局配置
 * @param {*}
 * @return {Object} 全局默认配置 configSource
 */
const resetConfig = () => {
  config = { ...configSource };
  return config;
};
resetConfig();

/**
 * @Author liu yang
 * @Date 2022-03-03 16:45:23
 * @description 获取全局配置
 * @param {String} key 配置项，支持 'a.b.c' 的方式获取
 * @return {Object} 新的全局配置 config
 */
const getConfig = (key) => {
  if (typeof key === 'string') {
    const arr = key.split('.');
    if (arr && arr.length) {
      let data = config;
      arr.forEach((v) => {
        if (data && typeof data[v] !== 'undefined') {
          data = data[v];
        } else {
          data = null;
        }
      });
      return data;
    }
  }
  if (Array.isArray(key)) {
    const data = config;
    if (key && key.length > 1) {
      let res = {};
      key.forEach((v) => {
        if (data && typeof data[v] !== 'undefined') {
          res[v] = data[v];
        } else {
          res[v] = null;
        }
      });
      return res;
    }
    return data[key];
  }
  return { ...config };
};

export { getConfig, setConfig, resetConfig };
