/*
 * @LastEditors: liu yang
 * @Description: ...
 * @Date: 2021-11-26 15:51:37
 * @LastEditTime: 2022-04-11 15:39:48
 * @Author: liu yang
 */
import { ref } from 'vue';
import { getCaptcha } from '@/api/modules/sso';
import { createUniqueCode } from '@/utils/uniqueCode';
import { getConfig } from '@/config';

export default function useCaptcha(rules, form) {
  const captcha = [
    {
      required: true,
      message: '请输入验证码',
      trigger: 'blur'
    },
    {
      min: 4,
      max: 4,
      message: '验证码长度为4位',
      trigger: 'blur'
    }
  ];
  const showCaptcha = ref(false);
  const captchaURL = ref('');
  const config = getConfig(['serverUrl', 'baseUrl']);
  // console.log('🚀 > file: captcha.js > line 30 > useCaptcha > config', config);

  /**
   * 处理获取验证码
   * @return void
   */
  function handleCheckingCaptcha() {
    showCaptcha.value = true;
    rules.value.captcha = [...captcha];
    const fp = createUniqueCode();
    getCaptcha({
      username: form.value.username,
      fp
    }).then(({ data: { captchaUrl: url } }) => {
      const ENV = import.meta.env;
      captchaURL.value = `${config.serverUrl}${ENV.MODE === 'dev' ? '' : config.baseUrl}${url}?${+new Date()}`;
      console.log('[ state.captchaURL ] >', captchaURL.value);
    });
  }
  return {
    showCaptcha,
    captchaURL,
    handleCheckingCaptcha
  };
}
