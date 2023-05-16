/*
 * @LastEditors: liu yang
 * @Description: 表格展示基础表单操作
 * @Date: 2022-01-17 14:21:51
 * @LastEditTime: 2022-12-27 11:55:57
 * @Author: liu yang
 */
import { ref, onMounted } from 'vue';

export default function useBaseForm({ baseForm, tableOptions, getTableData, Init = true }) {
  const formRef = ref(null);
  const formData = ref({ ...baseForm });

  /**
   * @Author: liu yang
   * @Date: 2022-01-17 14:35:36
   * @description: 重置
   * @param {*}
   * @return {*}
   */
  const resetSearchForm = () => {
    formData.value = { ...baseForm };
    tableOptions.paginationConfig.currentPage = 1;
    getTableData({ ...formData.value });
  };

  const openSearchQuery = () => {
    formRef.value.openSearchQuery();
  };

  /**
   * @Author: liu yang
   * @Date: 2022-01-17 14:35:57
   * @description: 搜索
   * @param {*}
   * @return {*}
   */
  const searchData = async () => {
    tableOptions.paginationConfig.currentPage = 1;
    getTableData({ ...formData.value });
  };

  /**
   * @Author: liu yang
   * @Date: 2022-01-17 14:55:32
   * @description: 获取数据后缓存和关闭loading
   * @param {*}
   * @return {*}
   */
  const onGetData = (params, res) => {
    tableOptions.paginationConfig.total = res.totalNum;
    tableOptions.tableConfig.loading = false;
  };

  /**
   * @Author: liu yang
   * @Date: 2022-01-17 14:36:09
   * @description: 初始化页面
   * @param {*}
   * @return {*}
   */
  const init = async () => {
    await getTableData({ ...formData.value });
  };

  onMounted(() => {
    Init && init();
  });
  return {
    searchData,
    openSearchQuery,
    resetSearchForm,
    onGetData,
    formData,
    formRef
  };
}
