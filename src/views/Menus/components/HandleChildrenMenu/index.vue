<template>
  <div class="edit-panel-wrapper">
    <XDrawer ref="drawerRef" :title="(openType.startsWith('add') ? '新增' : '编辑') + '菜单'" @before-close="closeDialog">
      <template #main>
        <el-form ref="formRef" :model="form" :rules="rules" label-width="84px" label-position="right" @submit.prevent @keyup.enter="submitForm('form')">
          <template v-if="openType.startsWith('add')">
            <el-form-item label="父级菜单" prop="menuPid">
              <el-select v-model="form.menuPid" class="lang-input" placeholder="请选择">
                <el-option v-for="item in menuPidList" :key="item.menuId" :label="item.menuName" :value="item.menuId"> </el-option>
              </el-select>
            </el-form-item>
          </template>
          <el-form-item label="菜单名称" prop="menuName"><el-input v-model.trim="form.menuName" placeholder="请输入"></el-input></el-form-item>
          <el-form-item label="同级排序" prop="menuOrder"><el-input v-model.trim="form.menuOrder" placeholder="请输入"></el-input></el-form-item>
          <div class="form-button-wrapper">
            <el-button class="button" type="primary" :loading="loading" @click="submitForm('form')">确定</el-button>
            <el-button class="button" @click="closeDialog">取消</el-button>
          </div>
        </el-form>
      </template>
    </XDrawer>
  </div>
</template>
<script setup>
  import { XDrawer } from '@xiaoshi/xiaoshi-components';
  import { addMenu, updateMenu } from '@/api/modules/menu';
  import { formValidateIsNumber } from '@/utils/patter';
  import { ElMessage } from 'element-plus';

  defineExpose({
    openDialog,
    closeDialog
  });
  const emit = defineEmits(['onNeedRefreshMenu']);

  defineProps({
    menuPidList: {
      type: Array,
      required: true,
      default: () => []
    }
  });

  const baseForm = {
    menuName: '',
    menuOrder: '',
    menuPid: '',
    menuLevel: ''
  };

  const formRef = ref(null);
  const form = ref({ ...baseForm });

  const rules = {
    menuName: [{ required: true, message: '请输入菜单名称', trigger: 'blur' }],
    menuOrder: [
      {
        required: true,
        message: '请输入菜单排序',
        trigger: 'blur'
      },
      {
        validator: formValidateIsNumber,
        trigger: 'blur'
      }
    ],
    menuPid: [{ required: true, message: '请选择父级菜单', trigger: 'change' }]
  };
  const openType = ref('add');

  const loading = ref(false);

  const drawerRef = ref(null);

  function submitForm() {
    formRef.value.validate((valid) => {
      if (valid) {
        loading.value = true;
        const params = {
          ...form.value
        };
        if (openType.value.startsWith('add')) {
          addMenu(params)
            .then(() => {
              ElMessage.success('添加成功');
              emit('onNeedRefreshMenu', form.value.ssId);
              closeDialog();
            })
            .finally(() => {
              loading.value = false;
            });
        } else {
          updateMenu(params)
            .then(() => {
              ElMessage.success('编辑成功');
              emit('onNeedRefreshMenu', form.value.ssId);
              closeDialog();
            })
            .finally(() => {
              loading.value = false;
            });
        }
      } else {
        return false;
      }
    });
  }

  function openDialog(type, data) {
    openType.value = type;
    form.value = { ...baseForm };
    if (type.startsWith('add')) {
      form.value.ssId = data.ssId;
      form.value.menuPid = data.menuId;
      form.value.menuLevel = +data.menuLevel + 1 || 2;
    } else {
      form.value = { ...data };
    }
    drawerRef.value.openPanel();
  }

  function closeDialog() {
    resetForm();
    drawerRef.value.closePanel();
  }

  function resetForm() {
    form.value = { ...baseForm };
  }
</script>
<style scoped lang="scss">
  .margin-bottom0 {
    margin: 0 !important;
  }

  .form-button-wrapper {
    text-align: right;
    margin-top: 30px;
  }

  .margin-top10 {
    margin-top: 10px !important;
  }

  .permission-wrapper {
    border: 1px solid #e6e6e6;
    width: 100%;
    height: 178px;
    overflow-y: auto;
    border-radius: 4px;
    margin-top: 10px;
    box-sizing: border-box;
    padding: 10px;
    padding-right: 0;

    .permission-item {
      background: rgba(68, 168, 255, 0.0977);
      border-radius: 2px;
      height: 21px;
      font-size: 12px;
      font-weight: 400;
      color: #666666;
      margin-bottom: 10px;
      box-sizing: border-box;
      padding: 0 10px;
      margin-right: 20px;
      align-content: flex-start;
      display: inline-block;
      line-height: 21px;
      cursor: pointer;

      .permission-item-close {
        color: #34acff;
        margin-left: 13px;
        display: inline-block;
        line-height: 21px;
      }
    }
  }
</style>
