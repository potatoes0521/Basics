<!--
 * @Author: liuYang
 * @Description: 子系统设置编辑/添加
 * @Path:  引入路径
 * @Date: 2021-03-16 18:48:22
 * @LastEditors: liu yang
 * @LastEditTime: 2022-12-26 17:19:11
 * @MustParam:  必传参数
 * @OptionalParam:  选传参数
 * @EmitFunction:  函数
 * @slot/props.children: 提供的插槽或render
-->
<template>
  <div class="edit-panel-wrapper pages-router-edit">
    <XDrawer ref="drawer" destroy-on-close :title="openType === 'add' ? '新增子系统页面' : '编辑子系统页面'" @beforeClose="closeDialog">
      <template #main>
        <el-form ref="formRef" v-loading="loadingPage" :model="form" label-width="100px" label-position="left">
          <el-form-item label="所属子系统" prop="ssId">
            <el-select v-model="form.ssId" class="lang-input" placeholder="请选择">
              <el-option v-for="item in subsystemOptions" :key="item.ssId" :label="item.ssName" :value="item.ssId"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="别名" prop="pageName"> <el-input v-model.trim="form.pageName" placeholder="请输入"></el-input></el-form-item>
          <el-form-item label="路径" prop="pageUri"> <el-input v-model.trim="form.pageUri" placeholder="请输入"></el-input></el-form-item>
          <el-form-item label="类型" prop="pageType">
            <el-radio-group v-model="form.pageType">
              <el-radio :label="1">需绑定到菜单</el-radio>
              <el-radio :label="2">游离页面</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="描述" label-width="100%" prop="pageType"></el-form-item>
          <div class="input-style">
            <el-input v-model="form.remarks" type="textarea" :rows="5" placeholder="请填写描述..."></el-input>
          </div>
          <div class="button-style">
            <el-button type="primary" @click="addUnit"> 添加功能单元 </el-button>
            <el-button type="primary" @click="exportPage">导出页面配置</el-button>
            <el-button type="primary" @click="importPage">导入页面配置</el-button>
          </div>
          <div v-if="showExport" class="export-page-wrapper">{{ exportStr }}</div>
          <div v-if="showImport" class="import-page-wrapper">
            <el-input v-model="importStr" type="textarea" />
            <el-button style="margin-top: 10px; text-align: right" type="primary" plain @click="handleTransImport">生成</el-button>
          </div>
          <functional-unit ref="FunctionalUnitRef" v-model="form.funcUnits" :ssid="ssid"></functional-unit>
          <div class="form-button-wrapper">
            <el-button class="button" type="primary" :loading="loading" @click="submitForm"> 确定 </el-button>
            <el-button class="button" @click="closeDialog">取消</el-button>
          </div>
        </el-form>
      </template>
    </XDrawer>
  </div>
