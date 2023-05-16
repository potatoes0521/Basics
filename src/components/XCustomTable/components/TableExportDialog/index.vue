<template>
  <el-dialog v-model="dialogVisible" title="导出选项" width="450px" custom-class="table-export">
    <el-form ref="form" :model="state.form" label-width="100px" label-position="left">
      <el-form-item label="文件名：">
        <el-input v-model="state.form.fileName" placeholder="文件名（默认为table+时间戳）"></el-input>
      </el-form-item>
      <el-form-item label="数据源：">
        <el-select v-model="state.form.fileDataSource" placeholder="请选择导出数据源" @change="handleFileDataSourceChange">
          <el-option label="当前选中（当前选中的数据）" value="1" :disabled="!isShowSelect"></el-option>
          <el-option label="当前数据（当前页的数据）" value="2"></el-option>
          <el-option
            :disabled="!exportConfig.customExport"
            :label="exportConfig.customExport ? exportConfig.customExport.name : '全量数据（表格全部数据）'"
            value="3"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item v-if="state.fileTypeShow" label="文件类型：">
        <el-select v-model="state.form.fileType" placeholder="请选择导出的文件类型">
          <el-option label="Excel(*.xlsx)" value="xlsx"></el-option>
          <el-option label="CSV(*.csv)" value="csv" disabled></el-option>
          <el-option label="HTML(*.html)" value="html" disabled></el-option>
        </el-select>
      </el-form-item>
      <el-form-item v-if="state.fieldShow" label="选择字段：">
        <div class="table-export-select-field">
          <div class="table-export-select-field_all" @click="columnExportCheckAllChange(!state.columnExportCheckAll)">
            <el-checkbox
              v-model="state.columnExportCheckAll"
              :indeterminate="state.isIndeterminate"
              @click.stop="() => {}"
              @change="columnExportCheckAllChange"
            >
            </el-checkbox>
            全选
          </div>
          <div class="table-export-select-field_box">
            <div v-for="item of state.columns" :key="item.prop" class="table-export-select-field_item" @click.stop="handleColumnCheck(item)">
              <el-checkbox v-model="item.export" :disabled="item.disabled" @click.stop="() => {}" @change="handleColumnCheck(item, true)"></el-checkbox>
              {{ item.label }}
            </div>
          </div>
        </div>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="tableExportCallBack">确 定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
  import { ElMessage } from 'element-plus';
  import { reactive, watch, ref, inject, defineProps, defineEmits } from 'vue';
  import useXlsx from '@/hooks/useXlsx.js';
  import { isNullOrUnDef } from '@/utils/typeOf.js';

  const { exportXlsx } = useXlsx();

  const columnConfig = inject('columnConfig');
  const tableData = inject('tableData');
  const exportConfig = inject('exportConfig');
  const selectionData = inject('selectionData');
  const props = defineProps({
    modelValue: {
      type: Boolean,
      required: true
    }
  });
  const emit = defineEmits(['update:modelValue']);
  const dialogVisible = ref(false);
  const state = reactive({
    form: {
      fileName: '',
      fileType: 'xlsx',
      fileDataSource: '2'
    },
    columns: [],
    columnExportCheckAll: false,
    isIndeterminate: false,

    fieldShow: isNullOrUnDef(exportConfig.fieldShow) ? exportConfig.fieldShow : true,
    fileTypeShow: isNullOrUnDef(exportConfig.fileTypeShow) ? exportConfig.fileTypeShow : true
  });

  // 列全选
  const columnExportCheckAllChange = (val) => {
    state.columns
      .filter((v) => !v.disabled)
      .forEach((v) => {
        v.export = val;
        return v;
      });
    state.columnExportCheckAll = val;
    state.isIndeterminate = false;
  };

  // 列change
  const columnsCheckedChange = () => {
    const checkedCount = state.columns.filter((v) => !v.disabled).filter((v) => v.export).length;

    state.columnExportCheckAll = checkedCount === state.columns.filter((v) => !v.disabled).length;
    state.isIndeterminate = checkedCount > 0 && checkedCount < state.columns.filter((v) => !v.disabled).length;
  };

  // 列设置点击行选中
  const handleColumnCheck = (item, bool) => {
    if (item.disabled) return;
    if (!bool) item.export = !item.export;
    columnsCheckedChange();
  };

  // 数据源change
  const handleFileDataSourceChange = (v) => {
    state.fieldShow = isNullOrUnDef(exportConfig.fieldShow) ? exportConfig.fieldShow : true;
    state.fileTypeShow = isNullOrUnDef(exportConfig.fileTypeShow) ? exportConfig.fileTypeShow : true;
    if (+v === 3) {
      state.fieldShow = exportConfig.value?.customExport?.fieldShow;
      state.fileTypeShow = exportConfig.value?.customExport?.fileTypeShow;
    }
  };

  // 导出文件确认
  const tableExportCallBack = async () => {
    let fileName = state.form.fileName || `table_${Date.now()}`;

    let data = [];

    let keyMap = {};
    state.columns
      .filter((v) => v.export)
      .forEach((v) => {
        keyMap[v.prop] = v.label;
      });

    if (state.form.fileDataSource === '1') {
      data = [...selectionData.value];

      if (data.length <= 0) {
        ElMessage.info('请至少选中一条要导出的数据');
        return;
      }
    }
    if (state.form.fileDataSource === '2') {
      data = [...tableData.value];

      if (data.length <= 0) {
        ElMessage.info('暂无可导出的数据');
        return;
      }
    }

    // 自定义导出
    if (state.form.fileDataSource === '3') {
      console.log('开发中', exportConfig.value);
      let params = {
        fileName
      };
      if (exportConfig.value?.customExport?.fieldShow) {
        params = {
          ...params,
          fieldMap: keyMap
        };
      }
      if (exportConfig.value?.customExport?.fileTypeShow) {
        params = {
          ...params,
          fileType: state.form.fileType
        };
      }

      if (exportConfig.value?.customExport?.method) {
        exportConfig.value.customExport.method(params);
        dialogVisible.value = false;
        return;
      }
    }

    if (Object.keys(keyMap).length <= 0) {
      ElMessage.info('请至少选中一个要导出的列数据');
      return;
    }

    if (state.form.fileType === 'xlsx') {
      data = data.map((v) => {
        return { ...v };
      });
      const formatterPropDatas = columnConfig.value.filter((v) => v.formatter);
      data.map((v) => {
        formatterPropDatas.forEach(({ prop, formatter }) => {
          v[prop] = formatter(v);
        });
        return v;
      });
      exportXlsx(fileName, data, keyMap);
    }
    if (state.form.fileType === 'csv') {
      console.log('开发中');
    }
    if (state.form.fileType === 'html') {
      console.log('开发中');
    }

    dialogVisible.value = false;
    ElMessage.success('导出成功');
  };

  watch(
    () => props.modelValue,
    () => {
      dialogVisible.value = props.modelValue;
    },
    { immediate: true }
  );

  watch(
    () => dialogVisible.value,
    (val) => {
      emit('update:modelValue', val);
    },
    { immediate: true }
  );

  const isShowSelect = ref(false);
  watch(
    () => columnConfig.value,
    (val) => {
      isShowSelect.value = !!val.find((v) => v.type === 'selection');
      let excludeColumn = exportConfig.value?.excludeColumn ? exportConfig.value.excludeColumn : [];
      state.columns = [...val]
        .filter((v) => v.prop && !excludeColumn.includes(v.prop))
        .map((v) => {
          if (!v.export) v.export = true;
          return v;
        });

      columnsCheckedChange();
    },
    { immediate: true }
  );
</script>
<style scoped lang="scss">
  .table-export {
    .table-export-select-field {
      width: 100%;
      height: 200px;
      border: 0.1px solid #e6e6e6;
      border-radius: 4px;
      padding-top: 30px;
      box-sizing: border-box;
      position: relative;
      .table-export-select-field_box {
        width: 100%;
        height: 170px;
        padding: 0px 10px 10px 15px;
        box-sizing: border-box;
        overflow-y: auto;
      }
      .table-export-select-field_item,
      .table-export-select-field_all {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        cursor: pointer;
        .el-checkbox {
          margin-right: 10px;
          padding-top: 2px;
          box-sizing: border-box;
        }
      }
      .table-export-select-field_all {
        width: 100%;
        position: absolute;
        top: 0;
        left: 0;
        z-index: 3000;
        background-color: #eee;
        padding: 0 10px;
        box-sizing: border-box;
      }
    }
  }
</style>
<style lang="scss">
  .table-export {
    .el-select--mini {
      width: 100%;
      line-height: 28px;
      .el-select .el-input__suffix {
        line-height: 34px;
      }
    }
    .el-dialog__body {
      padding: 20px 25px !important;
    }
  }
</style>
