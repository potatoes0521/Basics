<!--
 * @Author: liuYang
 * @Description: 绑定页面弹窗
 * @Path: 引入路径
 * @Date: 2021-03-25 14:54:08
 * @LastEditors: liu yang
 * @LastEditTime: 2022-12-04 17:03:10
 * @MustParam: 必传参数
 * @OptionalParam: 选传参数
 * @EmitFunction: 函数
 * @Slot/Props.children: 提供的插槽或render
 * @Examples: 使用示例
-->
<template>
  <div class="subsystem-page-wrapper">
    <el-dialog v-model="dialogVisible" center width="500px" append-to-body destroy-on-close title="选择子系统页面">
      <div class="dialog-main">
        <el-form ref="formRef" :model="form" :rules="rules" label-width="100px" @submit.prevent @keyup.enter="submit">
          <el-form-item label="打开方式" prop="openInNewWindow">
            <el-radio-group v-model="form.openInNewWindow">
              <el-radio :label="0">当前窗口打开</el-radio>
              <el-radio :label="1">新窗口打开</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="链接类型" prop="hrefType">
            <el-radio-group v-model="form.hrefType" @change="onRadioChange">
              <template v-if="hasBindPagePerm">
                <el-radio :label="1">本系统</el-radio>
                <el-radio :label="2">其他子系统</el-radio>
              </template>
              <template v-if="showLink">
                <el-radio :label="3">外链</el-radio>
              </template>
            </el-radio-group>
          </el-form-item>
          <template v-if="form.hrefType === 3">
            <el-form-item label="菜单链接" prop="menuHref"> <el-input v-model.trim="form.menuHref" placeholder="请输入"></el-input> </el-form-item
          ></template>
          <template v-if="hasBindPagePerm">
            <template v-if="form.hrefType === 2">
              <el-form-item label="子系统">
                <el-select v-model="form.ssId" filterable placeholder="请选择" @change="onSubsystemChange">
                  <el-option v-for="item in subsystemList" :key="item.ssId" :disabled="item.ssId === ssId" :label="item.ssName" :value="item.ssId"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="子系统页面">
                <el-select v-model="form.pageId" filterable placeholder="请选择">
                  <el-option v-for="item in otherSubsystemPageList" :key="item.pageId" :label="item.pageName" :value="item.pageId"></el-option>
                </el-select>
              </el-form-item>
            </template>
            <template v-if="form.hrefType === 1">
              <el-form-item label="子系统页面">
                <el-select v-model="form.pageId" filterable placeholder="请选择">
                  <el-option v-for="item in currentSystemPageList" :key="item.pageId" :label="item.pageName" :value="item.pageId"></el-option>
                </el-select>
              </el-form-item>
            </template>
          </template>
        </el-form>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" :loading="loading" @click="submit">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script setup>
  import { subsystemPageList } from '@/api/modules/select';
  import { bindingMenu, updateMenu } from '@/api/modules/menu';
  import { isUrl } from '@/utils/patter';
  import { isUndefined } from '@/utils/typeOf';
  import { inject, defineExpose, defineEmits } from 'vue';
  import { ElMessage } from 'element-plus';

  defineExpose({
    openDialog,
    closeDialog
  });
  const emit = defineEmits(['onNeedRefreshMenu']);

  const props = defineProps({
    ssId: {
      type: Number,
      required: true,
      default: 0
    }
  });

  const menuData = ref({});
  const dialogVisible = ref(false);
  const otherSubsystemPageList = ref([]);
  const baseForm = {
    hrefType: 1,
    ssId: '',
    pageId: '',
    openInNewWindow: 0,
    menuHref: ''
  };
  const formRef = ref(null);
  const form = ref(baseForm);

  const rules = {
    ssId: [],
    pageId: [],
    hrefType: [],
    openInNewWindow: [],
    menuHref: []
  };

  const currentSystemPageList = ref([]);
  const loading = ref(false);
  const subsystemList = inject('subsystemList');

  const hasBindPagePerm = computed(() => {
    return !menuData.value.children && menuData.value.hrefType !== 3;
  });

  const showLink = computed(() => {
    return menuData.value?.hrefType === 3 || isUndefined(menuData.value.hrefType);
  });

  function submit() {
    if (form.value.hrefType !== 3) {
      if (!form.value.pageId) {
        return ElMessage.error('请选择子系统页面');
      }
      loading.value = true;
      bindingMenu({
        ...menuData.value,
        ...form.value
      })
        .then(() => {
          ElMessage.success('配置成功');
          emit('onNeedRefreshMenu');
          closeDialog();
        })
        .finally(() => {
          loading.value = false;
        });
    } else {
      if (form.value.menuHref) return ElMessage.error('请输入菜单链接');
      if (!isUrl(form.value.menuHref)) return ElMessage.error('请输入正确的菜单链接');
      loading.value = true;
      updateMenu({
        ...menuData.value,
        ...form.value
      })
        .then(() => {
          ElMessage.success('配置成功');
          emit('onNeedRefreshMenu');
          closeDialog();
        })
        .finally(() => {
          loading.value = false;
        });
    }
  }

  function openDialog(data) {
    menuData.value = { ...data };
    form.value = { ...baseForm };
    dialogVisible.value = true;
    if (data.hrefType === 3) {
      form.value.hrefType = 3;
    } else {
      form.value.hrefType = data.hrefType || 1;
    }
    onSubsystemChange();
  }

  function onSubsystemChange(ssId = props.ssId) {
    subsystemPageList({ ssId }).then(({ data: { options } }) => {
      if (ssId === props.ssId) {
        currentSystemPageList.value = options;
      } else {
        otherSubsystemPageList.value = options;
      }
    });
  }

  function onRadioChange(value) {
    form.value.pageId = '';
    if (value === 2 || currentSystemPageList.value.length) return;
    onSubsystemChange();
  }

  function closeDialog() {
    resetForm();
    dialogVisible.value = false;
  }

  function resetForm() {
    form.value = { ...baseForm };
  }
</script>
<style scoped lang="scss">
  .dialog-main {
    height: 230px;
  }
  .dialog-footer {
    text-align: right;
  }
</style>
