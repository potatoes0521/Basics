/*
 * @LastEditors: isboyjc
 * @Description: 如果有rmT等于有 记住密码的ticket 直接登录
 * @Date: 2021-11-27 13:54:52
 * @LastEditTime: 2023-01-11 15:31:45
 * @Author: liu yang
 */
// import storage from '@/utils/storage'
// import { createUniqueCode } from '@/utils/uniqueCode'
import { getConfig } from '@/config';
import { useUserStore } from '@/store/user';
import { checkHeartBeat } from '@/utils/cas';
// import { ticketLogin } from '@/api/modules/sso'
import { getQueryObject } from '@/utils/url';

export default function useAutoLogin() {
  const loginFormRef = ref(null);
  const appCode = getConfig('appCode');
  const userStore = useUserStore();

  const dateFormat = useDateFormat(useNow(), 'YYYY年MM月DD日 HH:mm:ss');

  // 自动登录
  const autoLogin = async () => {
    // 先检查心跳   内部判断有无token
    const checkHeartBeatOK = await checkHeartBeat();
    // console.log('🚀 > file: autoLogin.js > line 20 > useAutoLogin > 自动登录', checkHeartBeatOK ? '自动登录成功' : '自动登录失败');
    if (checkHeartBeatOK) {
      const query = getQueryObject();
      if (query.ssCode && query.ssCode === appCode) {
        userStore.setUserInfo();
      }
    }
  };
  autoLogin();
  return {
    loginFormRef,
    dateFormat
  };
}
