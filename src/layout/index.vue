<!-- 💥 这里是一次性加载 LayoutComponents -->
<template>
  <component :is="LayoutComponents[themeConfig.layout]" />
  <ThemeDrawer />
</template>

<script setup>
  import { computed } from 'vue';
  import ThemeDrawer from './components/ThemeDrawer/index.vue';
  import LayoutVertical from './LayoutVertical/index.vue';
  import LayoutClassic from './LayoutClassic/index.vue';
  import LayoutTransverse from './LayoutTransverse/index.vue';
  import LayoutColumns from './LayoutColumns/index.vue';
  import { useSystemStore } from '@/store/system';

  const LayoutComponents = {
    vertical: LayoutVertical,
    classic: LayoutClassic,
    transverse: LayoutTransverse,
    columns: LayoutColumns
  };
  const systemStore = useSystemStore();

  const themeConfig = computed(() => systemStore.themeConfig);
</script>

<style scoped lang="scss">
  .layout {
    min-width: 760px;
  }
</style>

<style>
  :root {
    --el-menu-active-color: var(--el-color-primary);
    --el-menu-text-color: var(--xx-text-color-secondarys);
    --el-menu-hover-text-color: var(--el-color-primary);
    --el-menu-bg-color: var(--xx-sidebar-bg-color);
    --el-menu-hover-bg-color: var(--el-color-primary-dark-2);
    --el-menu-item-hover-fill: var(--el-color-primary-dark-2);
    --el-menu-border-color: var(--xx-sidebar-bg-color);
  }
</style>
