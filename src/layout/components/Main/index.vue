<template>
  <Maximize v-if="themeConfig.maximize" />
  <Tabs v-if="themeConfig.tabs" />
  <el-main>
    <router-view v-slot="{ Component, route }">
      <transition appear name="fade-transform" mode="out-in">
        <keep-alive :include="keepAliveStore.keepAliveName">
          <component :is="Component" v-if="isRouterShow" :key="route.fullPath" />
        </keep-alive>
      </transition>
    </router-view>
  </el-main>
</template>

<script setup>
  import { ref, computed, onBeforeUnmount, provide, watch } from 'vue';
  import { useDebounceFn } from '@vueuse/core';
  import { useSystemStore } from '@/store/system';
  import { useKeepAliveStore } from '@/store/keepAlive';
  import Maximize from './components/Maximize.vue';
  import Tabs from '@/layout/components/Tabs/index.vue';

  const systemStore = useSystemStore();
  const keepAliveStore = useKeepAliveStore();
  const themeConfig = computed(() => systemStore.themeConfig);
  const isCollapse = computed(() => systemStore.themeConfig.isCollapse);

  // 刷新当前页面
  const isRouterShow = ref(true);
  const refreshCurrentPage = (val) => (isRouterShow.value = val);
  provide('refresh', refreshCurrentPage);

  // 监听当前页是否最大化，动态添加 class
  watch(
    () => themeConfig.value.maximize,
    () => {
      const app = document.getElementById('app');
      if (themeConfig.value.maximize) app.classList.add('main-maximize');
      else app.classList.remove('main-maximize');
    },
    { immediate: true }
  );

  // 监听窗口大小变化，折叠侧边栏
  const screenWidth = ref(0);
  const listeningWindow = useDebounceFn(() => {
    screenWidth.value = document.body.clientWidth;
    if (!isCollapse.value && screenWidth.value < 1200) systemStore.setThemeConfig({ ...themeConfig.value, isCollapse: true });
    if (isCollapse.value && screenWidth.value > 1200) systemStore.setThemeConfig({ ...themeConfig.value, isCollapse: false });
  }, 100);
  window.addEventListener('resize', listeningWindow, false);
  onBeforeUnmount(() => {
    window.removeEventListener('resize', listeningWindow);
  });
</script>

<style scoped lang="scss">
  @import './index.scss';
</style>
