/*
 * @LastEditors: liu yang
 * @Description: 修改页面title
 * @Date: 2022-02-25 11:24:14
 * @LastEditTime: 2022-03-08 13:57:57
 * @Author: liu yang
 */
import { getConfig } from '@/config';

const title = getConfig('projectName') || '七石';

export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${pageTitle} - ${title}`;
  }
  return `${title}`;
}
