/* eslint-disable no-new-func */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-continue */
/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
/*
 * @LastEditors: liu yang
 * @Description: ...
 * @Date: 2021-12-20 16:06:53
 * @LastEditTime: 2023-05-16 10:05:57
 * @Author: liu yang
 */

function stringifyFunction(obj) {
  let newobj = JSON.parse(JSON.stringify(obj));
  for (let key in obj) {
    if (obj[key] instanceof Function) {
      newobj[key] = obj[key].toString().replace(/[\n\t]/g, '');
      continue;
    }
    if (obj[key] instanceof Object) {
      newobj[key] = stringifyFunction(obj[key]);
    }
  }
  return newobj;
}

export function objectToString(obj) {
  // 用于替代JSON.stringify函数
  let _object = stringifyFunction(obj); // 将对象中的函数转为字符串
  return JSON.stringify(_object); // 将对象转为字符串
}

function stringToFunction(obj) {
  // 将对象中的函数字符串转化为函数
  let regex = /^((function\s)|.)([a-zA-Z_][a-zA-Z0-9_]*)\(.*\)\s\{.*\}/; // 匹配函数字符串
  for (let key in obj) {
    if (obj[key] instanceof Object) {
      stringToFunction(obj[key]);
    } else if (regex.test(obj[key])) {
      // 是一个函数
      try {
        let params = obj[key].substring(obj[key].indexOf('(') + 1, obj[key].indexOf(')'));
        let operation = obj[key].substring(obj[key].indexOf('{') + 1, obj[key].length - 1);
        obj[key] = new Function(params, operation);
      } catch (e) {
        console.log(e);
      }
    }
  }
  return obj;
}

export function stringToObject(string) {
  // 用于替代JSON.parse
  let obj = JSON.parse(string); // 将字符串转为对象
  return stringToFunction(obj); // 将对象中的函数字符串转为函数
}

export const parse = (obj) => stringToObject(objectToString(obj));
