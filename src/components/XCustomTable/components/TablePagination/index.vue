<template>
  <div
    class="x-table-pagination"
    :class="{
      'x-border': tableConfig.border,
      'x-border-top': tableConfig.loading
    }"
  >
    <el-pagination v-model:currentPage="pagination.currentPage" :page-size="pagination.pageSize" :total="pagination.total" v-bind="pagination"> </el-pagination>
  </div>
</template>

<script>
  import { defineComponent, reactive, inject, watch, toRefs } from 'vue';

  export default defineComponent({
    name: 'TablePagination',
    setup() {
      const paginationConfig = inject('paginationConfig');
      const tableConfig = inject('tableConfig');
      const state = reactive({
        pagination: {}
      });

      watch(
        () => paginationConfig.value,
        () => {
          state.pagination = {
            currentPage: 1,
            pageSize: 10,
            total: 0,
            pageSizes: [10, 15, 20, 30, 50, 100, 500, 1000],
            layout: 'total, sizes, prev, pager, next, jumper',
            ...paginationConfig.value
          };
        },
        {
          deep: true,
          immediate: true
        }
      );

      return {
        ...toRefs(state),
        tableConfig
      };
    }
  });
</script>
<style scoped lang="scss">
  .x-table-pagination {
    width: 100%;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding: 0 10px;
    // background-color: #f5f6fa;
    box-sizing: border-box;
  }
  .x-table-pagination.x-border {
    border: 0.1px solid #eee;
    border-top: none;
    box-sizing: border-box;
  }
  .x-table-pagination.x-border-top {
    border-top: 0.1px solid #eee;
    box-sizing: border-box;
  }
</style>
<style>
  .x-table-pagination .el-input--mini .el-input__inner {
    height: 28px !important;
    line-height: 28px !important;
  }
</style>
