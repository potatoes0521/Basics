<template>
  <el-config-provider :locale="locale" :size="assemblySize">
    <router-view></router-view>
  </el-config-provider>
</template>

<script setup>
  import { computed } from 'vue';
  // import { useSystemStore } from '@/store/system'
  import { ElConfigProvider } from 'element-plus';
  import zhCn from 'element-plus/es/locale/lang/zh-cn';
  // import { useTheme } from '@/hooks/useTheme';

  // const { initTheme } = useTheme();
  // initTheme();

  // const globalStore = useSystemStore();

  const locale = computed(() => zhCn);

  // const assemblySize = computed(() => globalStore.assemblySize);
</script>

<style lang="scss">
  html,
  body,
  #app {
    width: 100%;
    height: 100%;
    padding: 0;
    margin: 0;

    .page-wrapper {
      height: 100%;
    }
  }
</style>
