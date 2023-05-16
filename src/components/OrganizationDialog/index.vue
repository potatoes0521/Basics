<!--
 * @LastEditors: liu yang
 * @Description: 组织架构组件 可选人员加部门
 * @Date: 2022-10-11 11:30:33
 * @LastEditTime: 2022-12-04 17:12:28
 * @Author: liu yang
-->
<template>
  <div class="organization-comp-wrapper">
    <el-dialog v-model="dialogVisitable" :title="title" width="70%" destroy-on-close align-center v-bind="$attrs">
      <div class="comp-dialog-wrapper">
        <div class="">
          <Organization ref="organizationRef" v-model:checkList="checkList" :res-type="resType" :check-type="checkType" @on-radio-change="onRadioChange" />
        </div>
        <div class="dialog-footer">
          <el-button @click="cancel">取 消</el-button>
          <el-button type="primary" @click="onSubmit">确 定</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script setup>
  import Organization from '@/components/Organization/index.vue';

  import { defineExpose, defineProps, defineEmits } from 'vue';

  defineExpose({ open });

  const props = defineProps({
    // 标题
    title: {
      type: String,
      default: '组织架构'
    },
    // 返回选择的 1.人 2.人和部门 3.还是只是部门
    resType: {
      type: String,
      default: 'onlyPeople'
      // default: "onlyStruct",
    },
    // 选择类型是单选还是多选
    checkType: {
      type: String,
      default: 'checkbox'
    }
  });

  const emit = defineEmits(['update:visible', 'onSubmit']);

  const dialogVisitable = ref(false);

  const checkList = ref([]);

  const checkRadio = ref('');

  function onRadioChange(val) {
    checkRadio.value = { ...val };
  }

  /**
   * @Author: liu yang
   * @Date: 2022-11-02 15:35:18
   * @description: 处理提交
   * @return {*}
   */
  function onSubmit() {
    if (props.checkType === 'radio') {
      emit('onSubmit', checkRadio.value);
    } else {
      emit('onSubmit', checkList.value);
    }
    cancel();
  }

  /**
   * @Author: liu yang
   * @Date: 2022-11-02 15:36:38
   * @description: 取消
   * @return {*}
   */
  function cancel() {
    checkList.value = [];
    dialogVisitable.value = false;
  }
  const organizationRef = ref(null);

  function open(data = []) {
    dialogVisitable.value = true;
    nextTick(() => {
      organizationRef.value?.defaultCheck(data);
    });
  }
</script>
<style scoped lang="scss">
  .organization-comp-wrapper {
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
