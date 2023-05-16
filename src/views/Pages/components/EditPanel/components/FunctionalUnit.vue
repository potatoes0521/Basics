<template>
  <div class="edit-panel-wrapper">
    <div v-for="(item, i) of sourceData" :key="i" class="edit-unit">
      <i v-if="i !== 0" class="el-icon-delete delete-button" @click="deleteUnit(i, item)"></i>
      <el-form :model="item" label-width="50px" label-position="left">
        <el-form-item label="名称" prop="name">
          <el-input v-model.trim="item.name" placeholder="输入功能单元名称（必填）" :disabled="i == 0"></el-input
        ></el-form-item>
        <el-form-item label="编码" prop="code">
          <div class="form-item-mybox">
            <el-input v-model.trim="item.code" placeholder="输入功能单元编码（必填）" :disabled="i == 0"></el-input>
            <el-button type="primary" link @click="addPermission(i, item)">添加权限</el-button>
            <div class="jurisdiction">
              <el-tag v-for="(ite, j) of permsFormmat(item.perms)" :key="i + '' + j" class="tag-style" type="info" closable @close="deleteTag(i, j)">
                {{ ite }}
              </el-tag>
            </div>
          </div>
        </el-form-item>
        <el-form-item label="备注" prop="remarks">
          <el-input v-model.trim="item.remarks" placeholder="输入功能单元备注（选填）" :disabled="i == 0"></el-input
        ></el-form-item>
      </el-form>
    </div>
    <XChooseTransferDialog ref="choosePermissionBox" :data-list="subsystemPermissionList" @onSubmit="onSubmitRegister"></XChooseTransferDialog>
  </div>
</template>

<script setup>
  import { XChooseTransferDialog } from '@xiaoshi/xiaoshi-components';
  import { subsystemPermList } from '@/api/modules/select';
  import { defineProps, defineExpose, onMounted, onUnmounted } from 'vue';
  import { ElMessage } from 'element-plus';

  const sourceData = ref([]);

  defineExpose({
    addUnit,
    ruleData,
    sourceData,
    margeData
  });
  const props = defineProps({
    ssid: {
      type: [Number, String],
      default: ''
    },
    modelValue: {
      type: Array,
      require: true,
      default: () => []
    }
  });

  const base = 'base';
  const subsystemPermissionList = ref([]);
  const form = {
    code: '',
    name: '',
    perms: [],
    remarks: ''
  };

  onMounted(() => {
    console.log('🚀 > file: FunctionalUnit.vue:71 > val', 'onMounted');
    if (!props.modelValue.some((v) => v.code === base)) {
      sourceData.value = [
        {
          code: base,
          name: '基础',
          perms: [],
          remarks: '页面默认接口权限（必选）'
        },
        ...props.modelValue
      ];
    } else {
      sourceData.value = [...props.modelValue];
    }
  });

  onUnmounted(() => {
    console.log('🚀 > file: FunctionalUnit.vue:71 > val', 'onUnmounted');
  });

  const permsFormmat = (val) => {
    return Array.isArray(val) ? val : [];
  };
  function getSubsystem() {
    subsystemPermList({}).then(({ data: { options } }) => {
      subsystemPermissionList.value = options;
    });
  }
  getSubsystem();

  function deleteTag(i, j) {
    const data = [...sourceData.value];
    data[i].perms = data[i].perms.filter((v, idx) => idx !== j);
    sourceData.value = [...data];
  }

  function deleteUnit(i) {
    sourceData.value = sourceData.value.filter((v, idx) => idx !== i);
  }

  const currentUnit = ref('');

  function onSubmitRegister(val) {
    const data = [...sourceData.value];
    data[currentUnit.value].perms = [...val.map((v) => v.permUri)];
    sourceData.value = [...data];
  }
  const choosePermissionBox = ref(null);
  function addPermission(i, data) {
    currentUnit.value = i;
    if (!props.ssid) {
      ElMessage.error('请先选择子系统');
      return;
    }
    const { perms } = data;
    if (Array.isArray(perms) && perms.length > 0) {
      const arr = subsystemPermissionList.value.filter((v) => perms.filter((h) => h === v.permUri).length > 0);
      choosePermissionBox.value.openDialog(arr);
    } else {
      choosePermissionBox.value.openDialog([]);
    }
  }

  function addUnit() {
    const data = [...sourceData.value];
    sourceData.value = [data.find((v) => v.code === base), { ...form }, ...data.filter((v) => v.code !== base)];
  }

  function ruleData() {
    const data = [...sourceData.value];
    if (data.some((v) => !v.name)) {
      ElMessage.error('功能单元名称不可为空');
      return false;
    }
    if (data.some((v) => !v.code)) {
      ElMessage.error('功能单元编码不可为空');
      return false;
    }
    if (data.some((v) => !/^[A-Za-z0-9_]+$/.test(v.code))) {
      ElMessage.error('功能单元编码只能输入英文字母、数字、下划线');
      return false;
    }
    let hash = {};
    data.forEach((v) => {
      if (!hash[v.code]) hash[v.code] = 0;
      hash[v.code]++;
    });
    if (Object.values(hash).some((v) => hash[v] > 1)) {
      ElMessage.error('功能单元编码不可重复');
      return false;
    }

    return true;
  }

  function margeData(newData) {
    sourceData.value = [...newData];
  }
</script>
<style scoped lang="scss">
  .edit-panel-wrapper {
    width: 100%;
    margin-bottom: 60px;
    display: flex;
    flex-direction: column;
    .edit-unit {
      width: 100%;
      margin-top: 15px;
      margin-bottom: 5px;
      background-color: #f5f6fa;
      padding: 30px 35px 20px 25px;
      border-radius: 4px;
      box-sizing: border-box;
      position: relative;
      .delete-button {
        position: absolute;
        right: 8px;
        top: 10px;
        cursor: pointer;
        color: #999;
      }

      .jurisdiction {
        display: flex;
        flex-wrap: wrap;
        justify-content: flex-start;
        align-items: flex-start;
        .tag-style {
          margin-bottom: 8px;
          margin-right: 8px;
        }
      }
    }
  }
</style>
