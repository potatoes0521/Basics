<template>
  <!-- 无子级 -->
  <template v-if="!menu.children">
    <el-menu-item v-if="menu?.meta?.openInNewWindow" :index="menu.path" @click="handleClickMenuItem(menu)">
      <i v-if="menu.meta.icon" :class="handleMenuIcon(menu)" class="menu-item"></i>
      <template #title>
        <span class="title">{{ menu.meta.title }}</span>
      </template>
    </el-menu-item>
    <el-menu-item v-else :index="menu.path" @click="handleClickMenuItem(menu)">
      <i v-if="menu.meta.icon" :class="handleMenuIcon(menu)" class="menu-item"></i>
      <template #title>
        <span class="title">{{ menu.meta.title }}</span>
      </template>
    </el-menu-item>
  </template>
  <!-- 有子级 -->
  <el-sub-menu v-else :index="menu.path" popper-append-to-body>
    <template #title>
      <i :class="handleMenuIcon(menu)" class="menu-item"></i>
      <span class="title">{{ menu.meta.title }}</span>
    </template>
    <SubMenu v-for="child in menu.children" :key="child.path" :is-nest="true" :menu="child" />
  </el-sub-menu>
</template>
<script setup>
  import { getConfig } from '@/config';
  import { useRouter } from 'vue-router';

  const router = useRouter();

  defineProps({
    menu: {
      type: Object,
      required: true
    },
    isNest: {
      type: Boolean,
      default: false
    },
    basePath: {
      type: String,
      default: ''
    }
  });
  function handleMenuIcon(menu) {
    const { icon = '' } = menu.meta;
    if (icon.startsWith('el-icon')) {
      return icon;
    }
    if (icon.startsWith('@')) {
      return `iconfont ${icon.replace('@', '')}`;
    }
    return icon;
  }

  function handleClickMenuItem({ path, meta }) {
    if (meta?.openInNewWindow) {
      let url = meta.uri ? meta.uri : `${getConfig(meta.ssCode) + meta.menuHref}?oo=1`;
      window.open(url, '_blank');
    }
    router.push(path);
  }
</script>
<style scoped lang="scss">
  .menu-item {
    @apply text-center text-18px w-auto inline-block;
  }

  .title {
    @apply ml-5px;
  }
</style>
