/*
 * @Author: liuYang
 * @description: 请填写描述信息
 * @Path:  引入路径
 * @Date: 2021-03-16 11:14:56
 * @LastEditors: liu yang
 * @LastEditTime: 2022-12-05 17:20:13
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
    prop: 'ssName',
    label: '子系统名称',
    id: 1
  },
  {
    prop: 'ssCode',
    label: '子系统编码',
    id: 2
  },
  {
    prop: 'returnUrl',
    label: '地址',
    id: 3,
    minWidth: '200px'
  },
  {
    prop: 'isEnabledSsl',
    label: '是否https',
    id: 4,
    formatter: (row) => {
      return row.isEnabledSsl ? '是' : '否';
    }
  },
  {
    prop: 'ssHost',
    label: '子系统host',
    id: 5
  },
  {
    prop: 'ssPort',
    label: '子系统端口',
    id: 6
  }
  // {
  //   prop: 'ssVersion',
  //   label: '子系统版本',
  //   id: 7
  // },
  // {
  //   prop: 'versionRemarks',
  //   label: '子系统版本说明',
  //   id: 8
  // },
  // {
  //   prop: 'secret',
  //   label: '子系统密钥',
  //   id: 9
  // }
];
