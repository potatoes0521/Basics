/*
 * @LastEditors: liu yang
 * @Description: ...
 * @Date: 2022-07-27 11:37:56
 * @LastEditTime: 2022-12-22 15:25:34
 * @Author: liu yang
 */
import { allotRole } from '@/api/modules/user';
import { ElMessage } from 'element-plus';
import { useRouter } from 'vue-router';
import usePageType from '@/views/EditPermission/hooks/pageType';
import { addRole, getRoleDetails } from '@/api/modules/role';
import { inject, watch, nextTick } from 'vue';
import { getFuncUnitIds } from '@/views/EditPermission/hooks/funcUnit';

export default function useRole(roleList, props, emit) {
  const eventBus = inject('eventBus');

  /**
   * @Author: liu yang
   * @Date: 2022-07-18 10:14:28
   * @description: 当获取到角色的权限
   * @return {*}
   */
  eventBus.on('getUserRole', ({ roleIds, funcUnitIds }) => {
    let needCheckRole = [];
    roleList.value.forEach((i) => {
      if (roleIds.includes(i.roleId)) {
        i.checked = true;
        const item = (i.funcUnitIds?.split(',') ?? []).map((v) => +v).reduce((a, b) => a.concat(b), []);
        needCheckRole = [...needCheckRole, ...item];
      }
    }) || [];
    needCheckRole = [...needCheckRole, ...funcUnitIds];
    eventBus.emit('getUserFuncUnitIds', Array.from(new Set(needCheckRole)));
  });

  const { userId, permId, editType, pageEN } = usePageType();
  const router = useRouter();

  eventBus.on('submitDisPermInRole', () => {
    const permList = roleList.value.filter((i) => i.checked) || [];
    console.log('🚀 > file: index.vue > line 108 > eventBus.on > permList', permList);
    // 拿到已经选中的角色
    // TODO: 权限组没有做  其实这里应该下一步是去拿权限组  这里先直接处理树
    // eventBus.emit('submitDisPermGroup', permList);
    eventBus.emit('submitDisFreePerm', permList);
  });

  /**
   * @Author: liu yang
   * @Date: 2022-07-27 11:45:12
   * @description: 分配角色
   * @return {*}
   */
  eventBus.on('submitDisRole', () => {
    const permList = roleList.value.filter((i) => i.checked) || [];
    const roleIdList = permList.map((item) => item.roleId).join();
    eventBus.emit('pageLoading');

    allotRole({
      userIds: userId.value,
      roles: roleIdList,
      reset: true
    }).then(() => {
      ElMessage.success('分配成功');
      router.go(-1);
    });
  });

  /**
   * @Author: liu yang
   * @Date: 2022-07-27 14:42:39
   * @description: 编辑添加角色
   * @return {*}
   */
  eventBus.on('submitFormRole', ({ type, data }) => {
    handleEdit(type, data);
  });

  const checkedList = inject('checkedList');

  /**
   * @Author: liu yang
   * @Date: 2022-07-27 14:44:08
   * @description: 处理编辑角色
   * @return {*}
   */
  function handleEdit(type, data) {
    const { zcName, enName, order, remarks } = data;
    console.log(checkedList.value);
    const { funcUnitIds } = getFuncUnitIds(checkedList.value);
    if (!funcUnitIds) {
      ElMessage.error('请给角色分配至少一个权限');
      return;
    }
    eventBus.emit('pageLoading');
    addRole({
      roleId: permId.value ?? '',
      role: enName,
      roleName: zcName,
      roleOrder: order,
      remarks,
      funcUnitIds
    }).then(() => {
      ElMessage.success(`${type === 'edit' ? '编辑' : '添加'}成功`);
      router.go(-1);
    });
  }

  /**
   * @Author: liu yang
   * @Date: 2022-07-28 14:33:08
   * @description: 获取角色详情
   * @return {*}
   */
  function getRoleDetail() {
    emit('update:pageLoading', true);
    getRoleDetails({ roleId: permId.value }).then(({ data }) => {
      const { funcUnitIds: funcUnitIdsL, role: enName, roleName: zcName, roleOrder: order, remarks } = data;
      const funcUnitIds = funcUnitIdsL.split(',').map((i) => +i);
      // 给树上选中
      eventBus.emit('getUserFuncUnitIds', funcUnitIds);
      const ndata = {
        remarks,
        enName,
        zcName,
        order
      };
      // 给表单赋值
      eventBus.emit('getFormData', ndata);
      nextTick(() => {
        emit('update:pageLoading', false);
      });
    });
  }

  function init() {
    if (editType.value === 'edit' && pageEN.value === 'role') {
      getRoleDetail();
    }
  }

  watch(
    () => props.permTreeLoading,
    (val) => {
      if (val) {
        console.log('请求完了');
        init();
      }
    },
    { deep: true }
  );
}
