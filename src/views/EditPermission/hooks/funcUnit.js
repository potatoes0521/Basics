/*
 * @LastEditors: liu yang
 * @Description: ...
 * @Date: 2022-08-09 13:35:13
 * @LastEditTime: 2023-05-16 10:18:16
 * @Author: liu yang
 */
export const getFuncUnitIds = (checkedList) => {
  let funcUnitIds = [];
  // eslint-disable-next-line no-restricted-syntax
  for (const key in checkedList) {
    if (key === 'www' || !checkedList[key].length) {
      // eslint-disable-next-line no-continue
      continue;
    }
    const item = (checkedList[key] || []).filter((i) => i.id > 0).map((i) => i.id);
    funcUnitIds = [...funcUnitIds, ...item];
  }
  funcUnitIds = [...new Set(funcUnitIds)];
  return {
    funcUnitIds: funcUnitIds.join(','),
    funcUnitIdArr: funcUnitIds
  };
};
