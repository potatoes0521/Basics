/*
 * @Author: liuYang
 * @Description: 请填写描述信息
 * @Path: 引入路径
 * @Date: 2021-03-17 16:19:49
 * @LastEditors: liu yang
 * @LastEditTime: 2022-12-05 17:21:00
 * @MustParam: 必传参数
 * @OptionalParam: 选传参数
 * @EmitFunction: 函数
 * @Slot/Props.children: 提供的插槽或render
 * @Examples: 使用示例
 */
export const tableColumn = [
  {
    prop: 'numId',
    label: '编号',
    width: '70',
    id: 0
  },
  {
    prop: 'roleName',
    label: '角色中文名',
    id: 2
  },
  {
    prop: 'role',
    label: '角色英文名',
    id: 3
  },
  {
    prop: 'remarks',
    label: '备注',
    id: 4
  },
  {
    prop: 'gmtModified',
    label: '修改时间',
    id: 5
  },
  {
    prop: 'gmtCreate',
    label: '创建时间',
    id: 6
  },
  {
    prop: 'operation',
    label: '操作',
    id: 7,
    disabled: true
  }
];
