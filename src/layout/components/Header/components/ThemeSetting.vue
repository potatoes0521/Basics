<template>
  <div class="theme-setting cursor-pointer text-[var(--xx-navbar-text-color)] text-[1.4rem]" @click="openDrawer">
    <IconNavZhuti />
  </div>
</template>

<script setup>
  import mittBus from '@/utils/mittBus';

  const openDrawer = () => {
    mittBus.emit('openThemeDrawer');
  };
</script>
