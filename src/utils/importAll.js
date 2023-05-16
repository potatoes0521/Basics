/*
 * @LastEditors: liu yang
 * @Description: ...
 * @Date: 2021-11-08 17:46:35
 * @LastEditTime: 2022-12-26 15:15:38
 * @Author: liu yang
 */
export const importAll = (r) => {
  let modules = {};
  Object.values(r).forEach((v) => {
    let m = v.default;
    let n = m.name;
    modules[n] = m;
  });
  return modules;
};
