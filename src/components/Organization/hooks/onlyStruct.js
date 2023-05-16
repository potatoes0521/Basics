/*
 * @LastEditors: liu yang
 * @Description: 处理选择部门
 * @Date: 2022-11-02 15:23:46
 * @LastEditTime: 2022-12-04 16:59:31
 * @Author: liu yang
 */

import { isString } from '@/utils/typeOf';

export default function useOnlyStruct({ treeRef, emit, copyCheckList }) {
  function isHandleCheckStruct() {
    nextTick(() => {
      copyCheckList.value = treeRef?.value?.getCheckedNodes(false) ?? [];
    });
  }

  function isSubmitCheckStruct() {
    emit('onSubmit', copyCheckList.value);
  }

  function isOpenCheckStruct(data) {
    if (isString(data)) {
      const arr = data.split(',');
      treeRef.value.setCheckedKeys(arr);
    } else if (Array.isArray(data)) {
      treeRef.value.setCheckedKeys(data);
    }
  }

  return {
    isHandleCheckStruct,
    isSubmitCheckStruct,
    isOpenCheckStruct
  };
}
