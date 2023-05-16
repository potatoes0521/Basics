<template>
  <div class="x-c-t-c_columnsetting">
    <div class="x-c-t-c_columnsetting-item">
      <div class="x-c-t-cs-item_left" @click.stop="columnSettingCheckAllChange(!columnSettingCheckAll)">
        <el-checkbox
          v-model="columnSettingCheckAll"
          :indeterminate="isIndeterminate"
          @click.stop="() => {}"
          @change="columnSettingCheckAllChange"
        ></el-checkbox>
        列设置
      </div>
      <div class="x-c-t-cs-item_title_right" @click="columnSettingsReset">重置</div>
    </div>
    <!-- 列数据 -->
    <div style="max-height: 400px; overflow-y: auto">
      <template v-for="item of columnType" :key="item.name">
        <div v-if="item.data.length" class="x-c-t-c_columnsetting-item-title">
          {{ item.name }}
        </div>
        <div
          v-for="ite of item.data"
          :key="ite.prop"
          class="x-c-t-c_columnsetting-item"
          :class="{ 'x-c-t-c_columnsetting-item-disabled': ite.disabled }"
          @click.stop="handleColumnCheck(ite)"
        >
          <div class="x-c-t-cs-item_left">
            <el-checkbox v-model="ite.show" :disabled="ite.disabled" @click.stop="() => {}" @change="handleColumnCheck(ite, true)"></el-checkbox>
            {{ ite.label }}
          </div>
          <div class="x-c-t-cs-item_right">
            <el-tooltip v-if="ite.fixed !== 'left'" effect="dark" content="固定在列首" placement="top">
              <i class="x-c-t-cs-item_right-icon el-icon-sort-up" @click.stop="fixedLeft(ite)"></i>
            </el-tooltip>
            <el-tooltip v-if="ite.fixed" effect="dark" content="不固定" placement="top">
              <i class="x-c-t-cs-item_right-icon el-icon-sort" @click.stop="notFixed(ite)"></i>
            </el-tooltip>
            <el-tooltip v-if="ite.fixed !== 'right'" effect="dark" content="固定在列尾" placement="top">
              <i class="x-c-t-cs-item_right-icon el-icon-sort-down" @click.stop="fixedRight(ite)"></i>
            </el-tooltip>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
  import { defineComponent, computed, watch, toRefs, inject, toRaw } from 'vue';

  export default defineComponent({
    name: 'TableColumnSetting',
    setup() {
      const columnConfig = inject('columnConfig');
      const tableState = inject('tableState');

      // 列设置复选框选中全部
      const columnSettingCheckAllChange = (val) => {
        tableState.columns
          .filter((v) => !v.disabled)
          .forEach((v) => {
            v.show = val;
            v.hidden = !v.show;
            return v;
          });
        tableState.columnSettingCheckAll = val;
        tableState.isIndeterminate = false;
      };

      // 列设置复选框选中
      const columnsCheckedChange = () => {
        const checkedCount = tableState.columns.filter((v) => !v.disabled).filter((v) => !v.hidden).length;

        tableState.columnSettingCheckAll = checkedCount === tableState.columns.filter((v) => !v.disabled).length;
        tableState.isIndeterminate = checkedCount > 0 && checkedCount < tableState.columns.filter((v) => !v.disabled).length;
      };

      // 列设置点击行选中
      const handleColumnCheck = (item, bool) => {
        console.log('%c [ item, bool ]-113', 'font-size:13px; background:pink; color:#bf2c9f;', toRaw(item), bool);
        if (item.disabled) return;
        tableState.columns.forEach((v) => {
          if ((item.prop && v.prop === item.prop) || (item.type && v.type && item.type === v.type)) {
            if (!bool) v.show = !v.show;
            v.hidden = !v.show;
          }
        });
        console.log(toRaw(tableState.columns));
        columnsCheckedChange();
      };

      // 列设置固定在列尾
      const fixedRight = (item) => {
        handlerFixed(item, 'right');
      };
      // 列设置不固定
      const notFixed = (item) => {
        handlerFixed(item, false);
      };
      // 列设置固定在列首
      const fixedLeft = (item) => {
        handlerFixed(item, 'left');
      };
      // 列设置固定方法
      const handlerFixed = (item, fixedType) => {
        tableState.columns.forEach((v) => {
          if ((item.prop && v.prop === item.prop) || (item.type && v.type && item.type === v.type)) {
            v.fixed = fixedType;
            v.hidden = false;
            v.show = true;
          }
        });
      };

      // 计算属性-列类型
      const columnType = computed(() => {
        return [
          {
            name: '固定在列首',
            data: tableState.columns.filter((v) => v.fixed === 'left') || []
          },
          {
            name: '不固定',
            data: tableState.columns.filter((v) => !v.fixed) || []
          },
          {
            name: '固定在列尾',
            data: tableState.columns.filter((v) => v.fixed === 'right') || []
          }
        ];
      });

      // 列设置重置
      const columnSettingsReset = () => {
        tableState.columns = JSON.parse(JSON.stringify(tableState.defaultColumns));
        columnsCheckedChange();
      };

      // 初始化方法
      const init = () => {
        let columns = JSON.parse(JSON.stringify(columnConfig.value)).map((v) => {
          v.show = !v.hidden;
          return v;
        });
        tableState.defaultColumns = JSON.parse(JSON.stringify(columns));
        // tableState.columns = JSON.parse(
        //   JSON.stringify(tableState.defaultColumns)
        // );
        columnsCheckedChange();
      };

      // 列数据赋值
      watch(
        () => columnConfig.value,
        () => {
          init();
        },
        {
          deep: true,
          immediate: true
        }
      );

      return {
        ...toRefs(tableState),
        // 计算属性
        columnType,
        // 方法
        fixedRight,
        notFixed,
        fixedLeft,
        handleColumnCheck,
        columnSettingsReset,
        columnsCheckedChange,
        columnSettingCheckAllChange
      };
    }
  });
</script>
<style scoped lang="scss">
  .x-c-t-c_columnsetting {
    font-size: 12px;
    .x-c-t-c_columnsetting-item-title {
      color: #888;
      font-size: 12px;
      padding: 0 10px;
      margin-top: 5px;
      box-sizing: border-box;
    }
    .x-c-t-c_columnsetting-item:first-child {
      padding: 2px 10px;
      border-bottom: 1px solid #eee;
      .x-c-t-cs-item_left {
        cursor: pointer;
        color: #000;
        font-weight: 500;
      }
      .x-c-t-cs-item_title_right {
        font-size: 12px;
        cursor: pointer;
      }
    }
    .x-c-t-c_columnsetting-item {
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 12px;
      box-sizing: border-box;
      .x-c-t-cs-item_left {
        height: 30px;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        color: #111;
        :deep(.el-checkbox) {
          line-height: 30px;
          margin-right: 5px;
        }
      }
      .x-c-t-cs-item_right {
        // width: 30px;
        visibility: hidden;
        margin-left: 10px;
        .x-c-t-cs-item_right-icon {
          margin-left: 5px;
        }
      }
    }
    .x-c-t-c_columnsetting-item:not(:first-child):hover {
      background-color: #e6f7ff;
      cursor: pointer;
      .x-c-t-cs-item_right {
        visibility: visible;
      }
    }
    .x-c-t-c_columnsetting-item-disabled {
      background-color: #eeefff;
    }
    .x-c-t-c_columnsetting-item-disabled:not(:first-child):hover {
      background-color: #eeefff;
      cursor: not-allowed;
      .x-c-t-cs-item_right {
        visibility: hidden;
      }
    }
  }
</style>