</template>
<script setup>
  import { XDrawer } from '@xiaoshi/xiaoshi-components';
  import { defineAsyncComponent, defineEmits, defineExpose } from 'vue';
  import { registerSubsystemPageFe, updateSubsystemPageFe, getSubsystemPageDetailsFe } from '@/api/modules/sub';
  import { subsystemList } from '@/api/modules/select.js';
  import { ElMessage } from 'element-plus';

  defineExpose({
    openDialog,
    closeDialog
  });
  const subsystemOptions = ref([]);
  function getSubsystemSelectList() {
    subsystemList()
      .then(({ data }) => {
        console.log(data, 'data');
        subsystemOptions.value = data.options;
      })
      .catch(() => {});
  }
  getSubsystemSelectList();

  const FunctionalUnit = defineAsyncComponent(() => import('./components/FunctionalUnit.vue'));

  const baseForm = {
    ssId: '',
    pageUri: '',
    pageName: '',
    pageType: 1,
    remarks: '',
    funcUnits: [],
    pagePerms: '',
    permissionList: []
  };
  const form = ref({ ...baseForm });

  const formRef = ref(null);
  const drawer = ref(null);
  const loading = ref(false);
  const openType = ref('add');
  const pageId = ref('');
  const showExport = ref(false);
  const showImport = ref(false);
  const exportStr = ref('');
  const importStr = ref('');

  const loadingPage = ref(false);
  const ssid = computed(() => form.value.ssId);
  const emit = defineEmits(['onNeedRefresh']);
  const FunctionalUnitRef = ref(null);
  function addUnit() {
    if (!form.value.ssId) {
      return ElMessage.error('请先选择子系统');
    }
    FunctionalUnitRef.value.addUnit();
  }
  function closeDialog() {
    showExport.value = false;
    showImport.value = false;
    exportStr.value = '';
    importStr.value = '';
    resetForm();
    drawer.value.closePanel();
  }

  function openDialog(type, formData = {}) {
    openType.value = type;
    form.value = { ...baseForm };
    if (type === 'edit') {
      handleEdit(formData);
    } else {
      drawer.value.openPanel();
    }
  }

  async function handleEdit(formData) {
    loadingPage.value = true;
    const { ssId, pageId: page } = formData;
    getSubsystemPageDetailsFe({ pageId: page }).then(({ data: detailsData }) => {
      console.log('🚀 > file: index.vue:135 > data handleEdit > detailsData', detailsData);
      pageId.value = page;
      let { pageUri, pageName, pageType, funcUnits, remarks } = detailsData;
      funcUnits = [
        ...funcUnits.map((v) => {
          if (v.perms) {
            v.perms = v.perms.split(',');
          } else {
            v.perms = [];
          }
          return v;
        })
      ];
      form.value = {
        ssId,
        pageUri,
        pageName,
        pageType,
        funcUnits,
        remarks
      };
      loadingPage.value = false;
      drawer.value.openPanel();
    });
  }

  function submitForm() {
    if (!form.value.ssId) {
      return ElMessage.error('请选择子系统');
    }
    if (!form.value.pageUri) {
      return ElMessage.error('请输入子系统页面路径');
    }
    if (!form.value.pageName) {
      return ElMessage.error('请输入子系统页面名称');
    }
    if (!form.value.pageType) {
      return ElMessage.error('请选择页面类型');
    }
    if (FunctionalUnitRef.value.ruleData()) {
      loading.value = true;
      let { ssId, pageUri, pageName, remarks, pageType } = JSON.parse(JSON.stringify(form.value));
      let funcUnits = FunctionalUnitRef.value.sourceData;
      console.log('🚀 > file: index.vue:154 > handleEdit > funcUnits', funcUnits);
      funcUnits = [
        ...funcUnits.map((v) => {
          v.perms = v.perms?.join() ?? '';
          return v;
        })
      ];
      if (openType.value === 'add') {
        onAddSubsystemMsg({
          ssId,
          pageUri,
          pageName,
          remarks,
          pageType,
          funcUnits
        });
      } else {
        onSubsystemMsgChange({
          ssId,
          pageUri,
          pageName,
          remarks,
          pageType,
          funcUnits,
          pageId: pageId.value
        });
      }
    }
  }

  function onSubsystemMsgChange(data) {
    updateSubsystemPageFe(data)
      .then(() => {
        emit('onNeedRefresh');
        ElMessage.success('编辑成功');
        loading.value = false;
        closeDialog();
      })
      .catch(() => {
        loading.value = false;
      });
  }
  function onAddSubsystemMsg(data) {
    registerSubsystemPageFe(data)
      .then(() => {
        emit('onNeedRefresh');
        ElMessage.success('添加成功');
        loading.value = false;
        closeDialog();
      })
      .catch(() => {
        loading.value = false;
      });
  }
  function resetForm() {
    form.value = { ...baseForm };
    pageId.value = '';
    loadingPage.value = false;
  }

  function exportPage() {
    const formD = JSON.parse(JSON.stringify(form.value));
    formD.funcUnits = formD.funcUnits.map((v) => {
      delete v.id;
      return {
        ...v
      };
    });
    exportStr.value = JSON.stringify(formD);
    showExport.value = true;
  }
  function importPage() {
    showImport.value = true;
  }
  function handleTransImport() {
    try {
      const importData = JSON.parse(importStr.value);
      importData.funcUnits = importData.funcUnits.map((v) => {
        const sameItem = form.value.funcUnits.find((i) => v.code === i.code) || {};
        if (sameItem.id) {
          v.id = sameItem.id;
        }
        return {
          ...v
        };
      });
      console.log(importData);
      FunctionalUnitRef.value.margeData(importData.funcUnits);
      form.value = { ...importData };
    } catch (error) {
      ElMessage.error('导入数据格式错误');
    }
  }
</script>
<style lang="scss">
  .pages-router-edit {
    .el-form-item {
      margin-bottom: 8px !important;
    }
    .el-form-item__label {
      font-weight: normal !important;
    }
    .el-textarea__inner {
      border-radius: 2px;
    }
  }
</style>
<style scoped lang="scss">
  .margin-bottom0 {
    margin: 0 !important;
  }
  .permission-list-wrapper {
    margin-left: 84px;
  }
  .form-button-wrapper {
    width: 100%;
    height: 60px;
    position: absolute;
    bottom: 0;
    left: 0;
    background-color: #fff;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    padding: 0 20px;
    box-sizing: border-box;
  }
  .input-style {
    margin-top: -10px;
  }
  .button-style {
    margin-top: 20px;
  }
  .export-page-wrapper,
  .import-page-wrapper {
    margin-top: 20px;
  }
</style>
