/*
 * @LastEditors:
 * @Description: 时间快捷按钮
 * @Date: 2022-01-17 16:19:00
 * @LastEditTime: 2023-04-17 15:13:58
 * @Author: liu yang
 */
import { ref } from 'vue';
import dayjs from 'dayjs';

export default function useTime() {
  const quickTimerList = ref([
    {
      text: '今天',
      value: () => {
        const start = dayjs().startOf('day').toDate();
        const end = dayjs().endOf('day').toDate();

        return [start, end];
      }
    },
    {
      text: '昨天',
      value: () => {
        const end = dayjs().subtract(1, 'day').endOf('day').toDate();
        const start = dayjs().subtract(1, 'day').startOf('day').toDate();

        return [start, end];
      }
    },
    {
      text: '近三日',
      value: () => {
        const start = dayjs().subtract(3, 'day').startOf('day').toDate();
        const end = dayjs().endOf('day').toDate();

        return [start, end];
      }
    },
    {
      text: '近一周',
      value: () => {
        const start = dayjs().subtract(7, 'day').startOf('day').toDate();
        const end = dayjs().endOf('day').toDate();

        return [start, end];
      }
    },
    {
      text: '近一月',
      value: () => {
        const start = dayjs().subtract(30, 'day').startOf('day').toDate();
        const end = dayjs().endOf('day').toDate();

        return [start, end];
      }
    }
  ]);

  /** 禁选日期 */
  const disabledDate = (time) => {
    return time.getTime() > new Date().getTime();
  };
  return { quickTimerList, disabledDate };
}
