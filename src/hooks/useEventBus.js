/*
 * @LastEditors: liu yang
 * @Description: ...
 * @Date: 2022-07-13 18:48:04
 * @LastEditTime: 2022-11-02 11:39:28
 * @Author: liu yang
 */
import mitt from 'mitt';

export default function useEventBus() {
  const eventBus = mitt();

  provide('eventBus', eventBus);

  return {
    eventBus
  };
}
