/*
 * @LastEditors: liu yang
 * @Description: ...
 * @Date: 2022-12-05 10:07:51
 * @LastEditTime: 2022-12-23 09:53:49
 * @Author: liu yang
 */
import { ref } from 'vue';
import { subsystemList, userLevelList, roleSelectList, structGradeList } from '@/api/modules/select.js';
import useUserInfo from '@/hooks/userInfo';

export default function useForm() {
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

  provide('subsystemOptions', subsystemOptions);
  provide('userLevelOptions', userLevelListOptions);
  provide('roleListOptions', roleListOptions);
  provide('structGradeOptions', structGradeOptions);

  return {
    subsystemOptions,
    userLevelListOptions,
    roleListOptions
  };
}
