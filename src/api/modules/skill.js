/*
 * @Author: liuYang
 * @Description: 技能组相关接口
 * @Path: 引入路径
 * @Date: 2021-10-18 10:21:53
 * @LastEditors: liu yang
 * @LastEditTime: 2023-04-13 11:03:29
 * @MustParam: 必传参数
 * @OptionalParam: 选传参数
 * @EmitFunction: 函数
 * @Slot/Props.children: 提供的插槽或render
 * @Examples: 使用示例
 */
import { request } from '../request';

// 接口  --------------------------------------------------------------------------
/**
 * 添加技能
 * @param {Object} data 参数描述
 * @return void
 */
export const addSkill = (data) => {
  return request({
    url: '/cas/sk-group/add-sk-group',
    method: 'post',
    data
  });
};

/**
 * 编辑技能
 * @param {Object} data 参数描述
 * @return void
 */
export const editSkill = (data) => {
  return request({
    url: '/cas/sk-group/ed-sk-group',
    method: 'post',
    data
  });
};

/**
 * 按照条件检索技能组
 * @param {Object} data 参数描述
 * @return void
 */
export const getSkillList = (data) => {
  return request({
    url: '/cas/sk-group/sk-group-list',
    method: 'post',
    data
  });
};

/**
 * 获取技能详情
 * @param {Object} data 参数描述
 * @return void
 */
export const getSkillDetails = (data) => {
  return request({
    url: '/cas/sk-group/sk-group-info',
    method: 'post',
    data
  });
};

/**
 * 删除技能
 * @param {Object} data 参数描述
 * @return void
 */
export const deleteSkill = (data) => {
  return request({
    url: '/cas/sk-group/del-sk-group',
    method: 'post',
    data
  });
};

/**
 * @Author: liu yang
 * @Date: 2021-10-18 14:23:48
 * @description: 查询指定技能已选人员
 * @param {Object}
 * @return {*}
 */
export const searchSkillPeople = (data) => {
  return request({
    url: '/cas/sk-group/sk-user',
    method: 'post',
    data
  });
};

/**
 * @Author: liu yang
 * @Date: 2021-10-18 14:39:45
 * @description: 给技能绑定用户
 * @param {*}
 * @return {*}
 */
export const skillBindUser = (data) => {
  return request({
    url: '/cas/sk-group/sk-bind-user',
    method: 'post',
    data
  });
};

/**
 * @Author: liu yang
 * @Date: 2021-10-18 16:26:24
 * @description: 切换技能组状态
 * @param {*}
 * @return {*}
 */
export const changeSkillStatus = (data) => {
  return request({
    url: '/cas/sk-group/sk-group-change',
    method: 'post',
    data
  });
};
/**
 * @Author: liu yang
 * @Date: 2021-10-18 16:26:20
 * @description: 获取全部技能组
 * @param {*}
 * @return {*}
 */
export const getAllSkillList = (data) => {
  return request({
    url: '/cas/sk-group/all-sk-group',
    method: 'post',
    data
  });
};
/**
 * @Author: liu yang
 * @Date: 2021-10-18 16:26:17
 * @description: 给人绑定技能组
 * @param {*}
 * @return {*}
 */
export const bindSkillGroup = (data) => {
  return request({
    url: '/cas/sk-group/bind-sk-group',
    method: 'post',
    data
  });
};

export const searchPeopleSkill = (data) => {
  return request({
    url: '/cas/sk-group/sks',
    method: 'post',
    data
  });
};
/**
 * @Author: shenjilin
 * @Date: 2022-09-06 19:11:51
 * @description: 12技能组绑定坐席明细(授权)
 * @param {*} data
 * @return {*}
 */
export const skSeatslist = (data) => {
  return request({
    url: '/cas/sk-group/sk-seatslist',
    method: 'post',
    data
  });
};
/**
 * @Author: shenjilin
 * @Date: 2022-09-06 19:12:01
 * @description: 13技能组分配用户(授权)
 * @param {*} data
 * @return {*}
 */
export const skDistribute = (data) => {
  return request({
    url: '/cas/sk-group/sk-distribute',
    method: 'post',
    data
  });
};
/**
 * @Author: shenjilin
 * @Date: 2022-09-06 19:12:13
 * @description: 14用户绑定技能组(授权)
 * @param {*} data
 * @return {*}
 */
export const userBindSkg = (data) => {
  return request({
    url: '/cas/sk-group/user-bind-skg',
    method: 'post',
    data
  });
};
