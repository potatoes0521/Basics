<template>
  <div class="tabs-box">
    <div class="tabs-menu">
      <el-tabs v-model="tabsMenuValue" type="card" @tab-click="tabClick" @tab-remove="tabRemove">
        <el-tab-pane v-for="item in tabsMenuList" :key="item.fullPath" :label="item.title" :name="item.fullPath" :closable="item.close">
          <template #label> {{ item.title }}</template>
        </el-tab-pane>
      </el-tabs>
      <MoreButton />
    </div>
  </div>
</template>

<script setup>
  import Sortable from 'sortablejs';
  import { ref, computed, watch, onMounted } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import { TabsStore } from '@/store/tabs';
  import { useKeepAliveStore } from '@/store/keepAlive';
  import MoreButton from './components/MoreButton.vue';

  const route = useRoute();
  const router = useRouter();
  const tabStore = TabsStore();
  const keepAliveStore = useKeepAliveStore();

  const tabsMenuValue = ref(route.fullPath);
  const tabsMenuList = computed(() => {
    // 当最后一个tab的时候不显示关闭图标
    if (tabStore.tabsMenuList.length === 1) {
      // eslint-disable-next-line vue/no-side-effects-in-computed-properties
      tabStore.tabsMenuList[0].close = false;
    } else if (tabStore.tabsMenuList.length > 1) {
      tabStore.tabsMenuList.forEach((v) => (v.close = true));
    }
    return tabStore.tabsMenuList;
  });

  onMounted(() => {
    document.querySelector('.el-tabs__nav') && tabsDrop();
  });

  // 标签拖拽排序
  const tabsDrop = () => {
    Sortable.create(document.querySelector('.el-tabs__nav'), {
      draggable: '.el-tabs__item',
      animation: 300,
      onEnd({ newIndex, oldIndex }) {
        const tabsList = [...tabStore.tabsMenuList];
        const currRow = tabsList.splice(oldIndex, 1)[0];
        tabsList.splice(newIndex, 0, currRow);
        tabStore.setTabs(tabsList);
      }
    });
  };

  // 监听路由的变化（防止浏览器后退/前进不变化 tabsMenuValue）
  watch(
    () => route.fullPath,
    () => {
      if (route.meta.isFull) return;
      console.log(route, 'route.fullPath');
      tabsMenuValue.value = route.fullPath;
      const tabsParams = {
        icon: route.meta.icon,
        title: route.meta.title,
        path: route.path,
        fullPath: route.fullPath,
        name: route.name,
        close: !route.meta.isAffix
      };
      tabStore.addTabs(tabsParams);
      route.meta.keepAlive && keepAliveStore.addKeepAliveName(route.name);
    },
    {
      immediate: true
    }
  );

  // Tab Click
  const tabClick = (tabItem) => {
    const fullPath = tabItem.props.name;
    router.push(fullPath);
  };

  // Remove Tab
  const tabRemove = (fullPath) => {
    const rows = tabStore.tabsMenuList.find((item) => item.fullPath === fullPath);
    const name = rows?.name || '';
    const path = rows?.path || '';
    keepAliveStore.removeKeepAliveName(name);
    tabStore.removeTabs(path, fullPath === route.fullPath);
  };
</script>

<style scoped lang="scss">
  .tabs-box {
    background-color: #ffffff;
    :deep(.tabs-menu) {
      position: relative;
      width: 100%;
      display: flex;
      align-items: center;

      .el-tabs {
        flex: 1;
      }
      .tabs-icon {
        top: 2px;
        font-size: 15px;
      }
      .el-tabs__nav-wrap {
        position: absolute;
        width: calc(100%);
      }
      .el-tabs__nav-next,
      .el-tabs__nav-prev {
        line-height: 30px;
      }
      .el-tabs--card > .el-tabs__header {
        border: none;
        box-sizing: border-box;
        height: 38px;
        padding: 0 10px;
        margin: 0;
        display: flex;
        align-items: flex-end;
      }
      .el-tabs--card > .el-tabs__header .el-tabs__nav {
        border: none;
      }
      .el-tabs--card > .el-tabs__header .el-tabs__item {
        color: var(--el-text-color-regular);
        min-width: 90px;
        height: 30px;
        border: none;
        font-size: 12px;
        display: flex;
        padding-left: 0.5rem;
        align-items: center;
        padding-right: 0.5rem;
        justify-content: space-between;
        border-top-left-radius: 6px;
        border-top-right-radius: 6px;
        border-color: #f2f2f2;
        border-style: solid;
        border-width: 1px;
        box-sizing: border-box;
        transition: none;
        .is-icon-close {
          transition: none !important;
        }
        .is-icon-close:hover {
          background-color: transparent;
          color: var(--el-text-color-regular);
        }
      }
      .el-tabs--card > .el-tabs__header .el-tabs__item.is-active {
        color: #ffffff;
        @apply rounded-tl-[6px] rounded-tr-[6px];
        background-color: var(--el-color-primary);
        border-color: var(--el-color-primary);
        border-style: solid;
        border-width: 1px;
        .is-icon-close:hover {
          color: #fff;
        }
      }
      // .el-tabs__item .is-icon-close svg {
      //   margin-top: 0.5px;
      // }
    }
  }
</style>
