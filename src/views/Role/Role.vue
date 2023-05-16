<!--
 * @Author: liuYang
 * @description: 角色管理
 * @Path:  引入路径
 * @Date: 2021-03-15 19:25:06
 * @LastEditors: liu yang
 * @LastEditTime: 2023-05-16 10:20:27
 * @MustParam:  必传参数
 * @OptionalParam:  选传参数
 * @EmitFunction:  函数
-->
<template>
  <div class="page-wrapper">
    <x-panel-container>
      <template #search>
        <x-search-form ref="formRef" v-model="formData" :hash-key="userPageHash">
          <x-search-form-item label="角色名称：" prop="roleName" :collapse-show="true">
            <el-input v-model="formData.roleName" placeholder="请输入" clearable></el-input>
          </x-search-form-item>
          <x-search-form-item label="角色英文名：" prop="role" :collapse-show="true">
            <el-input v-model="formData.role" placeholder="请输入" clearable></el-input>
          </x-search-form-item>
          <x-search-form-item :collapse-show="true" :size="1">
            <el-button class="button" type="primary" @click="searchData">搜索</el-button>
            <el-button class="button" @click="resetSearchForm">重置</el-button>
          </x-search-form-item>
        </x-search-form>
      </template>
      <template #content>
        <XCustomTable v-bind="tableOptions">
          <template #controlLeft>
            <el-button v-auth:add="$route" type="primary" @click="addRole"> 添加角色 </el-button>
            <el-button v-auth:allotRole="$route" type="primary" @click="handleDisPermGroup"> 批量分配角色 </el-button>
          </template>
          <template #operation="{ row }">
            <el-button v-auth:edit="$route" link type="primary" @click="handleEdit(row)"> 编辑 </el-button>
            <el-button v-auth:delete="$route" link type="primary" @click="handleDelete(row)"> 删除 </el-button>
          </template>
        </XCustomTable>
      </template>
    </x-panel-container>
    <div class="dialog-comp-wrapper">
      <el-dialog v-model="customTreeDialogShow" title="批量分配角色" width="70%" destroy-on-close align-center>
        <div class="comp-dialog-wrapper">
          <div class="">
            <Organization ref="organizationRef" v-model:checkList="checkList" />
          </div>
          <div class="role-title">选择角色</div>
          <el-checkbox-group v-model="roles">
            <el-checkbox v-for="v in roleList" :key="v.roleId" :label="v.roleId">{{ v.roleName }}</el-checkbox>
          </el-checkbox-group>
          <div class="dialog-footer">
            <el-button type="primary" @click="onRole(false)">追加</el-button>
            <el-button type="primary" @click="onRole(true)">覆盖</el-button>
          </div>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script></script>
<script setup>
  import { reactive } from 'vue';
  import { useRouter } from 'vue-router';
  import { ElMessage, ElMessageBox } from 'element-plus';
  // import XCustomTable from '@/components/XCustomTable/index.vue';
  import useUserInfo from '@/hooks/userInfo';
  import useForm from './hooks/form';
  import useOperation from './hooks/operation';
  import { tableColumn } from './config/tableColumn';
  import { deleteRole } from '@/api/modules/role';
  import Organization from '@/components/Organization/index.vue';

  const { userPageHash } = useUserInfo();
  const tableOptions = reactive({
    // 表格基础配置
    tableConfig: {
      key: userPageHash.value,
      loading: false,
      border: true,
      onHeaderDragend(n, o, col, e) {
        console.log(n, o, col, e);
      }
    },
    // 表格数据配置
    tableData: [],
    // 表格扩展配置
    tableExtend: {
      columnSetting: false,
      refresh: true,
      density: false,
      pagination: true,
      export: false
    },
    // 刷新数据配置
    refreshConfig: {
      onRefresh() {
        getTableData();
      }
    },
    // 导出配置
    exportConfig: {
      // 选择字段
      fieldShow: true,
      // 文件类型
      fileTypeShow: true,
      // 排除列
      excludeColumn: ['operation']
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
        tableOptions.paginationConfig.currentPage = 1;
        tableOptions.paginationConfig.pageSize = v;
        getTableData();
      }
    }
  });
  const { getTableData, formData, resetSearchForm, searchData } = useForm(tableOptions);
  const router = useRouter();
  const addRole = () => {
    router.push({
      path: '/editperm',
      query: {
        pageType: 'add_role'
      }
    });
  };
  const handleEdit = (rowData) => {
    router.push({
      path: '/editperm',
      query: {
        pageType: 'edit_role',
        id: rowData.roleId
      }
    });
  };
  const handleDelete = ({ roleId }) => {
    ElMessageBox.confirm('该操作会影响所有拥有该角色的用户权限，请谨慎操作！', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
      .then(() => {
        if (!roleId) {
          ElMessage.error('删除失败');
          return;
        }
        deleteRole({ roleId }).then(() => {
          ElMessage.success('删除成功');
          getTableData();
        });
      })
      .catch(() => {});
  };
  const { checkList, customTreeDialogShow, handleDisPermGroup, roleList, roles, onRole } = useOperation();
  // const allotRole = (rowData) => {
  //   router.push({
  //     path: '/editperm',
  //     query: {
  //       pageType: 'dis_u_role',
  //       id: rowData.roleId
  //     }
  //   });
  // };
</script>
<style lang="scss" scoped>
  .role-title {
    padding: 20px 0;
  }
  .dialog-comp-wrapper {
    :deep(.el-dialog__body) {
      padding: 10px 24px 5px;
    }
    .comp-dialog-wrapper {
      .dialog-footer {
        width: 100%;
        display: flex;
        justify-content: flex-end;
        padding: 24px 0;
      }
    }
  }
</style>
