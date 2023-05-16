<!--
 * @Author: liuYang
 * @description: 菜单注册管理
 * @Path:  引入路径
 * @Date: 2021-03-15 19:25:06
 * @LastEditors: liu yang
 * @LastEditTime: 2023-04-17 11:50:50
 * @MustParam:  必传参数
 * @OptionalParam:  选传参数
 * @EmitFunction:  函数
-->
<template>
  <div class="page-wrapper menus-page">
    <el-tabs v-model="value">
      <el-tab-pane v-for="(item, index) in subsystemOptions" :key="item.ssId" :label="item.ssName" :name="`index${index}`" lazy>
        <TabPane :ref="'tabPane' + item.ssId" :subsystem-data="item" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script setup name="Menus">
  import TabPane from './components/TabPane/index.vue';
  import { subsystemList } from '@/api/modules/select.js';
  import { provide } from 'vue';
  import { ElTabPane, ElTabs } from 'element-plus';

  const value = ref('index0');
  const subsystemOptions = ref([]);

  provide('subsystemList', subsystemOptions);

  function getSubsystemSelectList() {
    subsystemList()
      .then(({ data }) => {
        console.log('🚀 > file: index.vue:130 > .then > data', data);
        subsystemOptions.value = data.options;
        console.log('🚀 > file: index.vue:37 > .then > subsystemOptions', subsystemOptions);
      })
      .catch(() => {});
  }
  getSubsystemSelectList();
</script>
<style lang="scss" scoped>
  .menus-page {
    position: relative;
    background-color: #fff;
    border-radius: 4px;
    padding: 20px;
    overflow: auto;
  }
</style>
