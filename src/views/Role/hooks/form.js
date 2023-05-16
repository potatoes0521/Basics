/*
 * @LastEditors: shenjilin
 * @Description: ...
 * @Date: 2022-12-04 15:46:45
 * @LastEditTime: 2023-04-21 18:36:42
 * @Author: liu yang
 */
import { getRoleList } from '@/api/modules/role';
import useBaseForm from '@/hooks/useBaseForm';

export default function useForm(tableOptions) {
  const searchFormBase = {
    roleName: '',
    role: ''
  };

  const baseForm = useBaseForm({
    baseForm: { ...searchFormBase },
    tableOptions,
    getTableData,
    Init: true
  });

  function getTableData(params) {
    tableOptions.tableConfig.loading = true;
    getRoleList({
      pageNum: tableOptions.paginationConfig.currentPage,
      pageSize: tableOptions.paginationConfig.pageSize,
      ...params,
      ...baseForm?.formData.value
    })
      .then(({ data }) => {
        tableOptions.tableData = data.rows.map((v, i) => ({ ...v, numId: i + 1 }));
        console.log('tableOptions.tableData: ', tableOptions.tableData);
        baseForm.onGetData(params, data);
      })
      .catch((err) => {
        console.log(err);
        tableOptions.tableConfig.loading = false;
      });
  }
  return {
    ...baseForm,
    getTableData
  };
}
