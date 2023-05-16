<template>
  <div class="tool-bar-ri">
    <div class="header-icon">
      <!-- <AssemblySize id="assemblySize" />
      <SearchMenu id="searchMenu" />

      <Message id="message" />-->
      <ThemeSetting id="themeSetting" />
      <Fullscreen id="fullscreen" />
      <!-- <Notify></Notify> -->
    </div>
    <UserInfo />
  </div>
</template>

<script setup>
  // import SearchMenu from './components/SearchMenu.vue';
  import Fullscreen from './components/Fullscreen.vue';
  // import Message from './components/Message.vue';
  // import Language from './components/Language.vue';
  import ThemeSetting from './components/ThemeSetting.vue';
  // import AssemblySize from './components/AssemblySize.vue';
  import UserInfo from './components/UserInfo/index.vue';
  // import Notify from './components/Notify/index.vue';
</script>

<style scoped lang="scss">
  .tool-bar-ri {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    height: 100%;
    .header-icon {
      display: flex;
      align-items: center;
      & > * {
        margin-left: 21px;
      }
    }
    .username {
      margin: 0 20px;
      font-size: 15px;
    }
  }
</style>
