/*
 * @LastEditors: liu yang
 * @Description: ...
 * @Date: 2022-04-24 18:56:29
 * @LastEditTime: 2023-05-16 10:09:19
 * @Author: liu yang
 */
// import { queryMyNotice, noticeCount, noticeRead, noticeAllRead, requestPushAgain } from '@/api/modules/cc/notice';
import { getConfig } from '@/config';
import { getCookie } from '@/utils/storage';
import useUserInfo from '@/hooks/userInfo';
import { getmsgs } from '@/api/modules/im';
import { ElMessage, ElNotification } from 'element-plus';

export function useNotify() {
  const messageList = ref([]);
  const ws = ref(null);
  const { userInfo } = useUserInfo();

  const unreadNum = ref(0);

  async function init() {
    if (!ws.value) {
      // ws 连接
      const {
        status,
        data,
        send,
        open,
        close,
        ws: websocket
      } = useWebSocket(getConfig('messageSocketURL'), {
        autoReconnect: {
          retries: 5,
          delay: 1000,
          onFailed() {
            ElMessage.error('连接已断开，重试5次后连接WebSocket失败，请刷新页面重试！');
          }
        },
        heartbeat: {
          message: JSON.stringify({ command: 'PING' }),
          interval: 3000,
          pongTimeout: 1500
        }
      });

      // 连接成功 去登录
      const acToken = getCookie('acToken', true);
      send(
        JSON.stringify({
          command: 'LOGIN',
          accessToken: acToken,
          type: 1
        })
      );

      ws.value = { status, data, send, open, close, websocket };

      watch(
        data,
        async (val) => {
          if (!val) return;
          const res = JSON.parse(val);

          switch (res.command) {
            case 'LOGIN_NOTIFY':
              // console.log('认证通知：', res.type == 2 ? '认证成功' : '认证失败', res);
              if (+res.type === 2) {
                // TODO
              } else {
                ElMessage.error('认证失败');
              }
              break;
            case 'PONG':
              // console.log('心跳回复通知：', res);
              break;
            case 'STATUSCHANGED_NOTIFY':
              // console.log('用户状态变更通知：', res);
              break;
            case 'SERVSTAT_NOTIFY':
              // console.log('坐席人数统计通知：', res);
              break;
            case 'LINECHANGED_NOTIFY':
              // console.log('转人工队列变动通知：', res);
              break;
            case 'CHATCHANGED_NOTIFY':
              // console.log('会话变动通知：', res);
              break;
            case 'SERVCFGCHANGE_NOTIFY':
              // console.log('业务配置变动通知：', res);
              break;
            case 'SENDMSG_NOTIFY':
              // console.log('发消息通知：', res);
              // 系统消息通知
              if (res.senderId === 'xt' && res.type === 7 && res.groupId === `xtxx${userInfo.value?.userId}`) {
                // console.log('系统消息', res);
                // ElNotification({
                //   title: '系统消息',
                //   message: res.msg,
                //   position: 'bottom-right'
                // });
                delayQueue(res);
                if (messageList.value.every((v) => v.msgId !== res.msgId)) {
                  res.unreadUsers = res?.unreadUsers || '';
                  messageList.value.unshift(res);
                  if (res.unreadUsers.indexOf(userInfo.value?.userId) !== -1) {
                    unreadNum.value++;
                  }
                }
              }
              break;
            case 'UPDATEMSG_NOTIFY':
              // console.log('更新消息通知：', res);
              break;
            case 'READMSG_NOTIFY':
              // console.log('读消息通知：', res);
              // 系统消息通知
              if (res.groupId === `xtxx${userInfo.value?.userId}` && res?.userId === userInfo.value?.userId && res?.direct === 2) {
                let obj = messageList.value.find((v) => v.msgId === res.msgId);
                messageList.value.map((v) => {
                  if (!obj || obj?.msgOdr < v?.msgOdr) {
                    if (v.unreadUsers.indexOf(userInfo.value?.userId) !== -1) {
                      v.unreadUsers = v.unreadUsers
                        .split(',')
                        .filter((j) => j !== userInfo.value?.userId)
                        .join();
                      unreadNum.value--;
                      if (unreadNum.value < 0) unreadNum.value = 0;
                    }
                  }
                });
              }
              break;
            case 'WRITEMSG_NOTIFY':
              // console.log('写消息通知：', res);
              break;
            case 'CANCELMSG_NOTIFY':
              // console.log('撤消息通知：', res);
              break;
            case 'CLOSE_NOTIFY':
              // console.log('断开通知：', res);
              ElMessage.error('连接已断开，请刷新页面重试');
              close();
              break;
            case 'UNKNOW':
              // console.log('未知通知：', res);
              break;
            default:
            // console.log('未解析', res);
          }
        },
        {
          immediate: true,
          flush: 'post'
        }
      );
    }
    return ws.value;
  }

  // 读消息
  async function readMessage({ command = 'READMSG', groupId = `xtxx${userInfo.value?.userId}`, msgId, direct }) {
    // console.log('读消息', groupId, msgId, direct);
    ws.value.send(
      JSON.stringify({
        command,
        groupId,
        msgId,
        direct
      })
    );
  }

  // 全部已读
  function readMessageAll() {
    readMessage({});
    unreadNum.value = 0;
    messageList.value.map((v) => {
      if (v.unreadUsers.indexOf(userInfo.value?.userId) !== -1) {
        v.unreadUsers = v.unreadUsers
          .split(',')
          .filter((j) => j !== userInfo.value?.userId)
          .join();
      }
    });
  }

  const queue = ref([]);
  function delayQueue(res) {
    queue.value.push(res);
    delayQueueThrottledFn();
  }
  const delayQueueThrottledFn = useThrottleFn(() => {
    if (queue.value.length > 5) {
      ElNotification({
        title: '系统消息',
        message: '您有多条未读消息，请及时查看!',
        position: 'bottom-right'
      });
    } else {
      queue.value.map((v) => {
        setTimeout(() => {
          ElNotification({
            title: '系统消息',
            message: v.msg,
            position: 'bottom-right'
          });
        }, 500);
      });
    }
    queue.value = [];
  }, 1500);

  const infiniteLoading = ref(false);
  const infiniteScrollDisabled = ref(false);
  const msgOdr = ref('');
  // 消息列表加载
  async function queryMyNoticeFn() {
    infiniteScrollDisabled.value = false;
    infiniteLoading.value = true;
    const res = await getmsgs({
      groupId: `xtxx${userInfo.value?.userId}`,
      msgOdr: msgOdr.value,
      direct: 1,
      pageSize: 6
    });
    infiniteLoading.value = false;
    if (res.data.msgs && res.data.msgs.length) {
      msgOdr.value = res.data.msgs[0].msgOdr;
      res.data.msgs.map((v) => {
        if (messageList.value.every((j) => j.msgId !== v.msgId)) messageList.value.push(v);
      });
      messageList.value.sort((a, b) => b.msgOdr - a.msgOdr);
      // console.log(messageList.value);
    } else {
      infiniteScrollDisabled.value = true;
    }

    if (messageList.value.length > 0) {
      readMessage({
        msgId: messageList.value[messageList.value.length - 1].msgId,
        direct: 2
      });
    }
  }

  const disabled = computed(() => {
    return infiniteLoading.value || infiniteScrollDisabled.value;
  });

  const showPopover = async () => {
    messageList.value = [];
    await queryMyNoticeFn();
  };
  const hidePopover = async () => {
    messageList.value = [];
  };

  onMounted(async () => {
    await init();
  });

  return {
    ws,
    messageList,
    userInfo,
    unreadNum,
    queryMyNoticeFn,
    infiniteLoading,
    infiniteScrollDisabled,
    disabled,
    showPopover,
    hidePopover,
    readMessageAll
  };
}
