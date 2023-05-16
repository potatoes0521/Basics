<!--
 * @Author: liuYang
 * @Description: 请填写描述信息
 * @Path: 引入路径
 * @Date: 2021-03-29 19:03:55
 * @LastEditors: liu yang
 * @LastEditTime: 2023-04-17 14:34:21
 * @MustParam: 必传参数
 * @OptionalParam: 选传参数
 * @EmitFunction: 函数
 * @Slot/Props.children: 提供的插槽或render
 * @Examples: 使用示例
-->
<template>
  <div class="group-detail-component-wrapper">
    <div class="title-wrapper">
      <div class="title">{{ depName }}</div>
      <el-breadcrumb v-if="breadcrumbName && breadcrumbName.length > 1" class="breadcrumb" separator="/">
        <el-breadcrumb-item v-for="(item, index) in breadcrumbName" :key="index">
          {{ item }}
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <PersonTable
      ref="personTableRef"
      :form-data="formData"
      :button-group="['batch-move', 'batch-handle']"
      @on-need-refresh-list="onNeedRefreshList"
    ></PersonTable>
  </div>
</template>
<script setup>
  import { structDetails } from '@/api/modules/struct';
  import PersonTable from '../../../Personnel/components/PersonList/index.vue';

  const emit = defineEmits(['onNeedRefreshList']);

  defineExpose({
    onDepChange
  });

  const formData = ref({});
  const depName = ref('组织架构管理');
  const breadcrumbName = ref([]);
  const depData = ref({});
  const nextDep = ref(0);
  function onDepChange(data, path) {
    nextDep.value = data.children ? data.children.length : 0;
    formData.value = { ...data, structId: data.id };
    depName.value = path[path.length - 1].name;
    breadcrumbName.value = path.map((item) => item.name);
    getDepDetails(data.id);
    getDepUserList(data.id);
  }
  function onNeedRefreshList() {
    emit('onNeedRefreshList');
    getDepDetails();
  }
  async function getDepDetails() {
    const { data } = await structDetails({ ...formData.value });
    depData.value = { ...data };
  }

  const personTableRef = ref(null);
  function getDepUserList(id) {
    formData.value.structId = id;
    nextTick(() => {
      personTableRef.value.searchData();
    });
  }
</script>

<style scoped lang="scss">
  .group-detail-component-wrapper {
    flex: 1;
    overflow-y: auto;
    height: 100%;
    display: flex;
    flex-direction: column;
  }
  .title-wrapper {
    padding: 20px;

    .title {
      font-size: 16px;
      font-weight: 500;
      color: #222222;
      line-height: 22px;
    }

    .breadcrumb {
      margin-top: 10px;
    }
  }
</style>
