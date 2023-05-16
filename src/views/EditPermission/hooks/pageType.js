/*
 * @LastEditors: liu yang
 * @Description: ...
 * @Date: 2022-07-13 11:16:48
 * @LastEditTime: 2022-07-29 16:28:32
 * @Author: liu yang
 */
import { useRoute } from 'vue-router';
import { ref } from 'vue';

export default function usePageType() {
  const route = useRoute();
  const pageZN = ref('');
  const pageEN = ref('');
  const editType = ref('');
  const userId = ref('');
  const permId = ref('');

  const { pageType, uId, id } = route.query;
  if (~pageType.indexOf('role')) {
    pageZN.value = '角色';
    pageEN.value = 'role';
  } else if (~pageType.indexOf('perm_group')) {
    pageZN.value = '权限组';
    pageEN.value = 'perm_group';
  } else {
    pageZN.value = '权限';
    pageEN.value = 'all';
  }
  if (~pageType.indexOf('dis')) {
    editType.value = 'dis';
  } else if (~pageType.indexOf('edit')) {
    editType.value = 'edit';
  } else if (~pageType.indexOf('add')) {
    editType.value = 'add';
  }
  userId.value = uId;
  permId.value = id;

  return {
    pageZN,
    pageEN,
    editType,
    userId,
    permId
  };
}
