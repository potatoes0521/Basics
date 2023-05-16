<!--
 * @Author: liuYang
 * @Description: 请填写描述信息
 * @Path: 引入路径
 * @Date: 2021-03-18 16:24:48
 * @LastEditors: liu yang
 * @LastEditTime: 2022-12-05 18:02:15
 * @MustParam: 必传参数
 * @OptionalParam: 选传参数
 * @EmitFunction: 函数
 * @Slot/Props.children: 提供的插槽或render
 * @Examples: 使用示例
-->
<template>
  <div class="button-components-group">
    <div class="left-group">
      <el-button v-if="showAdd" type="primary" @click="addPersonnel"> 添加人员 </el-button>
      <el-button v-if="showPeopleChangeDep" v-auth:batchMove="$route" type="primary" @click="handleShowChangeDepDialog">
        批量移动部门
        <span v-if="selectPeopleNum">({{ selectPeopleNum }})</span>
      </el-button>
      <el-button v-if="showPeopleExport" v-auth:exportUser="$route" type="primary" @click="onBtnClick('export-user')"> 批量导出 </el-button>
      <el-button v-if="showPeopleImport" v-auth:importUser="$route" type="primary" @click="onBtnClick('import-user')">
        导入
        <span class=""></span>
      </el-button>
    </div>
    <div class="right-group"></div>
  </div>
  <el-dialog v-model="showPeopleChangeDepDialog" title="移动部门">
    <el-form :model="changeDepForm" :rules="changeDepFormRules" label-width="120px">
      <el-form-item label="目标部门" prop="structId">
        <el-cascader
          v-model="changeDepForm.structId"
          placeholder="请选择部门"
          clearable
          size="default"
          filterable
          :options="strcutTree"
          :props="{ expandTrigger: 'click', checkStrictly: true, value: 'id', label: 'name' }"
        >
        </el-cascader>
      </el-form-item>
      <el-form-item label="禁用用户" prop="disableUser">
        <el-radio-group v-model="changeDepForm.disableUser">
          <el-radio :label="false">否</el-radio>
          <el-radio :label="true">是</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="解除负责人身份" prop="disablePrincipal">
        <el-radio-group v-model="changeDepForm.disablePrincipal">
          <el-radio :label="false">否</el-radio>
          <el-radio :label="true">是</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="closeChangeDep">取 消</el-button>
      <el-button type="primary" :loading="showBathFormLoading" @click="submitChangeDep"> 确 定 </el-button>
    </template>
  </el-dialog>
  <input v-show="false" ref="importButtonRef" class="importButton" type="file" @change="uploadFn($event)" />
</template>
<script setup>
  import { computed, defineProps } from 'vue';
  import useChangeDep from './modules/changeDep';
  import { exportUser, importUser } from '@/api/modules/struct';
  import { ElMessage } from 'element-plus';

  const props = defineProps({
    buttonGroup: {
      type: Array,
      required: true,
      default: () => []
    },
    selectPeople: {
      type: Array,
      required: true,
      default: () => {
        return [];
      }
    },
    formData: {
      type: Object,
      required: true,
      default: () => {
        return {};
      }
    }
  });

  const emit = defineEmits(['onAddPersonnel', 'refreshPage', 'onBtnClick', 'onNeedCleanTableChecked']);
  const {
    showPeopleChangeDepDialog,
    changeDepForm,
    strcutTree,
    changeDepFormRules,
    showBathFormLoading,
    submitChangeDep,
    closeChangeDep,
    handleShowChangeDepDialog
  } = useChangeDep(props, emit);

  const importButtonRef = ref(null);
  function onBtnClick(type) {
    if (type === 'export-user') {
      // 导出
      exportUser(type, props.formData);
    }
    if (type === 'import-user') {
      // 导入
      importButtonRef.value.click();
    }
  }
  const loadingIng = ref(false);
  function uploadFn(event) {
    const file = event.target.files[0];
    let form = new FormData();
    form.append('file', file);
    if (file) {
      loadingIng.value = true;
      // 判断文件后缀
      let testmsg = file.name.substring(file.name.lastIndexOf('.') + 1);
      // 文件大小
      // const isLt2M = file.size / 1024 / 1024 < 50
      // if ((testmsg === 'xls' || testmsg === 'xlsx') && isLt2M) {
      if (testmsg === 'xlsx') {
        importUser(form)
          .then(() => {
            loadingIng.value = false;
            ElMessage.success('导入成功');
            // 处理刷新
            emit('refreshPage');
          })
          .catch(() => {
            loadingIng.value = false;
          });
      } else {
        loadingIng.value = false;
        ElMessage.error('上传文件只能是xlsx格式');
      }
    } else {
      return;
    }
    importButtonRef.value.value = null;
  }

  const showAdd = computed(() => {
    return props.buttonGroup.includes('add');
  });

  const showPeopleExport = computed(() => {
    return props.buttonGroup.includes('export-user');
  });

  const showPeopleImport = computed(() => {
    return props.buttonGroup.includes('import-user');
  });

  const showPeopleChangeDep = computed(() => {
    return props.buttonGroup.includes('batch-move');
  });

  const selectPeopleNum = computed(() => {
    return props.selectPeople.length;
  });

  function addPersonnel() {
    emit('onAddPersonnel');
  }
</script>
<style scoped lang="scss">
  .button-components-group {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
</style>
