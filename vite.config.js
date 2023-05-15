/*
 * @LastEditors: liu yang
 * @Description: ...
 * @Date: 2023-05-15 14:21:20
 * @LastEditTime: 2023-05-15 14:59:30
 * @Author: liu yang
 */
import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import presets from './presets'

// https://vitejs.dev/config/
export default defineConfig((env) => {
  console.log("🚀 > file: vite.config.js:15 > defineConfig > env:", env)
  return {
    plugins: [...presets(env)],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    }
  }
})
