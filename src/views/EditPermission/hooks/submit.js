/*
 * @LastEditors: liu yang
 * @Description: ...
 * @Date: 2022-07-18 10:16:47
 * @LastEditTime: 2023-05-16 10:20:47
 * @Author: liu yang
 */
import usePageType from './pageType';
import { ref } from 'vue';
import { ElMessage } from 'element-plus';
import { allotPerm } from '@/api/modules/user';
import { useRouter } from 'vue-router';
import { getFuncUnitIds } from '@/views/EditPermission/hooks/funcUnit';

export default function useSubmit(eventBus, checkedList) {
  const { pageEN, editType, userId } = usePageType();
  const router = useRouter();
  function onSubmit() {
    // 当页面是分配权限时
    if (editType.value === 'dis') {
      handleDis();
    } else {
      eventBus.emit('submitForm');
    }
  }

  function handleDis() {
    if (pageEN.value === 'role') {
      eventBus.emit('submitDisRole');
    } else if (pageEN.value === 'perm_group') {
      eventBus.emit('submitDisPermGroup');
    } else {
      // 先去拿已经选中的角色
      eventBus.emit('submitDisPermInRole');
    }
  }

  const pageLoading = ref(false);

  eventBus.on('pageLoading', () => {
    pageLoading.value = true;
  });

  eventBus.on('submitDisFreePerm', (data) => {
    console.log('🚀 > file: submit.js > line 42 > eventBus.on > data', data);
    const rolePermId = [
      ...new Set(
        data
          .map((i) => {
            return (i.funcUnitIds?.split(',') ?? []).map((ii) => +ii);
          })
          .reduce((a, b) => a.concat(b), [])
      )
    ];
    const { funcUnitIdArr } = getFuncUnitIds(checkedList.value);
    const freePerm = [];
    // eslint-disable-next-line no-restricted-syntax
    for (let i of funcUnitIdArr) {
      if (!rolePermId.includes(i)) {
        freePerm.push(i);
      }
    }
    const roleId = data.map((i) => +i.roleId).join(',');
    console.log(
      '角色自带的权限',
      rolePermId.sort((a, b) => a - b)
    );
    console.log(
      '已经分配的权限',
      funcUnitIdArr.sort((a, b) => a - b)
    );
    console.log('游离权限', freePerm);
    if (!roleId && !freePerm.length) {
      ElMessage.error('请至少选择一个角色或权限');
      return;
    }
    pageLoading.value = true;
    allotPerm({
      userId: userId.value,
      roleIds: roleId,
      // TODO: 技能变权限组 目前只改前端  后端字段后续改 2021-09-29 18:09:58
      funcUnitIds: freePerm.join(',')
    })
      .then(() => {
        ElMessage.success('分配成功');
        pageLoading.value = false;
        router.go(-1);
      })
      .catch(() => {
        pageLoading.value = false;
      });
  });

  return {
    onSubmit,
    pageLoading,
    editType
  };
}
