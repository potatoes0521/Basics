/*
 * @LastEditors: liu yang
 * @Description: axios请求封装
 * @Date: 2022-03-14 10:42:23
 * @LastEditTime: 2022-12-30 11:09:24
 * @Author: liu yang
 */
import axios from 'axios';
import axiosRetry from 'axios-retry';
import { ElMessage, ElMessageBox } from 'element-plus';
import { getCookie, getLocal } from './storage';
import { useUserStore } from '@/store/user';
import { messageContentRender } from './createdHtmlTemplate';
import { isNullOrUnDef } from './typeOf';

// 等待中请求
const pendingMap = new Map();

/**
 * 请求方法
 * @param {Object} baseOptions 基础配置
 * @param {String}   baseOptions.baseURL 请求前缀
 * @param {String}   baseOptions.timeout 超时时长
 * @param {Object} customOptions 扩展配置
 * @param {String}   customOptions.cancelRepeatRequest 是否开启取消重复请求, 默认为 false
 * @param {String}   customOptions.reductDataformat 是否开启简洁的数据结构响应, 默认为true
 * @param {String}   customOptions.showErrorMessage 是否开启接口错误信息展示,默认为true
 * @param {String}   customOptions.showCodeMessage 是否开启自定义code模式信息提示, 默认为false
 * @param {String}   customOptions.requestRetryCount 请求重试次数
 * @returns {Function} 请求方法 - 扩展配置参数可单独用于请求方法
 */
