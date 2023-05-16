/*
 * @LastEditors: liu yang
 * @Description: ...
 * @Date: 2022-12-05 11:10:00
 * @LastEditTime: 2022-12-05 17:38:43
 * @Author: liu yang
 */
export const tableColumn = [
  {
    type: 'selection',
    width: 56,
    reserveSelection: true,
    fixed: 'left',
    label: '选择',
    disabled: true
  },
  {
    type: 'index',
    label: '序号',
    width: '70',
    fixed: 'left',
    disabled: true
  },
  {
    prop: 'workNo',
    label: '工号',
    width: '135'
  },
  {
    prop: 'uname',
    label: '姓名',
    width: '135'
  },
  {
    prop: 'strcutName',
    label: '部门'
  },
  {
    prop: 'accountStatus',
    label: '账号状态',
    width: '120'
  },
  {
    prop: 'operation',
    label: '操作',
    width: '220',
    fixed: 'right',
    disabled: true
  }
];

export const handleTableColumn = ({ bath = false, accountStatus = false }) => {
  return tableColumn.filter((item) => {
    if (item.type === 'selection') {
      return bath;
    }
    if (item.prop === 'accountStatus') {
      return accountStatus;
    }
    return true;
  });
};
