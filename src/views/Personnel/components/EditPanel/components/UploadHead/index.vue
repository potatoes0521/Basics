<!--
 * @Author: NiuNiu
 * @Description: 请填写描述信息
 * @Path: 引入路径
 * @Date: 2022-09-19 17:42:56
 * @LastEditors: liu yang
 * @LastEditTime: 2023-05-16 10:19:16
 * @MustParam: 必传参数
 * @OptionalParam: 选传参数
 * @EmitFunction: 函数
 * @Slot/Props.children: 提供的插槽或render
 * @Examples: 使用示例
-->
<template>
  <div class="head-wrapper">
    <img v-if="props.headImg" class="img-style" :src="props.headImg" alt="" />
    <XIcon v-else class="svg-style" icon-class="@kefu"></XIcon>
    <div class="importBox importBox2">
      <el-button class="button" link type="primary" :loading="importLoading" @click="handleImport">点击更换</el-button>
      <input v-show="false" ref="importBtnRef" class="importBtn" type="file" accept="image/jpg,image/png" @change="upload($event)" />
    </div>
    <el-button class="button" link type="primary" @click="handleHeadClear">恢复默认</el-button>
  </div>
</template>
<script></script>
<script setup>
  import { ref, defineProps, defineEmits } from 'vue';
  // import { uploadFile } from '@/api/modules/wiki/fs';

  const props = defineProps({
    headImg: {
      type: String,
      default: ''
    }
  });
  const emit = defineEmits(['update:headImg']);
  const importBtnRef = ref(null);
  const importLoading = ref(null);
  // 导入
  const handleImport = () => {
    importBtnRef.value.click();
  };

  const localHeadImg = ref('');
  const upload = (event) => {
    let file = event.target.files[0];
    let form = new FormData();
    form.append('file', file);
    if (file) {
      importLoading.value = true;
      // uploadFile(form)
      //   .then((data) => {
      //     importLoading.value = false;
      //     ElMessage({
      //       showClose: true,
      //       message: '上传成功',
      //       type: 'success'
      //     });
      //     emit('update:headImg', data.url);
      //     localHeadImg.value = data.url;
      //   })
      //   .catch(() => {
      //     importLoading.value = false;
      //   });
    } else {
      return;
    }
    importBtnRef.value = null;
  };
  function handleHeadClear() {
    emit('update:headImg', '');
    localHeadImg.value = '';
  }
</script>
<style scoped lang="scss">
  .head-wrapper {
    display: flex;
    align-items: center;
  }
  .importBox {
    background: #f5f6fa;
    border-radius: 7px;
    border: 1px solid #f7f7f7;
    text-align: center;
    box-sizing: border-box;
    .importBtn {
      position: absolute;
      width: 100%;
      height: 100%;
      left: 0;
      top: 0;
      opacity: 0;
      z-index: -1;
      cursor: pointer;
      font-size: 0;
    }
    .button-box {
      margin: 30px 0 20px 0;
    }
  }
  .importBox2 {
    border: none !important;
    background: #fff !important;
    display: inline-block;
  }
  .svg-style {
    width: 50px !important;
    height: 50px !important;
  }
  .img-style {
    max-width: 50px !important;
    max-height: 50px !important;
  }
  .button {
    margin-left: 20px;
  }
</style>