function Http(baseOptions, customOptions) {
  const service = axios.create({
    // 请求前缀
    baseURL: baseOptions.baseURL,
    // 超时时长
    timeout: baseOptions.timeout || 30000
  });

  // 自定义配置默认模板
  const customOptionsTemplate = {
    cancelRepeatRequest: false,
    reductDataformat: true,
    showErrorMessage: true,
    showCodeMessage: false,
    requestRetryCount: 0
  };

  customOptions = {
    ...customOptionsTemplate,
    ...customOptions
  };

  const axiosRetryOptions = {
    retries: customOptions.requestRetryCount || 0, // 全局请求重试次数
    shouldResetTimeout: true // 定义重试之间是否应重置超时
    // retryCondition: (err) => {
    //   console.log({ ...err }, err.message);
    //   if (err.message.includes('timeout')) {
    //     return true;
    //   }
    //   return false;
    // }, // 控制是否应重试请求的回调，默认如果是网络错误或幂等请求（GET、HEAD、OPTIONS、PUT或DELETE）上的5xx错误会重试
    // retryDelay: (retryCount) => retryCount * 1000 // 全局请求重试之间的延迟 - 默认无延迟
  };
  // 请求重试
  axiosRetry(service, {
    ...axiosRetryOptions
  });

  service.interceptors.request.use(
    (config) => {
      // 跳过空值校验
      if (!config.skipTestNull && config.data) {
        // 空值删除
        Object.keys(config.data).forEach((key) => {
          if (config.data[key] === '') {
            delete config.data[key];
          } else if (isNullOrUnDef(config.data[key])) {
            delete config.data[key];
          }
        });
      }
      removePending(config);
      config.cancelRepeatRequest && addPending(config);

      let contentType = 'application/json;';
      if (config.url.endsWith('import')) {
        contentType = 'multipart/form-data;';
      }
      config.headers = {
        ...config.headers,
        'content-type': contentType,
        accessToken: getCookie('acToken', true) || '',
        fp: getLocal('visitorId')
      };
      // 合并 - 请求重试配置
      config['axios-retry'] = { ...axiosRetryOptions, retries: config.requestRetryCount || 0 };
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  service.interceptors.response.use(
    (response) => {
      removePending(response.config);

      // 自定义code码非0000，即为错误
      if (response.config.showCodeMessage && response.data && response.data.message.code !== '0000') {
        // 处理自定义错误状态码
        customErrorStatusHandle(response);
        return Promise.reject(response.data);
      }

      return response.config.reductDataformat ? response.data : response;
    },
    (error) => {
      // 重复请求异常处理
      if (axios.isCancel(error)) error = { info: 'Repeat Request Cancel', ...error };
      error?.config && error.config && removePending(error.config);
      // 处理错误状态码
      error?.config?.showErrorMessage && httpErrorStatusHandle(error);
      // 错误继续返回给到具体页面
      return Promise.reject(error);
    }
  );

  return (requestConfig) => {
    return service({ ...customOptions, ...requestConfig });
  };
}

/**
 * 生成每个请求唯一的键
 * @param {*} config
 * @returns string
 */
function getPendingKey(config) {
  // return JSON.stringify(config);
  let { url, method, params, data } = config;
  if (typeof data === 'string') data = JSON.parse(data); // response里面返回的config.data是个字符串对象
  return [url, method, JSON.stringify(params), JSON.stringify(data)].join('&');
}

/**
 * 储存每个请求唯一值, 也就是cancel()方法, 用于取消请求
 * @param {*} config
 */
function addPending(config) {
  const pendingKey = getPendingKey(config);
  config.cancelToken =
    config.cancelToken ||
    new axios.CancelToken((cancel) => {
      if (!pendingMap.has(pendingKey)) {
        pendingMap.set(pendingKey, [cancel, { ...config }]);
      }
    });
}

/**
 * 删除重复的请求
 * @param {*} config
 */
function removePending(config) {
  const pendingKey = getPendingKey(config);
  if (pendingMap.has(pendingKey)) {
    const [cancelToken] = pendingMap.get(pendingKey);
    cancelToken(pendingKey);
    pendingMap.delete(pendingKey);
  }
}

/**
 * 处理异常
 * @param {*} error
 */
function httpErrorStatusHandle(error) {
  console.log('🚀 > file: http.js > line 164 > httpErrorStatusHandle > error', error);
  // 处理被取消的请求
  if (axios.isCancel(error)) return console.error(`已中断重复请求：${error.message}`);
  let message = '';
  const userStore = useUserStore();

  if (error && error.response) {
    switch (error.response.status) {
      case 302:
        message = '接口重定向了！';
        break;
      case 400:
        message = '参数不正确！';
        break;
      case 401:
        if (error.response.data.message.code === '9002') {
          ElMessageBox.confirm(
            messageContentRender({
              icon: 'el-icon-error error',
              title: '警告',
              message: error.response.data.message.msg || '管理员未给您分配该权限'
            }),
            {
              dangerouslyUseHTMLString: true,
              showConfirmButton: true,
              confirmButtonText: '知道了',
              showCancelButton: false,
              showClose: false
            }
          );
        } else {
          message = '您未登录，或者登录已经超时，请先登录！';
          userStore.logout();
        }
        break;
      case 403:
        message = '您没有权限操作！';
        break;
      case 404:
        message = `请求地址出错: ${error.response.config.url}`;
        break; // 在正确域名下
      case 408:
        message = '请求超时！';
        break;
      case 409:
        message = '系统已存在相同数据！';
        break;
      case 500:
        message = '服务内部错误！';
        break;
      case 501:
        message = '服务未实现！';
        break;
      case 502:
        message = '网关错误！';
        break;
      case 503:
        message = '服务不可用！';
        break;
      case 504:
        message = '服务暂时无法访问，请稍后再试！';
        break;
      case 505:
        message = 'HTTP版本不受支持！';
        break;
      default:
        message = '异常问题，请联系管理员！';
        break;
    }
  }
  if (error.message.includes('timeout')) message = '网络请求超时！';
  if (error.message.includes('Network')) message = window.navigator.onLine ? '服务端异常！' : '您断网了！';

  ElMessage({
    type: 'error',
    message
  });
}

/**
 * 自定义状态码处理
 * @param {*} response
 */
function customErrorStatusHandle(response) {
  // 1000: '参数不合法！',
  // 2000: '系统繁忙，请重试！',
  // 3000: '系统异常，请重试！',
  // 4000: '业务异常，请重试！',
  // 4001: '用户等级不足，请联系管理员修改并重试！',
  // 4002: '系统权限不足，请联系管理员修改并重试！',
  // 9001: '您还没有认证，请重试！',
  // 9002: '您还没有授权，请重试！',
  // 9003: '接口不存在！',
  // 9004: '账号在其他地方登录，您已被强制下线！',
  // 9005: '请输入验证码再来试试吧！',
  // 9006: '监测到您的账户存在异常，已锁定30分钟！'
  // TODO: 自定义状态码处理
  const userStore = useUserStore();
  if (response.data.message.code === '9002') {
    ElMessageBox.confirm(
      messageContentRender({
        icon: 'el-icon-error error',
        title: '警告',
        message: response.data.message.msg || '管理员未给您分配该权限'
      }),
      {
        dangerouslyUseHTMLString: true,
        showConfirmButton: true,
        confirmButtonText: '知道了',
        showCancelButton: false,
        showClose: false
      }
    );
  } else if (response.data.message.code === 9004) {
    ElMessageBox.confirm(
      messageContentRender({
        icon: 'el-icon-warning warning',
        title: '警告',
        message: response.data.message.msg
      }),
      {
        dangerouslyUseHTMLString: true,
        showConfirmButton: true,
        confirmButtonText: '知道了',
        showCancelButton: false,
        showClose: false
      }
    ).then(() => {
      userStore.logout();
    });
    return;
  }
  ElMessage({
    type: 'error',
    message: response.data.message.msg
  });
}

// 请求类
export default Http;
