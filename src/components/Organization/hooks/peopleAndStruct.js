/*
 * @LastEditors: liu yang
 * @Description: 处理选择人和部门
 * @Date: 2022-11-02 15:23:46
 * @LastEditTime: 2022-12-04 16:59:28
 * @Author: liu yang
 */
export default function usePeopleAndStruct({ treeRef, copyCheckList }) {
  /**
   * @Author: liu yang
   * @Date: 2022-11-02 14:32:36
   * @description: 选择部门和人
   * @return {*}
   */
  function isHandleCheckPeopleAndStruct() {
    nextTick(() => {
      copyCheckList.value = treeRef?.value?.getCheckedNodes(true) ?? [];
    });
  }

  function isSubmitCheckPeopleAndStruct() {
    // emit("onSubmit", copyCheckList.value);
  }

  function isOpenCheckPeopleAndStruct() {
    // 1
  }
  return {
    isSubmitCheckPeopleAndStruct,
    isHandleCheckPeopleAndStruct,
    isOpenCheckPeopleAndStruct
  };
}
