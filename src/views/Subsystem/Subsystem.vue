<template>
  <div class="page-wrapper">
    <x-panel-container>
      <template #search>
        <x-search-form ref="formRef" v-model="formData" :hash-key="userPageHash" @submit.prevent @keyup.enter="submitForm('form')">
          <x-search-form-item label="系统名称：" prop="ssName" :collapse-show="true">
            <el-input v-model.trim="formData.ssName" placeholder="请输入" clearable></el-input>
          </x-search-form-item>
          <x-search-form-item label="子系统状态：" prop="ssStatus" :collapse-show="true">
            <el-select v-model="formData.ssStatus" placeholder="请选择" clearable>
              <el-option v-for="item in statusList" :key="item.id" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </x-search-form-item>
          <x-search-form-item :collapse-show="true" :size="2">
            <el-button type="primary" @click="searchData(form)"> 搜索 </el-button>
            <el-button @click="resetSearchForm">重置</el-button>
          </x-search-form-item>
        </x-search-form>
      </template>
      <template #content>
        <XCustomTable v-bind="tableOptions"> </XCustomTable>
      </template>
    </x-panel-container>
  </div>
</template>
<script setup name="Subsystem">
  import { defineComponent } from 'vue';
  import { statusList } from './config/statusList';
  import useBaseForm from '@/hooks/useBaseForm';
  import { getSubsystemList } from '@/api/modules/sub';
  import XCustomTable from '@/components/XCustomTable/index.vue';
  import useUserInfo from '@/hooks/userInfo';
  import { tableColumn } from './config/tableColumn';

  defineComponent({
    name: 'Subsystem'
  });

  const { userPageHash } = useUserInfo();

  const tableOptions = reactive({
    // 表格基础配置
    tableConfig: {
      key: userPageHash.value,
      loading: false,
      border: true
    },
    // 表格数据配置
    tableData: [],
    // 表格扩展配置
    tableExtend: {
      columnSetting: true,
      refresh: true,
      density: true,
      pagination: true,
      export: true
    },
    // 导出配置
    exportConfig: {
      // 排除列
      excludeColumn: ['operation']
    },
    // 刷新数据配置
    refreshConfig: {
      onRefresh() {
        console.log('点击了刷新按钮');
        getTableData();
      }
    },
    // 表格列配置
    columnConfig: [...tableColumn],
    // 表格页码配置
    paginationConfig: {
      currentPage: 1,
      pageSize: 10,
      total: 0,
      onCurrentChange(v) {
        tableOptions.paginationConfig.currentPage = v;
        getTableData();
      },
      onSizeChange(v) {
        tableOptions.paginationConfig.pageSize = v;
        getTableData();
      }
    }
  });

  const searchFormBase = {
    ssName: '',
    ssStatus: ''
  };

  const { searchData, resetSearchForm, onGetData, formData, formRef } = useBaseForm({
    baseForm: {
      ...searchFormBase
    },
    tableOptions,
    getTableData,
    Init: true
  });

  function getTableData() {
    tableOptions.tableConfig.loading = true;
    const params = {
      pageNum: tableOptions.paginationConfig.currentPage,
      pageSize: tableOptions.paginationConfig.pageSize,
      ...formData.value
    };
    getSubsystemList(params).then(({ data }) => {
      tableOptions.tableData = data.rows;
      onGetData({}, data);
    });
  }
</script>
<style scoped lang="scss"></style>
