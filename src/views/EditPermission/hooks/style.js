/*
 * @LastEditors: liu yang
 * @Description: ...
 * @Date: 2022-07-13 16:06:51
 * @LastEditTime: 2022-07-14 18:32:00
 * @Author: liu yang
 */
import { onMounted, ref } from 'vue';

export default function useStyle() {
  const wrapperRef = ref(null);
  const tabPaneHeightR = ref(`${400 - 65}px`);
  function tabPaneHeight() {
    console.log('🚀 > file: style.js > line 15 > tabPaneHeight > tabPaneHeight');
    tabPaneHeightR.value = `${(wrapperRef.value.offsetHeight || 400) - 65}px`;
  }

  onMounted(() => {
    tabPaneHeight();
  });

  const defaultProps = ref({
    children: 'children',
    label: 'name',
    disabled: 'checkable'
  });

  return {
    wrapperRef,
    tabPaneHeightR,
    defaultProps
  };
}
