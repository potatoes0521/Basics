/*
 * @Author: liu yang
 * @Date: 2021-09-03 09:40:04
 * @LastEditors: liu yang
 * @LastEditTime: 2023-05-16 09:51:31
 * @Description: 按钮权限指令 v-auth / 全局混入权限校验方法 auth
 */
import { getSession } from './storage';

export default function auth(Vue) {
  // 注册一个全局自定义指令 `v-auth`
  Vue.directive('auth', {
    // 当被绑定的元素插入到 DOM 中时
    mounted: (el, binding) => {
      if (!isCheck(binding.value, binding.arg)) el.parentNode.removeChild(el);
    }
  });

  // 混入非指令权限判定方法
  Vue.mixin({
    methods: {
      auth(value, currentPath) {
        return Array.isArray(value) ? value.map((v) => isCheck(currentPath || this.$route, v)) : isCheck(currentPath || this.$route, value);
      }
    }
  });
}

function isCheck(route, key) {
  let authList = getSession('authList');
  if (!authList) return;
  if (!route) return false;

  let path = '';
  if (typeof route === 'string') {
    path = route;
  } else {
    path = route.path;
  }

  // 校验页面base-默认功能单元 不存在直接返回false
  if (authList.findIndex((v) => v.slice(-`${path}/base`.length) === `${path}/base`) === -1) return false;

  if (!key) return false;
  const keyStr = `${path}/${key}`;

  return authList.findIndex((v) => v.slice(-keyStr.length) === keyStr) !== -1;
}
