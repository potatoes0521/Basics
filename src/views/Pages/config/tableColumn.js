/*
 * @Author: liuYang
 * @description: 请填写描述信息
 * @Path:  引入路径
 * @Date: 2021-03-16 11:14:56
 * @LastEditors: liu yang
 * @LastEditTime: 2022-12-05 17:20:00
 * @MustParam:  必传参数
 * @OptionalParam:  选传参数
 * @EmitFunction:  函数
 */
export const tableColumn = [
  {
    type: 'index',
    label: '序号',
    width: '70',
    fixed: 'left',
    disabled: true
  },
  {
    prop: 'pageName',
    label: '页面名称'
  },
  {
    prop: 'pageUri',
    label: '页面URI'
  },
  {
    prop: 'pageType',
    label: '页面类型',
    formatter: (row) => {
      return +row.pageType === 1 ? '绑定到菜单' : '游离页面';
    }
  },
  {
    prop: 'gmtCreate',
    label: '创建时间'
  },
  {
    prop: 'gmtModified',
    label: '修改时间'
  },
  {
    prop: 'operation',
    label: '操作',
    width: '170',
    fixed: 'right',
    disabled: true
  }
];
