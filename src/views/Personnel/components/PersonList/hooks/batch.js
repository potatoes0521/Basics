/*
 * @LastEditors: liu yang
 * @Description: ...
 * @Date: 2021-12-03 16:31:47
 * @LastEditTime: 2022-12-05 14:04:01
 * @Author: liu yang
 */

import { ref } from 'vue';

export default function useBatch() {
  const allSelectData = ref(new Set());

  function onSelectionChange(selection) {
    allSelectData.value.clear();
    selection.forEach((v) => {
      allSelectData.value.add(v.userId);
    });
  }

  const selectPeople = computed(() => {
    return Array.from(allSelectData.value);
  });
  return { onSelectionChange, selectPeople, allSelectData };
}
