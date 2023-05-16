<!-- 纵向布局 -->
<template>
  <el-container class="layout">
    <el-aside>
      <div class="menu" :style="{ width: isCollapse ? '65px' : '200px' }">
        <div class="logo flx-center">
          <Logo />
        </div>
        <el-scrollbar>
          <el-menu :default-active="activeMenu" :router="false" :collapse="isCollapse" :collapse-transition="false" :unique-opened="true">
            <SubMenu v-for="menu in menuList" :key="menu.path" :menu="menu" :base-path="menu.path" />
          </el-menu>
        </el-scrollbar>
      </div>
    </el-aside>
    <el-container>
      <el-header>
        <ToolBarLeft />
        <ToolBarRight />
      </el-header>
      <Main />
    </el-container>
  </el-container>
</template>

<script setup>
  import { computed } from 'vue';
  import { useRoute } from 'vue-router';
  import { useSystemStore } from '@/stores/system';
  import { useUserStore } from '@/stores/user';
  import Main from '@/layout/components/Main/index.vue';
  import ToolBarLeft from '@/layout/components/Header/ToolBarLeft.vue';
  import ToolBarRight from '@/layout/components/Header/ToolBarRight.vue';
  import SubMenu from '@/layout/components/Menu/SubMenu.vue';

  const userStore = useUserStore();

  const route = useRoute();
  const systemStore = useSystemStore();
  const activeMenu = computed(() => (route.meta.activeMenu ? route.meta.activeMenu : route.path));
  const menuList = computed(() => userStore.getMenuList);
  const isCollapse = computed(() => systemStore.themeConfig.isCollapse);
</script>

<style scoped lang="scss">
  @import './index.scss';
</style>
