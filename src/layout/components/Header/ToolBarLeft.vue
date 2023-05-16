<template>
  <div class="tool-bar-lf">
    <CollapseIcon v-if="!isColumns" id="collapseIcon" />
  </div>
</template>

<script setup>
  import { useSystemStore } from '@/stores/system';

  import CollapseIcon from './components/CollapseIcon.vue';

  const systemStore = useSystemStore();
  const isColumns = computed(() => systemStore.themeConfig.layout === 'columns');
</script>

<style scoped lang="scss">
  .tool-bar-lf {
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    white-space: nowrap;
  }
</style>
