<template>
  <div class="login-wrapper">
    <div class="left-panel">
      <div class="logo">
        <img class="logo-img" :src="logoImgSrc" />
      </div>
      <img class="panel-img" :src="loginImgSrc" />
    </div>
    <div class="right-form">
      <!-- <template v-if="showType === 'login'"> -->
      <div class="form-wrapper">
        <LoginForm ref="loginFormRef" />
      </div>
    </div>
  </div>
</template>
<script setup>
  import useAutoLogin from './hooks/autoLogin';
  import LoginForm from './components/Form/index.vue';
  import logoImg from '@/assets/img/login/logo.png';
  import loginImg from '@/assets/img/login/login.png';
  import { getConfig } from '@/config';

  const config = getConfig(['loginPageLogo', 'loginPageLogin']);
  const logoImgSrc = ref(config.loginPageLogo || logoImg);
  const loginImgSrc = ref(config.loginPageLogin || loginImg);

  const { loginFormRef } = useAutoLogin();
</script>
<style scoped lang="scss">
  .login-wrapper {
    // background: #fff;
    @apply w-100vw h-100vh flex justify-center items-center bg-light-50 flex-row relative;

    .left-panel {
      background: linear-gradient(136deg, var(--xx-navbar-bg-color-from) 0%, var(--xx-navbar-bg-color-to) 100%);
      @apply w-[56%] h-full px-19px box-border flex items-center justify-center flex-col;

      .logo {
        @apply w-710px h-24px absolute left-30px top-27px;

        > .logo-img {
          @apply h-full;
        }
      }

      .panel-img {
        @apply max-w-[87%] max-h-[80.7%] mt-11px;
      }
    }

    .right-form {
      @apply flex-1 flex items-center justify-center;

      .form-wrapper {
        @apply mb-[25%] box-border flex items-center flex-col;
      }
    }
  }
</style>
