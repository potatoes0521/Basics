/*
 * @LastEditors: liu yang
 * @Description: 处理选择人
 * @Date: 2022-11-02 15:23:41
 * @LastEditTime: 2022-12-04 16:59:36
 * @Author: liu yang
 */
import { isString } from '@/utils/typeOf';

export default function useOnlyPeople({ treeRef, emit, copyCheckList, defaultProps, userList }) {
  /**
   * @Author: liu yang
   * @Date: 2022-11-02 14:31:55
   * @description: 只选人
   * @return {*}
   */
  function isHandleCheckPeople() {
    nextTick(() => {
      copyCheckList.value = (treeRef?.value?.getCheckedNodes(true) ?? []).filter((v) => v.userId).map((v) => ({ ...v, labelName: treeItemFullPathName(v) }));
    });
  }

  /**
   * @Author: liu yang
   * @Date: 2022-11-02 15:21:40
   * @description: 只选人提交
   * @return {*}
   */
  function isSubmitCheckPeople() {
    console.log('copyCheckList.value', copyCheckList.value);
    emit('onSubmit', copyCheckList.value);
  }

  function treeItemFullPathName(currentData) {
    const name = currentData[defaultProps.label];
    let structs = '';
    currentData = currentData.parent;
    while (currentData) {
      if (currentData[defaultProps.label]) {
        const tag = structs ? ' / ' : '';
        structs = `${currentData[defaultProps.label]}${tag}${structs}`;
      }
      currentData = currentData.parent;
    }
    structs = `【${structs}】`;
    return name + structs;
  }

  function isOpenCheckPeople(data) {
    if (isString(data)) {
      console.log(data, data.split(','));
      data = data.split(',');
    }
    if (!Array.isArray(data)) {
      console.error('🚀 > file: onlyPeople.js > line 60 > isOpenCheckPeople > data', data);
      console.error('参数错误  请检查参数 参数必须是数组或者逗号分隔的字符串');
      return;
    }
    const userL = userList.value.filter((v) => data.includes(v.userId) || data.includes(`${v.userId}`)).map((v) => v.nodeKey);
    console.log(userL);
    treeRef.value.setCheckedKeys(userL);
    nextTick(() => {
      isHandleCheckPeople();
    });
  }

  return {
    isHandleCheckPeople,
    isSubmitCheckPeople,
    isOpenCheckPeople
  };
}
