<!-- 横向布局 -->
<template>
  <el-container class="layout">
    <el-header>
      <div class="logo flx-center">
        <Logo />
      </div>
      <el-menu mode="horizontal" :default-active="activeMenu" :router="false" :unique-opened="true">
        <!-- 只有在这里写 submenu 才能触发 menu 三个点省略 -->
        <template v-for="subItem in menuList" :key="subItem.path">
          <el-sub-menu v-if="subItem.children?.length" :key="subItem.path + 'el-sub-menu'" :index="subItem.path">
            <template #title>
              <i v-if="subItem.meta.icon" :class="handleMenuIcon(subItem)" class="menu-su-item"></i>
              <span class="menu-su-title">{{ subItem.meta.title }}</span>
            </template>
            <SubMenu :key="subItem.path" :menu="subItem" :base-path="subItem.path" />
          </el-sub-menu>
          <el-menu-item v-else :key="subItem.path + 'el-menu-item'" :index="subItem.path" @click="handleClickMenu(subItem)">
            <template #title>
              <i :class="handleMenuIcon(subItem)" class="menu-su-item"></i>
              <span class="menu-su-title">{{ subItem.meta.title }}</span>
            </template>
          </el-menu-item>
        </template>
      </el-menu>
      <ToolBarRight />
    </el-header>
    <Main />
  </el-container>
</template>

<script setup>
  import { computed } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import Main from '@/layout/components/Main/index.vue';
  import ToolBarRight from '@/layout/components/Header/ToolBarRight.vue';
  import SubMenu from '@/layout/components/Menu/SubMenu.vue';
  import { useUserStore } from '@/stores/user';

  const userStore = useUserStore();

  const route = useRoute();
  const router = useRouter();
  const activeMenu = computed(() => (route.meta.activeMenu ? route.meta.activeMenu : route.path));
  const menuList = computed(() => userStore.getMenuList);

  const handleClickMenu = (subItem) => {
    if (subItem.meta.isLink) return window.open(subItem.meta.isLink, '_blank');
    router.push(subItem.path);
  };

  function handleMenuIcon(menu) {
    if (!menu) return;
    const { icon = '' } = menu.meta;
    if (icon.startsWith('el-icon')) {
      return icon;
    }
    if (icon.startsWith('@')) {
      return `iconfont ${icon.replace('@', '')}`;
    }
    return icon;
  }
</script>

<style scoped lang="scss">
  @import './index.scss';
</style>

<style lang="scss">
  .transverse {
    // 横向菜单布局
    .el-menu--horizontal {
      .el-menu-item,
      .el-sub-menu {
        height: 54px !important;
        .el-sub-menu__title {
          height: 100%;
        }
      }
      .el-sub-menu__hide-arrow {
        width: 54px !important;
      }
    }

    .menu-su-item {
      @apply text-center text-18px w-auto inline-block;
    }

    .menu-su-title {
      @apply ml-5px;
    }

    // guide
    #driver-highlighted-element-stage {
      background-color: #606266 !important;
    }
  }
</style>
