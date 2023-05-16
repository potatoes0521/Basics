<!--
 * @Author: liuYang
 * @description: 菜单注册管理
 * @Path:  引入路径
 * @Date: 2021-03-15 19:25:06
 * @LastEditors: liu yang
 * @LastEditTime: 2022-12-06 11:24:38
 * @MustParam:  必传参数
 * @OptionalParam:  选传参数
 * @EmitFunction:  函数
-->
<template>
  <div class="page-wrapper">
    <XResizePanel :left-min-width="300" :right-min-width="400">
      <template #left-panel>
        <GroupTree ref="groupTreeRef" @on-click-dep="onClickDep"></GroupTree>
      </template>
      <template #right-panel>
        <GroupDetail ref="groupDetailRef" @on-need-refresh-list="onNeedRefreshList"></GroupDetail>
      </template>
    </XResizePanel>
  </div>
</template>
<script></script>

<script setup>
  import GroupTree from './components/GroupTree/index.vue';
  import GroupDetail from './components/GroupDetail/index.vue';
  import XResizePanel from './resize-panel.vue';
  import useForm from './hooks/form.js';

  useForm();

  const groupDetailRef = ref(null);
  const onClickDep = (data, path) => {
    groupDetailRef.value.onDepChange(data, path);
  };

  const groupTreeRef = ref(null);
  const onNeedRefreshList = () => {
    groupTreeRef.value.onNeedRefreshList();
  };
</script>
<style lang="scss" scoped>
  .page-wrapper {
    height: 100%;
    background-color: #fff;
  }
</style>
