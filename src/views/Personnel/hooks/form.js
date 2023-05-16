/*
 * @LastEditors: liu yang
 * @Description: ...
 * @Date: 2022-12-05 10:07:51
 * @LastEditTime: 2022-12-23 09:50:58
 * @Author: liu yang
 */
import { nextTick, provide, ref } from 'vue';
import { statusList } from '../config/statusList';
import { listToTree } from '@/utils/treeTool';
import { getStructTree } from '@/api/modules/struct';
import { subsystemList, userLevelList, roleSelectList, structGradeList } from '@/api/modules/select.js';
import useUserInfo from '@/hooks/userInfo';

export default function useForm(tableRef) {
  const searchFormBase = {
    username: '',
    workNo: '',
    uname: '',
    accountStatus: '',
    userLevel: '',
    ssId: '',
    roleId: '',
    structId: ''
  };

  const formRef = ref(null);
  const formData = ref({ ...searchFormBase });

  const subsystemOptions = ref([]);
  function getSubsystemSelectList() {
    subsystemList().then(({ data }) => {
      subsystemOptions.value = data.options;
    });
  }
  getSubsystemSelectList();

  const userLevelListOptions = ref([]);

  function getUserLevelSelectList() {
    userLevelList().then(({ data }) => {
      userLevelListOptions.value = data.options;
    });
  }
  getUserLevelSelectList();

  const roleListOptions = ref([]);
  function getRoleSelectList() {
    roleSelectList().then(({ data }) => {
      roleListOptions.value = data.options;
    });
  }
  getRoleSelectList();

  const { userInfo } = useUserInfo();
  const structGradeOptions = ref([]);
  function getStructGradeList() {
    structGradeList({ parentStructGrade: userInfo.structLevel }).then(({ data }) => {
      structGradeOptions.value = data.options;
    });
  }
  getStructGradeList();

  /**
   * 过滤出来对应状态的数据并选中
   * @return void
   */
  const treeData = ref([]);
  let allData = [];
  function filterStatusNode(value) {
    // 如果显示禁用显示所有数据
    const newStructs = value ? allData : allData.filter((item) => item.status !== 2);
    const allTree = listToTree({
      list: newStructs,
      key: 'id',
      Pkey: 'pid',
      orderBy: 'order'
    });
    treeData.value = allTree;
  }
  /**
   * 获取部门数据
   * @return void
   */
  function getStructTreeApi() {
    getStructTree({}).then(({ data: { structs } }) => {
      const newStructs = structs.map((item) => {
        if (!item.pid) {
          item.pid = 0;
        }
        item.disabled = item.status === 2;
        return item;
      });
      allData = newStructs;
      filterStatusNode(false);
    });
  }
  getStructTreeApi();

  function searchData() {
    tableRef.value.searchData();
  }

  function resetSearchForm() {
    formData.value = { ...searchFormBase };
    nextTick(() => {
      tableRef.value.resetSearchForm();
    });
  }

  provide('subsystemOptions', subsystemOptions);
  provide('userLevelOptions', userLevelListOptions);
  provide('roleListOptions', roleListOptions);
  provide('structGradeOptions', structGradeOptions);

  return {
    formRef,
    formData,
    subsystemOptions,
    userLevelListOptions,
    roleListOptions,
    treeData,
    statusList,

    searchData,
    resetSearchForm
  };
}
