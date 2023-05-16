<template>
  <div class="page-wrapper">
    <x-panel-container>
      <template #search>
        <x-search-form ref="formRef" v-model="formData" :hash-key="userPageHash" @submit.prevent @keyup.enter="submitForm('form')">
          <x-search-form-item label="页面URI：" prop="pageUri" :collapse-show="true">
            <el-input v-model="formData.pageUri" placeholder="请输入" clearable></el-input>
          </x-search-form-item>
          <x-search-form-item label="子系统：" prop="ssId" :collapse-show="true">
            <el-select v-model="formData.ssId" placeholder="请选择" clearable>
              <el-option v-for="item in subsystemOptions" :key="item.ssId" :label="item.ssName" :value="item.ssId"></el-option>
            </el-select>
          </x-search-form-item>
          <x-search-form-item :collapse-show="true" :size="2">
            <el-button type="primary" @click="searchData(form)"> 搜索 </el-button>
            <el-button @click="resetSearchForm">重置</el-button>
          </x-search-form-item>
        </x-search-form>
      </template>
      <template #content>
        <XCustomTable v-bind="tableOptions">
          <template #controlLeft>
            <el-button v-auth:add="$route" type="primary" @click="onAddPage">新增</el-button>
          </template>
          <template #operation="{ row }">
            <el-button v-auth:edit="$route" type="primary" link @click="handleEdit(row)">编辑</el-button>
            <el-button v-auth:info="$route" type="primary" link @click="openDetails(row)">详情</el-button>
            <el-button v-auth:delete="$route" type="primary" link @click="deleteSubPage(row)">注销</el-button>
          </template>
        </XCustomTable>
      </template>
    </x-panel-container>
    <EditPanel ref="editPanelRef" @on-need-refresh="onEditData"></EditPanel>
    <DetailsDialog ref="detailsDialogRef"></DetailsDialog>
  </div>
</template>
<script setup name="Pages">
  import useBaseForm from '@/hooks/useBaseForm';
  import XCustomTable from '@/components/XCustomTable/index.vue';
  import useUserInfo from '@/hooks/userInfo';
  import { tableColumn } from './config/tableColumn';
  import EditPanel from './components/EditPanel/index.vue';
  import DetailsDialog from './components/DetailsDialog/index.vue';
  import { getSubsystemPageListFe, deleteSubsystemPageFe } from '@/api/modules/sub.js';
  import { subsystemList } from '@/api/modules/select.js';
  import { ElMessageBox } from 'element-plus';

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
    pageUri: '',
    ssId: ''
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
    getSubsystemPageListFe({
      pageNum: tableOptions.paginationConfig.currentPage,
      pageSize: tableOptions.paginationConfig.pageSize,
      ...formData.value
    }).then(({ data }) => {
      tableOptions.tableData = data.rows;
      onGetData({}, data);
    });
  }

  const subsystemOptions = ref([]);
  function getSubsystemSelectList() {
    subsystemList()
      .then(({ data }) => {
        console.log('🚀 > file: index.vue:130 > .then > data', data);
        subsystemOptions.value = data.options;
      })
      .catch(() => {});
  }
  getSubsystemSelectList();

  const editPanelRef = ref(null);
  function handleEdit(row) {
    editPanelRef.value.openDialog('edit', row);
  }

  function onAddPage() {
    editPanelRef.value.openDialog('add');
  }

  const detailsDialogRef = ref(null);
  function openDetails(rowData) {
    detailsDialogRef.value.openDialog(rowData);
  }

  function onEditData() {
    getTableData();
  }

  function deleteSubPage({ pageId }) {
    ElMessageBox.confirm('注销当前页面会影响所有引用该页面的菜单，请谨慎操作！', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
      .then(() => {
        deleteSubsystemPageFe({ pageId }).then(() => {
          ElMessageBox.alert('删除成功', '提示', {
            confirmButtonText: '确定',
            type: 'success'
          });
          getTableData();
        });
      })
      .catch(() => {});
  }
</script>
<style scoped lang="scss"></style>
