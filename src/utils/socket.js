/*
 * @LastEditors: liu yang
 * @Description: ...
 * @Date: 2022-09-24 15:37:14
 * @LastEditTime: 2022-11-30 18:08:32
 * @Author: liu yang
 */
import { useWebSocket } from '@vueuse/core';

export default function useWebSocketFn(url, option = {}) {
  const { status, data, send, open, close } = useWebSocket(url, {
    autoReconnect: {
      retries: 3,
      delay: 10000,
      onFailed() {
        console.log('重连3次失败');
      }
    },
    heartbeat: {
      message: JSON.stringify({ command: 'PING' }),
      interval: 6000,
      pongTimeout: 1000
    },
    immediate: false,
    ...option
  });

  return {
    status,
    data,
    send,
    open,
    close
  };
}
