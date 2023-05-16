/*
 * @LastEditors: liu yang
 * @Description: ...
 * @Date: 2022-07-13 14:54:39
 * @LastEditTime: 2023-05-16 10:17:49
 * @Author: liu yang
 */
import { ref, provide, watch } from 'vue';
import { getUserSettingPerm } from '@/api/modules/user';
import usePageType from './pageType';

export default function useForm(eventBus) {
  /**
   * @Author: liu yang
   * @Date: 2022-07-13 16:17:14
   * @description: 存储已经选中的数据
   * @return {*}
   */
  const checkedList = ref({});

  provide('checkedList', checkedList);

  /**
   * @Author: liu yang
   * @Date: 2022-07-27 15:12:50
   * @description: 存储半选数据
   * @return {*}
   */
  const halfCheckedList = ref({});

  provide('halfCheckedList', halfCheckedList);

  /**
   * @Author: liu yang
   * @Date: 2022-07-13 16:17:31
   * @description: 存储系统数据
   * @return {*}
   */
  const systemList = ref([]);

  provide('systemList', systemList);

  /**
   * @Author: liu yang
   * @Date: 2022-07-13 16:17:40
   * @description: 当前选的那个系统
   * @return {*}
   */
  const tabsActiveName = ref('');

  provide('tabsActiveName', tabsActiveName);

  const permTreeLoading = ref(false);
  const rolePermListLoading = ref(false);

  const { userId, editType } = usePageType();

  if (editType.value === 'dis') {
    watch(
      () => [permTreeLoading.value, rolePermListLoading.value],
      (val) => {
        if (val.every((i) => !!i)) {
          console.log('请求完了');
          getUserPerm();
        }
      },
      { deep: true }
    );
  }

  /**
   * @Author: liu yang
   * @Date: 2022-07-27 15:13:25
   * @description: 获取用户权限
   * @return {*}
   */
  function getUserPerm() {
    getUserSettingPerm({
      userId: userId.value
    }).then(({ data: { roleIds, skillIds, funcUnitIds } }) => {
      eventBus.emit('getUserRole', { roleIds, funcUnitIds });
      eventBus.emit('getUserSkill', skillIds);
      // eventBus.emit('getUserFuncUnitIds', funcUnitIds);
    });
  }

  return {
    checkedList,
    permTreeLoading,
    rolePermListLoading
  };
}
