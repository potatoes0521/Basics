<!--
 * @Author: liuYang
 * @Description: 请填写描述信息
 * @Path: 引入路径
 * @Date: 2021-03-17 10:17:51
 * @LastEditors: liu yang
 * @LastEditTime: 2023-04-13 13:36:59
 * @MustParam: 必传参数
 * @OptionalParam: 选传参数
 * @EmitFunction: 函数
 * @Slot/Props.children: 提供的插槽或render
 * @Examples: 使用示例
-->
<template>
  <div class="details-dialog-wrapper">
    <el-dialog v-model="dialogVisible" title="登录日志" width="678px" destroy-on-close>
      <div class="dialog-form-item">
        <div class="form-item-label">失败锁定阈值</div>
        <div class="form-item-value">{{ detailsData.loginTryThreshold }}</div>
      </div>
      <div class="dialog-form-item">
        <div class="form-item-label">当前失败总次数</div>
        <div class="form-item-value">{{ detailsData.loginTryCnt }}</div>
      </div>
      <div class="dialog-form-item">
        <div class="form-item-label">锁定状态</div>
        <div class="form-item-value">{{ detailsData.locked ? '已锁定' : '未锁定' }}</div>
      </div>
      <div class="dialog-form-item">
        <div class="form-item-label">登录账户</div>
        <div class="form-item-value">{{ detailsData.username }}</div>
      </div>
      <div class="dialog-form-item">
        <div class="form-item-label">工号</div>
        <div class="form-item-value">{{ detailsData.workNo }}</div>
      </div>
      <div class="dialog-form-item">
        <div class="form-item-label">姓名</div>
        <div class="form-item-value">{{ detailsData.uname }}</div>
      </div>
      <div class="dialog-form-item">
        <div class="form-item-label">剩余锁定时长</div>
        <div class="form-item-value">{{ detailsData.remaining || '-' }}</div>
      </div>
      <div class="dialog-form-item">
        <div class="form-item-label">操作</div>
        <div class="form-item-value">
          <el-button type="primary" size="small" @click="unlock">{{ detailsData.locked ? '解锁' : '清空记录' }}</el-button>
        </div>
      </div>
      <!-- 登录记录 -->
      <XTable :table-data="loginTableData" :page-size="10000000000" :current-page="1" :total-num="10000000000" :table-column="loginColumn"></XTable>
    </el-dialog>
  </div>
</template>
<script setup>
  import { loginTryList } from '@/api/modules/user';
  import { loginColumn } from './config/tableColumn';
  import XTable from './Table/index.vue';

  const emit = defineEmits(['unlock']);

  defineExpose({
    openDialog,
    closeDialog
  });

  const dialogVisible = ref(false);
  const detailsData = ref({});
  const loginTableData = ref([]);
  const userId = ref('');

  function openDialog({ userId: id }) {
    userId.value = id;
    dialogVisible.value = true;
    loginList();
  }

  function closeDialog() {
    dialogVisible.value = false;
  }

  function loginList() {
    loginTryList({ userId: userId.value }).then(({ data }) => {
      detailsData.value = { ...data };
      loginTableData.value = data.rows;
    });
  }

  function unlock() {
    // 解锁
    emit('unlock', userId.value);
    loginList();
  }
</script>
<style scoped lang="scss">
  .dialog-form-item {
    display: flex;
    align-items: flex-start;
    font-size: 14px;
    font-weight: 400;
    margin-bottom: 20px;

    .form-item-label {
      width: 140px;
      text-align: right;
      margin-right: 20px;
      color: #999999;
      line-height: 20px;
    }
    .form-item-value {
      flex: 1;
      line-height: 20px;
      color: #333333;
      text-align: justify;
    }
  }
</style>
