<!--
 * @Author: liuYang
 * @Description: 请填写描述信息
 * @Path: 引入路径
 * @Date: 2021-03-17 10:17:51
 * @LastEditors: liu yang
 * @LastEditTime: 2022-12-09 10:30:44
 * @MustParam: 必传参数
 * @OptionalParam: 选传参数
 * @EmitFunction: 函数
 * @Slot/Props.children: 提供的插槽或render
 * @Examples: 使用示例
-->
<template>
  <div class="details-dialog-wrapper">
    <el-dialog v-model="dialogVisible" title="详情" width="678px" destroy-on-close>
      <div class="dialog-form-item">
        <div class="form-item-label">头像</div>
        <div class="form-item-value">
          <img v-if="detailsData.avatarUrl" class="img-style" :src="detailsData.avatarUrl" />
        </div>
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
        <div class="form-item-label">性别</div>
        <div class="form-item-value">{{ detailsData.sex ? '男' : '女' }}</div>
      </div>
      <div class="dialog-form-item">
        <div class="form-item-label">部门等级</div>
        <div class="form-item-value">{{ structGrade }}</div>
      </div>
      <template v-if="detailsData.strcutName">
        <div class="dialog-form-item">
          <div class="form-item-label">部门</div>
          <div class="form-item-value">{{ detailsData.strcutName }}</div>
        </div>
        <div class="dialog-form-item">
          <div class="form-item-label">是否是主要人员</div>
          <div class="form-item-value">{{ detailsData.isPrincipal ? '是' : '否' }}</div>
        </div>
      </template>
      <div class="dialog-form-item">
        <div class="form-item-label">用户名</div>
        <div class="form-item-value">{{ detailsData.username }}</div>
      </div>
      <div class="dialog-form-item">
        <div class="form-item-label">用户等级</div>
        <div class="form-item-value">{{ userLevel }}</div>
      </div>
      <div v-if="detailsData.bindings" class="dialog-form-item">
        <div class="form-item-label">绑定的子系统</div>
        <div class="form-item-value">{{ detailsData.bindings }}</div>
      </div>
      <div class="dialog-form-item">
        <div class="form-item-label">账户状态</div>
        <div class="form-item-value">{{ accountStatus }}</div>
      </div>
      <template v-if="detailsData.nickName">
        <div class="dialog-form-item">
          <div class="form-item-label">昵称</div>
          <div class="form-item-value">{{ detailsData.nickName }}</div>
        </div>
      </template>
      <template v-if="detailsData.whatsup">
        <div class="dialog-form-item">
          <div class="form-item-label">个性签名</div>
          <div class="form-item-value">{{ detailsData.whatsup }}</div>
        </div>
      </template>
      <template v-if="detailsData.phoneNo">
        <div class="dialog-form-item">
          <div class="form-item-label">手机号</div>
          <div class="form-item-value">{{ detailsData.phoneNo }}</div>
        </div>
      </template>
      <template v-if="detailsData.email">
        <div class="dialog-form-item">
          <div class="form-item-label">电子邮箱</div>
          <div class="form-item-value">{{ detailsData.email }}</div>
        </div>
      </template>
      <template v-if="detailsData.qqNo">
        <div class="dialog-form-item">
          <div class="form-item-label">QQ号</div>
          <div class="form-item-value">{{ detailsData.qqNo }}</div>
        </div>
      </template>
      <template v-if="detailsData.wechatNo">
        <div class="dialog-form-item">
          <div class="form-item-label">微信号</div>
          <div class="form-item-value">{{ detailsData.wechatNo }}</div>
        </div>
      </template>
      <template v-if="detailsData.salary">
        <div class="dialog-form-item">
          <div class="form-item-label">薪资</div>
          <div class="form-item-value">{{ detailsData.salary }}</div>
        </div>
      </template>
      <template v-if="detailsData.workTime">
        <div class="dialog-form-item">
          <div class="form-item-label">入职时间</div>
          <div class="form-item-value">{{ detailsData.workTime }}</div>
        </div>
      </template>
      <div class="dialog-form-item">
        <div class="form-item-label">创建时间</div>
        <div class="form-item-value">{{ detailsData.gmtCreate }}</div>
      </div>
      <div class="dialog-form-item">
        <div class="form-item-label">最后编辑时间</div>
        <div class="form-item-value">{{ detailsData.gmtModified }}</div>
      </div>
    </el-dialog>
  </div>
</template>
<script setup>
  import { userDetail } from '@/api/modules/user';
  import { computed, inject } from 'vue';

  const subsystemOptions = inject('subsystemOptions');

  const userLevelOptions = inject('userLevelOptions');
  const userLevel = computed(() => {
    return userLevelOptions.value.find((item) => item.userLevelCode === detailsData.value.userLevel)?.userLevelName || detailsData.value.userLevel;
  });

  const structGradeOptions = inject('structGradeOptions');
  const structGrade = computed(() => {
    return structGradeOptions.value.find((item) => item.grade === detailsData.value.structGrade)?.name || detailsData.value.structGrade;
  });

  const dialogVisible = ref(false);
  const detailsData = ref({});

  const accountStatus = computed(() => {
    const hash = {
      1: '已启用',
      2: '未启用',
      0: '未启用'
    };
    return hash[detailsData.value.accountStatus] || '未启用';
  });

  defineExpose({
    closeDialog,
    openDialog
  });

  function openDialog({ userId }) {
    dialogVisible.value = true;
    userDetail({ userId }).then(({ data }) => {
      detailsData.value = { ...data };
      if (detailsData.value.bindings) {
        const bindings = detailsData.value.bindings?.split(',').map((item) => +item);
        const subsystemNameList = subsystemOptions.value
          .filter((item) => {
            return bindings.includes(+item.ssId);
          })
          .map((item) => item.ssName);

        detailsData.value.bindings = subsystemNameList?.toString() || '-';
      }
    });
  }

  function closeDialog() {
    dialogVisible.value = false;
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
      width: 120px;
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
      .img-style {
        max-width: 50px;
        max-height: 50px;
      }
    }
  }
</style>
