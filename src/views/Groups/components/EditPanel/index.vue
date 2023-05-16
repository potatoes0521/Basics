<!--
 * @Author: liuYang
 * @Description: 请填写描述信息
 * @Path: 引入路径
 * @Date: 2021-03-29 16:12:36
 * @LastEditors: shenjilin
 * @LastEditTime: 2023-05-09 09:51:05
 * @MustParam: 必传参数
 * @OptionalParam: 选传参数
 * @EmitFunction: 函数
 * @Slot/Props.children: 提供的插槽或render
 * @Examples: 使用示例
-->
<template>
  <div class="edit-first-level-wrapper">
    <XDrawer ref="drawerRef" :title="title" @before-close="closeDialog">
      <template #main>
        <el-form ref="formRef" :model="form" :rules="rules" label-width="84px" label-position="right" @submit.prevent @keyup.enter="submit('form')">
          <el-form-item label="部门名称" prop="name">
            <el-input v-model.trim="form.name" placeholder="请输入"> </el-input>
          </el-form-item>
          <el-form-item label="部门等级" prop="structGrade">
            <el-select v-model="form.structGrade" class="w-full" clearable filterable placeholder="请选择">
              <el-option v-for="item in structGradeOptions" :key="item.grade" :label="item.name" :value="item.grade"> </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="同级排序" prop="order">
            <el-input v-model.trim="form.order" placeholder="请输入"> </el-input>
          </el-form-item>
          <el-form-item label="状态" prop="status">
            <el-radio-group v-model="form.status">
              <el-radio v-for="item in statusList" :key="item.id" :label="item.value">{{ item.label }}</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="联系电话" prop="contactNumber">
            <el-input v-model="form.contactNumber" placeholder="请输入联系电话"> </el-input>
          </el-form-item>
          <el-form-item label="职责">
            <el-input v-model="form.duty" class="textarea178" type="textarea" placeholder="请输入内容" maxlength="200" show-word-limit resize="none">
            </el-input>
          </el-form-item>
          <el-form-item label="备注">
            <el-input v-model="form.remarks" class="textarea178" type="textarea" placeholder="请输入内容" maxlength="200" show-word-limit resize="none">
            </el-input>
          </el-form-item>
        </el-form>
        <div class="form-button-wrapper">
          <el-button type="primary" @click="submit('form')">确定</el-button>
          <el-button @click="closeDialog">取消</el-button>
        </div>
      </template>
    </XDrawer>
  </div>
</template>
<script></script>
<script setup>
  import { ElMessage } from 'element-plus';
  import { XDrawer } from '@xiaoshi/xiaoshi-components';
  import { formValidateIsNumber } from '@/utils/patter';
  import { statusList } from '../../config/status';
  import { addStruct, updateStruct } from '@/api/modules/struct';
  import { computed, inject } from 'vue';

  const emit = defineEmits(['onNeedRefreshGroup']);

  defineExpose({
    openDialog,
    closeDialog
  });

  const openType = ref('add');
  const title = computed(() => `${openType.value.startsWith('add') ? '新增' : '编辑'}部门`);

  const baseForm = {
    pid: '',
    name: '',
    level: '',
    status: 1,
    order: '',
    duty: '',
    contactNumber: '',
    remarks: ''
  };
  const formRef = ref(null);
  const form = ref({ ...baseForm });
  const rules = ref({
    name: [
      {
        required: true,
        message: '请输入部门名称',
        trigger: 'blur'
      }
    ],
    status: [
      {
        required: true,
        message: '请选择状态',
        trigger: 'change'
      }
    ],
    order: [
      {
        required: true,
        message: '请输入菜单排序',
        trigger: 'blur'
      },
      {
        validator: formValidateIsNumber,
        trigger: 'blur'
      }
    ]
  });

  const drawerRef = ref(null);
  function openDialog(type, formData) {
    drawerRef.value.openPanel();
    openType.value = type;
    form.value = { ...baseForm };
    handleStatusList(type, formData);
    if (type.startsWith('edit')) {
      form.value = { ...formData };
    } else {
      form.value.pid = formData.id;
      form.value.level = formData.level + 1;
    }
  }
  const statusListOptions = ref([...statusList]);
  function handleStatusList(type, { status } = {}) {
    if (type.startsWith('add')) {
      statusListOptions.value = statusList.filter((item) => item.value !== 2);
    } else if (status === 1 || status === 2) {
      statusListOptions.value = [...statusList.filter((item) => item.value !== 0)];
    } else {
      statusListOptions.value = [...statusList];
    }
  }

  function closeDialog() {
    form.value = { ...baseForm };
    formRef.value.resetFields();
    drawerRef.value.closePanel();
  }

  function submit() {
    formRef.value.validate((valid) => {
      if (valid) {
        if (openType.value.startsWith('add')) {
          add({ ...form.value });
        } else {
          edit({ ...form.value });
        }
      }
    });
  }

  function add(sendData) {
    addStruct({ ...sendData }).then(() => {
      ElMessage.success('添加成功');
      emit('onNeedRefreshGroup');
      closeDialog();
    });
  }

  function edit({ id, name, status, order, duty, remarks, contactNumber, structGrade }) {
    updateStruct({ id, name, status, order, duty, remarks, contactNumber, structGrade }).then(() => {
      ElMessage.success('编辑成功');
      emit('onNeedRefreshGroup');
      closeDialog();
    });
  }

  const structGradeOptions = inject('structGradeOptions');
</script>
<style scoped lang="scss">
  .form-button-wrapper {
    text-align: right;
    margin-top: 30px;
  }
  .margin-bottom0 {
    margin: 0 !important;
  }
</style>
