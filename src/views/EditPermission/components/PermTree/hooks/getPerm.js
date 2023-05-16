/*
 * @LastEditors: liu yang
 * @Description: 获取用户权限
 * @Date: 2022-07-29 16:33:28
 * @LastEditTime: 2022-12-22 15:26:50
 * @Author: liu yang
 */
import { getPermWithMenu } from '@/api/modules/perm';
import { inject, nextTick, ref } from 'vue';
import { listToTree } from '@/utils/treeTool';
import usePageType from '@/views/EditPermission/hooks/pageType';

export default function useGetPerm(emit) {
  const checkedList = inject('checkedList');
  const systemList = inject('systemList');
  const tabsActiveName = inject('tabsActiveName');
  const menuList = ref([]);
  const menuLoading = ref(false);

  const { editType, pageEN } = usePageType();
  /**
   * @Author: liu yang
   * @Date: 2022-07-14 18:00:53
   * @description: 获取权限
   * @return {*}
   */
  function getPermMenu() {
    menuLoading.value = true;
    getPermWithMenu().then(({ data: { perms } }) => {
      perms = perms.map((item) => {
        if (!item.pid) {
          item.pid = 0;
        }
        item.checkable = !item.checkable;
        if (editType.value === 'dis' && pageEN.value !== 'all') {
          item.checkable = true;
        }
        return item;
      });
      // 菜单转换为树形
      const list = listToTree({ list: perms, key: 'id', Pkey: 'pid' });
      console.log('🚀 > file: getPerm.js:44 > getPermWithMenu > list', list);
      // 排序
      menuList.value = list;
      systemList.value = list.map((i) => {
        const v = { ...i };
        delete v.children;
        return { ...v };
      });
      tabsActiveName.value = systemList.value[0].id;
      menuLoading.value = false;
      nextTick(() => {
        emit('update:loading', true);
      });
    });
  }
  getPermMenu();

  return {
    menuList,
    menuLoading,
    tabsActiveName,
    checkedList,
    systemList
  };
}
