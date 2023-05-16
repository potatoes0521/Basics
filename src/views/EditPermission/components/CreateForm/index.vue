<!--
 * @Author: liuYang
 * @Description: 请填写描述信息
 * @Path: 引入路径
 * @Date: 2021-03-30 09:57:55
 * @LastEditors: liu yang
 * @LastEditTime: 2022-07-28 15:40:51
 * @MustParam: 必传参数
 * @OptionalParam: 选传参数
 * @EmitFunction: 函数
 * @Slot/Props.children: 提供的插槽或render
 * @Examples: 使用示例
-->
<template>
  <div class="search-form-component-wrapper">
    <el-form ref="formRef" hide-required-asterisk :model="form" :rules="rules" label-position="top">
      <div class="inline-wrapper">
        <div class="inline">
          <el-form-item :label="pageZN + '中文名'" prop="zcName">
            <el-input v-model.trim="form.zcName" placeholder="请输入"></el-input>
          </el-form-item>
        </div>
        <div class="inline">
          <el-form-item :label="pageZN + '英文名'" prop="enName">
            <el-input v-model.trim="form.enName" placeholder="请输入"></el-input>
          </el-form-item>
        </div>
        <div class="inline">
          <el-form-item label="排序" prop="order">
            <el-input v-model.trim="form.order" placeholder="请输入"></el-input>
          </el-form-item>
        </div>
      </div>
      <el-form-item label="备注" prop="remarks">
        <el-input v-model.trim="form.remarks" type="textarea" :autosize="{ minRows: 2, maxRows: 4 }" placeholder="请输入"></el-input>
      </el-form-item>
    </el-form>
  </div>
</template>
<script setup>
  import { ref, inject } from 'vue';
  import usePageType from '../../hooks/pageType';

  const form = ref({
    zcName: '',
    enName: '',
    order: '',
    remarks: ''
  });

  const formRef = ref(null);

  const rules = {
    zcName: [
      {
        required: true,
        message: '请输入中文名',
        trigger: 'blur'
      }
    ],
    enName: [
      {
        required: true,
        message: '请输入英文名',
        trigger: 'blur'
      }
    ],
    order: [
      {
        required: true,
        message: '请输入排序',
        trigger: 'blur'
      }
    ]
  };

  const { pageZN, editType, pageEN } = usePageType();

  const eventBus = inject('eventBus');

  eventBus.on('submitForm', () => {
    formRef.value.validate((valid, filed) => {
      if (valid) {
        console.log('🚀 > file: 表单数据:', form.value);
        handleSubmitEmit();
      } else {
        console.log('error submit!', form.value, filed);
      }
    });
  });

  /**
   * @Author: liu yang
   * @Date: 2022-07-28 15:40:44
   * @description: 处理emit
   * @return {*}
   */
  function handleSubmitEmit() {
    if (pageEN.value === 'role') {
      eventBus.emit('submitFormRole', {
        type: editType.value,
        data: form.value
      });
    } else {
      eventBus.emit('submitFormPermGroup', {
        type: editType.value,
        data: form.value
      });
    }
  }

  eventBus.on('getFormData', (data) => {
    form.value = { ...data };
  });
</script>
<style scoped lang="scss">
  .search-form-component-wrapper {
    padding: 0 20px;
    .inline-wrapper {
      width: 100%;
      display: flex;
      justify-content: space-between;
      .inline {
        width: 32%;
      }
    }
    .margin-bottom0 {
      margin-bottom: 0 !important;
    }
  }
</style>
