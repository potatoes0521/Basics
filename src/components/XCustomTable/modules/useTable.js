/*
 * @LastEditors: liu yang
 * @Description: 表基础数据
 * @Date: 2021-12-13 18:58:23
 * @LastEditTime: 2023-05-16 09:55:35
 * @Author: liu yang
 */
import { reactive, watch } from 'vue';
import storage from '../utils/storage';

export default function useTable() {
  const state = reactive({
    // 表格配置
    config: {
      size: 'default'
    },
    // 列设置
    defaultColumns: [],
    columns: [],
    columnSettingCheckAll: false,
    isIndeterminate: false,
    checkedColumns: []
  });

  watch(
    () => state,
    () => {
      storage.setLocal(state.config.key, state, false);
    },
    { deep: true }
  );

  return state;
}
