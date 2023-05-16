<template>
  <div class="x-table-component-wrapper">
    <div class="x-table-wrapper">
      <el-table
        v-bind="$attrs"
        ref="elTableRef"
        :data="tableData"
        highlight-current-row
        :row-key="rowKey"
        :tree-props="treeProps"
        default-expand-all
        @selection-change="handleSelectionChange"
      >
        <template v-if="selection">
          <el-table-column type="selection" width="70" fixed :reserve-selection="true" />
        </template>
        <slot name="frontColumn"></slot>
        <template v-if="!moreHeader">
          <el-table-column v-for="item in tableColumn" :key="item.id" :prop="item.prop" :show-overflow-tooltip="true" v-bind="item"></el-table-column>
        </template>
        <template v-else>
          <el-table-column v-for="item in tableColumn" :key="item.id" v-bind="item">
            <template v-if="item.children">
              <el-table-column v-for="ite in item.children" :key="ite.id" v-bind="ite"></el-table-column>
            </template>
          </el-table-column>
        </template>
        <slot name="actions"></slot>
        <template #empty>
          <div class="x-table-empty">
            <img
              class="x-table-empty-img"
              :src="`data:image/png;base64,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`"
            />
            <div class="x-table-empty-text">暂无数据</div>
          </div>
        </template>
      </el-table>
    </div>
    <div class="x-page-pagination-wrapper">
      <el-pagination
        v-model:currentPage="copyCurrentPage"
        hide-on-single-page
        :page-sizes="pageSizes"
        :page-size="pageSize"
        :layout="pageLayout"
        :total="totalNum"
        @size-change="onPageSizeChange"
        @current-change="onCurrentPageChange"
      />
    </div>
  </div>
</template>
<script>
  import { ElTable, ElPagination, ElTableColumn } from 'element-plus';

  export default {
    name: 'XTable',
    components: {
      ElTable,
      ElTableColumn,
      ElPagination
    },
    props: {
      tableData: {
        type: Array,
        required: true,
        default: () => []
      },
      tableColumn: {
        type: Array,
        required: true,
        default: () => []
      },
      totalNum: {
        type: Number,
        required: true,
        default: 0
      },
      currentPage: {
        type: Number,
        required: true,
        default: 1
      },
      selection: {
        type: Boolean,
        required: false,
        default: false
      },
      rowKey: {
        type: [Number, String],
        required: false,
        default: ''
      },
      treeProps: {
        type: Object,
        required: false,
        default: () => {}
      },
      pageSize: {
        type: Number,
        required: false,
        default: 10
      },
      pageSizes: {
        type: Array,
        required: false,
        default: () => []
      },
      moreHeader: {
        type: Boolean,
        required: false,
        default: false
      }
    },
    emits: ['onCurrentPageChange', 'onSelectionChange', 'onPageSizeChange', 'update:pageSize'],
    data() {
      return {
        copyCurrentPage: 1
      };
    },
    computed: {
      pageLayout() {
        return this.pageSizes.length > 0 ? 'total, sizes, prev, pager, next, jumper' : 'prev, pager, next';
      }
    },
    watch: {
      currentPage: {
        handler(n) {
          this.copyCurrentPage = n;
        },
        immediate: true
      }
    },
    methods: {
      onCurrentPageChange(params) {
        this.$emit('onCurrentPageChange', params);
      },
      handleSelectionChange(params) {
        this.$emit('onSelectionChange', params);
      },
      onPageSizeChange(params) {
        console.log('[ onPageSizeChange ] >');
        this.$emit('update:pageSize', params);
        this.$emit('onPageSizeChange', params);
      },
      toggleRowSelection(row, selected) {
        console.log('[ this.$refs.elTableRef ] >', this.$refs.elTableRef);
        this.$nextTick(() => {
          this.$refs.elTableRef.toggleRowSelection(row, selected);
        });
      },
      toggleAllSelection() {
        this.$nextTick(() => {
          this.$refs.elTableRef.toggleAllSelection();
        });
      },
      clearSelection() {
        this.$nextTick(() => {
          this.$refs.elTableRef.clearSelection();
        });
      }
    }
  };
</script>
