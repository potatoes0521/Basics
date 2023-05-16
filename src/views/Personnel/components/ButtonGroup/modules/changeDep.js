/*
 * @LastEditors: NiuNiu
 * @Description: ...
 * @Date: 2021-12-03 17:37:12
 * @LastEditTime: 2022-12-13 11:42:07
 * @Author: liu yang
 */
import { ref } from 'vue';
import { getStructTree, batchMove } from '@/api/modules/struct';
import { listToTree } from '@/utils/treeTool';
import { ElMessage } from 'element-plus';

const baseForm = {
  structId: '',
  userIds: '',
  disableUser: false,
  disablePrincipal: false
};
export default function useChangeDep(props, emit) {
  const showPeopleChangeDepDialog = ref(false);
  const showBathFormLoading = ref(false);
  const changeDepForm = ref({
    ...baseForm
  });
  const changeDepFormRules = {
    structId: [{ required: true, message: '请选择一个部门', trigger: 'blur' }]
  };
  const strcutTree = ref([]);

  function handleShowChangeDepDialog() {
    if (!props.selectPeople.length) {
      ElMessage.error('请选择至少一个人员');
      return;
    }
    showPeopleChangeDepDialog.value = true;
    changeDepForm.value.userIds = props.selectPeople.toString();
  }

  function submitChangeDep() {
    console.log('[ changeDepForm.value ] >', changeDepForm.value);
    if (!changeDepForm.value.structId) {
      ElMessage.error('请选择一个部门');
      return;
    }
    showBathFormLoading.value = true;
    const struct = changeDepForm.value.structId;
    batchMove({ ...changeDepForm.value, structId: struct[struct.length - 1] })
      .then(() => {
        ElMessage.success('移动成功');
        showPeopleChangeDepDialog.value = false;
        emit('onNeedCleanTableChecked');
        emit('refreshPage');
      })
      .finally(() => {
        showBathFormLoading.value = false;
      });
  }

  function closeChangeDep() {
    changeDepForm.value = { ...baseForm };
    showPeopleChangeDepDialog.value = false;
  }

  // 获取部门树
  getDepTree();
  function getDepTree() {
    getStructTree({}).then(({ data: { structs } }) => {
      const newStructs = structs
        .map((item) => {
          if (!item.pid) {
            item.pid = 0;
          }
          return item;
        })
        .filter((item) => item.status === 1);
      strcutTree.value = listToTree({
        list: newStructs,
        key: 'id',
        Pkey: 'pid',
        orderBy: 'order'
      });
    });
  }

  return {
    showPeopleChangeDepDialog,
    changeDepForm,
    strcutTree,
    changeDepFormRules,
    showBathFormLoading,
    submitChangeDep,
    closeChangeDep,
    handleShowChangeDepDialog
  };
}
