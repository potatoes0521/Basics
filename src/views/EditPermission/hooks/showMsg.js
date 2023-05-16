/*
 * @LastEditors: liu yang
 * @Description: 处理展示信息
 * @Date: 2022-07-12 18:54:59
 * @LastEditTime: 2022-12-04 16:41:08
 * @Author: liu yang
 */
import { useRoute } from 'vue-router';
import storage from '@/utils/storage';
import { ref } from 'vue';

export default function useShowMsg() {
  const route = useRoute();
  const { query } = route || '';

  const { uname } = storage.getSession('userMsg', false) || {};

  const title = ref('');
  const showList = ref('');

  switch (query.pageType) {
    case 'add_role':
      title.value = '新建角色';
      showList.value = ['form', 'tabs', 'tree', 'result', 'role'];
      break;
    case 'edit_role':
      title.value = '编辑角色';
      showList.value = ['form', 'tabs', 'tree', 'result', 'role'];
      break;
    case 'dis_role':
      title.value = `分配角色-${uname || ''}`;
      showList.value = ['tabs', 'tree', 'result', 'role', 'dis'];
      break;
    // // 批量分配角色
    // case 'dis_u_role':
    //   title.value = '分配角色-' + (uname || '');
    //   showList.value = ['tabs', 'person', 'tree', 'result', 'role', 'dis'];
    //   break;
    case 'add_perm_group':
      title.value = '新建权限组';
      showList.value = ['form', 'tabs', 'tree', 'result', 'perm_group'];
      break;
    case 'edit_perm_group':
      title.value = '编辑权限组';
      showList.value = ['form', 'tabs', 'tree', 'result', 'perm_group'];
      break;
    case 'dis_perm_group':
      title.value = `分配权限组-${uname || ''}`;
      showList.value = ['tabs', 'tree', 'result', 'perm_group', 'dis'];
      break;
    case 'dis_all':
      title.value = `分配权限-${uname || ''}`;
      showList.value = ['tabs', 'tree', 'result', 'perm_group', 'dis'];
      break;
    default:
      break;
  }

  return {
    title,
    showList
  };
}
