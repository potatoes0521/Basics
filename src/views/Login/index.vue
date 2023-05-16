<script setup>
  import useAutoLogin from './hooks/autoLogin';
  import LoginForm from './components/Form/index.vue';
  import Logo from '@/assets/img/login/logo.png';
  import backgroundImage from '@/assets/img/login/bg.png';

  const { loginFormRef, dateFormat } = useAutoLogin();
</script>
<template>
  <div class="w-100vw h-100vh flex flex-col justify-between items-center text-[#000]">
    <div class="h-100px w-[100%] flex justify-between items-center px-30px box-border">
      <div class="flex items-center">
        <img :src="Logo" class="w-34px h-34px" alt="" />
        <div class="text-24px font-semibold ml-20px">公路服务区管理平台</div>
        <!-- <div class="text-18px font-normal ml-15px pt-5px">基础业务平台</div> -->
      </div>
      <div class="text-14px font-normal">{{ dateFormat }}</div>
    </div>
    <div class="w-full h-full flex-1 flex bg-cover" :style="{ backgroundImage: `url('${backgroundImage}')` }">
      <div class="w-2/3 h-full grid grid-rows-2 grid-cols-2 gap-3 filter brightness-[70%]">
        <!-- <div class="overflow-hidden col-span-1 row-span-2">
          <div class="w-full h-full bg-image bg-image-1"></div>
        </div>
        <div class="overflow-hidden">
          <div class="w-full h-full bg-image bg-image-2"></div>
        </div>
        <div class="overflow-hidden">
          <div class="w-full h-full bg-image bg-image-3"></div>
        </div> -->
      </div>
      <div class="w-1/3 h-full flex flex-col justify-center items-center">
        <div class="login-form">
          <LoginForm ref="loginFormRef" />
        </div>
      </div>
    </div>
    <!-- <div class="h-100px w-[100%] flex flex-col justify-center items-center text-[rgba(0,0,0,.7)] font-normal text-14px">
      <p class="">ⓒ Copyright 交通运输部路网监测与应急处置中心</p>
      <p class="mt-8px">ICP备案编号： <el-link type="primary">京ICP备13012824号-6</el-link></p>
    </div> -->
  </div>
</template>
<style scoped lang="scss">
  .bg-image {
    transition: all 0.5s;
    background-size: cover;
    background-repeat: no-repeat;
    background-position: 50% 50%;
  }
  .bg-image:hover {
    transform: scale(1.1);
  }
  .bg-image-1 {
    background-image: url(../../assets/img/login/11.webp);
  }
  .bg-image-2 {
    background-image: url(../../assets/img/login/22.webp);
  }
  .bg-image-3 {
    background-image: url(../../assets/img/login/33.webp);
  }
  .login-form {
    border: 2px solid;
    border-image: linear-gradient(180deg, rgba(117, 206, 241, 0.79), rgba(117, 206, 241, 0.1)) 2 2;
    backdrop-filter: blur(0px);
    border-radius: 2px;
    padding: 100px 70px;
  }
</style>
