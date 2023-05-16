<template>
  <div class="fullscreen cursor-pointer text-[var(--xx-navbar-text-color)] text-[1.2rem]" @click="toggle">
    <icon-ic-round-fullscreen v-if="!isFullscreen" />
    <icon-ic-round-fullscreen-exit v-else />
  </div>
</template>

<script setup>
  import { useFullscreen } from '@vueuse/core';

  const { toggle, isFullscreen } = useFullscreen();
</script>
