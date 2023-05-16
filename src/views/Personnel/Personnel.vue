<template>
  <div class="page-wrapper">
    <x-panel-container>
      <template #search>
        <x-search-form ref="formRef" v-model="formData" :hash-key="userPageHash">
          <x-search-form-item label="用户名：" prop="username" :collapse-show="true">
            <el-input v-model="formData.username" placeholder="请输入" clearable></el-input>
          </x-search-form-item>
          <x-search-form-item label="工号：" prop="workNo" :collapse-show="true">
            <el-input v-model="formData.workNo" placeholder="请输入" clearable></el-input>
          </x-search-form-item>
          <x-search-form-item label="人员姓名：" prop="uname" :collapse-show="true">
            <el-input v-model="formData.uname" placeholder="请输入" clearable></el-input>
          </x-search-form-item>
          <x-search-form-item label="账号状态：" prop="accountStatus" :collapse-show="true">
            <el-select v-model="formData.accountStatus" class="short-input98" clearable placeholder="请选择">
              <el-option v-for="item in statusList" :key="item.id" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </x-search-form-item>
          <x-search-form-item label="用户等级：" prop="userLevel" :collapse-show="true">
            <el-select v-model="formData.userLevel" placeholder="请选择" clearable>
              <el-option v-for="item in userLevelListOptions" :key="item.userLevelCode" :label="item.userLevelName" :value="item.userLevelCode"></el-option>
            </el-select>
          </x-search-form-item>
          <x-search-form-item label="子系统：" prop="ssId" :collapse-show="true">
            <el-select v-model="formData.ssId" placeholder="请选择" clearable>
              <el-option v-for="item in subsystemOptions" :key="item.ssId" :label="item.ssName" :value="item.ssId"></el-option>
            </el-select>
          </x-search-form-item>
          <x-search-form-item label="角色：" prop="ssId" :collapse-show="true">
            <el-select v-model="formData.roleId" placeholder="请选择" clearable>
              <el-option v-for="item in roleListOptions" :key="item.id" :label="item.roleName" :value="item.roleId"></el-option>
            </el-select>
          </x-search-form-item>
          <x-search-form-item label="部门：" prop="structId" :collapse-show="true">
            <el-cascader
              v-model="formData.structId"
              :options="treeData"
              size="default"
              :show-all-levels="false"
              :props="{
                emitPath: false,
                checkStrictly: true,
                value: 'id',
                label: 'name',
                children: 'children',
                disabled: 'disabled'
              }"
              clearable
              placeholder="请选择部门"
            ></el-cascader>
          </x-search-form-item>
          <x-search-form-item :collapse-show="true" :size="1">
            <el-button class="button" type="primary" @click="searchData">搜索</el-button>
            <el-button class="button" @click="resetSearchForm">重置</el-button>
          </x-search-form-item>
        </x-search-form>
      </template>
      <template #content>
        <PersonTable ref="tableRef" :button-group="buttonGroup" :form-data="formData" />
      </template>
    </x-panel-container>
  </div>
</template>
<script setup>
  import PersonTable from './components/PersonList/index.vue';
  import useForm from './hooks/form';
  import useUserInfo from '@/hooks/userInfo';
  import useAuth from '@/hooks/useAuth';

  const { auth } = useAuth();
  const { userPageHash } = useUserInfo();
  const tableRef = ref(null);
  const { formRef, formData, statusList, subsystemOptions, userLevelListOptions, roleListOptions, treeData, searchData, resetSearchForm } = useForm(tableRef);

  const buttonGroup = computed(() => {
    const hasAdd = auth('userAdd', 'personnel');
    let btnGroup = [];
    if (hasAdd) {
      btnGroup.push('add');
    }
    const hasImport = auth('importUser', 'personnel');
    if (hasImport) {
      btnGroup.push('import-user');
    }
    const hasExport = auth('exportUser', 'personnel');
    if (hasExport) {
      btnGroup.push('export-user');
    }
    return btnGroup;
  });
</script>
<style scoped lang="scss"></style>
