<template>
  <div class="x-custom-table-control">
    <div class="x-custom-table-control-left">
      <slot name="controlLeft"></slot>
    </div>
    <div class="x-custom-table-control-right">
      <div class="x-control-right">
        <slot name="controlRight"></slot>
      </div>
      <el-tooltip v-if="tableExtend.search" effect="dark" content="搜索当前页表格" placement="top">
        <i class="x-custom-table-control-icon el-icon-search"></i>
      </el-tooltip>
      <el-tooltip v-if="tableExtend.print" effect="dark" content="打印" placement="top">
        <i class="x-custom-table-control-icon el-icon-printer" @click="tablePrint"></i>
      </el-tooltip>
      <el-tooltip v-if="tableExtend.import" effect="dark" content="导入" placement="top">
        <i class="x-custom-table-control-icon el-icon-upload2"></i>
      </el-tooltip>
      <el-tooltip v-if="tableExtend.export" effect="dark" content="导出" placement="top">
        <i class="x-custom-table-control-icon el-icon-download" @click="tableExport"></i>
      </el-tooltip>
      <el-tooltip v-if="tableExtend.density" effect="dark" content="密度" placement="top">
        <span class="x-custom-table-control-icon">
          <el-popover trigger="click" popper-class="x-custom-table-popover-class x-table-size">
            <TableDensitySize />
            <template #reference>
              <i class="el-icon-c-scale-to-original"></i>
            </template>
          </el-popover>
        </span>
      </el-tooltip>
      <el-tooltip v-if="tableExtend.refresh" effect="dark" content="刷新数据" placement="top">
        <i class="x-custom-table-control-icon el-icon-refresh-right" @click="$emit('refresh')"></i>
      </el-tooltip>
      <el-tooltip v-if="tableExtend.columnSetting" effect="dark" content="列设置" placement="top">
        <span class="x-custom-table-control-icon">
          <el-popover placement="bottom-end" trigger="click" popper-class="x-custom-table-popover-class x-column-setting">
            <TableColumnSetting />
            <template #reference>
              <i class="el-icon-setting"></i>
            </template>
          </el-popover>
        </span>
      </el-tooltip>
    </div>

    <TableExportDialog v-model="exportDialogShow" />
  </div>
</template>

<script>
  import { defineComponent, defineAsyncComponent, inject, ref } from 'vue';

  export default defineComponent({
    name: 'ControlContent',
    components: {
      TableColumnSetting: defineAsyncComponent(() => import('../TableColumnSetting/index.vue')),
      TableDensitySize: defineAsyncComponent(() => import('../TableDensitySize/index.vue')),
      TableExportDialog: defineAsyncComponent(() => import('../TableExportDialog/index.vue'))
    },
    emits: ['refresh'],
    setup() {
      const tableConfig = inject('tableConfig');
      const tableExtend = inject('tableExtend');
      const exportDialogShow = ref(false);

      // 文件导出
      const tableExport = () => {
        exportDialogShow.value = true;
      };

      const tablePrint = () => {
        console.log('打印，待开发...');
      };

      return {
        tableConfig,
        tableExtend,
        exportDialogShow,

        tableExport,
        tablePrint
      };
    }
  });
</script>
<style scoped lang="scss">
  .x-custom-table-control {
    width: 100%;
    height: 50px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #f5f6fa !important ;
    border-bottom: 1px solid #eee;
    padding: 0 15px;
    box-sizing: border-box;
    .x-custom-table-control-left {
      font-size: 15px;
      font-weight: 500;
    }
    .x-custom-table-control-right {
      font-size: 16px;
      display: flex;
      justify-content: flex-end;
      align-items: center;
      .x-control-right {
      }
      .x-custom-table-control-icon {
        margin-left: 16px;
        cursor: pointer;
        color: #333;
        font-size: 18px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
  }
</style>
<style>
  .x-custom-table-popover-class {
    padding: 0 !important;
  }
  .x-column-setting {
    width: auto !important;
  }
  .x-table-size {
    width: 90px !important;
    min-width: 90px !important;
  }
  .x-table-export-size {
    width: 450px !important;
  }
</style>
