<!--
 * @Author: liuYang
 * @Description: 请填写描述信息
 * @Path: 引入路径
 * @Date: 2021-03-19 15:47:26
 * @LastEditors: liu yang
 * @LastEditTime: 2022-12-02 17:46:47
 * @MustParam: 必传参数
 * @OptionalParam: 选传参数
 * @EmitFunction: 函数
 * @Slot/Props.children: 提供的插槽或render
 * @Examples: 使用示例
-->
<template>
  <div class="add-menu-dialog-wrapper">
    <XDrawer ref="drawerRef" :title="handleTitle" @before-close="closeDialog">
      <template #main>
        <el-form ref="formRef" :model="form" :rules="rules" label-width="84px" label-position="right" @submit.prevent @keyup.enter="submit">
          <template v-if="openType === 'add'">
            <el-form-item label="子系统" prop="ssId">
              <el-select v-model="form.ssId" class="lang-input" placeholder="请选择">
                <el-option v-for="item in subsystemList" :key="item.ssId" :label="item.ssName" :value="item.ssId"></el-option>
              </el-select>
            </el-form-item>
          </template>
          <el-form-item label="菜单名称" prop="menuName">
            <el-input v-model.trim="form.menuName" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item type="number" label="同级排序" prop="menuOrder">
            <el-input v-model.trim="form.menuOrder" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="菜单图标" prop="menuIcon">
            <ChooseIconButton v-model:iconName="form.menuIcon"></ChooseIconButton>
          </el-form-item>
        </el-form>
        <div class="form-button-wrapper">
          <el-button type="primary" :loading="loading" @click="submit">确定</el-button>
          <el-button @click="closeDialog">取消</el-button>
        </div>
      </template>
    </XDrawer>
  </div>
</template>
<script setup>
  import { addMenu, updateMenu } from '@/api/modules/menu';
  import { XDrawer } from '@xiaoshi/xiaoshi-components';
  import ChooseIconButton from '../ChooseIconButton/index.vue';
  import { formValidateIsNumber } from '@/utils/patter';
  import { inject, ref, defineEmits } from 'vue';
  import { ElMessage } from 'element-plus';

  defineExpose({
    openDialog,
    closeDialog
  });
  const emit = defineEmits(['onNeedRefreshMenu']);

  const baseForm = {
    ssId: '',
    menuName: '',
    menuOrder: '',
    menuIcon: ''
  };
  const form = ref({ ...baseForm });

  const rules = {
    ssId: [{ required: true, message: '请选择子系统', trigger: 'change' }],
    menuName: [{ required: true, message: '请输入菜单名称', trigger: 'blur' }],
    menuOrder: [
      { required: true, message: '请输入同级排序', trigger: 'blur' },
      { validator: formValidateIsNumber, trigger: 'blur' }
    ],
    menuIcon: [{ required: true, message: '请选择菜单图标', trigger: 'change' }]
  };
  const loading = ref(false);
  const openType = ref('add');
  const subsystemList = inject('subsystemList');
  const drawerRef = ref(null);

  function openDialog(type, data) {
    openType.value = type;
    if (type === 'add') {
      form.value.ssId = data.ssId;
    } else {
      form.value = {
        ...data
      };
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
  const handleTitle = computed(() => `${openType.value === 'add' ? '新增' : '编辑'}一级菜单`);

  const formRef = ref(null);

  function submit() {
    formRef.value.validate((valid) => {
      if (!valid) return;
      loading.value = true;
      const params = {
        ...form.value,
        menuPid: 0,
        menuLevel: 1
      };
      if (openType.value === 'add') {
        handleAdd(params);
      } else {
        handleEdit(params);
      }
    });
  }

  function handleAdd(params) {
    addMenu(params)
      .then(() => {
        loading.value = false;
        closeDialog();
        ElMessage.success('添加成功');
        emit('onNeedRefreshMenu', form.value.ssId);
      })
      .catch(() => {
        loading.value = false;
      });
  }

  function handleEdit(params) {
    updateMenu(params)
      .then(() => {
        loading.value = false;
        closeDialog();
        ElMessage.success('编辑成功');
        emit('onNeedRefreshMenu', form.value.ssId);
      })
      .catch(() => {
        loading.value = false;
      });
  }
</script>
<style scoped lang="scss">
  .dialog-main {
    margin-bottom: 40px;
  }

  .dialog-title {
    font-size: 14px;
    font-weight: 400;
    color: #333333;
    line-height: 20px;
    margin-bottom: 8px;
  }

  .form-button-wrapper {
    text-align: right;
    margin-top: 30px;
  }
</style>
