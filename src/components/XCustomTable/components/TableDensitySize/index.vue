<template>
  <div class="x-density-size">
    <div class="x-density-size-item" :class="{ 'x-active': config.size === 'small' }" @click="handleClick('small')">紧凑</div>
    <div class="x-density-size-item" :class="{ 'x-active': config.size === 'default' }" @click="handleClick('default')">默认</div>
    <div class="x-density-size-item" :class="{ 'x-active': config.size === 'large' }" @click="handleClick('large')">宽松</div>
  </div>
</template>

<script>
  import { defineComponent, toRefs, inject } from 'vue';

  export default defineComponent({
    name: 'TableDensitySize',
    setup() {
      const tableState = inject('tableState');

      const handleClick = (type) => {
        tableState.config.size = type;
      };

      const init = () => {
        // 保存表格基础数据
        // tableState.config = _cloneDeep(tableConfig.value);

        if (!['small', 'default', 'large'].includes(tableState.config.size)) {
          tableState.config.size = 'default';
        }
      };
      init();
      return {
        // 属性
        ...toRefs(tableState),
        // 方法
        handleClick
      };
    }
  });
</script>
<style scoped lang="scss">
  .x-density-size {
    width: 100%;
    padding: 4px 0;
    box-sizing: border-box;
    .x-density-size-item {
      padding: 5px 10px;
      font-size: 12px;
      box-sizing: border-box;
      cursor: pointer;
    }
    .x-density-size-item:hover {
      background-color: #f5f5f5;
    }
    .x-density-size-item.x-active {
      background-color: #e6f7ff;
      color: #1890ff;
    }
  }
</style>
