/*
 * @LastEditors: liu yang
 * @Description: ...
 * @Date: 2021-11-24 15:35:37
 * @LastEditTime: 2023-04-17 17:51:45
 * @Author: liu yang
 */
import storage from '@/utils/storage';
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import { getConfig } from '@/config';
import { useUserStore } from '@/store/user';

export default function useUserInfo() {
  const route = useRoute();
  // const store = useStore();
  const userStore = useUserStore();

  const token = ref(storage.getCookie('acToken', true));
  const fp = ref(storage.getLocal('visitorId'));
  const uploadURL = ref(`${getConfig('baseUrl')}/block/ele/upload-file`);

  // 页面hash - 只匹配页面，不匹配用户信息
  const pageHash = ref(route.path.replace('/', ''));
  // 页面hash - 匹配用户信息
  const userPageHash = ref(`${route.path.replace('/', '')}_${userStore.userInfo?.workNo || storage.getSession('userInfo')?.workNo}`);
  const userInfo = ref(userStore.userInfo);

  return {
    token,
    fp,
    uploadURL,
    pageHash,
    userPageHash,
    userInfo
  };
}
