<template>
  <el-icon class="collapse-icon" @click="collapse">
    <IconEpExpand v-if="themeConfig.isCollapse" class="icon-menu text-[var(--xx-text-color-placeholder)] text-[1rem]" />
    <IconEpFold v-else class="icon-menu text-[var(--xx-text-color-placeholder)] text-[1rem]" />
  </el-icon>
</template>

<script setup>
  import { computed } from 'vue';
  import { useSystemStore } from '@/store/system';

  const systemStore = useSystemStore();
  const themeConfig = computed(() => systemStore.themeConfig);

  const collapse = () => {
    systemStore.setThemeConfig({ ...themeConfig.value, isCollapse: !themeConfig.value.isCollapse });
  };
</script>

<style scoped lang="scss">
  .collapse-icon {
    cursor: pointer;
  }
</style>
