<template>
  <div class="form-title">欢迎登录</div>
  <el-form ref="formRef" :model="form" :rules="rules" class="chang-form-input login-form" @submit.prevent @keyup.enter="handleLogin('form')">
    <el-form-item prop="username">
      <el-input v-model.trim="form.username" size="large" placeholder="用户名" clearable></el-input>
      <!-- <el-input v-model.trim="form.username" size="large" placeholder="用户名" clearable :prefix-icon="User"></el-input> -->
    </el-form-item>
    <el-form-item prop="password">
      <el-input v-model.trim="form.password" size="large" show-password placeholder="密码" clearable type="password"></el-input>
      <!-- <el-input v-model.trim="form.password" size="large" show-password placeholder="密码" clearable :prefix-icon="Lock" type="password"></el-input> -->
    </el-form-item>
    <el-form-item v-if="showCaptcha" prop="captcha">
      <div class="flex">
        <el-input v-model.trim="form.captcha" size="large" class="captcha-input" placeholder="验证码" clearable />
        <div class="captcha" @click="handleCheckingCaptcha">
          <img class="h-full w-full overflow-hidden" :src="captchaURL" alt="点击重试" />
        </div>
      </div>
    </el-form-item>
    <el-form-item>
      <!-- <el-checkbox v-model="form.rememberMe">记住密码</el-checkbox> -->
      <el-button class="button" size="large" :loading="loading" type="primary" @click="handleLogin('form')"> 登录 </el-button>
    </el-form-item>
  </el-form>
</template>
<script setup>
  import useCaptcha from './hooks/captcha';
  import { createUniqueCode } from '@/utils/uniqueCode';
  import { formValidateIsCodeNumberLine } from '@/utils/patter';
  import { login } from '@/api/modules/sso';
  import { setCookie } from '@/utils/storage';
  import { useUserStore } from '@/stores/user';
  import { desEncrypt } from '@/utils/jsencrypt';
  import { ElMessage } from 'element-plus';

  const formRef = ref(null);

  const form = ref({
    username: '',
    password: '',
    rememberMe: false,
    captcha: ''
  });

  const rules = ref({
    username: [
      {
        required: true,
        message: '请输入用户名',
        trigger: 'blur'
      },
      {
        validator: formValidateIsCodeNumberLine,
        trigger: 'blur'
      }
    ],
    password: [
      {
        required: true,
        message: '请输入密码',
        trigger: 'blur'
      }
    ],
    captcha: []
  });

  const loading = ref(false);

  const { handleCheckingCaptcha, showCaptcha, captchaURL } = useCaptcha(rules, form);

  /**
   * 处理登录
   * @return void
   */
  function handleLogin() {
    formRef.value.validate(async (valid) => {
      if (valid) {
        loading.value = true;
        let sendData = { ...form.value };
        sendData.password = (await desEncrypt(sendData.password)) || '';
        sendData.fp = createUniqueCode();
        sendData.captcha = sendData.captcha.toUpperCase();
        login(sendData)
          .then(({ data }) => {
            handleLoginOver(data);
          })
          .catch((err) => {
            loading.value = false;
            form.value.captcha = '';
            const { message } = err;
            if (message.code === '9005') {
              // if (message.msg !== '请输入图形验证码') {
              //   ElMessage.error(message.msg);
              // }
              handleCheckingCaptcha();
            } else if (message.code === '4000' && showCaptcha.value) {
              handleCheckingCaptcha();
            }
          });
      } else {
        if (!form.value.username) {
          ElMessage.error('请输入用户名');
          return false;
        }
        if (!form.value.password) {
          ElMessage.error('请输入有效密码');
          return false;
        }
      }
    });

    const useStore = useUserStore();
    /**
     * 处理登录完成
     * @param {String} accessToken token
     * @param {String} rememberMeTicket 记住密码的ticket
     * @return void
     */
    async function handleLoginOver({ accessToken }) {
      setCookie({ name: 'acToken', value: accessToken, aes: true });
      useStore.setUserInfo();
    }
  }
</script>
<style scoped lang="scss">
  .form-title {
    @apply font-600 text-[#fff] text-40px leading-56px text-center;
  }

  .login-form {
    @apply mt-36px w-307px;

    .flex {
      @apply flex items-center justify-center;

      .captcha-input {
        @apply flex;
      }
    }
    .captcha {
      @apply cursor-pointer rounded-4px h-39px ml-10px w-110px;
    }

    .button {
      @apply mt-10px w-full;
    }
  }
</style>
