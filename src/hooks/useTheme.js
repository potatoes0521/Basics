/*
 * @LastEditors: liu yang
 * @Description: ...
 * @Date: 2023-04-13 15:08:27
 * @LastEditTime: 2023-04-14 10:31:17
 * @Author: liu yang
 */
import { computed } from 'vue';
import { getLightColor, getDarkColor } from '@/utils/theme';
import { useSystemStore } from '@/stores/system';
import { getConfig } from '@/config';

import { ElMessage } from 'element-plus';

/**
 * @description 切换主题
 * */
export const useTheme = () => {
  const defaultColor = getConfig('DEFAULT_PRIMARY');

  const systemStore = useSystemStore();
  const themeConfig = computed(() => systemStore.themeConfig);

  // 切换暗黑模式
  const switchDark = () => {
    const body = document.documentElement;
    if (themeConfig.value.isDark) body.setAttribute('class', 'dark');
    else body.setAttribute('class', '');
    changePrimary(themeConfig.value.primary);
  };

  // 修改主题颜色
  const changePrimary = (val) => {
    if (!val) {
      val = defaultColor;
      ElMessage({ type: 'success', message: `主题颜色已重置` });
    }
    systemStore.setThemeConfig({ ...themeConfig.value, primary: val });
    // 为了兼容暗黑模式下主题颜色也正常，以下方法计算主题颜色 由深到浅 的具体颜色
    document.documentElement.style.setProperty('--el-color-primary', themeConfig.value.primary);
    document.documentElement.style.setProperty(
      '--el-color-primary-dark-2',
      themeConfig.value.isDark ? `${getLightColor(themeConfig.value.primary, 0.2)}` : `${getDarkColor(themeConfig.value.primary, 0.3)}`
    );
    // 颜色加深或变浅
    for (let i = 1; i <= 9; i++) {
      document.documentElement.style.setProperty(
        `--el-color-primary-light-${i}`,
        themeConfig.value.isDark ? `${getDarkColor(themeConfig.value.primary, i / 10)}` : `${getLightColor(themeConfig.value.primary, i / 10)}`
      );
    }
  };

  // 灰色和弱色切换
  const changeGreyOrWeak = (value, type) => {
    const { body } = document;
    if (!value) return body.setAttribute('style', '');
    if (type === 'grey') body.setAttribute('style', 'filter: grayscale(1)');
    if (type === 'weak') body.setAttribute('style', 'filter: invert(80%)');
    let propName = type === 'grey' ? 'isWeak' : 'isGrey';
    systemStore.setThemeConfig({ ...themeConfig.value, [propName]: false });
  };

  // 初始化 theme 配置
  const initTheme = () => {
    switchDark(systemStore.themeConfig.primary);
    if (themeConfig.value.isGrey) changeGreyOrWeak(true, 'grey');
    if (themeConfig.value.isWeak) changeGreyOrWeak(true, 'weak');
  };

  return {
    initTheme,
    switchDark,
    changePrimary,
    changeGreyOrWeak
  };
};
