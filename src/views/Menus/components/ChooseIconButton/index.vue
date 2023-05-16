<!--
 * @Author: liuYang
 * @Description: 请填写描述信息
 * @Path: 引入路径
 * @Date: 2021-03-24 13:37:01
 * @LastEditors: NiuNiu
 * @LastEditTime: 2022-12-13 10:47:54
 * @MustParam: 必传参数
 * @OptionalParam: 选传参数
 * @EmitFunction: 函数
 * @Slot/Props.children: 提供的插槽或render
 * @Examples: 使用示例
-->
<template>
  <div class="choose-icon-button-component-wrapper">
    <template v-if="iconName">
      <div class="wrapper center" @click="handleChooseIcon">
        <div class="position-icon el-icon-edit"></div>
        <div class="position-icon-bg"></div>
        <template v-if="iconName.startsWith('@')"><XIcon :icon-class="iconName" class-name="svg-icon-style"></XIcon></template>
        <template v-if="iconName.startsWith('el-')"><i class="icon" :class="iconName"></i></template>
        <template v-if="iconName.startsWith('icon-')"><i class="icon" :class="'iconfont ' + iconName"></i></template>
      </div>
      <div class="delete el-icon-delete" @click="handleDeleteIcon"></div
    ></template>
    <template v-else>
      <div class="wrapper" @click="handleChooseIcon">
        <div class="icon-add el-icon-plus"></div>
        <div class="text">添加</div>
      </div>
    </template>
    <Icon ref="iconRef" @on-choose-icon="onChooseIcon"></Icon>
  </div>
</template>
<script></script>

<script setup>
  import Icon from '@/components/Icons/index.vue';

  defineProps({
    iconName: {
      type: String,
      required: true,
      default: ''
    }
  });
  const iconRef = ref(null);
  const handleChooseIcon = () => {
    iconRef.value.openDialog();
  };
  const emit = defineEmits(['update:iconName']);
  function onChooseIcon(iconName) {
    emit('update:iconName', iconName);
  }

  function handleDeleteIcon() {
    emit('update:iconName', '');
  }
</script>
<style scoped lang="scss">
  .choose-icon-button-component-wrapper {
    display: flex;
    align-items: center;
    .delete {
      margin-left: 8px;
      width: 20px;
      height: 20px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      color: #999;
    }
  }
  .center {
    justify-content: center;
  }
  .wrapper {
    width: 60px;
    height: 60px;
    background: #f3f4f7;
    display: flex;
    align-items: center;
    flex-direction: column;
    cursor: pointer;
    position: relative;
    overflow: hidden;

    .icon-add {
      font-size: 18px;
      font-weight: 400;
      color: #999;
      padding-top: 12px;
    }
    .text {
      font-size: 12px;
      font-weight: 400;
      color: #999;
      line-height: 17px;
      margin-top: 6px;
    }
    .position-icon {
      position: absolute;
      right: 1px;
      top: 1px;
      color: #fff;
      z-index: 1;
    }
    .position-icon-bg {
      position: absolute;
      width: 44px;
      height: 44px;
      background: #34acff;
      border-radius: 50%;
      right: -22px;
      top: -22px;
    }
    .icon {
      font-size: 26px;
      color: #666666;
    }
  }
</style>
