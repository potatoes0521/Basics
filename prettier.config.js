/*
 * @LastEditors: liu yang
 * @Description: prettier 配置文件
 * @Date: 2023-05-15 16:52:28
 * @LastEditTime: 2023-05-15 16:52:47
 * @Author: liu yang
 */

// https://prettier.io/docs/en/configuration.html
module.exports = {
  // 在ES5中有效的结尾逗号（对象，数组等）
  trailingComma: 'none',
  // 不使用缩进符，而使用空格
  useTabs: false,
  // tab 用两个空格代替
  tabWidth: 2,
  // 加不加分号
  semi: true,
  // 使用单引号
  singleQuote: true,
  jsxSingleQuote: true,
  // 在Vue文件中缩进脚本和样式标签。
  vueIndentScriptAndStyle: true,
  // 一行最多 100 字符
  printWidth: 160,
  // 对象的 key 仅在必要时用引号
  quoteProps: 'as-needed',
  // 大括号内的首尾需要空格
  bracketSpacing: true,
  // jsx 标签的反尖括号需要换行
  jsxBracketSameLine: false,
  // 箭头函数，只有一个参数的时候，也需要括号
  arrowParens: 'always',
  // 每个文件格式化的范围是文件的全部内容
  rangeStart: 0,
  rangeEnd: Infinity,
  // 不需要写文件开头的 @prettier
  requirePragma: false,
  // 不需要自动在文件开头插入 @prettier
  insertPragma: false,
  // 使用默认的折行标准
  proseWrap: 'preserve',
  // 根据显示样式决定 html 要不要折行
  htmlWhitespaceSensitivity: 'css',
  // 换行符使用 lf
  endOfLine: 'lf'
};
