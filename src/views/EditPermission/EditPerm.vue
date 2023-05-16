<template>
  <div class="page-wrapper">
    <CreateForm v-if="editType !== 'dis'" v-loading="pageLoading || !permTreeLoading" />
    <PermList
      v-model:loading="rolePermListLoading"
      v-model:pageLoading="pageLoading"
      v-loading="pageLoading || !permTreeLoading"
      :perm-tree-loading="permTreeLoading"
    />
    <div v-loading="pageLoading" class="perm-check-wrapper">
      <div class="perm-tree-wrapper">
        <PermTree v-model:loading="permTreeLoading" />
      </div>
      <div class="check-list-wrapper">
        <CheckedList v-loading="!permTreeLoading" />
      </div>
    </div>
    <div class="button-group">
      <el-button type="primary" :loading="pageLoading" @click="onSubmit">提交</el-button>
    </div>
  </div>
</template>
<script setup>
  import CreateForm from './components/CreateForm/index.vue';
  import PermList from './components/PermList/index.vue';
  import PermTree from './components/PermTree/index.vue';
  import CheckedList from './components/CheckedList/index.vue';
  import useForm from './hooks/form';
  import useEventBus from '@/hooks/useEventBus';
  import useSubmit from './hooks/submit';

  const { eventBus } = useEventBus();
  const { permTreeLoading, rolePermListLoading, checkedList } = useForm(eventBus);

  const { onSubmit, pageLoading, editType } = useSubmit(eventBus, checkedList);
</script>
<style scoped lang="scss">
  .page-wrapper {
    display: flex;
    flex-direction: column;
    height: 100%;
    background-color: #fff;
    padding-top: 20px;
    .perm-check-wrapper {
      display: flex;
      flex: 1;
      justify-content: space-between;
      padding: 20px;
      padding-top: 0px;
      box-sizing: border-box;
      .perm-tree-wrapper {
        width: 49.5%;
      }
      .check-list-wrapper {
        width: 49.5%;
      }
    }
    .button-group {
      padding: 20px;
      padding-top: 0;
    }
  }
</style>
