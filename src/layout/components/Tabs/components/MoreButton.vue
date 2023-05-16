<template>
  <div class="tabs-right">
    <div class="tabs-right-btn" @click="refresh">
      <icon-ep-refresh class="text-[var(--xx-text-color-primary)] text-12px" :class="{ 'animate-spin': isLoading }" />
    </div>
    <el-dropdown trigger="click" :teleported="false">
      <div class="tabs-right-btn">
        <icon-ep-arrow-down class="text-[var(--xx-text-color-primary)] text-12px" />
      </div>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item @click="closeCurrentTab">
            <el-icon><Remove /></el-icon>关闭当前
          </el-dropdown-item>
          <el-dropdown-item @click="closeOtherTab">
            <el-icon><CircleClose /></el-icon>关闭其他
          </el-dropdown-item>
          <el-dropdown-item @click="closeAllTab">
            <el-icon><FolderDelete /></el-icon>关闭所有
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>

<script setup>
  import { inject, nextTick } from 'vue';
  // import { HOME_URL } from '@/config/config';
  import { TabsStore } from '@/stores/tabs';
  import { useKeepAliveStore } from '@/stores/keepAlive';
  import { useRoute } from 'vue-router';

  const route = useRoute();
  const tabStore = TabsStore();
  const keepAliveStore = useKeepAliveStore();

  const refreshCurrentPage = inject('refresh');
  const isLoading = ref(false);
  // refresh current page
  const refresh = () => {
    isLoading.value = true;
    setTimeout(() => {
      keepAliveStore.removeKeepAliveName(route.name);
      refreshCurrentPage(false);
      nextTick(() => {
        keepAliveStore.addKeepAliveName(route.name);
        refreshCurrentPage(true);
        isLoading.value = false;
      });
    }, 0);
  };

  // Close Current
  const closeCurrentTab = () => {
    if (route.meta.isAffix) return;
    tabStore.removeTabs(route.fullPath);
    keepAliveStore.removeKeepAliveName(route.name);
  };

  // Close Other
  const closeOtherTab = () => {
    tabStore.closeMultipleTab(route.fullPath);
    keepAliveStore.setKeepAliveName([route.name]);
  };

  // Close All
  const closeAllTab = () => {
    tabStore.closeMultipleTab();
    keepAliveStore.setKeepAliveName();
    // router.push(HOME_URL);
  };
</script>

<style scoped lang="scss">
  .tabs-right {
    @apply w-85px h-full flex justify-end items-center;
    .tabs-right-btn {
      @apply cursor-pointer w-38px h-38px flex justify-center items-center border-l-w-1px border-[var(--xx-secondary-bg-color)] border-solid;
    }
  }
</style>
