/*
 * @Author: NiuNiu
 * @Description: 请填写描述信息
 * @Path: 引入路径
 * @Date: 2022-06-24 11:23:05
 * @LastEditors: liu yang
 * @LastEditTime: 2022-12-04 17:28:45
 * @MustParam: 必传参数
 * @OptionalParam: 选传参数
 * @EmitFunction: 函数
 * @Slot/Props.children: 提供的插槽或render
 * @Examples: 使用示例
 */
import { ref } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { roleSelectList } from '@/api/modules/select';
import { allotRole } from '@/api/modules/user';

export default function useOperation() {
  // 分配
  const customTreeDialogShow = ref(false);
  const CustomTreeDialogRef = ref(null);
  // 追加覆盖
  const roleList = ref(null);
  const handleDisPermGroup = () => {
    customTreeDialogShow.value = true;
    roles.value = [];
    checkList.value = [];
    getRoleSelectList();
  };

  const roles = ref([]);
  const getRoleSelectList = () => {
    roleSelectList().then(({ data }) => {
      roleList.value = data.options;
    });
  };

  function checkedChange() {
    console.log('🚀 > file: operation.js:33 > checkedChange > checkedKeys', checkList.value);
    const bindUsers = checkList.value.map((item) => item.userId);
    allotRole({
      userIds: bindUsers.join(','),
      roles: roles.value.join(','),
      reset: isAdd.value
    })
      .then(() => {
        ElMessage.success('批量分配角色成功');
        customTreeDialogShow.value = false;
      })
      .catch((err) => {
        ElMessage.success('批量分配角色失败,请重试');
        console.log(err);
      });
  }

  const isAdd = ref(false);
  const checkList = ref([]);

  const onRole = (flag) => {
    isAdd.value = flag;
    if (!checkList.value.length || !roles.value.length) {
      ElMessage.error('用户与角色都不能为空');
    } else {
      ElMessageBox.confirm('该操作会影响选中用户的权限，请谨慎操作！', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        checkedChange();
      });
    }
  };
  return {
    CustomTreeDialogRef,
    customTreeDialogShow,
    handleDisPermGroup,
    checkedChange,
    getRoleSelectList,
    roleList,
    roles,
    onRole,
    checkList
  };
}
