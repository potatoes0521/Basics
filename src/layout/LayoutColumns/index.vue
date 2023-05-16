<!-- 分栏布局 -->
<template>
  <el-container class="layout">
    <div class="aside-split">
      <div class="logo flx-center">
        <Logo />
      </div>
      <el-scrollbar>
        <div class="split-list">
          <div
            v-for="item in menuList"
            :key="item.path"
            class="split-item"
            :class="{ 'split-active': splitActive === item.path || `/${splitActive.split('/')[1]}` === item.path }"
            @click="changeSubMenu(item)"
          >
            <i v-if="item.meta.icon" :class="handleMenuIcon(item)" class="menu-su-item"></i>
            <span class="menu-su-title">{{ item.meta.title }}</span>
          </div>
        </div>
      </el-scrollbar>
    </div>
    <el-aside :class="{ 'not-aside': !subMenu.length }" :style="{ width: '200px' }">
      <div class="logo flx-center">
        <div class="text-[#fff] text ml-[20px] h-full flex items-center text-[18px]">{{ navProjectName }}</div>
      </div>
      <el-scrollbar>
        <el-menu :default-active="activeMenu" :router="false" :collapse="false" :collapse-transition="false" :unique-opened="true">
          <SubMenu v-for="menu in subMenu" :key="menu.path" :menu="menu" :base-path="menu.path" />
        </el-menu>
      </el-scrollbar>
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
  import { ref, computed, watch } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import Main from '@/layout/components/Main/index.vue';
  import ToolBarLeft from '@/layout/components/Header/ToolBarLeft.vue';
  import ToolBarRight from '@/layout/components/Header/ToolBarRight.vue';
  import SubMenu from '@/layout/components/Menu/SubMenu.vue';
  import { useUserStore } from '@/stores/user';
  import { treeToList, findOnePathById } from '@/utils/treeTool';
  import { getConfig } from '@/config/index.js';

  const navProjectName = ref(getConfig('navProjectName'));

  const userStore = useUserStore();

  const route = useRoute();
  const router = useRouter();
  const activeMenu = computed(() => (route.meta.activeMenu ? route.meta.activeMenu : route.path));
  const menuList = computed(() => userStore.getMenuList);
  const flattenMenuList = computed(() => {
    return treeToList(menuList.value);
  });

  const subMenu = ref([]);
  const splitActive = ref('');
  watch(
    () => [menuList, route],
    () => {
      // 当前菜单没有数据直接 return
      if (!menuList.value.length) return;

      const currentItem = flattenMenuList.value.filter((item) => route.path === item.path || `/${route.path.split('/')[1]}` === item.path);
      const menuItem = menuList.value.filter((item) => item.menuId === currentItem.menuPid);
      console.log('menuItem', menuItem, activeMenu.value);
      if (menuItem[0]?.children?.length) {
        const activeMenuIndex = findOnePathById({
          tree: menuList.value,
          idNum: route.path,
          idKey: 'path'
        });
        [splitActive.value = ''] = activeMenuIndex;
        console.log('🚀 > file: index.vue:89 > activeMenuIndex:', activeMenuIndex);
        return (subMenu.value = menuItem[0]?.children);
      }
      console.log('当前菜单没有数据直接11111 return', route);
      subMenu.value = [];
    },
    {
      deep: true,
      immediate: true
    }
  );

  // 切换 SubMenu
  const changeSubMenu = (item) => {
    splitActive.value = item.path;
    if (item.children?.length) return (subMenu.value = item.children);
    subMenu.value = [];
    router.push(item.path);
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

  .menu-su-item {
    @apply text-center text-18px text-[#fff] w-auto inline-block;
  }

  .menu-su-title {
    @apply text-[#fff];
  }
</style>

<style lang="scss"></style>
