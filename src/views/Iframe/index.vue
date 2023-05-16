<template>
  <div class="iframe-wrapper">
    <iframe id="child" :src="url" width="100%" height="100%"></iframe>
  </div>
</template>
<script>
  export default {
    name: 'IframeComponents',
    components: {},
    computed: {
      url() {
        return `${this.$route.meta.uri}`;
      }
    }
  };
</script>
<style lang="scss" scoped>
  // @import "~@/assets/css/variables.scss";
  .iframe-wrapper {
    width: 100%;
    height: calc(100vh - 54px - 40px);
    iframe {
      // width: 100%;
      // height: calc(100vh - 54px - 40px);
      // height: calc(100vh - $navbarHeight - 68px);
    }
  }
</style>
