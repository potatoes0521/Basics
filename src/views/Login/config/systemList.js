/*
 * @Author: liuYang
 * @description: 请填写描述信息
 * @Path:  引入路径
 * @Date: 2021-03-16 10:54:15
 * @LastEditors: NiuNiu
 * @LastEditTime: 2021-12-23 10:41:02
 * @MustParam:  必传参数
 * @OptionalParam:  选传参数
 * @EmitFunction:  函数
 */

export const systemList = [
  {
    id: 1,
    icon: 'iconFill1',
    host: process.env.VUE_APP_HOT_LINE_HOST,
    text: '热线客服'
  },
  {
    id: 2,
    icon: 'el-icon-collection',
    host: process.env.VUE_APP_WIKI_HOST,
    text: '知识库'
  },
  {
    id: 3,
    icon: 'el-icon-tickets',
    host: process.env.VUE_APP_WO_HOST,
    text: '工单'
  },
  {
    id: 4,
    icon: 'el-icon-s-operation',
    host: process.env.VUE_APP_LK_HOST,
    text: '路况'
  },
  {
    id: 5,
    icon: 'el-icon-s-operation',
    host: process.env.VUE_APP_BI_HOST,
    text: '统计'
  },
  {
    id: 0,
    icon: 'iconFill2',
    // host: process.env.VUE_APP_CAS_HOST,
    host: '',
    text: '后台管理系统'
  }
]
