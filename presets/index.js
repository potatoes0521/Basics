/*
 * @LastEditors: liu yang
 * @Description: Vite 插件配置
 * @Date: 2023-05-15 14:43:00
 * @LastEditTime: 2023-05-16 10:35:30
 * @Author: liu yang
 */
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';

// windicss
import WindiCSS from 'vite-plugin-windicss';
// 可视化打包分析
import { visualizer } from 'rollup-plugin-visualizer';
// 从 package.json 中扩展 Vite 配置
import PkgConfig from 'vite-plugin-package-config';
// mockjs插件
import { viteMockServe } from 'vite-plugin-mock';
// 组件自动引入
import AutoImport from 'unplugin-auto-import/vite';
// 组件自动引入
import Components from 'unplugin-vue-components/vite';
// ElementPlus、VueUse 组件自动引入解析起
import { ElementPlusResolver, VueUseComponentsResolver } from 'unplugin-vue-components/resolvers';
// icon 解析
import Icons from 'unplugin-icons/vite';
// icon 自动引入解析器
import IconsResolver from 'unplugin-icons/resolver';
// icon 加载 loader
import { FileSystemIconLoader } from 'unplugin-icons/loaders';

export default ({ mode }) => {
  console.log('🚀 > file: index.js:19 > command:', mode);
  return [
    vue(),
    vueJsx(),
    WindiCSS(),
    visualizer(),
    PkgConfig(),
    viteMockServe({
      supportTs: false,
      mockPath: 'mock',
      localEnabled: mode === 'dev'
    }),
    AutoImport({
      include: [
        /\.[tj]sx?$/, // .ts, .tsx, .js, .jsx
        /\.vue$/,
        /\.vue\?vue/, // .vue
        /\.md$/ // .md
      ],
      imports: ['vue', 'pinia', 'vue-router', '@vueuse/core'],
      // 生成相应的自动导入json文件。
      // eslint globals Docs - https://eslint.org/docs/user-guide/configuring/language-options#specifying-globals
      eslintrc: {
        enabled: true, // Default `false`
        filepath: './.eslintrc-auto-import.json', // Default `./.eslintrc-auto-import.json`
        globalsPropValue: true // Default `true`, (true | false | 'readonly' | 'readable' | 'writable' | 'writeable')
      },
      // 自动导入 Element Plus 相关函数，如：ElMessage, ElMessageBox... (带样式)
      resolvers: [ElementPlusResolver()],
      dts: true
    }),
    Components({
      // imports 指定组件所在位置，默认为 src/components
      dirs: ['src/components/', 'src/view/', 'src/layout/'],
      include: [/\.vue$/, /\.vue\?vue/, /\.md$/],
      resolvers: [
        IconsResolver({
          prefix: 'icon',
          // 集合别名
          alias: {
            vsci: 'vscode-icons'
          },
          customCollections: ['home']
        }),
        VueUseComponentsResolver(),
        ElementPlusResolver(),
        VueUseComponentsResolver()
      ]
    }),
    Icons({
      compiler: 'vue3',
      customCollections: {
        // home图标集，给svg文件设置fill="currentColor"属性，使图标的颜色具有适应性
        home: FileSystemIconLoader('src/assets/svg/home', (svg) => svg.replace(/^<svg /, '<svg fill="currentColor" '))
      },
      autoInstall: true
    })
  ];
};
