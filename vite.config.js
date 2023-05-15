/*
 * @LastEditors: liu yang
 * @Description: ...
 * @Date: 2023-05-15 14:21:20
 * @LastEditTime: 2023-05-15 17:07:35
 * @Author: liu yang
 */
import { fileURLToPath, URL } from 'node:url';

import { defineConfig, loadEnv } from 'vite';
import presets from './presets';

// https://vitejs.dev/config/
export default defineConfig((env) => {
  const viteEnv = loadEnv(env.mode, `./env`);
  console.log('🚀 > file: vite.config.js > line 19 > defineConfig >', env);
  console.log('🚀 > file: vite.config.js > line 19 > defineConfig > viteEnv', viteEnv);

  return {
    base: viteEnv.VITE_BASE,
    server: {
      host: '0.0.0.0',
      port: '5173',
      open: true,
      // cors: true,
      // 端口占用直接退出
      strictPort: true,
      proxy: {
        // https://cn.vitejs.dev/config/#server-proxy
        [viteEnv.VITE_BASE_URL]: {
          // 本地 8000 前端代码的接口 代理到 8888 的服务端口
          target: viteEnv.VITE_BASE_SERVER_URL,
          changeOrigin: true, // 允许跨域
          rewrite: (path) => path.replace(viteEnv.VITE_BASE_URL, '/')
        }
      }
    },
    build: {
      outDir: 'dist',
      assetsDir: 'static/assets',
      // sourcemap: true,
      // 消除打包大小超过500kb警告
      chunkSizeWarningLimit: 2000,
      // 不配置这个去除console不生效
      // minify: 'terser',
      // // 在生产环境移除console.log
      // terserOptions: {
      //   compress: {
      //     drop_console: true,
      //     drop_debugger: true
      //   }
      // },
      // 静态资源打包到dist下的不同目录
      rollupOptions: {
        output: {
          chunkFileNames: 'static/js/[name]-[hash].js',
          entryFileNames: 'static/js/[name]-[hash].js',
          assetFileNames: 'static/[ext]/[name]-[hash].[ext]'
        }
      }
    },
    plugins: [...presets(env)],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    }
  };
});
