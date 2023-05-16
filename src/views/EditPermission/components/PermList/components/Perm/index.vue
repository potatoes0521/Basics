<!--
 * @Author: liuYang
 * @Description: 请填写描述信息
 * @Path: 引入路径
 * @Date: 2021-04-01 14:03:11
 * @LastEditors: liu yang
 * @LastEditTime: 2022-12-04 16:54:09
 * @MustParam: 必传参数
 * @OptionalParam: 选传参数
 * @EmitFunction: 函数
 * @Slot/Props.children: 提供的插槽或render
 * @Examples: 使用示例
-->
<template>
  <div class="perm-component-wrapper">
    <div class="title">已有{{ name }}</div>
    <div class="perm-list">
      <div v-for="item in permList" :key="item.id" class="perm-list-item">
        <el-checkbox :model-value="item.checked" @change="onClickCheckbox(item)">
          {{ item[nameKey] }}
        </el-checkbox>
      </div>
    </div>
  </div>
</template>
<script setup>
  import { defineProps, inject } from 'vue';

  const eventBus = inject('eventBus');

  const props = defineProps({
    name: {
      type: String,
      required: true,
      default: ''
    },
    permList: {
      type: Array,
      required: true,
      default: () => []
    },
    nameKey: {
      type: String,
      required: true,
      default: ''
    },
    idKey: {
      type: String,
      required: true,
      default: ''
    }
  });

  /**
   * @Author: liu yang
   * @Date: 2022-07-15 10:02:43
   * @description: 处理点击事件
   * @param {*} data
   * @return {*}
   */
  function onClickCheckbox(data) {
    data.checked = !data.checked;
    if (data.checked) {
      // 选中了一个角色
      eventBus.emit('addPerm', data, props.nameKey);
    } else {
      // 取消选中了一个角色
      const permList = props.permList.filter((i) => i.checked) || [];
      eventBus.emit('removePerm', { data, permList });
    }
  }

  /**
   * @Author: liu yang
   * @Date: 2022-07-15 09:59:08
   * @description: 取消一个组别的权限
   * @return {*}
   */
  eventBus.on('cancelPermList', (diffIdList) => {
    for (let i = 0; i < props.permList.length; i++) {
      const item = props.permList[i];
      if (item.checked) {
        const has = (item.funcUnitIds?.split(',') ?? []).map((j) => +j).some((v) => diffIdList.includes(v));
        if (has) {
          item.checked = false;
        }
      }
    }
  });
</script>
<style scoped lang="scss">
  @import '@/styles/mixin.scss';

  .perm-component-wrapper {
    box-sizing: border-box;
    flex: 1;
    display: flex;
    flex-direction: column;

    .title {
      font-size: 14px;
      font-weight: 500;
      color: #333333;
      line-height: 20px;
      margin-bottom: 15px;
    }

    .perm-list {
      flex: 1;
      box-sizing: border-box;
      border: 1px solid #d9d9d9;
      padding: 10px 0 0 20px;
      display: flex;
      border-radius: 4px;
      min-height: 62px;
      box-sizing: border-box;
      flex-wrap: wrap;
      @include selfScrollBar(rgba(153, 153, 153, 0.59));
    }

    .perm-list-item {
      font-size: 14px;
      font-weight: 400;
      color: #222d3e;
      line-height: 20px;
      padding-right: 27px;
      margin-bottom: 10px;
      display: flex;
      align-items: center;
    }
  }
  .perm-list-component-wrapper + .perm-list-component-wrapper {
    margin-left: 20px;
  }
</style>
